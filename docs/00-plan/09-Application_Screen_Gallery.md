### Galería de Pantallas de la Aplicación

#### 1. El "Workspace" Central (Dashboard y Chat)

Esta es la pantalla principal donde el contador pasa el 90% de su tiempo. Muestra el estado de salud fiscal del cliente (tenant) seleccionado y el chat central donde se ejecutan los comandos y workflows.

**Elementos Clave:**

- **A.** Selector de Cliente (Multi-tenant).
- **B.** Kpis Predictivos (Salud Fiscal, Forecasting de IVA).
- **C.** Chat Central con Streaming de tokens (SSE).
- **D.** Botón Multimodal (Subir XML/PDF o usar Voz con Pipecat).

![](C:\Users\DiegoGzz\Documents\Programas\My-Projects\CPP_APP\IDP-App\docs\00-plan\Gemini_Generated_Image_6hdkqp6hdkqp6hdk.png)

#### 2. Vista Contextual (Split Screen IDP)

Cuando el usuario sube un documento o solicita una revisión, la interfaz entra en modo "Contextual". El chat se comprime a la izquierda para dar espacio al visualizador del documento y al análisis de IA a la derecha.

**Elementos Clave:**

- **A.** Visualización del PDF de la factura.
- **B.** Resultado del JSON estructurado extraído por el NIM de NeMo Retriever.
- **C.** Auditoría de IA: Confidence score (precisión) y fundamento legal sugerido (Art. 27 LISR Fracc I).
- **D.** Botones de revisión humana (Correcto / Corregir).

![](C:\Users\DiegoGzz\Documents\Programas\My-Projects\CPP_APP\IDP-App\docs\00-plan\Gemini_Generated_Image_6hdkqp6hdkqp6hdk (1).png)



#### 3. Vista de Agentes y Workflows

Cuando el contador inicia un proceso complejo, como la **"Declaración Anual de ISR"**, la interfaz cambia para mostrar el estado de la orquestación. Esta pantalla visualiza la lógica de LangGraph y los Agentes Autónomos del Documento 6.

**Elementos Clave:**

- **A.** Mapa visual del Grafo de Estados (LangGraph).
- **B.** Lista de Agentes Especializados (Agente de Nómina, Agente RAG, Agente SAT) y su estado actual.
- **C.** Indicador de "Pausa / HITL (Human-in-the-loop)".
- **D.** Botón de "Confirmar Borrador para SAT".



![](C:\Users\DiegoGzz\Documents\Programas\My-Projects\CPP_APP\IDP-App\docs\00-plan\Gemini_Generated_Image_6hdkqp6hdkqp6hdk (2).png)



#### 4. Vista RAG (Búsqueda Semántica Legal)

Cuando el contador hace una pregunta técnica compleja sobre la ley, el chat activa el pipeline RAG detallado en el Documento 4. Esta pantalla visualiza el proceso de "Fidelidad" y "Citas" para evitar alucinaciones legales.

**Elementos Clave:**

- **A.** Pregunta Técnica del Contador.
- **B.** Respuesta del LLM con **Citas en Línea** (hitos numéricos `[1]`, `[2]`).
- **C.** Panel de fuentes de la ley (LISR/CFF) con el puntaje de relevancia (Reranker v3 Score).
- **D.** Panel lateral para ver el Art. 28 completo sin salir del chat.



![](C:\Users\DiegoGzz\Documents\Programas\My-Projects\CPP_APP\IDP-App\docs\00-plan\Gemini_Generated_Image_6hdkqp6hdkqp6hdk (3).png)



------

### Siguientes Pasos (Sujeto a tu confirmación)

Con esta galería visual, el *Coding Agent* tiene una referencia clara de cómo renderizar los componentes frontend y cómo conectar los estados del backend (FastAPI/LangGraph) a la UI (React).

Dime por dónde quieres que empecemos a generar el código fuente:

1. **Backend Core:** FastAPI con Docker y los modelos de NVIDIA NIM (IDP OCR).
2. **Base de Datos:** Esquema PostgreSQL para Multi-tenant y la tabla `documents` (IDP).
3. **Frontend Chat:** Estructura inicial de React con Streaming (SSE) y componentes de chat central.