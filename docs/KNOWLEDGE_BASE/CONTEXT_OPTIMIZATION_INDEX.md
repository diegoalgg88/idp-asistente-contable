# IDP Asistente Contable - Context Optimization Index

## 🎯 Propósito

Este índice comprimido está diseñado para **optimizar el contexto en sesiones futuras**, proporcionando acceso rápido a información estructural clave sin necesidad de analizar todo el código fuente.

---

## 📊 Resumen Ejecutivo (TL;DR)

**Proyecto:** IDP Asistente Contable v2.0.0  
**Tipo:** Sistema inteligente de procesamiento de documentos contables y fiscales mexicanos  
**Stack:** FastAPI (Python) + React 18/TypeScript + NVIDIA NIM API + ChromaDB + PostgreSQL  
**Arquitectura:** Microservices con Layered Backend + Component-Based Frontend  
**Archivos:** 138 archivos de código | 23,313 LOC | ~422K tokens  
**Módulos principales:** IDP (documentos), Chat (RAG), Agent (tool calling), Clients, Fiscal, Payroll, Finance, Expenses  

---

## 🗺️ Mapa de Navegación Rápida

### Backend - Rutas Críticas

```
Si necesitas:
├─→ Configurar API/NVIDIA → backend/app/core/config.py
├─→ Autenticación JWT → backend/app/core/security.py + backend/app/api/auth.py
├─→ Procesar documentos → backend/app/api/idp.py → backend/app/services/nvidia_nim.py
├─→ Chat con RAG → backend/app/api/chat.py → backend/app/services/langgraph_agents.py
├─→ Agente con tools → backend/app/api/agent.py → backend/app/services/agent_tools.py
├─→ RAG/ChromaDB → backend/app/services/rag_service.py → backend/app/services/embeddings.py
├─→ Modelos DB → backend/app/db/models.py
├─→ Validadores → backend/app/core/validators.py
└─→ Rate limiting → backend/app/core/rate_limiter.py
```

### Frontend - Rutas Críticas

```
Si necesitas:
├─→ API client → frontend/src/services/api.ts
├─→ Autenticación → frontend/src/hooks/useAuth.ts + frontend/src/store/auth.store.ts
├─→ Chat → frontend/src/components/Chat.tsx + frontend/src/hooks/useChat.ts
├─→ Documentos → frontend/src/components/Documents.tsx + frontend/src/hooks/useIDP.ts
├─→ Layout/Sidebar → frontend/src/components/Layout.tsx + frontend/src/components/ui/sidebar.tsx
├─→ Workspace → frontend/src/components/Workspace.tsx
├─→ Estado global → frontend/src/store/*.ts (Zustand)
└─→ Componentes UI → frontend/src/components/ui/*.tsx (shadcn/ui)
```

---

## 🔑 Puntos de Entrada (Entry Points)

### Backend

| Archivo | Función | Propósito |
|---------|---------|-----------|
| `backend/app/main.py` | `create_app()` | FastAPI application factory, registra routers, middleware |
| `backend/app/main.py` | `lifespan()` | Startup/shutdown events: init DB, crear directorios |
| `backend/app/core/config.py` | `settings` | Instancia global de Pydantic Settings |
| `backend/app/db/database.py` | `init_db()` | Inicializa tablas de base de datos |
| `backend/app/db/models.py` | `User, Document, Conversation, Message` | Modelos SQLAlchemy |

### Frontend

| Archivo | Función | Propósito |
|---------|---------|-----------|
| `frontend/src/main.tsx` | `ReactDOM.createRoot()` | Monta aplicación React |
| `frontend/src/App.tsx` | `App` | React Router con rutas de módulos |
| `frontend/src/services/api.ts` | `axiosInstance` | Cliente Axios configurado con interceptors |
| `frontend/src/store/index.ts` | `useStore` | Exporta todos los Zustand stores |

---

## 📦 Estructura de Directorios (Árbol Esencial)

