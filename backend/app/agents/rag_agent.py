"""
RAG Agent - IDP Asistente Contable
Agente para Retrieval-Augmented Generation con LangGraph integration.

Este agente proporciona:
- Retrieval de documentos relevantes desde ChromaDB
- Construcción de contexto para LLM
- Generación de respuestas con citas de fuentes
- Integration con LangGraph StateGraph

Arquitectura:
- RAG retrieval node para LangGraph workflow
- Context augmentation con documentos recuperados
- Source citation en respuestas
"""

import time
from typing import TypedDict, List, Optional, Dict, Any, Generator


from app.core.config import settings
from app.infrastructure.ai.rag_service import get_rag_service, RAGService
from app.infrastructure.ai.nvidia_nim import get_extraction_service, NIMExtractionService


# =============================================================================
# STATE DEFINITIONS
# =============================================================================

class RAGAgentState(TypedDict):
    """State para el agente RAG"""
    user_message: str
    user_id: int
    conversation_history: List[Dict[str, str]]
    context: Optional[Dict[str, Any]]
    retrieved_docs: List[Dict[str, Any]]
    response: str
    sources: List[Dict[str, Any]]
    confidence: float
    model_used: str
    latency: float


# =============================================================================
# RAG PROMPT
# =============================================================================

RAG_SYSTEM_PROMPT = """Eres un asistente contable experto en fiscalidad mexicana.
Tu tarea es responder preguntas basándote ÚNICAMENTE en el contexto proporcionado de documentos fiscales.

INSTRUCCIONES CRÍTICAS:
1. Responde basándote EXCLUSIVAMENTE en el contexto proporcionado
2. Si la respuesta no está en el contexto, di claramente "No tengo información suficiente en el contexto proporcionado"
3. Cita las fuentes cuando sea relevante (ej: "Según la factura XYZ...", "De acuerdo al documento...")
4. Usa formato markdown para mejor legibilidad
5. Incluye ejemplos numéricos cuando aplique
6. Mantén un tono profesional y técnico apropiado para consultas contables

CONTEXTO DE DOCUMENTOS FISCALES:
{context}

HISTORIAL DE CONVERSACIÓN:
{history}

Pregunta del usuario: {question}

Respuesta:"""


# =============================================================================
# RAG AGENT
# =============================================================================

