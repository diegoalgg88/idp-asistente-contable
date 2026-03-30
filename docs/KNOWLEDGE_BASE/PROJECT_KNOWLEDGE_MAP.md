# IDP Asistente Contable - Project Knowledge Map

## 📋 Visión General de Arquitectura

**IDP Asistente Contable** es un sistema inteligente de procesamiento de documentos contables y fiscales mexicanos, construido con una arquitectura **microservices-based** que combina:

- **Backend**: FastAPI (Python) con arquitectura layered
- **Frontend**: React 18 + TypeScript + Vite
- **Base de Datos**: PostgreSQL 15 + ChromaDB (vector store)
- **IA/ML**: NVIDIA NIM API (OCR, Vision, LLM, Embeddings, Reranking)
- **Infraestructura**: Docker + Docker Compose con Redis para rate limiting

### Stack Tecnológico Principal

| Capa | Tecnologías |
|------|-------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Radix UI, Zustand, React Router, Recharts |
| **Backend** | Python 3.11+, FastAPI, SQLAlchemy, Pydantic, LangGraph, LangChain |
| **Base de Datos** | PostgreSQL 15 (datos relacionales), ChromaDB (vectores) |
| **Cache/Rate Limiting** | Redis 7 |
| **IA/ML** | NVIDIA NIM API (Nemo OCR, Llama 3.2 Vision, Llama 3.3 70B Instruct, NV-EmbedQA-E5-V5) |
| **Infraestructura** | Docker, Docker Compose, Nginx (producción) |

---

## 🗂️ Module Directory

### Estructura del Proyecto

