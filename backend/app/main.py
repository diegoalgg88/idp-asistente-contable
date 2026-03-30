"""
IDP Asistente Contable - FastAPI Backend
Punto de entrada principal de la aplicación

Endpoints disponibles:
- GET / - Root endpoint
- GET /health - Health check
- GET /docs - OpenAPI/Swagger documentation
- GET /redoc - ReDoc documentation
- POST /v1/auth/token - OAuth2 token endpoint
- POST /v1/idp/process - Process single document
- POST /v1/idp/batch-process - Batch document processing
- GET /v1/idp/{document_id} - Get document status
- POST /v1/chat/message - Send chat message
- GET /v1/chat/conversation/{id} - Get conversation
"""

import os
from contextlib import asynccontextmanager
from typing import AsyncGenerator

import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.starlette import StarletteIntegration

# =============================================================================
# SENTRY INITIALIZATION - MUST BE BEFORE FastAPI APP CREATION
# =============================================================================
# Initialize Sentry SDK for error monitoring, tracing, and profiling
# This must happen BEFORE creating the FastAPI application instance

sentry_sdk.init(
    dsn=os.environ.get("SENTRY_DSN"),
    environment=os.environ.get("SENTRY_ENVIRONMENT", "development"),
    # release=os.environ.get("SENTRY_RELEASE"),  # e.g., "idp-asistente-contable@2.0.0"
    
    # Error monitoring - capture all unhandled exceptions
    send_default_pii=True,
    
    # Tracing - sample rate for performance monitoring
    # In production, reduce to 0.1-0.2 for high-traffic apps
    traces_sample_rate=float(os.environ.get("SENTRY_TRACES_SAMPLE_RATE", 1.0)),
    
    # Profiling - continuous profiling tied to active spans
    profile_session_sample_rate=float(os.environ.get("SENTRY_PROFILES_SAMPLE_RATE", 0.5)),
    profile_lifecycle="trace",
    
    # Enable structured logs (SDK >= 2.35.0)
    enable_logs=True,
    
    # Debug mode - set to True for SDK troubleshooting
    debug=os.environ.get("SENTRY_DEBUG", "false").lower() == "true",
    
    # Integrations - auto-enabled for FastAPI/Starlette but explicit is better
    integrations=[
        FastApiIntegration(),
        StarletteIntegration(),
    ],
    
    # Ignore health check endpoints from tracing
    before_send_transaction=lambda event, hint: None if event.get("transaction") in ["/health", "/health/detailed"] else event,
)

from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
import logging

# =============================================================================
# LOGGING CONFIGURATION - Reduce SQLAlchemy verbose logs
# =============================================================================
# Set SQLAlchemy engine logging to WARNING to reduce noise in development
# Only show HTTP requests and actual errors
logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
logging.getLogger("sqlalchemy.pool").setLevel(logging.WARNING)
logging.getLogger("sqlalchemy.dialects").setLevel(logging.WARNING)

from app.api import idp, chat, agent, workspace, clients as clients_api, fiscal, payroll, finance, expenses, users, auth, rag, reconciliation, classification, predictive, risks, audit
from app.core.config import settings, validate_settings
from app.core.rate_limiter import get_limiter
from app.db.database import init_db


