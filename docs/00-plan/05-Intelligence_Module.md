# Documento 5: Módulo de Conciliación e Inteligencia Financiera

Este módulo es el puente entre los movimientos de efectivo (Bancos) y el soporte legal (Facturas). Su objetivo es automatizar la actividad #31 (Tesorería) y #2 (Estados Financieros).

## 1. El Motor de Matching (Lógica Difusa + LLM)

A diferencia de los sistemas tradicionales que solo comparan montos exactos, este motor utiliza un enfoque de tres capas:

1. **Capa Heurística (Exact Match):** Compara `Monto`, `Fecha` (ventana de +/- 3 días) y `RFC`.
2. **Capa de Lógica Difusa (Fuzzy Match):** Utiliza algoritmos de distancia de Levenshtein para comparar nombres de proveedores (ej. "AMAZON MEXICO" vs "AMZN MKTPLACE").
3. **Capa de Validación LLM (NVIDIA NIM):** Si las capas anteriores tienen una confianza < 85%, el agente envía el concepto del banco y los datos de las facturas candidatas a `Llama-3.3-70B` para que determine si corresponden al mismo evento económico.

## 2. Detección de Anomalías y Faltantes

El sistema no solo concilia lo que existe, sino que reporta proactivamente lo que falta:

- **Facturas sin Pago:** Listado de CFDI de egresos que no tienen un movimiento bancario asociado (posibles deudas).
- **Pagos sin Factura:** Movimientos bancarios que no tienen un XML asociado (riesgo de no deducibilidad).
- **Duplicidad:** Detección de pagos dobles a proveedores basados en el análisis de patrones históricos.

## 3. Clasificación Automática de Flujo de Caja

Cada movimiento conciliado se etiqueta automáticamente en categorías de flujo:

- *Operativo:* Nóminas, proveedores de materia prima.
- *Inversión:* Compra de activos fijos.
- *Financiamiento:* Pago de préstamos, intereses.

------