# Frontend Knowledge Map - IDP Asistente Contable

> **Documento generado:** 2026-03-12
> **Versión del proyecto:** 1.3.0
> **Total de archivos:** 155
> **Total de líneas de código:** 30,265 (+500 Fase 10 — store tests)
> **Tokens estimados:** 642,238
> **Estado:** ✅ Fase 10 Frontend — Store Testing + Quality

---

## Arquitectura General

| Capa | Tecnología | Versión |
|------|------------|---------|
| **Framework** | React | 18.2.0 |
| **Build Tool** | Vite | 5.0.11 |
| **Lenguaje** | TypeScript | 5.3.3 |
| **Enrutamiento** | React Router DOM | 6.21.1 |
| **Estado Global** | Zustand | 4.4.7 |
| **Server State** | TanStack Query | 5.17.9 |
| **HTTP Client** | Axios | 1.6.5 |
| **Estilos** | Tailwind CSS | 3.4.1 |
| **UI Components** | shadcn/ui + Radix UI | 1.4.3 |
| **Iconos** | Lucide React | 0.309.0 |
| **Fuentes** | Geist Variable | 5.2.8 |
| **PWA** | vite-plugin-pwa | 1.2.0 |
| **Monitoreo** | Sentry | 10.43.0 |
| **Virtualización** | TanStack Virtual | 3.13.21 |
| **Gráficos** | Recharts | 2.15.4 |

---

## Module Directory

```
frontend/
├── src/
│   ├── components/          # Componentes React
│   │   ├── ui/              # Componentes base (shadcn/ui)
│   │   │   ├── alert.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── chart.tsx
│   │   │   ├── collapsible.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── hover-card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── resizable.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── text-area.tsx    # ✅ NUEVO - Fase 9
│   │   │   ├── tooltip.tsx
│   │   │
│   │   ├── reconciliation/    # ✅ NUEVO - Conciliación bancaria (Fase 9)
│   │   │   ├── BankStatementUpload.tsx    # Upload CSV/XLSX (15+ bancos)
│   │   │   ├── MatchingTable.tsx          # Tabla de matches (3 capas)
│   │   │   ├── MatchFilters.tsx           # Filtros de búsqueda
│   │   │   ├── UnmatchedAlerts.tsx        # Alertas de faltantes
│   │   │   ├── index.ts                   # Export de componentes
│   │   │   └── README.md                  # Documentación
│   │   │
│   │   ├── idp/             # ✅ NUEVO - IDP Components (Fase 9)
│   │   │   ├── DocumentClassifier.tsx     # Clasificación contable auto
│   │   │   ├── CFDIValidator.tsx          # Validación XSD CFDI
│   │   │   └── EFOChecker.tsx             # Lista 69-B SAT
│   │   │
│   │   ├── ReconciliationPage.tsx  # ✅ NUEVO - Página de conciliación
│   │   │
│   │   ├── Chat.tsx         # Componente de chat con IA (streaming SSE)
│   │   ├── Clients.tsx      # Gestión de clientes (personas físicas/morales)
│   │   ├── Dashboard.tsx    # Dashboard principal con métricas
│   │   ├── Documents.tsx    # Gestión documental con IA
│   │   ├── EmptyPane.tsx    # Estado vacío inicial
│   │   ├── ErrorBoundary.tsx # Límite de errores React
│   │   ├── Expenses.tsx     # Módulo de gastos y clasificación
│   │   ├── Finance.tsx      # Módulo financiero (conciliación, balances)
│   │   ├── Fiscal.tsx       # Módulo fiscal (declaraciones, SAT)
│   │   ├── Layout.tsx       # Layout principal con Activity Bar + Sidebar
│   │   ├── LoadingSpinner.tsx # Spinner de carga optimizado
│   │   ├── Payroll.tsx      # Módulo de nóminas (SUA, IMSS)
│   │   ├── SentryTest.tsx   # Componente de testing de Sentry
│   │   ├── Settings.tsx     # Configuración de usuario
│   │   ├── TestError.tsx    # Componente para testing de errores
│   │   ├── VirtualizedChatHistory.tsx   # Historial virtualizado de chat
│   │   ├── VirtualizedDocumentList.tsx  # Lista virtualizada de documentos
│   │   └── Workspace.tsx    # Área de trabajo principal (dashboard)
│   │
│   ├── hooks/               # Hooks personalizados
│   │   ├── use-mobile.ts    # Detección de dispositivo móvil
│   │   ├── useAuth.ts       # Autenticación (login, logout, checkAuth)
│   │   ├── useChat.ts       # Gestión de conversaciones de chat
│   │   ├── useChatHistory.ts # Historial de conversaciones
│   │   ├── useDocuments.ts  # Gestión de documentos con React Query
│   │   ├── useHealthScore.ts # Puntuación de salud fiscal
│   │   ├── useIDP.ts        # Hook principal de IDP (process, upload, delete)
│   │   ├── useTaxForecast.ts # Proyección de impuestos
│   │   ├── useReconciliation.ts  # ✅ NUEVO - Conciliación (6 hooks)
│   │   └── useClassification.ts  # ✅ NUEVO - Clasificación (6 hooks)
│   │
│   ├── services/            # Servicios API
│   │   ├── api.ts           # Instancia axios + interceptors + todos los servicios
│   │   ├── auth.service.ts  # Servicio de autenticación
│   │   ├── chat.service.ts  # Servicio de chat (streaming SSE)
│   │   └── idp.service.ts   # Servicio de procesamiento de documentos
│   │
│   ├── store/               # Stores de Zustand
│   │   ├── auth.store.ts    # Estado de autenticación
│   │   ├── chat.store.ts    # Estado de conversaciones
│   │   ├── idp.store.ts     # Estado de documentos IDP
│   │   ├── index.ts         # Exportación unificada de stores
│   │   ├── modules.store.ts # Estado de módulos (workspace, fiscal, etc.)
│   │   ├── reconciliation.store.ts  # Conciliación bancaria
│   │   ├── classification.store.ts  # Clasificación contable (classificationStore.ts)
│   │   ├── auth.store.test.ts       # ✅ NUEVO Fase 10 - Tests de auth store
│   │   └── chat.store.test.ts       # ✅ NUEVO Fase 10 - Tests de chat store
│   │
│   ├── types/               # Tipos TypeScript
│   │   └── index.ts         # Tipos e interfaces globales
│   │
│   ├── lib/                 # Utilidades de librerías
│   │   ├── sentry.ts        # Configuración de Sentry
│   │   └── utils.ts         # Utilidad cn() para clases Tailwind
│   │
│   ├── utils/               # Utilidades propias
│   │   └── reportWebVitals.ts # Reporte de Web Vitals a Sentry
│   │
│   ├── test/                # Configuración de tests
│   │   └── setup.ts         # Setup de Vitest + Testing Library
│   │
│   ├── App.tsx              # Componente raíz con enrutamiento
│   ├── main.tsx             # Punto de entrada de la aplicación
│   ├── index.css            # Estilos globales + Tailwind
│   ├── instrument.ts        # Instrumentación de Sentry
│   ├── SentryVerification.tsx # Verificación de instalación de Sentry
│   └── vite-env.d.ts        # Tipos de Vite
│
├── tests/
│   └── e2e/                 # Tests end-to-end con Playwright
│       ├── page-objects/    # Page Objects Pattern
│       ├── specs/           # Especificaciones de tests
│       ├── fixtures/        # Datos de prueba
│       └── utils/           # Utilidades de testing
│
├── .docs/                   # Documentación técnica
│   ├── FCP_OPTIMIZATION_REPORT.md
│   ├── SENTRY_IMPLEMENTATION_SUMMARY.md
│   └── ...
│
├── dev-dist/                # Service Worker (PWA)
├── dist/                    # Build de producción
├── index.html               # HTML principal con Critical CSS inline
├── package.json             # Dependencias y scripts
├── vite.config.ts           # Configuración de Vite
├── tsconfig.json            # Configuración de TypeScript
├── tailwind.config.js       # Configuración de Tailwind
├── postcss.config.js        # Configuración de PostCSS
├── playwright.config.ts     # Configuración de Playwright
└── vitest.config.ts         # Configuración de Vitest
```

