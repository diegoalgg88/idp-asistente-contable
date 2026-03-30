"""
RAG API Endpoints
Endpoints para Retrieval-Augmented Generation con ChromaDB.

Endpoints disponibles:
- POST /v1/rag/ingest - Ingestar documento
- POST /v1/rag/ingest/batch - Ingesta batch de documentos
- POST /v1/rag/query - Query con retrieval
- GET /v1/rag/collections - Listar collections
- DELETE /v1/rag/collections/{name} - Eliminar collection
- GET /v1/rag/stats - Estadísticas del sistema RAG
"""

import json
from typing import List, Optional, Dict, Any
from datetime import datetime

from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from pydantic import BaseModel, Field

from app.core.security import get_current_user
from app.db.models import User
from app.services.rag_service import get_rag_service, RAGService
from app.agents.rag_agent import get_rag_agent, RAGAgent


router = APIRouter()


# =============================================================================
# REQUEST/RESPONSE MODELS
# =============================================================================

class IngestRequest(BaseModel):
    """Request model para ingestar documento"""
    content: str = Field(..., description="Contenido del documento")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Metadata adicional")
    document_id: Optional[str] = Field(None, description="ID del documento (opcional)")


class IngestResponse(BaseModel):
    """Response model para ingest"""
    document_id: str
    status: str
    message: str
    timestamp: datetime


class BatchIngestRequest(BaseModel):
    """Request model para ingesta batch"""
    documents: List[Dict[str, Any]] = Field(
        ...,
        description="Lista de documentos con content, metadata, document_id"
    )


class BatchIngestResponse(BaseModel):
    """Response model para ingesta batch"""
    document_ids: List[str]
    total_ingested: int
    status: str
    timestamp: datetime


class QueryRequest(BaseModel):
    """Request model para query RAG"""
    query: str = Field(..., description="Query de búsqueda")
    top_k: int = Field(default=5, ge=1, le=20, description="Número de resultados")
    document_type: Optional[str] = Field(None, description="Tipo de documento")
    include_sources: bool = Field(default=True, description="Incluir fuentes en respuesta")


class QueryResponse(BaseModel):
    """Response model para query RAG"""
    query: str
    answer: Optional[str] = Field(None, description="Respuesta generada")
    context_docs: List[Dict[str, Any]] = Field(..., description="Documentos recuperados")
    sources: Optional[List[Dict[str, Any]]] = Field(None, description="Fuentes citadas")
    num_docs_retrieved: int
    latency: float
    model_used: Optional[str] = None
    
    model_config = {"protected_namespaces": ()}


class CollectionInfo(BaseModel):
    """Información de una collection"""
    name: str
    description: Optional[str]
    user_id: Optional[str]
    document_count: int
    created_at: Optional[str]


class CollectionsResponse(BaseModel):
    """Response model para listar collections"""
    collections: List[CollectionInfo]
    total: int


class StatsResponse(BaseModel):
    """Response model para estadísticas"""
    chromadb_host: str
    chromadb_port: int
    total_collections: int
    total_documents: int
    collections: List[Dict[str, Any]]
    embeddings_model: str


# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def extract_text_from_file(file: UploadFile) -> str:
    """
    Extrae texto de un archivo subido.
    
    Args:
        file: Archivo subido (PDF, TXT, MD)
        
    Returns:
        str: Texto extraído
    """
    # Leer contenido
    content = file.file.read()
    
    # Dependiendo del tipo de archivo
    if file.filename.endswith('.txt') or file.filename.endswith('.md'):
        return content.decode('utf-8')
    elif file.filename.endswith('.pdf'):
        # Extraer texto de PDF
        try:
            import PyPDF2
            import io
            
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            return text
        except ImportError:
            raise HTTPException(
                status_code=500,
                detail="PyPDF2 no está instalado. Instalar con: pip install PyPDF2"
            )
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Error extrayendo texto del PDF: {str(e)}"
            )
    else:
        # Intentar como texto plano
        return content.decode('utf-8')


# =============================================================================
# ENDPOINTS
# =============================================================================

