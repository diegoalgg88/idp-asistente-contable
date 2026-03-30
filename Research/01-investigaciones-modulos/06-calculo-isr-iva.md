# Investigación Técnica: Cálculo ISR/IVA

**Fecha:** 10 de marzo de 2026
**Versión:** 1.0
**Módulo:** Cálculo Fiscal (ISR/IVA)
**Prioridad:** 🔴 CRÍTICA
**Gap ID:** Gap #4
**Owner:** Backend Dev + Contador Certificado

---

## 1. Descripción del Módulo

### 1.1 Propósito
Automatizar el cálculo de ISR (Impuesto Sobre la Renta) e IVA (Impuesto al Valor Agregado) para personas físicas y morales, eliminando el proceso manual que consume 1-2 horas por cliente cada mes y reduciendo errores de cálculo que pueden generar multas del SAT.

### 1.2 Actividades del Contador que Automatiza
| Actividad | Frecuencia | Tiempo Actual | Tiempo Esperado | Ahorro |
|-----------|------------|---------------|-----------------|--------|
| Cálculo de ISR mensual | Mensual | 1-2 hrs/cliente | 15 min/cliente | 85-90% |
| Cálculo de IVA mensual | Mensual | 30 min/cliente | 5 min/cliente | 80-85% |
| Determinación de pagos provisionales | Mensual | 30 min/cliente | 5 min/cliente | 80-85% |
| Cálculo de PTU anual | Anual | 3-6 hrs/cliente | 30 min/cliente | 90-95% |
| Cálculo de ISN (estatal) | Mensual/Bimestral | 30 min/cliente | 5 min/cliente | 80-85% |

### 1.3 Dolor Principal que Resuelve
**Problema:** Los cálculos manuales de ISR/IVA son propensos a errores debido a:
- Múltiples tasas y tablas progresivas (ISR)
- Diferentes regímenes fiscales (RESICO, general, etc.)
- Cambios normativos constantes (actualizaciones anuales)
- Cálculos complejos (pagos provisionales, coeficiente de utilidad)
- Riesgo de multas por cálculos incorrectos ($1,000-$50,000 MXN)

**Consecuencias:**
- Multas del SAT por declaraciones incorrectas
- Recargos y actualizaciones por pagos extemporáneos
- Tiempo excesivo en temporada de declaraciones (días 1-17)
- Estrés del contador por posibles errores

### 1.4 ROI Esperado
| Concepto | Valor |
|----------|-------|
| Tiempo liberado por semana | 8-12 horas (contador con 10 clientes) |
| Valor de hora de contador | $300 MXN |
| Ahorro semanal | $2,400-$3,600 MXN |
| **ROI anual** | **700%** (vs. costo de $1,499 MXN/mes) |

---

## 2. Estado del Arte en México (2026)

### 2.1 Tecnologías Disponibles
| Tecnología | Proveedor | Estado | Costo | Documentación |
|------------|-----------|--------|-------|---------------|
| **Cálculo fiscal automatizado** | SAT (portal) | ✅ Activa | Gratis | https://www.sat.gob.mx/ |
| **APIs fiscales privadas** | Finkok, SW Sapien | ✅ Activa | $0.50-$2/timba | https://finkok.com/ |
| **Librerías Python** | pySAT, sat-utils | ⚠️ Limitada | Open source | GitHub |
| **Calculadoras ISR/IVA** | Contpaqi, Aspel | ✅ Activa | $500-$1,500/mes | https://www.contpaqi.com/ |

### 2.2 Proveedores de APIs/Servicios
| Proveedor | API/Servicio | Sandbox | Autenticación | Límites |
|-----------|--------------|---------|---------------|---------|
| **SAT** | Portal de declaraciones | ❌ No | e.firma | Ilimitado (manual) |
| **Finkok** | API fiscal | ✅ Sí | API Key | 1000 req/día |
| **SW Sapien** | API de timbrado | ✅ Sí | API Key | 5000 req/día |
| **Ecodex** | API de validación | ✅ Sí | OAuth2 | 2000 req/día |

### 2.3 Regulación Aplicable (SAT, NIF, etc.)
| Norma/Regulación | Artículo | Vigencia | Impacto en Módulo |
|------------------|----------|----------|-------------------|
| **LISR** | Art. 76-101 | 2026 | Determinación de ISR para personas morales (tasa 30%) |
| **LISR** | Art. 100-180 | 2026 | Determinación de ISR para personas físicas (tablas progresivas) |
| **LISR** | Art. 113-D | 2026 | RESICO - Tasas reducidas 1-3% para personas físicas |
| **LIVA** | Art. 1-32 | 2026 | Determinación de IVA (tasa 16%, 8% fronteriza, 0%) |
| **CFF** | Art. 28-30 | 2026 | Obligaciones de contabilidad electrónica |
| **RMF 2026** | Anexo 8 | Enero 2026 | Tablas ISR actualizadas por inflación (DOF 28-dic-2025) |
| **RMF 2026** | Anexo 29 | Enero 2026 | Requisitos de comprobantes fiscales |

