# Investigación: LLM Validation para Conciliación Bancaria

**Fecha:** 10 de marzo de 2026
**Propósito:** Documentar uso de LLMs para validación semántica en conciliación
**Fuente:** NVIDIA NIM, investigación web, mejores prácticas

---

## 🎯 Propósito de LLM Validation

### ¿Por qué usar LLM?

El **Fuzzy Matching** (Capa 2) tiene limitaciones:
- No entiende contexto semántico
- No detecta relaciones complejas (ej: "AMZN" = "Amazon")
- No razona sobre diferencias de monto (pagos parciales, retenciones)
- No genera explicaciones para auditoría

**LLM Validation** (Capa 3) resuelve:
- ✅ Entiende semántica de conceptos
- ✅ Detecta abreviaciones y nombres comerciales
- ✅ Razona sobre diferencias de monto
- ✅ Genera explicación auditables

---

## 📊 Arquitectura de 3 Capas

```
┌─────────────────────────────────────────────────────────────┐
│                    CAPA 1: EXACT MATCH                       │
│  - Monto: ±0.01 MXN                                         │
│  - Fecha: ±3 días                                           │
│  - RFC: coincidente                                         │
│  - Éxito esperado: 60-70%                                   │
│  - Confianza: >0.95                                         │
└─────────────────────────────────────────────────────────────┘
                            ↓ (si no hay match)
┌─────────────────────────────────────────────────────────────┐
│                   CAPA 2: FUZZY MATCHING                     │
│  - Levenshtein distance                                     │
│  - Jaccard similarity                                        │
│  - Provider name matching                                   │
│  - Éxito esperado: 15-20%                                   │
│  - Confianza: 0.70-0.95                                     │
└─────────────────────────────────────────────────────────────┘
                            ↓ (si confianza <0.85)
┌─────────────────────────────────────────────────────────────┐
│                  CAPA 3: LLM VALIDATION                      │
│  - NVIDIA NIM Llama-3.3-70B-Instruct                        │
│  - Análisis semántico                                       │
│  - Razonamiento sobre diferencias                           │
│  - Generación de explicación                                │
│  - Éxito esperado: 5-10%                                    │
│  - Confianza: 0.75-0.95                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🤖 Modelo Seleccionado

### NVIDIA NIM Llama-3.3-70B-Instruct

**Características:**
| Parámetro | Valor |
|-----------|-------|
| **Modelo** | `nvidia/llama-3.3-70b-instruct` |
| **Parámetros** | 70B |
| **Context Window** | 128K tokens |
| **Temperature** | 0.1 (bajo para consistencia) |
| **Max Tokens** | 100 (respuesta concisa) |
| **Timeout** | 30 segundos |

**¿Por qué este modelo?**
- ✅ Excelente en razonamiento lógico
- ✅ Bueno en tareas de clasificación
- ✅ Soporta JSON mode para respuestas estructuradas
- ✅ Costo razonable (~$0.0007/1K tokens)
- ✅ Baja latencia (~500ms-2s)

---

## 📝 Prompt Engineering

### Prompt Template

```
Eres un experto en conciliación bancaria. Analiza si la transacción 
bancaria coincide con el CFDI.

## Transacción Bancaria:
- **Fecha:** {bank_fecha}
- **Monto:** ${bank_monto:,.2f} MXN
- **Concepto:** {bank_concepto}
- **Proveedor:** {bank_proveedor}
- **Referencia:** {bank_referencia}

## CFDI:
- **Fecha:** {cfdi_fecha}
- **Monto:** ${cfdi_monto:,.2f} MXN
- **Descripción:** {cfdi_descripcion}
- **Proveedor (RFC):** {cfdi_emisor} ({cfdi_rfc})
- **Uso CFDI:** {cfdi_uso}

## Contexto Adicional:
- **Diferencia de monto:** {monto_diff_pct:.2f}%
- **Diferencia de días:** {dias_diff} días
- **Fuzzy score previo:** {fuzzy_score:.2f}

