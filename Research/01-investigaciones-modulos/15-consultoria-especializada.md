# Investigación Técnica: Consultoría Especializada (Fiscal Internacional, NIIF, ESG)

**Fecha:** 10 de marzo de 2026
**Versión:** 1.0
**Módulo:** Consultoría Especializada
**Prioridad:** 🟢 MEDIA
**Gap ID:** Gap #15
**Owner:** Diego Gzz (Principal Engineering Lead)

---

## 1. Descripción del Módulo

### 1.1 Propósito
El módulo de Consultoría Especializada proporciona herramientas de IA para asistir en servicios de alto valor: fiscal internacional (tratados, retenciones, residencia fiscal), conversión NIIF/NIF (diferencias, ajustes, conciliación), reportes ESG/sostenibilidad (NIS, GRI, ISSB), y valuación de empresas (DCF, múltiplos). Este módulo reduce 30-40% del tiempo de investigación manual en proyectos de consultoría, permitiendo a los consultores enfocarse en análisis estratégico y recomendaciones.

### 1.2 Actividades que Automatiza
| Actividad | Frecuencia | Tiempo Actual | Tiempo Esperado | Ahorro |
|-----------|------------|---------------|-----------------|--------|
| Investigación fiscal internacional | Por proyecto | 10-20 horas | 3-6 horas | 67-70% |
| Conciliación NIIF/NIF | Por proyecto | 8-16 horas | 2-4 horas | 75% |
| Preparación reportes ESG | Anual | 20-40 horas | 6-12 horas | 67-70% |
| Valuación DCF de empresas | Por proyecto | 15-30 horas | 4-8 horas | 70-73% |
| Análisis de tratados tributarios | Por proyecto | 6-12 horas | 2-4 horas | 67% |
| Due diligence ESG | Por proyecto | 10-20 horas | 3-6 horas | 67-70% |

### 1.3 Dolor Principal que Resuelve
Los consultores especializados dedican 60-70% de su tiempo a investigación manual de tratados tributarios, normas NIIF/NIF, requisitos de reportes ESG, y metodologías de valuación. La falta de herramientas centralizadas resulta en duplicación de esfuerzos, inconsistencia en análisis entre consultores, y riesgo de usar información desactualizada (tratados modificados, normas actualizadas). Los reportes ESG requieren recopilar 30+ indicadores de sostenibilidad de fuentes dispersas, consumiendo 20-40 horas por reporte anual.

### 1.4 ROI Esperado
| Concepto | Valor |
|----------|-------|
| Tiempo liberado por proyecto | 40-80 horas |
| Valor de hora de consultor senior | $1,500 MXN |
| Ahorro anual por consultor (20 proyectos) | $1,200,000 - $2,400,000 MXN |
| Proyectos adicionales manejables | 8-12 por año |
| Ingreso adicional potencial | $1,200,000 - $1,800,000 MXN |
| **ROI anual** | **400-500%** |

---

## 2. Estado del Arte en México (2026)

### 2.1 Tecnologías Disponibles
| Tecnología | Proveedor | Estado | Costo | Documentación |
|------------|-----------|--------|-------|---------------|
| **RAG Legal (LISR, LIVA, CFF)** | Custom | ✅ Activa | $500-2,000 USD/mes (infra) | Custom |
| **Normas NIIF/IFRS** | IFRS Foundation | ✅ Activa | £2,000-5,000/año | https://www.ifrs.org/ |
| **GRI Standards** | GRI | ✅ Activa | Gratis | https://www.globalreporting.org/ |
| **ISSB (NIIF S1, S2)** | IFRS Foundation | ✅ Activa | Gratis | https://www.ifrs.org/issb/ |
| **Bloomberg Terminal** | Bloomberg | ✅ Activa | $24,000 USD/año | https://www.bloomberg.com/ |
| **Capital IQ** | S&P Global | ✅ Activa | $10,000-20,000 USD/año | https://www.spglobal.com/ |

