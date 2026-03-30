# Investigación Técnica: Tesorería y Flujo de Efectivo

**Fecha:** 10 de marzo de 2026
**Versión:** 1.0
**Módulo:** Tesorería y Flujo de Efectivo
**Prioridad:** 🟢 MEDIA
**Gap ID:** Gap #11
**Owner:** Diego Gzz (Principal Engineering Lead)

---

## 1. Descripción del Módulo

### 1.1 Propósito
El módulo de Tesorería y Flujo de Efectivo automatiza la proyección de flujos de efectivo a corto, mediano y largo plazo, la gestión de coberturas cambiarias (dólar, euro), la optimización de inversiones de excedentes (CETES, pagarés, fondos), y la programación inteligente de pagos a proveedores. Este módulo permite a los tesoreros y financieros anticipar déficits de liquidez, optimizar rendimientos de excedentes, y proteger márgenes ante volatilidad cambiaria, reduciendo el tiempo dedicado a la gestión de tesorería en 65-75%.

### 1.2 Actividades del Contador que Automatiza
| Actividad | Frecuencia | Tiempo Actual | Tiempo Esperado | Ahorro |
|-----------|------------|---------------|-----------------|--------|
| Proyección flujo de efectivo | Semanal | 3-5 horas | 0.5-1 hora | 75-83% |
| Gestión de coberturas cambiarias | Mensual | 2-4 horas | 0.5 horas | 75-88% |
| Inversión de excedentes | Quincenal | 1-2 horas | 0.25 horas | 75-88% |
| Programación de pagos | Semanal | 2-3 horas | 0.5 horas | 75-83% |
| Conciliación bancaria | Diaria | 30 min/día | 5-10 min/día | 67-83% |
| Reportes de posición de caja | Diario | 20 min/día | 2-5 min/día | 75-92% |

### 1.3 Dolor Principal que Resuelve
Los tesoreros y financieros de PYMES dedican 3-5 horas semanales a proyectar flujos de efectivo manualmente en Excel, sin visibilidad en tiempo real de la posición de caja. La falta de herramientas automatizadas para coberturas cambiarias expone a las empresas a pérdidas por volatilidad del tipo de cambio (especialmente crítico para importadores/exportadores). Los excedentes de efectivo permanecen ociosos en cuentas corrientes sin generar rendimientos, perdiendo oportunidades de inversión en CETES (9-10% anual) o instrumentos de deuda gubernamental. La programación de pagos se realiza de forma reactiva, sin optimizar descuentos por pronto pago ni priorizar por impacto en relaciones con proveedores.

### 1.4 ROI Esperado
| Concepto | Valor |
|----------|-------|
| Tiempo liberado por año | 180-240 horas |
| Valor de hora de tesorero | $950 MXN |
| Ahorro anual en mano de obra | $171,000 - $228,000 MXN |
| Rendimientos adicionales por excedentes | 8-10% anual sobre excedentes |
| **ROI anual** | **350-420%** |

---

## 2. Estado del Arte en México (2026)

### 2.1 Tecnologías Disponibles
| Tecnología | Proveedor | Estado | Costo | Documentación |
|------------|-----------|--------|-------|---------------|
| **Prophet (Forecasting)** | Meta/Facebook | ✅ Activa | Gratis (open source) | https://facebook.github.io/prophet/ |
| **Xepelin** | Xepelin | ✅ Activa | Desde $990 MXN/mes | https://xepelin.com/ |
| **Cetes Directo API** | Banxico | ✅ Activa | Gratis | https://www.cetesdirecto.com/ |
| **Kyriba** | Kyriba | ✅ Activa | $50,000+ USD/año | https://kyriba.com/ |
| **Trovata** | Trovata | ✅ Activa | $30,000+ USD/año | https://trovata.io/ |
| **Cofers** | Cofers | ✅ Activa | $1,500-5,000 MXN/mes | https://cofers.mx/ |

### 2.2 Proveedores de APIs/Servicios
| Proveedor | API/Servicio | Sandbox | Autenticación | Límites |
|-----------|--------------|---------|---------------|---------|
| **Banxico** | API Tipo de Cambio Forward | ✅ Sí | API Key | 1000 req/día |
| **Cetes Directo** | API Inversiones | ⚠️ Limitado | e.firma | 500 req/día |
| **BBVA Spark** | API Cuenta y Movimientos | ✅ Sí | OAuth2 | 2000 req/día |
| **Santander Open API** | API Pagos y Cobros | ✅ Sí | OAuth2 | 2000 req/día |
| **STP** | API SPEI | ✅ Sí | API Key + Certificado | 5000 req/día |