class RAGAgent:
    """
    Agente RAG para recuperación y generación de respuestas.
    
    Este agente utiliza LangGraph para orquestar el flujo RAG:
    1. Retrieval de documentos relevantes desde ChromaDB
    2. Construcción de contexto aumentado
    3. Generación de respuesta con LLM
    4. Citación de fuentes
    
    Features:
    - Retrieval semántico con NVIDIA embeddings
    - Context augmentation
    - Source citation
    - Confidence scoring
    - Streaming support
    """
    
    def __init__(
        self,
        rag_service: Optional[RAGService] = None,
        llm_service: Optional[NIMExtractionService] = None,
        top_k: int = 5
    ):
        """
        Inicializa el agente RAG.
        
        Args:
            rag_service: Servicio RAG (opcional)
            llm_service: Servicio LLM (opcional)
            top_k: Número de documentos a recuperar (default: 5)
        """
        self.rag_service = rag_service or get_rag_service()
        self.llm_service = llm_service or get_extraction_service()
        self.top_k = top_k
    
    def retrieve_context(
        self,
        query: str,
        user_id: int,
        top_k: Optional[int] = None,
        document_type: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Recupera documentos relevantes para una query.
        
        Args:
            query: Query de búsqueda
            user_id: ID del usuario
            top_k: Número de resultados (opcional)
            document_type: Tipo de documento (opcional)
            
        Returns:
            List[Dict]: Lista de documentos recuperados
        """
        start_time = time.time()
        
        # Retrieval
        result = self.rag_service.query(
            user_id=user_id,
            query=query,
            top_k=top_k or self.top_k,
            document_type=document_type
        )
        
        context_docs = result.get("context_docs", [])
        
        # Log retrieval stats
        retrieval_time = time.time() - start_time
        
        return context_docs
    
    def build_context(self, context_docs: List[Dict[str, Any]]) -> str:
        """
        Construye contexto textual a partir de documentos recuperados.
        
        Args:
            context_docs: Lista de documentos recuperados
            
        Returns:
            str: Contexto formateado
        """
        if not context_docs:
            return "No se encontraron documentos relevantes en el contexto."
        
        context_parts = []
        for i, doc in enumerate(context_docs, 1):
            source = doc.get("source", "Desconocida")
            content = doc.get("content", "")
            doc_id = doc.get("document_id", "")
            relevance = doc.get("relevance_score", 0)
            
            context_part = f"""[Documento {i}]
Fuente: {source}
ID: {doc_id}
Relevancia: {relevance:.2%}
Contenido: {content}
---"""
            context_parts.append(context_part)
        
        return "\n\n".join(context_parts)
    
    def generate_response(
        self,
        query: str,
        context: str,
        history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """
        Genera respuesta usando LLM con contexto RAG.
        
        Args:
            query: Query del usuario
            context: Contexto de documentos
            history: Historial de conversación (opcional)
            
        Returns:
            Dict con response, sources, confidence, metadata
        """
        start_time = time.time()
        
        # Formatear historial
        history_text = ""
        if history:
            history_text = "\n".join([
                f"{msg.get('role', 'user')}: {msg.get('content', '')}"
                for msg in history[-5:]  # Últimos 5 mensajes
            ])
        
        # Construir prompt
        prompt = RAG_SYSTEM_PROMPT.format(
            context=context,
            history=history_text,
            question=query
        )
        
        # Generar respuesta con LLM
        response = self.llm_service.generate_response(
            prompt=query,
            system_message=prompt,
            temperature=0.7
        )
        
        # Calcular confianza
        confidence = self._calculate_confidence(context, response)
        
        return {
            "response": response,
            "sources": [],  # Se llena después
            "confidence": confidence,
            "model_used": settings.LLM_MODEL,
            "latency": time.time() - start_time,
        }
    
    def _calculate_confidence(self, context: str, response: str) -> float:
        """
        Calcula score de confianza basado en contexto y respuesta.
        
        Args:
            context: Contexto de documentos
            response: Respuesta generada
            
        Returns:
            float: Score de confianza (0-1)
        """
        # Confianza base: 0.6
        confidence = 0.6
        
        # +0.15 si hay contexto sustancial (>200 caracteres)
        if len(context) > 200:
            confidence += 0.15
        
        # +0.15 si la respuesta es sustancial (>100 caracteres)
        if len(response) > 100:
            confidence += 0.15
        
        # +0.1 si la respuesta menciona fuentes
        if any(word in response.lower() for word in ["según", "de acuerdo", "documento", "factura", "fuente"]):
            confidence += 0.1
        
        return min(confidence, 0.95)
    
    def run(
        self,
        query: str,
        user_id: int,
        history: Optional[List[Dict[str, str]]] = None,
        document_type: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Ejecuta el flujo RAG completo.
        
        Args:
            query: Query del usuario
            user_id: ID del usuario
            history: Historial de conversación (opcional)
            document_type: Tipo de documento (opcional)
            
        Returns:
            Dict con response, sources, confidence, metadata
        """
        total_start = time.time()
        
        # 1. Retrieval
        context_docs = self.retrieve_context(
            query=query,
            user_id=user_id,
            document_type=document_type
        )
        
        # 2. Build context
        context = self.build_context(context_docs)
        
        # 3. Generate response
        result = self.generate_response(
            query=query,
            context=context,
            history=history
        )
        
        # 4. Add sources
        result["sources"] = [
            {
                "document_id": doc.get("document_id"),
                "source": doc.get("source"),
                "relevance_score": doc.get("relevance_score"),
                "document_type": doc.get("document_type"),
            }
            for doc in context_docs
        ]
        
        # 5. Add total latency
        result["total_latency"] = time.time() - total_start
        result["retrieval_latency"] = result.get("latency", 0)
        
        return result
    
    def stream(
        self,
        query: str,
        user_id: int,
        history: Optional[List[Dict[str, str]]] = None,
        document_type: Optional[str] = None
    ) -> Generator[Dict[str, Any], None, None]:
        """
        Ejecuta el flujo RAG con streaming de tokens.
        
        Args:
            query: Query del usuario
            user_id: ID del usuario
            history: Historial de conversación (opcional)
            document_type: Tipo de documento (opcional)
            
        Yields:
            Chunks de respuesta con metadata
        """
        total_start = time.time()
        
        # 1. Retrieval primero
        context_docs = self.retrieve_context(
            query=query,
            user_id=user_id,
            document_type=document_type
        )
        
        # Yield metadata inicial
        yield {
            "type": "metadata",
            "num_docs_retrieved": len(context_docs),
            "sources": [
                {
                    "document_id": doc.get("document_id"),
                    "source": doc.get("source"),
                    "relevance_score": doc.get("relevance_score"),
                }
                for doc in context_docs
            ],
        }
        
        # 2. Build context
        context = self.build_context(context_docs)
        
        # 3. Formatear historial
        history_text = ""
        if history:
            history_text = "\n".join([
                f"{msg.get('role', 'user')}: {msg.get('content', '')}"
                for msg in history[-5:]
            ])
        
        # 4. Construir system prompt
        system_prompt = RAG_SYSTEM_PROMPT.format(
            context=context,
            history=history_text,
            question=query
        )
        
        # 5. Stream de tokens
        full_response = ""
        for chunk in self.llm_service.stream_response(
            prompt=query,
            system_message=system_prompt,
            temperature=0.7
        ):
            full_response += chunk
            yield {
                "type": "token",
                "content": chunk,
            }
        
        # 6. Yield metadata final
        confidence = self._calculate_confidence(context, full_response)
        yield {
            "type": "done",
            "response": full_response,
            "confidence": confidence,
            "model_used": settings.LLM_MODEL,
            "total_latency": time.time() - total_start,
        }


# =============================================================================
# LANGGRAPH INTEGRATION
# =============================================================================

class RAGLangGraphNode:
    """
    Nodo RAG para integración con LangGraph StateGraph.
    
    Este nodo puede ser integrado en el workflow de LangGraph
    del agente contable para proporcionar retrieval de contexto.
    """
    
    def __init__(self, rag_agent: Optional[RAGAgent] = None):
        """
        Inicializa el nodo RAG para LangGraph.
        
        Args:
            rag_agent: Agente RAG (opcional)
        """
        self.rag_agent = rag_agent or RAGAgent()
    
    def retrieve_node(self, state: RAGAgentState) -> RAGAgentState:
        """
        Nodo de retrieval para LangGraph.
        
        Args:
            state: Estado actual del agente
            
        Returns:
            Estado actualizado con documentos recuperados
        """
        start_time = time.time()
        
        query = state.get("user_message", "")
        user_id = state.get("user_id", 1)  # Default a 1 si no se proporciona
        
        # Retrieval
        context_docs = self.rag_agent.retrieve_context(
            query=query,
            user_id=user_id
        )
        
        # Actualizar estado
        state["retrieved_docs"] = context_docs
        state["context"] = state.get("context", {})
        state["context"]["retrieval_latency"] = time.time() - start_time
        state["context"]["num_docs_retrieved"] = len(context_docs)
        
        # Construir contexto textual
        state["context"]["rag_context"] = self.rag_agent.build_context(context_docs)
        
        return state
    
    def augment_context_node(self, state: RAGAgentState) -> RAGAgentState:
        """
        Nodo de augmentación de contexto para LangGraph.
        
        Combina el contexto RAG con el contexto existente.
        
        Args:
            state: Estado actual del agente
            
        Returns:
            Estado con contexto aumentado
        """
        retrieved_docs = state.get("retrieved_docs", [])
        
        if not retrieved_docs:
            return state
        
        # Construir contexto RAG
        rag_context = self.rag_agent.build_context(retrieved_docs)
        
        # Augmentar contexto existente
        state["context"] = state.get("context", {})
        existing_context = state["context"].get("rag_context", "")
        
        if existing_context:
            state["context"]["rag_context"] = existing_context + "\n\n" + rag_context
        else:
            state["context"]["rag_context"] = rag_context
        
        return state


# =============================================================================
# SERVICE FACTORY
# =============================================================================

def get_rag_agent(
    rag_service=None,
    llm_service=None,
    top_k: int = 5
) -> RAGAgent:
    """
    Factory function para obtener instancia del agente RAG.
    
    Args:
        rag_service: Servicio RAG (opcional)
        llm_service: Servicio LLM (opcional)
        top_k: Número de documentos a recuperar
        
    Returns:
        RAGAgent: Instancia del agente
    """
    return RAGAgent(
        rag_service=rag_service,
        llm_service=llm_service,
        top_k=top_k
    )


def get_rag_langgraph_node(
    rag_agent: Optional[RAGAgent] = None
) -> RAGLangGraphNode:
    """
    Factory function para obtener nodo RAG para LangGraph.
    
    Args:
        rag_agent: Agente RAG (opcional)
        
    Returns:
        RAGLangGraphNode: Instancia del nodo
    """
    return RAGLangGraphNode(rag_agent=rag_agent)