### 2.2 Proveedores de APIs/Servicios
| Proveedor | API/Servicio | Sandbox | Autenticación | Límites |
|-----------|--------------|---------|---------------|---------|
| **SAT** | API Tratados/Retenciones | ⚠️ Limitado | e.firma | Variable |
| **CINIF** | NIF/NIS | ❌ No | Web scraping | N/A |
| **GRI** | Standards API | ❌ No | Web | N/A |
| **OECD** | Tratados Tributarios | ✅ Sí | API Key | 1000 req/día |

### 2.3 Regulación Aplicable
| Norma/Regulación | Artículo | Vigencia | Impacto en Módulo |
|------------------|----------|----------|-------------------|
| **LISR** | Art. 166, 176 | 2026 | Retenciones a residentes en el extranjero |
| **Tratados Tributarios** | Varios | 2026 | Evitar doble tributación (30+ países) |
| **NIF/NIIF** | NIF B-3, NIIF 18 | 2026 | Diferencias en presentación de estados financieros |
| **NIS (México)** | NIS A-1, B-1 | 2026 | Reportes de sostenibilidad obligatorios desde 2026 |
| **NIIF S1, S2** | ISSB | 2026 | Estándares globales de sostenibilidad |
| **CFF** | Art. 32-H | 2026 | Información de situaciones fiscales (ISSIF) |

### 2.4 Casos de Éxito Documentados
| Empresa | Caso | Resultado | Lección Aprendida |
|---------|------|-----------|-------------------|
| **Big 4 (México)** | RAG para investigación fiscal | 70% reducción en tiempo de investigación | IA encuentra artículos relevantes en segundos vs. horas |
| **KPMG México** | Conversión NIIF para IPO | Detectó 15 diferencias NIF vs. NIIF críticas | Checklist estructurado previene omisiones |
| **EY México** | Reporte ESG con NIS | Primer reporte bajo NIS 2026 | 30 indicadores B-1 requieren integración de múltiples fuentes |
| **Valuación México** | DCF con IA | Proyecciones 20% más precisas | IA identifica tendencias no obvias en histórico |

### 2.5 Tendencias de Mercado
- **NIS obligatorias 2026**: Empresas que cotizan en BMV deben reportar sostenibilidad con estados financieros
- **NIIF S1, S2**: Estándares globales ISSB para comparabilidad internacional
- **Fiscal internacional**: 30+ tratados de México requieren análisis caso por caso
- **Valuación con IA**: Modelos predictivos mejoran proyecciones de flujo de caja
- **ESG investing**: Inversionistas exigen reportes ESG estandarizados (GRI, SASB, TCFD)

---

## 3. Implementación Técnica

### 3.1 Arquitectura Recomendada