@router.post("/ingest", response_model=IngestResponse)
async def ingest_document(
    request: IngestRequest,
    current_user: User = Depends(get_current_user),
    rag_service: RAGService = Depends(lambda: get_rag_service())
) -> IngestResponse:
    """
    Ingesta un documento en el sistema RAG.
    
    - **content**: Contenido del documento (texto)
    - **metadata**: Metadata adicional (source, document_type, etc.)
    - **document_id**: ID del documento (opcional, se genera si no se proporciona)
    
    El documento se ingesta en la collection del usuario autenticado.
    
    Returns:
        IngestResponse: Confirmación de ingesta con ID del documento
    """
    try:
        # Ingestar documento
        document_id = rag_service.ingest_document(
            user_id=current_user.id,
            content=request.content,
            metadata=request.metadata,
            document_id=request.document_id
        )
        
        return IngestResponse(
            document_id=document_id,
            status="success",
            message="Documento ingestado exitosamente",
            timestamp=datetime.utcnow()
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error ingesting documento: {str(e)}"
        )


@router.post("/ingest/file", response_model=IngestResponse)
async def ingest_document_file(
    file: UploadFile = File(..., description="Archivo a ingestar (PDF, TXT, MD)"),
    metadata: Optional[str] = Form(None, description="Metadata en JSON"),
    document_id: Optional[str] = Form(None, description="ID del documento"),
    current_user: User = Depends(get_current_user),
    rag_service: RAGService = Depends(lambda: get_rag_service())
) -> IngestResponse:
    """
    Ingesta un archivo en el sistema RAG.
    
    - **file**: Archivo a ingestar (PDF, TXT, MD)
    - **metadata**: Metadata en formato JSON (opcional)
    - **document_id**: ID del documento (opcional)
    
    Soporta:
    - PDF: Extracción de texto automática
    - TXT/MD: Lectura directa
    
    Returns:
        IngestResponse: Confirmación de ingesta
    """
    try:
        # Extraer texto del archivo
        content = extract_text_from_file(file)
        
        # Parsear metadata
        meta = {}
        if metadata:
            try:
                meta = json.loads(metadata)
            except json.JSONDecodeError:
                raise HTTPException(
                    status_code=400,
                    detail="Metadata debe ser JSON válido"
                )
        
        # Agregar metadata por defecto
        meta["source"] = meta.get("source", file.filename or "uploaded_file")
        meta["document_type"] = meta.get("document_type", "uploaded_file")
        meta["filename"] = file.filename
        
        # Ingestar
        document_id = rag_service.ingest_document(
            user_id=current_user.id,
            content=content,
            metadata=meta,
            document_id=document_id
        )
        
        return IngestResponse(
            document_id=document_id,
            status="success",
            message=f"Archivo '{file.filename}' ingestado exitosamente",
            timestamp=datetime.utcnow()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error ingesting archivo: {str(e)}"
        )


@router.post("/ingest/batch", response_model=BatchIngestResponse)
async def ingest_documents_batch(
    request: BatchIngestRequest,
    current_user: User = Depends(get_current_user),
    rag_service: RAGService = Depends(lambda: get_rag_service())
) -> BatchIngestResponse:
    """
    Ingesta múltiples documentos en batch.
    
    - **documents**: Lista de documentos con:
        - content: Contenido del documento
        - metadata: Metadata (opcional)
        - document_id: ID del documento (opcional)
    
    Los documentos se procesan en lotes de 100 para eficiencia.
    
    Returns:
        BatchIngestResponse: Lista de IDs de documentos ingestados
    """
    try:
        # Ingestar batch
        document_ids = rag_service.ingest_documents_batch(
            user_id=current_user.id,
            documents=request.documents
        )
        
        return BatchIngestResponse(
            document_ids=document_ids,
            total_ingested=len(document_ids),
            status="success",
            timestamp=datetime.utcnow()
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error ingesting batch: {str(e)}"
        )


@router.post("/query", response_model=QueryResponse)
async def query_rag(
    request: QueryRequest,
    current_user: User = Depends(get_current_user),
    rag_service: RAGService = Depends(lambda: get_rag_service()),
    rag_agent: RAGAgent = Depends(lambda: get_rag_agent())
) -> QueryResponse:
    """
    Realiza una query con retrieval RAG.
    
    - **query**: Query de búsqueda
    - **top_k**: Número de resultados (1-20, default: 5)
    - **document_type**: Filtrar por tipo de documento (opcional)
    - **include_sources**: Incluir fuentes en respuesta (default: True)
    
    El sistema:
    1. Recupera documentos relevantes de ChromaDB
    2. Genera respuesta usando LLM con contexto
    3. Incluye citas de fuentes
    
    Returns:
        QueryResponse: Respuesta con documentos recuperados y fuentes
    """
    try:
        # Ejecutar RAG
        result = rag_agent.run(
            query=request.query,
            user_id=current_user.id,
            document_type=request.document_type
        )
        
        # Formatear respuesta
        return QueryResponse(
            query=request.query,
            answer=result.get("response"),
            context_docs=result.get("sources", []),
            sources=result.get("sources") if request.include_sources else None,
            num_docs_retrieved=result.get("num_docs_retrieved", len(result.get("sources", []))),
            latency=result.get("total_latency", 0),
            model_used=result.get("model_used")
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error executing query: {str(e)}"
        )