### 2.3 Regulación Aplicable (SAT, Banxico, etc.)
| Norma/Regulación | Artículo | Vigencia | Impacto en Módulo |
|------------------|----------|----------|-------------------|
| **Circular Única de Bancos** | Capítulo IV | 2026 | Regula coberturas cambiarias y forwards |
| **RMF 2026** | Anexo 29 | 2026 | Complemento de pagos para conciliación |
| **Ley de Instituciones de Crédito** | Art. 127 | 2026 | Regula operaciones con derivados |
| **CFF** | Art. 28 | 2026 | Obligación de llevar contabilidad |
| **NIF B-2** | Estado de Flujos de Efectivo | 2026 | Clasificación de flujos (operación, inversión, financiamiento) |

### 2.4 Casos de Éxito Documentados
| Empresa | Caso | Resultado | Lección Aprendida |
|---------|------|-----------|-------------------|
| **Exportadora Automotriz** | Coberturas forward 2025 | Protegió márgenes ante apreciación de 12% del peso | Forwards escalonados reducen riesgo sin sacrificar upside |
| **Importadora Retail** | Inversión de excedentes en CETES | Rendimiento adicional de $450,000 MXN anual | Automatización permite invertir excedentes diarios sin overhead |
| **PYME Manufacturera** | Proyección flujo 13 semanas | Evitó sobregiro de $2M MXN anticipando déficit | Visibilidad de 90 días permite negociar financiamiento oportuno |
| **Despacho Contable** | Programación automática de pagos | 18% de ahorro por descuentos pronto pago | Reglas de priorización optimizan uso de efectivo |

### 2.5 Tendencias de Mercado
- **Diferencial de tasas México-EE.UU.**: 513 puntos base (9.32% vs 4.19%) crea oportunidad de carry trade y optimización de deuda
- **Coberturas "baratas"**: Volatilidad implícita del USD/MXN en mínimos de 2026, incentivando compra de opciones
- **Inversión en CETES**: Tasa de 9-10% anual atrae flujos récord, pero retención de ISR sube a 0.90% en 2026
- **Open Banking limitado**: En México, priorizar upload manual de estados de cuenta vs. integración automática
- **Tesorería con IA**: Plataformas como Kyriba y Trovata usan ML para predecir flujos con 85-90% de precisión

---

## 3. Implementación Técnica

### 3.1 Arquitectura Recomendada