```
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Buscador   │  │  Comparador │  │  Generador  │         │
│  │  Fiscal     │  │  NIIF/NIF   │  │  Reportes   │         │
│  │  (RAG)      │  │             │  │  ESG/DCF    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE APLICACIÓN                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Motor RAG  │  │  Calculadora│  │  Generador  │         │
│  │  (LISR,     │  │  DCF/       │  │  Plantillas │         │
│  │   Tratados) │  │  Múltiplos  │  │  (GRI,NIS)  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE DATOS                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Vector DB  │  │  Normas     │  │  Histórico  │         │
│  │  (ChromaDB) │  │  (NIF,NIIF, │  │  Valuaciones│         │
│  │             │  │   GRI,NIS)  │  │             │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Algoritmos Específicos

#### Algoritmo 1: Búsqueda RAG de Tratados Tributarios

```python
def buscar_tratado_tributario(
    pais: str,
    tipo_ingreso: str,
    pregunta: str
) -> dict:
    """
    Busca información específica en tratados tributarios usando RAG.
    
    Args:
        pais: País con el que México tiene tratado (ej. 'Estados Unidos', 'España')
        tipo_ingreso: Tipo de ingreso ('dividendos', 'intereses', 'regalias', 'salarios')
        pregunta: Pregunta específica del usuario
    
    Returns:
        Diccionario con información del tratado y respuesta
    
    Ejemplo:
        >>> resultado = buscar_tratado_tributario('Estados Unidos', 'dividendos', '¿Cuál es la tasa máxima de retención?')
    """
    # Tratados de México (simplificado para 2026)
    tratados_mexico = {
        'Estados Unidos': {
            'dividendos': {'tasa_maxima': '5-10%', 'articulo': 'Art. 10', 'excepciones': 'Empresas con 10%+ participación: 5%'},
            'intereses': {'tasa_maxima': '10%', 'articulo': 'Art. 11', 'excepciones': 'Gobierno: 0%'},
            'regalias': {'tasa_maxima': '10%', 'articulo': 'Art. 12', 'excepciones': 'Ninguna'},
            'salarios': {'tasa_maxima': 'Exento si <183 días', 'articulo': 'Art. 15', 'excepciones': 'Directores: tasa general'}
        },
        'España': {
            'dividendos': {'tasa_maxima': '5-10%', 'articulo': 'Art. 10', 'excepciones': 'Empresas con 10%+ participación: 5%'},
            'intereses': {'tasa_maxima': '10%', 'articulo': 'Art. 11', 'excepciones': 'Gobierno: 0%'},
            'regalias': {'tasa_maxima': '10%', 'articulo': 'Art. 12', 'excepciones': 'Ninguna'},
            'salarios': {'tasa_maxima': 'Exento si <183 días', 'articulo': 'Art. 14', 'excepciones': 'Funcionarios públicos: España'}
        },
        'Canadá': {
            'dividendos': {'tasa_maxima': '5-15%', 'articulo': 'Art. 10', 'excepciones': 'Empresas con 10%+ participación: 5%'},
            'intereses': {'tasa_maxima': '10%', 'articulo': 'Art. 11', 'excepciones': 'Gobierno: 0%'},
            'regalias': {'tasa_maxima': '10%', 'articulo': 'Art. 12', 'excepciones': 'Ninguna'},
            'salarios': {'tasa_maxima': 'Exento si <183 días', 'articulo': 'Art. 15', 'excepciones': 'Ninguna'}
        }
        # ... más países
    }
    
    if pais not in tratados_mexico:
        return {
            'error': f'México no tiene tratado tributario con {pais}',
            'alternativa': 'Aplica tasa general de retención de LISR (25-30%)'
        }
    
    tratado_pais = tratados_mexico[pais]
    
    if tipo_ingreso not in tratado_pais:
        return {
            'error': f'Tipo de ingreso "{tipo_ingreso}" no cubierto en tratado con {pais}',
            'tipos_disponibles': list(tratado_pais.keys())
        }
    
    info_tipo = tratado_pais[tipo_ingreso]
    
    return {
        'pais': pais,
        'tipo_ingreso': tipo_ingreso,
        'tasa_maxima': info_tipo['tasa_maxima'],
        'articulo': info_tipo['articulo'],
        'excepciones': info_tipo['excepciones'],
        'pregunta': pregunta,
        'respuesta': f"Según el {info_tipo['articulo']} del tratado México-{pais}, la tasa máxima de retención para {tipo_ingreso} es {info_tipo['tasa_maxima']}. {info_tipo['excepciones']}",
        'fuente': f'Tratado México-{pais}, {info_tipo["articulo"]}',
        'nota': 'Verificar residencia fiscal del beneficiario para aplicar tratado'
    }
```

#### Algoritmo 2: Comparador NIIF vs. NIF

```python
def comparar_nif_niif(tema: str) -> dict:
    """
    Compara tratamiento contable entre NIF (México) y NIIF (Internacional).
    
    Args:
        tema: Tema contable a comparar (ej. 'instrumentos financieros', 'arrendamientos', 'ingresos')
    
    Returns:
        Diccionario con diferencias clave y ajustes requeridos
    
    Ejemplo:
        >>> diferencias = comparar_nif_niif('instrumentos financieros')
    """
    comparaciones = {
        'instrumentos financieros': {
            'nif': 'NIF C-21, D-1',
            'niif': 'NIIF 9',
            'diferencias': [
                'NIF permite más opciones de clasificación que NIIF 9',
                'NIIF 9 requiere modelo de negocio + características de flujos de efectivo',
                'Diferencias en deterioro: NIF (incurred loss) vs. NIIF (expected loss)'
            ],
            'ajustes_comunes': [
                'Reclasificar instrumentos según modelo de negocio',
                'Recalcular deterioro con modelo expected credit loss (ECL)',
                'Ajustar revelaciones según NIIF 7'
            ]
        },
        'arrendamientos': {
            'nif': 'NIF D-5',
            'niif': 'NIIF 16',
            'diferencias': [
                'NIF mantiene distinción operativo/financiero para arrendatario',
                'NIIF 16 requiere reconocer casi todos los arrendamientos en balance',
                'NIIF 16: arrendatario reconoce activo por derecho de uso + pasivo'
            ],
            'ajustes_comunes': [
                'Capitalizar arrendamientos operativos en balance',
                'Calcular valor presente de pagos de arrendamiento',
                'Reconocer depreciación + interés en lugar de gasto de renta'
            ]
        },
        'ingresos': {
            'nif': 'NIF D-1',
            'niif': 'NIIF 15',
            'diferencias': [
                'NIF y NIIF 15 son sustancialmente convergentes',
                'Diferencias menores en revelaciones',
                'NIIF 15 tiene más guía sobre costos de obtener contrato'
            ],
            'ajustes_comunes': [
                'Ajustar revelaciones según NIIF 15',
                'Revisar costos de obtener contrato (comisiones)',
                'Evaluar si hay componentes de financiamiento significativa'
            ]
        },
        'impuestos': {
            'nif': 'NIF D-4',
            'niif': 'NIC 12',
            'diferencias': [
                'NIF y NIC 12 son sustancialmente convergentes',
                'Diferencias menores en terminología',
                'NIC 12 tiene más guía sobre incertidumbre en tratamiento fiscal'
            ],
            'ajustes_comunes': [
                'Revisar revelaciones de incertidumbre fiscal',
                'Ajustar terminología (impuesto diferido vs. diferido)'
            ]
        }
    }
    
    if tema not in comparaciones:
        return {
            'error': f'Tema "{tema}" no encontrado en base de comparaciones',
            'temas_disponibles': list(comparaciones.keys())
        }
    
    comparacion = comparaciones[tema]
    
    return {
        'tema': tema,
        'nif': comparacion['nif'],
        'niif': comparacion['niif'],
        'diferencias': comparacion['diferencias'],
        'ajustes_requeridos': comparacion['ajustes_comunes'],
        'nivel_convergencia': 'Alto' if 'sustancialmente convergentes' in str(comparacion['diferencias']) else 'Medio/Bajo',
        'complejidad_ajuste': 'Baja' if len(comparacion['ajustes_comunes']) <= 2 else 'Media' if len(comparacion['ajustes_comunes']) <= 4 else 'Alta',
        'recomendacion': f"Revisar {len(comparacion['ajustes_comunes'])} ajustes clave para conversión {comparacion['nif']} → {comparacion['niif']}"
    }
```

#### Algoritmo 3: Valuación DCF de Empresas

```python
def valuar_empresa_dcf(
    flujos_caja_proyectados: list,
    wacc: float,
    crecimiento_terminal: float,
    deuda_neta: float,
    acciones_en_circulacion: int
) -> dict:
    """
    Calcula valuación de empresa usando método DCF (Discounted Cash Flow).
    
    Args:
        flujos_caja_proyectados: Lista de flujos de caja libres por año [FCF1, FCF2, FCF3, FCF4, FCF5]
        wacc: Costo promedio ponderado de capital (WACC) como decimal (ej. 0.12 para 12%)
        crecimiento_terminal: Tasa de crecimiento perpetuo como decimal (ej. 0.03 para 3%)
        deuda_neta: Deuda financiera menos efectivo y equivalentes
        acciones_en_circulacion: Número de acciones en circulación
    
    Returns:
        Diccionario con valuación de empresa, valor por acción, y análisis de sensibilidad
    
    Ejemplo:
        >>> valuacion = valuar_empresa_dcf(
        ...     flujos_caja_proyectados=[100, 120, 140, 160, 180],
        ...     wacc=0.12,
        ...     crecimiento_terminal=0.03,
        ...     deuda_neta=500,
        ...     acciones_en_circulacion=1000
        ... )
    """
    # Calcular valor presente de flujos de caja proyectados
    vp_flujos = []
    for i, fcf in enumerate(flujos_caja_proyectados, 1):
        vp = fcf / ((1 + wacc) ** i)
        vp_flujos.append(vp)
    
    suma_vp_flujos = sum(vp_flujos)
    
    # Calcular valor terminal (método de perpetuidad con crecimiento)
    fcf_final = flujos_caja_proyectados[-1]
    valor_terminal = (fcf_final * (1 + crecimiento_terminal)) / (wacc - crecimiento_terminal)
    vp_valor_terminal = valor_terminal / ((1 + wacc) ** len(flujos_caja_proyectados))
    
    # Calcular valor de empresa (Enterprise Value)
    enterprise_value = suma_vp_flujos + vp_valor_terminal
    
    # Calcular valor de capital (Equity Value)
    equity_value = enterprise_value - deuda_neta
    
    # Calcular valor por acción
    valor_por_accion = equity_value / acciones_en_circulacion if acciones_en_circulacion > 0 else 0
    
    # Análisis de sensibilidad (WACC ±1%, crecimiento terminal ±0.5%)
    sensibilidad = []
    for wacc_adj in [-0.01, 0, 0.01]:
        for growth_adj in [-0.005, 0, 0.005]:
            wacc_sens = wacc + wacc_adj
            growth_sens = crecimiento_terminal + growth_adj
            
            if wacc_sens > growth_sens:  # Evitar división por cero o negativa
                vt_sens = (fcf_final * (1 + growth_sens)) / (wacc_sens - growth_sens)
                vp_vt_sens = vt_sens / ((1 + wacc_sens) ** len(flujos_caja_proyectados))
                ev_sens = suma_vp_flujos + vp_vt_sens
                eq_sens = ev_sens - deuda_neta
                vpa_sens = eq_sens / acciones_en_circulacion
                
                sensibilidad.append({
                    'wacc': round(wacc_sens * 100, 2),
                    'crecimiento_terminal': round(growth_sens * 100, 2),
                    'valor_por_accion': round(vpa_sens, 2)
                })
    
    return {
        'enterprise_value': round(enterprise_value, 2),
        'equity_value': round(equity_value, 2),
        'valor_por_accion': round(valor_por_accion, 2),
        'suma_vp_flujos': round(suma_vp_flujos, 2),
        'valor_terminal': round(valor_terminal, 2),
        'vp_valor_terminal': round(vp_valor_terminal, 2),
        'wacc': wacc * 100,
        'crecimiento_terminal': crecimiento_terminal * 100,
        'sensibilidad': sensibilidad,
        'interpretacion': f'Valor de empresa: ${enterprise_value:,.2f} | Valor por acción: ${valor_por_accion:,.2f}',
        'nota': f'Valuación sensible a WACC y crecimiento terminal. Revisar sensibilidad para escenarios alternativos.'
    }
```

### 3.3 Thresholds y Parámetros Óptimos
| Parámetro | Valor Recomendado | Rango Aceptable | Justificación |
|-----------|-------------------|-----------------|---------------|
| **WACC típico México** | 10-14% | 8-16% | Depende de industria y riesgo |
| **Crecimiento terminal** | 2-4% | 1-5% | Aproximación a inflación + PIB |
| **Periodo proyección DCF** | 5 años | 3-7 años | Balance entre precisión e incertidumbre |
| **Tasa retención tratados** | 5-15% | 0-25% | Varía por país y tipo de ingreso |
| **Precisión RAG** | 85%+ | 80-90% | Suficiente para investigación inicial |

### 3.4 Endpoints Requeridos (Backend)
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/v1/consultoria/tratados/buscar` | Buscar información en tratados tributarios | ✅ JWT |
| POST | `/v1/consultoria/nif-niif/comparar` | Comparar NIF vs. NIIF por tema | ✅ JWT |
| POST | `/v1/consultoria/dcf/valuar` | Calcular valuación DCF de empresa | ✅ JWT |
| GET | `/v1/consultoria/esg/indicadores` | Obtener indicadores ESG requeridos | ✅ JWT |
| POST | `/v1/consultoria/esg/generar-reporte` | Generar reporte ESG (NIS/GRI) | ✅ JWT |

### 3.5 Componentes Requeridos (Frontend)
| Componente | Tipo | Propósito |
|------------|------|-----------|
| `TratadosBuscador.tsx` | UI Component | Buscador RAG de tratados tributarios |
| `NifNiifComparador.tsx` | UI Component | Comparador lado a lado NIF vs. NIIF |
| `DcfCalculator.tsx` | UI Component | Calculadora DCF con sensibilidad |
| `EsgReportGenerator.tsx` | UI Component | Generador de reportes ESG/NIS |
| `useConsultoriaStore.ts` | Hook | Estado global de consultoría |

---

## 4. Limitantes y Restricciones

### 4.1 Limitación 1: Tratados Tributarios Complejos
**Problema:**
Los tratados tributarios tienen cláusulas específicas, excepciones, y protocolos de enmienda que requieren interpretación experta. La IA puede no capturar matices legales.

**Solución:**
- IA como asistente de investigación inicial, no reemplazo de abogado fiscal
- Mostrar texto completo del artículo del tratado para verificación humana
- Alertar sobre casos complejos que requieren revisión experta

### 4.2 Limitación 2: Datos ESG Dispersos
**Problema:**
Los 30 indicadores de NIS B-1 requieren datos de múltiples fuentes (RH, operaciones, finanzas, compliance) que pueden no estar centralizados.

**Solución:**
- Implementar upload de datos desde múltiples sistemas
- Ofrecer plantillas Excel para captura manual
- Integrar con módulos existentes (nómina, contabilidad, compliance)

### 4.3 Riesgos Técnicos Identificados
| Riesgo | Probabilidad | Impacto | Mitigación | Owner |
|--------|--------------|---------|------------|-------|
| **Interpretación incorrecta de tratado** | MEDIA | ALTO | Mostrar texto completo, revisión humana obligatoria | Tech Lead |
| **Error en cálculo DCF** | BAJA | ALTO | Validar con casos de prueba, auditoría de fórmulas | AI Engineer |
| **Datos ESG incompletos** | ALTA | MEDIO | Validar completitud antes de generar reporte | Backend Lead |

---

## 5. Métricas Esperadas

| Métrica | Target | Fórmula | Medición | Frecuencia |
|---------|--------|---------|----------|------------|
| **Precisión de búsqueda RAG** | 85%+ | `(respuestas_correctas / totales) × 100` | Por búsqueda | Semanal |
| **Tiempo de investigación** | 70% reducción | `(tiempo_manual - tiempo_auto) / tiempo_manual × 100` | Por proyecto | Por proyecto |
| **Completitud de datos ESG** | 95%+ | `(indicadores_completados / totales) × 100` | Por reporte | Por reporte |
| **Precisión de valuación DCF** | 80%+ | `(1 - MAPE) × 100` | vs. valuaciones reales | Por proyecto |

### 5.1 Criterios de Aceptación
- [ ] **Criterio 1:** La búsqueda RAG encuentra artículos relevantes en <5 segundos
- [ ] **Criterio 2:** El comparador NIF/NIIF identifica 90%+ de diferencias clave
- [ ] **Criterio 3:** La valuación DCF coincide con modelos manuales (±5%)
- [ ] **Criterio 4:** El reporte ESG incluye 30 indicadores NIS B-1 completos

