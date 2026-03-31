"""
Chat Endpoints
Endpoints para interacción conversacional con el asistente contable.

Endpoints disponibles:
- POST /v1/chat/message - Enviar mensaje al asistente
- GET /v1/chat/conversation/{id} - Obtener conversación
- DELETE /v1/chat/conversation/{id} - Eliminar conversación
- GET /v1/chat/conversations - Listar conversaciones del usuario
"""

from datetime import datetime
from typing import List, Optional, Dict, Any, AsyncGenerator, cast

from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, delete, desc, text

from app.db.database import get_async_db
from app.db.models import Conversation, Message, User
from app.core.security import get_current_user
from app.infrastructure.ai.langgraph_agents import ContableAgent
from app.db.models import Document


router = APIRouter()


# =============================================================================
# REQUEST/RESPONSE MODELS
# =============================================================================

class ChatMessage(BaseModel):
    """Chat message model"""
    role: str = Field(..., description="Rol del mensaje (user, assistant, system)")
    content: str = Field(..., description="Contenido del mensaje")


class ChatRequest(BaseModel):
    """Chat request model"""
    message: str = Field(..., description="Mensaje del usuario")
    conversation_id: Optional[str] = Field(None, description="ID de conversación existente")
    context: Optional[Dict[str, Any]] = Field(None, description="Contexto adicional")
    context_items: Optional[List[str]] = Field(None, description="IDs de documentos o entidades referenciadas (@)")
    stream: bool = Field(default=False, description="Usar streaming de respuesta")


class ConversationDetailResponse(BaseModel):
    id: str
    title: str
    messages: List[ChatMessage]
    created_at: datetime
    updated_at: datetime
    message_count: int

class ChatResponse(BaseModel):
    """Chat response model"""
    conversation_id: str
    message: ChatMessage
    sources: Optional[List[str]] = Field(None, description="Fuentes de información utilizadas")
    puntuacion_confianza: float = Field(alias="confidence", description="Score de confianza (0-1)")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Metadatos adicionales")

    class Config:
        populate_by_name = True


class ConversationSummary(BaseModel):
    """Conversation summary model"""
    conversation_id: str
    title: str
    message_count: int
    created_at: datetime
    updated_at: datetime


class ContextItem(BaseModel):
    """Context item for mentions"""
    id: str
    name: str
    tipo: str = Field(alias="type")  # document, client, project, etc.
    metadata: Optional[Dict[str, Any]] = None

    class Config:
        populate_by_name = True


class ContextItemsResponse(BaseModel):
    """Response model for context items"""
    items: List[ContextItem]


# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

async def get_or_create_conversation(
    db: AsyncSession,
    user_id: int,
    conversation_id: Optional[str] = None,
    initial_message: Optional[str] = None
) -> Conversation:
    """
    Obtiene una conversación existente o crea una nueva.

    Args:
        db: Sesión de base de datos
        user_id: ID del usuario
        conversation_id: ID de conversación existente (opcional)
        initial_message: Mensaje inicial para generar título

    Returns:
        Conversation: Conversación obtenida o creada
    """
    if conversation_id:
        try:
            conv_id = int(conversation_id)
            result = await db.execute(select(Conversation).where(
                Conversation.id == conv_id,
                Conversation.user_id == user_id
            ))
            conversation = result.scalar_one_or_none()
            
            if conversation:
                return conversation
        except ValueError:
            pass

    # Crear nueva conversación
    title = None
    if initial_message:
        # Generar título a partir del primer mensaje (primeras 50 caracteres)
        msg_text = str(initial_message)
        title = msg_text[:50] + "..." if len(msg_text) > 50 else msg_text

    conversation = Conversation()
    conversation.user_id = user_id
    conversation.title = title
    db.add(conversation)
    await db.commit()
    await db.refresh(conversation)

    return conversation


async def save_message(
    db: AsyncSession,
    conversation_id: int,
    role: str,
    content: str,
    metadata: Optional[Dict[str, Any]] = None
) -> Message:
    """
    Guarda un mensaje en la base de datos.

    Args:
        db: Sesión de base de datos
        conversation_id: ID de conversación
        role: Rol del mensaje (user, assistant)
        content: Contenido del mensaje
        metadata: Metadatos adicionales

    Returns:
        Message: Mensaje guardado
    """
    message = Message()
    message.conversation_id = conversation_id
    message.role = role
    message.content = content
    message.metadatos = metadata
    db.add(message)
    await db.commit()
    await db.refresh(message)
    return message


# =============================================================================
# ENDPOINTS
# =============================================================================