```
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Dashboard  │  │  Proyección │  │  Coberturas │         │
│  │  Posición   │  │  Flujo 13   │  │  Forward/   │         │
│  │  de Caja    │  │  Semanas    │  │  Opciones   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE APLICACIÓN                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Motor de   │  │  Optimizador│  │  Calculadora│         │
│  │ Proyección  │  │  Inversiones│  │  Coberturas │         │
│  │  (Prophet)  │  │  (CETES,    │  │  (Forward,  │         │
│  │             │  │   Pagarés)  │  │   Opciones) │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE DATOS                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Histórico  │  │  Tipos de   │  │  Catálogo   │         │
│  │  Bancario   │  │  Cambio     │  │ Proveedores │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Algoritmos Específicos

#### Algoritmo 1: Proyección de Flujo de Efectivo

```python
def proyectar_flujo_efectivo(
    saldo_inicial: float,
    entradas_proyectadas: list,
    salidas_proyectadas: list,
    periodo: str = 'semanal'
) -> dict:
    """
    Proyecta flujo de efectivo para un periodo determinado.
    
    Args:
        saldo_inicial: Saldo inicial de efectivo en caja y bancos
        entradas_proyectadas: Lista de dicts con {'concepto': str, 'monto': float, 'fecha': date}
        salidas_proyectadas: Lista de dicts con {'concepto': str, 'monto': float, 'fecha': date, 'proveedor': str}
        periodo: 'semanal', 'quincenal' o 'mensual'
    
    Returns:
        Diccionario con proyección de saldo por periodo y alertas de déficit
    
    Ejemplo:
        >>> proyeccion = proyectar_flujo_efectivo(
        ...     saldo_inicial=100000,
        ...     entradas_proyectadas=[{'concepto': 'Ventas', 'monto': 50000, 'fecha': '2026-03-15'}],
        ...     salidas_proyectadas=[{'concepto': 'Proveedor A', 'monto': 30000, 'fecha': '2026-03-10', 'proveedor': 'Prov A'}]
        ... )
    """
    from datetime import datetime, timedelta
    
    # Ordenar entradas y salidas por fecha
    entradas_ordenadas = sorted(entradas_proyectadas, key=lambda x: x['fecha'])
    salidas_ordenadas = sorted(salidas_proyectadas, key=lambda x: x['fecha'])
    
    # Combinar todos los movimientos
    movimientos = []
    for entrada in entradas_ordenadas:
        movimientos.append({
            'tipo': 'entrada',
            'concepto': entrada['concepto'],
            'monto': entrada['monto'],
            'fecha': entrada['fecha']
        })
    
    for salida in salidas_ordenadas:
        movimientos.append({
            'tipo': 'salida',
            'concepto': salida['concepto'],
            'monto': -salida['monto'],
            'fecha': salida['fecha'],
            'proveedor': salida.get('proveedor', '')
        })
    
    # Ordenar por fecha
    movimientos = sorted(movimientos, key=lambda x: x['fecha'])
    
    # Calcular saldo proyectado por periodo
    saldo_actual = saldo_inicial
    proyeccion_por_periodo = []
    alertas_deficit = []
    saldo_minimo_recomendado = saldo_inicial * 0.2  # 20% del saldo inicial como colchón
    
    for movimiento in movimientos:
        saldo_anterior = saldo_actual
        saldo_actual += movimiento['monto']
        
        # Verificar si hay déficit
        if saldo_actual < 0:
            alertas_deficit.append({
                'fecha': movimiento['fecha'],
                'concepto': movimiento['concepto'],
                'monto': movimiento['monto'],
                'saldo_proyectado': round(saldo_actual, 2),
                'severidad': 'CRÍTICA' if saldo_actual < -saldo_inicial * 0.5 else 'ALTA'
            })
        elif saldo_actual < saldo_minimo_recomendado:
            alertas_deficit.append({
                'fecha': movimiento['fecha'],
                'concepto': movimiento['concepto'],
                'monto': movimiento['monto'],
                'saldo_proyectado': round(saldo_actual, 2),
                'severidad': 'MEDIA'
            })
        
        proyeccion_por_periodo.append({
            'fecha': movimiento['fecha'],
            'tipo': movimiento['tipo'],
            'concepto': movimiento['concepto'],
            'monto': movimiento['monto'],
            'saldo_anterior': round(saldo_anterior, 2),
            'saldo_actual': round(saldo_actual, 2)
        })
    
    return {
        'saldo_inicial': saldo_inicial,
        'saldo_final_proyectado': round(saldo_actual, 2),
        'total_entradas': sum(m['monto'] for m in movimientos if m['tipo'] == 'entrada'),
        'total_salidas': abs(sum(m['monto'] for m in movimientos if m['tipo'] == 'salida')),
        'proyeccion_por_periodo': proyeccion_por_periodo,
        'alertas_deficit': alertas_deficit,
        'recomendacion': 'Negociar financiamiento' if alertas_deficit else 'Posición saludable'
    }
```

#### Algoritmo 2: Cálculo de Cobertura Forward

```python
def calcular_cobertura_forward(
    monto_usd: float,
    tipo_cambio_contado: float,
    tipo_cambio_forward: float,
    dias_plazo: int,
    es_importador: bool = True
) -> dict:
    """
    Calcula el costo/beneficio de una cobertura forward.
    
    Args:
        monto_usd: Monto en dólares a cubrir
        tipo_cambio_contado: Tipo de cambio spot actual
        tipo_cambio_forward: Tipo de cambio forward pactado
        dias_plazo: Días hasta vencimiento del forward
        es_importador: True si es importador (compra USD), False si es exportador (venta USD)
    
    Returns:
        Diccionario con análisis de cobertura y escenario de mercado
    
    Ejemplo:
        >>> cobertura = calcular_cobertura_forward(
        ...     monto_usd=100000,
        ...     tipo_cambio_contado=17.50,
        ...     tipo_cambio_forward=17.80,
        ...     dias_plazo=90,
        ...     es_importador=True
        ... )
    """
    # Costo de la cobertura (diferencial forward)
    diferencial = tipo_cambio_forward - tipo_cambio_contado
    porcentaje_diferencial = (diferencial / tipo_cambio_contado) * 100
    
    # Escenario 1: Tipo de cambio al vencimiento (supuesto)
    # Se asume que el forward es predictor del spot futuro
    tipo_cambio_esperado_vencimiento = tipo_cambio_forward
    
    # Costo/beneficio para importador
    if es_importador:
        # Importador compra USD al forward
        costo_en_pesos_forward = monto_usd * tipo_cambio_forward
        costo_en_pesos_sin_cobertura = monto_usd * tipo_cambio_contado
        
        # Si el spot sube, el forward protege
        ahorro_si_spot_sube_10 = monto_usd * (tipo_cambio_contado * 1.10 - tipo_cambio_forward)
        perdida_si_spot_baja_10 = monto_usd * (tipo_cambio_forward - tipo_cambio_contado * 0.90)
        
        recomendacion = 'Cobertura recomendada' if ahorro_si_spot_sube_10 > perdida_si_spot_baja_10 else 'Evaluar opciones'
        
        return {
            'monto_usd': monto_usd,
            'tipo_cambio_contado': tipo_cambio_contado,
            'tipo_cambio_forward': tipo_cambio_forward,
            'diferencial_puntos': round(diferencial * 10000, 2),  # En puntos base
            'porcentaje_diferencial': round(porcentaje_diferencial, 2),
            'costo_en_pesos_forward': round(costo_en_pesos_forward, 2),
            'ahorro_si_spot_sube_10': round(ahorro_si_spot_sube_10, 2),
            'perdida_si_spot_baja_10': round(perdida_si_spot_baja_10, 2),
            'recomendacion': recomendacion,
            'interpretacion': f"Al cubrir a {tipo_cambio_forward}, se fija el costo máximo en ${costo_en_pesos_forward:,.2f} MXN"
        }
    else:
        # Exportador vende USD al forward
        ingresos_en_pesos_forward = monto_usd * tipo_cambio_forward
        ingresos_en_pesos_sin_cobertura = monto_usd * tipo_cambio_contado
        
        # Si el spot baja, el forward protege
        proteccion_si_spot_baja_10 = monto_usd * (tipo_cambio_forward - tipo_cambio_contado * 0.90)
        costo_oportunidad_si_spot_sube_10 = monto_usd * (tipo_cambio_contado * 1.10 - tipo_cambio_forward)
        
        recomendacion = 'Cobertura recomendada' if proteccion_si_spot_baja_10 > costo_oportunidad_si_spot_sube_10 else 'Evaluar opciones'
        
        return {
            'monto_usd': monto_usd,
            'tipo_cambio_contado': tipo_cambio_contado,
            'tipo_cambio_forward': tipo_cambio_forward,
            'diferencial_puntos': round(diferencial * 10000, 2),
            'porcentaje_diferencial': round(porcentaje_diferencial, 2),
            'ingresos_en_pesos_forward': round(ingresos_en_pesos_forward, 2),
            'proteccion_si_spot_baja_10': round(proteccion_si_spot_baja_10, 2),
            'costo_oportunidad_si_spot_sube_10': round(costo_oportunidad_si_spot_sube_10, 2),
            'recomendacion': recomendacion,
            'interpretacion': f"Al cubrir a {tipo_cambio_forward}, se aseguran ingresos de ${ingresos_en_pesos_forward:,.2f} MXN"
        }