---

## Technical Reference

### Archivos Principales

| Archivo | Rol | LOC | Tokens | Descripción |
|---------|-----|-----|--------|-------------|
| `src/components/Layout.tsx` | Layout principal | 616 | 6,137 | Activity Bar, Sidebar resizable, Assistant Bar, Status Bar |
| `src/components/Workspace.tsx` | Dashboard | 385 | 5,034 | Métricas, calendario fiscal, workflows sugeridos |
| `src/components/Chat.tsx` | Chat con IA | ~300 | ~4,500 | Streaming SSE, virtualización, markdown |
| `src/components/Documents.tsx` | Gestión documental | ~280 | ~5,034 | Upload, procesamiento batch, virtualización |
| `src/components/Payroll.tsx` | Nóminas | ~250 | ~4,570 | Periodos, empleados, dispersión, SUA |
| `src/components/Finance.tsx` | Finanzas | ~240 | ~3,775 | Conciliación bancaria, balances, flujo |
| `src/components/Fiscal.tsx` | Fiscal | ~230 | ~3,579 | Declaraciones, opiniones SAT, coeficientes |
| `src/components/Expenses.tsx` | Gastos | ~220 | ~3,841 | Clasificación IA, deducibilidad |
| `src/components/Clients.tsx` | Clientes | ~200 | ~3,074 | CRM, expedientes KYC |
| `src/components/Dashboard.tsx` | Dashboard secundario | ~180 | ~3,420 | Vista alternativa de métricas |
| `src/services/api.ts` | API Client | 450 | 3,882 | Axios instance, interceptors, 10+ servicios |
| `src/components/ui/sidebar.tsx` | Sidebar component | 280 | 5,442 | Componente sidebar de shadcn/ui |
| `src/store/auth.store.ts` | Auth store | ~100 | ~1,200 | Zustand store para autenticación |
| `src/store/chat.store.ts` | Chat store | ~120 | ~1,400 | Zustand store para conversaciones |
| `src/hooks/useDocuments.ts` | Documents hook | ~80 | ~900 | React Query para documentos |
| `src/types/index.ts` | Tipos globales | ~150 | ~1,800 | Interfaces TypeScript |