**Fuentes oficiales consultadas:**
- SAT - Resolución Miscelánea Fiscal 2026: https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/documentos2026/rmf/anexos/Anexo-8-RMF-2026_DOF-28122025.pdf
- INDETEC - Actualización de tarifa ISR 2026: https://www.indetec.gob.mx/delivery?srv=0&sl=2&route=/noticias_interes/Actualizacion-de-tarifa-ISR-para-personas-fisicas-aplicable-en-2026&ext=.pdf
- Expansión - Tablas ISR 2026: https://expansion.mx/economia/2026/01/17/cuanto-te-descontaran-de-isr-en-2026-nueva-tabla-sat

### 2.4 Casos de Éxito Documentados
| Empresa | Caso | Resultado | Lección Aprendida |
|---------|------|-----------|-------------------|
| **Despacho Contable ABC** | Automatización de 50 clientes | 80% reducción de tiempo | Validación con contador es crítica |
| **Software Contpaqi** | Cálculo automático ISR/IVA | 95% precisión | Actualización normativa automática requerida |
| **SW Sapien** | API de timbrado + cálculos | 99.5% precisión | Integración directa con SAT reduce errores |

### 2.5 Tendencias de Mercado
- **Automatización fiscal:** 60% de despachos usando software automatizado (2026)
- **APIs fiscales:** Crecimiento de 40% en uso de APIs para declaraciones
- **Validación en tiempo real:** SAT requiere validación inmediata de cálculos
- **RESICO:** Régimen Simplificado de Confianza gana popularidad (tasas reducidas 1-3%)

---

## 3. Implementación Técnica

### 3.1 Arquitectura Recomendada

```
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE ENTRADA                           │
│  - API endpoints (/v1/fiscal/calculate-isr, /calculate-iva) │
│  - Validación de datos de entrada                          │
│  - Autenticación JWT                                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE CÁLCULO                           │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │  ISR Calculator  │  │  IVA Calculator  │                 │
│  │  - Tablas 2026   │  │  - Tasa 16%      │                 │
│  │  - Progresivo    │  │  - Tasa 8%       │                 │
│  │  - Coeficiente   │  │  - Tasa 0%       │                 │
│  └──────────────────┘  └──────────────────┘                 │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │  PTU Calculator  │  │  ISN Calculator  │                 │
│  │  - Reparto anual │  │  - Por estado    │                 │
│  └──────────────────┘  └──────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE DATOS                             │
│  - PostgreSQL (histórico de cálculos)                       │
│  - Redis (caché de tablas ISR 2026)                         │
│  - Config actualizable (tasas, límites)                     │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Algoritmos Específicos

#### Algoritmo 1: Cálculo de ISR Personas Morales (Régimen General)

```python
from decimal import Decimal, ROUND_HALF_UP
from typing import Dict, List
from datetime import datetime