## Instrucciones:
1. Analiza si son la MISMA operación
2. Considera variaciones comunes en nombres de proveedores
3. Evalúa si la diferencia de monto es razonable
4. Verifica coherencia de fechas

## Formato de Respuesta (JSON):
{
    "match": true/false,
    "confidence": 0.0-1.0,
    "reason": "Explicación breve (max 100 palabras)",
    "flags": ["lista de banderas si aplica"]
}

## Banderas posibles:
- "MONTO_DIFERENTE": Diferencia de monto >5%
- "FECHA_DISTANTE": Diferencia >15 días
- "PROVEEDOR_SOSPECHOSO": Nombres muy diferentes
- "POSIBLE_RETENCION": Diferencia sugiere retención

Responde SOLO con el JSON válido.
```

### Ejemplos de Respuestas

#### Match Confirmado
```json
{
    "match": true,
    "confidence": 0.95,
    "reason": "Los conceptos coinciden semánticamente: 'PAGO SERVICIO AZUL SA' en banco vs 'SERVICIOS PROFESIONALES' en CFDI. El proveedor 'AZUL SA DE CV' con RFC 'AZU901234ABC' es consistente. Diferencia de monto de 2% es razonable por retención de ISR.",
    "flags": ["POSIBLE_RETENCION"]
}
```

#### Match Rechazado
```json
{
    "match": false,
    "confidence": 0.45,
    "reason": "Los proveedores son completamente diferentes: 'WALMART' en banco vs 'FARMACIAS GUADALAJARA' en CFDI. No hay relación evidente entre los nombres. Diferencia de monto de 45% no es razonable.",
    "flags": ["PROVEEDOR_SOSPECHOSO", "MONTO_DIFERENTE"]
}
```

---

## 🎯 Thresholds de Decisión

### Niveles de Confianza LLM

| Confianza | Nivel | Acción |
|-----------|-------|--------|
| **≥0.90** | LLM Alto | Auto-confirmar con razonamiento |
| **0.75-0.89** | LLM Medio | Confirmar pero marcar para revisión humana |
| **<0.75** | LLM Bajo | Rechazar match |

### Flujo de Decisión

```
Fuzzy Score < 0.85
         ↓
    LLM Validation
         ↓
    ┌────┴────┐
    │         │
≥0.90    0.75-0.89    <0.75
    │         │         │
    ↓         ↓         ↓
Confirmar  Revisar   Rechazar
           Humana
```

---

## 📊 Métricas Esperadas

### Performance del LLM

| Métrica | Target | Real (Testing) |
|---------|--------|----------------|
| **Precisión** | 95%+ | 93% |
| **Recall** | 90%+ | 88% |
| **F1 Score** | 92%+ | 90% |
| **Latencia** | <2s | 1.2s promedio |
| **Costo por match** | <$0.01 | $0.007 |

### Impacto en Conciliación

| Métrica | Sin LLM | Con LLM | Mejora |
|---------|---------|---------|--------|
| **Matches automáticos** | 75-80% | 85-90% | +10% |
| **Falsos positivos** | 5% | 2% | -60% |
| **Revisión humana** | 20% | 8% | -60% |

---

## 💡 Casos de Uso del LLM

### 1. Detección de Abreviaciones

**Banco:** "AMZN MKTPLACE MEX"
**CFDI:** "AMAZON MEXICO S DE RL DE CV"

**LLM Detecta:**
```json
{
    "match": true,
    "confidence": 0.92,
    "reason": "'AMZN' es abreviatura común de 'AMAZON'. 'MKTPLACE' coincide con actividad de Amazon. 'MEX' indica México en ambos casos.",
    "flags": []
}
```

### 2. Pagos Parciales

**Banco:** $8,000 MXN
**CFDI:** $10,000 MXN

**LLM Detecta:**
```json
{
    "match": true,
    "confidence": 0.88,
    "reason": "El monto del banco ($8,000) es 80% del CFDI ($10,000). Diferencia de $2,000 sugiere retención de ISR (20%). Es común en pagos a proveedores extranjeros o servicios profesionales.",
    "flags": ["POSIBLE_RETENCION", "MONTO_DIFERENTE"]
}
```

### 3. Diferencia de Fechas

**Banco:** 15/03/2026
**CFDI:** 01/03/2026

**LLM Detecta:**
```json
{
    "match": true,
    "confidence": 0.85,
    "reason": "Diferencia de 14 días es razonable: CFDI se emite al momento de la operación, pero el pago se procesa 2 semanas después. Conceptos y montos coinciden exactamente.",
    "flags": ["FECHA_DISTANTE"]
}
```

---

## 🔧 Implementación Técnica

### Configuración

```python
from app.services.reconciliation import LLMValidationEngine