```

#### Algoritmo 3: Optimización de Inversión de Excedentes

```python
def optimizar_inversion_excedentes(
    monto_excedente: float,
    dias_disponibilidad: int,
    perfil_riesgo: str = 'conservador'
) -> list:
    """
    Recomienda instrumentos de inversión para excedentes de efectivo.
    
    Args:
        monto_excedente: Monto disponible para invertir
        dias_disponibilidad: Días que el dinero puede estar invertido
        perfil_riesgo: 'conservador', 'moderado' o 'agresivo'
    
    Returns:
        Lista de recomendaciones de inversión ordenadas por rendimiento esperado
    
    Ejemplo:
        >>> recomendaciones = optimizar_inversion_excedentes(
        ...     monto_excedente=500000,
        ...     dias_disponibilidad=91,
        ...     perfil_riesgo='conservador'
        ... )
    """
    # Tasas de referencia 2026 (fuente: Banxico, Cetes Directo)
    instrumentos = [
        {
            'nombre': 'CETES 28 días',
            'tipo': 'Deuda Gubernamental',
            'plazo_minimo': 28,
            'plazo_maximo': 28,
            'tasa_bruta_anual': 0.095,  # 9.5%
            'riesgo': 'Mínimo',
            'liquidez': 'Alta (vencimiento 28 días)',
            'monto_minimo': 100,
            'retencion_isr': 0.009  # 0.90% retención 2026
        },
        {
            'nombre': 'CETES 91 días',
            'tipo': 'Deuda Gubernamental',
            'plazo_minimo': 91,
            'plazo_maximo': 91,
            'tasa_bruta_anual': 0.098,  # 9.8%
            'riesgo': 'Mínimo',
            'liquidez': 'Media (vencimiento 91 días)',
            'monto_minimo': 100,
            'retencion_isr': 0.009
        },
        {
            'nombre': 'CETES 182 días',
            'tipo': 'Deuda Gubernamental',
            'plazo_minimo': 182,
            'plazo_maximo': 182,
            'tasa_bruta_anual': 0.095,  # 9.5%
            'riesgo': 'Mínimo',
            'liquidez': 'Media (vencimiento 182 días)',
            'monto_minimo': 100,
            'retencion_isr': 0.009
        },
        {
            'nombre': 'Pagaré Bancario 30 días',
            'tipo': 'Deuda Bancaria',
            'plazo_minimo': 30,
            'plazo_maximo': 365,
            'tasa_bruta_anual': 0.085,  # 8.5%
            'riesgo': 'Bajo',
            'liquidez': 'Baja (penalización por retiro anticipado)',
            'monto_minimo': 50000,
            'retencion_isr': 0.009
        },
        {
            'nombre': 'Fondo de Inversión Deuda Corto Plazo',
            'tipo': 'Fondo de Inversión',
            'plazo_minimo': 1,
            'plazo_maximo': 9999,
            'tasa_bruta_anual': 0.088,  # 8.8%
            'riesgo': 'Bajo',
            'liquidez': 'Alta (disponible 24-48 hrs)',
            'monto_minimo': 1000,
            'retencion_isr': 0.009
        },
        {
            'nombre': 'Bono M 1 año',
            'tipo': 'Deuda Gubernamental',
            'plazo_minimo': 365,
            'plazo_maximo': 365,
            'tasa_bruta_anual': 0.092,  # 9.2%
            'riesgo': 'Mínimo',
            'liquidez': 'Media (mercado secundario)',
            'monto_minimo': 100,
            'retencion_isr': 0.009
        }
    ]
    
    # Filtrar instrumentos por plazo y monto
    instrumentos_elegibles = [
        inst for inst in instrumentos
        if inst['plazo_minimo'] <= dias_disponibilidad <= inst['plazo_maximo']
        and inst['monto_minimo'] <= monto_excedente
    ]
    
    # Filtrar por perfil de riesgo
    if perfil_riesgo == 'conservador':
        instrumentos_elegibles = [
            inst for inst in instrumentos_elegibles
            if inst['riesgo'] in ['Mínimo', 'Bajo']
        ]
    elif perfil_riesgo == 'moderado':
        instrumentos_elegibles = [
            inst for inst in instrumentos_elegibles
            if inst['riesgo'] in ['Mínimo', 'Bajo', 'Medio']
        ]
    # Agresivo incluye todos
    
    # Calcular rendimiento neto para cada instrumento
    for inst in instrumentos_elegibles:
        dias_inversion = min(dias_disponibilidad, inst['plazo_maximo'])
        rendimiento_bruto = monto_excedente * inst['tasa_bruta_anual'] * (dias_inversion / 365)
        retencion_isr = rendimiento_bruto * inst['retencion_isr'] * (dias_inversion / 365)
        rendimiento_neto = rendimiento_bruto - retencion_isr
        inst['rendimiento_neto_esperado'] = round(rendimiento_neto, 2)
        inst['tasa_neta_anual'] = round(inst['tasa_bruta_anual'] * (1 - inst['retencion_isr']), 4)
    
    # Ordenar por rendimiento neto
    instrumentos_ordenados = sorted(
        instrumentos_elegibles,
        key=lambda x: x['rendimiento_neto_esperado'],
        reverse=True
    )
    
    return instrumentos_ordenados
```

### 3.3 Thresholds y Parámetros Óptimos
| Parámetro | Valor Recomendado | Rango Aceptable | Justificación |
|-----------|-------------------|-----------------|---------------|
| **Saldo mínimo de seguridad** | 20% de egresos mensuales | 15-30% | Colchón para imprevistos |
| **Umbral alerta déficit** | 7 días antes del déficit | 5-14 días | Tiempo para negociar financiamiento |
| **Plazo máximo inversión** | 91 días | 28-182 días | Balance entre liquidez y rendimiento |
| **Diferencial forward máximo** | 3% anual | 1-5% | Costo razonable de cobertura |
| **Concentración máxima por banco** | 40% de excedentes | 30-50% | Diversificación de riesgo bancario |

### 3.4 Integración con NVIDIA NIM
| Modelo | Uso | Costo | Latencia | Configuración |
|--------|-----|-------|----------|---------------|
| **meta/llama-3.1-70b-instruct** | Recomendaciones de inversión | $0.0007/1K tokens | ~150ms | Temperature 0.5, max_tokens 400 |
| **nvidia/nemotron-4-340b-instruct** | Análisis de escenarios cambiarios | $0.0014/1K tokens | ~200ms | Temperature 0.3, max_tokens 800 |
| **mistralai/mistral-large-2407** | Resumen ejecutivo de posición | $0.0004/1K tokens | ~100ms | Temperature 0.3, max_tokens 250 |

### 3.5 Endpoints Requeridos (Backend)
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/v1/tesoreria/posicion` | Obtener posición actual de caja | ✅ JWT |
| POST | `/v1/tesoreria/proyeccion` | Generar proyección de flujo | ✅ JWT |
| GET | `/v1/tesoreria/coberturas` | Listar coberturas activas | ✅ JWT |
| POST | `/v1/tesoreria/coberturas/simular` | Simular cobertura forward | ✅ JWT |
| GET | `/v1/tesoreria/inversiones/recomendadas` | Obtener recomendaciones de inversión | ✅ JWT |
| POST | `/v1/tesoreria/pagos/programar` | Programar pagos a proveedores | ✅ JWT |

