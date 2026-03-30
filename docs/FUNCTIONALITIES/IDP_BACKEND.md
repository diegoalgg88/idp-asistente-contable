# IDP (Intelligent Document Processing) - Backend

## Overview

El sistema **Intelligent Document Processing (IDP)** permite procesar documentos contables mexicanos (CFDI, facturas, recibos) utilizando **NVIDIA NIM API** para OCR, visión computacional y extracción de entidades. El sistema valida automáticamente RFCs, calcula scores de confianza y almacena los resultados para posterior retrieval.

## Arquitectura

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    IDP Backend Architecture                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐            │
│  │  Frontend    │────▶│  IDP API     │────▶│  NVIDIA NIM  │            │
│  │  (Upload)    │     │  Endpoints   │     │  OCR/Vision  │            │
│  └──────────────┘     └──────────────┘     └──────────────┘            │
│                            │                    │                       │
│                            ▼                    ▼                       │
│                     ┌──────────────┐     ┌──────────────┐             │
│                     │  Document    │     │  Validators  │             │
│                     │  Model (DB)  │     │  (RFC/UUID)  │             │
│                     └──────────────┘     └──────────────┘             │
│                            │                                           │
│                            ▼                                           │
│                     ┌──────────────┐                                  │
│                     │  RAG Service │                                  │
│                     │  (ChromaDB)  │                                  │
│                     └──────────────┘                                  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Flujo completo:**
```
1. Upload (Frontend) 
  → 2. POST /v1/idp/process (Backend) 
  → 3. Guardar archivo 
  → 4. OCR (NVIDIA NemoRetriever) 
  → 5. Vision LLM (Llama 3.2 90B) 
  → 6. Extracción de entidades 
  → 7. Validar RFC (validators.py) 
  → 8. Calcular confianza 
  → 9. Guardar en DB 
  → 10. Ingestar a ChromaDB 
  → 11. Response
```

---

## Backend

### API Endpoints (`app/api/idp.py`)

**Endpoints disponibles:**

#### `POST /v1/idp/process`
Procesar documento individual (PDF, PNG, JPG, JPEG, TIFF).

```bash
curl -X POST http://localhost:8000/v1/idp/process \
  -H "Authorization: Bearer TOKEN" \
  -F "file=@factura.pdf" \
  -F 'document_type=factura' \
  -F 'metadata={"rfc_emisor": "ABC123456DEF"}'
```

**Request Model:**
```python
class DocumentProcessingRequest(BaseModel):
    """Request model for document processing"""
    document_type: str = Field(..., description="Tipo de documento (factura, recibo, estado_cuenta, etc.)")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Metadatos adicionales")
```

**Response Model:**
```python
class DocumentProcessingResponse(BaseModel):
    """Response model for document processing"""
    document_id: str
    status: str
    extracted_data: Optional[Dict[str, Any]] = None
    confidence_score: Optional[float] = None
    latency: Optional[float] = None
    message: str
```

**Ejemplo de Response:**
```json
{
  "document_id": "doc_abc123",
  "status": "completed",
  "extracted_data": {
    "uuid": "A1B2C3D4-E5F6-7890-ABCD-EF1234567890",
    "rfc_emisor": "ABC123456DEF",
    "rfc_receptor": "XYZ987654ABC",
    "total": 1160.00,
    "subtotal": 1000.00,
    "iva": 160.00,
    "fecha": "2026-02-28"
  },
  "confidence_score": 0.95,
  "latency": 8.5,
  "message": "Documento procesado exitosamente"
}
```

#### `POST /v1/idp/batch-process`
Procesamiento masivo de documentos con parallel workers.

```bash
curl -X POST http://localhost:8000/v1/idp/batch-process \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "document_type": "factura",
    "max_workers": 4
  }'
```

**Request Model:**
```python
class BatchProcessRequest(BaseModel):
    """Request model for batch processing"""
    document_type: str = Field(..., description="Tipo de documento")
    max_workers: int = Field(default=4, ge=1, le=10, description="Número de workers paralelos")
```

**Response Model:**
```python
class BatchProcessResponse(BaseModel):
    """Response model for batch processing"""
    batch_id: str
    total_documents: int
    status: str
    message: str
    estimated_time: Optional[str] = None
```