```
idp-asistente-contable/
├── backend/app/
│   ├── main.py                    # Entry point FastAPI
│   ├── core/                      # Configuración, seguridad, validadores
│   │   ├── config.py              # Pydantic Settings (NVIDIA API, DB, Redis)
│   │   ├── security.py            # JWT, bcrypt, OAuth2
│   │   ├── validators.py          # Validadores RFC, UUID, curp
│   │   └── rate_limiter.py        # Rate limiting con Redis
│   ├── db/                        # Capa de datos
│   │   ├── database.py            # SQLAlchemy engine, session
│   │   └── models.py              # User, Document, Conversation, Message
│   ├── api/                       # Endpoints REST
│   │   ├── auth.py                # OAuth2 JWT (/v1/auth/token, /refresh, /me)
│   │   ├── idp.py                 # Procesamiento documentos (/v1/idp/process)
│   │   ├── chat.py                # Chat conversacional (/v1/chat/message)
│   │   ├── agent.py               # Agente ReAct (/v1/agent/chat, /tools)
│   │   ├── rag.py                 # RAG (/v1/rag/ingest, /query)
│   │   ├── clients.py             # CRUD clientes (/v1/clients)
│   │   ├── fiscal.py              # Fiscal (/v1/fiscal/deadlines)
│   │   ├── payroll.py             # Nómina (/v1/payroll)
│   │   ├── finance.py             # Finanzas (/v1/finance)
│   │   └── expenses.py            # Gastos (/v1/expenses)
│   ├── services/                  # Servicios de negocio
│   │   ├── nvidia_nim.py          # Cliente NVIDIA NIM API (OCR, Vision, LLM)
│   │   ├── rag_service.py         # RAG con ChromaDB
│   │   ├── embeddings.py          # Embeddings con NVIDIA
│   │   ├── langgraph_agents.py    # ContableAgent con LangGraph
│   │   └── agent_tools.py         # Herramientas para agente
│   └── agents/                    # Agentes especializados
│       └── rag_agent.py           # RAGAgent con LangGraph integration
│
├── frontend/src/
│   ├── App.tsx                    # React Router
│   ├── main.tsx                   # Entry point React
│   ├── components/                # Componentes React
│   │   ├── Layout.tsx             # Layout principal con sidebar
│   │   ├── Workspace.tsx          # Dashboard principal
│   │   ├── Chat.tsx               # Chat con streaming
│   │   ├── Documents.tsx          # Gestión de documentos
│   │   ├── Dashboard.tsx          # Dashboard de métricas
│   │   ├── Clients.tsx            # CRUD clientes
│   │   ├── Fiscal.tsx             # Módulo fiscal
│   │   ├── Payroll.tsx            # Nómina
│   │   ├── Finance.tsx            # Finanzas
│   │   ├── Expenses.tsx           # Gastos
│   │   └── ui/                    # shadcn/ui components
│   ├── hooks/                     # Custom React hooks
│   │   ├── useAuth.ts             # Autenticación
│   │   ├── useChat.ts             # Chat state
│   │   ├── useIDP.ts              # IDP state
│   │   └── use-mobile.ts          # Mobile detection
│   ├── services/                  # API services
│   │   ├── api.ts                 # Axios client
│   │   ├── auth.service.ts        # Auth service
│   │   ├── chat.service.ts        # Chat service
│   │   └── idp.service.ts         # IDP service
│   ├── store/                     # Zustand stores
│   │   ├── auth.store.ts          # Auth state
│   │   ├── chat.store.ts          # Chat state
│   │   ├── idp.store.ts           # IDP state
│   │   └── modules.store.ts       # Modules state
│   └── types/                     # TypeScript types
│       └── index.ts               # Type definitions
│
└── docker-compose.yml             # Orquestación: Redis, PostgreSQL, ChromaDB, Backend, Frontend
```

---

## 🔄 Flujos de Datos (Resumen)

### 1. IDP - Procesamiento de Documentos

```
Documents.tsx (upload) 
  → POST /v1/idp/process (api.ts) 
  → idp.py (endpoint) 
  → nvidia_nim.py (OCR Nemo + Vision Llama 3.2 90B) 
  → validators.py (validar RFC) 
  → models.py (guardar Document) 
  → rag_service.py (ingestar a ChromaDB) 
  → Response
```

**Archivos clave:** `Documents.tsx`, `idp.py`, `nvidia_nim.py`, `validators.py`, `rag_service.py`

### 2. RAG - Chat Conversacional

```
Chat.tsx (input) 
  → POST /v1/chat/message (chat.service.ts) 
  → chat.py (endpoint) 
  → langgraph_agents.py (ContableAgent) 
  → rag_agent.py (retrieve de ChromaDB) 
  → embeddings.py (generar embedding) 
  → nvidia_nim.py (LLM Llama 3.3 70B) 
  → Streaming SSE 
  → Chat.tsx
```

**Archivos clave:** `Chat.tsx`, `chat.py`, `langgraph_agents.py`, `rag_agent.py`, `nvidia_nim.py`

### 3. Agent - Tool Calling (ReAct Loop)

