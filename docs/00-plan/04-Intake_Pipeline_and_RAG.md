# Documento 4: Pipeline de Ingesta y RAG (Leyes Fiscales)

Este documento detalla el flujo de **Generación Aumentada por Recuperación (RAG)**. El objetivo es que el asistente no "alucine" leyes, sino que recupere el fragmento exacto de la LISR, CFF o RMF y lo utilice para fundamentar sus respuestas.

## 1. Fuentes de Datos (Knowledge Base)

El sistema debe ingerir y mantener actualizadas las siguientes fuentes primarias:

- **LISR:** Ley del Impuesto sobre la Renta.
- **LIVA:** Ley del Impuesto al Valor Agregado.
- **CFF:** Código Fiscal de la Federación.
- **RMF:** Resolución Miscelánea Fiscal (Actualización anual/trimestral).
- **Anexos del SAT:** Guías de llenado de CFDI 4.0.

## 2. Arquitectura del Pipeline de Ingesta

El proceso de transformación de PDF legal a vectores se divide en 4 etapas críticas:

### A. Limpieza y Normalización (ETL)

No se puede indexar un PDF "tal cual". El sistema debe:

1. **Eliminar ruido:** Encabezados de página, pies de página repetitivos y números de página.
2. **Preservar estructura:** Identificar Títulos, Capítulos, Artículos y Fracciones como metadatos asociados al texto.

### B. Estrategia de Chunking (Fragmentación Semántica)

A diferencia de un chunking por caracteres, usaremos **Recursive Character Text Splitter** optimizado para leyes:

- **Tamaño del Chunk:** 800 - 1000 tokens.
- **Overlap (Traslape):** 150 tokens para no perder el contexto entre el final de un artículo y el inicio del siguiente.
- **Metadatos por Chunk:** `{ "ley": "LISR", "articulo": "27", "fraccion": "I", "vigencia": "2024" }`.

### C. Generación de Embeddings (NVIDIA NIM)

Utilizaremos el modelo `nvidia/nv-embedqa-e5-v5`.

- **Por qué:** Es líder en el benchmark MTEB para recuperación de información. Convierte el texto legal en un vector de 1024 dimensiones que captura el *significado* de la norma, no solo las palabras clave.

------

## 3. Flujo de Recuperación (Retrieval Logic)

Cuando el contador hace una pregunta como: *¿Cuáles son los requisitos para deducir gastos de viaje?*, el sistema ejecuta estos pasos:

1. **Reescritura de Consulta (Query Expansion):** El LLM traduce la duda del usuario a términos legales (ej. "viáticos", "gastos de representación", "artículo 28 LISR").
2. **Búsqueda Vectorial (ChromaDB):** Recupera los 20 fragmentos más similares semánticamente.
3. **Reranking (NIM Reranker v3):** * Se envían esos 20 fragmentos al modelo `nvidia/nv-rerankqa-mistral-4b-v3`.
   - El Reranker reordena los resultados por relevancia técnica real, devolviendo solo los **Top 5**. Esto elimina el "ruido" de artículos similares pero irrelevantes.
4. **Generación de Respuesta con Citas:** El LLM final redacta la respuesta usando solo esos 5 fragmentos y añade citas obligatorias (ej. "Según el Art. 28 de la LISR...").

------

## 4. Diseño del Almacenamiento Vectorial (ChromaDB)

Para soportar multi-tenancy y seguridad, el índice se organiza de la siguiente manera:

- **Collection `normativa_fiscal` (Global):** Solo lectura para todos los usuarios. Contiene las leyes federales.
- **Collection `tenant_documents_{id}` (Privada):** Contiene los vectores de los documentos propios del cliente (facturas, contratos).
- **Aislamiento:** El orquestador de LangGraph garantiza que un usuario de la "Empresa A" nunca pueda consultar la colección de la "Empresa B".

------

## 5. Mantenimiento y Actualización (Auto-Update)

Dado que la ley fiscal en México cambia frecuentemente, se implementará un **Watcher de Normativa**:

1. Un script programado (Cron Job) revisa el Diario Oficial de la Federación (DOF).
2. Si detecta cambios en palabras clave (ISR, IVA), dispara una alerta al admin.
3. El admin autoriza la re-ingesta del documento modificado, actualizando solo los chunks que pertenecen a la ley cambiada.

------

### Resumen Técnico para el Coding Agent

| **Componente**                | **Implementación**                     |
| ----------------------------- | -------------------------------------- |
| **Vector DB**                 | ChromaDB (persistido en Docker volume) |
| **Embedding Model**           | `nvidia/nv-embedqa-e5-v5`              |
| **Reranker Model**            | `nvidia/nv-rerankqa-mistral-4b-v3`     |
| **Top K Inicial**             | 20 chunks                              |
| **Top K Final (Post-Rerank)** | 5 chunks                               |
| **Metadatos**                 | RFC, Tipo de Ley, Art., Año            |

------