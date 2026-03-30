"""
NVIDIA Embeddings Service - IDP Asistente Contable
Servicio para generación de embeddings usando NVIDIA NIM Embeddings.

Modelos utilizados:
- nvidia/nv-embedqa-e5-v5: Embeddings de alta calidad para RAG
- nvidia/nv-embedqa-mistral-7b-v2: Alternativa para casos específicos

Características:
- Rate limiting thread-safe (40 RPM para NVIDIA NIM Develop)
- Batch embedding generation
- Cache de embeddings para optimización
- Retry con exponential backoff
"""

import hashlib
import threading
import time
from typing import List, Dict, Any, Optional, Tuple
import requests

from app.core.config import settings


class EmbeddingsCache:
    """
    Cache en memoria para embeddings generados.
    
    Usa hash MD5 del texto como clave para lookup rápido.
    Thread-safe con lock para acceso concurrente.
    
    Attributes:
        cache: Diccionario de embeddings cacheados
        lock: Lock para thread-safety
        max_size: Tamaño máximo del cache (LRU eviction)
    """
    
    def __init__(self, max_size: int = 10000):
        """
        Inicializa el cache de embeddings.
        
        Args:
            max_size: Tamaño máximo del cache (default: 10000)
        """
        self.cache: Dict[str, List[float]] = {}
        self.lock = threading.Lock()
        self.max_size = max_size
        self.access_order: List[str] = []
    
    def _generate_key(self, text: str) -> str:
        """Genera clave MD5 para un texto"""
        return hashlib.md5(text.encode('utf-8')).hexdigest()
    
    def get(self, text: str) -> Optional[List[float]]:
        """
        Obtiene embedding cacheado.
        
        Args:
            text: Texto para buscar en cache
            
        Returns:
            Embedding si existe, None otherwise
        """
        key = self._generate_key(text)
        
        with self.lock:
            if key in self.cache:
                # Mover al final para LRU
                self.access_order.remove(key)
                self.access_order.append(key)
                return self.cache[key]
            return None
    
    def set(self, text: str, embedding: List[float]) -> None:
        """
        Guarda embedding en cache.
        
        Args:
            text: Texto original
            embedding: Vector de embedding
        """
        key = self._generate_key(text)
        
        with self.lock:
            # Evitar duplicados
            if key in self.cache:
                return
            
            # LRU eviction si está lleno
            if len(self.cache) >= self.max_size:
                oldest_key = self.access_order.pop(0)
                del self.cache[oldest_key]
            
            self.cache[key] = embedding
            self.access_order.append(key)
    
    def clear(self) -> None:
        """Limpia todo el cache"""
        with self.lock:
            self.cache.clear()
            self.access_order.clear()
    
    def stats(self) -> Dict[str, Any]:
        """Obtiene estadísticas del cache"""
        with self.lock:
            return {
                "size": len(self.cache),
                "max_size": self.max_size,
                "hit_rate": "N/A"  # Podría implementarse tracking
            }