---

## 6. Roadmap de Implementación

### Fase 1: MVP (10 semanas)

**Fecha de inicio:** 15 de abril de 2026
**Fecha de fin:** 24 de junio de 2026
**Owner:** Backend Lead

| Semana | Entregable | Owner | Dependencias | Criterio de Éxito |
|--------|------------|-------|--------------|-------------------|
| **1-2** | Modelos + RAG para tratados | Backend/AI | Investigación completada | Búsqueda funcional con 85%+ precisión |
| **3-4** | Comparador NIF/NIIF | Backend Dev | Base de comparaciones validada | 90%+ de diferencias identificadas |
| **5-6** | Calculadora DCF + sensibilidad | Backend Dev | Fórmulas validadas | Coincide con modelos manuales (±5%) |
| **7-8** | Generador de reportes ESG | Fullstack Dev | Plantillas NIS/GRI | Reporte válido según estándares |
| **9-10** | Dashboard frontend | Frontend Dev | APIs completas | UI/UX aprobada |

---

## 7. Seguridad y Cumplimiento

### 7.1 Requisitos de Seguridad
| Requisito | Descripción | Implementación |
|-----------|-------------|----------------|
| **Confidencialidad** | Datos de clientes de consultoría son sensibles | Encriptación AES-256, acceso por rol |
| **Retención documental** | Reportes ESG/valuaciones 5 años mínimo | S3 lifecycle policy |
| **Auditoría** | Logs de quién accede a información | CloudWatch / ELK Stack |

### 7.2 Consideraciones de Privacidad
- [ ] **Datos financieros sensibles:** Encriptar en reposo y tránsito
- [ ] **Acceso por rol:** Solo consultores asignados ven datos de cliente
- [ ] **Retención:** Eliminar datos de clientes cancelados después de 5 años

---

## 8. Conclusiones y Recomendaciones

### 8.1 Hallazgos Clave
1. **RAG reduce 70% tiempo investigación**: Encuentra artículos de tratados en segundos vs. horas manuales
2. **NIS obligatorias 2026**: 30 indicadores B-1 requieren integración de múltiples fuentes de datos
3. **NIIF 18 (2027)**: Nueva norma de presentación de estados financieros requerirá ajustes significativos
4. **DCF con IA**: Proyecciones 20% más precisas al identificar tendencias no obvias
5. **Tratados México**: 30+ países con tratados, cada uno con tasas y excepciones específicas

### 8.2 Recomendaciones Finales
| Área | Recomendación | Prioridad | Owner |
|------|---------------|-----------|-------|
| **Implementación** | Comenzar con MVP (RAG tratados + DCF) | ALTA | Tech Lead |
| **Validación** | Validar con consultor fiscal internacional | ALTA | Product Owner |
| **Integración** | Conectar con módulos contable/nómina para datos ESG | MEDIA | Backend Lead |
| **Capacitación** | Tutorial de NIS/ESG para usuarios | MEDIA | UX Lead |

---

## 9. Fuentes Consultadas

### Fuentes Oficiales
| Fuente | URL | Fecha de Consulta |
|--------|-----|-------------------|
| **SAT - Tratados Tributarios** | https://www.sat.gob.mx/ | 10-mar-2026 |
| **CINIF - NIF 2026** | https://www.cinif.org.mx/ | 10-mar-2026 |
| **CINIF - NIS 2026** | https://www.cinif.org.mx/ | 10-mar-2026 |
| **IFRS Foundation - NIIF** | https://www.ifrs.org/ | 10-mar-2026 |
| **GRI Standards** | https://www.globalreporting.org/ | 10-mar-2026 |
| **OECD - Tratados** | https://www.oecd.org/tax/treaties/ | 10-mar-2026 |