### Componentes UI (shadcn/ui)

| Componente | LOC | Props Principales | Descripción |
|------------|-----|-------------------|-------------|
| `button.tsx` | ~50 | `variant`, `size`, `className` | Botones con variantes (default, secondary, outline, ghost, link) |
| `card.tsx` | ~60 | `className`, `children` | Cards con Header, Title, Description, Content |
| `dialog.tsx` | ~100 | `open`, `onOpenChange`, `children` | Modales accesibles con Radix Dialog |
| `dropdown-menu.tsx` | ~120 | `items`, `align`, `side` | Menús contextuales con Radix Dropdown |
| `input.tsx` | ~30 | `type`, `className`, `onChange` | Inputs estilizados con forwardRef |
| `table.tsx` | ~80 | `className`, `children` | Tablas accesibles con header, body, rows |
| `tooltip.tsx` | ~50 | `content`, `side`, `children` | Tooltips con Radix Tooltip |
| `avatar.tsx` | ~40 | `src`, `fallback`, `className` | Avatares con fallback y status |
| `badge.tsx` | ~40 | `variant`, `className`, `children` | Badges de estado (default, secondary, outline) |
| `select.tsx` | ~90 | `options`, `value`, `onChange` | Selects accesibles con Radix Select |
| `tabs.tsx` | ~50 | `list`, `content`, `defaultValue` | Pestañas con Radix Tabs |
| `progress.tsx` | ~30 | `value`, `max`, `className` | Barras de progreso animadas |
| `skeleton.tsx` | ~20 | `className` | Loading skeletons |
| `scroll-area.tsx` | ~40 | `className`, `children` | Scroll areas customizadas |
| `separator.tsx` | ~20 | `orientation`, `className` | Separadores visuales |
| `sheet.tsx` | ~100 | `open`, `onOpenChange`, `side` | Side sheets deslizantes |
| `hover-card.tsx` | ~40 | `content`, `children` | Cards al hacer hover |
| `collapsible.tsx` | ~30 | `open`, `onOpenChange` | Contenido colapsable |
| `alert.tsx` | ~40 | `variant`, `title`, `description` | Alertas informativas |
| `label.tsx` | ~20 | `htmlFor`, `className` | Labels accesibles |
| `chart.tsx` | ~200 | `data`, `config` | Gráficos con Recharts |
| `resizable.tsx` | ~150 | `direction`, `panels` | Paneles redimensionables |
| `sidebar.tsx` | 280 | `items`, `collapsed` | Sidebar navigation |
| `avatar.tsx` | ~40 | `src`, `fallback` | Avatar con fallback |
| `badge.tsx` | ~40 | `variant` | Badges de estado |
| `input.tsx` | ~30 | `type`, `className` | Input fields |
| `table.tsx` | ~80 | `className` | Tablas de datos |

---

## Dependency Analysis

### Grafo de Dependencias Principal

```
main.tsx
├── App.tsx
│   ├── Layout.tsx
│   │   ├── Chat.tsx (lazy)
│   │   ├── Workspace.tsx (lazy)
│   │   ├── Documents.tsx (lazy)
│   │   ├── Fiscal.tsx (lazy)
│   │   ├── Expenses.tsx (lazy)
│   │   ├── Payroll.tsx (lazy)
│   │   ├── Finance.tsx (lazy)
│   │   ├── Clients.tsx (lazy)
│   │   ├── Settings.tsx (lazy)
│   │   └── UI Components (shadcn/ui)
│   └── EmptyPane.tsx
│
├── services/api.ts
│   ├── axios
│   ├── auth.service.ts
│   ├── chat.service.ts
│   └── idp.service.ts
│
├── store/
│   ├── auth.store.ts → authService
│   ├── chat.store.ts → chatService
│   ├── idp.store.ts → idpService
│   └── modules.store.ts → workspaceService, fiscalService, etc.
│
├── hooks/
│   ├── useAuth.ts → useAuthStore
│   ├── useChat.ts → useChatStore
│   ├── useDocuments.ts → useIDP + React Query
│   └── useIDP.ts → idpService
│
└── types/index.ts (importado globalmente)
```

### Dependencias Externas Críticas