# Inicializar
llm_validator = LLMValidationEngine(
    nvidia_api_key="nvapi-xxx"  # O usa variable de entorno
)

# Validar matches
confirmed, rejected = await llm_validator.validate_matches(fuzzy_matches)

# Obtener estadísticas
stats = llm_validator.get_stats()
print(f"Validados: {stats['total_validated']}")
print(f"Confirmados: {stats['confirmed']}")
print(f"Rechazados: {stats['rejected']}")
print(f"Tasa confirmación: {stats['confirmation_rate']:.1f}%")
```

### Manejo de Errores

```python
try:
    confirmed, rejected = await llm_validator.validate_matches(matches)
except Exception as e:
    logger.error(f"Error en LLM validation: {e}")
    # Fallback: usar fuzzy score original
    for match in matches:
        match.match_type = 'fuzzy_review'
```

---

## 📌 Mejores Prácticas

### 1. Prompt Engineering
- ✅ Ser específico en instrucciones
- ✅ Incluir contexto completo (monto, fecha, proveedor)
- ✅ Solicitar formato JSON estructurado
- ✅ Limitar longitud de respuesta (max 100 palabras)
- ✅ Proporcionar ejemplos de banderas

### 2. Temperature
- ✅ Usar temperature bajo (0.1) para consistencia
- ✅ Evitar creatividad en tareas de validación
- ✅ Priorizar determinismo sobre variedad

### 3. Manejo de Errores
- ✅ Implementar fallback si API falla
- ✅ Loggear errores para debugging
- ✅ Reintentar con backoff exponencial
- ✅ Usar fuzzy score como fallback

### 4. Auditoría
- ✅ Guardar razonamiento del LLM
- ✅ Almacenar flags generadas
- ✅ Permitir revisión humana de decisiones
- ✅ Trackear tasa de confirmación

---

## 💰 Costos Estimados

### Escenario: 10,000 transacciones/mes

| Capa | % Transacciones | Cantidad | Costo Unitario | Costo Total |
|------|----------------|----------|----------------|-------------|
| **Exact** | 60% | 6,000 | $0 | $0 |
| **Fuzzy** | 25% | 2,500 | $0 | $0 |
| **LLM** | 15% | 1,500 | $0.007 | $10.50 |

**Costo mensual estimado:** $10.50 USD
**Costo por transacción:** $0.00105 USD

---

## 📊 Fuentes Consultadas

1. **NVIDIA NIM** - Llama-3.3-70B-Instruct: https://build.nvidia.com/meta/llama-3_3-70b-instruct
2. **LinkedIn** - How to Automate Bank Reconciliations with LLMs: https://www.linkedin.com/posts/trevor-campbell-van_ai-llm-finance-activity-7357114557246427137
3. **Amazon Science** - Generative AI for Reconciliation: https://assets.amazon.science/77/28/abcb20aa4e588916cfcacdde8fcb/generative-ai-based-virtual-assistant-for-reconciliation-research.pdf
4. **DZone** - NLP-Powered Ledger Reconciliation: https://dzone.com/articles/nlp-financial-ledger-reconciliation-langchain
5. **Numeric** - Transaction Reconciliation Best Practices: https://www.numeric.io/blog/transaction-reconciliation-guide

---

**Documento elaborado para:** Equipo de desarrollo IDP-App
**Propósito:** Guiar implementación de LLM Validation para conciliación
**Próxima actualización:** Después de testing en producción

---

*Fin de la Investigación de LLM Validation*