### 3.6 Componentes Requeridos (Frontend)
| Componente | Tipo | Propósito |
|------------|------|-----------|
| `TesoreriaDashboard.tsx` | UI Component | Dashboard de posición de caja |
| `ProyeccionFlujoChart.tsx` | UI Component | Gráfico de proyección 13 semanas |
| `CoberturasPanel.tsx` | UI Component | Panel de coberturas cambiarias |
| `InversionesRecomendadas.tsx` | UI Component | Lista de instrumentos recomendados |
| `useTesoreriaStore.ts` | Hook | Estado global de tesorería |
| `tesoreriaService.ts` | Service | Llamadas a API de tesorería |

---

## 4. Limitantes y Restricciones

### 4.1 Limitación 1: Open Banking Limitado en México
**Problema:**
A diferencia de Europa (PSD2) o Brasil (Open Banking), México tiene implementación limitada de Open Banking. BBVA y Santander ofrecen APIs, pero con alcance reducido y requisitos de certificación complejos.

**Solución:**
```python
# Estrategia híbrida: API cuando esté disponible, upload manual como fallback
def obtener_saldo_bancario(banco: str, cuenta: str) -> dict:
    """
    Obtiene saldo bancario vía API o upload manual.
    """
    bancos_con_api = ['BBVA', 'Santander', 'Banorte']
    
    if banco in bancos_con_api:
        try:
            # Intentar API
            saldo = llamar_api_banco(banco, cuenta)
            return {'fuente': 'API', 'saldo': saldo, 'fecha': datetime.now()}
        except Exception as e:
            # Fallback a manual
            return {'fuente': 'Manual', 'error': str(e), 'requiere_upload': True}
    else:
        # Banco sin API
        return {'fuente': 'Manual', 'requiere_upload': True}
```

**Impacto:**
- Requiere proceso manual de upload de estados de cuenta para bancos sin API
- Actualización de saldos puede tener delay de 24-48 horas

### 4.2 Limitación 2: Volatilidad Cambiaria Impredecible
**Problema:**
El USD/MXN es una de las divisas más líquidas y volátiles del mundo emergente. Factores geopolíticos (T-MEC, elecciones EE.UU.) pueden causar movimientos de 5-10% en días.

**Solución:**
- Usar coberturas escalonadas (no concentrar todo en un solo forward)
- Combinar forwards (certidumbre) con opciones (flexibilidad)
- Monitorear VRP (Volatility Risk Premium) para identificar coberturas "baratas"

**Impacto:**
- Coberturas pueden resultar en costo de oportunidad si el spot se mueve favorablemente
- Requiere educación del cliente sobre trade-offs de coberturas

### 4.3 Riesgos Técnicos Identificados
| Riesgo | Probabilidad | Impacto | Mitigación | Owner |
|--------|--------------|---------|------------|-------|
| **APIs bancarias inestables** | ALTA | MEDIO | Implementar fallback manual + retry logic | Backend Lead |
| **Error en cálculo de forward** | MEDIA | ALTO | Validar con 2+ bancos antes de mostrar | Tech Lead |
| **Cambio en retención ISR CETES** | BAJA | MEDIO | Monitorear Paquete Económico trimestralmente | Product Owner |
| **Proyección incorrecta de flujo** | MEDIA | ALTO | Validar con histórico, ajustar modelo mensualmente | AI Engineer |

---

## 5. Métricas Esperadas

| Métrica | Target | Fórmula | Medición | Frecuencia |
|---------|--------|---------|----------|------------|
| **Precisión proyección flujo** | 85%+ | `(1 - MAPE) × 100` | Por proyección 13 semanas | Semanal |
| **Tiempo en conciliación** | <10 min/día | `tiempo_total / días` | Por usuario | Diario |
| **Rendimiento excedentes** | 8.5%+ neto anual | `(rendimiento / promedio_invertido) × 100` | Por cartera | Mensual |
| **Coberturas activas** | 60%+ de exposición | `(monto_cubierto / exposición_total) × 100` | Por cliente | Mensual |

### 5.1 Criterios de Aceptación
- [ ] **Criterio 1:** La proyección de flujo tiene MAPE <15% para 4 semanas adelante
- [ ] **Criterio 2:** Las alertas de déficit se generan con 7+ días de anticipación
- [ ] **Criterio 3:** El cálculo de forward coincide con cotizaciones bancarias (±0.5%)
- [ ] **Criterio 4:** Las recomendaciones de inversión consideran retención ISR 2026 (0.90%)
- [ ] **Criterio 5:** El dashboard se actualiza en <3 segundos con 1000+ movimientos