#### `GET /v1/idp/{document_id}`
Obtener estado de procesamiento de un documento.

```bash
curl http://localhost:8000/v1/idp/doc_abc123 \
  -H "Authorization: Bearer TOKEN"
```

**Response Model:**
```python
class DocumentStatusResponse(BaseModel):
    """Response model for document status"""
    document_id: str
    status: str
    document_type: str
    created_at: datetime
    updated_at: datetime
    extracted_data: Optional[Dict[str, Any]] = None
    confidence_score: Optional[float] = None
    error_message: Optional[str] = None
```

### Service Layer (`app/services/nvidia_nim.py`)

**Propósito:** Cliente de NVIDIA NIM API para OCR, visión y extracción de entidades.

**Modelos utilizados:**
- **OCR:** `nvidia/nemoretriever-ocr-v1` - Extracción de texto de PDFs/imágenes
- **Vision:** `meta/llama-3.2-90b-vision-instruct` - Extracción de entidades estructuradas
- **Tabla:** `nvidia/nemoretriever-table-structure-v1` - Estructura de tablas

**Características principales:**
- Rate limiting thread-safe (40 RPM para Develop tier)
- Retry con exponential backoff
- Streaming support para respuestas largas
- Batch processing con ThreadPoolExecutor
- Timeout configurable (120 segundos)

**Métodos principales:**

```python
from app.services.nvidia_nim import NIMExtractionService

extraction_service = NIMExtractionService()

# 1. OCR - Extraer texto de PDF/imagen
text = extraction_service.extract_text_from_pdf("factura.pdf")
text = extraction_service.extract_text_from_image("recibo.png")

# 2. Vision LLM - Extraer entidades estructuradas
entities = extraction_service.extract_entities_from_image(
    image_path="factura.png",
    entity_types=["rfc_emisor", "rfc_receptor", "total", "fecha", "uuid"]
)

# 3. Batch processing
results = await process_batch_async(
    documents=document_list,
    max_workers=4,
    document_type="factura"
)
```

**Estructura de entidades extraídas:**
```python
{
    "uuid": "A1B2C3D4-E5F6-7890-ABCD-EF1234567890",
    "rfc_emisor": "ABC123456DEF",
    "rfc_receptor": "XYZ987654ABC",
    "fecha_emision": "2026-02-28",
    "total": 1160.00,
    "subtotal": 1000.00,
    "iva": 160.00,
    "tipo_comprobante": "I",
    "metodo_pago": "PUE",
    "forma_pago": "03",
    "moneda": "MXN"
}
```

### Validators (`app/core/validators.py`)

**Propósito:** Validar RFCs, UUIDs y otros campos fiscales mexicanos.

**Funciones principales:**

```python
from app.core.validators import validar_rfc_sat, validar_uuid_cfdi

# Validar RFC con reglas del SAT
es_valido, error = validar_rfc_sat("ABC123456DEF")
# Returns: (True, None) si es válido

# Validar UUID de CFDI 4.0
es_valido = validar_uuid_cfdi("A1B2C3D4-E5F6-7890-ABCD-EF1234567890")
# Returns: True si tiene formato correcto
```

**Reglas de validación de RFC:**
1. Longitud: 12 caracteres (moral) o 13 (física)
2. Primeros 4: Letras (nombre/razón social)
3. Siguientes 6: Fecha (YYMMDD)
4. Últimos 3: Homoclave + dígito verificador
5. No contener caracteres inválidos

### Modelos de Datos (`app/db/models.py`)

**Document Model:**
```python
class Document(Base):
    """Document model for processed contable documents"""
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    document_type = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    original_filename = Column(String)
    extracted_data = Column(JSON)
    confidence_score = Column(Float)
    status = Column(String, default="pending")  # pending, processing, completed, failed
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="documents")
```

**Campos de `extracted_data` (JSON):**
```json
{
  "uuid": "A1B2C3D4-E5F6-7890-ABCD-EF1234567890",
  "rfc_emisor": "ABC123456DEF",
  "rfc_receptor": "XYZ987654ABC",
  "fecha_emision": "2026-02-28",
  "total": 1160.00,
  "subtotal": 1000.00,
  "iva": 160.00,
  "tipo_comprobante": "I",
  "metodo_pago": "PUE",
  "forma_pago": "03",
  "moneda": "MXN",
  "conceptos": [
    {
      "clave_prod_serv": "01010101",
      "cantidad": 1,
      "unidad": "H87",
      "descripcion": "Producto de prueba",
      "valor_unitario": 1000.00,
      "importe": 1000.00
    }
  ],
  "impuestos": {
    "total_impuestos_trasladados": 160.00,
    "traslados": [
      {
        "impuesto": "002",
        "tipo_factor": "Tasa",
        "tasa_o_cuota": "0.160000",
        "importe": 160.00
      }
    ]
  }
}
```

---

## Frontend

### Componentes (`frontend/src/components/Documents.tsx`)

**Propósito:** UI para upload, visualización y gestión de documentos procesados.

**Props:**
```typescript
interface DocumentsProps {
  userId: number
  onDocumentProcessed?: (docId: string) => void
}
```

**Estado principal:**
```typescript
interface DocumentsState {
  documents: Document[]
  isLoading: boolean
  isUploading: boolean
  uploadProgress: number
  error: string | null
  filter: {
    documentType: string
    status: string
    dateRange: [Date, Date]
  }
}
```

**Características UI:**
- Drag & drop upload
- Progress bar de procesamiento
- Tabla de documentos con filtros
- Badge de status (pending, processing, completed, failed)
- Vista previa de datos extraídos
- Botón de re-procesamiento

**Uso:**
```tsx
<Documents 
  userId={1} 
  onDocumentProcessed={(docId) => {
    console.log('Documento procesado:', docId)
  }} 
/>
```

### Hooks (`frontend/src/hooks/useIDP.ts`)

**Propósito:** Manejar lógica de procesamiento de documentos.

**Retorna:**
```typescript
interface UseIDPReturn {
  // Estado
  documents: Document[]
  isLoading: boolean
  isUploading: boolean
  uploadProgress: number
  error: string | null
  
  // Acciones
  uploadDocument: (file: File, documentType: string) => Promise<string>
  batchUpload: (files: File[], documentType: string) => Promise<string[]>
  getDocumentStatus: (documentId: string) => Promise<DocumentStatus>
  reprocessDocument: (documentId: string) => Promise<void>
  deleteDocument: (documentId: string) => Promise<void>
  refreshDocuments: () => Promise<void>
}
```

**Uso:**
```typescript
import { useIDP } from '@hooks/useIDP'

const { 
  documents, 
  isUploading, 
  uploadProgress,
  uploadDocument,
  deleteDocument 
} = useIDP()

const handleUpload = async (file: File) => {
  try {
    const docId = await uploadDocument(file, 'factura')
    console.log('Documento procesado:', docId)
  } catch (error) {
    console.error('Error al procesar:', error)
  }
}
```

### Servicios (`frontend/src/services/idp.service.ts`)

**Propósito:** Comunicación con API backend de IDP.

**Métodos:**
```typescript
// Upload de documento individual
async function uploadDocument(
  file: File, 
  documentType: string,
  metadata?: Record<string, any>
): Promise<DocumentProcessingResponse> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('document_type', documentType)
  if (metadata) {
    formData.append('metadata', JSON.stringify(metadata))
  }
  
  return api.post('/v1/idp/process', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// Batch processing
async function batchUpload(
  files: File[], 
  documentType: string
): Promise<BatchProcessResponse> {
  // Subir archivos en paralelo
  const promises = files.map(file => uploadDocument(file, documentType))
  const results = await Promise.all(promises)
  return { batch_id: 'batch_123', total_documents: results.length, ... }
}

// Obtener estado
async function getDocumentStatus(documentId: string): Promise<DocumentStatus> {
  return api.get(`/v1/idp/${documentId}`)
}

// Re-procesar
async function reprocessDocument(documentId: string): Promise<void> {
  return api.post(`/v1/idp/${documentId}/reprocess`)
}

// Eliminar
async function deleteDocument(documentId: string): Promise<void> {
  return api.delete(`/v1/idp/${documentId}`)
}
```

### Store (`frontend/src/store/idp.store.ts`)

**Propósito:** Gestión de estado global de IDP con Zustand.

**Estado:**
```typescript
interface IDPStore {
  // Estado
  documents: Document[]
  selectedDocument: Document | null
  isLoading: boolean
  isUploading: boolean
  uploadProgress: number
  error: string | null
  
  // Filtros
  filters: {
    documentType: string
    status: string
    dateRange: [Date, Date]
  }
  
  // Acciones
  actions: {
    setDocuments: (docs: Document[]) => void
    addDocument: (doc: Document) => void
    updateDocument: (id: string, updates: Partial<Document>) => void
    deleteDocument: (id: string) => void
    setSelectedDocument: (doc: Document | null) => void
    setLoading: (loading: boolean) => void
    setUploading: (uploading: boolean) => void
    setUploadProgress: (progress: number) => void
    setError: (error: string | null) => void
    setFilters: (filters: Partial<Filters>) => void
    clearFilters: () => void
  }
}
```

**Uso:**
```typescript
import { useIDPStore } from '@store/idp.store'

const { documents, addDocument, setLoading } = useIDPStore()

// Agregar documento procesado
addDocument({
  id: 'doc_123',
  document_type: 'factura',
  status: 'completed',
  extracted_data: { total: 1160.00 },
  confidence_score: 0.95,
  created_at: new Date()
})
```

---

## Integración Backend ↔ Frontend

### Flujo de Upload de Documento

```
Documents.tsx (upload button)
  → useIDP.uploadDocument()
  → idp.service.uploadDocument()
  → POST /v1/idp/process (FormData)
  → idp.py (endpoint)
  → save_uploaded_file()
  → NIMExtractionService.extract_text_from_pdf()
  → NVIDIA NemoRetriever OCR
  → NIMExtractionService.extract_entities()
  → NVIDIA Llama 3.2 90B Vision
  → validar_rfc_sat()
  → calculate_confidence_score()
  → Document model (save to DB)
  → rag_service.ingest_document()
  → ChromaDB collection
  → Response
  → idp.service response
  → useIDP hook update
  → IDPStore.addDocument()
  → Documents.tsx re-render
```

---

## Casos de Uso

### 1. Procesar Factura Individual

**Backend:**
```python
from app.services.nvidia_nim import NIMExtractionService
from app.core.validators import validar_rfc_sat

# 1. Extraer texto con OCR
extraction_service = NIMExtractionService()
text = extraction_service.extract_text_from_pdf("factura.pdf")

# 2. Extraer entidades con Vision LLM
entities = extraction_service.extract_entities_from_text(text)

# 3. Validar RFC
es_valido, error = validar_rfc_sat(entities['rfc_emisor'])

# 4. Calcular confianza
confidence = calculate_confidence_score(entities)

# 5. Guardar en DB
doc = Document(
    user_id=1,
    document_type="factura",
    file_path="uploads/factura_abc123.pdf",
    extracted_data=entities,
    confidence_score=confidence,
    status="completed"
)
db.add(doc)
db.commit()
```

**Frontend:**
```typescript
const { uploadDocument } = useIDP()

const handleFileSelect = async (file: File) => {
  try {
    setLoading(true)
    const result = await uploadDocument(file, 'factura')
    
    console.log('Documento procesado:', result.document_id)
    console.log('Datos extraídos:', result.extracted_data)
    console.log('Confianza:', result.confidence_score)
    
    // Mostrar notificación
    toast.success('Factura procesada exitosamente')
  } catch (error) {
    console.error('Error:', error)
    toast.error('Error al procesar la factura')
  } finally {
    setLoading(false)
  }
}
```

### 2. Procesamiento Masivo (Batch)

**Backend:**
```python
from app.services.nvidia_nim import process_batch_async

# Procesar 100 documentos en paralelo con 4 workers
results = await process_batch_async(
    documents=document_list,
    max_workers=4,
    document_type="factura"
)

print(f"Procesados: {results['processed']}")
print(f"Fallidos: {results['failed']}")
print(f"Tiempo total: {results['total_time']}s")
```

**Frontend:**
```typescript
const { batchUpload } = useIDP()

const handleBatchUpload = async (files: File[]) => {
  try {
    setUploading(true)
    const result = await batchUpload(files, 'factura')
    
    console.log('Batch completado:', result.batch_id)
    console.log('Total documentos:', result.total_documents)
    
    toast.success(`${result.total_documents} facturas procesadas`)
  } catch (error) {
    console.error('Error en batch:', error)
    toast.error('Error al procesar lote de facturas')
  } finally {
    setUploading(false)
  }
}
```

---

## Setup y Configuración

### Backend

```bash
# 1. Instalar dependencias
cd backend
pip install -r requirements.txt

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con NVIDIA_API_KEY

# 3. Iniciar servicios Docker
docker compose up -d db chromadb

# 4. Inicializar base de datos
python -c "from app.db.database import init_db; init_db()"

# 5. Iniciar backend
uvicorn app.main:app --reload
```

### Frontend

```bash
# 1. Instalar dependencias
cd frontend
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con VITE_BACKEND_URL

# 3. Iniciar frontend
npm run dev
```

---

## Variables de Entorno

### Backend (`.env`)

```bash
# NVIDIA API
NVIDIA_API_KEY=nvapi-...
NVIDIA_NIM_BASE_URL=https://ai.api.nvidia.com/v1/cv
VISION_MODEL=meta/llama-3.2-90b-vision-instruct

# Processing limits
MAX_WORKERS=4
RATE_LIMIT=40  # requests per minute
REQUEST_TIMEOUT=120  # seconds
MAX_FILE_SIZE=10485760  # 10 MB

# File storage
UPLOAD_DIR=uploads
DATASET_PDF_PATH=dataset/pdf
DATASET_XML_PATH=dataset/xml
```

### Frontend (`.env`)

```bash
# Backend URL
VITE_BACKEND_URL=http://localhost:8000

# Upload limits
VITE_MAX_FILE_SIZE=10485760  # 10 MB
VITE_MAX_BATCH_SIZE=20  # documentos
```

---

## Troubleshooting

### Error: NVIDIA API Rate Limit Exceeded

**Síntomas:**
- HTTP 429 Too Many Requests
- `Rate limit exceeded` en logs

**Solución:**
```python
# El servicio maneja retry automático con exponential backoff
# Si persiste:
# 1. Verificar tier de API key (Develop: 40 RPM, Production: 100+ RPM)
# 2. Reducir MAX_WORKERS en .env
# 3. Implementar queue de procesamiento
```

### Error: OCR Falla con PDF Grande

**Síntomas:**
- Timeout después de 120 segundos
- PDFs de más de 50 páginas fallan

**Solución:**
```bash
# 1. Aumentar REQUEST_TIMEOUT en .env
REQUEST_TIMEOUT=300

# 2. Dividir PDF en chunks
# Usar PyPDF2 para separar páginas
from PyPDF2 import PdfReader, PdfWriter

reader = PdfReader("grande.pdf")
for i, page in enumerate(reader.pages):
    writer = PdfWriter()
    writer.add_page(page)
    with open(f"page_{i}.pdf", "wb") as f:
        writer.write(f)
```

### Error: RFC Inválido

**Síntomas:**
- `validar_rfc_sat()` retorna False
- Documento marcado como "failed"

**Solución:**
```python
# Verificar formato de RFC
from app.core.validators import validar_rfc_sat

rfc = "ABC123456DEF"
es_valido, error = validar_rfc_sat(rfc)

if not es_valido:
    print(f"Error: {error}")
    # Posibles errores:
    # - Longitud incorrecta
    # - Caracteres inválidos
    # - Fecha inválida
    # - Homoclave incorrecta
```

### Error: Upload Falla en Frontend

**Síntomas:**
- Progress bar se queda en 0%
- Error de red en consola

**Solución:**
```typescript
// 1. Verificar backend está corriendo
fetch('http://localhost:8000/health')
  .then(res => res.json())
  .then(data => console.log('Backend:', data))

// 2. Verificar CORS en backend
# backend/app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Métricas y Performance

| Métrica | Objetivo | Actual |
|---------|----------|--------|
| Latencia OCR (1 página) | <3s | ~2.5s |
| Latencia Vision LLM | <5s | ~4.0s |
| Latencia Total (documento) | <10s | ~8.5s |
| Precisión Extracción RFC | >98% | ~98.5% |
| Precisión Extracción UUID | >98% | ~99.0% |
| Precisión Extracción Total | >95% | ~96.0% |
| Throughput (batch) | 10 docs/min | ~12 docs/min |

---

## Mejores Prácticas

### Backend

```python
# ✅ BUENO - Usar batch processing para múltiples documentos
documents = [...]  # Lista de documentos
results = await process_batch_async(documents, max_workers=4)

