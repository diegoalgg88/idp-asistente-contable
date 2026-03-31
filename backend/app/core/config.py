"""
Application Configuration
Configuración centralizada usando Pydantic Settings para IDP Asistente Contable
"""

from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional
import os


class Settings(BaseSettings):
    """Application settings for IDP Asistente Contable"""

    # ==================================================================
    # APPLICATION CONFIGURATION
    # ==================================================================
    APP_NAME: str = "IDP Asistente Contable"
    APP_VERSION: str = "2.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"  # development, staging, production

    # ==================================================================
    # NVIDIA API CONFIGURATION
    # ==================================================================
    NVIDIA_API_KEY: str = ""

    # OCR/NEMO Retrieval
    NVIDIA_NIM_BASE_URL: str = "https://ai.api.nvidia.com/v1/cv"
    OCR_MODEL: str = "nvidia/nemoretriever-ocr-v1"
    TABLE_MODEL: str = "nvidia/nemoretriever-table-structure-v1"

    # Vision LLM (para extracción de facturas)
    VISION_NIM_BASE_URL: str = "https://ai.api.nvidia.com/v1/gr"
    VISION_MODEL: str = "meta/llama-3.2-90b-vision-instruct"

    # Text LLM (para razonamiento contable)
    LLM_MODEL: str = "meta/llama-3.3-70b-instruct"
    LLM_BASE_URL: str = "https://integrate.api.nvidia.com/v1"

    # Embeddings
    EMBEDDING_MODEL: str = "nvidia/nv-embedqa-e5-v5"

    # Reranking
    RERANK_MODEL: str = "nvidia/nv-rerankqa-mistral-4b-v3"

    # Search Services
    TAVILY_API_KEY: str = ""
    EXA_API_KEY: str = ""

    # ==================================================================
    # PROCESSING LIMITS
    # ==================================================================
    MAX_WORKERS: int = 4
    RATE_LIMIT: int = 40  # requests per minute (NVIDIA NIM Develop tier)
    REQUEST_TIMEOUT: int = 120  # seconds
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10 MB
    ALLOWED_EXTENSIONS: List[str] = ["pdf", "png", "jpg", "jpeg", "tiff"]

    # ==================================================================
    # DATABASE CONFIGURATION
    # ==================================================================
    DATABASE_URL: str = "postgresql://idp_user:idp_password@localhost:5432/idp_contable"
    POSTGRES_USER: str = "idp_user"
    POSTGRES_PASSWORD: str = "idp_password"
    POSTGRES_DB: str = "idp_contable"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432

    # ==================================================================
    # CHROMADB VECTOR STORE CONFIGURATION
    # ==================================================================
    CHROMA_DB_HOST: str = "localhost"
    CHROMA_DB_PORT: int = 8000
    CHROMA_DB_COLLECTION: str = "contable_documents"
    EMBEDDING_DIMENSIONS: int = 1024

    # ==================================================================
    # SECURITY & AUTHENTICATION
    # ==================================================================
    SECRET_KEY: str = "change-me-in-production"  # nosec
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ==================================================================
    # CORS CONFIGURATION
    # ==================================================================
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "http://frontend:5173",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8000",
    ]

    # ==================================================================
    # FILE STORAGE
    # ==================================================================
    UPLOAD_DIR: str = "uploads"
    DATASET_PDF_PATH: str = "dataset/pdf"
    DATASET_XML_PATH: str = "dataset/xml"
    OUTPUT_PATH: str = "output"

    # ==================================================================
    # LOGGING
    # ==================================================================
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "logs/idp_backend.log"

    # ==================================================================
    # REDIS CONFIGURATION (Rate Limiting & Cache)
    # ==================================================================
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_DB: int = 0
    REDIS_PASSWORD: Optional[str] = None
    REDIS_MAX_CONNECTIONS: int = 10
    REDIS_TIMEOUT: int = 5  # seconds

    # ==================================================================
    # PERFORMANCE TARGETS (from pilot validation)
    # ==================================================================
    TARGET_RFC_PRECISION: float = 0.98
    TARGET_UUID_PRECISION: float = 0.98
    TARGET_TOTAL_PRECISION: float = 0.95
    TARGET_LATENCY_CPU: float = 10.0  # seconds
    TARGET_LATENCY_GPU: float = 3.0  # seconds
    TARGET_THROUGHPUT: float = 0.26  # iter/s (from pilot: 98.1% precisión)
    TARGET_COST_PER_DOC: float = 0.10  # USD

    # ==================================================================
    # LANGGRAPH AGENTS
    # ==================================================================
    LANGGRAPH_DEBUG: bool = False
    LANGGRAPH_CHECKPOINT: bool = True

    def get_redis_client(self):
        """
        Get a Redis client instance for rate limiting and caching.

        Returns:
            Redis: Redis client instance

        Raises:
            ConnectionError: If Redis connection fails
        """
        from redis import Redis

        return Redis(
            host=self.REDIS_HOST,
            port=self.REDIS_PORT,
            db=self.REDIS_DB,
            decode_responses=True,
            socket_connect_timeout=self.REDIS_TIMEOUT,
            socket_timeout=self.REDIS_TIMEOUT,
        )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