@router.post("/query/retrieve-only", response_model=List[Dict[str, Any]])
async def query_retrieve_only(
    request: QueryRequest,
    current_user: User = Depends(get_current_user),
    rag_service: RAGService = Depends(lambda: get_rag_service())
) -> List[Dict[str, Any]]:
    """
    Solo retrieval de documentos (sin generación de respuesta).
    
    Útil para:
    - Previsualizar documentos relevantes
    - Construir contexto personalizado
    - Debugging
    
    Returns:
        List[Dict]: Lista de documentos recuperados
    """
    try:
        # Solo retrieval
        result = rag_service.query(
            user_id=current_user.id,
            query=request.query,
            top_k=request.top_k,
        )
        
        return result.get("context_docs", [])
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving documents: {str(e)}"
        )


@router.get("/collections", response_model=CollectionsResponse)
async def list_collections(
    current_user: User = Depends(get_current_user),
    rag_service: RAGService = Depends(lambda: get_rag_service())
) -> CollectionsResponse:
    """
    Lista todas las collections del usuario.
    
    Returns:
        CollectionsResponse: Lista de collections con metadata
    """
    try:
        collections = rag_service.get_collections(user_id=current_user.id)
        
        return CollectionsResponse(
            collections=[
                CollectionInfo(
                    name=c.get("name", ""),
                    description=c.get("description"),
                    user_id=c.get("user_id"),
                    document_count=c.get("document_count", 0),
                    created_at=c.get("created_at")
                )
                for c in collections
            ],
            total=len(collections)
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error listing collections: {str(e)}"
        )


@router.delete("/collections/{collection_name}")
async def delete_collection(
    collection_name: str,
    current_user: User = Depends(get_current_user),
    rag_service: RAGService = Depends(lambda: get_rag_service())
):
    """
    Elimina una collection específica.
    
    - **collection_name**: Nombre de la collection a eliminar
    
    Returns:
        Mensaje de confirmación
    """
    try:
        # Verificar que la collection pertenece al usuario
        collections = rag_service.get_collections(user_id=current_user.id)
        collection_names = [c.get("name") for c in collections]
        
        if collection_name not in collection_names:
            raise HTTPException(
                status_code=404,
                detail=f"Collection '{collection_name}' no encontrada"
            )
        
        # Eliminar
        success = rag_service.delete_collection(user_id=current_user.id)
        
        if success:
            return {"message": f"Collection '{collection_name}' eliminada exitosamente"}
        else:
            raise HTTPException(
                status_code=500,
                detail="Error eliminando collection"
            )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error deleting collection: {str(e)}"
        )


@router.get("/stats", response_model=StatsResponse)
async def get_rag_stats(
    current_user: User = Depends(get_current_user),
    rag_service: RAGService = Depends(lambda: get_rag_service())
) -> StatsResponse:
    """
    Obtiene estadísticas del sistema RAG.
    
    Returns:
        StatsResponse: Estadísticas detalladas
    """
    try:
        stats = rag_service.stats()
        
        return StatsResponse(
            chromadb_host=stats.get("chromadb_host", ""),
            chromadb_port=stats.get("chromadb_port", 0),
            total_collections=stats.get("total_collections", 0),
            total_documents=stats.get("total_documents", 0),
            collections=stats.get("collections", []),
            embeddings_model=stats.get("embeddings_model", "")
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting stats: {str(e)}"
        )


@router.get("/health")
async def rag_health_check(
    rag_service: RAGService = Depends(lambda: get_rag_service())
):
    """
    Health check del sistema RAG.
    
    Verifica:
    - Conexión a ChromaDB
    - Servicio de embeddings
    
    Returns:
        Health status
    """
    try:
        # Check ChromaDB
        stats = rag_service.stats()
        
        return {
            "status": "healthy",
            "chromadb": {
                "host": stats.get("chromadb_host"),
                "port": stats.get("chromadb_port"),
                "collections": stats.get("total_collections"),
                "documents": stats.get("total_documents"),
            },
            "embeddings": {
                "model": stats.get("embeddings_model"),
            }
        }
        
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }
