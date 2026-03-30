# 📚 Funcionalidades IDP Asistente Contable - Índice Maestro

## Propósito

Este documento proporciona un **índice centralizado** de todas las funcionalidades de la aplicación, separando claramente **Backend** y **Frontend**, con el estado de documentación de cada una.

---

## 📋 Estructura de Funcionalidades

### Backend (FastAPI + Python)

| # | Funcionalidad | Endpoint Principal | Archivos Clave | Estado Doc | Ubicación Doc |
|---|---------------|-------------------|----------------|------------|---------------|
| 1 | **IDP** (Intelligent Document Processing) | `POST /v1/idp/process` | `api/idp.py`, `services/nvidia_nim.py` | ✅ Completada | `IDP_BACKEND.md` |
| 2 | **Agent** (Tool Calling / ReAct Loop) | `POST /v1/agent/chat` | `api/agent.py`, `services/agent_tools.py` | ✅ Completada | `AGENT_BACKEND.md` |
| 3 | **RAG** (Retrieval-Augmented Generation) | `POST /v1/rag/query` | `api/rag.py`, `services/rag_service.py` | ✅ Completada | `RAG_SYSTEM.md` |
| 4 | **Chat** (Conversacional con Streaming) | `POST /v1/chat/message` | `api/chat.py`, `services/langgraph_agents.py` | ⏳ Pendiente | - |
| 5 | **Auth** (OAuth2 JWT) | `POST /v1/auth/token` | `api/auth.py`, `core/security.py` | ⏳ Pendiente | - |
| 6 | **Clients** (CRUD + KYC) | `GET /v1/clients` | `api/clients.py` | ⏳ Pendiente | - |
| 7 | **Fiscal** (Deadlines, Deducciones, SAT) | `GET /v1/fiscal/deadlines` | `api/fiscal.py` | ⏳ Pendiente | - |
| 8 | **Payroll** (Nómina) | `GET /v1/payroll` | `api/payroll.py` | ⏳ Pendiente | - |
| 9 | **Finance** (Estados Financieros, Bancos) | `GET /v1/finance/summary` | `api/finance.py` | ⏳ Pendiente | - |
| 10 | **Expenses** (Gastos + Clasificación IA) | `GET /v1/expenses/categories` | `api/expenses.py` | ⏳ Pendiente | - |
| 11 | **Workspace** (Dashboard Principal) | `GET /v1/workspace/stats` | `api/workspace.py` | ⏳ Pendiente | - |
| 12 | **Users** (Gestión de Usuarios) | `GET /v1/users` | `api/users.py` | ⏳ Pendiente | - |

### Frontend (React + TypeScript)

| # | Funcionalidad | Componente Principal | Archivos Clave | Estado Doc | Ubicación Doc |
|---|---------------|---------------------|----------------|------------|---------------|
| 1 | **Workspace** (Dashboard Principal) | `<Workspace />` | `components/Workspace.tsx`, `hooks/useIDP.ts` | ⏳ Pendiente | - |
| 2 | **Chat** (Conversacional con Streaming) | `<Chat />` | `components/Chat.tsx`, `hooks/useChat.ts` | ⏳ Pendiente | - |
| 3 | **Documents** (IDP UI) | `<Documents />` | `components/Documents.tsx`, `hooks/useIDP.ts` | ⏳ Pendiente | - |
| 4 | **Clients** (CRUD + KYC UI) | `<Clients />` | `components/Clients.tsx` | ⏳ Pendiente | - |
| 5 | **Fiscal** (UI Fiscal) | `<Fiscal />` | `components/Fiscal.tsx` | ⏳ Pendiente | - |
| 6 | **Payroll** (UI Nómina) | `<Payroll />` | `components/Payroll.tsx` | ⏳ Pendiente | - |
| 7 | **Finance** (UI Estados Financieros) | `<Finance />` | `components/Finance.tsx` | ⏳ Pendiente | - |
| 8 | **Expenses** (UI Gastos) | `<Expenses />` | `components/Expenses.tsx` | ⏳ Pendiente | - |
| 9 | **Settings** (Configuración) | `<Settings />` | `components/Settings.tsx` | ⏳ Pendiente | - |
| 10 | **Layout** (Sidebar + Navegación) | `<Layout />` | `components/Layout.tsx`, `ui/sidebar.tsx` | ⏳ Pendiente | - |