```
idp-asistente-contable/
├── backend/                      # Backend FastAPI
│   ├── app/
│   │   ├── __init__.py          # Package init (v2.0.0)
│   │   ├── main.py              # Punto de entrada FastAPI
│   │   ├── core/                # Configuración y seguridad
│   │   │   ├── __init__.py
│   │   │   ├── config.py        # Pydantic Settings centralizados
│   │   │   ├── security.py      # JWT, hashing, autenticación
│   │   │   ├── validators.py    # Validadores (RFC, UUID, etc.)
│   │   │   └── rate_limiter.py  # Rate limiting con Redis
│   │   ├── db/                  # Capa de datos
│   │   │   ├── __init__.py
│   │   │   ├── database.py      # SQLAlchemy engine, session, Base
│   │   │   └── models.py        # Modelos: User, Document, Conversation, Message
│   │   ├── api/                 # Endpoints REST API
│   │   │   ├── __init__.py
│   │   │   ├── auth.py          # OAuth2 JWT (/v1/auth/token, /refresh, /me)
│   │   │   ├── idp.py           # Procesamiento documentos (/v1/idp/process, /batch-process)
│   │   │   ├── chat.py          # Chat conversacional (/v1/chat/message, /conversation)
│   │   │   ├── agent.py         # Agente con tool calling (/v1/agent/chat, /tools)
│   │   │   ├── rag.py           # RAG con ChromaDB (/v1/rag/ingest, /query)
│   │   │   ├── workspace.py     # Gestión espacio de trabajo
│   │   │   ├── clients.py       # CRUD clientes (/v1/clients)
│   │   │   ├── fiscal.py        # Operaciones fiscales (/v1/fiscal/deadlines, /deductions)
│   │   │   ├── payroll.py       # Nómina (/v1/payroll)
│   │   │   ├── finance.py       # Finanzas (/v1/finance/summary, /bank-accounts)
│   │   │   ├── expenses.py      # Gastos (/v1/expenses/categories, /pending)
│   │   │   ├── users.py         # Gestión usuarios
│   │   │   └── workspace.py     # Espacio de trabajo
│   │   ├── services/            # Servicios de negocio
│   │   │   ├── __init__.py
│   │   │   ├── nvidia_nim.py    # Cliente NVIDIA NIM API (OCR, Vision, LLM, Embeddings)
│   │   │   ├── rag_service.py   # Servicio RAG con ChromaDB
│   │   │   ├── embeddings.py    # Generación de embeddings
│   │   │   ├── agent_tools.py   # Herramientas para agente (tools para ReAct loop)
│   │   │   └── langgraph_agents.py  # Agentes LangGraph (ContableAgent)
│   │   └── agents/              # Agentes especializados
│   │       ├── __init__.py
│   │       └── rag_agent.py     # RAGAgent con LangGraph integration
│   ├── tests/                   # Tests unitarios y de integración
│   │   ├── __init__.py
│   │   ├── conftest.py          # Fixtures de pytest
│   │   ├── test_core.py         # Tests de configuración y seguridad
│   │   └── test_integration.py  # Tests de integración
│   ├── test_integracion.py      # Script de integración
│   └── validate_implementation.py  # Validación de implementación
│
├── frontend/                    # Frontend React + TypeScript
│   ├── src/
│   │   ├── App.tsx             # Componente raíz con React Router
│   │   ├── main.tsx            # Punto de entrada
│   │   ├── components/         # Componentes React
│   │   │   ├── Layout.tsx      # Layout principal con sidebar
│   │   │   ├── Workspace.tsx   # Workspace/dashboard principal
│   │   │   ├── Chat.tsx        # Componente de chat con agente
│   │   │   ├── Dashboard.tsx   # Dashboard de métricas
│   │   │   ├── Documents.tsx   # Gestión de documentos
│   │   │   ├── Clients.tsx     # CRUD de clientes
│   │   │   ├── Fiscal.tsx      # Módulo fiscal
│   │   │   ├── Payroll.tsx     # Módulo de nómina
│   │   │   ├── Finance.tsx     # Módulo financiero
│   │   │   ├── Expenses.tsx    # Módulo de gastos
│   │   │   ├── Settings.tsx    # Configuración
│   │   │   ├── EmptyPane.tsx   # Estado vacío
│   │   │   └── ui/             # Componentes shadcn/ui
│   │   │       ├── alert.tsx
│   │   │       ├── avatar.tsx
│   │   │       ├── badge.tsx
│   │   │       ├── button.tsx
│   │   │       ├── card.tsx
│   │   │       ├── chart.tsx
│   │   │       ├── collapsible.tsx
│   │   │       ├── dialog.tsx
│   │   │       ├── dropdown-menu.tsx
│   │   │       ├── hover-card.tsx
│   │   │       ├── input.tsx
│   │   │       ├── label.tsx
│   │   │       ├── progress.tsx
│   │   │       ├── resizable.tsx
│   │   │       ├── scroll-area.tsx
│   │   │       ├── select.tsx
│   │   │       ├── separator.tsx
│   │   │       ├── sheet.tsx
│   │   │       ├── sidebar.tsx
│   │   │       ├── skeleton.tsx
│   │   │       ├── table.tsx
│   │   │       ├── tabs.tsx
│   │   │       ├── tooltip.tsx
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── use-mobile.ts   # Detección mobile
│   │   │   ├── useAuth.ts      # Autenticación
│   │   │   ├── useChat.ts      # Chat state
│   │   │   └── useIDP.ts       # IDP state
│   │   ├── services/           # Servicios API
│   │   │   ├── api.ts          # Cliente Axios configurado
│   │   │   ├── auth.service.ts # Servicio de autenticación
│   │   │   ├── chat.service.ts # Servicio de chat
│   │   │   └── idp.service.ts  # Servicio IDP
│   │   ├── store/              # Zustand stores
│   │   │   ├── index.ts        # Store exports
│   │   │   ├── auth.store.ts   # Auth state
│   │   │   ├── chat.store.ts   # Chat state
│   │   │   ├── idp.store.ts    # IDP state
│   │   │   └── modules.store.ts # Module state
│   │   ├── types/              # TypeScript types
│   │   │   └── index.ts        # Type definitions
│   │   ├── lib/                # Utilidades
│   │   │   └── utils.ts        # cn() utility
│   │   └── test/               # Setup de tests
│   │       └── setup.ts
│   ├── tests/
│   │   └── e2e/                # Tests E2E con Playwright
│   │       ├── auth.spec.ts
│   │       ├── chat.spec.ts
│   │       ├── dashboard.spec.ts
│   │       ├── idp.spec.ts
│   │       ├── fixtures.ts
│   │       └── pages/          # Page objects
│   │           ├── ChatPage.ts
│   │           ├── DashboardPage.ts
│   │           ├── DocumentsPage.ts
│   │           └── LoginPage.ts
│   ├── components.json         # shadcn/ui config
│   ├── package.json            # Dependencias
│   ├── tailwind.config.js      # Tailwind config
│   ├── tsconfig.json           # TypeScript config
│   ├── vite.config.ts          # Vite config
│   ├── vitest.config.ts        # Vitest config
│   └── playwright.config.ts    # Playwright config
│
├── docs/                       # Documentación
│   └── pilot/                  # Documentación del piloto
│       ├── src/                # Código del piloto
│       │   ├── __init__.py
│       │   ├── config.py
│       │   ├── extraction_service.py
│       │   └── rfc_validator.py
│       ├── scripts/            # Scripts del piloto
│       │   ├── generate_invoices.py
│       │   ├── run_pipeline.py
│       │   └── setup_pilot.py
│       └── monitoring/         # Configuración de monitoreo
│           ├── grafana/
│           │   └── dashboard.json
│           └── prometheus.yml
│
├── data/                       # Datos persistentes
│   └── pg_data/                # PostgreSQL data
│   └── chroma_data/            # ChromaDB data
│
├── docker-compose.yml          # Orquestación Docker
├── .env                        # Variables de entorno
└── .env.example                # Ejemplo de variables de entorno
```