---

## 6. Roadmap de Implementación

### Fase 1: MVP (8 semanas)

**Fecha de inicio:** 15 de abril de 2026
**Fecha de fin:** 10 de junio de 2026
**Owner:** Backend Lead

| Semana | Entregable | Owner | Dependencias | Criterio de Éxito |
|--------|------------|-------|--------------|-------------------|
| **1-2** | Modelos SQLAlchemy + APIs básicas | Backend Dev | Investigación completada | CRUD de tesorería funcional |
| **3-4** | Proyección de flujo (Prophet) | AI Engineer | Algoritmos validados | MAPE <15% en testing |
| **5-6** | Calculadora de coberturas | Backend Dev | APIs de tipo de cambio | Coincide con bancos (±0.5%) |
| **7-8** | Dashboard frontend | Frontend Dev | APIs documentadas | UI/UX aprobada por diseño |

### 6.1 Dependencias Críticas
- [ ] **API Banxico tipo de cambio:** Requerida para coberturas y proyecciones
- [ ] **Integración con módulo contable:** Necesaria para obtener histórico de movimientos
- [ ] **Validación con tesorero certificado:** Validar algoritmos antes de producción

### 6.2 Recursos Requeridos
| Recurso | Tipo | Cantidad | Owner |
|---------|------|----------|-------|
| **Backend Developer** | Humano | 1 FTE × 8 semanas | Tech Lead |
| **AI Engineer** | Humano | 0.5 FTE × 4 semanas | Tech Lead |
| **Frontend Developer** | Humano | 0.5 FTE × 4 semanas | Tech Lead |
| **Tesorero Certificado** | Validación | 8 horas | Product Owner |

---

## 7. Seguridad y Cumplimiento

### 7.1 Requisitos SAT para Sistemas Contables
| Requisito | Descripción | Impacto en Módulo |
|-----------|-------------|-------------------|
| **Integridad de datos** | Los movimientos bancarios no deben modificarse sin auditoría | Implementar logs de cambios |
| **Trazabilidad** | Cada conciliación debe tener usuario y fecha | Campos created_by, updated_at |
| **Respaldo** | Backups diarios de movimientos | Integración con sistema de backups |
| **NIF B-2** | Estado de Flujos de Efectivo | Clasificar flujos correctamente |

### 7.2 Mejores Prácticas de Seguridad
| Capa | Medida | Implementación |
|------|--------|----------------|
| **Datos** | Encriptación AES-256 | AWS KMS / Azure Key Vault |
| **Acceso** | 2FA obligatorio para transferencias | Auth0 / AWS Cognito |
| **Auditoría** | Logs de todos los movimientos | ELK Stack / CloudWatch |

### 7.3 Consideraciones de Privacidad
- [ ] **Datos bancarios sensibles:** Encriptar en reposo y tránsito
- [ ] **Acceso por rol:** Solo tesoreros autorizados pueden ver saldos completos
- [ ] **Retención:** Eliminar datos de clientes cancelados después de 5 años

### 7.4 Multas por Incumplimiento
| Incumplimiento | Multa | Autoridad |
|----------------|-------|-----------|
| **No conciliar cuentas** | $8,000 - $16,000 MXN | SAT |
| **No conservar estados de cuenta 5 años** | $14,000 - $28,000 MXN | SAT |
| **Modificar movimientos sin auditoría** | $20,000 - $40,000 MXN | SAT |

---

## 8. Conclusiones y Recomendaciones

### 8.1 Hallazgos Clave
1. **Diferencial de tasas 513 pb**: Oportunidad de optimización de deuda y rendimientos para empresas con flujos en USD
2. **Coberturas "baratas"**: VRP negativa en febrero 2026 sugiere momento favorable para comprar coberturas
3. **CETES con retención 0.90%**: Rendimiento neto de ~8.9% anual sigue siendo atractivo vs. inflación de 4-4.5%
4. **Proyección 13 semanas**: Horizonte óptimo para anticipar déficits y negociar financiamiento oportuno
5. **Open Banking limitado**: Priorizar upload manual + OCR sobre integración API directa

### 8.2 Recomendaciones Finales
| Área | Recomendación | Prioridad | Owner |
|------|---------------|-----------|-------|
| **Implementación** | Comenzar con MVP (proyección + dashboard) | ALTA | Tech Lead |
| **Validación** | Validar con tesorero certificado antes de producción | ALTA | Product Owner |
| **Integración** | Conectar con módulo contable para histórico | ALTA | Backend Lead |
| **Capacitación** | Desarrollar tutorial de coberturas para usuarios | MEDIA | UX Lead |

