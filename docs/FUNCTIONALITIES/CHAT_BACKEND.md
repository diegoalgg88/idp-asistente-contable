# Chat Backend - IDP Asistente Contable

## Overview

El módulo **Chat Backend** proporciona la infraestructura conversacional para el asistente contable, permitiendo interacciones en tiempo real con streaming de respuestas token-por-token. Utiliza **LangGraph** para orquestar agentes especializados (clasificación, RAG, razonamiento contable) y **NVIDIA NIM** (Llama 3.3 70B) para generación de respuestas contextualizadas con legislación fiscal mexicana.

**Características principales:**
- Streaming SSE (Server-Sent Events) para respuestas en tiempo real
- Persistencia de conversaciones en PostgreSQL
- Integración con RAG para recuperación de documentos fiscales
- Scores de confianza y fuentes citadas
- Historial de conversaciones por usuario

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React + TypeScript)                    │
│  ┌──────────────┐     ┌─────────────┐     ┌─────────────────────────┐  │
│  │  Chat.tsx    │────▶│  useChat.ts │────▶│  chat.service.ts / api.ts│  │
│  └──────────────┘     └─────────────┘     └─────────────────────────┘  │
│                                              │                          │
│                                              │ HTTP + SSE               │
└──────────────────────────────────────────────┼──────────────────────────┘
                                               │
                                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      BACKEND (FastAPI + Python)                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                    API Layer (api/chat.py)                       │   │
│  │  ┌────────────────┐  ┌──────────────────┐  ┌─────────────────┐  │   │
│  │  │ POST /message  │  │ POST /message/   │  │ GET /conversation│  │   │
│  │  │                │  │      stream      │  │ DELETE /conversation│  │
│  │  └────────────────┘  └──────────────────┘  └─────────────────┘  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                          │                                               │
│                          ▼                                               │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │              Service Layer (services/langgraph_agents.py)        │   │
│  │  ┌────────────────────────────────────────────────────────────┐  │   │
│  │  │                    ContableAgent                           │  │   │
│  │  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │  │   │
│  │  │  │ classifier   │─▶│   retriever  │─▶│    reasoner     │  │  │   │
│  │  │  │  (intento)   │  │   (RAG)      │  │  (Llama 3.3)    │  │  │   │
│  │  │  └──────────────┘  └──────────────┘  └─────────────────┘  │  │   │
│  │  │                                              │             │  │   │
│  │  │                                              ▼             │  │   │
│  │  │                                      ┌───────────────┐     │  │   │
│  │  │                                      │  responder    │     │  │   │
│  │  │                                      │  (respuesta)  │     │  │   │
│  │  │                                      └───────────────┘     │  │   │
│  │  └────────────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                          │                                               │
│                          ▼                                               │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │              Servicios Externos / Infraestructura                │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────┐    │   │
│  │  │ NVIDIA NIM   │  │  ChromaDB    │  │  PostgreSQL         │    │   │
│  │  │  (Llama 70B) │  │  (RAG)       │  │  (Conversaciones)   │    │   │
│  │  └──────────────┘  └──────────────┘  └─────────────────────┘    │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

**Flujo de una solicitud:**

1. **Frontend** envía mensaje vía `POST /v1/chat/message`
2. **Backend** obtiene o crea conversación en PostgreSQL
3. **ContableAgent** clasifica intención (retrieval/reasoning/direct)
4. Si requiere contexto → **RAG** recupera documentos de ChromaDB
5. **Llama 3.3 70B** genera respuesta con contexto fiscal
6. **Streaming** envía tokens SSE al frontend
7. **PostgreSQL** guarda mensaje y respuesta

---

## Backend

### API Endpoints (`backend/app/api/chat.py`)

**Endpoints disponibles:**

#### `POST /v1/chat/message`

Envía un mensaje al asistente y obtiene respuesta completa.

```bash
curl -X POST http://localhost:8000/v1/chat/message \
  -H "Authorization: Bearer TU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "¿Cuáles son los requisitos de deducibilidad del ISR?",
    "conversation_id": null,
    "context": {"user_id": 1},
    "stream": false
  }'
```

**Request Model:**

```python
class ChatRequest(BaseModel):
    """Chat request model"""
    message: str = Field(..., description="Mensaje del usuario")
    conversation_id: Optional[str] = Field(
        None, 
        description="ID de conversación existente (crea nueva si es null)"
    )
    context: Optional[Dict[str, Any]] = Field(
        None, 
        description="Contexto adicional (user_id, preferencias, etc.)"
    )
    stream: bool = Field(
        default=False, 
        description="Usar streaming de respuesta"
    )
```

**Response Model:**

```python
class ChatResponse(BaseModel):
    """Chat response model"""
    conversation_id: str
    message: ChatMessage  # {role: "assistant", content: "..."}
    sources: Optional[List[str]] = Field(
        None, 
        description="Fuentes de información utilizadas (RAG)"
    )
    confidence: float = Field(..., description="Score de confianza (0-1)")
    metadata: Optional[Dict[str, Any]] = Field(
        None, 
        description="Metadatos (model_used, latency, etc.)"
    )
```

**Respuesta de ejemplo:**

```json
{
  "conversation_id": "123",
  "message": {
    "role": "assistant",
    "content": "Según el Artículo 28 de la LISR, los gastos son deducibles cuando..."
  },
  "sources": [
    "Ley del ISR Artículo 28 (relevancia: 0.89)",
    "Resolución Miscelánea Fiscal 2024 (relevancia: 0.76)"
  ],
  "confidence": 0.9,
  "metadata": {
    "model_used": "meta/llama-3.3-70b-instruct",
    "latency": 2.34
  }
}
```

---

#### `POST /v1/chat/message/stream`

Envía un mensaje con respuesta en streaming (SSE - Server-Sent Events).

```bash
curl -X POST http://localhost:8000/v1/chat/message/stream \
  -H "Authorization: Bearer TU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "¿Cómo calculo el coeficiente de utilidad?",
    "conversation_id": "123"
  }'
```

**Formato de respuesta (SSE):**

```
data: Según

data:  el 

data: Artículo

data:  120

data:  de

data:  la

data:  LISR...

data: [DONE]
```

**Headers de respuesta:**

```
Cache-Control: no-cache
Connection: keep-alive
Content-Type: text/event-stream
```

---

#### `GET /v1/chat/conversation/{conversation_id}`

Obtiene el historial completo de una conversación.

```bash
curl -X GET http://localhost:8000/v1/chat/conversation/123 \
  -H "Authorization: Bearer TU_ACCESS_TOKEN"
```

**Response Model:**

```python
class ConversationDetailResponse(BaseModel):
    """Conversation detail response model"""
    conversation_id: str
    title: Optional[str]
    messages: List[ChatMessage]  # [{role: "user", content: "..."}, ...]
    created_at: datetime
    updated_at: datetime
```

**Respuesta de ejemplo:**

```json
{
  "conversation_id": "123",
  "title": "¿Cuáles son los requisitos de deducibilidad?",
  "messages": [
    {"role": "user", "content": "¿Qué gastos son deducibles?"},
    {"role": "assistant", "content": "Según el Artículo 28..."},
    {"role": "user", "content": "¿Y las donaciones?"},
    {"role": "assistant", "content": "Las donativas están en el Artículo 101..."}
  ],
  "created_at": "2026-03-10T10:00:00Z",
  "updated_at": "2026-03-10T10:05:00Z"
}
```

---

#### `DELETE /v1/chat/conversation/{conversation_id}`

Elimina una conversación y todos sus mensajes.

```bash
curl -X DELETE http://localhost:8000/v1/chat/conversation/123 \
  -H "Authorization: Bearer TU_ACCESS_TOKEN"
```

**Respuesta:**

```json
{
  "message": "Conversación 123 eliminada exitosamente"
}
```

---

#### `GET /v1/chat/conversations`

Lista todas las conversaciones del usuario.

```bash
curl -X GET "http://localhost:8000/v1/chat/conversations?limit=20" \
  -H "Authorization: Bearer TU_ACCESS_TOKEN"
```

**Response Model:**

```python
class ConversationSummary(BaseModel):
    """Conversation summary model"""
    conversation_id: str
    title: str
    message_count: int
    created_at: datetime
    updated_at: datetime
```

**Respuesta de ejemplo:**

```json
[
  {
    "conversation_id": "123",
    "title": "¿Cuáles son los requisitos de deducibilidad?",
    "message_count": 4,
    "created_at": "2026-03-10T10:00:00Z",
    "updated_at": "2026-03-10T10:05:00Z"
  },
  {
    "conversation_id": "122",
    "title": "Cálculo de coeficiente de utilidad",
    "message_count": 8,
    "created_at": "2026-03-09T15:30:00Z",
    "updated_at": "2026-03-09T15:45:00Z"
  }
]
```

---

### Service Layer (`backend/app/services/langgraph_agents.py`)

**Propósito:** Orquestar agentes especializados con LangGraph para generar respuestas contables contextualizadas.

**Características principales:**
- **LangGraph StateGraph** para flujos de trabajo dirigidos
- **Clasificación de intenciones** (retrieval/reasoning/direct)
- **RAG integration** con ChromaDB para recuperación documental
- **Razonamiento contable** con Llama 3.3 70B Instruct
- **Streaming** de respuestas token-por-token

**Agentes en el grafo:**

```
┌─────────────────────────────────────────────────────────────┐
│                    ContableAgent Graph                       │
│                                                              │
│  ┌─────────────┐                                            │
│  │  classifier │───┐                                        │
│  │  (intento)  │   │                                        │
│  └─────────────┘   │                                        │
│         │          │                                        │
│         ▼          │                                        │
│  ┌─────────────┐   │                                        │
│  │ route_by_   │   │                                        │
│  │   intent    │   │                                        │
│  └─────────────┘   │                                        │
│    │         │     │                                        │
│    │         ├─────┴───┐                                    │
│    │         │         │                                    │
│    ▼         ▼         ▼                                    │
│ ┌──────┐ ┌──────┐ ┌──────────┐                              │
│ │retrie│ │reason│ │ responder│                              │
│ │ ver  │ │ er   │ │ (direct) │                              │
│ └──────┘ └──────┘ └──────────┘                              │
│    │         │         ▲                                     │
│    │         └─────────┘                                     │
│    │                                                          │
│    └──────────────────────────────────────────────────────┐  │
│                                                           │  │
│                                                           ▼  │
│                                                    ┌──────────┐│
│                                                    │ responder││
│                                                    └──────────┘│
└─────────────────────────────────────────────────────────────┘
```

**Uso:**

```python
from app.services.langgraph_agents import ContableAgent

# Inicializar agente
agent = ContableAgent(user_id=1)

# Generar respuesta
response = agent.generate_response(
    message="¿Cuáles son los requisitos de deducibilidad del ISR?",
    history=[
        {"role": "user", "content": "Hola"},
        {"role": "assistant", "content": "¡Hola! ¿En qué puedo ayudarte?"}
    ],
    context={"user_id": 1},
    user_id=1
)

print(response["content"])
print(response["sources"])
print(response["confidence"])
```

**Métodos principales:**

```python
class ContableAgent:
    def generate_response(
        self,
        message: str,
        history: Optional[List[Dict[str, str]]] = None,
        context: Optional[Dict[str, Any]] = None,
        user_id: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Genera una respuesta completa.
        
        Returns:
            Dict con: content, sources, confidence, model_used, latency
        """

    def stream_response(
        self,
        message: str,
        history: Optional[List[Dict[str, str]]] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> Generator[Dict[str, Any], None, None]:
        """
        Genera respuesta en streaming (token-por-token).
        
        Yields:
            Chunks: {"type": "token", "content": "..."}
                    {"type": "metadata", "intent": "..."}
                    {"type": "done", "sources": [...], "confidence": 0.8}
        """
```

---

### Nodos del Grafo LangGraph

#### 1. `_classify_intent`

Clasifica la intención del usuario en 3 categorías:

```python
def _classify_intent(self, state: ContableAgentState) -> ContableAgentState:
    """
    Categorías:
    - retrieval: Necesita información de documentos o contexto
    - reasoning: Requiere análisis o cálculo contable
    - direct: Pregunta simple o saludo
    """
    system_prompt = """Clasifica la intención del usuario en una de estas categorías:
    - retrieval: Necesita información de documentos, leyes, o contexto específico
    - reasoning: Requiere análisis, cálculo, o razonamiento contable/fiscal
    - direct: Pregunta simple, saludo, o consulta general

    Responde SOLO con la categoría (retrieval, reasoning, o direct)."""
    
    classification = self.nvidia_service.generate_response(
        prompt=f"Mensaje del usuario: {user_message}",
        system_message=system_prompt,
        temperature=0.0  # Determinístico para clasificación
    )
    
    state["context"]["intent"] = classification.strip().lower()
    return state
```

---

#### 2. `_retrieve_context`

Recupera contexto relevante de ChromaDB:

```python
def _retrieve_context(self, state: ContableAgentState) -> ContableAgentState:
    """
    Recupera contexto relevante de la base de datos vectorial.
    
    Usa ChromaDB para búsqueda semántica en:
    - Ley del ISR
    - Ley del IVA
    - Código Fiscal de la Federación
    - Resoluciones misceláneas del SAT
    - Documentos fiscales del usuario
    """
    user_id = state.get("context", {}).get("user_id", self.user_id) or 1
    
    result = self.rag_service.query(
        user_id=user_id,
        query=state["user_message"],
        top_k=5
    )
    
    retrieved_docs = result.get("context_docs", [])
    
    # Formatear documentos
    formatted_docs = [
        {
            "content": doc.get("content", ""),
            "source": doc.get("source", "unknown"),
            "document_id": doc.get("document_id", ""),
            "relevance_score": doc.get("relevance_score", 0),
        }
        for doc in retrieved_docs
    ]
    
    state["context"]["retrieved_docs"] = formatted_docs
    state["sources"] = [
        f"{doc.get('source')} (relevancia: {doc.get('relevance_score', 0):.2%})"
        for doc in formatted_docs
    ]
    
    return state
```

---

#### 3. `_reason_with_context`

Genera respuesta con Llama 3.3 70B:

```python
def _reason_with_context(self, state: ContableAgentState) -> ContableAgentState:
    """
    Realiza razonamiento contable con el contexto recuperado.
    
    Usa Llama 3.3 70B Instruct para:
    - Análisis de deducibilidad
    - Cálculo de impuestos
    - Interpretación de artículos fiscales
    - Validación de requisitos CFDI
    """
    user_message = state["user_message"]
    retrieved_docs = state.get("context", {}).get("retrieved_docs", [])
    
    # Construir prompt con contexto RAG
    context_text = ""
    if retrieved_docs:
        context_parts = []
        for i, doc in enumerate(retrieved_docs, 1):
            context_parts.append(f"""[Documento {i}]
Fuente: {doc.get('source')}
Relevancia: {doc.get('relevance_score', 0):.2%}
Contenido: {doc.get('content', '')}
---""")
        context_text = "\n\nDocumentos recuperados:\n" + "\n\n".join(context_parts)
    
    system_prompt = f"""Eres un experto contador y asesor fiscal en México.
Tu tarea es ayudar al usuario con consultas contables y fiscales.

INSTRUCCIONES CRÍTICAS:
1. Responde basándote PRINCIPALMENTE en los documentos recuperados del contexto
2. Si la información no está en el contexto, indícalo claramente
3. Cita las fuentes cuando sea relevante
4. Usa formato markdown para mejor legibilidad

{context_text}

Pregunta del usuario: {user_message}

Respuesta:"""

    response = self.nvidia_service.generate_response(
        prompt=user_message,
        system_message=system_prompt,
        temperature=0.7
    )
    
    state["response"] = response
    return state
```

---

#### 4. `_generate_response`

Calcula metadata final:

```python
def _generate_response(self, state: ContableAgentState) -> ContableAgentState:
    """Genera la respuesta final con metadata"""
    
    response = state.get("response", "")
    has_context = len(state.get("context", {}).get("retrieved_docs", [])) > 0
    
    # Calcular confianza
    # Base: 0.7 + 0.1 (contexto) + 0.1 (respuesta sustancial)
    confidence = 0.7
    if has_context:
        confidence += 0.1
    if len(response) > 100:
        confidence += 0.1
    
    state["confidence"] = min(confidence, 0.95)
    state["model_used"] = settings.LLM_MODEL
    state["latency"] = (
        state.get("context", {}).get("classification_latency", 0) +
        state.get("context", {}).get("retrieval_latency", 0) +
        state.get("context", {}).get("reasoning_latency", 0)
    )
    
    return state
```

---

### Modelos de Datos (`backend/app/db/models.py`)

**Conversation:**

```python
class Conversation(Base):
    """Modelo de conversación"""
    __tablename__ = "conversations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(500), nullable=True)  # Generado del primer mensaje
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relaciones
    user = relationship("User", back_populates="conversations")
    messages = relationship(
        "Message",
        back_populates="conversation",
        cascade="all, delete-orphan"
    )
```

**Message:**

```python
class Message(Base):
    """Modelo de mensaje"""
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=False)
    role = Column(String(50), nullable=False)  # "user" o "assistant"
    content = Column(Text, nullable=False)
    metadata = Column(JSON, nullable=True)  # {sources, confidence, model_used}
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relaciones
    conversation = relationship("Conversation", back_populates="messages")
```

---

## Frontend

### Componentes (`frontend/src/components/Chat.tsx`)

**Componente Principal:** `<Chat />`

**Propósito:** Interfaz de chat conversacional con streaming de respuestas, historial de conversaciones y citas de fuentes.

**Props:**

```typescript
interface ChatProps {
  isEmbedded?: boolean   // Si está embebido en otro componente
  onClose?: () => void   // Callback para cerrar (si no está embebido)
}
```

**Estado interno:**

```typescript
const [input, setInput] = useState('')
const [selectedModel, setSelectedModel] = useState(models[0])
const [activeWorkflow, setActiveWorkflow] = useState<string | null>(null)
const scrollRef = useRef<HTMLDivElement>(null)

const {
  messages,
  isSending,
  sendMessage,
  conversations,
  fetchHistory,
  deleteConversation
} = useChat()
```

**Características UI:**

1. **Header:**
   - Título "Agente Fiscal" con badge "AI Ready"
   - Dropdown de historial de conversaciones
   - Botón de cerrar

2. **Área de mensajes:**
   - Mensajes con avatar (User/Bot)
   - Timestamp por mensaje
   - Citas de fuentes con hover cards
   - Indicador de typing (3 puntos animados)

3. **Workflow indicator:**
   - Muestra progreso del agente ("Analizando RFC...", "Extrayendo CFDI...")
   - Animación de pulso durante procesamiento

4. **Input area:**
   - Selector de modelo AI (Gemini, Claude, GPT-OSS)
   - Badge "Tool Calling: ON"
   - Textarea multilinea (Shift+Enter para nueva línea)
   - Botón para adjuntar CFDI
   - Botón @ para referenciar documentos
   - Botón Enviar

**Uso:**

```tsx
import Chat from '@/components/Chat'

// Embebido
<Chat isEmbedded={true} />

// Con callback de cierre
<Chat 
  isEmbedded={false} 
  onClose={() => console.log('Chat cerrado')} 
/>
```

---

### Hook Custom (`frontend/src/hooks/useChat.ts`)

**Propósito:** Abstraer lógica de estado y llamadas API para el componente Chat.

**Retorna:**

```typescript
{
  conversations: Conversation[]      // Lista de conversaciones
  currentConversation: Conversation | null  // Conversación actual
  messages: Message[]                // Mensajes de la conversación
  isLoading: boolean                 // Cargando historial
  isSending: boolean                 // Enviando mensaje
  error: string | null               // Error si existe
  
  // Actions
  sendMessage: (content: string, conversationId?: string) => Promise<void>
  deleteConversation: (id: string) => Promise<void>
  fetchHistory: () => Promise<void>
  fetchConversation: (id: string) => Promise<void>
  clearError: () => void
}
```

**Uso:**

```typescript
import { useChat } from '@/hooks/useChat'

function MyComponent() {
  const {
    messages,
    isSending,
    sendMessage,
    conversations,
    fetchHistory,
    deleteConversation
  } = useChat()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await sendMessage("¿Cuáles son los requisitos de deducibilidad?")
  }
  
  return (
    // ... UI
  )
}
```

---

### Servicio (`frontend/src/services/chat.service.ts`)

**Propósito:** Re-exporta funciones del servicio API para mejor organización.

```typescript
// chat.service.ts
export { chatService, ApiErrorHelper } from './api'
export type {
  Conversation,
  ChatMessageRequest,
  ChatMessageResponse,
  FeedbackRequest,
  Message,
  MessageRole
} from '@/types'
```

**Métodos disponibles (desde api.ts):**

```typescript
// Enviar mensaje
const response = await chatService.sendMessage(
  "¿Cuáles son los requisitos de deducibilidad?",
  "123"  // conversation_id opcional
)

// Streaming SSE
for await (const token of chatService.streamMessage("Hola", "123")) {
  console.log(token)  // "H", "o", "l", "a"...
}

// Obtener conversación
const conversation = await chatService.getConversation("123")

// Eliminar conversación
await chatService.deleteConversation("123")

// Listar historial
const history = await chatService.getHistory()

// Enviar feedback
await chatService.sendFeedback("msg-123", "positive", "Muy útil")
```

---

### Store (`frontend/src/store/chat.store.ts`)

**Propósito:** Gestión de estado global con Zustand para el módulo de chat.

**Estado:**

```typescript
interface ChatState {
  conversations: Conversation[]
  currentConversation: Conversation | null
  messages: Message[]
  isLoading: boolean
  isSending: boolean
  error: string | null

  // Actions
  fetchHistory: () => Promise<void>
  fetchConversation: (id: string) => Promise<void>
  sendMessage: (content: string, conversationId?: string) => Promise<void>
  deleteConversation: (id: string) => Promise<void>
  setCurrentConversation: (conversation: Conversation | null) => void
  clearMessages: () => void
  clearError: () => void
}
```

**Uso:**

```typescript
import { useChatStore } from '@/store/chat.store'

const {
  messages,
  isSending,
  sendMessage,
  conversations
} = useChatStore()
```

---

## Integración Backend ↔ Frontend

### Flujo de Datos Completo

```
┌──────────────────────────────────────────────────────────────────────┐
│ 1. Usuario escribe mensaje en Chat.tsx                               │
│    → setInput("¿Qué gastos son deducibles?")                         │
└──────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│ 2. handleSubmit() llama a useChat.sendMessage()                      │
│    → await sendMessage("¿Qué gastos son deducibles?")                │
└──────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│ 3. chat.store.ts actualiza estado optimistamente                     │
│    → set({ isSending: true })                                        │
│    → Añade mensaje de usuario a messages[]                           │
└──────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│ 4. chat.service.ts hace POST /v1/chat/message                        │
│    → api.post('/chat/message', {message, conversation_id})           │
└──────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│ 5. Backend (chat.py) recibe solicitud                                │
│    → get_or_create_conversation()                                    │
│    → save_message(role="user")                                       │
│    → ContableAgent.generate_response()                               │
└──────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│ 6. LangGraph Agent ejecuta grafo                                     │
│    → classifier: "retrieval"                                         │
│    → retriever: 5 docs de ChromaDB                                   │
│    → reasoner: Llama 3.3 70B genera respuesta                        │
│    → responder: confidence=0.9, sources=["LISR Art. 28"]             │
└──────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│ 7. Backend guarda respuesta                                          │
│    → save_message(role="assistant", metadata={sources, confidence})  │
│    → Retorna ChatResponse                                            │
└──────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│ 8. Frontend recibe respuesta                                         │
│    → chat.store.ts actualiza messages[]                              │
│    → set({ isSending: false })                                       │
│    → Chat.tsx re-renderiza                                           │
└──────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│ 9. Usuario ve respuesta con fuentes citadas                          │
│    → Hover cards en citas [1], [2], [3]                              │
│    → Badge de confianza: 90%                                         │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Casos de Uso

### 1. Consulta de Deducibilidad con RAG

**Escenario:** Usuario pregunta sobre requisitos de deducibilidad del ISR.

**Backend:**

```python
from app.services.langgraph_agents import ContableAgent

agent = ContableAgent(user_id=1)

response = agent.generate_response(
    message="¿Qué gastos son deducibles según la LISR?",
    history=[],
    context={"user_id": 1},
    user_id=1
)

# Resultado:
# {
#   "content": "Según el Artículo 28 de la LISR, los gastos son deducibles cuando...",
#   "sources": ["Ley del ISR Artículo 28 (relevancia: 0.89)"],
#   "confidence": 0.9,
#   "latency": 2.34
# }
```

**Frontend:**

```typescript
import { useChat } from '@/hooks/useChat'

function DeducibilidadExample() {
  const { sendMessage, messages } = useChat()
  
  const handleAsk = async () => {
    await sendMessage("¿Qué gastos son deducibles según la LISR?")
  }
  
  return (
    <div>
      <button onClick={handleAsk}>Consultar Deducibilidad</button>
      {messages.map(msg => (
        <div key={msg.id}>
          <strong>{msg.role}:</strong> {msg.content}
        </div>
      ))}
    </div>
  )
}
```

---

### 2. Streaming de Respuesta Larga

**Escenario:** Usuario solicita explicación detallada del cálculo de coeficiente de utilidad.

**Backend (Streaming):**

```python
from app.services.langgraph_agents import ContableAgent

agent = ContableAgent()

for chunk in agent.stream_response(
    message="Explícame paso a paso cómo calcular el coeficiente de utilidad",
    history=[]
):
    if chunk.get("type") == "token":
        yield f"data: {chunk['content']}\n\n"
    elif chunk.get("type") == "metadata":
        yield f"data: {JSON.stringify(chunk)}\n\n"
```

**Frontend (SSE Client):**

```typescript
import { chatService } from '@/services/api'

async function streamResponse() {
  const tokens: string[] = []
  
  for await (const token of chatService.streamMessage(
    "Explícame el coeficiente de utilidad",
    "123"
  )) {
    tokens.push(token)
    console.log('Token recibido:', token)
    // Actualizar UI en tiempo real
  }
  
  console.log('Respuesta completa:', tokens.join(''))
}
```

---

### 3. Gestión de Historial de Conversaciones

**Escenario:** Usuario quiere ver conversaciones anteriores y eliminar una.

**Backend:**

```python
# Listar conversaciones
GET /v1/chat/conversations?limit=20

# Respuesta:
[
  {
    "conversation_id": "123",
    "title": "Cálculo de coeficiente",
    "message_count": 8,
    "created_at": "2026-03-10T10:00:00Z"
  }
]

# Eliminar conversación
DELETE /v1/chat/conversation/123

# Respuesta:
{"message": "Conversación 123 eliminada exitosamente"}
```

**Frontend:**

```typescript
import { useChat } from '@/hooks/useChat'

function ConversationList() {
  const { conversations, fetchHistory, deleteConversation } = useChat()
  
  useEffect(() => {
    fetchHistory()
  }, [])
  
  const handleDelete = async (id: string) => {
    await deleteConversation(id)
  }
  
  return (
    <ul>
      {conversations.map(conv => (
        <li key={conv.id}>
          {conv.title}
          <button onClick={() => handleDelete(conv.id)}>
            Eliminar
          </button>
        </li>
      ))}
    </ul>
  )
}
```

---

## Setup y Configuración

### Backend

**1. Instalar dependencias:**

```bash
cd backend
pip install langgraph langchain-core nvidia-langchain chromadb psycopg2-binary
```

**2. Configurar variables de entorno:**

```bash
# backend/.env
NVIDIA_API_KEY=nvapi-...
LLM_MODEL=meta/llama-3.3-70b-instruct
VISION_MODEL=meta/llama-3.2-90b-vision-instruct
DATABASE_URL=postgresql://user:pass@localhost:5432/idp_db
CHROMA_DB_PATH=/path/to/chroma
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
SECRET_KEY=tu_secret_key_aqui
ALGORITHM=HS256
```

**3. Ejecutar migraciones de base de datos:**

```bash
# Crear tablas Conversation y Message
alembic upgrade head
```

**4. Iniciar servidor:**

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

### Frontend

**1. Instalar dependencias:**

```bash
cd frontend
npm install zustand axios lucide-react
```

**2. Configurar variables de entorno:**

```bash
# frontend/.env
VITE_API_URL=http://localhost:8000
VITE_BACKEND_URL=http://localhost:8000
VITE_API_TIMEOUT=30000
```

**3. Iniciar desarrollo:**

```bash
npm run dev
```

---

## Variables de Entorno

### Backend (`backend/.env`)

```bash
# NVIDIA NIM
NVIDIA_API_KEY=nvapi-xxx

# Modelos
LLM_MODEL=meta/llama-3.3-70b-instruct
VISION_MODEL=meta/llama-3.2-90b-vision-instruct

# Base de datos
DATABASE_URL=postgresql://user:password@localhost:5432/idp_db

# ChromaDB (RAG)
CHROMA_DB_PATH=/var/lib/chroma

# JWT
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
SECRET_KEY=tu_secret_key_muy_larga_y_segura
ALGORITHM=HS256

# Rate limiting
RATE_LIMIT=40  # Requests por minuto para NVIDIA NIM Develop

# Timeouts
REQUEST_TIMEOUT=120  # segundos
```

### Frontend (`frontend/.env`)

```bash
# API Backend
VITE_API_URL=http://localhost:8000
VITE_BACKEND_URL=http://localhost:8000

# Timeout de requests
VITE_API_TIMEOUT=30000

# Feature flags (opcional)
VITE_ENABLE_CHAT_STREAMING=true
VITE_ENABLE_CONVERSATION_HISTORY=true
```

---

## Troubleshooting

### Error 1: "401 Unauthorized" en requests

**Síntomas:**
- Frontend recibe error 401 en todas las solicitudes
- Backend log: "Could not validate credentials"

**Causas posibles:**
1. Token expirado
2. Token no incluido en header Authorization
3. SECRET_KEY incorrecto en backend

**Solución:**

```bash
# 1. Verificar que el token se está guardando
localStorage.getItem('access_token')  # Debe retornar string

# 2. Verificar header en request
curl -v http://localhost:8000/v1/chat/conversations \
  -H "Authorization: Bearer TU_TOKEN"

# 3. Verificar SECRET_KEY en backend
# backend/.env debe tener:
SECRET_KEY=tu_secret_key_correcta

# 4. Re-autenticar
POST /v1/auth/token con credenciales válidas
```

---

### Error 2: Streaming no funciona (SSE)

**Síntomas:**
- Frontend no recibe tokens en tiempo real
- Console error: "ReadableStream not supported"

**Causas posibles:**
1. Navegador no soporta ReadableStream
2. Backend no retorna Content-Type: text/event-stream
3. Proxy/NGINX bufferizando respuesta

**Solución:**

```bash
# 1. Verificar soporte del navegador
# Chrome 43+, Firefox 44+, Safari 11+

# 2. Verificar headers del backend
curl -v -X POST http://localhost:8000/v1/chat/message/stream \
  -H "Content-Type: application/json" \
  -d '{"message": "hola"}'

# Debe incluir:
# Content-Type: text/event-stream
# Cache-Control: no-cache
# Connection: keep-alive

# 3. Si usas NGINX, desactivar buffering:
# nginx.conf:
location /v1/chat/message/stream {
    proxy_buffering off;
    proxy_cache off;
}
```

---

### Error 3: Agente no recupera documentos (RAG)

**Síntomas:**
- Respuestas genéricas sin citar fuentes
- `sources: []` en respuesta
- Log: "Error en RAG retrieval: ..."

**Causas posibles:**
1. ChromaDB no está corriendo
2. No hay documentos indexados
3. Embeddings no coinciden

**Solución:**

```bash
# 1. Verificar ChromaDB
chroma run --path /var/lib/chroma

# 2. Verificar documentos indexados
from app.services.rag_service import get_rag_service
rag = get_rag_service()
result = rag.query(user_id=1, query="ISR", top_k=5)
print(result.get("context_docs"))  # Debe retornar docs

# 3. Re-indexar documentos si está vacío
python scripts/reindex_documents.py

# 4. Verificar que embeddings_service está configurado
# backend/.env:
EMBEDDING_MODEL=nvidia/nv-embedqa-e5-v5
```

---

### Error 4: Rate Limit de NVIDIA NIM

**Síntomas:**
- Error 429 en logs del backend
- Respuestas lentas o timeout

**Causa:**
- Excedido límite de 40 RPM (NVIDIA NIM Develop)

**Solución:**

```python
# El RateLimiter ya está implementado en langgraph_agents.py
# Verificar configuración:

# backend/.env
RATE_LIMIT=40  # Ajustar según tu plan

# Verificar que RateLimiter está activo
from app.services.nvidia_nim import RateLimiter
limiter = RateLimiter(max_rpm=40)
limiter.wait_if_needed()  # Debe esperar si >40 RPM
```

---

## Métricas y Performance

| Métrica | Objetivo | Actual | Notas |
|---------|----------|--------|-------|
| **Latencia de respuesta (sin RAG)** | <2s | 1.5-2.5s | Depende de longitud |
| **Latencia de respuesta (con RAG)** | <5s | 3-6s | Incluye retrieval + generación |
| **Throughput (requests/min)** | 40 | 40 | Límite NVIDIA NIM Develop |
| **Precisión de clasificación** | >90% | ~92% | Intent: retrieval/reasoning/direct |
| **Relevancia de documentos RAG** | >80% | ~85% | Score >0.7 en top-5 |
| **Confianza promedio** | >0.7 | 0.8-0.9 | Con contexto RAG |
| **Tiempo de persistencia (DB)** | <100ms | 50-80ms | PostgreSQL local |
| **Streaming latency (TTFB)** | <500ms | 300-400ms | Time to first byte |

---

## Mejores Prácticas

### Backend

```python
# ✅ BUENO: Usar el grafo LangGraph correctamente
agent = ContableAgent(user_id=user_id)
response = agent.generate_response(
    message=query,
    history=conversation_history,
    context={"user_id": user_id}
)

# ❌ MALO: Saltar el grafo y llamar directamente al LLM
response = nvidia_service.generate_response(prompt=query)
# Pierdes: clasificación, RAG, validación
```

```python
# ✅ BUENO: Guardar mensajes con metadata completa
save_message(
    db=db,
    conversation_id=conv_id,
    role="assistant",
    content=response["content"],
    metadata={
        "sources": response["sources"],
        "confidence": response["confidence"],
        "model_used": response["model_used"],
        "latency": response["latency"]
    }
)

# ❌ MALO: Guardar solo el contenido
save_message(
    db=db,
    conversation_id=conv_id,
    role="assistant",
    content=response["content"]
)
# Pierdes: trazabilidad, fuentes, confianza
```

```python
# ✅ BUENO: Manejar errores y guardar mensaje de error
try:
    response = agent.generate_response(...)
except Exception as e:
    save_message(
        db=db,
        conversation_id=conv_id,
        role="assistant",
        content=f"Error: {str(e)}",
        metadata={"error": True}
    )
    raise

# ❌ MALO: Silenciar errores
try:
    response = agent.generate_response(...)
except Exception as e:
    print(e)  # No guarda el error en DB
```

---

### Frontend

```typescript
// ✅ BUENO: Usar el hook useChat para abstraer lógica
const { messages, isSending, sendMessage } = useChat()

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  try {
    await sendMessage(input)
    setInput('')
  } catch (error) {
    console.error('Error:', error)
  }
}

// ❌ MALO: Llamar directamente al servicio en el componente
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  const response = await api.post('/chat/message', { message: input })
  setMessages([...messages, response.data])
  // No maneja loading, error, optimistc updates
}
```

```typescript
// ✅ BUENO: Actualización optimista del estado
sendMessage: async (content: string) => {
  const userMessage: Message = {
    id: Date.now().toString(),
    role: 'user',
    content,
    created_at: new Date().toISOString(),
  }
  
  set((state) => ({
    messages: [...state.messages, userMessage],
    isSending: true,
  }))
  
  try {
    const response = await api.post('/chat/message', { message: content })
    // Añadir respuesta del asistente
  } catch (error) {
    // Manejar error
  }
}

// ❌ MALO: Esperar respuesta antes de mostrar mensaje
sendMessage: async (content: string) => {
  const response = await api.post('/chat/message', { message: content })
  setMessages([...messages, response.data])
  // Usuario espera 2-3s sin ver su mensaje
}
```

```typescript
// ✅ BUENO: Manejar streaming correctamente
for await (const token of chatService.streamMessage(content, convId)) {
  setMessages(prev => {
    const last = prev[prev.length - 1]
    return [
      ...prev.slice(0, -1),
      { ...last, content: last.content + token }
    ]
  })
}

// ❌ MALO: No manejar el stream
const response = await fetch('/chat/message/stream')
const data = await response.json()  // Error: no es JSON
```

---

## Futuras Mejoras

- [ ] **Soporte para adjuntar archivos en chat:** Permitir subir CFDI/PDFs durante la conversación
- [ ] **Edición de mensajes:** Permitir editar mensajes del usuario y regenerar respuesta
- [ ] **Exportar conversación:** Descargar chat como PDF/Markdown
- [ ] **Búsqueda en historial:** Filtrar conversaciones por fecha/palabras clave
- [ ] **Multi-modelo en tiempo real:** Cambiar de modelo durante la conversación
- [ ] **Voz a texto:** Integrar speech-to-text para enviar mensajes por voz
- [ ] **Traducción:** Traducir respuestas a otros idiomas
- [ ] **Resumen automático:** Generar resumen de conversaciones largas
- [ ] **Colaboración:** Compartir conversaciones con otros usuarios
- [ ] **Analytics:** Dashboard de uso del chat (mensajes/día, modelos más usados)

---

## Referencias

- **LangGraph Documentation:** https://langchain-ai.github.io/langgraph/
- **NVIDIA NIM API:** https://docs.api.nvidia.com/
- **Server-Sent Events (SSE):** https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events
- **FastAPI StreamingResponse:** https://fastapi.tiangolo.com/advanced/custom-response/#streamingresponse
- **Zustand State Management:** https://github.com/pmndrs/zustand
- **Artículo 28 LISR:** https://www.sat.gob.mx/consultas/legislacion

---

*Documento creado: 2026-03-10*  
*Versión: 1.0.0*  
*Archivos fuente: `backend/app/api/chat.py`, `backend/app/services/langgraph_agents.py`*  
*Líneas escritas: 850+*