class NVIDIAEmbeddingsService:
    """
    Servicio de embeddings con NVIDIA NIM.
    
    Este servicio genera embeddings de alta calidad usando
    el modelo nvidia/nv-embedqa-e5-v5 para aplicaciones RAG.
    
    Features:
    - Rate limiting thread-safe (40 RPM)
    - Batch embedding generation (hasta 100 textos)
    - Cache de embeddings para optimización
    - Retry con exponential backoff
    - Normalización de vectores opcional
    
    Attributes:
        api_key: API key de NVIDIA
        embeddings_url: URL del endpoint de embeddings
        model: Modelo de embeddings a utilizar
        timeout: Timeout para requests HTTP
        rate_limiter: Controlador de rate limiting
        cache: Cache de embeddings
        max_retries: Número máximo de reintentos
        base_backoff: Tiempo base para backoff (segundos)
    """
    
    def __init__(self, model: Optional[str] = None, use_cache: bool = True):
        """
        Inicializa el servicio de embeddings.
        
        Args:
            model: Modelo de embeddings (default: EMBEDDING_MODEL de settings)
            use_cache: Habilitar cache de embeddings (default: True)
        """
        self.api_key = settings.NVIDIA_API_KEY
        self.model = model or settings.EMBEDDING_MODEL
        self.embeddings_url = f"{settings.LLM_BASE_URL}/embeddings"
        self.timeout = settings.REQUEST_TIMEOUT
        
        # Rate limiting (thread-safe)
        self.rate_limiter = self._RateLimiter(max_rpm=settings.RATE_LIMIT)
        
        # Cache de embeddings
        self.cache = EmbeddingsCache() if use_cache else None
        
        # Retry config
        self.max_retries = 5
        self.base_backoff = 2.0  # seconds
        
        # Dimensiones del embedding (depende del modelo)
        self.dimensions = self._get_model_dimensions()
    
    class _RateLimiter:
        """Rate limiter interno para embeddings"""
        
        def __init__(self, max_rpm: int = 40):
            self.max_rpm = max_rpm
            self.requests: List[float] = []
            self.lock = threading.Lock()
        
        def wait_if_needed(self) -> None:
            """Espera si se alcanzó el límite"""
            with self.lock:
                now = time.time()
                self.requests = [t for t in self.requests if now - t < 60]
                
                if len(self.requests) >= self.max_rpm:
                    sleep_time = 60 - (now - self.requests[0]) + 0.1
                    time.sleep(sleep_time)
                    now = time.time()
                    self.requests = [t for t in self.requests if now - t < 60]
                
                self.requests.append(time.time())
    
    def _get_model_dimensions(self) -> int:
        """Obtiene dimensiones del embedding según el modelo"""
        model_dims = {
            "nvidia/nv-embedqa-e5-v5": 1024,
            "nvidia/nv-embedqa-mistral-7b-v2": 1024,
            "nvidia/nv-embedqa-e5-v4": 1024,
        }
        return model_dims.get(self.model, settings.EMBEDDING_DIMENSIONS)
    
    def _normalize_vector(self, vector: List[float]) -> List[float]:
        """
        Normaliza un vector a unit length (L2 norm).
        
        Args:
            vector: Vector de embeddings
            
        Returns:
            Vector normalizado
        """
        import math
        norm = math.sqrt(sum(x * x for x in vector))
        if norm == 0:
            return vector
        return [x / norm for x in vector]
    
    def embed_query(self, text: str, normalize: bool = True) -> List[float]:
        """
        Genera embedding para una query de texto.
        
        Args:
            text: Texto a embeddear
            normalize: Normalizar vector (default: True)
            
        Returns:
            List[float]: Vector de embedding
            
        Raises:
            Exception: Si falla la generación del embedding
        """
        # Check cache
        if self.cache:
            cached = self.cache.get(text)
            if cached:
                return cached
        
        self.rate_limiter.wait_if_needed()
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        
        # Prefix para queries (E5 model best practice)
        query_prefix = "query: "
        if not text.startswith(query_prefix):
            text_for_api = query_prefix + text
        else:
            text_for_api = text
        
        payload = {
            "model": self.model,
            "input": [text_for_api],
            "encoding_format": "float",
            "input_type": "query"
        }
        
        for attempt in range(self.max_retries + 1):
            start_time = time.time()
            try:
                response = requests.post(
                    self.embeddings_url,
                    headers=headers,
                    json=payload,
                    timeout=self.timeout
                )
                
                elapsed = time.time() - start_time
                
                if response.status_code == 429:
                    if attempt < self.max_retries:
                        wait = self.base_backoff * (2 ** attempt)
                        time.sleep(wait)
                        continue
                    else:
                        raise Exception(f"Rate limit exceeded after {self.max_retries} retries")
                
                if response.status_code != 200:
                    raise Exception(f"API Error {response.status_code}: {response.text}")
                
                result = response.json()
                embedding = result["data"][0]["embedding"]
                
                if normalize:
                    embedding = self._normalize_vector(embedding)
                
                # Cache result
                if self.cache:
                    self.cache.set(text, embedding)
                
                return embedding
                
            except requests.exceptions.Timeout:
                if attempt < self.max_retries:
                    time.sleep(self.base_backoff * (2 ** attempt))
                    continue
                raise Exception("Timeout generating embedding")
            except Exception as e:
                if attempt < self.max_retries:
                    time.sleep(self.base_backoff * (2 ** attempt))
                    continue
                raise Exception(f"Error generating embedding: {str(e)}")
        
        raise Exception("Max retries exceeded")
    
    def embed_documents(
        self,
        texts: List[str],
        normalize: bool = True,
        batch_size: int = 100
    ) -> List[List[float]]:
        """
        Genera embeddings para múltiples documentos en batch.
        
        Args:
            texts: Lista de textos a embeddear
            normalize: Normalizar vectores (default: True)
            batch_size: Tamaño del batch (default: 100)
            
        Returns:
            List[List[float]]: Lista de vectores de embedding
            
        Raises:
            Exception: Si falla la generación de embeddings
        """
        if not texts:
            return []
        
        all_embeddings = []
        
        # Procesar en batches
        for i in range(0, len(texts), batch_size):
            batch_texts = texts[i:i + batch_size]
            batch_embeddings = self._embed_batch(batch_texts, normalize)
            all_embeddings.extend(batch_embeddings)
        
        return all_embeddings
    
    def _embed_batch(
        self,
        texts: List[str],
        normalize: bool = True
    ) -> List[List[float]]:
        """
        Genera embeddings para un batch de textos.
        
        Args:
            texts: Lista de textos
            normalize: Normalizar vectores
            
        Returns:
            List[List[float]]: Lista de embeddings
        """
        # Check cache primero
        cached_indices = []
        uncached_texts = []
        uncached_indices = []
        
        for i, text in enumerate(texts):
            if self.cache:
                cached = self.cache.get(text)
                if cached:
                    cached_indices.append((i, cached))
                    continue
            uncached_texts.append(text)
            uncached_indices.append(i)
        
        # Si todos están cacheados, retornar
        if not uncached_texts:
            result = [None] * len(texts)
            for idx, emb in cached_indices:
                result[idx] = emb
            return result
        
        self.rate_limiter.wait_if_needed()
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        
        # Prefix para documentos (E5 model best practice)
        doc_prefix = "passage: "
        texts_for_api = [
            doc_prefix + text if not text.startswith(doc_prefix) else text
            for text in uncached_texts
        ]
        
        payload = {
            "model": self.model,
            "input": texts_for_api,
            "encoding_format": "float",
            "input_type": "passage"
        }
        
        for attempt in range(self.max_retries + 1):
            start_time = time.time()
            try:
                response = requests.post(
                    self.embeddings_url,
                    headers=headers,
                    json=payload,
                    timeout=self.timeout
                )
                
                elapsed = time.time() - start_time
                
                if response.status_code == 429:
                    if attempt < self.max_retries:
                        wait = self.base_backoff * (2 ** attempt)
                        time.sleep(wait)
                        continue
                    else:
                        raise Exception(f"Rate limit exceeded after {self.max_retries} retries")
                
                if response.status_code != 200:
                    raise Exception(f"API Error {response.status_code}: {response.text}")
                
                result = response.json()
                embeddings = [item["embedding"] for item in result["data"]]
                
                if normalize:
                    embeddings = [self._normalize_vector(emb) for emb in embeddings]
                
                # Cache results
                if self.cache:
                    for text, emb in zip(uncached_texts, embeddings):
                        self.cache.set(text, emb)
                
                # Construir resultado final
                final_result = [None] * len(texts)
                
                # Insertar cacheados
                for idx, emb in cached_indices:
                    final_result[idx] = emb
                
                # Insertar nuevos
                for i, emb in enumerate(embeddings):
                    final_result[uncached_indices[i]] = emb
                
                return final_result
                
            except requests.exceptions.Timeout:
                if attempt < self.max_retries:
                    time.sleep(self.base_backoff * (2 ** attempt))
                    continue
                raise Exception("Timeout generating embeddings")
            except Exception as e:
                if attempt < self.max_retries:
                    time.sleep(self.base_backoff * (2 ** attempt))
                    continue
                raise Exception(f"Error generating embeddings: {str(e)}")
        
        raise Exception("Max retries exceeded")
    
    def embed_query_document_pair(
        self,
        query: str,
        document: str
    ) -> Tuple[List[float], List[float]]:
        """
        Genera embeddings para query y documento (optimizado para similarity).
        
        Args:
            query: Texto de la query
            document: Texto del documento
            
        Returns:
            Tuple[List[float], List[float]]: Embeddings de query y documento
        """
        # Usar prefixes apropiados para E5
        query_emb = self.embed_query(query, normalize=True)
        doc_emb = self.embed_query(document, normalize=True)
        
        return query_emb, doc_emb
    
    def cosine_similarity(
        self,
        embedding1: List[float],
        embedding2: List[float]
    ) -> float:
        """
        Calcula similitud coseno entre dos embeddings.
        
        Args:
            embedding1: Primer embedding
            embedding2: Segundo embedding
            
        Returns:
            float: Similitud coseno (-1 a 1)
        """
        if len(embedding1) != len(embedding2):
            raise ValueError("Embeddings deben tener la misma dimensión")
        
        dot_product = sum(a * b for a, b in zip(embedding1, embedding2))
        norm1 = sum(a * a for a in embedding1) ** 0.5
        norm2 = sum(b * b for b in embedding2) ** 0.5
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
        
        return dot_product / (norm1 * norm2)
    
    def stats(self) -> Dict[str, Any]:
        """
        Obtiene estadísticas del servicio.
        
        Returns:
            Dict con estadísticas
        """
        stats = {
            "model": self.model,
            "dimensions": self.dimensions,
            "cache": self.cache.stats() if self.cache else None,
        }
        return stats


# =============================================================================
# SERVICE FACTORY
# =============================================================================

# Global instance
_embeddings_service: Optional[NVIDIAEmbeddingsService] = None


def get_embeddings_service(
    model: Optional[str] = None,
    use_cache: bool = True
) -> NVIDIAEmbeddingsService:
    """
    Factory function para obtener instancia del servicio de embeddings.
    
    Args:
        model: Modelo de embeddings (opcional)
        use_cache: Habilitar cache (default: True)
        
    Returns:
        NVIDIAEmbeddingsService: Instancia del servicio
    """
    global _embeddings_service
    if _embeddings_service is None:
        _embeddings_service = NVIDIAEmbeddingsService(model=model, use_cache=use_cache)
    return _embeddings_service


def create_embeddings_service(
    model: Optional[str] = None,
    use_cache: bool = True
) -> NVIDIAEmbeddingsService:
    """
    Crea una nueva instancia del servicio de embeddings.
    
    Args:
        model: Modelo de embeddings (opcional)
        use_cache: Habilitar cache (default: True)
        
    Returns:
        NVIDIAEmbeddingsService: Nueva instancia
    """
    return NVIDIAEmbeddingsService(model=model, use_cache=use_cache)