```
Chat.tsx (input con acción) 
  → POST /v1/agent/chat (api.ts) 
  → agent.py (endpoint) 
  → run_react_loop() (ReAct: Thought → Action → Observation) 
  → execute_tool() (agent_tools.py) 
  → _extract_tool_calls() (parsear JSON) 
  → LLM genera respuesta final 
  → Response con tool_calls
```

**Archivos clave:** `agent.py`, `agent_tools.py`, `langgraph_agents.py`

### 4. Auth - OAuth2 JWT

```
Login form (useAuth.ts) 
  → POST /v1/auth/token (auth.service.ts) 
  → auth.py (OAuth2 endpoint) 
  → security.py (validar credenciales, crear JWT) 
  → Guardar token en frontend 
  → Requests con Authorization: Bearer
```

**Archivos clave:** `useAuth.ts`, `auth.service.ts`, `auth.py`, `security.py`

---

## 🎨 Arquitectura (Diagrama Mental)

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React 18)                  │
│  Components → Hooks → Services (Axios) → Store (Zustand)│
└────────────────────┬────────────────────────────────────┘
                     │ REST API (JWT Auth)
                     ▼
┌─────────────────────────────────────────────────────────┐
│              BACKEND (FastAPI - Python)                 │
│  ┌───────────────────────────────────────────────────┐  │
│  │            API Layer (Routers /v1/*)              │  │
│  │  /auth, /idp, /chat, /agent, /rag, /clients...    │  │
│  └─────────────────┬─────────────────────────────────┘  │
│                    │                                    │
│  ┌─────────────────▼─────────────────────────────────┐  │
│  │         Service Layer (Business Logic)            │  │
│  │  nvidia_nim.py, rag_service.py, langgraph_agents  │  │
│  └─────────────────┬─────────────────────────────────┘  │
│                    │                                    │
│  ┌─────────────────▼─────────────────────────────────┐  │
│  │          Agent Layer (AI/ML with LangGraph)       │  │
│  │  RAGAgent, ContableAgent, ReAct loop, Tools       │  │
│  └─────────────────┬─────────────────────────────────┘  │
│                    │                                    │
│  ┌─────────────────▼─────────────────────────────────┐  │
│  │           Data Layer (SQLAlchemy)                 │  │
│  │  User, Document, Conversation, Message            │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  Core: config.py, security.py, validators.py, rate_limit│
└─────────────────────────────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         ▼           ▼           ▼
    ┌────────┐  ┌──────────┐  ┌──────────┐
    │PostgreSQL│  │ChromaDB  │  │  Redis   │
    │  :5432  │  │  :8000   │  │  :6379   │
    └────────┘  └──────────┘  └──────────┘
```

---

## 🔌 Dependencias Externas Críticas

### NVIDIA NIM API

| Servicio | Modelo | Endpoint | Propósito |
|----------|--------|----------|-----------|
| **OCR** | `nvidia/nemoretriever-ocr-v1` | `/v1/cv` | Extraer texto de PDFs/imágenes |
| **Vision** | `meta/llama-3.2-90b-vision-instruct` | `/v1/gr` | Extraer entidades de facturas |
| **LLM** | `meta/llama-3.3-70b-instruct` | `/v1` | Razonamiento contable, chat |
| **Embeddings** | `nvidia/nv-embedqa-e5-v5` | `/v1` | Generar embeddings para RAG |
| **Rerank** | `nvidia/nv-rerankqa-mistral-4b-v3` | `/v1` | Reranking para RAG |

**Configuración:** `backend/app/core/config.py` → `NVIDIA_API_KEY`, `NVIDIA_NIM_BASE_URL`, `VISION_MODEL`, `LLM_MODEL`, `EMBEDDING_MODEL`

### Base de Datos

| Servicio | Imagen Docker | Puerto | Propósito |
|----------|---------------|--------|-----------|
| **PostgreSQL** | `postgres:15-alpine` | 5432 | Datos relacionales: usuarios, documentos, conversaciones |
| **ChromaDB** | `chromadb/chroma:latest` | 8000 | Vector store para RAG |
| **Redis** | `redis:7-alpine` | 6379 | Rate limiting, cache |

**Configuración:** `docker-compose.yml`, `backend/app/core/config.py` → `DATABASE_URL`, `CHROMA_DB_HOST`, `REDIS_URL`

---

## 🛠️ Comandos Esenciales

### Backend

```bash
# Desarrollo local
cd backend
python -m uvicorn app.main:app --reload

# Tests
cd backend
pytest tests/

# Validar configuración
python -c "from app.core.config import validate_settings; print(validate_settings())"
```

### Frontend

```bash
# Desarrollo local
cd frontend
npm run dev

# Build producción
npm run build

# Tests unitarios
npm run test:run

# Tests E2E
npm run test:e2e
npm run test:e2e:ui  # Con UI
```

### Docker

```bash
# Levantar todos los servicios
docker-compose up -d

# Levantar solo backend y DB
docker-compose up -d backend db chromadb redis

# Levantar frontend en modo desarrollo
docker-compose --profile dev up -d frontend-dev

# Ver logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop
docker-compose down
```

---

## 📋 Variables de Entorno Críticas

### `.env` (raíz)

```bash
# NVIDIA API
NVIDIA_API_KEY=nvapi-...

# Database
POSTGRES_USER=idp_user
POSTGRES_PASSWORD=idp_password
POSTGRES_DB=idp_contable
DATABASE_URL=postgresql://idp_user:idp_password@localhost:5432/idp_contable

# ChromaDB
CHROMA_DB_HOST=localhost
CHROMA_DB_PORT=8000

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Security
SECRET_KEY=tu-secret-key-aqui

# Backend
BACKEND_URL=http://localhost:8000
```

### `backend/.env`

```bash
# Mismas variables + configuraciones específicas
NVIDIA_API_KEY=nvapi-...
NVIDIA_NIM_BASE_URL=https://ai.api.nvidia.com/v1/cv
VISION_MODEL=meta/llama-3.2-90b-vision-instruct
LLM_MODEL=meta/llama-3.3-70b-instruct
EMBEDDING_MODEL=nvidia/nv-embedqa-e5-v5
```

---

## 🧪 Testing Strategy

### Backend (pytest)

- **Unit tests:** `backend/tests/test_core.py` - Config, security, validators
- **Integration tests:** `backend/tests/test_integration.py` - API endpoints, DB
- **Script integración:** `backend/test_integracion.py` - Test end-to-end

### Frontend

- **Unit tests (Vitest):** `frontend/src/components/*.test.tsx` - Componentes UI
- **E2E tests (Playwright):** `frontend/tests/e2e/*.spec.ts` - Flujos completos
  - `auth.spec.ts` - Login, logout
  - `chat.spec.ts` - Enviar mensajes, streaming
  - `dashboard.spec.ts` - Navegación, métricas
  - `idp.spec.ts` - Upload de documentos, processing

---

## 🚨 Troubleshooting Rápido

### Error: NVIDIA_API_KEY no configurada

```bash
# Verificar .env
cat backend/.env | grep NVIDIA_API_KEY

# Debe comenzar con 'nvapi-'
```

### Error: Database connection failed

```bash
# Verificar PostgreSQL está corriendo
docker-compose ps db

# Ver logs
docker-compose logs db

# Ver connection string
echo $DATABASE_URL
```

### Error: ChromaDB connection refused

```bash
# Verificar ChromaDB está corriendo
docker-compose ps chromadb

# Ver logs
docker-compose logs chromadb

# Verificar puerto 8000 disponible
netstat -an | grep 8000
```

### Error: Rate limit exceeded

```bash
# Verificar Redis está corriendo
docker-compose ps redis

# Ver configuración rate limiting
cat backend/app/core/config.py | grep RATE_LIMIT

# Default: 40 requests per minute (NVIDIA NIM Develop tier)
```

---

## 📚 Recursos de Documentación

| Documento | Ubicación | Propósito |
|-----------|-----------|-----------|
| **Knowledge Map** | `docs/PROJECT_KNOWLEDGE_MAP.md` | Documentación técnica completa en Markdown |
| **Knowledge Index** | `docs/knowledge-index.json` | Índice estructurado en JSON para búsqueda programática |
| **Context Index** | `docs/CONTEXT_OPTIMIZATION_INDEX.md` | Este archivo - guía rápida para sesiones futuras |
| **Backend README** | `backend/README.md` | Documentación específica del backend |
| **Frontend README** | `frontend/README.md` | Documentación específica del frontend |
| **Pilot Docs** | `docs/pilot/` | Documentación del piloto y validación |

---

## 🎯 Checklist para Nuevas Sesiones

### Antes de Empezar

- [ ] Verificar servicios Docker corriendo: `docker-compose ps`
- [ ] Verificar `.env` configurado correctamente
- [ ] Verificar `NVIDIA_API_KEY` válida (comienza con `nvapi-`)
- [ ] Verificar puertos disponibles: 5432, 8000, 6379, 3000/5173

### Para IDP/Document Processing

- [ ] Verificar NVIDIA NIM API connectivity
- [ ] Verificar directorios de upload existen
- [ ] Verificar ChromaDB accesible
- [ ] Test: `POST /v1/idp/process` con documento simple

### Para Chat/RAG

- [ ] Verificar ChromaDB collections creadas
- [ ] Verificar embeddings service funcional
- [ ] Test: `POST /v1/chat/message` con pregunta simple
- [ ] Test: Streaming SSE funcionando

### Para Agent/Tool Calling

- [ ] Verificar herramientas registradas: `GET /v1/agent/tools`
- [ ] Test: `POST /v1/agent/chat` con acción que requiera tool
- [ ] Verificar ReAct loop funciona (max 3 iteraciones)

---

## 🔍 Búsqueda Rápida por Palabras Clave

### Si buscas...

| Concepto | Archivos a revisar |
|----------|-------------------|
| **Autenticación / JWT / OAuth2** | `security.py`, `auth.py`, `useAuth.ts`, `auth.service.ts` |
| **Documentos / OCR / Facturas** | `idp.py`, `nvidia_nim.py`, `Documents.tsx`, `useIDP.ts` |
| **Chat / Conversación / RAG** | `chat.py`, `rag_agent.py`, `langgraph_agents.py`, `Chat.tsx`, `useChat.ts` |
| **Agente / Tool Calling / ReAct** | `agent.py`, `agent_tools.py`, `langgraph_agents.py` |
| **ChromaDB / Vectores / Embeddings** | `rag_service.py`, `embeddings.py`, `rag.py` |
| **NVIDIA API / LLM / Vision** | `nvidia_nim.py`, `config.py` |
| **Clientes / CRUD / KYC** | `clients.py`, `Clients.tsx` |
| **Fiscal / Deadlines / Deducciones** | `fiscal.py`, `Fiscal.tsx` |
| **Nómina / Payroll** | `payroll.py`, `Payroll.tsx` |
| **Finanzas / Bancos / Estados financieros** | `finance.py`, `Finance.tsx` |
| **Gastos / Clasificación** | `expenses.py`, `Expenses.tsx` |
| **Rate Limiting / Redis** | `rate_limiter.py`, `config.py` |
| **Validadores / RFC / UUID** | `validators.py` |
| **Base de datos / Modelos** | `models.py`, `database.py` |
| **Sidebar / Layout / Navegación** | `Layout.tsx`, `sidebar.tsx` |
| **Dashboard / Métricas / KPIs** | `Workspace.tsx`, `Dashboard.tsx` |
| **Tests E2E / Playwright** | `frontend/tests/e2e/*.spec.ts` |
| **Tests Unitarios / Vitest** | `frontend/src/components/*.test.tsx`, `backend/tests/*.py` |

---

## 📈 Métricas de Proyecto (Resumen)

| Métrica | Valor |
|---------|-------|
| **Total archivos de código** | 138 |
| **Total líneas de código (LOC)** | 23,313 |
| **Total tokens estimados** | ~422,658 |
| **Lenguajes** | TypeScript/TSX (42%), Python (48%), JSON (8%), Otros (2%) |
| **Módulos backend** | 11 routers API, 5 servicios, 1 agente |
| **Módulos frontend** | 12 componentes página, 20+ componentes UI, 4 hooks, 4 stores |
| **Endpoints API** | 40+ endpoints REST |
| **Tests** | 20+ tests unitarios, 4 tests E2E |

---

## 🎓 Conceptos Clave del Dominio

### IDP (Intelligent Document Processing)

Procesamiento inteligente de documentos contables usando OCR + Vision LLM para extraer datos de facturas CFDI, validar RFCs, y almacenar en vector store para retrieval futuro.

### RAG (Retrieval-Augmented Generation)

Técnica de IA que combina retrieval de documentos relevantes (ChromaDB) con generación de respuestas (LLM) para proporcionar respuestas contextuales y precisas con citas de fuentes.

### ReAct Loop (Reason-Act-Observe)

Patrón de agente de IA que razona sobre la tarea, actúa usando herramientas, observa resultados, y repite hasta generar respuesta final. Usado para tool calling en el agente contable.

### ChromaDB

Base de datos vectorial para almacenar embeddings de documentos contables, permitiendo búsqueda semántica y retrieval de contexto relevante para RAG.

### NVIDIA NIM API

API de NVIDIA para modelos de IA: OCR (NemoRetriever), Vision (Llama 3.2 90B), LLM (Llama 3.3 70B), Embeddings (NV-EmbedQA-E5-V5), Reranking.

---

*Índice generado: 2026-03-10*  
*Versión del proyecto: 2.0.0*  
*Propósito: Optimización de contexto para sesiones futuras*  
*Úsalo como referencia rápida para navegación y búsqueda*
