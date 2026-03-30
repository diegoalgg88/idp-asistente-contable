# Sentry Backend Setup Guide - Python/FastAPI

**Fecha:** 2026-03-10  
**Backend:** FastAPI + Python 3.11+  
**Estado:** 📋 Pendiente de implementación

---

## 📦 Instalación

### 1. Agregar Sentry SDK

```bash
cd backend

# Instalar Sentry SDK con integración para FastAPI
pip install sentry-sdk[fastapi]

# O con uv
uv add sentry-sdk[fastapi]

# Agregar a requirements.txt
echo "sentry-sdk[fastapi]>=2.0.0" >> requirements.txt
```

### 2. Versión Mínima Requerida

```
sentry-sdk>=2.0.0  # Requiere Python 3.6+
```

**Recomendado:** `sentry-sdk>=2.10.0` (última versión estable)

---

## 🔧 Configuración

### 1. Variables de Entorno

Agregar al `.env` del backend:

```bash
# backend/.env

# =============================================================================
# SENTRY ERROR TRACKING
# =============================================================================
SENTRY_DSN=https://1dfa0654de01be53784b27bf36ec7b51@o4510725289476096.ingest.us.sentry.io/4511020049891328
SENTRY_ENVIRONMENT=development
SENTRY_TRACES_SAMPLE_RATE=0.1
SENTRY_PROFILES_SAMPLE_RATE=0.1

# Para producción (no commitear)
# SENTRY_AUTH_TOKEN=sntrys_...
```

### 2. Inicialización en `main.py`

**Ubicación:** `backend/app/main.py` o donde se inicializa FastAPI

```python
from fastapi import FastAPI
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.starlette import StarletteIntegration
import os

# =============================================================================
# SENTRY INIT - Debe ir ANTES de crear la app de FastAPI
# =============================================================================
sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    environment=os.getenv("SENTRY_ENVIRONMENT", "development"),
    traces_sample_rate=float(os.getenv("SENTRY_TRACES_SAMPLE_RATE", "0.1")),
    profiles_sample_rate=float(os.getenv("SENTRY_PROFILES_SAMPLE_RATE", "0.1")),
    send_default_pii=True,  # Incluir IP, headers, etc.
    integrations=[
        FastApiIntegration(),
        StarletteIntegration(),
    ],
    
    # Opcional: Filtrar datos sensibles
    before_send=lambda event, hint: filter_sensitive_data(event, hint),
    
    # Opcional: Sampling dinámico
    traces_sampler=lambda ctx: traces_sampler(ctx),
    
    # Debug en desarrollo
    debug=os.getenv("SENTRY_ENVIRONMENT") != "production",
)

def filter_sensitive_data(event, hint):
    """Filtrar datos sensibles antes de enviar a Sentry"""
    # Remover cookies sensibles
    if 'request' in event:
        event['request'].pop('cookies', None)
    
    # Enmascarar Authorization header
    if 'request' in event and 'headers' in event['request']:
        headers = event['request']['headers']
        if 'authorization' in headers:
            headers['authorization'] = 'Bearer ***REDACTED***'
    
    return event

def traces_sampler(ctx):
    """Sampling dinámico basado en tipo de transacción"""
    # Rate base
    rate = 0.1  # 10% default
    
    # Muestreo completo para endpoints críticos
    if ctx.get('asgi', {}).get('path', '').startswith('/api/v1/chat'):
        rate = 0.5
    
    # Muestreo reducido para health checks
    if ctx.get('asgi', {}).get('path', '') == '/health':
        rate = 0.01
    
    return rate

# =============================================================================
# FASTAPI APP
# =============================================================================
app = FastAPI(title="IDP Asistente Contable API")

# ... resto del código
```

### 3. Middleware para Rate Limiting (Opcional)

Si usas SlowAPI para rate limiting:

```python
from slowapi import SlowAPI, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request
import sentry_sdk

# Inicializar SlowAPI
limiter = SlowAPI(storage_uri="memory")  # O Redis en producción
app.state.limiter = limiter

# Manejador de rate limit con Sentry
@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    # Capturar en Sentry
    sentry_sdk.capture_message(
        f"Rate limit exceeded: {request.url.path}",
        level="warning",
        extras={
            "path": request.url.path,
            "method": request.method,
            "client_ip": get_remote_address(request),
        }
    )
    
    # Retornar respuesta estándar
    return JSONResponse(
        status_code=429,
        content={"detail": "Too many requests. Please try again later."}
    )

# Agregar middleware
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
```

---

## 🎯 Instrumentación Específica

### 1. LangChain / LangGraph Integration

El backend usa LangChain y LangGraph. Sentry los instrumenta automáticamente:

```python
# No se necesita configuración adicional!
# Sentry captura automáticamente:
# - LLM calls (NVIDIA NIM, OpenAI, etc.)
# - Agent execution
# - Tool usage
# - Chain execution

# Ejemplo: Sentry captura esto automáticamente
from langchain_nvidia_ai_endpoints import ChatNVIDIA

llm = ChatNVIDIA(model="meta/llama3-70b-instruct")
response = llm.invoke("Hola, soy un contador público...")
# → Sentry crea spans: gen_ai.request, gen_ai.response, token usage
```

### 2. AI Agent Monitoring (Manual)

Para monitoreo detallado de agentes:

```python
import sentry_sdk
from langgraph import StateGraph

# Crear agente
builder = StateGraph(AgentState)
# ... configuración del agente

# Instrumentar ejecución del agente
async def run_agent_with_sentry(agent, input_data):
    with sentry_sdk.start_span(
        op="gen_ai.invoke_agent",
        name=f"invoke_agent {agent.name}"
    ) as span:
        span.set_data("gen_ai.agent.name", agent.name)
        span.set_data("gen_ai.request.model", "meta/llama3-70b-instruct")
        
        result = await agent.ainvoke(input_data)
        
        span.set_data("gen_ai.response.text", str(result))
        return result
```

### 3. Database Queries (SQLAlchemy)

```python
from sqlalchemy import event
from sqlalchemy.engine import Engine
import sentry_sdk
import time

@event.listens_for(Engine, "before_cursor_execute")
def receive_before_cursor_execute(conn, cursor, statement, parameters, context, executemany):
    # Capturar queries lentas
    conn.info.setdefault('query_start_time', []).append(time.time())

@event.listens_for(Engine, "after_cursor_execute")
def receive_after_cursor_execute(conn, cursor, statement, parameters, context, executemany):
    total = time.time() - conn.info['query_start_time'].pop(-1)
    
    # Alerta para queries lentas (>1s)
    if total > 1.0:
        sentry_sdk.capture_message(
            f"Slow query detected: {total:.2f}s",
            level="warning",
            extras={
                "query": statement,
                "duration": total,
                "params": parameters,
            }
        )
```

### 4. Background Tasks

```python
from fastapi import BackgroundTasks
import sentry_sdk

async def process_document_background(task_id: int, background_tasks: BackgroundTasks):
    with sentry_sdk.start_span(op="task", name="process_document"):
        try:
            # Tu lógica de procesamiento
            await process_heavy_task(task_id)
            
            sentry_sdk.capture_message(
                f"Document {task_id} processed successfully",
                level="info"
            )
        except Exception as e:
            sentry_sdk.capture_exception(e)
            raise
```

---

## 🔍 Distributed Tracing

Para conectar traces del frontend con el backend:

### 1. Frontend (ya configurado)

```typescript
// frontend/src/instrument.ts
Sentry.init({
  tracePropagationTargets: ["localhost", /^https:\/\/api\./],
  // ...
})
```

### 2. Backend - Extraer headers del frontend