---

## 🔗 Component Relationships

### Flujo de Datos Principal

#### 1. Procesamiento de Documentos (IDP Pipeline)

```
Usuario → Frontend (Documents.tsx) 
    → API: POST /v1/idp/process 
    → Backend (idp.py) 
    → NVIDIA NIM OCR (nvidia_nim.py) 
    → Extracción de entidades 
    → Validación (validators.py) 
    → Guardado (models.py) 
    → ChromaDB (rag_service.py) 
    → Respuesta al usuario
```

**Componentes involucrados:**
- `Documents.tsx` - UI de carga de documentos
- `idp.service.ts` - Servicio de llamada API
- `idp.py` - Endpoint REST
- `nvidia_nim.py` - Servicio OCR/Nemo
- `rag_service.py` - Ingesta a ChromaDB
- `models.py` - Modelo Document

#### 2. Chat con Agente Contable (ReAct Loop)

```
Usuario → Frontend (Chat.tsx) 
    → API: POST /v1/chat/message 
    → Backend (chat.py) 
    → ContableAgent (langgraph_agents.py) 
    → RAG Retrieval (rag_agent.py) 
    → LLM Llama 3.3 70B (nvidia_nim.py) 
    → Tool Calling (agent_tools.py) 
    → Respuesta con streaming
```

**Componentes involucrados:**
- `Chat.tsx` - UI de chat
- `chat.service.ts` - Servicio API
- `chat.py` - Endpoint REST
- `langgraph_agents.py` - ContableAgent
- `rag_agent.py` - RAG retrieval
- `agent_tools.py` - Herramientas del agente
- `nvidia_nim.py` - LLM inference

#### 3. Autenticación OAuth2 JWT

```
Login Form → Frontend (useAuth.ts) 
    → API: POST /v1/auth/token 
    → Backend (auth.py) 
    → Validación credenciales (security.py) 
    → Generación JWT (security.py) 
    → Almacenamiento en frontend 
    → Requests con Authorization header
```

**Componentes involucrados:**
- `useAuth.ts` - Hook de autenticación
- `auth.service.ts` - Servicio de auth
- `auth.py` - Endpoint OAuth2
- `security.py` - JWT, hashing, bcrypt

### Dependencias entre Módulos

#### Backend Dependencies

```
main.py (FastAPI app)
├── api/ (routers)
│   ├── auth.py → core/security.py, db/models.py
│   ├── idp.py → services/nvidia_nim.py, db/models.py
│   ├── chat.py → services/langgraph_agents.py
│   ├── agent.py → services/agent_tools.py, services/langgraph_agents.py
│   ├── rag.py → services/rag_service.py, services/embeddings.py
│   └── [clients, fiscal, payroll, finance, expenses].py → db/models.py
├── services/
│   ├── nvidia_nim.py → core/config.py
│   ├── rag_service.py → core/config.py, services/embeddings.py
│   ├── embeddings.py → core/config.py
│   ├── agent_tools.py → db/models.py, db/database.py
│   └── langgraph_agents.py → agents/rag_agent.py, services/nvidia_nim.py
├── agents/
│   └── rag_agent.py → services/rag_service.py, services/nvidia_nim.py
├── core/
│   ├── config.py → Pydantic Settings
│   ├── security.py → core/config.py
│   ├── validators.py → (standalone)
│   └── rate_limiter.py → core/config.py, Redis
└── db/
    ├── database.py → SQLAlchemy, core/config.py
    └── models.py → SQLAlchemy, database.py
```