# =============================================================================
# LIFESPAN MANAGEMENT
# =============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator:
    """
    Lifespan context manager for startup and shutdown events.
    
    Startup:
    - Initialize database tables
    - Setup rate limiter
    - Load models
    
    Shutdown:
    - Cleanup resources
    """
    # Startup
    print("=" * 60)
    print(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    print("=" * 60)
    
    # Initialize database
    init_db()
    print("✓ Database initialized")
    
    # Create upload directories
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    os.makedirs(settings.DATASET_PDF_PATH, exist_ok=True)
    os.makedirs(settings.DATASET_XML_PATH, exist_ok=True)
    os.makedirs("logs", exist_ok=True)
    print("✓ Directories created")
    
    # Validate settings
    is_valid, message = validate_settings()
    if not is_valid:
        print(f"⚠ Warning: {message}")
    else:
        print("✓ Settings validated")
    
    print("=" * 60)
    
    yield
    
    # Shutdown
    print("=" * 60)
    print(f"Shutting down {settings.APP_NAME}")
    print("=" * 60)


# =============================================================================
# RATE LIMITER CONFIGURATION
# =============================================================================

# Create rate limiter using factory (Redis with fallback to memory)
limiter = get_limiter(default_limits=[f"{settings.RATE_LIMIT} per minute"])


# =============================================================================
# APPLICATION FACTORY
# =============================================================================

def create_app() -> FastAPI:
    """
    Application factory for creating FastAPI app.
    
    Returns:
        FastAPI: Configured FastAPI application
    """
    app = FastAPI(
        title=settings.APP_NAME,
        description="""
## IDP Asistente Contable API

Intelligent Document Processing (IDP) system for Mexican contable documents.

### Features

**Document Processing (IDP)**
- Extract data from CFDI invoices (PDF, images)
- Validate RFCs using SAT rules
- Automatic confidence scoring
- Batch processing support

**Conversational Assistant**
- AI-powered contable assistant
- RAG with Mexican fiscal legislation
- Context-aware responses
- Streaming support

**RAG (Retrieval-Augmented Generation)**
- Document ingestion with NVIDIA embeddings
- Semantic search with ChromaDB
- Context-aware query responses
- Source citation

### Authentication

Most endpoints require authentication using JWT tokens.
Obtain a token at `POST /v1/auth/token`.

### Rate Limiting

Default rate limit: **40 requests per minute** (NVIDIA NIM Develop tier)
        """,
        version=settings.APP_VERSION,
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        lifespan=lifespan,
    )
    
    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Add rate limiter
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
    app.add_middleware(SlowAPIMiddleware)
    
    # Include routers
    app.include_router(auth.router, prefix="/v1/auth", tags=["Auth"])
    app.include_router(idp.router, prefix="/v1/idp", tags=["IDP"])
    app.include_router(chat.router, prefix="/v1/chat", tags=["Chat"])
    app.include_router(agent.router, prefix="/v1/agent", tags=["Agent"])
    app.include_router(workspace.router, prefix="/v1/workspace", tags=["Workspace"])
    app.include_router(clients_api.router, prefix="/v1/clients", tags=["Clients"])
    app.include_router(fiscal.router, prefix="/v1/fiscal", tags=["Fiscal"])
    app.include_router(payroll.router, prefix="/v1/payroll", tags=["Payroll"])
    app.include_router(finance.router, prefix="/v1/finance", tags=["Finance"])
    app.include_router(expenses.router, prefix="/v1/expenses", tags=["Expenses"])
    app.include_router(users.router, prefix="/v1/users", tags=["Users"])
    app.include_router(rag.router, prefix="/v1/rag", tags=["RAG"])
    app.include_router(reconciliation.router, prefix="/v1/reconciliation", tags=["Reconciliation"])
    app.include_router(classification.router, prefix="/v1/classification", tags=["Classification"])
    app.include_router(predictive.router, prefix="/v1/predictive", tags=["Predictive Dashboard"])
    app.include_router(risks.router, prefix="/v1/risks", tags=["Risk Management"])
    app.include_router(payroll.router, prefix="/v1/payroll", tags=["Payroll"])
    app.include_router(fiscal.router, prefix="/v1/fiscal", tags=["Fiscal"])
    app.include_router(audit.router, prefix="/v1/audit", tags=["Audit"])
    
    # Register global exception handler
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        """Global exception handler"""
        print(f"Unhandled exception: {exc}")
        return JSONResponse(
            status_code=500,
            content={
                "detail": "Internal server error",
                "type": type(exc).__name__,
            }
        )
    
    return app


# Create application instance
app = create_app()


# =============================================================================
# GLOBAL ENDPOINTS
# =============================================================================

@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint.
    
    Returns basic information about the API.
    """
    return {
        "message": f"Bienvenido a {settings.APP_NAME} API",
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "redoc": "/redoc",
        "openapi": "/openapi.json",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint.
    
    Returns the health status of the service.
    """
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
    }


@app.get("/health/detailed", tags=["Health"])
async def detailed_health_check():
    """
    Detailed health check with component status.
    
    Checks:
    - Database connection
    - NVIDIA API connectivity
    - Disk space
    """
    import shutil
    
    health_status = {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "components": {}
    }
    
    # Check database
    try:
        from app.db.database import engine
        with engine.connect() as conn:
            conn.execute("SELECT 1")
        health_status["components"]["database"] = {
            "status": "healthy",
            "type": "postgresql"
        }
    except Exception as e:
        health_status["components"]["database"] = {
            "status": "unhealthy",
            "error": str(e)
        }
        health_status["status"] = "degraded"
    
    # Check disk space
    try:
        total, used, free = shutil.disk_usage("/")
        health_status["components"]["disk"] = {
            "status": "healthy" if free > 1024 * 1024 * 1024 else "warning",
            "total_gb": total // (1024 * 1024 * 1024),
            "used_gb": used // (1024 * 1024 * 1024),
            "free_gb": free // (1024 * 1024 * 1024),
        }
    except Exception as e:
        health_status["components"]["disk"] = {
            "status": "unknown",
            "error": str(e)
        }
    
    # Check NVIDIA API
    try:
        import requests
        response = requests.get(
            settings.NVIDIA_NIM_BASE_URL,
            headers={"Authorization": f"Bearer {settings.NVIDIA_API_KEY}"},
            timeout=5
        )
        health_status["components"]["nvidia_api"] = {
            "status": "healthy" if response.status_code != 401 else "unhealthy",
            "base_url": settings.NVIDIA_NIM_BASE_URL
        }
    except Exception as e:
        health_status["components"]["nvidia_api"] = {
            "status": "unknown",
            "error": str(e)
        }
    
    return health_status