# ❌ MALO - Procesar uno por uno secuencialmente
for doc in documents:
    result = process_document(doc)  # Lento
```

```python
# ✅ BUENO - Validar RFC antes de guardar
es_valido, error = validar_rfc_sat(rfc_emisor)
if es_valido:
    doc = Document(...)
    db.add(doc)
else:
    raise ValueError(f"RFC inválido: {error}")

# ❌ MALO - Guardar sin validar
doc = Document(extracted_data={"rfc": rfc_emisor})  # Puede ser inválido
db.add(doc)
```

```python
# ✅ BUENO - Manejar errores de API externa
try:
    entities = extraction_service.extract_entities(image_path)
except RateLimitExceeded:
    logger.warning("Rate limit excedido, reintentando en 60s")
    time.sleep(60)
    entities = extraction_service.extract_entities(image_path)
except Exception as e:
    logger.error(f"Error en extracción: {e}")
    raise

# ❌ MALO - Sin manejo de errores
entities = extraction_service.extract_entities(image_path)  # Puede fallar
```

### Frontend

```typescript
// ✅ BUENO - Mostrar progress real durante upload
const handleUpload = async (file: File) => {
  try {
    setUploading(true)
    const result = await uploadDocument(file, 'factura', {
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
        setUploadProgress(progress)
      }
    })
    toast.success('Documento procesado')
  } catch (error) {
    toast.error('Error al procesar')
  } finally {
    setUploading(false)
  }
}

// ❌ MALO - Sin feedback de progreso
const handleUpload = async (file: File) => {
  const result = await uploadDocument(file, 'factura')  // Sin onUploadProgress
  // Usuario no sabe el estado
}
```

```typescript
// ✅ BUENO - Optimistic update para mejor UX
const handleDelete = async (docId: string) => {
  // Actualizar UI inmediatamente
  updateDocument(docId, { status: 'deleting' })
  
  try {
    await deleteDocument(docId)
    // Remover después de confirmar
    removeDocument(docId)
    toast.success('Documento eliminado')
  } catch (error) {
    // Revertir si falla
    updateDocument(docId, { status: 'completed' })
    toast.error('Error al eliminar')
  }
}

// ❌ MALO - Esperar respuesta antes de actualizar UI
const handleDelete = async (docId: string) => {
  await deleteDocument(docId)  // Usuario espera sin feedback
  refreshDocuments()  // Recargar todo
}
```

---

## Futuras Mejoras

- [ ] **PDF Chunking** - Dividir PDFs grandes en chunks para procesamiento paralelo
- [ ] **Table Extraction** - Extraer tablas estructuradas con NVIDIA NIM Table Structure
- [ ] **Multi-language OCR** - Soporte para OCR en inglés además de español
- [ ] **Document Classification** - Clasificación automática del tipo de documento con IA
- [ ] **Batch Progress Tracking** - WebSocket para progreso en tiempo real de batch processing
- [ ] **Document Versioning** - Mantener versiones de documentos re-procesados
- [ ] **Annotation UI** - Permitir corrección manual de datos extraídos
- [ ] **Export to Excel** - Exportar datos extraídos a CSV/Excel

---

## Referencias

- [NVIDIA NIM OCR Documentation](https://build.nvidia.com/nvidia/nemoretriever-ocr-v1)
- [NVIDIA NIM Vision](https://build.nvidia.com/meta/llama-3.2-90b-vision-instruct)
- [CFDI 4.0 Specification](https://www.sat.gob.mx/consultas/12616/conoce-las-especificaciones-de-la-factura-electronica-cfdi-4.0)
- [Validación de RFC](https://www.sat.gob.mx/aplicacion/operacion/31774/realiza-tu-operacion-de-identificacion-de-rc)
- [FastAPI File Uploads](https://fastapi.tiangolo.com/tutorial/request-files/)
- [ChromaDB Documentation](https://docs.trychroma.com/)

---

*Documento generado: 2026-03-10*  
*Versión: 1.0.0*  
*Archivos clave: `app/api/idp.py`, `app/services/nvidia_nim.py`, `app/core/validators.py`, `frontend/src/components/Documents.tsx`, `frontend/src/hooks/useIDP.ts`*