#### Frontend Dependencies

```
App.tsx (React Router)
├── Layout.tsx → Sidebar, Header
│   └── ui/sidebar.tsx → Radix UI
├── Workspace.tsx → Dashboard principal
├── Chat.tsx → useChat.ts, chat.service.ts
├── Documents.tsx → useIDP.ts, idp.service.ts
├── Clients.tsx → api.ts
├── Fiscal.tsx → api.ts
├── Payroll.tsx → api.ts
├── Finance.tsx → api.ts
├── Expenses.tsx → api.ts
└── Settings.tsx → useAuth.ts, auth.service.ts

services/api.ts → Axios, auth.service.ts
store/ → Zustand (auth, chat, idp, modules)
hooks/ → useAuth, useChat, useIDP, use-mobile
```

---

## 📊 Technical Reference

### Archivos de Código Principal

| Archivo | LOC | Tokens Estimados | Descripción |
|---------|-----|------------------|-------------|
| `backend/app/main.py` | ~280 | ~3,500 | Punto de entrada FastAPI, configuración de middleware, routers |
| `backend/app/core/config.py` | ~220 | ~2,800 | Pydantic Settings centralizados, configuración de NVIDIA API, DB, seguridad |
| `backend/app/agents/rag_agent.py` | ~450 | ~5,500 | Agente RAG con LangGraph, retrieval, context building, streaming |
| `backend/app/api/agent.py` | ~380 | ~4,800 | Endpoint agéntico con ReAct loop, tool calling, ejecución de herramientas |
| `backend/app/api/chat.py` | ~420 | ~5,200 | Chat conversacional, streaming SSE, gestión de conversaciones |
| `backend/app/api/idp.py` | ~350 | ~4,300 | Procesamiento de documentos, batch processing, NVIDIA OCR |
| `backend/app/api/auth.py` | ~180 | ~2,200 | OAuth2 JWT, token endpoint, refresh token |
| `backend/app/services/nvidia_nim.py` | ~480 | ~6,000 | Cliente NVIDIA NIM API (OCR, Vision, LLM, Embeddings, Rerank) |
| `backend/app/services/rag_service.py` | ~320 | ~4,000 | Servicio RAG con ChromaDB, ingest, query, collection management |
| `backend/app/services/langgraph_agents.py` | ~400 | ~5,000 | ContableAgent con LangGraph StateGraph, nodos, tool calling |
| `backend/app/services/agent_tools.py` | ~340 | ~4,200 | Definición y ejecución de herramientas para agente |
| `backend/app/db/models.py` | ~120 | ~1,500 | Modelos SQLAlchemy: User, Document, Conversation, Message |
| `backend/app/db/database.py` | ~100 | ~1,200 | SQLAlchemy engine, session factory, init_db |
| `backend/app/core/security.py` | ~200 | ~2,500 | JWT, bcrypt, autenticación, password hashing |
| `backend/app/core/rate_limiter.py` | ~150 | ~1,800 | Rate limiting con Redis, factory pattern |
| `frontend/src/App.tsx` | ~25 | ~300 | React Router con rutas de módulos |
| `frontend/src/components/Layout.tsx` | ~650 | ~8,200 | Layout principal con sidebar, header, responsive |
| `frontend/src/components/Workspace.tsx` | ~680 | ~8,500 | Dashboard principal, métricas, gráficos |
| `frontend/src/components/Chat.tsx` | ~580 | ~7,200 | UI de chat, streaming, tool calls display |
| `frontend/src/components/Documents.tsx` | ~560 | ~7,000 | Gestión de documentos, upload, tabla |
| `frontend/src/components/Dashboard.tsx` | ~450 | ~5,600 | Dashboard de métricas, KPIs |
| `frontend/src/components/Clients.tsx` | ~380 | ~4,700 | CRUD de clientes, expediente KYC |
| `frontend/src/components/Fiscal.tsx` | ~340 | ~4,200 | Módulo fiscal, deadlines, deducciones |
| `frontend/src/components/Payroll.tsx` | ~320 | ~4,000 | Módulo de nómina |
| `frontend/src/components/Finance.tsx` | ~360 | ~4,500 | Módulo financiero, estados financieros |
| `frontend/src/components/Expenses.tsx` | ~340 | ~4,200 | Módulo de gastos, clasificación IA |
| `frontend/src/services/api.ts` | ~420 | ~5,200 | Cliente Axios configurado, interceptors, auth |
| `frontend/src/store/auth.store.ts` | ~120 | ~1,500 | Zustand store para autenticación |
| `frontend/src/store/chat.store.ts` | ~180 | ~2,200 | Zustand store para chat |
| `frontend/src/store/idp.store.ts` | ~150 | ~1,800 | Zustand store para IDP |
| `frontend/src/hooks/useAuth.ts` | ~140 | ~1,700 | Hook de autenticación |
| `frontend/src/hooks/useChat.ts` | ~160 | ~2,000 | Hook de chat |
| `frontend/src/hooks/useIDP.ts` | ~130 | ~1,600 | Hook de IDP |
| `docs/pilot/scripts/run_pipeline.py` | ~420 | ~5,200 | Pipeline de procesamiento del piloto |
| `docs/pilot/src/extraction_service.py` | ~380 | ~4,700 | Servicio de extracción del piloto |
| `frontend/tests/e2e/auth.spec.ts` | ~180 | ~2,200 | Tests E2E de autenticación |
| `frontend/tests/e2e/chat.spec.ts` | ~220 | ~2,700 | Tests E2E de chat |
| `frontend/tests/e2e/dashboard.spec.ts` | ~200 | ~2,500 | Tests E2E de dashboard |
| `frontend/tests/e2e/idp.spec.ts` | ~190 | ~2,300 | Tests E2E de IDP |