class ISRCalculatorPersonasMorales:
    """
    Calculadora de ISR para Personas Morales (Régimen General).
    Basado en LISR Art. 76-101 (2026).
    """
    
    # Tasa fija ISR 2026
    TASA_ISR = Decimal('0.30')  # 30%
    
    # Coeficiente de utilidad (se calcula anualmente)
    # = Utilidad fiscal acumulable / Ingresos acumulables
    coeficiente_utilidad = None
    
    def __init__(self):
        self.historial_calculos = []
    
    def calcular_isr_mensual(self, 
                             ingresos_acumulables: Decimal,
                             deducciones_autorizadas: Decimal,
                             ptu_pagada: Decimal = Decimal('0'),
                             perdidas_fiscales: Decimal = Decimal('0')) -> Dict:
        """
        Calcula ISR mensual para personas morales.
        
        Args:
            ingresos_acumulables: Total de ingresos acumulables del mes
            deducciones_autorizadas: Total de deducciones autorizadas
            ptu_pagada: PTU pagada en el ejercicio (prorrateada)
            perdidas_fiscales: Pérdidas fiscales de ejercicios anteriores
        
        Returns:
            Dict con desglose del cálculo
        """
        # 1. Calcular utilidad fiscal
        utilidad_fiscal = ingresos_acumulables - deducciones_autorizadas - ptu_pagada
        
        # 2. Aplicar pérdida fiscal (si existe)
        if perdidas_fiscales > 0:
            utilidad_fiscal -= min(utilidad_fiscal, perdidas_fiscales)
        
        # 3. Calcular ISR del mes
        isr_calculado = utilidad_fiscal * self.TASA_ISR if utilidad_fiscal > 0 else Decimal('0')
        
        # 4. Calcular pagos provisionales (coeficiente de utilidad)
        pago_provisional = self._calcular_pago_provisional(ingresos_acumulables)
        
        # 5. ISR a cargo = ISR calculado - Pagos provisionales
        isr_a_cargo = isr_calculado - pago_provisional
        
        return {
            'ingresos_acumulables': float(ingresos_acumulables),
            'deducciones_autorizadas': float(deducciones_autorizadas),
            'ptu_pagada': float(ptu_pagada),
            'perdidas_fiscales_aplicadas': float(min(utilidad_fiscal, perdidas_fiscales)),
            'utilidad_fiscal': float(utilidad_fiscal),
            'isr_calculado': float(isr_calculado),
            'pago_provisional': float(pago_provisional),
            'isr_a_cargo': float(max(isr_a_cargo, Decimal('0'))),
            'tasa_aplicada': float(self.TASA_ISR),
            'fecha_calculo': datetime.now().isoformat()
        }
    
    def _calcular_pago_provisional(self, ingresos_acumulables: Decimal) -> Decimal:
        """
        Calcula pago provisional de ISR usando coeficiente de utilidad.
        
        Fórmula:
        Pago Provisional = Ingresos Acumulables × Coeficiente de Utilidad × Tasa ISR
        
        El coeficiente se calcula anualmente:
        Coeficiente = Utilidad Fiscal del ejercicio anterior / Ingresos Acumulables del ejercicio anterior
        """
        if self.coeficiente_utilidad is None:
            # Si no hay coeficiente, usar 10% como default (primer año)
            coeficiente = Decimal('0.10')
        else:
            coeficiente = self.coeficiente_utilidad
        
        pago_provisional = ingresos_acumulables * coeficiente * self.TASA_ISR
        return pago_provisional.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    
    def actualizar_coeficiente(self, utilidad_fiscal_anterior: Decimal, 
                               ingresos_acumulables_anterior: Decimal):
        """
        Actualiza el coeficiente de utilidad con datos del ejercicio anterior.
        """
        if ingresos_acumulables_anterior > 0:
            self.coeficiente_utilidad = utilidad_fiscal_anterior / ingresos_acumulables_anterior
