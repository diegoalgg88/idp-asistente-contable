"""
Services Package - IDP Asistente Contable
Paquete de servicios para el asistente contable.

Servicios disponibles:
- nvidia_nim: Servicio de extracción con NVIDIA NIM Vision
- langgraph_agents: Agentes de IA con LangGraph
- embeddings: Servicio de embeddings con NVIDIA NIM
- rag_service: Servicio RAG con ChromaDB
"""

from app.services.nvidia_nim import (
    NIMExtractionService,
    process_invoice_async,
    process_batch_async,
    get_extraction_service,
    RateLimiter,
)

from app.services.langgraph_agents import (
    ContableAgent,
    LangGraphAgentsService,
    get_contable_agent,
    get_langgraph_service,
    ContableAgentState,
    AgentState,
)

from app.services.embeddings import (
    NVIDIAEmbeddingsService,
    EmbeddingsCache,
    get_embeddings_service,
    create_embeddings_service,
)

from app.services.rag_service import (
    ChromaDBService,
    RAGService,
    get_rag_service,
    create_rag_service,
)

from app.services.agent_tools import (
    AGENT_TOOL_DEFINITIONS,
    execute_tool,
    get_tools_prompt_section,
    TOOL_EXECUTORS,
)

__all__ = [
    # NVIDIA NIM Service
    "NIMExtractionService",
    "process_invoice_async",
    "process_batch_async",
    "get_extraction_service",
    "RateLimiter",

    # LangGraph Agents
    "ContableAgent",
    "LangGraphAgentsService",
    "get_contable_agent",
    "get_langgraph_service",
    "ContableAgentState",
    "AgentState",

    # Embeddings Service
    "NVIDIAEmbeddingsService",
    "EmbeddingsCache",
    "get_embeddings_service",
    "create_embeddings_service",

    # RAG Service
    "ChromaDBService",
    "RAGService",
    "get_rag_service",
    "create_rag_service",

    # Agent Tools
    "AGENT_TOOL_DEFINITIONS",
    "execute_tool",
    "get_tools_prompt_section",
    "TOOL_EXECUTORS",
]