```python
from fastapi import Request
import sentry_sdk

@app.get("/api/v1/chat/conversations")
async def get_conversations(request: Request):
    # Extraer trace headers del frontend
    headers = dict(request.headers)
    
    # Sentry automáticamente propaga el trace
    # si los headers están presentes
    
    with sentry_sdk.start_transaction(
        name="GET /api/v1/chat/conversations",
        op="http.server",
    ) as transaction:
        # Los headers se propagan automáticamente
        result = await get_conversations_from_db()
        
        transaction.set_data("result_count", len(result))
        return result
```

### 3. HTTP Client (httpx) con Propagación

```python
import httpx
import sentry_sdk

async def call_external_api(url: str):
    # Propagar trace context a llamadas salientes
    with sentry_sdk.start_span(op="http.client", name=url):
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            return response.json()
```

---

## 📊 Configuración por Entorno

### Desarrollo

```python
# .env.development
SENTRY_DSN=https://1dfa0654de01be53784b27bf36ec7b51@o4510725289476096.ingest.us.sentry.io/4511020049891328
SENTRY_ENVIRONMENT=development
SENTRY_TRACES_SAMPLE_RATE=1.0  # 100% para debugging
SENTRY_PROFILES_SAMPLE_RATE=0.5  # 50% profiling
SENTRY_DEBUG=true
```

### Producción

```python
# .env.production
SENTRY_DSN=https://1dfa0654de01be53784b27bf36ec7b51@o4510725289476096.ingest.us.sentry.io/4511020049891328
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0.1  # 10% para reducir costos
SENTRY_PROFILES_SAMPLE_RATE=0.1  # 10% profiling
SENTRY_DEBUG=false
SENTRY_RELEASE={{version}}  # Inyectar en build
```

### Staging

```python
# .env.staging
SENTRY_DSN=https://1dfa0654de01be53784b27bf36ec7b51@o4510725289476096.ingest.us.sentry.io/4511020049891328
SENTRY_ENVIRONMENT=staging
SENTRY_TRACES_SAMPLE_RATE=0.5  # 50%
SENTRY_PROFILES_SAMPLE_RATE=0.2  # 20%
SENTRY_DEBUG=true
```

---

## 🧪 Verificación

### 1. Endpoint de Test

Agregar endpoint temporal para pruebas:

```python
from fastapi import APIRouter
from sentry_sdk import capture_message, capture_exception

router = APIRouter(prefix="/sentry-test")

@router.get("/message")
async def test_message():
    """Envía un mensaje de prueba a Sentry"""
    capture_message("Backend test message - FastAPI", level="info")
    return {"status": "Message sent to Sentry"}

@router.get("/error")
async def test_error():
    """Envía un error de prueba a Sentry"""
    try:
        raise ValueError("Backend test error - FastAPI")
    except Exception as e:
        capture_exception(e)
        return {"status": "Error sent to Sentry"}

@router.get("/transaction")
async def test_transaction():
    """Crea una transacción de prueba"""
    with sentry_sdk.start_span(op="test", name="test_transaction"):
        import time
        time.sleep(0.1)  # Simular trabajo
        return {"status": "Transaction sent to Sentry"}
```

### 2. Verificar en Dashboard

1. Ve a https://sentry.io
2. Organización: `dg-development`
3. Proyecto: Crear nuevo proyecto "IDP Backend" o usar el existente
4. Ver en:
   - **Issues**: Errores y mensajes
   - **Traces**: Transacciones de API
   - **Performance**: Métricas de endpoints

---

## 📁 Estructura de Archivos Sugerida

```
backend/
├── app/
│   ├── main.py              # ← Sentry.init() aquí
│   ├── config.py            # Configuración de Sentry
│   ├── integrations/
│   │   └── sentry.py        # Configuración avanzada
│   └── middleware/
│       └── sentry.py        # Middleware custom (opcional)
├── .env                     # Variables de Sentry
├── .env.example             # Template (sin valores reales)
└── requirements.txt         # sentry-sdk[fastapi]
```

### `app/config.py`