### 8.3 Próximos Pasos
- [ ] **Validar algoritmos con tesorero:** 21 de abril de 2026
- [ ] **Completar MVP (Fase 1):** 10 de junio de 2026
- [ ] **Testing con usuarios beta:** 15 de junio de 2026
- [ ] **Lanzamiento producción:** 1 de julio de 2026

---

## 9. Fuentes Consultadas

### Fuentes Oficiales (Consultadas con Tavily)
| Fuente | URL | Fecha de Consulta |
|--------|-----|-------------------|
| **Banxico - Tipos de Cambio Forward** | https://www.banxico.org.mx/ | 10-mar-2026 |
| **Cetes Directo** | https://www.cetesdirecto.com/ | 10-mar-2026 |
| **SAT - RMF 2026** | https://www.sat.gob.mx/ | 10-mar-2026 |
| **CINIF - NIF B-2** | https://www.cinif.org.mx/ | 10-mar-2026 |
| **CIEP - Paquete Económico 2026** | https://ciep.mx/implicaciones-del-paquete-economico-2026/ | 10-mar-2026 |

### Fuentes Técnicas
| Fuente | URL | Fecha de Consulta |
|--------|-----|-------------------|
| **Prophet (Facebook)** | https://facebook.github.io/prophet/ | 10-mar-2026 |
| **NVIDIA NIM** | https://build.nvidia.com/ | 10-mar-2026 |
| **Kyriba** | https://kyriba.com/ | 10-mar-2026 |
| **Trovata** | https://trovata.io/ | 10-mar-2026 |

### Fuentes de Mercado
| Fuente | URL | Fecha de Consulta |
|--------|-----|-------------------|
| **Hablando de Negocios - Diferencial de Tasas** | https://www.hablandodenegocios.com.mx/diferencial-de-tasas-mexico-ee-uu-2026-estrategias-de-tesoreria-para-cfos | 10-mar-2026 |
| **Cofers - Flujo de Efectivo PYME** | https://cofers.mx/blog/como-crear-un-flujo-de-efectivo-proyectado-ejemplo-para-pymes/ | 10-mar-2026 |
| **BBVA - Flujo de Efectivo** | https://www.bbva.mx/educacion-financiera/creditos/credito-pyme/credito-pyme-que-es-flujo-de-efectivo.html | 10-mar-2026 |
| **Xepelin - Rendimientos Excedentes** | https://xepelin.com/blog/pymes/generar-rendimientos-diarios | 10-mar-2026 |
| **Cetes.app - Rendimiento 2026** | https://cetes.app/educacion/rendimiento-cetes-2026-tasas-actuales | 10-mar-2026 |
| **El Imparcial - ISR CETES 2026** | https://www.elimparcial.com/dinero/2026/03/09/sat-y-cetes-en-2026-el-monto-de-inversion-que-puede-obligarte-a-pagar-impuestos/ | 10-mar-2026 |
| **Banco BASE - Coberturas Forward** | https://blog.bancobase.com/forwards_paraempresas | 10-mar-2026 |
| **Monex - Volatilidad USD/MXN** | https://www.monex.com.mx/portal/download/reportes/Volatilidad%20MXN%20250226.pdf | 10-mar-2026 |
| **Just2Trade - Pronóstico Dólar 2026** | https://j2t.com/es/solutions/blogview/pronostico-dolar-mexico/ | 10-mar-2026 |
| **Cofide - Gestión de Tesorería** | https://www.cofide.mx/blog/gestion-de-tesoreria-como-realizarla-efectivamente | 10-mar-2026 |
| **Stripe - Cash Flow Management** | https://stripe.com/es/resources/more/managing-cash-flow-for-small-businesses | 10-mar-2026 |
| **PNC - Client Payments** | https://www.pnc.com/insights/es/small-business/manage-business-finances/managing-client-payments-and-invoicing-for-better-cash-flow.html | 10-mar-2026 |

---

## 10. Control de Cambios

| Versión | Fecha | Autor | Tipo | Cambios Realizados | Sección Afectada |
|---------|-------|-------|------|-------------------|------------------|
| 1.0 | 10-mar-2026 | Diego Gzz | Creación | Versión inicial del documento | Todo el documento |

---

**Documento elaborado por:** Diego Gzz (Principal Engineering Lead)
**Fecha:** 10 de marzo de 2026
**Revisado por:** Por revisar
**Aprobado por:** Por aprobar
**Próxima actualización:** Después de implementación de Fase 1 (junio 2026)

---

*Fin de la Investigación de Tesorería y Flujo de Efectivo*
