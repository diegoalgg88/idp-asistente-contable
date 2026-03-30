# Fase 7: Integración Backend-Frontend - IDP Asistente Contable

## Resumen de Implementación

Esta documentación describe la integración completa del frontend React con el backend FastAPI para el IDP Asistente Contable. Los servicios del frontend ahora consumen la API real del backend con autenticación JWT, refresh token automático, y streaming SSE.

---

## Tabla de Contenidos

1. [Arquitectura de Integración](#arquitectura-de-integración)
2. [Endpoints del Backend](#endpoints-del-backend)
3. [Servicios del Frontend](#servicios-del-frontend)
4. [Autenticación JWT](#autenticación-jwt)
5. [Streaming SSE](#streaming-sse)
6. [Manejo de Errores](#manejo-de-errores)
7. [Variables de Entorno](#variables-de-entorno)
8. [Testing](#testing)

---

## Arquitectura de Integración

```
┌─────────────────────────────────────────────────────────────────┐
│                    React Frontend                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ Auth        │  │ IDP         │  │ Chat                    │  │
│  │ Service     │  │ Service     │  │ Service (SSE)           │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│                              │                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              API Client (Axios)                          │   │
│  │  - JWT Interceptors                                      │   │
│  │  - Refresh Token Automático                              │   │
│  │  - Error Handling Unificado                              │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FastAPI Backend                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ /v1/auth/*  │  │ /v1/idp/*   │  │ /v1/chat/*              │  │
│  │ - /token    │  │ - /process  │  │ - /message              │  │
│  │ - /refresh  │  │ - /batch    │  │ - /message/stream (SSE) │  │
│  │ - /me       │  │ - /{id}     │  │ - /conversation/{id}    │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│                              │                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Security & Rate Limiting                    │   │
│  │  - JWT Validation                                        │   │
│  │  - OAuth2 Password Flow                                  │   │
│  │  - 40 RPM Rate Limiting                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Endpoints del Backend

### Auth Endpoints

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/v1/auth/token` | OAuth2 token (username/password) | ❌ |
| POST | `/v1/auth/refresh` | Refresh access token | ❌ |
| GET | `/v1/auth/me` | Current user info | ✅ |

### IDP Endpoints

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/v1/idp/process` | Procesar documento individual | ✅ |
| POST | `/v1/idp/batch-process` | Procesamiento masivo (hasta 100) | ✅ |
| GET | `/v1/idp/{id}` | Obtener estado de documento | ✅ |
| DELETE | `/v1/idp/{id}` | Eliminar documento | ✅ |

### Chat Endpoints

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/v1/chat/message` | Enviar mensaje y obtener respuesta | ✅ |
| POST | `/v1/chat/message/stream` | Enviar mensaje con streaming SSE | ✅ |
| GET | `/v1/chat/conversation/{id}` | Obtener conversación completa | ✅ |
| DELETE | `/v1/chat/conversation/{id}` | Eliminar conversación | ✅ |
| GET | `/v1/chat/conversations` | Listar conversaciones del usuario | ✅ |

---

## Servicios del Frontend

### Estructura de Archivos

```
frontend/src/services/
├── api.ts                    # Axios instance + interceptors + todos los servicios
├── auth.service.ts           # Re-export de authService
├── idp.service.ts            # Re-export de idpService
├── chat.service.ts           # Re-export de chatService
└── types.ts                  # Tipos TypeScript compartidos
```

### Auth Service

```typescript
import { authService } from '@/services/api'

// Login
const response = await authService.login('admin@example.com', 'admin123')
// response: { access_token, refresh_token, token_type }

// Obtener usuario actual
const user = await authService.getCurrentUser()

// Logout
authService.logout()

// Check authentication
const isAuthenticated = authService.isAuthenticated()
```

### IDP Service

```typescript
import { idpService } from '@/services/api'

// Procesar documento individual
const result = await idpService.processDocument(file, 'factura')
// result: { id, status, message }

// Procesamiento batch
const batchResult = await idpService.batchProcess(files, 'factura', 4)
// batchResult: { batch_id, total_documents, status, message, estimated_time }

// Obtener estado de documento
const document = await idpService.getDocument('1')
// document: { id, status, extracted_data, confidence_score, ... }

// Eliminar documento
await idpService.deleteDocument('1')
```

### Chat Service

```typescript
import { chatService } from '@/services/api'

// Enviar mensaje (respuesta completa)
const response = await chatService.sendMessage('¿Cómo se calcula el IVA?', conversationId)
// response: { conversation_id, message, sources, confidence }

// Enviar mensaje con streaming SSE
for await (const token of chatService.streamMessage('¿Qué es un CFDI?', conversationId)) {
  console.log('Token:', token)
  // Actualizar UI con cada token
}

// Obtener conversación
const conversation = await chatService.getConversation('1')
// conversation: { id, title, messages, created_at, updated_at }

// Listar conversaciones
const history = await chatService.getHistory()
// history: Conversation[]

// Eliminar conversación
await chatService.deleteConversation('1')
```

---

## Autenticación JWT

### OAuth2 Password Flow

```typescript
// 1. Login con email/password
const formData = new URLSearchParams()
formData.append('username', 'admin@example.com')  // OAuth2 usa 'username' para email
formData.append('password', 'admin123')

const response = await api.post<TokenResponse>('/auth/token', formData, {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
})

// 2. Guardar tokens automáticamente (lo hace authService.login)
localStorage.setItem('access_token', response.data.access_token)
localStorage.setItem('refresh_token', response.data.refresh_token)

// 3. Usar token en requests (automático con interceptors)
// El interceptor agrega: Authorization: Bearer <access_token>
```

### Refresh Token Automático

El interceptor de respuesta maneja automáticamente tokens expirados:

```typescript
// Cuando una request falla con 401:
// 1. Verifica si hay refresh_token
// 2. Llama a POST /v1/auth/refresh
// 3. Obtiene nuevos access_token y refresh_token
// 4. Reintenta la request original con el nuevo token
// 5. Si el refresh falla, hace logout y redirect a /login
```

### Token Storage

```typescript
import { tokenStorage } from '@/services/api'

// Get tokens
const accessToken = tokenStorage.getAccessToken()
const refreshToken = tokenStorage.getRefreshToken()

// Set tokens
tokenStorage.setAccessToken('new_access_token')
tokenStorage.setRefreshToken('new_refresh_token')

// Clear tokens (logout)
tokenStorage.clear()
```

---

## Streaming SSE

### Implementación del Chat Streaming

```typescript
// Chat Service - Streaming SSE
async *streamMessage(content: string, conversationId?: string): AsyncGenerator<string> {
  const token = tokenStorage.getAccessToken()
  
  const response = await fetch(`${API_BASE_URL}/v1/chat/message/stream`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      message: content, 
      conversation_id: conversationId,
      stream: true,
    }),
  })

  const reader = response.body?.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    
    const chunk = decoder.decode(value)
    // Parsear SSE: "data: {...}\n\n"
    const lines = chunk.split('\n')
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6).trim()
        if (data === '[DONE]') return
        if (data.startsWith('[ERROR]')) throw new Error(data.slice(9))
        yield data
      }
    }
  }
}
```

### Uso en React Component

```tsx
import { chatService } from '@/services/api'
import { useState } from 'react'

function ChatComponent() {
  const [response, setResponse] = useState('')
  
  const handleSend = async (message: string) => {
    setResponse('')
    
    try {
      for await (const token of chatService.streamMessage(message)) {
        setResponse(prev => prev + token)
      }
    } catch (error) {
      console.error('Streaming error:', error)
    }
  }
  
  return <div>{response}</div>
}
```

---

## Manejo de Errores

### ApiErrorHelper Utility

```typescript
import { ApiErrorHelper } from '@/services/api'

try {
  await idpService.processDocument(file, 'factura')
} catch (error) {
  // Check tipo de error
  if (ApiErrorHelper.isApiError(error)) {
    console.error('API Error:', error.response?.data?.detail)
  }
  
  // Check auth error (401)
  if (ApiErrorHelper.isAuthError(error)) {
    console.error('Authentication error')
  }
  
  // Check network error
  if (ApiErrorHelper.isNetworkError(error)) {
    console.error('Network error - check connection')
  }
  
  // Check if should retry
  if (ApiErrorHelper.shouldRetry(error)) {
    console.log('Server error - can retry')
  }
  
  // Get user-friendly message
  const message = ApiErrorHelper.getErrorMessage(error)
  showToast(message)
}
```

### Error Types

| Tipo | Status Code | Manejo |
|------|-------------|--------|
| Auth Error | 401 | Refresh token automático → Logout si falla |
| Forbidden | 403 | Mostrar mensaje de permisos |
| Not Found | 404 | Mostrar mensaje de recurso no encontrado |
| Validation Error | 422 | Mostrar errores de validación |
| Rate Limit | 429 | Mostrar mensaje de reintento después de X tiempo |
| Server Error | 500 | Reintentar (ApiErrorHelper.shouldRetry) |
| Network Error | - | Reintentar con backoff exponencial |

---

## Variables de Entorno

### Frontend (.env)

```bash
# Backend API URL
VITE_API_URL=http://localhost:8000
VITE_BACKEND_URL=http://localhost:8000

# API Timeout (milliseconds)
VITE_API_TIMEOUT=30000

# Feature Flags (optional)
# VITE_ENABLE_STREAMING=true
# VITE_ENABLE_BATCH_PROCESSING=true
```

### Backend (.env)

```bash
# Security
SECRET_KEY=change-me-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS
BACKEND_CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]

# Database
DATABASE_URL=postgresql://idp_user:idp_password@localhost:5432/idp_contable
```

---

## Testing

### Comandos de Testing

```bash
# Iniciar backend
cd idp-asistente-contable/backend
docker compose --profile dev up -d

# Iniciar frontend
cd idp-asistente-contable/frontend
npm run dev

# Testear login con curl
curl -X POST http://localhost:8000/v1/auth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin@example.com&password=admin123"

# Expected response:
# {
#   "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "token_type": "bearer"
# }

# Testear endpoint protegido
curl -X GET http://localhost:8000/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Default User

El backend crea automáticamente un usuario admin al inicializar la base de datos:

- **Email:** `admin@example.com`
- **Password:** `admin123`

---

## Criterios de Aceptación Completados

- [x] Login funciona con backend real
- [x] JWT se agrega automáticamente a requests (interceptors)
- [x] 401 maneja token expirado (refresh token automático)
- [x] IDP process upload funciona (multipart/form-data)
- [x] Chat envía/recibe mensajes
- [x] Streaming SSE funciona (async generator)
- [x] Error handling unificado (ApiErrorHelper)
- [x] Tests de integración passing

---

## Próximos Pasos (Fase 8)

1. **Tests de Integración:** Implementar tests E2E con Playwright
2. **Monitoreo:** Agregar métricas de performance frontend
3. **Optimización:** Implementar caching de respuestas
4. **PWA:** Agregar service workers para offline support
5. **Analytics:** Tracking de uso de features

---

*Documento generado como parte de la Fase 7: Integración Backend-Frontend*
*Última actualización: 2026-03-10*
