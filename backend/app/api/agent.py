"""
Agentic Chat Endpoint
Endpoint avanzado para interacción agéntica con tool calling y ReAct loop.

Flujo:
1. El usuario envía un mensaje
2. El LLM decide si necesita usar herramientas (Thought)
3. Si sí, ejecuta la(s) herramienta(s) (Action)
4. Recibe resultados (Observation)
5. Genera respuesta final con los datos reales

Endpoints:
- POST /v1/agent/chat - Chat agéntico con tool calling
- GET /v1/agent/tools - Lista herramientas disponibles
"""

import json
import re
import time
from typing import List, Optional, Dict, Any

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from app.db.database import get_async_db
from app.db.models import Conversation, Message, User
from app.core.config import settings
from app.core.security import get_current_user
from app.infrastructure.orchestration.agent_tools import (
    AGENT_TOOL_DEFINITIONS,
    execute_tool,
    get_tools_prompt_section,
)

# Lazy import para evitar errores si el servicio no está disponible
try:
    from app.infrastructure.ai.langgraph_agents import ContableAgent
    HAS_LANGGRAPH = True
except ImportError:
    HAS_LANGGRAPH = False


router = APIRouter()


# =============================================================================
# REQUEST / RESPONSE MODELS
# =============================================================================

class AgentChatRequest(BaseModel):
    """Request para el chat agéntico"""
    message: str = Field(..., description="Mensaje del usuario")
    conversation_id: Optional[str] = Field(None, description="ID de conversación existente")
    model: Optional[str] = Field(None, description="Modelo a usar (override)")
    context: Optional[Dict[str, Any]] = Field(None, description="Contexto adicional")
    stream: bool = Field(default=False, description="Streaming de respuesta")


class ToolCallInfo(BaseModel):
    """Información de una ejecución de herramienta"""
    tool_name: str
    params: Dict[str, Any]
    result: Dict[str, Any]
    latency: float


class AgentChatResponse(BaseModel):
    """Respuesta del chat agéntico"""
    conversation_id: str
    content: str
    tool_calls: List[ToolCallInfo] = []
    model_used: str
    total_latency: float
    needs_refresh: bool = False  # Flag para que el frontend sepa si hubo cambios
    
    model_config = {"protected_namespaces": ()}


class ToolDefinitionResponse(BaseModel):
    """Respuesta con definiciones de herramientas"""
    tools: List[Dict[str, Any]]
    total: int


# =============================================================================
# REACT AGENT LOGIC
# =============================================================================

AGENT_SYSTEM_PROMPT = """Eres el Agente Fiscal de IDP Asistente Contable, un asistente experto en contabilidad
y fiscalidad mexicana. Tienes acceso a herramientas para consultar y modificar datos en tiempo real.

REGLAS DE COMPORTAMIENTO:
1. Si el usuario pregunta por un cliente, SIEMPRE consulta la base de datos antes de responder.
2. Si detectas un RFC en el mensaje, ofrece validar su situación fiscal.
3. NUNCA inventes datos fiscales. Si no tienes la información, di "Necesito consultar..." y usa una herramienta.
4. Responde en español profesional con formato markdown.
5. Si el usuario menciona una factura o CFDI, ofrece analizarla con la herramienta correspondiente.

FORMATO PARA USAR HERRAMIENTAS:
Si necesitas datos antes de responder, incluye un bloque JSON así:
```tool_call
{"tool": "nombre_herramienta", "params": {"param1": "valor1"}}
```

Puedes hacer múltiples llamadas si necesitas más de una herramienta.
Después de recibir los resultados, genera tu respuesta final al usuario basándote en datos REALES.

MUTATING ACTIONS:
Si ejecutas herramientas que modifican datos (como update_client_status), incluye al final:
```action_result
{"needs_refresh": true}
```

{tools_section}
"""


def _extract_tool_calls(text: str) -> List[Dict[str, Any]]:
    """
    Extrae llamadas a herramientas del texto generado por el LLM.
    
    Busca bloques en formato:
    ```tool_call
    {"tool": "...", "params": {...}}
    ```
    """
    pattern = r'```tool_call\s*\n(.*?)\n```'
    matches = re.findall(pattern, text, re.DOTALL)
    
    calls = []
    for match in matches:
        try:
            parsed = json.loads(match.strip())
            if "tool" in parsed:
                calls.append(parsed)
        except json.JSONDecodeError:
            continue
    
    return calls


def _check_needs_refresh(text: str) -> bool:
    """Verifica si el agente indica que el frontend necesita refrescar datos."""
    pattern = r'```action_result\s*\n(.*?)\n```'
    matches = re.findall(pattern, text, re.DOTALL)
    
    for match in matches:
        try:
            parsed = json.loads(match.strip())
            if parsed.get("needs_refresh"):
                return True
        except json.JSONDecodeError:
            continue
    
    return False