| Paquete | Usado En | Impacto |
|---------|----------|---------|
| `react-router-dom` | App.tsx, Layout.tsx | Enrutamiento, navegación, tabs |
| `zustand` | store/*.ts | Estado global persistente |
| `@tanstack/react-query` | hooks/*.ts | Caching de API, optimistic updates |
| `axios` | services/api.ts | HTTP client con interceptors |
| `@radix-ui/*` | components/ui/* | Primitivos accesibles |
| `lucide-react` | Todos los componentes | Iconografía |
| `tailwind-merge` + `clsx` | lib/utils.ts | Utilidad cn() para clases |
| `@sentry/react` | instrument.ts, main.tsx | Monitoreo de errores |
| `vite-plugin-pwa` | vite.config.ts | Service Worker, manifest |

---

## Componentes Principales

### Layout.tsx
**Propósito:** Layout principal tipo IDE con Activity Bar, Sidebar, Editor Area y Assistant Bar.

**Características:**
- Activity Bar vertical con 7 módulos + Settings + User Menu
- Sidebar colapsable con navegación contextual
- Sistema de tabs multi-panel
- Assistant Bar con Chat embebido (lazy loaded)
- Status Bar inferior con información de conexión
- Resizable panels con `react-resizable-panels`

**Estado:**
```typescript
interface TabItem {
  id: string
  name: string
  icon: typeof LayoutDashboard
  href: string
}

const [openTabs, setOpenTabs] = useState<TabItem[]>([])
const [activeSideBar, setActiveSideBar] = useState<string>('workspace')
const [activeView, setActiveView] = useState<Record<string, string>>({...})
const [isAssistantVisible, setIsAssistantVisible] = useState(true)
```

**Atajos de teclado:**
- `Alt + A`: Toggle Assistant Bar

---

### Workspace.tsx
**Propósito:** Dashboard principal con métricas de negocio, calendario fiscal y métricas de IA.

**Vistas:**
- `general`: Dashboard con KPIs (saldo, documentos, precisión, IDP Score)
- `impuestos`: Cálculo de impuestos mensuales (IVA, ISR, IEPS)
- `reportes-cfdi`: Reportes de CFDI emitidos/recibidos/nómina
- `calendario`: Calendario fiscal con deadlines
- `metricas-ia`: Métricas de desempeño del modelo de IA

**Datos:**
```typescript
interface WorkspaceData {
  dashboard: {
    monthly_revenue: number
    processed_documents: number
    pending_documents: number
    fiscal_score: number
  }
  calendar: CalendarEvent[]
  metrics: {
    extraction_accuracy: number
    average_latency_ms: number
    model: string
  }
}
```

---

### Chat.tsx
**Propósito:** Interfaz de chat con asistente de IA con streaming SSE.

**Características:**
- Streaming de respuestas con Server-Sent Events (SSE)
- Virtualización de mensajes con `@tanstack/react-virtual`
- Markdown rendering para respuestas
- Historial de conversaciones
- Feedback de mensajes (positivo/negativo)

**Streaming Implementation:**
```typescript
async *streamMessage(content: string, conversationId?: string): AsyncGenerator<string> {
  const response = await fetch(`${API_BASE_URL}/v1/chat/message/stream`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: content, conversation_id: conversationId, stream: true })
  })
  
  const reader = response.body?.getReader()
  const decoder = new TextDecoder()
  
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value)
    // Parsear SSE: "data: {...}\n\n"
    yield data
  }
}
```

---

### Documents.tsx
**Propósito:** Gestión documental con procesamiento de IA.

**Características:**
- Upload de documentos individuales y batch
- Virtualización de lista con `@tanstack/react-virtual`
- Estados: pending, processing, completed, error
- Extracción de datos con IA (CFDI, nóminas, etc.)
- Puntuación de confianza por documento

**Tipos:**
```typescript
interface Document {
  id: string
  tenant_id: string
  document_type: string
  original_filename?: string
  file_path: string
  extracted_data: ExtractionData | null
  confidence_score: number
  status: DocumentStatus
  created_at: string
  updated_at: string
}

type DocumentStatus = 'pending' | 'processing' | 'completed' | 'error'
```

---

## Hooks Personalizados

### useAuth
**Archivo:** `src/hooks/useAuth.ts`

**Propósito:** Abstracción de autenticación sobre useAuthStore.

```typescript
function useAuth(): {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
  clearError: () => void
}
```

**Uso:**
```typescript
const { user, isAuthenticated, login, logout } = useAuth()
```

---

### useChat
**Archivo:** `src/hooks/useChat.ts`

**Propósito:** Gestión de conversaciones de chat.

```typescript
function useChat(conversationId?: string): {
  conversations: Conversation[]
  currentConversation: Conversation | null
  messages: Message[]
  isLoading: boolean
  isSending: boolean
  error: string | null
  sendMessage: (content: string) => Promise<void>
  deleteConversation: (id: string) => Promise<void>
  fetchHistory: () => Promise<void>
  fetchConversation: (id: string) => Promise<void>
}
```

**Uso:**
```typescript
const { messages, sendMessage, conversations } = useChat(currentConvId)
```

---

### useDocuments
**Archivo:** `src/hooks/useDocuments.ts`

**Propósito:** Obtención de documentos con caching de React Query.

```typescript
function useDocuments(tenantId?: string): UseQueryResult<Document[]>

// Configuración:
// - staleTime: 5 minutos
// - gcTime: 10 minutos
// - retry: 2
```

**Hooks relacionados:**
- `useUploadDocument()`: Mutation para subir documentos
- `useDeleteDocument()`: Mutation para eliminar documentos
- `useDocumentStats()`: Query para estadísticas

---

### useIDP
**Archivo:** `src/hooks/useIDP.ts`

**Propósito:** Hook de bajo nivel para operaciones de IDP.

```typescript
function useIDP(): {
  documents: Document[]
  stats: ProcessingStats
  isLoading: boolean
  error: string | null
  fetchDocument: (tenantId: string) => Promise<void>
  uploadDocument: (file: File, documentType: string) => Promise<DocumentUploadResponse>
  deleteDocument: (id: string) => Promise<void>
  fetchStats: () => Promise<void>
}
```

---

### use-mobile
**Archivo:** `src/hooks/use-mobile.ts`

**Propósito:** Detección responsive de dispositivo móvil.

```typescript
function useMobile(): boolean

// Implementación con matchMedia y breakpoint de Tailwind (768px)
```

---

## Servicios API

### api.ts - Instancia Axios Principal

**Configuración:**
```typescript
const api = axios.create({
  baseURL: `${API_BASE_URL}/v1`,
  headers: { 'Content-Type': 'application/json' },
  timeout: API_TIMEOUT, // 30s default
})
```

**Interceptors:**
- **Request:** Agrega token Authorization automáticamente
- **Response:** Manejo de 401 con refresh token automático

**Token Management:**
```typescript
export const tokenStorage = {
  getAccessToken: () => localStorage.getItem('access_token'),
  setAccessToken: (token: string) => localStorage.setItem('access_token', token),
  removeAccessToken: () => localStorage.removeItem('access_token'),
  getRefreshToken: () => localStorage.getItem('refresh_token'),
  setRefreshToken: (token: string) => localStorage.setItem('refresh_token', token),
  clear: () => { ... }
}
```

---

### authService

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `login(email, password)` | POST /auth/token | Login con OAuth2 (username/password) |
| `getCurrentUser()` | GET /auth/me | Obtener usuario actual |
| `logout()` | - | Limpiar tokens |
| `setToken(token)` | - | Setear token manualmente |
| `getToken()` | - | Obtener token actual |
| `isAuthenticated()` | - | Verificar si está autenticado |

---

### idpService

| Método | Endpoint | Timeout | Descripción |
|--------|----------|---------|-------------|
| `processDocument(file, documentType)` | POST /idp/process | 60s | Procesar documento individual |
| `batchProcess(files, documentType, maxWorkers)` | POST /idp/batch-process | 120s | Procesamiento batch |
| `getDocument(id)` | GET /idp/{id} | 30s | Obtener estado de documento |
| `deleteDocument(id)` | DELETE /idp/{id} | 30s | Eliminar documento |
| `getStats()` | GET /idp/stats | 30s | Estadísticas de procesamiento |

---

### chatService

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `sendMessage(content, conversationId)` | POST /chat/message | Enviar mensaje y obtener respuesta |
| `streamMessage(content, conversationId)` | POST /chat/message/stream | Streaming SSE de respuesta |
| `getConversation(id)` | GET /chat/conversation/{id} | Obtener conversación completa |
| `deleteConversation(id)` | DELETE /chat/conversation/{id} | Eliminar conversación |
| `getHistory()` | GET /chat/conversations | Listar conversaciones del usuario |
| `sendFeedback(messageId, rating, comment)` | POST /chat/feedback | Enviar feedback de mensaje |

---

### workspaceService

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `getDashboard()` | GET /workspace/dashboard | Métricas del dashboard |
| `getCalendar()` | GET /workspace/calendar | Eventos del calendario fiscal |
| `getMetrics()` | GET /workspace/metrics | Métricas de IA |

---

### clientsService

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `list(status, type)` | GET /clients | Listar clientes con filtros |
| `get(id)` | GET /clients/{id} | Obtener cliente por ID |
| `create(data)` | POST /clients | Crear nuevo cliente |
| `update(id, data)` | PUT /clients/{id} | Actualizar cliente |
| `delete(id)` | DELETE /clients/{id} | Eliminar cliente |
| `getExpediente(id)` | GET /clients/{id}/expediente | Obtener expediente KYC |

---

### fiscalService

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `getDeadlines()` | GET /fiscal/deadlines | Obtener deadlines fiscales |
| `getDeductions()` | GET /fiscal/deductions | Obtener deducciones |
| `getAnnualReport(year)` | GET /fiscal/annual-report | Reporte anual |
| `getOpinion()` | GET /fiscal/opinion | Opinión del cumplimiento SAT |
| `getCoeficiente()` | GET /fiscal/coeficiente | Coeficiente de utilidad |

---

### payrollService

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `getSummary()` | GET /payroll/summary | Resumen de nóminas |
| `getEmployees()` | GET /payroll/employees | Lista de empleados |
| `disperse()` | POST /payroll/disperse | Ejecutar dispersión |
| `getSpecialCalcs()` | GET /payroll/special-calcs | Cálculos especiales |
| `getSua()` | GET /payroll/sua | Cálculo SUA/IMSS |

---

### financeService

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `getSummary()` | GET /finance/summary | Resumen financiero |
| `getStatements()` | GET /finance/statements | Estados financieros |
| `getBankAccounts()` | GET /finance/bank-accounts | Cuentas bancarias |
| `reconcile(bankId)` | POST /finance/reconcile | Conciliación bancaria |
| `getCashFlow()` | GET /finance/cash-flow | Flujo de efectivo |

---

### expensesService

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `getCategories()` | GET /expenses/categories | Categorías de gastos |
| `getPending()` | GET /expenses/pending | Gastos pendientes |
| `classify()` | POST /expenses/classify | Clasificar con IA |
| `getBudget()` | GET /expenses/budget | Presupuesto |

---

### usersService

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `getMe()` | GET /users/me | Datos del usuario actual |
| `updateMe(data)` | PUT /users/me | Actualizar perfil |
| `getSettings()` | GET /users/me/settings | Configuración de usuario |
| `updateSettings(data)` | PUT /users/me/settings | Actualizar configuración |
| `getFiscalProfiles()` | GET /users/me/fiscal-profiles | Perfiles fiscales |
| `getSubscription()` | GET /users/me/subscription | Suscripción |

---

### ApiErrorHelper

**Utilidades para manejo de errores:**

```typescript
class ApiErrorHelper {
  static isApiError(error: unknown): error is AxiosError<ApiError>
  static getErrorMessage(error: unknown): string
  static isAuthError(error: unknown): boolean
  static isNetworkError(error: unknown): boolean
  static shouldRetry(error: unknown): boolean
}
```

---

## Store Structure

### useAppStore
**Archivo:** `src/store/index.ts`

**Estado:**
```typescript
interface AppState {
  user: {
    id: number | null
    email: string | null
    full_name: string | null
  } | null
  sidebarOpen: boolean
  theme: 'light' | 'dark'
}
```

**Persistencia:** `user`, `theme`

---

### useAuthStore
**Archivo:** `src/store/auth.store.ts`

**Estado:**
```typescript
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
```

**Actions:**
- `login(email, password)`: Login con OAuth2
- `logout()`: Limpiar sesión
- `checkAuth()`: Verificar autenticación
- `setUser(user)`: Actualizar usuario
- `clearError()`: Limpiar error

**Persistencia:** `user`, `token`, `isAuthenticated`

---

### useChatStore
**Archivo:** `src/store/chat.store.ts`

**Estado:**
```typescript
interface ChatState {
  conversations: Conversation[]
  currentConversation: Conversation | null
  messages: Message[]
  isLoading: boolean
  isSending: boolean
  error: string | null
}
```

**Actions:**
- `fetchHistory()`: Cargar historial
- `fetchConversation(id)`: Cargar conversación
- `sendMessage(content, conversationId)`: Enviar mensaje
- `deleteConversation(id)`: Eliminar conversación
- `setCurrentConversation(conversation)`: Setear conversación actual
- `clearMessages()`: Limpiar mensajes
- `clearError()`: Limpiar error

**Persistencia:** No persistente (volátil)

---

### useIDPStore
**Archivo:** `src/store/idp.store.ts`

**Estado:**
```typescript
interface IDPState {
  documents: Document[]
  stats: ProcessingStats
  isLoading: boolean
  error: string | null
}
```

**Actions:**
- `fetchDocument(tenantId)`: Cargar documentos
- `uploadDocument(file, documentType)`: Subir documento
- `deleteDocument(id)`: Eliminar documento
- `fetchStats()`: Cargar estadísticas

**Persistencia:** No persistente (volátil)

---

### useModulesStore
**Archivo:** `src/store/modules.store.ts`

**Estado:**
```typescript
interface ModulesState {
  workspace: WorkspaceData | null
  fiscal: FiscalData | null
  payroll: PayrollData | null
  finance: FinanceData | null
  expenses: ExpensesData | null
  clients: ClientsData | null
  loading: Record<string, boolean>
}
```

**Actions:**
- `fetchWorkspace()`: Cargar datos de workspace
- `fetchFiscal()`: Cargar datos fiscales
- `fetchPayroll()`: Cargar datos de nómina
- `fetchFinance()`: Cargar datos financieros
- `fetchExpenses()`: Cargar datos de gastos
- `fetchClients()`: Cargar datos de clientes
- `fetchFiscalProfiles()`: Cargar perfiles fiscales
- `fetchSubscription()`: Cargar suscripción

**Persistencia:** No persistente (volátil)

---

## Tipos TypeScript Principales

### User
```typescript
interface User {
  id: number
  email: string
  full_name: string
  is_active: boolean
  created_at: string
}
```

### TokenResponse
```typescript
interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
}
```

### Document
```typescript
interface Document {
  id: string
  tenant_id: string
  document_type: string
  original_filename?: string
  file_path: string
  extracted_data: ExtractionData | null
  confidence_score: number
  status: DocumentStatus
  created_at: string
  updated_at: string
}

type DocumentStatus = 'pending' | 'processing' | 'completed' | 'error'
```

### ExtractionData
```typescript
interface ExtractionData {
  metadata: {
    version_idp: string
    timestamp: string
    confidence_score: number
  }
  documento: {
    tipo: string
    uuid: string
    rfc_emisor: string
    rfc_receptor: string
    moneda: string
    total: number
  }
  analisis_fiscal: {
    deducibilidad_sugerida: boolean
    fundamento_legal: string
    cuenta_contable_sugerida: string
  }
}
```

### Message & Conversation
```typescript
type MessageRole = 'user' | 'assistant' | 'system'

interface Message {
  id: string
  conversation_id: string
  role: MessageRole
  content: string
  created_at: string
}

interface Conversation {
  id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
  messages: Message[]
}
```

### ApiResponse
```typescript
interface ApiResponse<T> {
  data: T
  message?: string
  error?: string
}

interface ApiError {
  detail: string
  status_code: number
}
```

---

## Optimizaciones de Performance

### Code Splitting
**Archivo:** `vite.config.ts`

```typescript
manualChunks: {
  'react-vendor': ['react', 'react-dom/client'],
  'router-vendor': ['react-router-dom'],
  'query-vendor': ['@tanstack/react-query'],
  'sentry-vendor': ['@sentry/react'],
  'ui-primitives': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
  'icons-vendor': ['lucide-react'],
}
```

### Lazy Loading
**Archivo:** `App.tsx`

```typescript
const Workspace = lazy(() => import('@components/Workspace'))
const Chat = lazy(() => import('@components/Chat'))
const Documents = lazy(() => import('@components/Documents'))
// ... más componentes lazy
```

### Virtualización
- `VirtualizedChatHistory.tsx`: Lista de mensajes virtualizada
- `VirtualizedDocumentList.tsx`: Lista de documentos virtualizada

### Critical CSS
**Archivo:** `vite.config.ts` + `index.html`

- Critical CSS inline con Critters
- Preload de fuentes Geist Variable
- Font-display: swap

### PWA
**Archivo:** `vite.config.ts`

```typescript
VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/api\./i,
        handler: 'NetworkFirst',
        options: { cacheName: 'api-cache', maxAgeSeconds: 86400 }
      },
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
        handler: 'CacheFirst',
        options: { cacheName: 'images-cache', maxAgeSeconds: 2592000 }
      }
    ]
  }
})
```

### Web Vitals
**Archivo:** `src/utils/reportWebVitals.ts`

- Reporte automático a Sentry
- Carga diferida con requestIdleCallback
- Métricas: CLS, FCP, LCP, TTFB, INP

---

## Testing

### Unit Testing (Vitest)
**Configuración:** `vitest.config.ts`

- Environment: jsdom
- Globals: true
- Coverage: v8

**Archivos de test:**
- `src/components/*.test.tsx`
- `src/hooks/*.test.ts`
- `src/store/*.test.ts`

### E2E Testing (Playwright)
**Configuración:** `playwright.config.ts`

- Browsers: Chromium, Firefox, WebKit
- Mobile: Mobile Chrome, Mobile Safari
- Reportes: HTML, GitHub

**Estructura:**
```
tests/e2e/
├── page-objects/
│   ├── LoginPage.ts
│   ├── DashboardPage.ts
│   ├── ChatPage.ts
│   └── DocumentsPage.ts
├── specs/
│   ├── auth/login.spec.ts
│   ├── chat/conversation.spec.ts
│   ├── dashboard/dashboard.spec.ts
│   ├── idp/document-upload.spec.ts
│   └── ...
├── fixtures/
│   └── files/
└── utils/
    ├── api-helper.ts
    └── test-data.ts
```

---

## Variables de Entorno

**Archivo:** `.env`

| Variable | Descripción | Default |
|----------|-------------|---------|
| `VITE_API_URL` | URL de la API backend | `http://localhost:8000` |
| `VITE_BACKEND_URL` | URL alternativa del backend | - |
| `VITE_API_TIMEOUT` | Timeout de peticiones (ms) | `30000` |
| `VITE_SENTRY_DSN` | DSN de Sentry | - |
| `SENTRY_ORG` | Organización de Sentry | - |
| `SENTRY_PROJECT` | Proyecto de Sentry | - |
| `SENTRY_AUTH_TOKEN` | Token de autenticación Sentry | - |

---

## Scripts Disponibles

### Desarrollo
```bash
npm run dev          # Iniciar servidor de desarrollo (puerto 5173)
npm run type-check   # Verificación de tipos TypeScript
npm run lint         # ESLint
```

### Build
```bash
npm run build        # Build de producción
npm run build:analyze # Build con análisis de bundles
npm run build:ci     # Build para CI/CD
npm run preview      # Preview de build de producción
```

### Testing
```bash
npm run test         # Vitest (watch mode)
npm run test:run     # Vitest (single run)
npm run test:coverage # Vitest con coverage
npm run test:ci      # Vitest para CI (JUnit output)

npm run test:e2e     # Playwright E2E
npm run test:e2e:ui  # Playwright con UI
npm run test:e2e:debug # Playwright con debug
npm run test:e2e:report # Mostrar reporte HTML
```

### Calidad
```bash
npm run lighthouse   # Auditoría de performance
```

---

## Entry Points

### Principal
**Archivo:** `src/main.tsx`

```typescript
ReactDOM.createRoot(document.getElementById('root')!).render(
  <SentryProfiler>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </SentryProfiler>
)
```

### HTML
**Archivo:** `index.html`

- Critical CSS inline
- Preload de fuentes
- Loading splash para FCP inmediato
- Modulepreload para JS crítico

---

## Convenciones de Código

### Nomenclatura
- **Componentes:** PascalCase (`Workspace.tsx`, `LoadingSpinner.tsx`)
- **Hooks:** camelCase con prefijo `use` (`useAuth.ts`, `useChat.ts`)
- **Servicios:** kebab-case con `.service` (`auth.service.ts`, `chat.service.ts`)
- **Stores:** kebab-case con `.store` (`auth.store.ts`, `chat.store.ts`)
- **Utilidades:** camelCase (`utils.ts`, `reportWebVitals.ts`)

### Imports
```typescript
// Alias definidos en vite.config.ts
import { useAuth } from '@/hooks/useAuth'
import { authService } from '@/services/api'
import { useAuthStore } from '@/store/auth.store'
import type { User } from '@/types'
import { cn } from '@/lib/utils'
```

### Estructura de Componentes
```typescript
import { useState } from 'react'
import type { FC } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  className?: string
  children: React.ReactNode
}

const Component: FC<Props> = ({ className, children }) => {
  // Hooks
  // State
  // Effects
  // Handlers
  
  return <div className={cn(...)}>{children}</div>
}

export default Component
```

---

## Fase 9 - Conciliación + Clasificación (Completado 2026-03-11)

### Componentes Implementados (7/7 - 100%)

| Componente | Archivo | Líneas | Tests | Estado |
|------------|---------|--------|-------|--------|
| **BankStatementUpload** | `BankStatementUpload.tsx` | 350 | 9 tests | ✅ 100% |
| **MatchingTable** | `MatchingTable.tsx` | 400 | 10 tests | ✅ 100% |
| **MatchFilters** | `MatchFilters.tsx` | 300 | - | ✅ |
| **UnmatchedAlerts** | `UnmatchedAlerts.tsx` | 350 | - | ✅ |
| **DocumentClassifier** | `DocumentClassifier.tsx` | 450 | - | ✅ |
| **CFDIValidator** | `CFDIValidator.tsx` | 550 | - | ✅ |
| **EFOChecker** | `EFOChecker.tsx` | 500 | - | ✅ |

**Total Frontend Fase 9:** 3,500 líneas TypeScript/React

### Stores y Hooks

| Store/Hook | Archivo | Líneas | Descripción |
|------------|---------|--------|-------------|
| **reconciliationStore** | `reconciliationStore.ts` | 250 | Estado global de conciliación |
| **classificationStore** | `classificationStore.ts` | 150 | Estado global de clasificación |
| **useReconciliation** | `useReconciliation.ts` | 200 | 6 hooks (upload, matches, confirm, reject, stats) |
| **useClassification** | `useClassification.ts` | 250 | 6 hooks (suggest, feedback, manual, accounts, batch) |

### Integración Completada

- ✅ `App.tsx` actualizado con ruta `/reconciliation`
- ✅ `ReconciliationPage.tsx` integra todos los componentes
- ✅ `react-dropzone` instalado para drag-and-drop
- ✅ 15 componentes Radix UI utilizados
- ✅ 19 tests unitarios (100% passing)

### Tests

| Tipo | Tests | Passing | Estado |
|------|-------|---------|--------|
| **Unitarios** | 19 | 19/19 (100%) | ✅ |
| **E2E** | 10 | Pendiente | ⏳ Requiere backend |

---

## Recursos Adicionales

### Documentación Relacionada
- `.docs/FCP_OPTIMIZATION_REPORT.md` - Optimizaciones de First Contentful Paint
- `.docs/SENTRY_IMPLEMENTATION_SUMMARY.md` - Implementación de Sentry
- `PERFORMANCE_OPTIMIZATION_REPORT.md` - Reporte general de performance
- `JAVASCRIPT_OPTIMIZATION_REPORT.md` - Optimizaciones de JavaScript
- `CRITICAL_CSS_IMPLEMENTATION_REPORT.md` - Implementación de Critical CSS

### Enlaces Externos
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [TanStack Query](https://tanstack.com/query)
- [Zustand](https://zustand-demo.pmnd.rs)
- [shadcn/ui](https://ui.shadcn.com)
- [Radix UI](https://www.radix-ui.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Sentry](https://sentry.io)

---

*Documento generado automáticamente el 2026-03-12 - Fase 10: Store Testing + Quality*