# =============================================================================
# SENTRY TEST ENDPOINTS (Development Only)
# =============================================================================

@app.get("/sentry-test/message", tags=["Sentry Test"])
async def sentry_test_message():
    """
    Sentry test endpoint - sends a test message.
    
    Use this to verify Sentry SDK is properly configured.
    Check your Sentry dashboard at https://sentry.io/
    
    Returns:
        Message ID for tracking
    """
    import sentry_sdk
    
    message_id = sentry_sdk.capture_message("Sentry SDK test message from IDP Asistente Contable")
    
    return {
        "status": "message_sent",
        "message_id": message_id,
        "dsn": os.environ.get("SENTRY_DSN", "not_configured")[:50] + "...",
        "environment": os.environ.get("SENTRY_ENVIRONMENT", "not_configured"),
        "instructions": "Check your Sentry dashboard to verify the message was received",
    }


@app.get("/sentry-test/error", tags=["Sentry Test"])
async def sentry_test_error():
    """
    Sentry test endpoint - triggers a test error.

    WARNING: This will raise an exception and send it to Sentry.
    Use only for testing Sentry integration.

    Check your Sentry dashboard at https://sentry.io/
    """
    # This will trigger an error event in Sentry
    raise ValueError("Sentry SDK test error - this is intentional for testing purposes")


# =============================================================================
# WEBSOCKET ENDPOINTS - Real-time workflow progress
# =============================================================================

# Store active WebSocket connections
# Key: workflow_id, Value: list of WebSocket connections
active_workflow_connections: dict[int, list[WebSocket]] = {}


@app.websocket("/ws/workflows/{workflow_id}")
async def workflow_websocket(websocket: WebSocket, workflow_id: int):
    """
    WebSocket endpoint for real-time workflow progress updates.
    
    Clients connect to receive live updates as workflows execute.
    Messages are sent as JSON with progress percentage and status.
    
    Example client connection:
        ws = new WebSocket('ws://localhost:8000/ws/workflows/123')
        ws.onmessage = (event) => console.log(JSON.parse(event.data))
    """
    from app.db.database import get_db
    from app.db.models import Workflow
    import json
    
    # Accept WebSocket connection
    await websocket.accept()
    
    # Initialize DB session
    db = next(get_db())
    
    try:
        # Verify workflow exists
        workflow = db.query(Workflow).filter(Workflow.id == workflow_id).first()
        if not workflow:
            await websocket.send_json({"error": "Workflow not found"})
            await websocket.close()
            return
        
        # Register connection
        if workflow_id not in active_workflow_connections:
            active_workflow_connections[workflow_id] = []
        active_workflow_connections[workflow_id].append(websocket)
        
        # Send initial state
        await websocket.send_json({
            "type": "init",
            "workflow_id": workflow_id,
            "status": workflow.status,
            "progress": workflow.progress,
            "steps_completed": workflow.steps_completed,
            "steps_total": workflow.steps_total
        })
        
        # Keep connection alive and listen for client messages
        while True:
            # Receive messages from client (ping/pong or commands)
            data = await websocket.receive_text()
            
            try:
                message = json.loads(data)
                
                # Handle ping
                if message.get("type") == "ping":
                    await websocket.send_json({"type": "pong"})
                
                # Handle subscribe to updates
                elif message.get("type") == "subscribe":
                    await websocket.send_json({
                        "type": "subscribed",
                        "workflow_id": workflow_id
                    })
                    
            except json.JSONDecodeError:
                # Ignore non-JSON messages
                pass
    
    except WebSocketDisconnect:
        # Client disconnected - remove from active connections
        pass
    
    finally:
        # Cleanup: remove connection from list
        if workflow_id in active_workflow_connections:
            active_workflow_connections[workflow_id] = [
                ws for ws in active_workflow_connections[workflow_id]
                if ws != websocket
            ]
            if not active_workflow_connections[workflow_id]:
                del active_workflow_connections[workflow_id]
        
        db.close()


async def broadcast_workflow_progress(workflow_id: int, progress: int, status: str, **extra_data):
    """
    Broadcast workflow progress to all connected WebSocket clients.
    
    Args:
        workflow_id: ID of the workflow
        progress: Progress percentage (0-100)
        status: Current status (pending, running, completed, failed)
        **extra_data: Additional data to include in the message
    """
    if workflow_id not in active_workflow_connections:
        return
    
    message = {
        "type": "progress_update",
        "workflow_id": workflow_id,
        "progress": progress,
        "status": status,
        **extra_data
    }
    
    disconnected = []
    for websocket in active_workflow_connections[workflow_id]:
        try:
            await websocket.send_json(message)
        except Exception:
            # Mark for disconnection
            disconnected.append(websocket)
    
    # Remove disconnected clients
    for ws in disconnected:
        active_workflow_connections[workflow_id].remove(ws)
    
    if not active_workflow_connections[workflow_id]:
        del active_workflow_connections[workflow_id]