**Total Archivos de Código:** 138 archivos  
**Total Líneas de Código:** 23,313 LOC  
**Total Tokens Estimados:** ~422,658 tokens

---

## 🔌 Dependency Graph

### Backend - Import Graph

```
app/main.py
├── app/api/auth.py
│   ├── app/db/models.py → app/db/database.py
│   ├── app/core/security.py → app/core/config.py
│   └── app/db/database.py → app/core/config.py
├── app/api/idp.py
│   ├── app/services/nvidia_nim.py → app/core/config.py
│   ├── app/db/models.py
│   └── app/core/security.py
├── app/api/chat.py
│   ├── app/services/langgraph_agents.py
│   │   ├── app/agents/rag_agent.py
│   │   │   ├── app/services/rag_service.py → app/services/embeddings.py
│   │   │   └── app/services/nvidia_nim.py
│   │   ├── app/services/agent_tools.py
│   │   └── app/core/config.py
│   └── app/db/models.py
├── app/api/agent.py
│   ├── app/services/agent_tools.py
│   ├── app/services/langgraph_agents.py
│   └── app/core/security.py
├── app/api/rag.py
│   ├── app/services/rag_service.py
│   ├── app/services/embeddings.py
│   └── app/db/models.py
├── app/core/rate_limiter.py → app/core/config.py, Redis
└── app/db/database.py → app/core/config.py, SQLAlchemy

app/services/nvidia_nim.py
├── app/core/config.py
├── requests, json, httpx
└── NVIDIA NIM API endpoints

app/services/rag_service.py
├── app/services/embeddings.py
├── app/core/config.py
├── chromadb
└── app/db/models.py (metadata)
```

### Frontend - Import Graph

```
src/App.tsx
├── @components/Layout.tsx
│   ├── @components/ui/sidebar.tsx → Radix UI
│   ├── @hooks/useAuth.ts → @services/auth.service.ts → @services/api.ts
│   └── @store/auth.store.ts → Zustand
├── @components/Workspace.tsx
│   ├── @services/api.ts → Axios
│   └── @store/modules.store.ts
├── @components/Chat.tsx
│   ├── @hooks/useChat.ts → @services/chat.service.ts
│   └── @store/chat.store.ts
├── @components/Documents.tsx
│   ├── @hooks/useIDP.ts → @services/idp.service.ts
│   └── @store/idp.store.ts
└── [Clients, Fiscal, Payroll, Finance, Expenses, Settings]
    └── @services/api.ts

@services/api.ts
├── Axios
├── @services/auth.service.ts
└── @store/auth.store.ts

@store/*.ts
└── Zustand
```

### External Dependencies

#### Backend (Python)
```
FastAPI → Starlette, Pydantic
SQLAlchemy → DB abstraction
LangGraph → Agent orchestration
LangChain → LLM abstraction
ChromaDB → Vector store
Redis → Rate limiting, cache
requests, httpx → HTTP clients
python-jose → JWT
passlib → Password hashing
python-dotenv → .env loading
```

