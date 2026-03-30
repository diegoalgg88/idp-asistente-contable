# Documento 2: Especificación Detallada de los 7 Módulos de IA

Este documento define la inteligencia operativa del **Asistente Contable**. Cada módulo está diseñado para atacar una vertical específica de las 32 actividades del contador público en México, utilizando el estado del arte en microservicios de **NVIDIA**.

## Módulo 1: IDP (Procesamiento Inteligente de Documentos)

**Propósito:** Convertir datos no estructurados (PDFs, fotos de tickets, estados de cuenta escaneados) en datos contables estructurados y validados ante el SAT.

- **Actividades Relacionadas:** #1 (Registro de operaciones), #3 (Contabilidad electrónica), #9 (Emisión/Recepción de CFDI).
- **Stack Tecnológico:**
  - **NVIDIA NeMo Retriever OCR v1:** Para detección de texto y preservación de tablas financieras.
  - **NIM para Table Extraction:** Especializado en extraer columnas de subtotal, IVA y retenciones.
  - **Validador CFDI 4.0:** Motor local para cotejar el UUID con el webservice del SAT.
- **Lógica de Clasificación:** El sistema utiliza un modelo de destilación (distilled model) para categorizar el gasto en 15 familias (Viáticos, Honorarios, Arrendamientos, etc.) y sugerir la clave `ClaveProdServ` correspondiente.

------

## Módulo 2: Conciliación Inteligente (Matching Engine)

**Propósito:** Emparejar automáticamente los movimientos bancarios (Estados de Cuenta) con las facturas (XML/PDF) procesadas en el Módulo 1.

- **Actividades Relacionadas:** #2 (Estados financieros), #31 (Tesorería).
- **Mecánica de IA:**
  - **Fuzzy Logic + ML:** No solo busca montos exactos, sino que utiliza modelos de lenguaje para entender que un cargo en el banco como "PAGO-SERV-AMAZ-MEX" corresponde a una factura del proveedor "Amazon Mexico Services, S. de R.L.".
  - **Detección de Anomalías:** Identifica cargos bancarios sin factura de soporte y genera una alerta automática en el chat para el usuario.

------

## Módulo 3: Workflows de Negocio (Gestión de Procesos)

**Propósito:** Orquestar secuencias de tareas complejas que requieren múltiples pasos y estados (Cierres Mensuales, Declaraciones Provisionales).

- **Tecnología:** **LangGraph (Stateful Agents).**
- **Funcionamiento:** En lugar de ser un script lineal, el flujo es un grafo donde cada nodo es una tarea (ej. "Validar nómina", "Calcular retenciones"). Si una tarea falla o requiere información adicional, el grafo se detiene, solicita el dato al contador vía chat y reanuda el proceso manteniendo el estado.

------

## Módulo 4: Asistente Conversacional (RAG Especializado)

**Propósito:** Responder consultas técnicas sobre leyes fiscales mexicanas y sobre la propia situación financiera del cliente.

- **Stack Tecnológico:**
  - **Embedding:** `nvidia/nv-embedqa-e5-v5` para indexar la LISR, el CFF y la Resolución Miscelánea Fiscal.
  - **Reranker:** `nvidia/nv-rerankqa-mistral-4b-v3` para asegurar que la respuesta legal sea la más relevante.
- **Modo Dual:** El asistente puede responder "En general, ¿qué es deducible para una persona física?" (Modo Legal) o "¿Cuánto gastamos en papelería el mes pasado?" (Modo Datos).

------

## Módulo 5: Análisis Predictivo y Alertas

**Propósito:** Anticiparse a problemas de flujo de caja y detectar riesgos fiscales antes de que el SAT emita un requerimiento.

- **Modelos:** Integración de series de tiempo (Prophet/LightGBM) procesadas por el LLM para interpretación.
- **Funcionalidades:**
  - **Forecasting de IVA/ISR:** Proyectar cuánto se pagará de impuestos al final del mes basándose en la tendencia de facturación actual.
  - **Tax Health Score:** Un semáforo de riesgo basado en el comportamiento de los proveedores (EFOs/EDOs).

------

## Módulo 6: Agentes Autónomos (Action Agents)

**Propósito:** Ejecutar acciones en sistemas externos. Es el nivel más alto de autonomía.

- **Capacidades:**
  - **Agente Fiscal:** Entrar al portal del SAT (vía herramientas de automatización de navegador) para descargar masivamente XMLs.
  - **Agente de Notificación:** Redactar y enviar correos electrónicos a los clientes solicitando facturas faltantes basándose en los hallazgos del Módulo 2.
- **Control:** Requiere "Human-in-the-loop" para autorizar el envío final de información sensible.

------

## Módulo 7: Arquitectura Flexible y Multi-tenant

**Propósito:** Permitir que un despacho contable gestione cientos de empresas (tenants) con aislamiento total de datos.

- **Seguridad:**
  - Aislamiento de Vectores (Namespacing en ChromaDB) para que el RAG de la "Empresa A" nunca vea documentos de la "Empresa B".
  - Gestión de permisos basada en roles (Socio, Contador, Auxiliar, Cliente).

------

### Resumen de Interconexión

| **Módulo**          | **Entrada (Input)**    | **Salida (Output)**  | **Dependencia**      |
| ------------------- | ---------------------- | -------------------- | -------------------- |
| **1. IDP**          | Documento Raw          | JSON Estructurado    | Ninguna              |
| **2. Conciliación** | Banco + JSON IDP       | Matching Table       | Módulo 1             |
| **3. Workflows**    | Instrucción de Proceso | Estado de Proyecto   | Módulos 1, 2, 4      |
| **4. RAG**          | Consulta de Usuario    | Respuesta Técnica    | Módulo 1, 5          |
| **5. Predictivo**   | Histórico SQL          | Reporte de Tendencia | Módulo 2             |
| **6. Agentes**      | Objetivo de Tarea      | Acción Ejecutada     | Todos los anteriores |

------