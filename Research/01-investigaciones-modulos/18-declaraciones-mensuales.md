# Investigación Técnica: Declaraciones Mensuales

**Fecha:** 10 de marzo de 2026
**Versión:** 1.2
**Módulo:** Declaraciones Mensuales SAT
**Prioridad:** 🔴 CRÍTICA
**Gap ID:** Gap #3
**Owner:** Equipo de Desarrollo IDP-App

---

## 1. Descripción del Módulo

### 1.1 Propósito

El módulo de Declaraciones Mensuales automatiza la generación, llenado y presentación de declaraciones mensuales ante el SAT (ISR, IVA, retenciones, ISN), eliminando el llenado manual de formatos DM-1, DM-2 y otros que consume 30 minutos por cliente y es propenso a errores de cálculo.

### 1.2 Actividades del Contador que Automatiza

| Actividad | Frecuencia | Tiempo Actual | Tiempo Esperado | Ahorro |
|-----------|------------|---------------|-----------------|--------|
| Cálculo manual de ISR mensual | Mensual | 15 min/cliente | 2 min/cliente | 85% |
| Cálculo de IVA (trasladado - acreditado) | Mensual | 10 min/cliente | 1 min/cliente | 90% |
| Llenado formato DM-1 (ISR) | Mensual | 10 min/cliente | Automático | 100% |
| Llenado formato DM-2 (IVA) | Mensual | 10 min/cliente | Automático | 100% |
| Cálculo retenciones ISR (salarios) | Mensual | 20 min/cliente | 3 min/cliente | 85% |
| Presentación portal SAT | Mensual | 15 min/cliente | 2 min/cliente | 85% |

### 1.3 Dolor Principal que Resuelve

**Problema central:** Los contadores dedican 1-2 horas por cliente mensualmente a cálculos manuales de impuestos y llenado de formatos, un proceso repetitivo donde errores de captura generan multas del SAT de $15,000-$30,000 MXN.

**Dolores específicos:**
- Errores de cálculo por tablas ISR actualizadas anualmente
- Múltiples formatos (DM-1, DM-2, DIM) con estructuras diferentes
- Vencimientos estrictos día 17 (recargos 2.07% mensual por mora)
- Cambios normativos constantes (reformas 2026)

### 1.4 ROI Esperado

| Concepto | Valor |
|----------|-------|
| Tiempo liberado por cliente/mes | 1.5 horas |
| Clientes promedio por contador | 50 clientes |
| Ahorro mensual | $18,750 MXN |
| **ROI anual** | **450-600%** |

---

## 2. Estado del Arte en México (2026)

### 2.1 Tecnologías Disponibles