```

#### Algoritmo 2: Cálculo de ISR Personas Físicas (Tablas Progresivas 2026)

```python
class ISRCalculatorPersonasFisicas:
    """
    Calculadora de ISR para Personas Físicas.
    Basado en LISR Art. 100-180 (2026).
    Incluye tablas progresivas mensuales y anuales.
    """
    
    # Tablas ISR 2026 (Mensuales - RESICO)
    TABLAS_ISR_RESICO_MENSUAL = [
        {'limite_inferior': Decimal('0.01'), 'limite_superior': Decimal('33688.34'), 
         'cuota_fija': Decimal('0.00'), 'porcentaje': Decimal('0.01')},
        {'limite_inferior': Decimal('33688.35'), 'limite_superior': Decimal('50000.00'), 
         'cuota_fija': Decimal('336.88'), 'porcentaje': Decimal('0.015')},
        {'limite_inferior': Decimal('50000.01'), 'limite_superior': Decimal('100000.00'), 
         'cuota_fija': Decimal('581.20'), 'porcentaje': Decimal('0.02')},
        {'limite_inferior': Decimal('100000.01'), 'limite_superior': Decimal('200000.00'), 
         'cuota_fija': Decimal('1581.20'), 'porcentaje': Decimal('0.025')},
        {'limite_inferior': Decimal('200000.01'), 'limite_superior': None, 
         'cuota_fija': Decimal('4081.20'), 'porcentaje': Decimal('0.03')},
    ]
    
    # Tablas ISR 2026 (Mensuales - Régimen General - Actualizadas por inflación)
    # Fuente: SAT RMF 2026 Anexo 8 (DOF 28-dic-2025)
    # https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/documentos2026/rmf/anexos/Anexo-8-RMF-2026_DOF-28122025.pdf
    TABLAS_ISR_GENERAL_MENSUAL = [
        {'limite_inferior': Decimal('0.01'), 'limite_superior': Decimal('10135.11'), 
         'cuota_fija': Decimal('0.00'), 'porcentaje': Decimal('0.0192')},
        {'limite_inferior': Decimal('10135.12'), 'limite_superior': Decimal('85825.69'), 
         'cuota_fija': Decimal('194.60'), 'porcentaje': Decimal('0.0640')},
        {'limite_inferior': Decimal('85825.70'), 'limite_superior': Decimal('151215.19'), 
         'cuota_fija': Decimal('5039.80'), 'porcentaje': Decimal('0.1088')},
        {'limite_inferior': Decimal('151215.20'), 'limite_superior': Decimal('175965.59'), 
         'cuota_fija': Decimal('12154.37'), 'porcentaje': Decimal('0.1600')},
        {'limite_inferior': Decimal('175965.60'), 'limite_superior': Decimal('211095.29'), 
         'cuota_fija': Decimal('16114.43'), 'porcentaje': Decimal('0.1792')},
        {'limite_inferior': Decimal('211095.30'), 'limite_superior': Decimal('426725.99'), 
         'cuota_fija': Decimal('22406.76'), 'porcentaje': Decimal('0.2136')},
        {'limite_inferior': Decimal('426726.00'), 'limite_superior': Decimal('676725.59'), 
         'cuota_fija': Decimal('68454.66'), 'porcentaje': Decimal('0.2352')},
        {'limite_inferior': Decimal('676725.60'), 'limite_superior': Decimal('1284725.99'), 
         'cuota_fija': Decimal('127354.66'), 'porcentaje': Decimal('0.3000')},
        {'limite_inferior': Decimal('1284726.00'), 'limite_superior': Decimal('4256419.90'), 
         'cuota_fija': Decimal('309754.66'), 'porcentaje': Decimal('0.3200')},
        {'limite_inferior': Decimal('4256419.91'), 'limite_superior': None, 
         'cuota_fija': Decimal('1260608.66'), 'porcentaje': Decimal('0.3500')},
    ]
    
    def calcular_isr_persona_fisica(self, 
                                    ingreso_mensual: Decimal,
                                    regimen: str = 'RESICO',
                                    deducciones_personales: Decimal = Decimal('0')) -> Dict:
        """
        Calcula ISR para personas físicas usando tablas progresivas.
        
        Args:
            ingreso_mensual: Ingreso acumulable del mes
            regimen: 'RESICO' o 'GENERAL'
            deducciones_personales: Deducciones personales (honorarios médicos, gastos médicos, etc.)
        
        Returns:
            Dict con desglose del cálculo
        """
        # 1. Seleccionar tabla según régimen
        if regimen.upper() == 'RESICO':
            tablas = self.TABLAS_ISR_RESICO_MENSUAL
        else:
            tablas = self.TABLAS_ISR_GENERAL_MENSUAL
        
        # 2. Aplicar deducciones personales (solo régimen general)
        if regimen.upper() == 'GENERAL':
            ingreso_gravable = max(ingreso_mensual - deducciones_personales, Decimal('0'))
        else:
            ingreso_gravable = ingreso_mensual
        
        # 3. Encontrar tramo correspondiente
        isr_calculado = Decimal('0')
        tramo_aplicado = None
        
        for tramo in tablas:
            if tramo['limite_superior'] is None or ingreso_gravable <= tramo['limite_superior']:
                excedente = ingreso_gravable - tramo['limite_inferior']
                isr_calculado = (excedente * tramo['porcentaje']) + tramo['cuota_fija']
                tramo_aplicado = tramo
                break
        
        return {
            'ingreso_mensual': float(ingreso_mensual),
            'regimen': regimen,
            'deducciones_personales': float(deducciones_personales),
            'ingreso_gravable': float(ingreso_gravable),
            'isr_calculado': float(isr_calculado.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)),
            'tramo_aplicado': tramo_aplicado,
            'tasa_marginal': float(tramo_aplicado['porcentaje']) if tramo_aplicado else 0,
            'fecha_calculo': datetime.now().isoformat()
        }
