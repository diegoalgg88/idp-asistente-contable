"""
LangGraph Agents Service
Servicio para definición y ejecución de agentes con LangGraph para el asistente contable.

Agentes disponibles:
- ContableAgent: Agente principal para consultas contables y fiscales
- ClasificadorAgent: Clasificación de intenciones
- RAGAgent: Recuperación de información documental
- ReasoningAgent: Razonamiento contable y cálculos

Arquitectura:
- LangGraph para orquestación de flujos
- NVIDIA NIM (Llama 3.3 70B) para generación
- ChromaDB/pgvector para memoria vectorial
- Reranking para precisión en búsqueda
"""

from typing import TypedDict, Annotated, List, Optional, Dict, Any, Generator, AsyncGenerator, cast
import json
import time

from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, ToolMessage
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages

from app.infrastructure.ai.nvidia_nim import get_extraction_service
from app.infrastructure.ai.rag_service import get_rag_service
from app.core.config import settings


# =============================================================================
# STATE DEFINITIONS
# =============================================================================

class AgentState(TypedDict):
    """State for agent workflow"""
    messages: Annotated[List[BaseMessage], add_messages]
    context: Optional[Dict[str, Any]]
    current_step: str
    metadata: Optional[Dict[str, Any]]


class ContableAgentState(TypedDict):
    """State specific for contable agent"""
    messages: Annotated[List[BaseMessage], add_messages]
    user_message: str
    conversation_history: List[Dict[str, str]]
    context: Optional[Dict[str, Any]]
    response: Any # Can be str or dict with tool_calls
    sources: List[str]
    confidence: float
    model_used: str
    latency: float
    iterations: int


# =============================================================================
# CONTABLE AGENT
# =============================================================================

