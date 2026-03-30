# Backend Knowledge Map - IDP Asistente Contable

**Generado:** 2026-03-12T12:30:00
**Versión:** 3.2.0
**Ubicación:** `backend/`
**Estado:** ✅ Fase 10-11 Completadas - Dashboard Predictivo, Calendar CRUD, Workflows, WebSocket, IA Tools

---

## Tabla de Contenidos

1. [Arquitectura General](#arquitectura-general)
2. [Estructura de Directorios](#estructura-de-directorios)
3. [Technical Reference](#technical-reference)
4. [API Endpoints](#api-endpoints)
5. [Database Models](#database-models)
6. [Pydantic Schemas](#pydantic-schemas)
7. [Dependency Analysis](#dependency-analysis)
8. [Servicios Principales](#servicios-principales)
9. [Data Persistence](#data-persistence)
10. [Configuración y Seguridad](#configuración-y-seguridad)
11. [Métricas del Proyecto](#métricas-del-proyecto)
12. [Nuevas Features 2026-03-12](#nuevas-features-2026-03-12)

---

## Arquitectura General

### Stack Tecnológico

| Componente | Tecnología | Versión |
|------------|------------|---------|
| **Framework** | FastAPI | Latest |
| **Lenguaje** | Python | 3.11+ |
| **Database** | PostgreSQL | 15+ |
| **ORM** | SQLAlchemy | Async (asyncpg) |
| **Validación** | Pydantic | v2 |
| **Auth** | OAuth2 + JWT | python-jose |
| **Vector Store** | ChromaDB | Latest |
| **Agentes** | LangGraph | Latest |
| **LLM Provider** | NVIDIA NIM | Multi-model |
| **Error Tracking** | Sentry SDK | Latest |
| **Rate Limiting** | SlowAPI + Redis | Latest |

### Patrones Arquitectónicos

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│                    (React + Vite + TS)                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST + JWT
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  FastAPI App + CORS + Rate Limiting (SlowAPI + Redis)    │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       ROUTER LAYER                               │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐         │
│  │ auth │ │ idp  │ │ chat │ │ rag  │ │agent │ │workspace│      │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘         │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                  │
│  │clients│ │fiscal│ │payroll│ │finance│ │expenses│             │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                               │
│  ┌──────────────────┐  ┌──────────────────┐                     │
│  │ NIMExtractionSvc │  │ LangGraphAgents  │                     │
│  │ - OCR NIM        │  │ - ContableAgent  │                     │
│  │ - Vision LLM     │  │ - RAGAgent       │                     │
│  │ - Rate Limiting  │  │ - Tool Calling   │                     │
│  └──────────────────┘  └──────────────────┘                     │
│  ┌──────────────────┐  ┌──────────────────┐                     │
│  │ RAGService       │  │ AgentTools       │                     │
│  │ - ChromaDB       │  │ - RFC Validation │                     │
│  │ - Embeddings     │  │ - SAT Queries    │                     │
│  │ - Reranking      │  │ - Client CRUD    │                     │
│  └──────────────────┘  └──────────────────┘                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                  │
│  ┌──────────────────┐  ┌──────────────────┐                     │
│  │  PostgreSQL      │  │   ChromaDB       │                     │
│  │  - Users         │  │   - Collections  │                     │
│  │  - Documents     │  │   - Embeddings   │                     │
│  │  - Conversations │  │   - Vectors      │                     │
│  │  - Messages      │  │                  │                     │
│  └──────────────────┘  └──────────────────┘                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
│  ┌──────────────────┐  ┌──────────────────┐                     │
│  │  NVIDIA NIM API  │  │     Sentry       │                     │
│  │  - Vision LLM    │  │  - Error Track   │                     │
│  │  - OCR NIM       │  │  - Performance   │                     │
│  │  - Embeddings    │  │  - Tracing       │                     │
│  └──────────────────┘  └──────────────────┘                     │
└─────────────────────────────────────────────────────────────────┘
```

### Flujo de Procesamiento de Documentos

```
Usuario → Upload PDF/Imagen → IDP Router → NIMExtractionService
                                              │
                                              ├── OCR (Nemoretriever OCR)
                                              ├── Image Enhancement (ImageMagick)
                                              ├── Vision LLM (Llama 3.2 90B)
                                              ├── RFC Validation
                                              └── Entity Extraction
                                              │
                                              ▼
Document DB ← Save Extracted Data ← Confidence Scoring
```

### Flujo de Chat con Agentes

```
Usuario → Chat Message → Agent Router → ContableAgent (LangGraph)
                                           │
                                           ├── Classifier Node
                                           ├── Retriever Node (RAG)
                                           ├── Reasoner Node
                                           └── Responder Node
                                           │
                                           ▼
Tool Calling → AgentTools → Execute → Observation → Response
```

---

## Estructura de Directorios

```
backend/
├── app/                          # Código fuente principal
│   ├── __init__.py               # Package init (versión 2.0.0)
│   ├── main.py                   # FastAPI app factory + Sentry init
│   │
│   ├── api/                      # API Routers (13 módulos - Fase 9: +2)
│   │   ├── __init__.py
│   │   ├── auth.py               # OAuth2 + JWT authentication
│   │   ├── idp.py                # Intelligent Document Processing
│   │   ├── chat.py               # Conversational chat endpoints
│   │   ├── agent.py              # Agentic chat con tool calling
│   │   ├── rag.py                # RAG (Retrieval-Augmented Generation)
│   │   ├── workspace.py          # Dashboard KPIs + Calendar
│   │   ├── clients.py            # Clientes CRUD + KYC
│   │   ├── fiscal.py             # Cumplimiento fiscal + Deducciones
│   │   ├── payroll.py            # Nómina + Empleados + SUA/IMSS
│   │   ├── finance.py            # Estados financieros + Bancos
│   │   ├── expenses.py           # Clasificación de gastos
│   │   ├── users.py              # Perfil usuario + Configuración
│   │   ├── reconciliation.py     # ✅ NUEVO - Conciliación bancaria (6 endpoints)
│   │   └── classification.py     # ✅ NUEVO - Clasificación contable (6 endpoints)
│   │
│   ├── core/                     # Configuración central + Seguridad
│   │   ├── __init__.py
│   │   ├── config.py             # Pydantic Settings (50+ configs)
│   │   ├── security.py           # JWT + OAuth2 + Password hashing
│   │   ├── validators.py         # Validadores (RFC, CURP, etc.)
│   │   ├── rate_limiter.py       # Redis + Memory fallback
│   │   └── sentry.py             # Sentry SDK configuration
│   │
│   ├── db/                       # Capa de datos
│   │   ├── __init__.py
│   │   ├── database.py           # SQLAlchemy async engine + session
│   │   └── models.py             # 4 modelos SQL (User, Document, Conversation, Message)
│   │
│   ├── services/                 # Servicios de negocio
│   │   ├── __init__.py
│   │   ├── nvidia_nim.py         # NVIDIA NIM OCR + Vision + LLM
│   │   ├── langgraph_agents.py   # Agentes LangGraph (ContableAgent)
│   │   ├── rag_service.py        # RAG con ChromaDB + Embeddings
│   │   ├── agent_tools.py        # Herramientas para agentes
│   │   ├── embeddings.py         # NVIDIA embeddings service
│   │   ├── idp/                  # ✅ NUEVO - IDP Services
│   │   │   ├── account_classifier.py  # ML classifier (NIF B-3)
│   │   │   └── cfdi_validator.py      # CFDI XSD validator
│   │   ├── reconciliation/       # Conciliación bancaria
│   │   │   ├── __init__.py
│   │   │   ├── bank_parser.py         # Parser 15+ bancos
│   │   │   ├── matching_engine.py     # Exact matching
│   │   │   ├── fuzzy_matching.py      # Fuzzy matching (token-overlap)
│   │   │   └── llm_validator.py       # LLM validation
│   │   ├── payroll/              # ✅ NUEVO Fase 10 - Motor de Nómina
│   │   │   ├── imss_calculator.py     # Cálculo IMSS 2026 (cuotas patronales/obrero)
│   │   │   ├── payroll_engine.py      # Motor ISR + percepciones/deducciones
│   │   │   ├── perceptions.py         # Percepciones de nómina
│   │   │   ├── spei_service.py        # Dispersión SPEI
│   │   │   └── stamping.py            # Timbrado de nómina
│   │   └── finance/              # ✅ NUEVO Fase 10 - Servicios Financieros
│   │       ├── banking_sync.py        # Sincronización bancaria multi-banco
│   │       ├── bbva_spark_service.py  # BBVA Spark Open API
│   │       └── matching_engine.py     # Motor de conciliación
│   │
│   └── agents/                   # Agentes especializados
│       ├── __init__.py
│       └── rag_agent.py          # RAG Agent para retrieval
│
├── tests/                        # Tests unitarios + integración
│   ├── __init__.py
│   ├── conftest.py               # Pytest fixtures
│   ├── test_core.py              # Tests de configuración + seguridad
│   ├── test_integration.py       # Tests de integración API
│   ├── test_integracion.py       # Tests de integración adicionales
│   ├── test_payroll_calculations.py  # ✅ NUEVO - Tests IMSS/ISR 2026
│   ├── test_fuzzy_matching.py    # ✅ NUEVO - Tests fuzzy matching (mocks)
│   └── test_rag_system.py        # Tests del sistema RAG
│
├── pyproject.toml                # ✅ NUEVO - Config proyecto + Pyright + pytest
├── .pyre_configuration           # ✅ NUEVO - Pyre2 type-checker config
├── pyre.toml                     # Pyre2 config (TOML format)
├── docs/                         # Documentación generada
│   ├── BACKEND_KNOWLEDGE_MAP.md  # Este archivo
│   └── backend-knowledge-index.json
│
├── .venv/                        # Virtual environment (excluido)
├── uploads/                      # Archivos subidos (runtime)
├── dataset/                      # Dataset de entrenamiento
│   ├── pdf/
│   └── xml/
├── output/                       # Resultados de procesamiento
├── logs/                         # Logs de aplicación
│
├── .env                          # Variables de entorno
├── .env.example                  # Template de configuración
├── requirements.txt              # Dependencias Python
├── Dockerfile                    # Containerización
├── docker-compose.yml            # Orquestación de servicios
├── repomix.config.json           # Configuración Repomix
└── README.md                     # Documentación principal
```

---

## Technical Reference

### Inventario de Archivos

| Archivo | Rol | LOC Estimadas | Tokens | Descripción |
|---------|-----|---------------|--------|-------------|
| `app/main.py` | Entry Point | ~350 | ~4,200 | FastAPI app factory, Sentry init, routers registration |
| `app/core/config.py` | Configuration | ~200 | ~2,400 | Pydantic Settings con 50+ configuraciones |
| `app/core/security.py` | Security | ~280 | ~3,360 | JWT, OAuth2, password hashing, user authentication |
| `app/db/models.py` | Data Models | ~80 | ~960 | 4 modelos SQLAlchemy (User, Document, Conversation, Message) |
| `app/db/database.py` | Database | ~60 | ~720 | SQLAlchemy async engine, session factory |
| `app/api/auth.py` | Auth Router | ~190 | ~2,280 | OAuth2 token, refresh, user info endpoints |
| `app/api/idp.py` | IDP Router | ~430 | ~5,160 | Document processing, batch processing, status |
| `app/api/chat.py` | Chat Router | ~350 | ~4,200 | Conversational chat, streaming, conversation management |
| `app/api/agent.py` | Agent Router | ~430 | ~5,160 | Agentic chat con tool calling, ReAct loop |
| `app/api/rag.py` | RAG Router | ~540 | ~6,480 | RAG ingest, query, collections management |
| `app/api/workspace.py` | Workspace Router | ~100 | ~1,200 | Dashboard KPIs, calendar events, metrics |
| `app/api/clients.py` | Clients Router | ~160 | ~1,920 | Clientes CRUD, expedientes KYC |
| `app/api/fiscal.py` | Fiscal Router | ~100 | ~1,200 | Deadlines, deductions, annual reports |
| `app/api/payroll.py` | Payroll Router | ~100 | ~1,200 | Nómina summary, employees, SUA/IMSS |
| `app/api/finance.py` | Finance Router | ~100 | ~1,200 | Financial statements, bank accounts |
| `app/api/expenses.py` | Expenses Router | ~80 | ~960 | Expense categories, pending classification |
| `app/api/users.py` | Users Router | ~120 | ~1,440 | User profile, settings, fiscal profiles |
| `app/services/nvidia_nim.py` | NIM Service | ~510 | ~6,120 | OCR, Vision LLM, rate limiting, retry logic |
| `app/services/langgraph_agents.py` | Agents Service | ~480 | ~5,760 | ContableAgent, LangGraph workflows |
| `app/services/rag_service.py` | RAG Service | ~400* | ~4,800* | ChromaDB, embeddings, reranking |
| `app/services/agent_tools.py` | Agent Tools | ~300* | ~3,600* | Tool definitions, execution logic |
| `tests/test_core.py` | Core Tests | ~200* | ~2,400* | Security, config validation tests |
| `tests/test_integration.py` | Integration Tests | ~300* | ~3,600* | API integration tests |

### Nuevos Componentes - Fase 9 (Reconciliación + Clasificación)

| Archivo | Rol | LOC | Tokens | Descripción |
|---------|-----|-----|--------|-------------|
| **Reconciliación Bancaria** | | | | |
| `app/db/models_reconciliation.py` | Data Models | 180 | ~2,160 | 4 modelos SQL (BankStatement, BankTransaction, ReconciliationMatch, ReconciliationBatch) |
| `app/services/reconciliation/bank_parser.py` | Parser Service | 552 | ~6,624 | Parser 15+ bancos mexicanos (CSV, XLSX), Windows-1252, fecha_valor |
| `app/services/reconciliation/matching_engine.py` | Exact Match | 250 | ~3,000 | Capa 1: Monto ±0.01, fecha ±3 días (60-70% éxito) |
| `app/services/reconciliation/fuzzy_matching.py` | Fuzzy Match | 380 | ~4,560 | Capa 2: Levenshtein, Jaccard, Provider (15-20% éxito) |
| `app/services/reconciliation/llm_validator.py` | LLM Validation | 320 | ~3,840 | Capa 3: NVIDIA NIM Llama-3.3-70B-Instruct (5-10% éxito) |
| `app/api/reconciliation.py` | API Router | 732 | ~8,784 | 6 endpoints (upload, batches, matches, confirm, reject, stats) |
| **Clasificación Contable** | | | | |
| `app/services/idp/account_classifier.py` | ML Classifier | ~400 | ~4,800 | Random Forest + NIM Embeddings (85-92% precisión) |
| `app/services/idp/cfdi_validator.py` | CFDI Validator | 650 | ~7,800 | Validación XSD 4 niveles + catálogos + reglas negocio |
| `app/api/classification.py` | API Router | 651 | ~7,812 | 6 endpoints (suggest, feedback, accuracy, accounts, classify, batch) |

**Total Backend Fase 9:** 4,602 líneas Python + 3,952 líneas investigación = 8,554 líneas

### Nuevos Componentes — Fase 10 (Payroll + Finance + Testing)

| Archivo | Rol | LOC | Tokens | Descripción |
|---------|-----|-----|--------|-------------|
| **Motor de Nómina** | | | | |
| `app/services/payroll/imss_calculator.py` | IMSS Calculator | ~400 | ~4,800 | Cuotas IMSS 2026: patronal, obrero, UMA $113.14, tramos SBC |
| `app/services/payroll/payroll_engine.py` | Payroll Engine | ~500 | ~6,000 | ISR 2026 brackets, percepciones, deducciones, neto |
| `app/services/payroll/perceptions.py` | Perceptions | ~200 | ~2,400 | Tipos de percepciones (sueldo, horas extra, bonos) |
| `app/services/payroll/spei_service.py` | SPEI Service | ~300 | ~3,600 | Dispersión de nómina vía SPEI |
| `app/services/payroll/stamping.py` | Stamping | ~250 | ~3,000 | Timbrado fiscal de recibos |
| **Servicios Financieros** | | | | |
| `app/services/finance/banking_sync.py` | Banking Sync | ~350 | ~4,200 | Sincronización multi-banco (BBVA, Banorte, etc.) |
| `app/services/finance/bbva_spark_service.py` | BBVA Spark API | ~300 | ~3,600 | BBVA Spark Open API para balances/movimientos |
| `app/services/finance/matching_engine.py` | Finance Matching | ~250 | ~3,000 | Motor de conciliación financiera |
| **Testing** | | | | |
| `tests/test_payroll_calculations.py` | Payroll Tests | ~100 | ~1,200 | 3 tests: IMSS patronal, ISR bracket, cuota desglose |
| `tests/test_fuzzy_matching.py` | Fuzzy Tests | ~100 | ~1,200 | 4 tests: BBVA match, negative, Levenshtein, Jaccard |
| `tests/test_rag_system.py` | RAG Tests | ~150 | ~1,800 | Tests del sistema RAG |
| **Build Config** | | | | |
| `pyproject.toml` | Project Config | ~170 | ~2,040 | Dependencies, Pyright, pytest, black, mypy |
| `.pyre_configuration` | Pyre2 Config | ~15 | ~180 | Search roots + site-packages path |

**Total Fase 10:** ~3,085 líneas Python + config

**Total Estimado:** ~5,860 LOC | ~70,320 tokens

*LOC estimadas basadas en patrones de archivos similares

---

## API Endpoints

### Auth (`/v1/auth`)

| Método | Ruta | Descripción | Auth | Request | Response |
|--------|------|-------------|------|---------|----------|
| POST | `/token` | OAuth2 token endpoint | ❌ | OAuth2PasswordRequestForm | Token (access, refresh) |
| GET | `/me` | Current user info | ✅ | - | User profile |
| POST | `/refresh` | Refresh access token | ❌ | RefreshTokenRequest | Token |

### IDP - Intelligent Document Processing (`/v1/idp`)

| Método | Ruta | Descripción | Auth | Request | Response |
|--------|------|-------------|------|---------|----------|
| POST | `/process` | Process single document | ✅ | UploadFile + form | DocumentProcessingResponse |
| POST | `/batch-process` | Batch document processing | ✅ | BatchProcessRequest | BatchProcessResponse |
| GET | `/{document_id}` | Get document status | ✅ | - | DocumentStatusResponse |

### Chat (`/v1/chat`)

| Método | Ruta | Descripción | Auth | Request | Response |
|--------|------|-------------|------|---------|----------|
| POST | `/message` | Send chat message | ✅ | ChatRequest | ChatResponse |
| GET | `/conversation/{id}` | Get conversation | ✅ | - | ConversationDetailResponse |
| DELETE | `/conversation/{id}` | Delete conversation | ✅ | - | Status |
| GET | `/conversations` | List user conversations | ✅ | - | List[ConversationSummary] |

### Agent (`/v1/agent`)

| Método | Ruta | Descripción | Auth | Request | Response |
|--------|------|-------------|------|---------|----------|
| POST | `/chat` | Agentic chat con tool calling | ✅ | AgentChatRequest | AgentChatResponse |
| GET | `/tools` | List available tools | ✅ | - | ToolDefinitionResponse |

### RAG (`/v1/rag`)

| Método | Ruta | Descripción | Auth | Request | Response |
|--------|------|-------------|------|---------|----------|
| POST | `/ingest` | Ingest document | ✅ | IngestRequest | IngestResponse |
| POST | `/ingest/batch` | Batch document ingestion | ✅ | BatchIngestRequest | BatchIngestResponse |
| POST | `/query` | Query with retrieval | ✅ | QueryRequest | QueryResponse |
| GET | `/collections` | List collections | ✅ | - | CollectionsResponse |
| DELETE | `/collections/{name}` | Delete collection | ✅ | - | Status |
| GET | `/stats` | RAG system statistics | ✅ | - | StatsResponse |

### Workspace (`/v1/workspace`)

| Método | Ruta | Descripción | Auth | Request | Response |
|--------|------|-------------|------|---------|----------|
| GET | `/dashboard` | Dashboard KPIs | ✅ | - | DashboardKPIs |
| GET | `/calendar` | Fiscal calendar events | ✅ | - | List[CalendarEvent] |
| GET | `/metrics` | IA engine metrics | ✅ | - | Dict |

### Clients (`/v1/clients`)

| Método | Ruta | Descripción | Auth | Request | Response |
|--------|------|-------------|------|---------|----------|
| GET | `/` | List clients | ✅ | Query params | List[ClientResponse] |
| GET | `/{client_id}` | Get client by ID | ✅ | - | ClientResponse |
| POST | `/` | Create client | ✅ | ClientCreate | ClientResponse |
| PUT | `/{client_id}` | Update client | ✅ | ClientUpdate | ClientResponse |
| DELETE | `/{client_id}` | Delete client | ✅ | - | Status |
| GET | `/{client_id}/expediente` | Get client KYC file | ✅ | - | ExpedienteResponse |

### Fiscal (`/v1/fiscal`)

| Método | Ruta | Descripción | Auth | Request | Response |
|--------|------|-------------|------|---------|----------|
| GET | `/deadlines` | Fiscal deadlines | ✅ | - | List[FiscalDeadline] |
| GET | `/deductions` | Personal deductions | ✅ | - | List[Deduction] |
| GET | `/annual-report` | Annual report status | ✅ | year | AnnualReport |
| GET | `/opinion` | SAT compliance opinion | ✅ | - | Dict |
| GET | `/coeficiente` | Coeficiente de Utilidad | ✅ | - | Dict |

### Payroll (`/v1/payroll`)

| Método | Ruta | Descripción | Auth | Request | Response |
|--------|------|-------------|------|---------|----------|
| GET | `/summary` | Payroll summary | ✅ | - | PayrollSummary |
| GET | `/employees` | Employee list | ✅ | - | List[Employee] |
| POST | `/disperse` | Execute payroll dispersion | ✅ | - | Dict |
| GET | `/special-calcs` | Special calculations | ✅ | - | List[SpecialCalc] |
| GET | `/sua` | SUA/IMSS status | ✅ | - | Dict |

### Finance (`/v1/finance`)

| Método | Ruta | Descripción | Auth | Request | Response |
|--------|------|-------------|------|---------|----------|
| GET | `/summary` | Financial summary | ✅ | - | FinanceSummary |
| GET | `/statements` | Financial statements | ✅ | - | List[FinancialStatement] |
| GET | `/bank-accounts` | Connected bank accounts | ✅ | - | List[BankAccount] |
| POST | `/reconcile` | Bank reconciliation | ✅ | bank_id | Dict |
| GET | `/cash-flow` | Cash flow analysis | ✅ | - | Dict |

### Expenses (`/v1/expenses`)

| Método | Ruta | Descripción | Auth | Request | Response |
|--------|------|-------------|------|---------|----------|
| GET | `/categories` | Expense categories | ✅ | - | List[ExpenseCategory] |
| GET | `/pending` | Pending expenses | ✅ | - | List[PendingExpense] |
| POST | `/classify` | Re-run classification | ✅ | - | Dict |
| GET | `/budget` | Budget overview | ✅ | - | Dict |

### Users (`/v1/users`)

| Método | Ruta | Descripción | Auth | Request | Response |
|--------|------|-------------|------|---------|----------|
| GET | `/me` | User profile | ✅ | - | UserProfile |
| PUT | `/me` | Update profile | ✅ | UserUpdate | UserProfile |
| GET | `/me/settings` | User settings | ✅ | - | UserSettings |
| PUT | `/me/settings` | Update settings | ✅ | UserSettings | UserSettings |
| GET | `/me/fiscal-profiles` | Fiscal profiles | ✅ | - | List[FiscalProfile] |
| GET | `/me/subscription` | Subscription info | ✅ | - | Subscription |

### Health & Root

| Método | Ruta | Descripción | Auth | Response |
|--------|------|-------------|------|----------|
| GET | `/` | Root endpoint | ❌ | API info |
| GET | `/health` | Health check | ❌ | Status |
| GET | `/health/detailed` | Detailed health | ❌ | Component status |
| GET | `/docs` | OpenAPI/Swagger | ❌ | Swagger UI |
| GET | `/redoc` | ReDoc | ❌ | ReDoc UI |
| GET | `/openapi.json` | OpenAPI spec | ❌ | JSON spec |

### Sentry Test (Development)

| Método | Ruta | Descripción | Auth | Response |
|--------|------|-------------|------|----------|
| GET | `/sentry-test/message` | Send test message | ❌ | Message ID |
| GET | `/sentry-test/error` | Trigger test error | ❌ | Error to Sentry |

---

## Database Models

### SQLAlchemy Models (`app/db/models.py`)

#### User
```python
class User(Base):
    __tablename__ = "users"

    id: int                      # Primary key, index
    email: str                   # Unique, index, not null
    hashed_password: str         # Not null (bcrypt)
    full_name: str              # Optional
    is_active: int              # Default: 1
    created_at: datetime        # Default: utcnow
    updated_at: datetime        # Default: utcnow, onupdate

    # Relationships
    documents: List[Document]
    conversations: List[Conversation]
    bank_statements: List[BankStatement]  # ✅ NUEVO - Fase 9
```

#### Document
```python
class Document(Base):
    __tablename__ = "documents"

    id: int                      # Primary key, index
    user_id: int                 # Foreign key → users.id
    document_type: str           # Not null (factura, recibo, etc.)
    file_path: str               # Not null
    original_filename: str       # Optional
    extracted_data: JSON         # Extracted entities
    confidence_score: float      # 0-1 confidence
    status: str                  # pending, processing, completed, failed
    created_at: datetime
    updated_at: datetime

    # Relationship
    user: User
    bank_matches: List[ReconciliationMatch]  # ✅ NUEVO - Fase 9
```

### Nuevos Modelos - Fase 9 (`app/db/models_reconciliation.py`)

#### BankStatement
```python
class BankStatement(Base):
    __tablename__ = "bank_statements"

    id: int                      # Primary key, index
    user_id: int                 # Foreign key → users.id
    banco: str                   # BBVA, Santander, Banorte, etc.
    cuenta: str                  # Últimos 4 dígitos
    fecha_inicio: datetime       # Inicio del estado de cuenta
    fecha_fin: datetime          # Fin del estado de cuenta
    saldo_inicial: Decimal       # Saldo inicial
    saldo_final: Decimal         # Saldo final
    archivo_path: str            # Ruta del archivo
    archivo_nombre: str          # Nombre original
    archivo_size: int            # Tamaño en bytes
    estado: str                  # pending, processing, completed, failed
    total_transacciones: int     # Número de transacciones
    total_matches: int           # Número de matches
    metadata: JSON               # Metadatos del parsing
    created_at: datetime
    updated_at: datetime

    # Relationships
    user: User
    transactions: List[BankTransaction]
```

#### BankTransaction
```python
class BankTransaction(Base):
    __tablename__ = "bank_transactions"

    id: int                      # Primary key, index
    bank_statement_id: int       # Foreign key → bank_statements.id
    fecha: datetime              # Fecha de la transacción
    fecha_valor: datetime        # Fecha de valor
    concepto: str                # Concepto del movimiento
    concepto_limpio: str         # Concepto normalizado
    tipo: str                    # cargo, abono
    monto: Decimal               # Monto del movimiento
    saldo: Decimal               # Saldo después del movimiento
    referencia: str              # Referencia bancaria
    proveedor: str               # Nombre del proveedor
    rfc_proveedor: str           # RFC del proveedor
    match_status: str            # unmatched, exact, fuzzy, llm, confirmed, rejected
    cfdi_id: int                 # Foreign key → documents.id
    confidence_score: float      # Score de confianza del match
    revisado_por: int            # Usuario que revisó
    revisado_at: datetime

    # Relationships
    bank_statement: BankStatement
    match: ReconciliationMatch
    reviewer: User
```

#### ReconciliationMatch
```python
class ReconciliationMatch(Base):
    __tablename__ = "reconciliation_matches"

    id: int                      # Primary key, index
    bank_transaction_id: int     # Unique, Foreign key → bank_transactions.id
    cfdi_id: int                 # Foreign key → documents.id
    match_type: str              # exact, fuzzy, llm_confirmed, llm_review
    confidence_score: float      # 0-1 confidence
    match_details: JSON          # Detalles del match
    estado: str                  # pending, confirmed, rejected
    rechazo_razon: str           # Razón de rechazo
    confirmado_por: int          # Usuario que confirmó
    confirmado_at: datetime
    created_at: datetime
    updated_at: datetime

    # Relationships
    bank_transaction: BankTransaction
    cfdi: Document
    confirmer: User
```

#### ReconciliationBatch
```python
class ReconciliationBatch(Base):
    __tablename__ = "reconciliation_batches"

    id: int                      # Primary key, index
    user_id: int                 # Foreign key → users.id
    bank_statement_id: int       # Foreign key → bank_statements.id
    estado: str                  # pending, processing, completed, failed
    total_transacciones: int     # Total de transacciones
    total_matches_exact: int     # Matches exactos
    total_matches_fuzzy: int     # Matches fuzzy
    total_matches_llm: int       # Matches LLM
    total_unmatched: int         # Transacciones sin match
    progreso: float              # 0-100%
    started_at: datetime
    completed_at: datetime
    error_message: str
    metadata: JSON
    created_at: datetime
    updated_at: datetime

    # Relationships
    user: User
    bank_statement: BankStatement
```

#### Conversation
```python
class Conversation(Base):
    __tablename__ = "conversations"
    
    id: int                      # Primary key, index
    user_id: int                 # Foreign key → users.id
    title: str                   # Optional (auto-generated)
    created_at: datetime
    updated_at: datetime
    
    # Relationships
    user: User
    messages: List[Message]      # Ordered by created_at
```

#### Message
```python
class Message(Base):
    __tablename__ = "messages"
    
    id: int                      # Primary key, index
    conversation_id: int         # Foreign key → conversations.id
    role: str                    # user, assistant, system
    content: Text                # Not null
    metadata: JSON               # Optional metadata
    created_at: datetime
    
    # Relationship
    conversation: Conversation
```

### Database Configuration (`app/db/database.py`)

```python
# Engine configuration
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20
)

# Session factory
async_session_factory = async_sessionmaker(
    engine,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

# Base class
Base = declarative_base()

# Dependency
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_factory() as session:
        yield session
```

---

## Pydantic Schemas

### Authentication Schemas (`app/core/security.py`)

```python
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: Optional[int]
    email: Optional[str]
    exp: Optional[datetime]

class UserCreate(BaseModel):
    email: str
    password: str
    full_name: Optional[str]

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str]
    is_active: bool
    created_at: datetime
```

### IDP Schemas (`app/api/idp.py`)

```python
class DocumentProcessingRequest(BaseModel):
    document_type: str
    metadata: Optional[Dict[str, Any]]

class DocumentProcessingResponse(BaseModel):
    document_id: str
    status: str
    extracted_data: Optional[Dict[str, Any]]
    confidence_score: Optional[float]
    latency: Optional[float]
    message: str

class BatchProcessRequest(BaseModel):
    document_type: str
    max_workers: int = Field(default=4, ge=1, le=10)
```

### Chat Schemas (`app/api/chat.py`)

```python
class ChatMessage(BaseModel):
    role: str  # user, assistant, system
    content: str

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str]
    context: Optional[Dict[str, Any]]
    stream: bool = False

class ChatResponse(BaseModel):
    conversation_id: str
    message: ChatMessage
    sources: Optional[List[str]]
    confidence: float
    metadata: Optional[Dict[str, Any]]
```

### Agent Schemas (`app/api/agent.py`)

```python
class AgentChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str]
    model: Optional[str]
    context: Optional[Dict[str, Any]]
    stream: bool = False

class ToolCallInfo(BaseModel):
    tool_name: str
    params: Dict[str, Any]
    result: Dict[str, Any]
    latency: float

class AgentChatResponse(BaseModel):
    conversation_id: str
    content: str
    tool_calls: List[ToolCallInfo]
    model_used: str
    total_latency: float
```

### RAG Schemas (`app/api/rag.py`)

```python
class IngestRequest(BaseModel):
    content: str
    metadata: Optional[Dict[str, Any]]
    document_id: Optional[str]

class QueryRequest(BaseModel):
    query: str
    top_k: int = Field(default=5, ge=1, le=20)
    document_type: Optional[str]
    include_sources: bool = True

class QueryResponse(BaseModel):
    query: str
    answer: Optional[str]
    context_docs: List[Dict[str, Any]]
    sources: Optional[List[Dict[str, Any]]]
    num_docs_retrieved: int
    latency: float
    model_used: Optional[str]
```

---

## Dependency Analysis

### Dependency Graph

```
main.py
├── Sentry SDK (initialization)
├── FastAPI (app factory)
├── CORS Middleware
├── SlowAPI (rate limiting)
│
├── Routers
│   ├── auth.py → security.py, db/models.py
│   ├── idp.py → services/nvidia_nim.py, db/models.py
│   ├── chat.py → services/langgraph_agents.py, db/models.py
│   ├── agent.py → services/agent_tools.py, services/langgraph_agents.py
│   ├── rag.py → services/rag_service.py, agents/rag_agent.py
│   ├── workspace.py → db/models.py
│   ├── clients.py → db/models.py
│   ├── fiscal.py → db/models.py
│   ├── payroll.py → db/models.py
│   ├── finance.py → db/models.py
│   ├── expenses.py → db/models.py
│   └── users.py → db/models.py
│
├── Core
│   ├── config.py → pydantic_settings, os
│   ├── security.py → python-jose, passlib, fastapi.security
│   ├── validators.py → re, typing
│   ├── rate_limiter.py → redis, slowapi
│   └── sentry.py → sentry_sdk
│
├── Database
│   ├── database.py → SQLAlchemy async, asyncpg
│   └── models.py → SQLAlchemy ORM
│
└── Services
    ├── nvidia_nim.py → requests, aiohttp, pdf2image, ImageMagick
    ├── langgraph_agents.py → langgraph, langchain
    ├── rag_service.py → chromadb, requests
    ├── agent_tools.py → requests, typing
    └── embeddings.py → requests
```

### External Dependencies (`requirements.txt`)

#### Core Framework
- `fastapi>=0.109.0`
- `uvicorn[standard]>=0.27.0`
- `python-multipart>=0.0.6`

#### Database
- `sqlalchemy>=2.0.0`
- `asyncpg>=0.29.0`
- `psycopg2-binary>=2.9.9`

#### Authentication & Security
- `python-jose[cryptography]>=3.3.0`
- `passlib[bcrypt]>=1.7.4`
- `bcrypt>=4.0.1`

#### AI/ML Services
- `langgraph>=0.0.1`
- `langchain>=0.1.0`
- `chromadb>=0.4.0`
- `requests>=2.31.0`
- `aiohttp>=3.9.0`

#### Document Processing
- `pdf2image>=1.16.0`
- `PyPDF2>=3.0.0`

#### Rate Limiting & Caching
- `slowapi>=0.1.9`
- `redis>=5.0.0`

#### Configuration
- `pydantic-settings>=2.1.0`
- `python-dotenv>=1.0.0`

#### Monitoring
- `sentry-sdk[fastapi]>=1.39.0`

#### Testing
- `pytest>=7.4.0`
- `pytest-asyncio>=0.23.0`
- `httpx>=0.26.0`

---

## Servicios Principales

### NIMExtractionService (`app/services/nvidia_nim.py`)

**Propósito:** Extracción de datos de facturas usando NVIDIA NIM Vision

**Modelos Utilizados:**
- `meta/llama-3.2-90b-vision-instruct` - Extracción visual
- `nvidia/nemoretriever-ocr-v1` - OCR de documentos
- `meta/llama-3.3-70b-instruct` - Razonamiento contable

**Características:**
- Rate limiting thread-safe (40 RPM Develop tier)
- Retry con exponential backoff (5 retries, base 2s)
- Mejora de imagen con ImageMagick
- Validación automática de RFCs
- Conversión PDF→PNG (400 DPI)

**Métodos Principales:**
```python
def process_document(file_path: str, document_type: str) -> Dict
def _pdf_to_png(pdf_path: str, dpi: int = 400) -> List[bytes]
def _enhance_image(image_bytes: bytes) -> bytes
def _extract_entities(image_bytes: bytes) -> Dict
def _validate_rfc(rfc: str) -> Tuple[bool, str]
```

### ContableAgent (`app/services/langgraph_agents.py`)

**Propósito:** Agente principal para consultas contables y fiscales

**Arquitectura LangGraph:**
```
classifier → [retrieval|reasoning|direct] → responder → END
                    ↓
              retriever → reasoner
```

**Nodos del Grafo:**
1. **classifier** - Clasifica intención (retrieval, reasoning, direct)
2. **retriever** - Recupera contexto de RAG/ChromaDB
3. **reasoner** - Razona con contexto y herramientas
4. **responder** - Genera respuesta final

**Features:**
- Streaming de respuestas token-por-token
- RAG con legislación fiscal mexicana
- Validación con fuentes
- Scores de confianza

### RAGService (`app/services/rag_service.py`)

**Propósito:** Retrieval-Augmented Generation con ChromaDB

**Componentes:**
- **ChromaDB** - Vector store para embeddings
- **NVIDIA Embeddings** - `nvidia/nv-embedqa-e5-v5` (1024 dimensiones)
- **Reranking** - `nvidia/nv-rerankqa-mistral-4b-v3`

**Operaciones:**
```python
def ingest_document(content: str, metadata: Dict) -> str
def query_documents(query: str, top_k: int, filters: Dict) -> List[Dict]
def create_collection(name: str, metadata: Dict) -> Collection
def delete_collection(name: str) -> bool
def get_stats() -> Dict
```

### AgentTools (`app/services/agent_tools.py`)

**Propósito:** Herramientas ejecutables para agentes

**Herramientas Disponibles:**
| Herramienta | Descripción | Parámetros |
|-------------|-------------|------------|
| `get_client_by_rfc` | Consulta cliente por RFC | rfc: str |
| `get_client_by_name` | Búsqueda fuzzy de clientes | name: str |
| `validate_rfc_sat` | Valida RFC en SAT | rfc: str |
| `get_invoice_by_uuid` | Consulta factura por UUID | uuid: str |
| `calculate_deductions` | Calcula deducciones | year: int, rfc: str |
| `get_fiscal_calendar` | Obtiene calendario fiscal | month: int, year: int |
| `classify_expense` | Clasifica gasto | vendor: str, concept: str, amount: float |

---

## Data Persistence

### Ubicación y Estructura

Los datos de persistencia están almacenados en el directorio raíz `data/`, separado del código del backend para:

1. ✅ **Separación de responsabilidades** - Código vs datos
2. ✅ **Facilitar backups** - Solo el directorio `data/`
3. ✅ **Persistencia Docker** - Volúmenes montados
4. ✅ **Escalabilidad** - Permite múltiples bases de datos

```
idp-asistente-contable/
├── data/                    ← Persistencia de datos
│   ├── chroma_data/         # Vector Store (ChromaDB)
│   │   └── .gitkeep
│   └── pg_data/             # PostgreSQL Database
│       └── .gitkeep
│
├── backend/
│   ├── app/                 # Código fuente
│   └── knowledge/           # Documentación técnica
```

### PostgreSQL (`data/pg_data/`)

| Característica | Detalle |
|----------------|---------|
| **Propósito** | Base de datos relacional para usuarios, documentos, conversaciones |
| **Modelos** | `User`, `Document`, `Conversation`, `Message` |
| **ORM** | SQLAlchemy async con asyncpg |
| **Conexión** | `postgresql+asyncpg://user:pass@postgres:5432/idp_contable` |
| **Volumen Docker** | `./data/pg_data:/var/lib/postgresql/data` |

**Flujo de Datos:**
```
API Endpoints (/v1/*)
    ↓
SQLAlchemy Models (backend/app/models/)
    ↓
AsyncSession (asyncpg)
    ↓
PostgreSQL Server (Docker)
    ↓
data/pg_data/  (persistencia en disco)
```

### ChromaDB (`data/chroma_data/`)

| Característica | Detalle |
|----------------|---------|
| **Propósito** | Vector Store para RAG (Retrieval-Augmented Generation) |
| **Embeddings** | NVIDIA nv-embedqa-e5-v5 (1024 dimensiones) |
| **Colecciones** | Una por usuario para aislamiento de datos |
| **Conexión** | `http://chromadb:8000` |
| **Volumen Docker** | `./data/chroma_data:/chroma/chroma` |

**Flujo de Datos:**
```
API RAG (/v1/rag/*)
    ↓
RAGService (backend/app/services/rag_service.py)
    ↓
ChromaDB Client
    ↓
ChromaDB Server (Docker)
    ↓
data/chroma_data/  (persistencia de vectores)
```

### Comandos de Gestión de Datos

#### Backup
```bash
# Backup completo
tar -czf data-backup-$(date +%Y%m%d).tar.gz data/

# Backup solo PostgreSQL
docker exec idp-postgres pg_dump -U postgres idp_contable > pg_backup.sql

# Backup solo ChromaDB
tar -czf chroma-backup.tar.gz data/chroma_data/
```

#### Restore
```bash
# Restaurar backup completo
tar -xzf data-backup-YYYYMMDD.tar.gz

# Restaurar PostgreSQL
cat pg_backup.sql | docker exec -i idp-postgres psql -U postgres idp_contable

# Restaurar ChromaDB
tar -xzf chroma-backup.tar.gz
```

#### Limpieza (Desarrollo)
```bash
# ⚠️ ADVERTENCIA: Elimina TODOS los datos
docker-compose down -v
rm -rf data/pg_data/* data/chroma_data/*
docker-compose up -d postgres chromadb
```

### Monitoreo

```bash
# Tamaño de datos
du -sh data/pg_data/      # PostgreSQL
du -sh data/chroma_data/  # ChromaDB

# Logs PostgreSQL
docker logs idp-postgres

# Logs ChromaDB
docker logs idp-chromadb
```

### Troubleshooting

| Problema | Solución |
|----------|----------|
| ChromaDB no inicia | `rm -rf data/chroma_data/* && docker-compose restart chromadb` |
| PostgreSQL corrupto | `docker logs idp-postgres` para diagnóstico |
| Disco lleno | `du -sh data/` + `docker exec idp-postgres psql -c "VACUUM FULL;"` |

### Documentación Relacionada

- 📄 `data/README.md` - Documentación completa de persistencia
- 📄 `backend/app/db/session.py` - Configuración de sesión SQLAlchemy
- 📄 `backend/app/services/rag_service.py` - Implementación de ChromaDB

---

## Configuración y Seguridad

### Settings (`app/core/config.py`)

**Configuración Principal (50+ variables):**

```python
class Settings(BaseSettings):
    # Application
    APP_NAME: str = "IDP Asistente Contable"
    APP_VERSION: str = "2.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"
    
    # NVIDIA API
    NVIDIA_API_KEY: str
    NVIDIA_NIM_BASE_URL: str = "https://ai.api.nvidia.com/v1/cv"
    OCR_MODEL: str = "nvidia/nemoretriever-ocr-v1"
    VISION_MODEL: str = "meta/llama-3.2-90b-vision-instruct"
    LLM_MODEL: str = "meta/llama-3.3-70b-instruct"
    EMBEDDING_MODEL: str = "nvidia/nv-embedqa-e5-v5"
    
    # Processing Limits
    MAX_WORKERS: int = 4
    RATE_LIMIT: int = 40  # RPM
    REQUEST_TIMEOUT: int = 120
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10 MB
    
    # Database
    DATABASE_URL: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    POSTGRES_HOST: str
    POSTGRES_PORT: int = 5432
    
    # ChromaDB
    CHROMA_DB_HOST: str = "localhost"
    CHROMA_DB_PORT: int = 8000
    CHROMA_DB_COLLECTION: str = "contable_documents"
    EMBEDDING_DIMENSIONS: int = 1024
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str]
    
    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Performance Targets
    TARGET_RFC_PRECISION: float = 0.98
    TARGET_UUID_PRECISION: float = 0.98
    TARGET_TOTAL_PRECISION: float = 0.95
    TARGET_LATENCY_CPU: float = 10.0
    TARGET_LATENCY_GPU: float = 3.0
    TARGET_COST_PER_DOC: float = 0.10
```

### Security Utilities (`app/core/security.py`)

**Funcionalidades:**
- Hash de contraseñas con bcrypt
- Generación de tokens JWT (access + refresh)
- OAuth2 password flow
- Validación de tokens
- Dependencias para obtener usuario actual

**Flujo de Autenticación:**
```
1. Usuario envía credenciales → POST /v1/auth/token
2. Backend verifica password con bcrypt
3. Genera access_token (30 min) + refresh_token (7 días)
4. Frontend almacena tokens
5. Requests subsecuentes incluyen: Authorization: Bearer <token>
6. Backend valida token y extrae user_id
```

### Rate Limiting (`app/core/rate_limiter.py`)

**Estrategia:**
- **Primario:** Redis para rate limiting distribuido
- **Fallback:** MemoryLimiter para desarrollo/single-instance

**Configuración:**
```python
limiter = get_limiter(default_limits=[f"{settings.RATE_LIMIT} per minute"])
# Default: 40 requests per minute (NVIDIA NIM Develop tier)
```

### Sentry Integration (`app/main.py`)

**Configuración:**
```python
sentry_sdk.init(
    dsn=os.environ.get("SENTRY_DSN"),
    environment=os.environ.get("SENTRY_ENVIRONMENT", "development"),
    traces_sample_rate=1.0,
    profile_session_sample_rate=0.5,
    enable_logs=True,
    integrations=[FastApiIntegration(), StarletteIntegration()],
    before_send_transaction=lambda event, hint: None 
        if event.get("transaction") in ["/health", "/health/detailed"] 
        else event,
)
```

---

## Métricas del Proyecto

### Resumen Estadístico

| Métrica | Valor |
|---------|-------|
| **Total Archivos Python** | 23 |
| **Total Líneas de Código** | ~5,860 LOC |
| **Tokens Estimados** | ~70,320 |
| **Endpoints API** | 50+ |
| **Modelos Database** | 4 |
| **Routers API** | 11 |
| **Servicios** | 5 |
| **Agentes LangGraph** | 1 (ContableAgent) |
| **Herramientas Agente** | 7+ |

### Distribución por Módulo

| Módulo | LOC | % del Total |
|--------|-----|-------------|
| `api/` | ~2,600 | 38% |
| `services/` | ~3,490 | 38% |
| `core/` | ~640 | 7% |
| `main.py` | ~350 | 4% |
| `db/` | ~320 | 4% |
| `tests/` | ~850 | 9% |

### Endpoints por Categoría

| Categoría | Endpoints |
|-----------|-----------|
| Auth | 3 |
| IDP | 3 |
| Chat | 4 |
| Agent | 2 |
| RAG | 6 |
| Workspace | 3 |
| Clients | 6 |
| Fiscal | 5 |
| Payroll | 5 |
| Finance | 5 |
| Expenses | 4 |
| Users | 6 |
| Health/Root | 5 |
| **Total** | **57** |

### Performance Targets

| Métrica | Target | Unidad |
|---------|--------|--------|
| RFC Precision | 98% | % |
| UUID Precision | 98% | % |
| Total Precision | 95% | % |
| Latency CPU | 10.0 | segundos |
| Latency GPU | 3.0 | segundos |
| Throughput | 0.26 | iter/s |
| Costo por Documento | 0.10 | USD |

---

## Anexos

### A. Comandos de Desarrollo

```bash
# Instalar dependencias
pip install -r requirements.txt

# Ejecutar backend (desarrollo)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Ejecutar backend (producción)
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4

# Correr tests
pytest tests/ -v

# Correr tests con coverage
pytest tests/ --cov=app --cov-report=html

# Validar configuración
python -c "from app.core.config import validate_settings; print(validate_settings())"

# Docker: Build
docker-compose build

# Docker: Run
docker-compose up -d

# Docker: Logs
docker-compose logs -f backend
```

### B. Variables de Entorno Requeridas

```bash
# .env
NVIDIA_API_KEY=nvapi-xxxxxxxxxxxxxxxxxxxx

# Database
DATABASE_URL=postgresql://idp_user:idp_password@localhost:5432/idp_contable
POSTGRES_USER=idp_user
POSTGRES_PASSWORD=idp_password
POSTGRES_DB=idp_contable

# Security
SECRET_KEY=tu_secret_key_de_32_caracteres

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# ChromaDB
CHROMA_DB_HOST=localhost
CHROMA_DB_PORT=8000

# Sentry (opcional)
SENTRY_DSN=https://xxx@sentry.io/xxx
SENTRY_ENVIRONMENT=development
```

### C. Estructura de Respuestas de Error

```python
# Error 400 - Bad Request
{
    "detail": "Validation error message"
}

# Error 401 - Unauthorized
{
    "detail": "Could not validate credentials",
    "headers": {"WWW-Authenticate": "Bearer"}
}

# Error 403 - Forbidden
{
    "detail": "The user doesn't have enough privileges"
}

# Error 404 - Not Found
{
    "detail": "Resource not found"
}

# Error 429 - Too Many Requests
{
    "detail": "Rate limit exceeded. Try again in X seconds"
}

# Error 500 - Internal Server Error
{
    "detail": "Internal server error",
    "type": "ExceptionType"
}
```

---

**Documento generado:** 2026-03-12T12:30:00
**Versión del backend:** 3.2.0
**Última actualización:** 2026-03-12 - Fases 10-11: Dashboard Predictivo, Calendar CRUD, Workflows Ejecutables, WebSocket, IA Tools (12), Toast Notifications
**Próxima revisión:** 2026-04-12

**Archivos relacionados:**
- `data/README.md` - Documentación de persistencia de datos
- `backend/knowledge/backend-knowledge-index.json` - Índice estructurado JSON
- `backend/pyproject.toml` - Configuración del proyecto (Pyright, pytest, black, mypy)

---

## Nuevas Features 2026-03-12

### 1. Dashboard Predictivo ✅

#### Forecasting Service
- **CashflowForecaster**: Proyección 6 meses usando numpy polynomial regression
- **TaxForecaster**: Proyección ISR/IVA 3 meses con moving averages + seasonal patterns
- **TaxHealthAnalyzer**: Score 0-10 con recomendaciones

#### Endpoints
```python
GET  /v1/workspace/forecast        # 6-month cash flow + tax projections
GET  /v1/workspace/kpi-trends      # 6mo historical + 3mo projected KPIs
GET  /v1/finance/cash-flow         # 12mo history + 6mo projection
GET  /v1/workspace/dashboard-full  # Dashboard completo con workflows
```

#### Tests
- `test_forecast_service.py`: 17 tests passing (100% coverage)

---

### 2. Calendar CRUD ✅

#### Database Model
```python
class CalendarEvent(Base):
    id, user_id, title, description, date
    type (fiscal/nomina/seguridad_social)
    status (pendiente/completado/en_preparacion/vencido)
    priority (alta/media/baja)
    is_recurring, metadata_json
```

#### Endpoints
```
GET    /v1/workspace/calendar          # Listar eventos
POST   /v1/workspace/calendar          # Crear evento
PUT    /v1/workspace/calendar/{id}     # Actualizar evento
DELETE /v1/workspace/calendar/{id}     # Eliminar evento
```

#### Auto-Generation
- Declaración Mensual IVA (día 17)
- Pago Provisional ISR (día 17)
- Entero Retenciones ISR (día 17)
- Declaración Anual PM (31 marzo)
- Pago IMSS Bimestral (meses pares, día 17)

---

### 3. Workflows Ejecutables ✅

#### Database Model
```python
class Workflow(Base):
    id, user_id, name, description, type
    status (pending/running/completed/failed/cancelled)
    progress (0-100), steps_total, steps_completed
    metadata_json, started_at, completed_at
```

#### Workflow Engine
```python
# workflow_engine.py
class WorkflowEngine:
    async def execute_idp_ocr_workflow(self, document_ids: List[int])
    async def execute_bank_reconciliation_workflow(self, bank_ids, doc_ids)
    async def execute_monthly_closing_workflow(self, month, year)
```

#### Tipos de Workflow
1. `idp_ocr` - Procesamiento de documentos con OCR
2. `bank_reconciliation` - Conciliación bancaria
3. `cierre_mensual` - Cierre de mes contable
4. `validacion_sat` - Validación contra SAT

#### Endpoints
```
GET    /v1/workspace/workflows              # Listar workflows
POST   /v1/workspace/workflows              # Crear workflow
POST   /v1/workspace/workflows/{id}/execute # Ejecutar workflow
DELETE /v1/workspace/workflows/{id}         # Eliminar workflow
```

---

### 4. WebSocket para Progreso en Tiempo Real ✅

#### Backend
```python
# main.py
@app.websocket("/ws/workflows/{workflow_id}")
async def workflow_websocket(websocket: WebSocket, workflow_id: int):
    # Accept connection
    # Send initial state
    # Broadcast progress updates

async def broadcast_workflow_progress(workflow_id, progress, status, **extra):
    # Send to all connected clients
```

#### Frontend
```typescript
// Workspace.tsx
const connectToWorkflow = (workflowId: number) => {
    const ws = new WebSocket(`ws://localhost:8000/ws/workflows/${workflowId}`)
    
    // Auto-reconnect with exponential backoff
    // 2s, 4s, 8s, 16s, 32s delays
    // Max 5 attempts
}
```

#### Messages
```json
{
  "type": "progress_update",
  "workflow_id": 123,
  "progress": 60,
  "status": "running",
  "step": 3,
  "step_message": "Validando contra SAT..."
}
```

---

### 5. IA Tools (12 Tools) ✅

#### Calendar Management (4 tools)
1. **create_calendar_event** - Crea evento en calendario fiscal
2. **update_calendar_event** - Actualiza estado/fecha/prioridad
3. **delete_calendar_event** - Elimina evento
4. **list_calendar_events** - Lista eventos próximos

#### Workflow Management (4 tools)
1. **execute_workflow** - Crea y ejecuta workflow
2. **get_workflow_status** - Consulta estado actual
3. **cancel_workflow** - Cancela ejecución
4. **list_workflows** - Lista historial de workflows

#### Legacy Tools (4 tools)
1. **get_clients_list** - Lista de clientes
2. **get_client_expediente** - Expediente de cliente
3. **update_client_status** - Actualiza estatus
4. **analyze_cfdi** - Analiza documento CFDI

#### Integration
```python
# agent_tools.py
TOOL_EXECUTORS = {
    "create_calendar_event": create_calendar_event_tool,
    "execute_workflow": execute_workflow_tool,
    # ... 10 más
}
```

---

### 6. Toast Notifications ✅

#### Componentes
- `hooks/use-toast.ts` - Toast state management
- `hooks/use-workflow-toasts.ts` - Workflow-specific toasts
- `components/ui/toast.tsx` - Toast UI components
- `components/ui/toaster.tsx` - Toast provider

#### Tipos de Toast
| Evento | Tipo | Duración |
|--------|------|----------|
| Workflow iniciado | Info | 3s |
| Workflow completado | Success | 5s |
| Workflow fallido | Error | 8s |
| Workflow cancelado | Warning | 4s |

---

### 7. Real KPIs (No More Mocks) ✅

#### Data Sources
| KPI | Source | Calculation |
|-----|--------|-------------|
| **Saldo Conciliado** | `BankTransaction` | SUM(credits) - SUM(debits) |
| **Documentos** | `Document` | COUNT by status |
| **Precisión Extracción** | `Document.confidence_score` | AVG * 100 |
| **IDP Score** | Algorithm | Base 10 - pending*0.5 + bonuses |
| **Clientes** | `Client` | COUNT with status filter |

---

### 8. Chat UI Professional Redesign ✅

#### Features
- User messages on right (blue gradient)
- Assistant messages on left (gray)
- Avatars with initials "TÚ" and Bot icon
- Timestamps (HH:MM format)
- Auto-scroll to bottom
- Auto-focus on textarea

#### Tool Toggle
- Dropdown with 5 MCP tools
- Toggle switches for each tool
- "Activar todas" button
- Count display (e.g., "Tools: 4/5")

---

## Métricas Actualizadas 2026-03-12

| Métrica | Valor | Estado |
|---------|-------|--------|
| **Backend Total** | 10,500+ líneas Python | ✅ Completo |
| **Frontend Total** | 12,000+ líneas TypeScript | ✅ Completo |
| **Endpoints API** | 70+ endpoints REST | ✅ Completo |
| **WebSocket** | 1 endpoint | ✅ Completo |
| **IA Tools** | 12 tools | ✅ Completo |
| **Tests** | 34 passing | ✅ 100% |
| **Calendar CRUD** | 4 endpoints + UI | ✅ Completo |
| **Workflows** | 4 tipos + engine | ✅ Completo |
| **Toast Notifications** | 4 tipos | ✅ Completo |

---