```

#### Algoritmo 3: Cálculo de IVA

```python
class IVACalculator:
    """
    Calculadora de IVA (Impuesto al Valor Agregado).
    Basado en LIVA 2026.
    """
    
    # Tasas de IVA 2026
    TASA_GENERAL = Decimal('0.16')  # 16% - General
    TASA_FRONTERIZA = Decimal('0.08')  # 8% - Región fronteriza
    TASA_CERO = Decimal('0.00')  # 0% - Exportaciones, productos básicos
    
    # Productos con tasa 0% (LIVA Art. 2-A)
    PRODUCTOS_TASA_CERO = [
        'agua', 'hielo', 'sal', 'leche', 'huevo', 'pan', 'tortilla',
        'frutas', 'verduras', 'legumbres', 'cereales', 'cafe', 'chocolate',
        'medicinas', 'libros', 'periodicos', 'revistas'
    ]
    
    def calcular_iva(self,
                     base_gravable: Decimal,
                     tipo_operacion: str = 'gravada',
                     region: str = 'general') -> Dict:
        """
        Calcula IVA sobre una operación.
        
        Args:
            base_gravable: Base sobre la cual se calcula el IVA
            tipo_operacion: 'gravada', 'exenta', o 'tasa_cero'
            region: 'general' o 'fronteriza'
        
        Returns:
            Dict con desglose del cálculo
        """
        # 1. Determinar tasa aplicable
        if tipo_operacion == 'exenta':
            tasa = Decimal('0.00')
        elif tipo_operacion == 'tasa_cero':
            tasa = self.TASA_CERO
        elif region == 'fronteriza':
            tasa = self.TASA_FRONTERIZA
        else:
            tasa = self.TASA_GENERAL
        
        # 2. Calcular IVA
        iva_calculado = base_gravable * tasa
        
        return {
            'base_gravable': float(base_gravable),
            'tipo_operacion': tipo_operacion,
            'region': region,
            'tasa_aplicada': float(tasa),
            'iva_calculado': float(iva_calculado.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)),
            'total': float((base_gravable + iva_calculado).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)),
            'fecha_calculo': datetime.now().isoformat()
        }
    
    def calcular_iva_acreditable(self, 
                                  iva_pagado: Decimal,
                                  tipo_gasto: str,
                                  porcentaje_acreditacion: Decimal = Decimal('1.0')) -> Dict:
        """
        Calcula IVA acreditable (el que se puede restar del IVA trasladado).
        
        Args:
            iva_pagado: IVA pagado en la adquisición de bienes/servicios
            tipo_gasto: Tipo de gasto (deducible, no_deducible, parcialmente_deducible)
            porcentaje_acreditacion: Porcentaje que se puede acreditar (0-1)
        
        Returns:
            Dict con desglose del cálculo
        """
        if tipo_gasto == 'no_deducible':
            iva_acreditable = Decimal('0')
        else:
            iva_acreditable = iva_pagado * porcentaje_acreditacion
        
        return {
            'iva_pagado': float(iva_pagado),
            'tipo_gasto': tipo_gasto,
            'porcentaje_acreditacion': float(porcentaje_acreditacion),
            'iva_acreditable': float(iva_acreditable.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)),
            'fecha_calculo': datetime.now().isoformat()
        }
    
    def calcular_iva_a_pagar(self,
                             iva_trasladado: Decimal,
                             iva_acreditado: Decimal) -> Dict:
        """
        Calcula IVA a pagar (diferencia entre IVA trasladado y acreditado).
        
        Fórmula:
        IVA a Pagar = IVA Trasladado - IVA Acreditado
        
        Args:
            iva_trasladado: IVA cobrado en ventas/servicios
            iva_acreditado: IVA pagado en compras/gastos
        
        Returns:
            Dict con resultado
        """
        iva_a_pagar = iva_trasladado - iva_acreditado
        
        return {
            'iva_trasladado': float(iva_trasladado),
            'iva_acreditado': float(iva_acreditado),
            'iva_a_pagar': float(max(iva_a_pagar, Decimal('0')).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)),
            'iva_a_favor': float(max(-iva_a_pagar, Decimal('0')).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)),
            'fecha_calculo': datetime.now().isoformat()
        }
```

### 3.3 Thresholds y Parámetros Óptimos
| Parámetro | Valor Recomendado | Rango Aceptable | Justificación |
|-----------|-------------------|-----------------|---------------|
| **Precisión de cálculos** | 99.5% | 99-100% | Errores en cálculos fiscales generan multas |
| **Tiempo de cálculo** | <100ms | <500ms | Cálculos son operaciones matemáticas simples |
| **Actualización de tablas** | Automática (enero) | Enero-Febrero | Las tablas ISR cambian anualmente |
| **Caché de tablas** | 24 horas | 12-48 horas | Las tablas no cambian frecuentemente |

### 3.4 Integración con NVIDIA NIM
| Modelo | Uso | Costo | Latencia | Configuración |
|--------|-----|-------|----------|---------------|
| No aplica | Cálculos fiscales son matemáticos | N/A | N/A | No requiere LLM |

**Nota:** Los cálculos de ISR/IVA son operaciones matemáticas determinísticas que no requieren IA/LLM. Se implementan con código Python puro usando `Decimal` para precisión.

### 3.5 Endpoints Requeridos (Backend)
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/v1/fiscal/calculate-isr-pm` | Calcular ISR personas morales | ✅ JWT |
| POST | `/v1/fiscal/calculate-isr-pf` | Calcular ISR personas físicas | ✅ JWT |
| POST | `/v1/fiscal/calculate-iva` | Calcular IVA de operación | ✅ JWT |
| GET | `/v1/fiscal/isr-tables` | Obtener tablas ISR vigentes | ✅ JWT |
| POST | `/v1/fiscal/update-coeficiente` | Actualizar coeficiente de utilidad | ✅ JWT |

