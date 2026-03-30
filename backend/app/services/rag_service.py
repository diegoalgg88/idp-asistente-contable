"""
RAG Service - IDP Asistente Contable
Servicio para Retrieval-Augmented Generation usando ChromaDB.

Características:
- Conexión a ChromaDB (HTTP client)
- Collections separadas por usuario
- Ingesta de documentos con embeddings
- Retrieval semántico con top-k
- Metadata tracking (document_id, source, fecha, tipo)
- Batch ingestion para eficiencia

Arquitectura:
- ChromaDB como vector store
- NVIDIA NIM para embeddings
- Metadata filtering por usuario y tipo de documento
"""

import os
import time
from typing import List, Dict, Any, Optional
from datetime import datetime
import hashlib

import chromadb
from chromadb.config import Settings

from app.core.config import settings
from app.services.embeddings import get_embeddings_service, NVIDIAEmbeddingsService


class ChromaDBService:
    """
    Servicio de conexión y gestión de ChromaDB.
    
    Este servicio maneja la conexión a ChromaDB y proporciona
    métodos para crear/get collections, agregar documentos,
    y realizar búsquedas semánticas.
    
    Attributes:
        client: Cliente HTTP de ChromaDB
        host: Host de ChromaDB
        port: Puerto de ChromaDB
        embeddings_service: Servicio de embeddings
    """
    
    def __init__(
        self,
        host: Optional[str] = None,
        port: Optional[int] = None,
        embeddings_service: Optional[NVIDIAEmbeddingsService] = None
    ):
        """
        Inicializa el servicio de ChromaDB.
        
        Args:
            host: Host de ChromaDB (default: CHROMA_DB_HOST de settings)
            port: Puerto de ChromaDB (default: CHROMA_DB_PORT de settings)
            embeddings_service: Servicio de embeddings (default: get_embeddings_service())
        """
        self.host = host or settings.CHROMA_DB_HOST
        self.port = port or settings.CHROMA_DB_PORT
        
        # Inicializar cliente ChromaDB (local persistence)
        chroma_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "..", "data", "chroma")
        os.makedirs(chroma_path, exist_ok=True)
        self.client = chromadb.PersistentClient(
            path=chroma_path,
            settings=Settings(
                anonymized_telemetry=False,
            )
        )
        
        # Servicio de embeddings
        self.embeddings_service = embeddings_service or get_embeddings_service()
        
        # Cache de collections
        self._collections_cache: Dict[str, Any] = {}
    
    def _generate_document_id(self, content: str, metadata: Dict[str, Any]) -> str:
        """
        Genera ID único para un documento.
        
        Args:
            content: Contenido del documento
            metadata: Metadata del documento
            
        Returns:
            str: ID único (hash MD5)
        """
        # Combinar contenido y metadata para generar hash único
        content_hash = hashlib.md5(content.encode('utf-8')).hexdigest()
        meta_str = f"{metadata.get('user_id', '')}-{metadata.get('document_id', '')}-{metadata.get('source', '')}"
        meta_hash = hashlib.md5(meta_str.encode('utf-8')).hexdigest()
        
        return f"doc_{content_hash[:16]}_{meta_hash[:16]}"
    
    def get_or_create_collection(
        self,
        user_id: int,
        collection_name: Optional[str] = None
    ) -> chromadb.Collection:
        """
        Obtiene o crea una collection para un usuario.
        
        Args:
            user_id: ID del usuario
            collection_name: Nombre personalizado (opcional)
            
        Returns:
            chromadb.Collection: Collection obtenida o creada
        """
        if collection_name:
            name = collection_name
        else:
            name = f"user_{user_id}_documents"
        
        # Check cache
        if name in self._collections_cache:
            return self._collections_cache[name]
        
        # Crear o obtener collection
        collection = self.client.get_or_create_collection(
            name=name,
            metadata={
                "description": f"Documentos fiscales del usuario {user_id}",
                "user_id": str(user_id),
                "created_at": datetime.utcnow().isoformat(),
            }
        )
        
        # Cache
        self._collections_cache[name] = collection
        
        return collection
    
    def get_collection(self, name: str) -> Optional[chromadb.Collection]:
        """
        Obtiene una collection por nombre.
        
        Args:
            name: Nombre de la collection
            
        Returns:
            chromadb.Collection o None si no existe
        """
        try:
            # Check cache
            if name in self._collections_cache:
                return self._collections_cache[name]
            
            # Intentar obtener
            collection = self.client.get_collection(name=name)
            self._collections_cache[name] = collection
            return collection
            
        except Exception:
            return None
    
    def list_collections(self, user_id: Optional[int] = None) -> List[Dict[str, Any]]:
        """
        Lista todas las collections o las de un usuario específico.
        
        Args:
            user_id: ID del usuario para filtrar (opcional)
            
        Returns:
            List[Dict]: Lista de collections con metadata
        """
        all_collections = self.client.list_collections()
        
        results = []
        for collection in all_collections:
            metadata = collection.metadata or {}
            
            # Filtrar por usuario si se especifica
            if user_id is not None:
                if metadata.get("user_id") != str(user_id):
                    continue
            
            # Obtener count de documentos
            try:
                count = collection.count()
            except Exception:
                count = 0
            
            results.append({
                "name": collection.name,
                "description": metadata.get("description", ""),
                "user_id": metadata.get("user_id"),
                "document_count": count,
                "created_at": metadata.get("created_at"),
            })
        
        return results
    
    def delete_collection(self, name: str) -> bool:
        """
        Elimina una collection.
        
        Args:
            name: Nombre de la collection
            
        Returns:
            bool: True si se eliminó, False si no existía
        """
        try:
            self.client.delete_collection(name=name)
            
            # Limpiar cache
            if name in self._collections_cache:
                del self._collections_cache[name]
            
            return True
        except Exception:
            return False
    
    def add_document(
        self,
        collection: chromadb.Collection,
        content: str,
        metadata: Optional[Dict[str, Any]] = None,
        document_id: Optional[str] = None
    ) -> str:
        """
        Agrega un documento a la collection.
        
        Args:
            collection: Collection de ChromaDB
            content: Contenido del documento
            metadata: Metadata adicional (opcional)
            document_id: ID del documento (opcional, se genera si no se proporciona)
            
        Returns:
            str: ID del documento agregado
        """
        # Generar ID si no se proporciona
        if document_id is None:
            document_id = self._generate_document_id(content, metadata or {})
        
        # Generar embedding
        embedding = self.embeddings_service.embed_query(content)
        
        # Preparar metadata
        doc_metadata = metadata or {}
        doc_metadata["ingested_at"] = datetime.utcnow().isoformat()
        
        # Agregar a ChromaDB
        collection.add(
            ids=[document_id],
            embeddings=[embedding],
            documents=[content],
            metadatas=[doc_metadata]
        )
        
        return document_id
    
    def add_documents_batch(
        self,
        collection: chromadb.Collection,
        documents: List[Dict[str, Any]],
        batch_size: int = 100
    ) -> List[str]:
        """
        Agrega múltiples documentos en batch.
        
        Args:
            collection: Collection de ChromaDB
            documents: Lista de dicts con content, metadata, document_id
            batch_size: Tamaño del batch (default: 100)
            
        Returns:
            List[str]: Lista de IDs de documentos agregados
        """
        added_ids = []
        
        for i in range(0, len(documents), batch_size):
            batch = documents[i:i + batch_size]
            
            ids = []
            embeddings = []
            contents = []
            metadatas = []
            
            # Preparar batch
            for doc in batch:
                content = doc.get("content", "")
                metadata = doc.get("metadata", {})
                document_id = doc.get("document_id") or self._generate_document_id(content, metadata)
                
                ids.append(document_id)
                contents.append(content)
                metadatas.append({
                    **metadata,
                    "ingested_at": datetime.utcnow().isoformat()
                })
            
            # Generar embeddings en batch
            batch_embeddings = self.embeddings_service.embed_documents(contents)
            embeddings.extend(batch_embeddings)
            
            # Agregar batch
            collection.add(
                ids=ids,
                embeddings=embeddings,
                documents=contents,
                metadatas=metadatas
            )
            
            added_ids.extend(ids)
        
        return added_ids
    
    def search(
        self,
        collection: chromadb.Collection,
        query: str,
        top_k: int = 5,
        filter_metadata: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """
        Busca documentos relevantes para una query.
        
        Args:
            collection: Collection de ChromaDB
            query: Query de búsqueda
            top_k: Número de resultados (default: 5)
            filter_metadata: Filtro de metadata (opcional)
            
        Returns:
            List[Dict]: Lista de documentos con contenido, metadata y score
        """
        # Generar embedding para la query
        query_embedding = self.embeddings_service.embed_query(query)
        
        # Search en ChromaDB
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            where=filter_metadata,
            include=["documents", "metadatas", "distances"]
        )
        
        # Formatear resultados
        context = []
        
        if not results['documents'] or not results['documents'][0]:
            return context
        
        for doc, metadata, distance in zip(
            results['documents'][0],
            results['metadatas'][0],
            results['distances'][0]
        ):
            # Convertir distancia a score de relevancia (0-1)
            # Distancia más baja = más relevante
            relevance_score = max(0, 1 - distance)
            
            context.append({
                "content": doc,
                "source": metadata.get("source", "unknown"),
                "document_id": metadata.get("document_id"),
                "user_id": metadata.get("user_id"),
                "document_type": metadata.get("document_type"),
                "ingested_at": metadata.get("ingested_at"),
                "relevance_score": round(relevance_score, 4),
                "distance": round(distance, 4),
            })
        
        return context
    
    def search_by_user(
        self,
        user_id: int,
        query: str,
        top_k: int = 5,
        document_type: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Busca documentos para un usuario específico.
        
        Args:
            user_id: ID del usuario
            query: Query de búsqueda
            top_k: Número de resultados (default: 5)
            document_type: Tipo de documento (opcional)
            
        Returns:
            List[Dict]: Lista de documentos relevantes
        """
        collection = self.get_or_create_collection(user_id)
        
        # Construir filtro
        filter_metadata = {"user_id": str(user_id)}
        if document_type:
            filter_metadata["document_type"] = document_type
        
        return self.search(
            collection=collection,
            query=query,
            top_k=top_k,
            filter_metadata=filter_metadata
        )
    
    def get_document(
        self,
        collection: chromadb.Collection,
        document_id: str
    ) -> Optional[Dict[str, Any]]:
        """
        Obtiene un documento por ID.
        
        Args:
            collection: Collection de ChromaDB
            document_id: ID del documento
            
        Returns:
            Dict con documento o None si no existe
        """
        try:
            results = collection.get(
                ids=[document_id],
                include=["documents", "metadatas", "embeddings"]
            )
            
            if not results['documents'] or not results['documents'][0]:
                return None
            
            return {
                "document_id": document_id,
                "content": results['documents'][0],
                "metadata": results['metadatas'][0],
                "embedding": results['embeddings'][0] if results.get('embeddings') else None,
            }
        except Exception:
            return None
    
    def delete_document(
        self,
        collection: chromadb.Collection,
        document_id: str
    ) -> bool:
        """
        Elimina un documento por ID.
        
        Args:
            collection: Collection de ChromaDB
            document_id: ID del documento
            
        Returns:
            bool: True si se eliminó, False si no existía
        """
        try:
            collection.delete(ids=[document_id])
            return True
        except Exception:
            return False
    
    def stats(self) -> Dict[str, Any]:
        """
        Obtiene estadísticas del servicio.
        
        Returns:
            Dict con estadísticas
        """
        all_collections = self.client.list_collections()
        
        total_documents = 0
        collections_info = []
        
        for collection in all_collections:
            try:
                count = collection.count()
                total_documents += count
                collections_info.append({
                    "name": collection.name,
                    "document_count": count,
                })
            except Exception:
                pass
        
        return {
            "chromadb_host": self.host,
            "chromadb_port": self.port,
            "total_collections": len(all_collections),
            "total_documents": total_documents,
            "collections": collections_info,
            "embeddings_model": self.embeddings_service.model,
            "cache_stats": self.embeddings_service.stats(),
        }


# =============================================================================
# RAG SERVICE (High-level API)
# =============================================================================

class RAGService:
    """
    Servicio de alto nivel para RAG (Retrieval-Augmented Generation).
    
    Combina ChromaDB retrieval con generación de respuestas
    usando LLMs de NVIDIA NIM.
    
    Attributes:
        chroma_service: Servicio de ChromaDB
        embeddings_service: Servicio de embeddings
    """
    
    def __init__(
        self,
        chroma_service: Optional[ChromaDBService] = None,
        embeddings_service: Optional[NVIDIAEmbeddingsService] = None
    ):
        """
        Inicializa el servicio RAG.
        
        Args:
            chroma_service: Servicio de ChromaDB (opcional)
            embeddings_service: Servicio de embeddings (opcional)
        """
        self.chroma_service = chroma_service or ChromaDBService()
        self.embeddings_service = embeddings_service or get_embeddings_service()
    
    def ingest_document(
        self,
        user_id: int,
        content: str,
        metadata: Optional[Dict[str, Any]] = None,
        document_id: Optional[str] = None
    ) -> str:
        """
        Ingesta un documento en el sistema RAG.
        
        Args:
            user_id: ID del usuario
            content: Contenido del documento
            metadata: Metadata adicional
            document_id: ID del documento (opcional)
            
        Returns:
            str: ID del documento ingestado
        """
        collection = self.chroma_service.get_or_create_collection(user_id)
        
        # Agregar metadata por defecto
        doc_metadata = metadata or {}
        doc_metadata["user_id"] = str(user_id)
        
        return self.chroma_service.add_document(
            collection=collection,
            content=content,
            metadata=doc_metadata,
            document_id=document_id
        )
    
    def ingest_documents_batch(
        self,
        user_id: int,
        documents: List[Dict[str, Any]]
    ) -> List[str]:
        """
        Ingesta múltiples documentos en batch.
        
        Args:
            user_id: ID del usuario
            documents: Lista de documentos con content, metadata, document_id
            
        Returns:
            List[str]: Lista de IDs de documentos ingestados
        """
        collection = self.chroma_service.get_or_create_collection(user_id)
        
        # Agregar user_id a metadata
        for doc in documents:
            if "metadata" not in doc:
                doc["metadata"] = {}
            doc["metadata"]["user_id"] = str(user_id)
        
        return self.chroma_service.add_documents_batch(collection, documents)
    
    def query(
        self,
        user_id: int,
        query: str,
        top_k: int = 5,
        document_type: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Realiza una query RAG completa.
        
        Args:
            user_id: ID del usuario
            query: Query de búsqueda
            top_k: Número de resultados (default: 5)
            document_type: Tipo de documento (opcional)
            
        Returns:
            Dict con context_docs, query, y metadata
        """
        start_time = time.time()
        
        # Retrieval
        context_docs = self.chroma_service.search_by_user(
            user_id=user_id,
            query=query,
            top_k=top_k,
            document_type=document_type
        )
        
        # Construir contexto
        context_text = "\n\n".join([
            f"[Fuente: {doc['source']}] {doc['content']}"
            for doc in context_docs
        ])
        
        return {
            "query": query,
            "context": context_text,
            "context_docs": context_docs,
            "num_docs_retrieved": len(context_docs),
            "latency": time.time() - start_time,
        }
    
    def get_collections(self, user_id: Optional[int] = None) -> List[Dict[str, Any]]:
        """
        Obtiene lista de collections.
        
        Args:
            user_id: ID del usuario para filtrar (opcional)
            
        Returns:
            List[Dict]: Lista de collections
        """
        return self.chroma_service.list_collections(user_id)
    
    def delete_collection(self, user_id: int) -> bool:
        """
        Elimina la collection de un usuario.
        
        Args:
            user_id: ID del usuario
            
        Returns:
            bool: True si se eliminó
        """
        collection_name = f"user_{user_id}_documents"
        return self.chroma_service.delete_collection(collection_name)
    
    def stats(self) -> Dict[str, Any]:
        """
        Obtiene estadísticas del servicio RAG.
        
        Returns:
            Dict con estadísticas
        """
        return self.chroma_service.stats()


# =============================================================================
# SERVICE FACTORY
# =============================================================================

# Global instance
_rag_service: Optional[RAGService] = None


def get_rag_service() -> RAGService:
    """
    Factory function para obtener instancia del servicio RAG.
    
    Returns:
        RAGService: Instancia del servicio
    """
    global _rag_service
    if _rag_service is None:
        _rag_service = RAGService()
    return _rag_service


def create_rag_service() -> RAGService:
    """
    Crea una nueva instancia del servicio RAG.
    
    Returns:
        RAGService: Nueva instancia
    """
    return RAGService()