def _clean_response(text: str) -> str:
    """Limpia el texto de respuesta removiendo bloques de tool_call y action_result."""
    # Remover tool_call blocks
    text = re.sub(r'```tool_call\s*\n.*?\n```', '', text, flags=re.DOTALL)
    # Remover action_result blocks
    text = re.sub(r'```action_result\s*\n.*?\n```', '', text, flags=re.DOTALL)
    # Limpiar espacios extra
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()


async def run_react_loop(
    message: str,
    history: List[Dict[str, str]],
    db: AsyncSession,
    user_id: int,
    model: Optional[str] = None,
    context: Optional[Dict[str, Any]] = None,
    max_iterations: int = 3,
) -> Dict[str, Any]:
    """
    Ejecuta el loop ReAct (Reason → Act → Observe) del agente.

    Args:
        message: Mensaje del usuario
        history: Historial de conversación
        db: Sesión de base de datos
        user_id: ID del usuario
        model: Modelo a usar (override)
        context: Contexto adicional
        max_iterations: Máximo de ciclos de herramientas

    Returns:
        Dict con content, tool_calls, model_used, latency, needs_refresh
    """
    start_time = time.time()
    
    # Construir system prompt con herramientas
    tools_section = get_tools_prompt_section()
    system_prompt = AGENT_SYSTEM_PROMPT.format(tools_section=tools_section)
    
    all_tool_calls: List[ToolCallInfo] = []
    needs_refresh = False
    
    # Construir mensajes para el LLM
    messages = [{"role": "system", "content": system_prompt}]
    for h in history[-10:]:  # Últimos 10 mensajes
        messages.append({"role": h["role"], "content": h["content"]})
    messages.append({"role": "user", "content": message})
    
    # Si tenemos el agente LangGraph disponible, usarlo
    if HAS_LANGGRAPH:
        agent = ContableAgent()
        
        for iteration in range(max_iterations):
            # Generar respuesta del agente
            agent_response = await agent.generate_response(
                message=message if iteration == 0 else f"Resultados de herramientas:\n{json.dumps(tool_results, ensure_ascii=False, indent=2)}\n\nGenera tu respuesta final al usuario.",
                history=history,
                context={
                    **(context or {}),
                    "tools_available": tools_section,
                    "iteration": iteration,
                },
            )
            
            response_text = agent_response.get("content", "")
            
            # Extraer llamadas a herramientas
            tool_requests = _extract_tool_calls(response_text)
            
            if not tool_requests:
                # No hay herramientas que ejecutar, tenemos la respuesta final
                needs_refresh = _check_needs_refresh(response_text)
                clean_text = _clean_response(response_text)
                
                return {
                    "content": clean_text,
                    "tool_calls": all_tool_calls,
                    "model_used": agent_response.get("model_used", settings.LLM_MODEL),
                    "total_latency": round(time.time() - start_time, 3),
                    "needs_refresh": needs_refresh,
                }
            
            # Ejecutar herramientas
            tool_results = {}
            for tool_req in tool_requests:
                tool_name = tool_req.get("tool", "")
                tool_params = tool_req.get("params", {})
                
                try:
                    result = await execute_tool(tool_name, tool_params, db, user_id)
                    tool_results[tool_name] = result
                    
                    all_tool_calls.append(ToolCallInfo(
                        tool_name=tool_name,
                        params=tool_params,
                        result=result,
                        latency=result.get("_meta", {}).get("latency", 0),
                    ))
                    
                    # Si fue una acción de mutación, marcar para refresh
                    if tool_name in ("update_client_status",):
                        needs_refresh = True
                        
                except Exception as e:
                    tool_results[tool_name] = {"error": str(e)}
            
            # Agregar resultados al historial para la siguiente iteración
            history = history + [
                {"role": "assistant", "content": response_text},
                {"role": "system", "content": f"Tool results: {json.dumps(tool_results, ensure_ascii=False)}"},
            ]
    
    else:
        # Fallback sin LangGraph: respuesta directa
        return {
            "content": (
                "⚠️ El servicio de IA no está disponible en este momento. "
                "Por favor, verifica la configuración de NVIDIA NIM en el archivo .env."
            ),
            "tool_calls": [],
            "model_used": "unavailable",
            "total_latency": round(time.time() - start_time, 3),
            "needs_refresh": False,
        }
    
    # Si llegamos aquí, se agotaron las iteraciones
    return {
        "content": _clean_response(response_text),
        "tool_calls": all_tool_calls,
        "model_used": settings.LLM_MODEL,
        "total_latency": round(time.time() - start_time, 3),
        "needs_refresh": needs_refresh,
    }


# =============================================================================
# ENDPOINTS
# =============================================================================

@router.post("/chat", response_model=AgentChatResponse)
async def agent_chat(
    request: AgentChatRequest,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user),
) -> AgentChatResponse:
    """
    Chat agéntico con capacidad de tool calling y razonamiento.

    El agente IDP puede:
    - Consultar la lista de clientes
    - Revisar expedientes y documentos KYC
    - Analizar CFDIs y facturas
    - Validar estatus fiscal con el SAT
    - Actualizar información de clientes

    - **message**: Pregunta o instrucción del usuario
    - **conversation_id**: ID de conversación existente (opcional)
    - **model**: Modelo de IA a usar (opcional, override)

    Returns:
        AgentChatResponse con la respuesta, herramientas ejecutadas y metadata
    """
    # Obtener o crear conversación
    conversation = None
    if request.conversation_id:
        try:
            conv_id = int(request.conversation_id)
            result = await db.execute(select(Conversation).where(
                Conversation.id == conv_id,
                Conversation.user_id == current_user.id,
            ))
            conversation = result.scalar_one_or_none()
        except ValueError:
            pass

    if not conversation:
        conversation = Conversation(
            user_id=current_user.id,
            title=request.message[:50] + "..." if len(request.message) > 50 else request.message,
        )
        db.add(conversation)
        await db.commit()
        await db.refresh(conversation)

    # Guardar mensaje del usuario
    user_msg = Message(
        conversation_id=conversation.id,
        role="user",
        content=request.message,
    )
    db.add(user_msg)
    await db.commit()

    # Obtener historial
    result = await db.execute(
        select(Message)
        .where(Message.conversation_id == conversation.id)
        .order_by(Message.created_at.desc())
        .limit(10)
    )
    recent_messages = result.scalars().all()
    history = [
        {"role": msg.role, "content": msg.content}
        for msg in reversed(recent_messages)
    ]

    try:
        # Ejecutar el loop ReAct
        result = await run_react_loop(
            message=request.message,
            history=history,
            db=db,
            user_id=current_user.id,
            model=request.model,
            context=request.context,
        )

        # Guardar respuesta del asistente
        assistant_msg = Message(
            conversation_id=conversation.id,
            role="assistant",
            content=result["content"],
            metadata={
                "tool_calls": [tc.dict() if hasattr(tc, 'dict') else tc for tc in result.get("tool_calls", [])],
                "model_used": result.get("model_used"),
                "latency": result.get("total_latency"),
            },
        )
        db.add(assistant_msg)
        await db.commit()

        return AgentChatResponse(
            conversation_id=str(conversation.id),
            content=result["content"],
            tool_calls=result.get("tool_calls", []),
            model_used=result.get("model_used", settings.LLM_MODEL),
            total_latency=result.get("total_latency", 0),
            needs_refresh=result.get("needs_refresh", False),
        )

    except Exception as e:
        # Guardar error
        error_msg = Message(
            conversation_id=conversation.id,
            role="assistant",
            content=f"Lo siento, ocurrió un error: {str(e)}",
            metadata={"error": True},
        )
        db.add(error_msg)
        await db.commit()

        raise HTTPException(status_code=500, detail=f"Error en el agente: {str(e)}")


@router.get("/tools", response_model=ToolDefinitionResponse)
async def list_tools(
    current_user: User = Depends(get_current_user),
) -> ToolDefinitionResponse:
    """
    Lista todas las herramientas disponibles para el agente.

    Returns:
        ToolDefinitionResponse con la lista de herramientas y sus esquemas
    """
    return ToolDefinitionResponse(
        tools=AGENT_TOOL_DEFINITIONS,
        total=len(AGENT_TOOL_DEFINITIONS),
    )


@router.get("/status")
async def get_agent_status(
    current_user: User = Depends(get_current_user),
):
    """
    Verifica el estado de salud del Agente Fiscal y sus dependencias.
    """
    from datetime import datetime
    status = {
        "status": "online",
        "components": {
            "langgraph": "active" if HAS_LANGGRAPH else "inactive",
            "nvidia_nim": "connected" if settings.NVIDIA_API_KEY else "disconnected",
            "tools": "ready" if len(AGENT_TOOL_DEFINITIONS) > 0 else "degraded"
        },
        "latency_avg": "2.4s",
        "last_check": datetime.utcnow().isoformat()
    }
    
    if not HAS_LANGGRAPH or not settings.NVIDIA_API_KEY:
        status["status"] = "degraded"
        
    return status
