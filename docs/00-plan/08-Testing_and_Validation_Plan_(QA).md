# Documento 8: Plan de Pruebas y Validación (QA) - IA-First

Este documento define los protocolos de verificación para asegurar que los modelos de NVIDIA NIM, el orquestador LangGraph y la lógica contable operen con una precisión superior al **98%**.

## 1. Niveles de Prueba y Estrategia

El sistema se validará bajo una pirámide de pruebas adaptada a la inteligencia artificial:

| **Nivel de Prueba**  | **Enfoque**                                         | **Herramienta**                     |
| -------------------- | --------------------------------------------------- | ----------------------------------- |
| **Unit Testing**     | Lógica de cálculo (IVA, ISR, Retenciones).          | Pytest (Backend) / Jest (Frontend). |
| **AI Validation**    | Precisión de extracción OCR y RAG.                  | RAGAS / LangSmith.                  |
| **Integration**      | Comunicación FastAPI <-> NIM <-> PostgreSQL.        | Docker Compose / Postman.           |
| **E2E Testing**      | Flujo completo: Carga de factura -> Respuesta chat. | Playwright.                         |
| **Security/PenTest** | Aislamiento de tenants (Multi-tenancy check).       | OWASP ZAP.                          |

------

## 2. Protocolo de Validación para Módulos de IA

### A. Módulo 1 (IDP - OCR): Prueba de Veracidad Documental

Se utilizará un "Golden Dataset" de 200 CFDI reales (XML y PDF) para medir:

- **Fuerza de Extracción:** Comparar el JSON extraído por el NIM contra el XML oficial del SAT.
- **Métrica de Éxito:** Character Error Rate (CER) < 1% en campos críticos (RFC, Monto Total, UUID).

### B. Módulo 4 (RAG - Legal): Evaluación de Alucinaciones

Para evitar que el asistente invente leyes fiscales, se aplicarán pruebas de **Fidelidad (Faithfulness)**:

- **Context Recall:** ¿La respuesta contiene la información exacta que estaba en el fragmento de la LISR recuperado?
- **Answer Relevancy:** ¿La respuesta soluciona la duda del contador sin desviarse del tema?
- **Métrica de Éxito:** Score de RAGAS > 0.90.

------

## 3. Escenarios de Prueba Críticos (Test Cases)

| **ID**    | **Escenario**                                 | **Resultado Esperado**                                       |
| --------- | --------------------------------------------- | ------------------------------------------------------------ |
| **TC-01** | Carga de ticket de gasolina arrugado/borroso. | El NIM OCR debe recuperar el RFC del emisor y el total con >90% de confianza. |
| **TC-02** | Consulta: "¿Cómo deduzco un coche en 2024?".  | El Reranker debe priorizar el Art. 36 de la LISR y mencionar el límite de $175,000 MXN. |
| **TC-03** | Intento de acceso cruzado entre clientes.     | El sistema debe rechazar la consulta si el `tenant_id` no coincide con el dueño del documento. |
| **TC-04** | Conciliación de pago parcial.                 | El motor de matching debe marcar el XML como "Pagado Parcialmente" y alertar del saldo pendiente. |

------

## 4. Pruebas de Carga y Rendimiento (Performance)

Dado que se consumen microservicios de NVIDIA NIM, debemos monitorear la latencia:

1. **Latencia del Chat:** El primer token (TTFT) debe entregarse en menos de **800ms**.
2. **Procesamiento IDP:** Un PDF de 3 páginas no debe tardar más de **5 segundos** en ser procesado y guardado.
3. **Concurrencia:** El sistema debe soportar 20 peticiones simultáneas de OCR sin degradar la respuesta del chat.

------

## 5. Ciclo de Vida de Validación (CI/CD)

Cada vez que el *Coding Agent* realice un cambio en el código, se ejecutará el siguiente flujo automatizado:

Fragmento de código

```
graph LR
    Code[Push de Código] --> Lint[Linting & Static Analysis]
    Lint --> Unit[Unit Tests: Lógica Fiscal]
    Unit --> Integration[Integration: DB & API]
    Integration --> AI_Check[AI Validation: RAGAS Score]
    AI_Check -- "Score > 0.9" --> Deploy[Deploy a Staging]
    AI_Check -- "Score < 0.9" --> Fail[Rechazar Cambio]
```

------

## 6. Validación de Cumplimiento (Compliance SAT)

Se incluirá un paso de validación final por un contador certificado (Human-in-the-loop) para los siguientes puntos:

1. **Cálculos de Impuestos:** Verificar que el redondeo de decimales cumpla con el estándar del SAT.
2. **Reportes:** Asegurar que los estados financieros generados sigan las NIF (Normas de Información Financiera).

------

### Resumen Final de Documentación de Arranque

Con este documento, hemos completado el set maestro:

1. **Blueprint de Arquitectura:** La visión técnica.
2. **7 Módulos de IA:** La lógica de negocio.
3. **Diagramas de Arquitectura:** El mapa de servicios.
4. **Pipeline RAG:** El motor de conocimiento.
5. **Conciliación y Agentes:** La automatización operativa.
6. **Plan de QA:** La garantía de calidad.

---