@router.post("/message", response_model=ChatResponse)
async def send_message(
    request: ChatRequest,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user),
) -> ChatResponse:
    """
    Envía un mensaje al asistente contable y obtiene respuesta.

    - **message**: Mensaje del usuario
    - **conversation_id**: ID de conversación existente (opcional, crea nueva si no se proporciona)
    - **context**: Contexto adicional (opcional)
    - **stream**: Usar streaming de respuesta (default: False)

    El asistente utiliza LangGraph para orquestar agentes especializados:
    - Agente de clasificación de intenciones
    - Agente de recuperación documental (RAG)
    - Agente de razonamiento contable
    - Agente de validación fiscal

    Returns:
        ChatResponse: Respuesta del asistente con fuentes y confianza
    """
    # Obtener o crear conversación
    conversation = await get_or_create_conversation(
        db=db,
        user_id=current_user.id,
        conversation_id=request.conversation_id,
        initial_message=request.message
    )

    # Guardar mensaje del usuario
    await save_message(
        db=db,
        conversation_id=conversation.id,
        role="user",
        content=request.message,
        metadata=request.context
    )

    try:
        # Inicializar agente contable
        agent = ContableAgent()

        # Obtener historial de conversación (últimos 10 mensajes)
        result = await db.execute(select(Message).where(
            Message.conversation_id == conversation.id
        ).order_by(Message.created_at.desc()).limit(10))
        recent_messages = result.scalars().all()
        
        # Ordenar cronológicamente
        recent_messages = list(reversed(recent_messages))
        
        history = [
            {"role": msg.role, "content": msg.content}
            for msg in recent_messages
        ]

        # Preparar contexto extendido
        full_context = request.context or {}
        if request.context_items:
            full_context["context_items"] = request.context_items

        # Generar respuesta con el agente (Awaiting async method)
        response_data = await agent.generate_response(
            message=request.message,
            history=history,
            context=full_context,
            user_id=current_user.id
        )

        # Guardar respuesta del asistente
        assistant_message = await save_message(
            db=db,
            conversation_id=conversation.id,
            role="assistant",
            content=response_data.get("content", ""),
            metadata={
                "sources": response_data.get("sources", []),
                "puntuacion_confianza": response_data.get("confidence", 0.0),
                "model_used": response_data.get("model_used", "unknown"),
            }
        )

        # Actualizar título si es el primer mensaje
        if not conversation.title and request.message:
            msg_text = str(request.message)
            conversation.title = msg_text[:50] + "..." if len(msg_text) > 50 else msg_text
            await db.commit()

        response_msg = ChatMessage(
            role="assistant",
            content=str(response_data.get("content", ""))
        )
        return ChatResponse(
            conversation_id=str(conversation.id),
            message=response_msg,
            sources=cast(Optional[List[str]], response_data.get("sources")),
            puntuacion_confianza=float(response_data.get("confidence", 0.0)),
            metadata={
                "model_used": response_data.get("model_used"),
                "latency": response_data.get("latency"),
            }
        )

    except Exception as e:
        # Guardar mensaje de error
        await save_message(
            db=db,
            conversation_id=conversation.id,
            role="assistant",
            content=f"Lo siento, ocurrió un error procesando tu solicitud: {str(e)}",
            metadata={"error": True}
        )

        raise HTTPException(status_code=500, detail=f"Error generando respuesta: {str(e)}")


@router.post("/message/stream")
async def send_message_stream(
    request: ChatRequest,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user),
):
    """
    Envía un mensaje al asistente contable con respuesta en streaming.

    Usa Server-Sent Events (SSE) para streaming token-por-token.

    - **message**: Mensaje del usuario
    - **conversation_id**: ID de conversación existente (opcional)
    - **context**: Contexto adicional (opcional)

    Returns:
        StreamingResponse: Stream de tokens en formato SSE
    """
    # Obtener o crear conversación
    conversation = await get_or_create_conversation(
        db=db,
        user_id=current_user.id,
        conversation_id=request.conversation_id,
        initial_message=request.message
    )

    # Guardar mensaje del usuario
    await save_message(
        db=db,
        conversation_id=conversation.id,
        role="user",
        content=request.message,
        metadata=request.context
    )

    async def generate_stream() -> AsyncGenerator[str, None]:
        """Genera stream de tokens SSE"""
        try:
            agent = ContableAgent()

            # Obtener historial
            result = await db.execute(select(Message).where(
                Message.conversation_id == conversation.id
            ).order_by(Message.created_at.desc()).limit(10))
            recent_messages = result.scalars().all()
            
            history = [
                {"role": msg.role, "content": msg.content}
                for msg in reversed(list(recent_messages))
            ]

            full_response = ""
            sources = []
            confidence = 0.0

            # Preparar contexto extendido
            full_context = request.context or {}
            if request.context_items:
                full_context["context_items"] = request.context_items

            # Stream de tokens (Awaiting async generator)
            async for chunk in agent.stream_response(
                message=request.message,
                history=history,
                context=full_context
            ):
                if isinstance(chunk, dict):
                    if chunk.get("type") == "token":
                        token = chunk.get("content", "")
                        full_response += token
                        yield f"data: {token}\n\n"
                    elif chunk.get("type") == "metadata":
                        sources = chunk.get("sources", [])
                        confidence = chunk.get("confidence", 0.0)
                    elif chunk.get("type") == "done":
                        sources = chunk.get("sources", sources)
                        confidence = chunk.get("confidence", confidence)
                else:
                    full_response += str(chunk)
                    yield f"data: {chunk}\n\n"

            # Guardar respuesta completa
            await save_message(
                db=db,
                conversation_id=conversation.id,
                role="assistant",
                content=full_response,
                metadata={
                    "sources": sources,
                    "puntuacion_confianza": confidence,
                }
            )

            yield "data: [DONE]\n\n"

        except Exception as e:
            yield f"data: [ERROR] {str(e)}\n\n"

    return StreamingResponse(
        generate_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )


@router.get("/conversation/{conversation_id}", response_model=ConversationDetailResponse)
async def get_conversation(
    conversation_id: str,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user),
) -> ConversationDetailResponse:
    """
    Obtiene el historial completo de una conversación.

    - **conversation_id**: ID de la conversación

    Returns:
        ConversationDetailResponse: Historial de mensajes
    """
    try:
        conv_id = int(conversation_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="ID de conversación inválido")

    result = await db.execute(select(Conversation).where(
        Conversation.id == conv_id,
        Conversation.user_id == current_user.id
    ))
    conversation = result.scalar_one_or_none()

    if not conversation:
        raise HTTPException(status_code=404, detail="Conversación no encontrada")

    # Obtener mensajes ordenados cronológicamente
    result = await db.execute(select(Message).where(
        Message.conversation_id == conv_id
    ).order_by(Message.created_at.asc()))
    messages = result.scalars().all()

    response = ConversationDetailResponse(
        id=str(conversation.id),
        title=str(conversation.title or "Sin título"),
        messages=[
            ChatMessage(role=str(msg.role), content=str(msg.content))
            for msg in messages
        ],
        created_at=cast(datetime, conversation.created_at),
        updated_at=cast(datetime, conversation.updated_at),
        message_count=len(messages)
    )
    return response


@router.delete("/conversation/{conversation_id}")
async def delete_conversation(
    conversation_id: str,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user),
):
    """
    Elimina una conversación y todos sus mensajes.

    - **conversation_id**: ID de la conversación a eliminar

    Returns:
        Mensaje de confirmación
    """
    # Validate conversation_id
    if not conversation_id or conversation_id == "undefined":
        raise HTTPException(status_code=400, detail="ID de conversación inválido o faltante")
    
    try:
        conv_id = int(conversation_id)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"ID de conversación debe ser entero, recibido: {conversation_id}")

    result = await db.execute(select(Conversation).where(
        Conversation.id == conv_id,
        Conversation.user_id == current_user.id
    ))
    conversation = result.scalar_one_or_none()

    if not conversation:
        raise HTTPException(status_code=404, detail="Conversación no encontrada")

    # Eliminar mensajes primero (cascade)
    await db.execute(delete(Message).where(
        Message.conversation_id == conv_id
    ))

    # Eliminar conversación
    await db.delete(conversation)
    await db.commit()

    return {"message": f"Conversación {conversation_id} eliminada exitosamente"}


@router.get("/conversations", response_model=List[ConversationSummary])
async def list_conversations(
    limit: int = Query(default=20, ge=1, le=100, description="Número máximo de conversaciones"),
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user),
) -> List[ConversationSummary]:
    """
    Lista todas las conversaciones del usuario.

    - **limit**: Número máximo de conversaciones a retornar (1-100)

    Returns:
        List[ConversationSummary]: Lista de conversaciones ordenadas por fecha
    """
    result = await db.execute(select(Conversation).where(
        Conversation.user_id == current_user.id
    ).order_by(
        Conversation.updated_at.desc()
    ).limit(limit))
    conversations = result.scalars().all()

    results = []
    for conv in conversations:
        # Contar mensajes
        result = await db.execute(select(func.count(Message.id)).where(
            Message.conversation_id == conv.id
        ))
        message_count = result.scalar() or 0

        summary = ConversationSummary(
            conversation_id=str(conv.id),
            title=conv.title or "Sin título",
            message_count=message_count,
            created_at=conv.created_at,
            updated_at=conv.updated_at
        )
        results.append(summary)

    return results


@router.get("/context-items", response_model=ContextItemsResponse)
async def get_context_items(
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user),
) -> ContextItemsResponse:
    """
    Obtiene una lista de ítems para el menú de menciones (@).
    Incluye documentos recientes y clientes.
    """
    # Documentos recientes
    result = await db.execute(select(Document).where(
        Document.user_id == current_user.id
    ).order_by(Document.created_at.desc()).limit(20))
    documents = result.scalars().all()

    items = []
    for doc in documents:
        item = ContextItem(
            id=str(doc.id),
            name=doc.nombre_original,
            type="document",
            metadata={
                "doc_type": doc.tipo_documento,
                "status": doc.estado
            }
        )
        items.append(item)

    # Clientes (Simulados por ahora basándonos en agent_tools)
    clients = [
        {"id": "c1", "name": "Servicios Contables del Norte SA de CV", "rfc": "SCN210101ABC"},
        {"id": "c2", "name": "María González López", "rfc": "GOLM900215PQ3"},
        {"id": "c3", "name": "Tech Solutions MX SA de CV", "rfc": "TSM180601XY9"},
    ]
    for client in clients:
        item = ContextItem(
            id=client["id"],
            name=client["name"],
            type="client",
            metadata={"rfc": client["rfc"]}
        )
        items.append(item)

    return ContextItemsResponse(items=items)