class ContableAgent:
    """
    Agente contable principal para consultas fiscales y contables.
    
    Este agente utiliza LangGraph para orquestar múltiples sub-agentes:
    1. Clasificador de intenciones
    2. Recuperador documental (RAG)
    3. Razonador contable
    4. Generador de respuestas
    
    Features:
    - Streaming de respuestas token-por-token
    - RAG con legislación fiscal mexicana
    - Validación de información con fuentes
    - Scores de confianza
    """

    def __init__(self, user_id: Optional[int] = None):
        """Inicializa el agente contable
        
        Args:
            user_id: ID del usuario para retrieval RAG (opcional)
        """
        self.nvidia_service = get_extraction_service()
        self.rag_service = get_rag_service()
        self.user_id = user_id
        self.graph = self._build_graph()

    def _build_graph(self) -> StateGraph:
        """Construye el grafo de LangGraph para el agente"""
        
        workflow = StateGraph(ContableAgentState)

        # Definir nodos
        workflow.add_node("classifier", self._classify_intent)
        workflow.add_node("retriever", self._retrieve_context)
        workflow.add_node("reasoner", self._reason_with_context)
        workflow.add_node("executor", self._execute_agent_tools)
        workflow.add_node("responder", self._generate_response)

        # Definir punto de entrada
        workflow.set_entry_point("classifier")

        # Edges condicionales basados en clasificación
        workflow.add_conditional_edges(
            "classifier",
            self._route_by_intent,
            {
                "retrieval": "retriever",
                "reasoning": "reasoner",
                "direct": "responder",
            }
        )

        # Conectar nodos
        workflow.add_edge("retriever", "reasoner")
        
        # Reasoner puede decidir llamar a herramientas o ir al responder
        workflow.add_conditional_edges(
            "reasoner",
            self._should_continue,
            {
                "continue": "executor",
                "end": "responder",
            }
        )
        
        # El executor vuelve al reasoner para observar el resultado (Bucle ReAct)
        workflow.add_edge("executor", "reasoner")
        workflow.add_edge("responder", END)

        # Compilar grafo
        return workflow.compile()

    async def _classify_intent(self, state: ContableAgentState) -> Dict[str, Any]:
        """
        Clasifica la intención del usuario.
        """
        start_time = time.time()
        
        user_message = state["user_message"]
        
        # Inicializar mensajes si no existen
        messages = state.get("messages") or [HumanMessage(content=user_message)]
        iterations = state.get("iterations") if state.get("iterations") is not None else 0

        system_prompt = """Clasifica la intención del usuario en una de estas categorías:
        - retrieval: Necesita información de documentos, leyes, o contexto específico
        - reasoning: Requiere análisis, cálculo, o razonamiento contable/fiscal
        - direct: Pregunta simple, saludo, o consulta general

        Responde SOLO con la categoría (retrieval, reasoning, o direct)."""

        classification = await self.nvidia_service.async_generate_response(
            prompt=f"Mensaje del usuario: {user_message}",
            system_message=system_prompt,
            temperature=0.0
        )

        # Preparar contexto
        current_context = state.get("context")
        # Explicit construction and cast to Dict[str, Any] to avoid union type assignment errors
        new_context: Dict[str, Any] = cast(Dict[str, Any], dict(current_context)) if current_context else {}
        # Direct assignments to avoid MutableMapping.update type ambiguity
        new_context["intent"] = str(classification).strip().lower()
        new_context["classification_latency"] = float(time.time() - start_time)

        # Actualizar estado
        return {
            "messages": messages,
            "user_message": state.get("user_message", ""),
            "conversation_history": state.get("conversation_history", []),
            "response": state.get("response"),
            "sources": state.get("sources", []),
            "confidence": state.get("confidence", 0.0),
            "model_used": state.get("model_used", ""),
            "latency": state.get("latency", 0.0),
            "iterations": iterations,
            "context": new_context
        }

    def _route_by_intent(self, state: ContableAgentState) -> str:
        """Enruta basado en la intención clasificada"""
        context = cast(Dict[str, Any], state.get("context") or {})
        intent = str(context.get("intent", "direct"))

        if "retrieval" in intent:
            return "retrieval"
        elif "reasoning" in intent:
            return "reasoning"
        else:
            return "direct"

    async def _retrieve_context(self, state: ContableAgentState) -> ContableAgentState:
        """
        Recupera contexto relevante de la base de datos vectorial.

        Usa ChromaDB para búsqueda semántica en:
        - Ley del ISR
        - Ley del IVA
        - Código Fiscal de la Federación
        - Resoluciones misceláneas del SAT
        - Documentos fiscales del usuario
        """
        start_time = time.time()

        # Obtener user_id del state o usar el default
        user_id = cast(Dict[str, Any], state.get("context") or {}).get("user_id", self.user_id) or 1
        
        # Obtener context_items del context si existen
        context_items = cast(Dict[str, Any], state.get("context") or {}).get("context_items", [])
        
        # Retrieval con RAG service
        try:
            # Búsqueda semántica principal
            rag_result = self.rag_service.query(
                user_id=user_id,
                query=state["user_message"],
                top_k=5
            )
            retrieved_docs = rag_result.get("context_docs", [])
            
            # Recuperar documentos específicos referenciados (@)
            from app.db.database import AsyncSessionLocal
            from app.db.models import Document as DbDocument
            from sqlalchemy import select
            
            async with AsyncSessionLocal() as db:
                for item_id in context_items:
                    if str(item_id).isdigit():
                        result = await db.execute(
                            select(DbDocument).where(DbDocument.id == int(item_id))
                        )
                        doc = result.scalar_one_or_none()
                        if doc and doc not in retrieved_docs:
                            retrieved_docs.append({
                                "content": doc.ruta_archivo, # TODO: Usar contenido real extraído
                                "source": doc.nombre_original,
                                "document_id": str(doc.id),
                                "relevance_score": 1.0
                            })
                
        except Exception as e:
            print(f"Error en RAG retrieval: {e}")
            retrieved_docs = []

        # Formatear documentos para el reasoner
        formatted_docs = []
        for d in retrieved_docs:
            doc = cast(Dict[str, Any], d)
            formatted_docs.append({
                "content": doc.get("content", ""),
                "source": doc.get("source", "unknown"),
                "document_id": doc.get("document_id", ""),
                "relevance_score": float(doc.get("relevance_score", 0)),
            })

        current_context = state.get("context")
        new_context: Dict[str, Any] = cast(Dict[str, Any], dict(current_context)) if current_context else {}
        new_context["retrieved_docs"] = formatted_docs
        new_context["retrieval_latency"] = float(time.time() - start_time)
        new_context["num_docs_retrieved"] = len(retrieved_docs)
        
        # Construir fuentes para la respuesta
        sources = [
            str(f"{doc.get('source')} (relevancia: {doc.get('relevance_score', 0):.2%})")
            for doc in formatted_docs
        ]

        return {
            "messages": cast(List[BaseMessage], state["messages"]),
            "user_message": str(state["user_message"]),
            "conversation_history": cast(List[Dict[str, str]], state["conversation_history"]),
            "context": cast(Optional[Dict[str, Any]], new_context),
            "response": state["response"],
            "sources": cast(List[str], sources),
            "confidence": float(cast(Any, state["confidence"])),
            "model_used": str(state["model_used"]),
            "latency": float(cast(Any, state["latency"])),
            "iterations": int(cast(Any, state["iterations"]))
        }

    async def _reason_with_context(self, state: ContableAgentState) -> Dict[str, Any]:
        """
        Realiza razonamiento contable con el contexto recuperado.
        """
        start_time = time.time()
        
        # Obtener iteraciones del estado de forma segura
        iterations_val = state.get("iterations", 0)
        iterations: int = int(str(iterations_val)) + 1

        retrieved_docs = cast(Dict[str, Any], state.get("context") or {}).get("retrieved_docs", [])
        
        # Preparar mensajes para NIM
        # Inyectamos el contexto RAG como un SystemMessage al principio si hay documentos
        messages_for_nim = []
        
        # 1. System Prompt Principal
        system_content = """Eres un experto contador y asesor fiscal en México.
Tu tarea es ayudar al usuario con consultas contables y fiscales.

INSTRUCCIONES CRÍTICAS:
1. Responde basándote PRINCIPALMENTE en los documentos recuperados del contexto.
2. Si la información no está en el contexto, indícalo claramente.
3. Cita las fuentes cuando sea relevante.
4. Usa las herramientas disponibles si necesitas buscar información actualizada, datos de clientes o leer archivos.
5. Si ya tienes la información necesaria, responde directamente al usuario.
6. Si una herramienta no devolvió lo que esperabas, intenta otra estrategia o informa al usuario."""

        if retrieved_docs:
            context_parts = []
            for i, d in enumerate(retrieved_docs, 1):
                doc = cast(Dict[str, Any], d)
                context_parts.append(str(f"[Doc {i}] {doc.get('source')}: {doc.get('content')}"))
            
            system_content += "\n\nCONTEXTO RAG RECURSO:\n" + "\n".join(context_parts)

        messages_for_nim.append({"role": "system", "content": system_content})

        # 2. Convertir historial de mensajes de LangGraph a formato NIM (dict)
        for msg in state["messages"]:
            if isinstance(msg, HumanMessage):
                messages_for_nim.append({"role": "user", "content": msg.content})
            elif isinstance(msg, AIMessage):
                nim_msg: Dict[str, Any] = {"role": "assistant", "content": msg.content or ""}
                if msg.tool_calls:
                    tool_calls_list = []
                    for tc in msg.tool_calls:
                        tool_calls_list.append({
                            "id": tc["id"],
                            "type": "function",
                            "function": {
                                "name": tc["name"],
                                "arguments": json.dumps(tc["args"])
                            }
                        })
                    nim_msg["tool_calls"] = tool_calls_list
                messages_for_nim.append(nim_msg)
            elif isinstance(msg, ToolMessage):
                messages_for_nim.append({
                    "role": "tool", 
                    "content": str(msg.content),
                    "tool_call_id": str(msg.tool_call_id)
                })

        from app.infrastructure.orchestration.agent_tools import AGENT_TOOL_DEFINITIONS
        native_tools = [{"type": "function", "function": tool_def} for tool_def in AGENT_TOOL_DEFINITIONS]

        response_data = await self.nvidia_service.async_generate_response(
            messages_list=messages_for_nim,
            temperature=0.7,
            tools=native_tools
        )

        # Extraer contenido y tool_calls
        content = ""
        tool_calls = []
        
        if isinstance(response_data, dict):
            content = response_data.get("content") or ""
            raw_tool_calls = response_data.get("tool_calls", [])
            for rtc in raw_tool_calls:
                func = rtc.get("function", {})
                try:
                    args = json.loads(func.get("arguments", "{}"))
                except Exception:
                    args = {}
                tool_calls.append({
                    "name": func.get("name"),
                    "args": args,
                    "id": rtc.get("id")
                })
        else:
            content = response_data

        # Actualizar estado con el nuevo mensaje del asistente
        ai_msg = AIMessage(content=content, tool_calls=tool_calls)
        
        current_context = state.get("context")
        new_context: Dict[str, Any] = cast(Dict[str, Any], dict(current_context)) if current_context else {}
        new_context["reasoning_latency"] = float(time.time() - start_time)
        new_context["current_iteration"] = int(iterations)

        return {
            "messages": state["messages"] + [ai_msg],
            "user_message": str(state["user_message"]),
            "conversation_history": cast(List[Dict[str, str]], state["conversation_history"]),
            "context": cast(Optional[Dict[str, Any]], new_context),
            "response": response_data,
            "sources": cast(List[str], state.get("sources", [])),
            "confidence": float(cast(Any, state.get("confidence", 0.0))),
            "model_used": str(state.get("model_used", "")),
            "latency": float(cast(Any, state.get("latency", 0.0))),
            "iterations": int(iterations)
        }

    def _should_continue(self, state: ContableAgentState) -> str:
        """Determina si el bucle ReAct debe continuar o terminar"""
        last_message = state["messages"][-1]
        
        # Si hay tool_calls, continuamos
        if isinstance(last_message, AIMessage) and last_message.tool_calls:
            if state["iterations"] < 10: # Límite de seguridad
                return "continue"
            else:
                print("Límite de iteraciones ReAct alcanzado.")
        
        return "end"

    async def _execute_agent_tools(self, state: ContableAgentState) -> ContableAgentState:
        """Ejecuta las herramientas solicitadas y añade ToolMessages al estado"""
        last_message = state["messages"][-1]
        
        if not isinstance(last_message, AIMessage) or not last_message.tool_calls:
            return cast(ContableAgentState, state)

        from app.infrastructure.orchestration.agent_tools import execute_tool
        from app.db.database import AsyncSessionLocal
        
        async with AsyncSessionLocal() as db:
            tool_messages = []
            for tool_call in last_message.tool_calls:
                tool_name = tool_call["name"]
                args = tool_call["args"]
                tool_call_id = tool_call["id"]
                
                print(f"Ejecutando herramienta: {tool_name} con args: {args}")
                
                result = await execute_tool(
                    tool_name=tool_name,
                    params=args,
                    db=db,
                    user_id=cast(Dict[str, Any], state.get("context") or {}).get("user_id", 1)
                )
                
                tool_messages.append(ToolMessage(
                    content=json.dumps(result) if not isinstance(result, str) else result,
                    tool_call_id=tool_call_id
                ))
            
            return {
                "messages": state["messages"] + tool_messages,
                "user_message": str(state["user_message"]),
                "conversation_history": cast(List[Dict[str, str]], state["conversation_history"]),
                "context": cast(Optional[Dict[str, Any]], state["context"]),
                "response": state["response"],
                "sources": cast(List[str], state["sources"]),
                "confidence": float(cast(Any, state["confidence"])),
                "model_used": str(state["model_used"]),
                "latency": float(cast(Any, state["latency"])),
                "iterations": int(cast(Any, state["iterations"]))
            }

    async def _generate_response(self, state: ContableAgentState) -> Dict[str, Any]:
        """Genera la respuesta final con metadata"""
        
        response_obj = state.get("response", "")
        
        # Si la respuesta es un objeto de NIM, extraer el contenido
        if isinstance(response_obj, dict):
            response = response_obj.get("content", "")
        else:
            response = str(response_obj)
        
        # Si la respuesta está vacía (ej. intent direct directo al responder) o solo tiene tool_calls
        if not response:
            system_prompt = "Eres el Agente Fiscal de IDP Asistente Contable, un asistente experto en contabilidad y fiscalidad mexicana. Ayuda al usuario con su consulta general de forma amable, concisa y profesional, manteniendo tu identidad como el agente oficial de la plataforma."
            response_data = await self.nvidia_service.async_generate_response(
                prompt=state["user_message"],
                system_message=system_prompt,
                temperature=0.7
            )
            response = str(response_data.get("content", "") if isinstance(response_data, dict) else response_data)
        
        state["response"] = response

        # Calcular confianza basada en longitud de respuesta y contexto
        context_data = cast(Dict[str, Any], state.get("context") or {})
        retrieved_docs = cast(List[Any], context_data.get("retrieved_docs", []))
        has_context = len(retrieved_docs) > 0
        
        # Confianza base: 0.7
        # +0.1 si hay contexto recuperado
        # +0.1 si la respuesta es sustancial (>100 caracteres)
        confidence = 0.7
        if has_context:
            confidence += 0.1
        if len(response) > 100:
            confidence += 0.1
        
        state["confidence"] = float(min(confidence, 0.95))
        state["model_used"] = str(settings.LLM_MODEL)
        current_context_final = cast(Dict[str, Any], state.get("context") or {})
        state["latency"] = float(
            float(current_context_final.get("classification_latency", 0.0)) +
            float(current_context_final.get("retrieval_latency", 0.0)) +
            float(current_context_final.get("reasoning_latency", 0.0))
        )

        return cast(Dict[str, Any], state)

    async def generate_response(
        self,
        message: str,
        history: Optional[List[Dict[str, str]]] = None,
        context: Optional[Dict[str, Any]] = None,
        user_id: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Genera una respuesta a un mensaje del usuario.

        Args:
            message: Mensaje del usuario
            history: Historial de conversación (lista de dicts con role/content)
            context: Contexto adicional
            user_id: ID del usuario para RAG retrieval (opcional)

        Returns:
            Dict con: content, sources, confidence, model_used, latency
        """
        initial_state = {
            "messages": [HumanMessage(content=message)],
            "user_message": message,
            "conversation_history": history or [],
            "context": {**(context or {}), "user_id": user_id or self.user_id},
            "response": "",
            "sources": [],
            "confidence": 0.0,
            "model_used": "",
            "latency": 0.0,
            "iterations": 0
        }

        final_state = await self.graph.ainvoke(initial_state)

        return {
            "content": final_state["response"],
            "sources": final_state["sources"],
            "confidence": final_state["confidence"],
            "model_used": final_state["model_used"],
            "latency": final_state["latency"]
        }

    async def stream_response(
        self,
        message: str,
        history: Optional[List[Dict[str, str]]] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """
        Genera una respuesta en streaming (token-por-token).

        Args:
            message: Mensaje del usuario
            history: Historial de conversación
            context: Contexto adicional

        Yields:
            Chunks de respuesta con metadata
        """
        # Primero, clasificar intención
        intent_state = await self._classify_intent({
            "messages": [HumanMessage(content=message)],
            "user_message": message,
            "conversation_history": history or [],
            "context": context or {},
            "response": "",
            "sources": [],
            "confidence": 0.0,
            "model_used": "",
            "latency": 0.0,
            "iterations": 0
        })

        intent = cast(Dict[str, Any], intent_state.get("context", {})).get("intent", "direct")

        # Yield metadata inicial
        yield {
            "type": "metadata",
            "intent": intent,
            "model_used": settings.LLM_MODEL
        }

        # Generar respuesta con streaming
        user_message = message
        retrieved_docs = cast(Dict[str, Any], intent_state.get("context", {})).get("retrieved_docs", [])

        # Construir system prompt
        context_str = ""
        if retrieved_docs:
            context_str = "\n\nContexto relevante:\n" + "\n".join(
                f"- {doc.get('source', 'unknown')}: {doc.get('content', '')}" for doc in retrieved_docs[:5]
            )
        # Generar respuesta con NIM
        system_prompt = """Eres el Agente Fiscal de IDP Asistente Contable, un asistente experto en contabilidad y fiscalidad mexicana.
        Debes responder a la consulta del usuario basándote en la legislación fiscal vigente en México y, si hay contexto adjunto, utilízalo.
        Tu tono debe ser profesional, amable, preciso y siempre presentarte como parte de la plataforma IDP Asistente Contable cuando sea apropiado.
        
        REGLAS:
        1. Responde en español de México.
        2. Usa formato Markdown paraestructurar tu respuesta (negritas, listas, etc.).
        3. Si la consulta requiere un cálculo complejo, explica la metodología basada en la ley (ej. LISR, LIVA).
        4. Si el contexto no es suficiente para responder con certeza, indícalo claramente.
        5. NO inventes información fiscal.
        
        CONTEXTO ADICIONAL DISPONIBLE:
        {context_str}
        """
        # Stream de tokens
        full_response = ""
        async for chunk in self.nvidia_service.async_stream_response(
            prompt=user_message,
            system_message=system_prompt
        ):
            full_response += chunk
            yield {
                "type": "token",
                "content": chunk
            }

        # Una vez terminada la respuesta, agregar al historial
        if history is not None:
            history.append({
                "role": "human",
                "content": user_message
            })
            history.append({
                "role": "assistant",
                "content": full_response
            })

        # Yield metadata final
        yield {
            "type": "done",
            "sources": [],
            "confidence": 0.8,
            "total_tokens": len(full_response.split())
        }


# =============================================================================
# SERVICE FACTORY
# =============================================================================

def get_contable_agent() -> ContableAgent:
    """
    Factory function para obtener instancia del agente contable.

    Returns:
        ContableAgent: Instancia del agente
    """
    return ContableAgent()


# =============================================================================
# LEGACY COMPATIBILITY
# =============================================================================

class LangGraphAgentsService:
    """Legacy service for backward compatibility"""

    def __init__(self):
        self.nvidia_service = get_extraction_service()
        self.contable_agent = ContableAgent()

    async def run_agent(
        self,
        agent_name: str,
        user_message: str,
        conversation_history: Optional[List[BaseMessage]] = None,
    ) -> dict:
        """Run an agent with user message"""
        if agent_name == "contable_assistant":
            history = [
                {"role": msg.type if hasattr(msg, 'type') else msg["role"], 
                 "content": msg.content if hasattr(msg, 'content') else msg["content"]}
                for msg in (conversation_history or [])
            ]
            return await self.contable_agent.generate_response(
                message=user_message,
                history=history
            )
        else:
            raise ValueError(f"Agent '{agent_name}' not found")


# Global service instance for legacy compatibility
langgraph_agents_service = LangGraphAgentsService()


def get_langgraph_service() -> LangGraphAgentsService:
    """Get LangGraph agents service instance"""
    return langgraph_agents_service