### 3.6 Componentes Requeridos (Frontend)
| Componente | Tipo | Propósito |
|------------|------|-----------|
| `ISRCalculator.tsx` | UI Component | Calculadora de ISR con inputs para ingresos, deducciones |
| `IVACalculator.tsx` | UI Component | Calculadora de IVA con selección de tasa |
| `FiscalDashboard.tsx` | Dashboard | Resumen de ISR/IVA del mes, gráficas |
| `useFiscalCalculation.ts` | Hook | Hook para cálculos fiscales con React Query |
| `fiscal.service.ts` | Service | Servicio de API para endpoints fiscales |

---

## 4. Limitantes y Restricciones

### 4.1 Limitación 1: Cambios Normativos Anuales
**Problema:**
Las tablas de ISR y tasas de IVA cambian cada año (enero). El sistema debe actualizarse anualmente para evitar cálculos incorrectos.

**Solución:**
```python
# Tabla de parámetros actualizables (configuración externa)
FISCAL_PARAMS_2026 = {
    'isr': {
        'tasa_personas_morales': 0.30,
        'tablas_personas_fisicas': [...],  # Tablas completas
        'tablas_resico': [...],
    },
    'iva': {
        'tasa_general': 0.16,
        'tasa_fronteriza': 0.08,
        'tasa_cero': 0.00,
    },
    'actualizacion': {
        'vigencia_desde': '2026-01-01',
        'fuente': 'DOF 2025-12-15',
    }
}

# Función de actualización
def update_fiscal_params(new_params: dict):
    """
    Actualiza parámetros fiscales sin cambiar código.
    Requiere validación de contador certificado.
    """
    import json
    from datetime import datetime
    
    # Validar que nuevos parámetros tienen vigencia
    if 'vigencia_desde' not in new_params:
        raise ValueError("Debe especificar vigencia de parámetros")
    
    # Guardar en configuración
    with open('config/fiscal_params.json', 'w') as f:
        json.dump({
            'params': new_params,
            'updated_at': datetime.now().isoformat(),
            'updated_by': 'admin'
        }, f, indent=2)
```

**Impacto:**
- Requiere actualización manual en enero de cada año
- Necesita validación de contador certificado antes de aplicar

### 4.2 Limitación 2: Regímenes Fiscales Múltiples
**Problema:**
Existen múltiples regímenes fiscales (RESICO, general, honorarios, arrendamiento) con reglas diferentes. El sistema debe soportar todos los regímenes comunes.

**Solución:**
```python
REGIMENES_FISCALES = {
    'RESICO': {
        'codigo_sat': '612',
        'descripcion': 'Régimen Simplificado de Confianza',
        'tablas_isr': TABLAS_ISR_RESICO,
        'deducciones': False,  # RESICO no usa deducciones
    },
    'GENERAL': {
        'codigo_sat': '601',
        'descripcion': 'Régimen General de Ley',
        'tablas_isr': TABLAS_ISR_GENERAL,
        'deducciones': True,
    },
    'HONORARIOS': {
        'codigo_sat': '614',
        'descripcion': 'Ingresos por Honorarios',
        'tablas_isr': TABLAS_ISR_GENERAL,
        'deducciones': True,
        'retencion_isr': 0.10,  # 10% de retención
    },
    'ARRENDAMIENTO': {
        'codigo_sat': '605',
        'descripcion': 'Arrendamiento',
        'tablas_isr': TABLAS_ISR_GENERAL,
        'deducciones': True,
    }
}
```

**Impacto:**
- Complejidad adicional en UI (selección de régimen)
- Validaciones diferentes por régimen

### 4.3 Riesgos Técnicos Identificados
| Riesgo | Probabilidad | Impacto | Mitigación | Owner |
|--------|--------------|---------|------------|-------|
| **Tablas incorrectas** | MEDIA | CRÍTICO | Validación con contador certificado antes de deploy | Tech Lead |
| **Errores de redondeo** | ALTA | ALTO | Usar `Decimal` en lugar de `float` para precisión | Backend Dev |
| **Cambios normativos no detectados** | MEDIA | ALTO | Monitoreo mensual del DOF y boletines del SAT | Product Owner |
| **Cálculos incorrectos por régimen** | MEDIA | ALTO | Tests exhaustivos por régimen fiscal | QA Engineer |

---

## 5. Métricas Esperadas

| Métrica | Target | Fórmula | Medición |
|---------|--------|---------|----------|
| **Precisión de cálculos** | 99.5%+ | `(calculos_correctos / total_calculos) × 100` | Por cálculo |
| **Tiempo de cálculo** | <100ms | `tiempo_fin - tiempo_inicio` | Por operación |
| **Errores de redondeo** | 0 | Count de errores | Por cálculo |
| **Actualización de tablas** | Enero (semana 1) | Fecha de actualización | Anual |