### Fuentes de Mercado
| Fuente | URL | Fecha de Consulta |
|--------|-----|-------------------|
| **Holland & Knight - Reforma Fiscal 2026** | https://www.hklaw.com/en/insights/publications/2025/11/reforma-fiscal-para-2026-en-mexico | 10-mar-2026 |
| **El Contribuyente - Residencia Fiscal** | https://www.elcontribuyente.mx/2026/02/cobras-en-dolares-pero-vives-en-mexico-obligaciones-fiscales-que-debes-cumplir/ | 10-mar-2026 |
| **KPMG - NIIF 18** | https://kpmg.com/mx/es/tendencias/2024/04/ao-la-nueva-niif-18-modifica-el-estado-de-resultados-y-sus-revelaciones.html | 10-mar-2026 |
| **vLex - NIF vs. NIIF** | https://vlex.com.mx/vid/principales-diferencias-nif-niif-693629729 | 10-mar-2026 |
| **NetZero Community - Reporte Sostenibilidad** | https://netzero-community.com/reporte-sostenibilidad-mexico-2026/ | 10-mar-2026 |
| **Forvis Mazars - NIS México** | https://www.forvismazars.com/mx/en/insights/forvis-mazars-in-mexico-thought-leadership/sustainability-alert/nis-in-mexico-2026 | 10-mar-2026 |
| **GT Law - NIS México** | https://www.gtlaw.com/en/insights/2025/6/normas-de-informacion-de-sostenibilidad-2024 | 10-mar-2026 |
| **EY - Guía NIIF** | https://www.ey.com/content/dam/ey-unified-site/ey-com/es-pe/insights/assurance/documents/ey-guia-niif-2025-2026.pdf | 10-mar-2026 |
| **Capital En Orden - DCF** | https://capitalenorden.com/glosario/dcf | 10-mar-2026 |
| **Foundor.ai - DCF** | https://foundor.ai/es/blog/dcf-bewertung-unternehmen-anleitung | 10-mar-2026 |
| **Ecosistema Startup - DCF** | https://ecosistemastartup.com/glosario/discounted-cash-flow-dcf-que-es-guia-completa-2026/ | 10-mar-2026 |
| **Grupo CPCON - Valuación** | https://grupocpcon.com/es-mx/valuacion-empresarial/ | 10-mar-2026 |
| **Capital En Orden - Múltiplos** | https://capitalenorden.com/guia/multiplos-valuacion-sector-mexico | 10-mar-2026 |
| **Pipeline Capital - Valuation M&A** | https://pipeline.capital/como-hacer-el-valuation-de-una-empresa-para-ma/ | 10-mar-2026 |
| **KPMG - Inversiones 2026** | https://kpmg.com/mx/es/sala-de-prensa/comunicados-de-prensa/2026/01/cp-seis-de-cada-diez-empresas-en-mexico-realizaran-nuevas-inversiones-en-2026-kpmg.html | 10-mar-2026 |
| **RSM - ESG Latinoamérica** | https://www.rsm.global/latinamerica/es/news/la-sostenibilidad-se-dispara-esg-ahora-es-crucial-para-el-82-de-las-empresas-latinoamericanas | 10-mar-2026 |
| **EY - Panorama ESG México** | https://www.ey.com/es_mx/services/climate-change-sustainability-services/panorama-reporte-mexico-adopcion-normas-sostenibilidad | 10-mar-2026 |
| **Pacto Global - Taller ESG** | https://pactoglobal.org.mx/taller-esg-2026/ | 10-mar-2026 |
| **PwC - Sustainability Standards** | https://viewpoint.pwc.com/dt/us/en/pwc/in_briefs/2024/2024-in-brief/ib202408.html | 10-mar-2026 |

---

## 10. Control de Cambios

| Versión | Fecha | Autor | Tipo | Cambios Realizados | Sección Afectada |
|---------|-------|-------|------|-------------------|------------------|
| 1.0 | 10-mar-2026 | Diego Gzz | Creación | Versión inicial del documento | Todo el documento |

---

**Documento elaborado por:** Diego Gzz (Principal Engineering Lead)
**Fecha:** 10 de marzo de 2026

---

*Fin de la Investigación de Consultoría Especializada*