def load_settings_from_env_file() -> Settings:
    """
    Carga configuración desde archivo .env, ignorando variables de entorno del sistema.
    Esto asegura que usemos los valores del archivo .env y no las variables del sistema.
    """
    from dotenv import load_dotenv

    # Limpiar variables de entorno existentes que podrían interferir
    env_vars_to_clear = [
        "NVIDIA_NIM_BASE_URL",
        "OCR_MODEL",
        "TABLE_MODEL",
        "VISION_NIM_BASE_URL",
        "VISION_MODEL",
        "NVIDIA_API_KEY",
        "LLM_MODEL",
        "EMBEDDING_MODEL",
    ]

    for var in env_vars_to_clear:
        if var in os.environ:
            del os.environ[var]

    # Cargar desde archivo .env
    env_path = os.path.join(os.path.dirname(__file__), "..", "..", ".env")
    if os.path.exists(env_path):
        load_dotenv(env_path, override=True)

    return Settings()


# Global settings instance - cargar desde archivo .env
settings = load_settings_from_env_file()


def get_settings() -> Settings:
    """Get settings instance"""
    return settings


def validate_settings() -> tuple[bool, str]:
    """
    Validate that all required settings are configured

    Returns:
        tuple: (is_valid, error_message)
    """
    if not settings.NVIDIA_API_KEY:
        return False, "NVIDIA_API_KEY no configurada. Copiar .env.example a .env y agregar tu API key"

    if not settings.NVIDIA_API_KEY.startswith("nvapi-"):
        return False, "NVIDIA_API_KEY inválida. Debe comenzar con 'nvapi-'"

    # Verificar que los directorios existen
    required_dirs = [
        settings.UPLOAD_DIR,
        settings.DATASET_PDF_PATH,
        settings.DATASET_XML_PATH,
        settings.OUTPUT_PATH,
        "logs"
    ]

    for dir_path in required_dirs:
        if not os.path.exists(dir_path):
            os.makedirs(dir_path, exist_ok=True)

    return True, "Configuración válida"


def print_settings():
    """Imprime la configuración actual para debugging"""
    print("=" * 60)
    print("CONFIGURACIÓN ACTUAL - IDP ASISTENTE CONTABLE")
    print("=" * 60)
    print(f"APP_NAME: {settings.APP_NAME}")
    print(f"APP_VERSION: {settings.APP_VERSION}")
    print(f"ENVIRONMENT: {settings.ENVIRONMENT}")
    print(f"NVIDIA_NIM_BASE_URL: {settings.NVIDIA_NIM_BASE_URL}")
    print(f"VISION_MODEL: {settings.VISION_MODEL}")
    print(f"LLM_MODEL: {settings.LLM_MODEL}")
    print(f"NVIDIA_API_KEY: {settings.NVIDIA_API_KEY[:20]}...")
    print(f"RATE_LIMIT: {settings.RATE_LIMIT} RPM")
    print(f"DATABASE_URL: {settings.DATABASE_URL}")
    print("=" * 60)