#### Frontend (JavaScript/TypeScript)
```
React 18 → UI framework
TypeScript → Type safety
Vite → Build tool
Tailwind CSS → Styling
shadcn/ui → Component library
Radix UI → Primitives accesibles
Zustand → State management
React Router → Routing
Recharts → Gráficos
Axios → HTTP client
Playwright → E2E testing
Vitest → Unit testing
```

---

## 🏗️ Patrones Arquitectónicos

### Backend - Layered Architecture

```
┌─────────────────────────────────────────┐
│         API Layer (FastAPI Routers)     │
│  /v1/auth, /v1/idp, /v1/chat, /v1/agent │
├─────────────────────────────────────────┤
│       Service Layer (Business Logic)    │
│  nvidia_nim.py, rag_service.py,         │
│  langgraph_agents.py, agent_tools.py    │
├─────────────────────────────────────────┤
│         Agent Layer (AI/ML)             │
│  rag_agent.py, ContableAgent            │
├─────────────────────────────────────────┤
│        Data Layer (Persistence)         │
│  database.py, models.py (SQLAlchemy)    │
├─────────────────────────────────────────┤
│         Core Layer (Utilities)          │
│  config.py, security.py, validators.py  │
└─────────────────────────────────────────┘
```

### Frontend - Component Architecture

```
┌─────────────────────────────────────────┐
│         Page Components (Routes)        │
│  Workspace, Chat, Documents, Clients... │
├─────────────────────────────────────────┤
│      Feature Components (Reusable)      │
│  Chat, Documents, Dashboard, Forms      │
├─────────────────────────────────────────┤
│         UI Components (shadcn/ui)       │
│  Button, Input, Table, Dialog, Card...  │
├─────────────────────────────────────────┤
│         Hooks (Logic Extraction)        │
│  useAuth, useChat, useIDP, use-mobile   │
├─────────────────────────────────────────┤
│      Services (API Communication)       │
│  api.ts, auth.service.ts, chat.service  │
├─────────────────────────────────────────┤
│         Store (State Management)        │
│  auth.store, chat.store, idp.store      │
└─────────────────────────────────────────┘
```

### Data Flow - RAG Pipeline

```
1. Usuario hace pregunta → Chat.tsx
2. POST /v1/chat/message → chat.py
3. ContableAgent.generate_response() → langgraph_agents.py
4. RAGAgent.retrieve_context() → rag_agent.py
   └─→ ChromaDB query → rag_service.py
   └─→ NVIDIA embeddings → embeddings.py
5. Build context con documentos recuperados
6. LLM generation → nvidia_nim.py (Llama 3.3 70B)
7. Streaming response → SSE → Chat.tsx
```

---

## 📈 Métricas de Proyecto

### Distribución por Lenguaje

| Lenguaje | Archivos | LOC | % del Total |
|----------|----------|-----|-------------|
| TypeScript/TSX | 65 | ~9,800 | 42% |
| Python | 45 | ~11,200 | 48% |
| JSON | 15 | ~1,800 | 8% |
| Otros (YAML, JS, BAT) | 13 | ~513 | 2% |
| **Total** | **138** | **23,313** | **100%** |

### Complejidad por Módulo

| Módulo | Complejidad | Razón |
|--------|-------------|-------|
| `services/nvidia_nim.py` | Alta | Múltiples endpoints NVIDIA, streaming, error handling |
| `agents/rag_agent.py` | Alta | LangGraph integration, retrieval, context building |
| `services/langgraph_agents.py` | Alta | StateGraph, tool calling, ReAct loop |
| `api/agent.py` | Media-Alta | ReAct loop, tool execution, streaming |
| `api/chat.py` | Media | Streaming SSE, conversation management |
| `services/rag_service.py` | Media | ChromaDB operations, query, ingest |
| `components/Workspace.tsx` | Media | Múltiples módulos, estado, gráficos |
| `components/Layout.tsx` | Media | Responsive, sidebar, navegación |
| `services/api.ts` | Media | Axios config, interceptors, auth |

---

## 🎯 Puntos de Entrada Principales

### Backend Entry Points

1. **`backend/app/main.py`** - FastAPI application factory
   - `create_app()` - Factory function
   - `lifespan()` - Startup/shutdown events
   - Routers registration
   - Middleware configuration

2. **`backend/app/core/config.py`** - Centralized settings
   - `Settings` class - Pydantic Settings
   - `settings` global instance
   - `validate_settings()` - Validation function