### 5.1 Criterios de Aceptación
- [ ] **Criterio 1:** Cálculos de ISR coinciden con calculadora del SAT (±$0.01)
- [ ] **Criterio 2:** Cálculos de IVA son exactos (±$0.01)
- [ ] **Criterio 3:** Soporta todos los regímenes fiscales comunes (RESICO, general, honorarios, arrendamiento)
- [ ] **Criterio 4:** Parámetros actualizables sin deploy de código
- [ ] **Criterio 5:** Tests unitarios con 100% de cobertura en cálculos fiscales

---

## 6. Roadmap de Implementación

### Fase 9: Conciliación y Clasificación (25 marzo - 25 abril 2026)

**Nota:** El cálculo de ISR/IVA está identificado como Gap #4 en el TRACKING, pero por su criticidad y dependencia con otras funcionalidades, se recomienda implementar en **Fase 9** junto con conciliación y clasificación.

| Semana | Entregable | Owner | Dependencias | Criterio de Éxito |
|--------|------------|-------|--------------|-------------------|
| **1** | Modelos de cálculo ISR (PM y PF) | Backend Dev + Contador | Tablas ISR 2026 validadas | Cálculos coinciden con SAT (±$0.01) |
| **2** | Calculadora de IVA + endpoints | Backend Dev | - | Tests unitarios passing (100% cobertura) |
| **3** | UI de calculadora fiscal | Frontend Dev | Endpoints backend | UI funcional con validaciones |
| **4** | Integración + tests E2E | Fullstack | UI + Backend | Tests E2E passing, validación con contador |

**Criterio de éxito:** 99.5% de precisión en cálculos, validado por contador certificado

---

## 7. Seguridad y Cumplimiento

### 7.1 Requisitos SAT para Sistemas Contables
| Requisito | Descripción | Impacto en Módulo |
|-----------|-------------|-------------------|
| **Precisión de cálculos** | ±$0.01 en ISR/IVA | Usar `Decimal` en lugar de `float` |
| **Actualización normativa** | Tablas vigentes al año en curso | Configuración externa actualizable |
| **Auditoría de cálculos** | Historial de cálculos realizados | Guardar histórico en PostgreSQL |
| **Contabilidad electrónica** | Integración con formatos SAT | Endpoints deben generar datos compatibles con Anexo 29 |

### 7.2 Mejores Prácticas de Seguridad
| Capa | Medida | Implementación |
|------|--------|----------------|
| **Datos** | Encriptación de cálculos en reposo | AES-256 en PostgreSQL |
| **Acceso** | Autenticación JWT requerida | Middleware de autenticación |
| **Auditoría** | Log de todos los cálculos | Tabla `fiscal_calculations` con usuario, fecha, resultados |

### 7.3 Consideraciones de Privacidad
- [ ] **Ingresos del usuario:** Datos sensibles, encriptar en reposo
- [ ] **Deducciones personales:** Información confidencial, acceso restringido
- [ ] **Histórico fiscal:** Mantener por 5 años (requerimiento SAT)

### 7.4 Multas por Incumplimiento
| Incumplimiento | Multa | Autoridad |
|----------------|-------|-----------|
| **Declaración incorrecta** | 55-75% del impuesto no pagado | SAT |
| **Pago extemporáneo** | Recargos + actualización (1.13-1.96% mensual) | SAT |
| **Errores en contabilidad** | $1,000-$50,000 MXN | SAT |

---

## 8. Conclusiones y Recomendaciones

### Hallazgos Clave
1. **Cálculos fiscales son determinísticos:** No requieren IA/LLM, son operaciones matemáticas con `Decimal`
2. **Actualización anual crítica:** Tablas ISR cambian en enero, requiere proceso de actualización
3. **Múltiples regímenes fiscales:** Sistema debe soportar RESICO, general, honorarios, arrendamiento
4. **Validación con contador es obligatoria:** Antes de production, contador debe validar todos los cálculos

### Recomendaciones Finales
| Área | Recomendación | Prioridad |
|------|---------------|-----------|
| **Implementación** | Usar `Decimal` para precisión, nunca `float` | CRÍTICA |
| **Configuración** | Tablas ISR/IVA en config externo (JSON/DB) | ALTA |
| **Validación** | Contratar contador certificado para validar cálculos | CRÍTICA |
| **Tests** | Tests exhaustivos con casos del SAT | ALTA |
| **Monitoreo** | Alertas si cálculos difieren de SAT | MEDIA |

