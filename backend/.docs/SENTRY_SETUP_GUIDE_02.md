# Sentry SDK Setup Guide - IDP Asistente Contable Backend

## Overview

Esta guía documenta la implementación de **Sentry SDK** para monitoreo de errores, tracing de rendimiento y profiling en el backend FastAPI del IDP Asistente Contable.

## Configuración Completada

### 1. SDK Instalado

```bash
sentry-sdk[fastapi]==2.54.0
```

**Ubicación:** `backend/requirements.txt` (línea 89)

### 2. Variables de Entorno

**Archivo:** `backend/.env`

```bash
# SENTRY - Error Monitoring & Performance
SENTRY_DSN=https://1dfa0654de01be53784b27bf36ec7b51@o4510725289476096.ingest.us.sentry.io/4511020049891328
SENTRY_ENVIRONMENT=development
SENTRY_TRACES_SAMPLE_RATE=1.0
SENTRY_PROFILES_SAMPLE_RATE=0.5
SENTRY_DEBUG=false
```

### 3. Inicialización en main.py

**Ubicación:** `backend/app/main.py` (líneas 25-63)

La inicialización de Sentry ocurre **ANTES** de crear la aplicación FastAPI, siguiendo las mejores prácticas del SDK:

```python
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.starlette import StarletteIntegration

sentry_sdk.init(
    dsn=os.environ.get("SENTRY_DSN"),
    environment=os.environ.get("SENTRY_ENVIRONMENT", "development"),
    traces_sample_rate=float(os.environ.get("SENTRY_TRACES_SAMPLE_RATE", 1.0)),
    profile_session_sample_rate=float(os.environ.get("SENTRY_PROFILES_SAMPLE_RATE", 0.5)),
    profile_lifecycle="trace",
    enable_logs=True,
    debug=os.environ.get("SENTRY_DEBUG", "false").lower() == "true",
    integrations=[FastApiIntegration(), StarletteIntegration()],
    before_send_transaction=lambda event, hint: None if event.get("transaction") in ["/health", "/health/detailed"] else event,
)
```

### 4. Endpoints de Verificación

#### GET /sentry-test/message

Envía un mensaje de prueba a Sentry.

**Respuesta:**
```json
{
  "status": "message_sent",
  "message_id": "<message-id>",
  "dsn": "https://1dfa0654de01be53784b27bf36ec7b51@o4510725289476096...",
  "environment": "development",
  "instructions": "Check your Sentry dashboard to verify the message was received"
}
```

#### GET /sentry-test/error

**⚠️ ADVERTENCIA:** Genera un error intencional para probar la captura de excepciones.

```bash
curl http://localhost:8000/sentry-test/error
```

## Verificación de la Implementación

### Paso 1: Iniciar el Backend

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Esperar ver en logs:**
```
Sentry is initialized in debug mode
Dsn: https://...@o4510725289476096.ingest.us.sentry.io/4511020049891328
Environment: development
```

### Paso 2: Probar Envío de Mensaje

```bash
curl http://localhost:8000/sentry-test/message
```

**Verificar en Dashboard:**
1. Ir a https://sentry.io/
2. Seleccionar proyecto: `idp-asistente-contable`
3. Navegar a **Issues** o **Discover**
4. Buscar: "Sentry SDK test message from IDP Asistente Contable"

### Paso 3: Probar Captura de Error

```bash
curl http://localhost:8000/sentry-test/error
```

**Verificar en Dashboard:**
1. Ir a https://sentry.io/
2. Seleccionar proyecto: `idp-asistente-contable`
3. Navegar a **Issues**
4. Ver error: `ValueError: Sentry SDK test error - this is intentional for testing purposes`
5. Revisar stack trace, breadcrumbs, y contexto de la request

### Paso 4: Verificar Tracing

1. En Sentry Dashboard, ir a **Performance > Traces**
2. Buscar traces de endpoints del backend
3. Verificar que `/health` y `/health/detailed` están excluidos (configurado en `before_send_transaction`)

## Configuración de Producción

### Ajustes Recomendados

Para entornos de producción con alto tráfico, ajustar las siguientes variables en `.env`:

```bash
# Reducir sample rate para alto tráfico
SENTRY_TRACES_SAMPLE_RATE=0.1          # 10% de traces
SENTRY_PROFILES_SAMPLE_RATE=0.25       # 25% de profiling

# Especificar release para versionamiento
SENTRY_RELEASE=idp-asistente-contable@2.0.0

# Desactivar debug mode
SENTRY_DEBUG=false
```

### Variables de Entorno en Producción

Asegurar que las siguientes variables estén configuradas en el entorno de despliegue:

| Variable | Descripción | Valor Ejemplo |
|----------|-------------|---------------|
| `SENTRY_DSN` | Data Source Name | `https://<key>@o<org>.ingest.sentry.io/<project>` |
| `SENTRY_ENVIRONMENT` | Entorno | `production`, `staging`, `development` |
| `SENTRY_RELEASE` | Versión del release | `idp-asistente-contable@2.0.0` |
| `SENTRY_TRACES_SAMPLE_RATE` | Sample rate para traces | `0.1` (10%) |
| `SENTRY_PROFILES_SAMPLE_RATE` | Sample rate para profiling | `0.25` (25%) |

## Características Habilitadas

### 1. Error Monitoring ✅

- Captura automática de excepciones no manejadas
- Soporte para `ExceptionGroup` (Python 3.11+)
- Breadcrumbs automáticos de logs y requests HTTP
- Contexto enriquecido (usuario, request, environment)

### 2. Performance Tracing ✅

- Trazas automáticas de endpoints FastAPI
- Integración con SQLAlchemy, Redis, HTTPX
- Distribución de traces entre servicios
- Exclusión de endpoints de health check

### 3. Continuous Profiling ✅

- Profiling atado a spans activos
- Muestreo configurable por sesión
- Análisis de hot paths y cuellos de botella

### 4. Logging Estructurado ✅

- Integración con `logging` stdlib de Python
- Envío de logs a Sentry (SDK >= 2.35.0)
- Correlación con errores y traces

## Integraciones Automáticas

El SDK detecta e integra automáticamente con:

| Librería | Integración |
|----------|-------------|
| FastAPI/Starlette | ✅ Auto-captura de errores y traces |
| SQLAlchemy | ✅ Trazas de queries |
| Redis | ✅ Trazas de operaciones |
| HTTPX/Requests | ✅ Trazas de llamadas HTTP |
| Python Logging | ✅ Captura de logs |
| Pydantic | ✅ Validación de datos |

## Troubleshooting

### Error: "Sentry not initialized"

**Causa:** `sentry_sdk.init()` se llama después de crear la app FastAPI.

**Solución:** Mover la inicialización al inicio de `main.py`, antes de `create_app()`.

### Error: "Malformed DSN"

**Causa:** DSN incorrecto o variable de entorno no establecida.

**Solución:** Verificar que `SENTRY_DSN` en `.env` tenga el formato:
```
https://<public_key>@o<org_id>.ingest.sentry.io/<project_id>
```

### No aparecen traces en Sentry

**Causa:** `traces_sample_rate` en 0 o None.

**Solución:** Asegurar que `SENTRY_TRACES_SAMPLE_RATE` sea > 0 en `.env`.

### Error: "Access denied" en logs

**Causa:** SDK en modo debug sin permisos de escritura.

**Solución:** Establecer `SENTRY_DEBUG=false` en producción.

## Recursos Adicionales

- **Documentación Oficial:** https://docs.sentry.io/platforms/python/
- **FastAPI Integration:** https://docs.sentry.io/platforms/python/integrations/fastapi/
- **Dashboard del Proyecto:** https://sentry.io/organizations/idp-app/projects/idp-asistente-contable/
- **SDK GitHub:** https://github.com/getsentry/sentry-python

## Historial de Cambios

| Fecha | Versión | Cambio |
|-------|---------|--------|
| 2026-03-10 | 1.0.0 | Implementación inicial de Sentry SDK |
| | | - Error monitoring configurado |
| | | - Performance tracing habilitado |
| | | - Continuous profiling activado |
| | | - Logging estructurado integrado |
| | | - Endpoints de test creados |
