# Documento 7: Dashboard Predictivo y Salud Fiscal

Este módulo transforma los datos históricos en visión estratégica.

## 1. Forecasting de Impuestos (Módulo 5)

Utilizando modelos de regresión y análisis de estacionalidad, el sistema proyecta:

- **IVA por Pagar:** Basado en facturas emitidas vs. recibidas al día 20 del mes.
- **ISR Estimado:** Proyección anual basada en el coeficiente de utilidad histórico.

## 2. Semáforo de Riesgo Fiscal (Tax Health)

Un panel visual que califica al contribuyente en 3 áreas:

1. **Riesgo EFO:** ¿Alguno de mis proveedores entró en la lista negra del SAT (Art. 69-B)?
2. **Opinión de Cumplimiento:** Monitoreo constante del estado "Positivo" ante el SAT.
3. **Discrepancia Fiscal:** Diferencia entre los ingresos declarados y los depósitos bancarios detectados.

------

### Resumen de la Estructura de Archivos para el Coding Agent

Con estos 7 documentos, el agente puede generar la siguiente estructura de servicios:

Plaintext

```
/services
  /conciliacion
    - matching_engine.py      # Lógica de capas (Fuzzy/LLM)
    - anomaly_detector.py     # Detección de faltantes
  /agentes
    - graph_orchestrator.py   # Definición de estados LangGraph
    - sat_automated_tasks.py  # Automatización de scraping/download
    - notification_service.py # Comunicación externa
  /predictivo
    - tax_forecaster.py       # Modelos de proyección
    - risk_analyzer.py        # Auditoría preventiva (69-B)
```