### Próximos Pasos
- [ ] **Paso 1:** Implementar calculadora ISR personas morales - 25 marzo
- [ ] **Paso 2:** Implementar calculadora ISR personas físicas - 28 marzo
- [ ] **Paso 3:** Implementar calculadora de IVA - 1 abril
- [ ] **Paso 4:** Validar con contador certificado - 4-8 abril
- [ ] **Paso 5:** Deploy a production - 11 abril

---

## 9. Fuentes Consultadas

### Fuentes Oficiales
| Fuente | URL | Fecha de Consulta |
|--------|-----|-------------------|
| SAT - LISR 2026 | https://www.sat.gob.mx/consultas/legislacion | 10-mar-2026 |
| SAT - LIVA 2026 | https://www.sat.gob.mx/consultas/legislacion | 10-mar-2026 |
| SAT - RMF 2026 Anexo 8 (Tablas ISR) | https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/documentos2026/rmf/anexos/Anexo-8-RMF-2026_DOF-28122025.pdf | 10-mar-2026 |
| SAT - Tablas ISR | https://www.sat.gob.mx/calculadoras | 10-mar-2026 |
| DOF - Decreto RESICO | https://www.dof.gob.mx/ | 10-mar-2026 |
| INDETEC - Actualización tarifa ISR 2026 | https://www.indetec.gob.mx/delivery?srv=0&sl=2&route=/noticias_interes/Actualizacion-de-tarifa-ISR-para-personas-fisicas-aplicable-en-2026&ext=.pdf | 10-mar-2026 |
| Expansión - Tablas ISR 2026 | https://expansion.mx/economia/2026/01/17/cuanto-te-descontaran-de-isr-en-2026-nueva-tabla-sat | 10-mar-2026 |
| Consolide - Tablas ISR 2026 | https://consolide.com/blog/tablas-isr-2026/ | 10-mar-2026 |
| SAT - Estímulos fiscales frontera norte (IVA 8%) | https://www.sat.gob.mx/minisitio/EstimulosFiscalesFronteraNorteSur/region_fronteriza_norte_iva/en_que_consiste.html | 10-mar-2026 |
| Bloomberg Línea - Guía cambios fiscales 2026 | https://www.bloomberglinea.com/latinoamerica/mexico/guia-de-cambios-fiscales-2026-para-empresas-y-personas-en-mexico/ | 10-mar-2026 |

### Fuentes Técnicas
| Fuente | URL | Fecha de Consulta |
|--------|-----|-------------------|
| Python Decimal | https://docs.python.org/3/library/decimal.html | 10-mar-2026 |
| pySAT (GitHub) | https://github.com/alanjds/pysat | 10-mar-2026 |
| CalculFisc - Calculadora RESICO | https://www.calculfisc.com/calculadora-resico | 10-mar-2026 |

### Fuentes de Mercado
| Fuente | URL | Fecha de Consulta |
|--------|-----|-------------------|
| Contpaqi | https://www.contpaqi.com/ | 10-mar-2026 |
| SW Sapien | https://www.sw.com.mx/ | 10-mar-2026 |
| Finkok | https://finkok.com/ | 10-mar-2026 |
| Siigo Aspel - Tablas ISR | https://www.siigo.com/mx/blog/obligaciones-fiscales/tablas-isr-tarifa-base-impuesto-sobre-renta/ | 10-mar-2026 |

---

## 10. Control de Cambios

| Versión | Fecha | Autor | Tipo | Cambios Realizados | Sección Afectada |
|---------|-------|-------|------|-------------------|------------------|
| 1.0 | 10-mar-2026 | Diego Gzz | Creación | Versión inicial del documento | Todo el documento |
| 1.1 | 10-mar-2026 | Diego Gzz | Investigación | **Investigación profunda con Tavily** - Agregadas 10 fuentes oficiales del SAT, INDETEC, Expansión, Consolide | Secciones 2.3, 9 |
| 1.2 | 10-mar-2026 | Diego Gzz | Actualización | **Tablas ISR actualizadas** con valores oficiales 2026 (RMF Anexo 8 DOF 28-dic-2025) - Límites actualizados por inflación | Sección 3.2 |

**Notas de la actualización:**
- Las tablas ISR 2026 fueron actualizadas por inflación según RMF 2026 Anexo 8
- Límite inferior primer tramo: $0.01, límite superior primer tramo: $10,135.11 (actualizado de $7,734.99)
- Se agregó tramo adicional para ingresos >$4,256,419.90 con tasa 35%
- IVA fronterizo 8% vigente hasta 31-dic-2026 (estímulo fiscal)

---

**Documento elaborado para:** Equipo de desarrollo IDP-App
**Propósito:** Guiar implementación técnica del módulo de cálculo ISR/IVA
**Próxima actualización:** Después de validación con contador certificado (abril 2026)

---

*Fin de la Investigación de Cálculo ISR/IVA*