3. **`backend/app/db/database.py`** - Database initialization
   - `engine` - SQLAlchemy engine
   - `SessionLocal` - Session factory
   - `init_db()` - DB initialization

### Frontend Entry Points

1. **`frontend/src/main.tsx`** - React application entry
   - ReactDOM.createRoot()
   - App component mount
   - Global styles

2. **`frontend/src/App.tsx`** - React Router configuration
   - Route definitions
   - Layout wrapper
   - Module routes

3. **`frontend/src/services/api.ts`** - API client
   - Axios instance configuration
   - Request/response interceptors
   - Auth token handling

---

## 🚀 Flujos de Datos Principales

### 1. Document Processing Flow (IDP)

```
1. Usuario sube PDF/imagen → Documents.tsx (upload component)
2. POST /v1/idp/process (multipart/form-data) → idp.py
3. Guardar archivo → save_uploaded_file()
4. POST NVIDIA NIM OCR → nvidia_nim.py (NemoRetrieverOCR)
5. Extraer texto → OCR response parsing
6. POST NVIDIA NIM Vision → nvidia_nim.py (Llama 3.2 90B Vision)
7. Extraer entidades → entity_extraction (RFC, UUID, montos, fechas)
8. Validar RFC → validators.py (validar_rfc_sat())
9. Calcular confianza → calculate_confidence_score()
10. Guardar en DB → Document model
11. Ingestar a ChromaDB → rag_service.py (ingest())
12. Retornar resultado → DocumentProcessingResponse
```

### 2. Conversational RAG Flow

```
1. Usuario escribe pregunta → Chat.tsx (input form)
2. POST /v1/chat/message → chat.py
3. Obtener historial → Message model query
4. ContableAgent.generate_response() → langgraph_agents.py
5. RAGAgent.retrieve_context() → rag_agent.py
   a. Query ChromaDB → rag_service.py (query())
   b. Generar embedding → embeddings.py (NV-EmbedQA-E5-V5)
   c. Retrieve top-k docs → ChromaDB collection
6. Build context → rag_agent.py (build_context())
7. LLM generation → nvidia_nim.py (Llama 3.3 70B Instruct)
   a. System prompt con contexto RAG
   b. User message + history
   c. Streaming response
8. Guardar mensaje → Message model
9. Streaming SSE → Chat.tsx (token-by-token)
```

### 3. Agent Tool Calling Flow (ReAct)

```
1. Usuario pregunta con acción → Chat.tsx
2. POST /v1/agent/chat → agent.py
3. run_react_loop() → Agent loop (max 3 iteraciones)
4. LLM genera pensamiento → nvidia_nim.py
5. Extraer tool_call JSON → _extract_tool_calls()
6. Ejecutar herramienta → execute_tool()
   a. list_clients() → clients_api.py
   b. get_client_expediente() → clients_api.py
   c. validate_rfc() → validators.py
   d. analyze_cfdi() → nvidia_nim.py
7. Agregar resultado al historial → messages array
8. Repetir hasta respuesta final → loop
9. Limpiar respuesta → _clean_response()
10. Retornar con tool_calls → AgentChatResponse
```

---

## 📝 Notas Adicionales

### Configuración de Ambiente

El proyecto usa **doble configuración**:
- `.env` en raíz → Variables para Docker Compose
- `backend/.env` → Variables específicas del backend

**Variables críticas:**
- `NVIDIA_API_KEY` - API key de NVIDIA NIM
- `DATABASE_URL` - Conexión PostgreSQL
- `CHROMA_DB_HOST/PORT` - ChromaDB configuration
- `SECRET_KEY` - JWT signing key

### Scripts de Docker

- `docker-build-frontend.bat` - Build frontend producción
- `docker-build-frontend-dev.bat` - Build frontend desarrollo
- `docker-stop-frontend.bat` - Stop frontend container

### Tests

**Backend:**
- `backend/tests/test_core.py` - Core tests
- `backend/tests/test_integration.py` - Integration tests
- `backend/test_integracion.py` - Integration script

**Frontend:**
- `frontend/src/components/*.test.tsx` - Unit tests (Vitest)
- `frontend/tests/e2e/*.spec.ts` - E2E tests (Playwright)

---

*Documento generado: 2026-03-10*  
*Versión del proyecto: 2.0.0*  
*Total archivos analizados: 138*  
*Total líneas de código: 23,313 LOC*