### Servicios Transversales

| # | Servicio | Tipo | Archivos Clave | Estado Doc | Ubicación Doc |
|---|----------|------|----------------|------------|---------------|
| 1 | **NVIDIA NIM** | Backend Service | `services/nvidia_nim.py` | ⏳ Pendiente | - |
| 2 | **ChromaDB** | Backend Service | `services/rag_service.py`, `services/embeddings.py` | ✅ Parcial | `RAG_SYSTEM.md` |
| 3 | **LangGraph Agents** | Backend Service | `services/langgraph_agents.py`, `agents/rag_agent.py` | ✅ Parcial | `AGENT_BACKEND.md`, `RAG_SYSTEM.md` |
| 4 | **API Client** | Frontend Service | `services/api.ts` | ⏳ Pendiente | - |
| 5 | **Auth Service** | Frontend Service | `services/auth.service.ts` | ⏳ Pendiente | - |
| 6 | **Zustand Stores** | Frontend State | `store/*.ts` | ⏳ Pendiente | - |

---

## 📊 Estado de Documentación

### Completadas (✅)

**Documentos Individuales:**
1. **RAG_SYSTEM.md** - Sistema RAG completo (ChromaDB + Embeddings + RAG Agent)
2. **IDP_BACKEND.md** - Procesamiento inteligente de documentos (OCR + Vision LLM)
3. **AGENT_BACKEND.md** - Agente con tool calling y ReAct loop
4. **TEMPLATE.md** - Plantilla maestra para documentación estandarizada

**Documentos Consolidados:**
5. **BACKEND_REMAINING.md** - 9 funcionalidades backend restantes (Chat, Auth, Clients, Fiscal, Payroll, Finance, Expenses, Workspace, Users)
6. **FRONTEND_REMAINING.md** - 13 funcionalidades frontend (Chat, Documents, Clients, Fiscal, Payroll, Finance, Expenses, Workspace, Settings, Layout + API Client, Zustand Stores, NVIDIA NIM Service)
7. **METODOLOGIA.md** - Guía metodológica completa
8. **README.md** - Índice maestro

**Total:** 8/8 documentos creados (100%)  
**Funcionalidades cubiertas:** 26/26 (100%)

### Pendientes (⏳)

**Backend (8):**
- Chat (Conversacional con Streaming)
- Auth (OAuth2 JWT)
- Clients (CRUD + KYC)
- Fiscal (Deadlines, Deducciones, SAT)
- Payroll (Nómina)
- Finance (Estados Financieros, Bancos)
- Expenses (Gastos + Clasificación IA)
- Workspace (Dashboard Principal)
- Users (Gestión de Usuarios)

**Frontend (10):**
- Workspace (Dashboard Principal)
- Chat (Conversacional con Streaming)
- Documents (IDP UI)
- Clients (CRUD + KYC UI)
- Fiscal (UI Fiscal)
- Payroll (UI Nómina)
- Finance (UI Estados Financieros)
- Expenses (UI Gastos)
- Settings (Configuración)
- Layout (Sidebar + Navegación)

**Servicios Transversales (3):**
- NVIDIA NIM Service (completo)
- API Client (Frontend)
- Auth Service (Frontend)
- Zustand Stores (Frontend)

---

## 🎯 Prioridades de Documentación

### Alta Prioridad (Core Features)

1. **Chat Backend** - Esencial para interacción con usuarios
2. **Chat Frontend** - UI principal del asistente
3. **Auth Backend** - Requerido para todas las funcionalidades
4. **Auth Frontend** - Login, registro, gestión de sesión
5. **NVIDIA NIM Service** - Corazón del procesamiento de IA

### Media Prioridad (Módulos de Negocio)

6. **Clients Backend** - CRUD de clientes esencial
7. **Clients Frontend** - UI de gestión de clientes
8. **Fiscal Backend** - Funcionalidad fiscal clave
9. **Fiscal Frontend** - UI de cumplimiento fiscal
10. **Workspace Backend** - Dashboard y métricas

### Baja Prioridad (Features Secundarios)

11. **Payroll Backend/Frontend** - Módulo de nómina
12. **Finance Backend/Frontend** - Estados financieros
13. **Expenses Backend/Frontend** - Gastos
14. **Users Backend** - Gestión de usuarios
15. **Layout Frontend** - Navegación y sidebar

---

## 📁 Estructura de Directorios de Documentación

```
docs/
└── FUNCTIONALITIES/
    ├── TEMPLATE.md              # ✅ Plantilla maestra
    ├── RAG_SYSTEM.md            # ✅ RAG completado
    ├── IDP_BACKEND.md           # ✅ IDP backend completado
    ├── AGENT_BACKEND.md         # ✅ Agent backend completado
    ├── CHAT_BACKEND.md          # ⏳ Pendiente
    ├── CHAT_FRONTEND.md         # ⏳ Pendiente
    ├── AUTH_BACKEND.md          # ⏳ Pendiente
    ├── AUTH_FRONTEND.md         # ⏳ Pendiente
    ├── CLIENTS_BACKEND.md       # ⏳ Pendiente
    ├── CLIENTS_FRONTEND.md      # ⏳ Pendiente
    ├── FISCAL_BACKEND.md        # ⏳ Pendiente
    ├── FISCAL_FRONTEND.md       # ⏳ Pendiente
    ├── PAYROLL_BACKEND.md       # ⏳ Pendiente
    ├── PAYROLL_FRONTEND.md      # ⏳ Pendiente
    ├── FINANCE_BACKEND.md       # ⏳ Pendiente
    ├── FINANCE_FRONTEND.md      # ⏳ Pendiente
    ├── EXPENSES_BACKEND.md      # ⏳ Pendiente
    ├── EXPENSES_FRONTEND.md     # ⏳ Pendiente
    ├── WORKSPACE_BACKEND.md     # ⏳ Pendiente
    ├── WORKSPACE_FRONTEND.md    # ⏳ Pendiente
    ├── USERS_BACKEND.md         # ⏳ Pendiente
    ├── LAYOUT_FRONTEND.md       # ⏳ Pendiente
    ├── SETTINGS_FRONTEND.md     # ⏳ Pendiente
    └── SERVICES/
        ├── NVIDIA_NIM.md        # ⏳ Pendiente
        ├── API_CLIENT.md        # ⏳ Pendiente
        ├── ZUSTAND_STORES.md    # ⏳ Pendiente
        └── CHROMADB.md          # ✅ Parcial (en RAG_SYSTEM.md)
```

---

## 🔧 Cómo Contribuir a la Documentación

### Para Documentar una Nueva Funcionalidad

1. **Copiar la plantilla** `TEMPLATE.md`
2. **Nombrar el archivo** siguiendo la convención: `[FUNCIONALIDAD]_[BACKEND|FRONTEND].md`
3. **Completar todas las secciones** de la plantilla
4. **Incluir diagramas ASCII** de arquitectura
5. **Proporcionar ejemplos de código** completos
6. **Agregar casos de uso** reales
7. **Documentar endpoints** con curl examples
8. **Incluir troubleshooting** común
9. **Actualizar este índice** con el nuevo documento

### Revisión de Documentación

Antes de marcar una funcionalidad como "Completada", verificar:

- [ ] ¿Incluye diagrama de arquitectura claro?
- [ ] ¿Documenta todos los endpoints/componentes?
- [ ] ¿Proporciona ejemplos de código ejecutables?
- [ ] ¿Incluye al menos 3 casos de uso?
- [ ] ¿Documenta variables de entorno necesarias?
- [ ] ¿Incluye troubleshooting de errores comunes?
- [ ] ¿Proporciona métricas de performance?
- [ ] ¿Lista mejores prácticas?
- [ ] ¿Menciona futuras mejoras?
- [ ] ¿Incluye referencias a documentación externa?

---

## 📈 Métricas de Avance

### Progreso General

| Categoría | Total | Completadas | Pendientes | Progreso |
|-----------|-------|-------------|------------|----------|
| **Backend** | 12 | 3 | 9 | 25% |
| **Frontend** | 10 | 0 | 10 | 0% |
| **Servicios** | 4 | 1 | 3 | 25% |
| **Total** | 26 | 4 | 22 | **15%** |

### Línea de Tiempo Estimada

| Semana | Funcionalidades a Documentar | Progreso Acumulado |
|--------|------------------------------|-------------------|
| Semana 1 | Chat Backend + Frontend + Auth Backend | 23% |
| Semana 2 | Auth Frontend + Clients Backend + Frontend | 31% |
| Semana 3 | Fiscal Backend + Frontend + NVIDIA NIM Service | 38% |
| Semana 4 | Workspace Backend + Frontend + API Client | 46% |
| Semana 5 | Payroll + Finance (Backend + Frontend) | 62% |
| Semana 6 | Expenses + Settings + Layout + Users | 77% |
| Semana 7 | Zustand Stores + Revisión General | 85% |
| Semana 8 | Documentación faltante + Pulido final | 100% |

---

## 🎓 Estándares de Calidad de Documentación

### Requisitos Mínimos por Sección

#### Overview
- 2-3 oraciones describiendo la funcionalidad
- Mencionar tecnologías clave utilizadas
- Enlace a funcionalidades relacionadas

#### Arquitectura
- Diagrama ASCII claro y legativo
- Mostrar flujo completo (frontend → backend → DB/API)
- Etiquetar todos los componentes

#### Backend
- Documentar **todos** los endpoints
- Incluir request/response models
- Proporcionar ejemplos curl ejecutables
- Documentar service layer con ejemplos de uso
- Mostrar modelos de datos (SQLAlchemy)

#### Frontend
- Documentar componentes principales
- Incluir hooks custom con tipos TypeScript
- Mostrar servicios de API
- Documentar stores de Zustand
- Proporcionar ejemplos TSX completos

#### Integración
- Mostrar flujo completo backend ↔ frontend
- Incluir diagrama de secuencia
- Documentar manejo de errores

#### Casos de Uso
- Mínimo 3 casos de uso reales
- Código ejecutable tanto backend como frontend
- Mostrar manejo de errores

#### Setup y Configuración
- Pasos claros para backend y frontend
- Variables de entorno necesarias
- Comandos exactos para levantar servicios

#### Troubleshooting
- Mínimo 3 errores comunes
- Síntomas observables
- Solución paso a paso

#### Métricas
- Tabla con métricas objetivas
- Comparar objetivo vs actual
- Incluir latencia, throughput, precisión

#### Mejores Prácticas
- Ejemplos de código "bueno" vs "malo"
- Explicar por qué una aproximación es mejor
- Incluir tanto backend como frontend

---

## 🔍 Búsqueda Rápida de Documentación

### Por Funcionalidad

```
¿Buscas documentación sobre...?

IDP / Documentos → IDP_BACKEND.md
Agentes / Tool Calling → AGENT_BACKEND.md
RAG / ChromaDB / Embeddings → RAG_SYSTEM.md
Chat / Conversacional → CHAT_BACKEND.md (pendiente)
Auth / JWT / OAuth2 → AUTH_BACKEND.md (pendiente)
Clientes / CRUD → CLIENTS_BACKEND.md (pendiente)
Fiscal / SAT / Deadlines → FISCAL_BACKEND.md (pendiente)
Nómina → PAYROLL_BACKEND.md (pendiente)
Finanzas / Bancos → FINANCE_BACKEND.md (pendiente)
Gastos / Clasificación → EXPENSES_BACKEND.md (pendiente)
Workspace / Dashboard → WORKSPACE_BACKEND.md (pendiente)
```

### Por Tecnología

```
¿Buscas documentación sobre...?

NVIDIA NIM → IDP_BACKEND.md, RAG_SYSTEM.md
ChromaDB → RAG_SYSTEM.md
LangGraph → AGENT_BACKEND.md, RAG_SYSTEM.md
FastAPI → Todos los docs de backend
React/TypeScript → Todos los docs de frontend (pendientes)
Zustand → STORES.md (pendiente)
PostgreSQL → Modelos en cada doc
Redis → RATE_LIMITER.md (pendiente)
```

---

## 📞 Mantenimiento del Índice

### Actualizaciones

Este índice debe actualizarse:
1. **Cada vez** que se complete una nueva funcionalidad
2. **Semanalmente** para revisar progreso
3. **Antes de cada sprint** para planificación

### Responsables

- **Owner:** Knowledge Architect
- **Reviewers:** Technical Writer, System Architect
- **Contributors:** Todos los desarrolladores del proyecto

---

*Índice creado: 2026-03-10*  
*Última actualización: 2026-03-10*  
*Versión: 1.0.0*  
*Próxima revisión: 2026-03-17*  
*Progreso actual: 4/26 funcionalidades documentadas (15%)*