```python
from pydantic_settings import BaseSettings
from typing import Optional

class SentryConfig(BaseSettings):
    dsn: Optional[str] = None
    environment: str = "development"
    traces_sample_rate: float = 0.1
    profiles_sample_rate: float = 0.1
    send_default_pii: bool = True
    debug: bool = False
    
    class Config:
        env_prefix = "SENTRY_"
```

### `app/integrations/sentry.py`

```python
from app.config import SentryConfig
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

def init_sentry(config: SentryConfig):
    """Inicializar Sentry SDK"""
    sentry_sdk.init(
        dsn=config.dsn,
        environment=config.environment,
        traces_sample_rate=config.traces_sample_rate,
        profiles_sample_rate=config.profiles_sample_rate,
        send_default_pii=config.send_default_pii,
        integrations=[FastApiIntegration()],
        debug=config.debug,
    )
```

---

## 🚀 Deployment

### Docker

```dockerfile
# backend/Dockerfile

# Instalar dependencias
COPY requirements.txt .
RUN pip install -r requirements.txt

# El SDK se inicializa en runtime
# No se necesita configuración adicional
```

### Docker Compose

```yaml
# docker-compose.yml
services:
  backend:
    build: ./backend
    environment:
      - SENTRY_DSN=${SENTRY_DSN}
      - SENTRY_ENVIRONMENT=${SENTRY_ENVIRONMENT}
      - SENTRY_TRACES_SAMPLE_RATE=0.1
    # ... resto de configuración
```

---

## 💰 Costos Estimados

### Plan Team ($26/mes por proyecto)

**Incluido:**
- 10,000 errores/mes
- 50,000 transacciones/mes
- 1,000 replays/mes

**Proyección Backend:**

| Escenario | Requests/día | Errores/mes | Transacciones/mes | Costo |
|-----------|--------------|-------------|-------------------|-------|
| Bajo (1k/día) | 1,000 | ~300 | ~30,000 | $26/mes |
| Medio (5k/día) | 5,000 | ~1,500 | ~150,000 | $26/mes + overage |
| Alto (10k/día) | 10,000 | ~3,000 | ~300,000 | $26/mes + overage |

**Recomendación:** Empezar con `traces_sample_rate: 0.1` (10%) y ajustar según uso.

---

## ✅ Checklist de Implementación

### Fase 1: Instalación

- [ ] `pip install sentry-sdk[fastapi]`
- [ ] Agregar a `requirements.txt`
- [ ] Actualizar `.env` con variables de Sentry

### Fase 2: Configuración

- [ ] Agregar `sentry_sdk.init()` en `main.py`
- [ ] Configurar integraciones (FastAPI, Starlette)
- [ ] Configurar sampling rates por entorno
- [ ] Agregar filtro de datos sensibles (opcional)

### Fase 3: Verificación

- [ ] Crear endpoint de test `/sentry-test/message`
- [ ] Enviar evento de prueba
- [ ] Verificar en dashboard de Sentry
- [ ] Eliminar endpoint de test

### Fase 4: Producción

- [ ] Ajustar sampling rates para producción
- [ ] Configurar release tracking
- [ ] Habilitar profiling (opcional)
- [ ] Configurar alertas

---

## 🔗 Recursos

### Documentación Oficial

- [Sentry Python SDK](https://docs.sentry.io/platforms/python/)
- [FastAPI Integration](https://docs.sentry.io/platforms/python/integrations/fastapi/)
- [AI Agent Monitoring](https://docs.sentry.io/platforms/python/ai-agent-monitoring/)
- [LangChain Integration](https://docs.sentry.io/platforms/python/integrations/langchain/)

### Enlaces del Proyecto

- **Dashboard:** https://sentry.io
- **Organización:** dg-development
- **DSN:** `https://1dfa0654de01be53784b27bf36ec7b51@o4510725289476096.ingest.us.sentry.io/4511020049891328`

---

**Próximo paso:** Ejecutar `pip install sentry-sdk[fastapi]` y seguir la guía de configuración.