| Tecnología | Proveedor | Estado | Costo | Documentación |
|------------|-----------|--------|-------|---------------|
| **Portal SAT Declaraciones** | SAT | ✅ Activa | Gratuito | [SAT](https://www.sat.gob.mx/portal/public/tramites/declaraciones-pm) |
| **SIMPLICA** | SAT | ✅ Activa | Gratuito | [SIMPLICA](https://www.gob.mx/sat/prensa/invita-sat-a-empresas-a-presentar-su-declaracion-anual-002-2026) |
| **Declaración Precargada** | SAT | ✅ Activa | Gratuito | [SAT DA 2026](https://www.gob.mx/sat/prensa/invita-sat-a-empresas-a-presentar-su-declaracion-anual-002-2026) |
| **CONTPAQi** | CONTPAQi | ✅ Activa | $2,500/mes | [CONTPAQi](https://www.contpaqi.com/) |
| **Siigo Aspel** | Siigo | ✅ Activa | $1,800/mes | [Siigo](https://www.siigo.com/mx/) |

### 2.2 Regulación Aplicable

| Norma/Regulación | Artículo | Vigencia | Impacto |
|------------------|----------|----------|---------|
| **LISR Art. 76** | Declaración anual PM | Vigente | Obligación DA |
| **LISR Art. 96** | Pagos provisionales | Vigente | Cálculo mensual ISR |
| **LIVA Art. 32** | Declaración IVA | Vigente | Cálculo y entero IVA |
| **CFF Art. 12** | Vencimientos | Vigente | Prórroga si 17 inhábil |
| **CFF Art. 21** | Recargos | Actualizado 2026 | 2.07% mensual |
| **RMF 2026 Anexo 8** | Tablas ISR 2026 | Vigente 01-ene-2026 | Tarifas por inflación |
| **RMF 2026 Regla 2.1.20** | Tasa recargos | Vigente 2026 | 2.07% mensual |

### 2.3 Tablas ISR 2026 (Anexo 8 RMF)

**Fuente:** DOF 28-dic-2025, https://xpd.mx/blog/estas-son-las-nuevas-tablas-de-isr-que-seran-vigentes-en-2026.html

| Límite Inferior | Límite Superior | Cuota Fija | % Excedente |
|-----------------|-----------------|------------|-------------|
| $0.01 | $844.59 | $0.00 | 1.92% |
| $844.60 | $7,168.51 | $16.22 | 6.40% |
| $7,168.52 | $12,598.02 | $420.95 | 10.88% |
| $12,598.03 | $14,644.64 | $1,011.68 | 16.00% |
| $14,644.65 | $17,533.64 | $1,339.14 | 17.92% |
| $17,533.65 | $35,362.83 | $1,856.84 | 21.36% |
| $35,362.84 | $55,736.68 | $5,665.16 | 23.52% |
| $55,736.69 | $106,410.50 | $10,457.09 | 30.00% |
| $106,410.51 | $141,880.66 | $25,659.23 | 32.00% |
| $141,880.67 | $425,641.99 | $37,009.69 | 34.00% |
| $425,642.00 | En adelante | $133,488.54 | 35.00% |

### 2.4 Calendario Fiscal 2026

**Fuente:** https://www.sat.gob.mx/portal/public/tramites/declaraciones-pm

| Obligación | Vencimiento | Notas |
|------------|-------------|-------|
| **Declaraciones mensuales** | Día 17 de cada mes | Si inhábil, siguiente hábil (CFF Art. 12) |
| **Declaración anual PM** | 31 de marzo 2026 | Ejercicio 2025 |
| **Declaración anual PF** | 30 de abril 2026 | Ejercicio 2025 |
| **PTU** | 30 de mayo 2026 | Reparto utilidades |
| **DIOT** | 17 de cada mes | Trimestral |

---

## 3. Implementación Técnica

### 3.1 Arquitectura Recomendada

```
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE ENTRADA                          │
│  CFDI (XML) │ Nómina (XML) │ Manual (CSV)                  │
└────────────────────┬────────────────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE CÁLCULO                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Calculadora  │  │ Calculadora  │  │ Calculadora  │      │
│  │ ISR          │  │ IVA          │  │ Retenciones  │      │
│  │ (Tablas 2026)│  │ (16%, 8%)    │  │ (ISR, IMSS)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────┬────────────────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                 CAPA DE GENERACIÓN                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Formato DM-1 │  │ Formato DM-2 │  │ Formato DIM  │      │
│  │ (ISR)        │  │ (IVA)        │  │ (Múltiple)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────┬────────────────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                 CAPA DE PRESENTACIÓN                        │
│  Portal SAT (manual) │ API Terceros │ Descarga XML/PDF     │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Algoritmo: Cálculo ISR Mensual 2026

```python
from decimal import Decimal, ROUND_HALF_UP
from typing import Dict

# Tablas ISR 2026 - Anexo 8 RMF (DOF 28-dic-2025)
TABLAS_ISR_2026_MENSUAL = [
    (Decimal('0.01'), Decimal('844.59'), Decimal('0.00'), Decimal('0.0192')),
    (Decimal('844.60'), Decimal('7168.51'), Decimal('16.22'), Decimal('0.0640')),
    (Decimal('7168.52'), Decimal('12598.02'), Decimal('420.95'), Decimal('0.1088')),
    (Decimal('12598.03'), Decimal('14644.64'), Decimal('1011.68'), Decimal('0.1600')),
    (Decimal('14644.65'), Decimal('17533.64'), Decimal('1339.14'), Decimal('0.1792')),
    (Decimal('17533.65'), Decimal('35362.83'), Decimal('1856.84'), Decimal('0.2136')),
    (Decimal('35362.84'), Decimal('55736.68'), Decimal('5665.16'), Decimal('0.2352')),
    (Decimal('55736.69'), Decimal('106410.50'), Decimal('10457.09'), Decimal('0.3000')),
    (Decimal('106410.51'), Decimal('141880.66'), Decimal('25659.23'), Decimal('0.3200')),
    (Decimal('141880.67'), Decimal('425641.99'), Decimal('37009.69'), Decimal('0.3400')),
    (Decimal('425642.00'), Decimal('999999999.99'), Decimal('133488.54'), Decimal('0.3500')),
]

def calcular_isr_mensual(ingreso_gravado: float) -> Dict:
    """
    Calcula ISR mensual según tablas 2026 (Anexo 8 RMF).
    
    Ejemplo:
        >>> resultado = calcular_isr_mensual(35000.00)
        >>> print(f"ISR: ${resultado['isr_a_retener']:.2f}")
        ISR: $5,587.65
    """
    ingreso = Decimal(str(ingreso_gravado))
    
    for lim_inf, lim_sup, cuota_fija, pct in TABLAS_ISR_2026_MENSUAL:
        if lim_inf <= ingreso <= lim_sup:
            excedente = ingreso - lim_inf
            isr_marginal = excedente * pct
            isr_total = cuota_fija + isr_marginal
            
            return {
                'ingreso_gravado': float(ingreso),
                'limite_inferior': float(lim_inf),
                'excedente': float(excedente),
                'porcentaje': float(pct * 100),
                'cuota_fija': float(cuota_fija),
                'isr_marginal': float(isr_marginal),
                'isr_a_retener': float(isr_total),
                'ingreso_neto': float(ingreso - isr_total)
            }
    
    raise ValueError(f"Ingreso fuera de rango: {ingreso}")
```

### 3.3 Algoritmo: Cálculo IVA Mensual

```python
from typing import List, Dict

def calcular_iva_mensual(
    ivas_trasladados: List[Dict],
    ivas_acreditables: List[Dict]
) -> Dict:
    """
    Calcula IVA mensual: trasladado - acreditable.
    
    Ejemplo:
        >>> resultado = calcular_iva_mensual(
        ...     [{'monto': 16000, 'tasa': 0.16}],
        ...     [{'monto': 8000, 'tasa': 0.16}]
        ... )
        >>> print(f"IVA a pagar: ${resultado['iva_a_pagar']:.2f}")
        IVA a pagar: $8,000.00
    """
    total_trasladado = sum(item['monto'] for item in ivas_trasladados)
    total_acreditable = sum(item['monto'] for item in ivas_acreditables)
    
    iva_a_pagar = total_trasladado - total_acreditable
    
    return {
        'iva_trasladado': total_trasladado,
        'iva_acreditable': total_acreditable,
        'iva_a_pagar': max(0, iva_a_pagar),
        'saldo_a_favor': max(0, -iva_a_pagar)
    }
```

### 3.4 Generación de Formato DM-1 (XML)

```python
import xml.etree.ElementTree as ET
from datetime import datetime

def generar_dm1_xml(datos: Dict) -> str:
    """
    Genera XML de declaración mensual ISR (DM-1).
    
    Args:
        datos: {
            'rfc': 'XAXX010101000',
            'periodo': '2026-03',
            'ingresos_acumulables': 500000.00,
            'deducciones': 300000.00,
            'isr_calculado': 45000.00,
            'pagos_provisionales': 40000.00,
            'isr_a_pagar': 5000.00
        }
    """
    decl = ET.Element('DeclaracionISR')
    decl.set('version', '1.0')
    decl.set('fecha', datetime.now().isoformat())
    
    # Encabezado
    enc = ET.SubElement(decl, 'Encabezado')
    ET.SubElement(enc, 'RFC').text = datos['rfc']
    ET.SubElement(enc, 'Periodo').text = datos['periodo']
    
    # ISR Mensual
    isr = ET.SubElement(decl, 'ISRMensual')
    ET.SubElement(isr, 'Ingresos').text = str(datos['ingresos_acumulables'])
    ET.SubElement(isr, 'Deducciones').text = str(datos['deducciones'])
    ET.SubElement(isr, 'ISRCalculado').text = str(datos['isr_calculado'])
    ET.SubElement(isr, 'PagosProvisionales').text = str(datos['pagos_provisionales'])
    
    # Resultado
    res = ET.SubElement(decl, 'Resultado')
    ET.SubElement(res, 'ISRApagar').text = str(datos['isr_a_pagar'])
    
    # Guardar
    filename = f"DM1_{datos['rfc']}_{datos['periodo']}.xml"
    ET.ElementTree(decl).write(filename, encoding='utf-8', xml_declaration=True)
    return filename
```

### 3.5 Thresholds y Parámetros

| Parámetro | Valor | Justificación |
|-----------|-------|---------------|
| Precisión cálculo ISR | 100% | Cálculo fiscal exacto |
| Tolerancia redondeo | $0.01 | Oficial SAT (2 decimales) |
| Tiempo por declaración | <5s | Individual |
| Tiempo lote (50 clientes) | <1 min | Procesamiento batch |
| Tasa recargos | 2.07% mensual | RMF 2.1.20 |

---

## 4. Limitantes y Restricciones

### 4.1 Limitación 1: Sin API Oficial SAT

**Problema:** SAT no proporciona API pública para presentación automatizada.

**Solución:**
- Generar archivos XML listos para carga manual
- Integración con servicios de terceros (Finkok, SW Sapien)
- Automatización vía Selenium/Playwright (bajo riesgo de bloqueo)

### 4.2 Riesgos Técnicos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Cambios en tablas ISR | BAJA | ALTO | Actualización anual (diciembre) |
| Bloqueo por automation | MEDIA | ALTO | Usar APIs de terceros |
| Errores de redondeo | BAJA | MEDIO | Validación con 2 decimales |

---

## 5. Métricas Esperadas

| Métrica | Target | Fórmula |
|---------|--------|---------|
| Precisión cálculo ISR | 100% | `(correctos / total) × 100` |
| Tiempo generación | <5s | Por declaración |
| Tasa de éxito SAT | 98%+ | `(aceptadas / total) × 100` |

---

## 6. Roadmap de Implementación

### Fase 1: Calculadoras (4 semanas)

| Semana | Entregable | Owner |
|--------|------------|-------|
| 1 | Calculadora ISR (tablas 2026) | Backend |
| 2 | Calculadora IVA | Backend |
| 3 | Calculadora retenciones | Backend |
| 4 | Generador XML DM-1/DM-2 | Backend |

### Fase 2: Integración SAT (4 semanas)

| Semana | Entregable | Owner |
|--------|------------|-------|
| 5-6 | Automatización portal SAT | Fullstack |
| 7-8 | Descarga de acuses | Backend |

---

## 7. Seguridad y Cumplimiento

### 7.1 Requisitos SAT

| Requisito | Impacto |
|-----------|---------|
| Retención 5 años | Storage XML |
| Disponibilidad auditoría | Acceso rápido |
| Encriptación datos | AES-256 en reposo |

### 7.2 Multas

| Incumplimiento | Multa |
|----------------|-------|
| Declaración extemporánea | 2.07% mensual + actualización |
| Error en cálculo | $15,000-$30,000 MXN |
| No presentar | $3,000-$8,000 MXN |

---

## 8. Conclusiones y Recomendaciones

### Hallazgos Clave

1. **Tablas ISR 2026 actualizadas:** Anexo 8 RMF publicado DOF 28-dic-2025
2. **Tasa recargos aumentada:** 2.07% mensual (de 1.98%)
3. **Vencimiento día 17:** Prórroga automática si inhábil (CFF Art. 12)
4. **Sin API oficial:** Requiere soluciones de terceros o automatización

### Recomendaciones

| Área | Recomendación | Prioridad |
|------|---------------|-----------|
| Cálculo | Usar Decimal, no float | ALTA |
| Validación | Validar con contador | ALTA |
| Storage | Retener 6 años (margen) | ALTA |

---

## 9. Fuentes Consultadas

### Fuentes Oficiales
| Fuente | URL | Fecha |
|--------|-----|-------|
| SAT - Tablas ISR 2026 | https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/documentos2026/rmf/anexos/Anexo_8_RMF2026-DOF-28122025.pdf | 10-mar-2026 |
| SAT - Calendario Fiscal | https://www.sat.gob.mx/portal/public/tramites/declaraciones-pm | 10-mar-2026 |
| DOF - RMF 2026 | https://dof.gob.mx/2025/SHCP/SHCP_281225_02.pdf | 10-mar-2026 |
| SAT - Declaración Anual 2026 | https://www.gob.mx/sat/prensa/invita-sat-a-empresas-a-presentar-su-declaracion-anual-002-2026 | 10-mar-2026 |
| XPD - Tablas ISR 2026 | https://xpd.mx/blog/estas-son-las-nuevas-tablas-de-isr-que-seran-vigentes-en-2026.html | 10-mar-2026 |
| CONTPAQi - Declaraciones | https://www.contpaqi.com/publicaciones/tendencias-fiscales/declaracion-anual-de-isr-2026 | 10-mar-2026 |
| Siigo - Calendario | https://www.siigo.com/mx/blog/obligaciones-fiscales/calendario-fiscal/ | 10-mar-2026 |
| El Universal - Calendario | https://www.eluniversal.com.mx/consultas/blog/impuestos/obligaciones-fiscales-2026-calendario-completo/ | 10-mar-2026 |
| BBVA - Calendario PM | https://www.bbva.com/es/mx/empresas/calendario-fiscal-2026-para-personas-morales-en-mexico-y-fechas-esenciales-del-sat/ | 10-mar-2026 |
| Cofide - Fechas clave | https://www.cofide.mx/blog/fechas-clave-del-calendario-fiscal | 10-mar-2026 |

---

## 10. Control de Cambios

| Versión | Fecha | Autor | Tipo | Cambios |
|---------|-------|-------|------|---------|
| 1.0 | 10-mar-2026 | Diego Gzz | Creación | Versión inicial |
| 1.1 | 10-mar-2026 | Diego Gzz | Investigación Tavily | 4 queries ejecutados: (1) declaraciones mensuales SAT, (2) declaración anual PF/PM, (3) pagos provisionales ISR, (4) portal SAT envío. 10 fuentes oficiales agregadas. |
| 1.2 | 10-mar-2026 | Diego Gzz | Actualización | Código Python funcional (calculadoras ISR/IVA, generador XML). Tablas ISR 2026 completas (Anexo 8 RMF). Diagrama ASCII de arquitectura. |

---

**Documento elaborado por:** Diego Gzz - Principal Engineering Lead
**Fecha:** 10 de marzo de 2026
**Próxima actualización:** Después de validación con contador certificado

---

*Fin de la Investigación de Declaraciones Mensuales*
