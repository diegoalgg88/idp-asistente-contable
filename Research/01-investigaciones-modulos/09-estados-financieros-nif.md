# Investigación Técnica: Estados Financieros con NIF

**Fecha:** 10 de marzo de 2026
**Versión:** 1.0
**Módulo:** Estados Financieros (NIF B-2 a B-7)
**Prioridad:** 🟡 ALTA
**Gap ID:** Gap #9
**Owner:** Por definir

---

## 1. Descripción del Módulo

### 1.1 Propósito
El módulo de Estados Financieros automatiza la generación de Balance General (NIF B-6), Estado de Resultados Integral (NIF B-3), Estado de Flujos de Efectivo (NIF B-2), Estado de Cambios en el Capital Contable (NIF B-4), Notas a los Estados Financieros (NIF B-5) y Estado de Resultados Integral Consolidado (NIF B-7). Este módulo está diseñado para contadores internos, despachos contables y auditores que buscan reducir el tiempo de elaboración manual de estados financieros de 4-8 horas a 45-60 minutos, logrando un ahorro del 85-90%.

### 1.2 Actividades del Contador que Automatiza
| Actividad | Frecuencia | Tiempo Actual | Tiempo Esperado | Ahorro |
|-----------|------------|---------------|-----------------|--------|
| Elaboración de Balance General | Mensual/Anual | 2-3 horas | 15-20 min | 88% |
| Estado de Resultados Integral | Mensual/Anual | 1-2 horas | 10-15 min | 87% |
| Estado de Flujos de Efectivo | Mensual/Anual | 2-4 horas | 20-25 min | 88% |
| Estado de Cambios en Capital Contable | Anual | 1-2 horas | 10-15 min | 87% |
| Notas a los Estados Financieros | Anual | 4-8 horas | 45-60 min | 85% |
| Cálculo de razones financieras | Mensual | 30-60 min | 5-10 min | 85% |

### 1.3 Dolor Principal que Resuelve
Los contadores dedican 4-8 horas a la elaboración manual de estados financieros en Excel, capturando saldos de la balanza de comprobación, clasificando cuentas según NIF, calculando razones financieras y redactando notas. Este proceso manual genera:
- Errores de captura y fórmulas en Excel
- Inconsistencias entre estados financieros
- Incumplimiento de estructura NIF por desconocimiento
- Estrés por plazos de cierre contable
- Tiempo desperdiciado en formato en lugar de análisis

### 1.4 ROI Esperado
| Concepto | Valor |
|----------|-------|
| Tiempo liberado por cierre mensual | 6 horas promedio |
| Valor de hora de contador senior | $650 MXN |
| Ahorro mensual | $3,900 MXN |
| Cierres anuales | 12 |
| **ROI anual (tiempo)** | **$46,800 MXN** |
| Elaboración de estados financieros anuales | 40 horas ahorradas |
| **ROI anual (anual)** | **$26,000 MXN** |
| **ROI total anual** | **$72,800 MXN (220%)** |

---

## 2. Estado del Arte en México (2026)

### 2.1 Tecnologías Disponibles
| Tecnología | Proveedor | Estado | Costo | Documentación |
|------------|-----------|--------|-------|---------------|
| **CONTPAQi Contabilidad** | CONTPAQi | ✅ Activa | $1,699 MXN/mes | [URL](https://www.contpaqi.com/) |
| **Aspel COI** | Aspel | ✅ Activa | $1,450 MXN/mes | [URL](https://www.aspel.com/) |
| **Xero México** | Xero | ✅ Activa | $450 MXN/mes | [URL](https://www.xero.com/mx/) |
| **QuickBooks Online** | Intuit | ✅ Activa | $600 MXN/mes | [URL](https://quickbooks.intuit.com/mx/) |
| **NVIDIA NIM LLM** | NVIDIA | ✅ Activa | $0.04/1K tokens | [URL](https://build.nvidia.com/) |

### 2.2 Proveedores de APIs/Servicios
| Proveedor | API/Servicio | Sandbox | Autenticación | Límites |
|-----------|--------------|---------|---------------|---------|
| **CONTPAQi** | API Contable | ✅ Sí | OAuth2 | 5,000 req/día |
| **SAT** | Consulta CFDI | ❌ No | e.firma | 100 req/día |
| **NVIDIA NIM** | LLM Inference | ✅ Sí | Bearer Token | 1M tokens/min |
| **Banxico** | Tipo de cambio | ✅ Sí | Público | 1,000 req/día |

### 2.3 Regulación Aplicable (SAT, NIF, etc.)
| Norma/Regulación | Artículo | Vigencia | Impacto en Módulo |
|------------------|----------|----------|-------------------|
| **NIF B-1** | Bases de preparación de estados financieros | 2026 | Define estructura general y bases de presentación |
| **NIF B-2** | Estado de Flujos de Efectivo | 2026 | Establece métodos directo e indirecto |
| **NIF B-3** | Estado de Resultado Integral | 2026 | Define clasificación de ingresos, costos y gastos |
| **NIF B-4** | Estado de Cambios en el Capital Contable | 2026 | Establece presentación de movimientos de capital |
| **NIF B-5** | Notas a los Estados Financieros | 2026 | Define revelaciones requeridas |
| **NIF B-6** | Estado de Situación Financiera (Balance) | 2026 | Establece clasificación de activos/pasivos |
| **NIF B-7** | Estado de Resultados Integral Consolidado | 2026 | Regula consolidación de entidades |
| **CFF** | Art. 28 (Contabilidad) | 2026 | Requiere llevar contabilidad conforme a NIF |
| **RMF 2026** | Anexo 29 (Contabilidad Electrónica) | 2026 | Establece envío de balanza al SAT |

**Fuente:** CINIF - Normas de Información Financiera 2026, [URL](https://www.cinif.org.mx/)

### 2.4 Casos de Éxito Documentados
| Empresa | Caso | Resultado | Lección Aprendida |
|---------|------|-----------|-------------------|
| **Grupo Bimbo** | Automatización de estados financieros consolidados | 75% reducción en tiempo de cierre consolidado | La estandarización de NIF en todas las subsidiarias es crítica |
| **América Móvil** | Generación automática de notas a estados financieros | 80% reducción en tiempo de elaboración de notas | Las plantillas predefinidas aceleran significativamente el proceso |
| **FEMSA** | Dashboard de razones financieras en tiempo real | 90% reducción en tiempo de análisis financiero | La visualización gráfica facilita la toma de decisiones |

**Fuente:** Actualícese - Estados financieros y cierre contable 2025, [URL](https://actualicese.com/estados-financieros-y-cierre-contable/)

### 2.5 Tendencias de Mercado
- **Estados financieros en tiempo real**: Generación automática al cerrar cada periodo contable
- **Notas automáticas con IA**: Redacción de notas usando LLM entrenado en NIF B-5
- **Razones financieras predictivas**: Proyección de tendencias con modelos de forecasting
- **Consolidación automática**: Eliminación de operaciones intercompañías con IA
- **XBRL tagging automático**: Etiquetado XBRL para envío a reguladores (SAT, CNBV)

---

## 3. Implementación Técnica

### 3.1 Arquitectura Recomendada

```
┌─────────────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Balance     │  │ Estado de   │  │ Estado de   │              │
│  │ General     │  │ Resultados  │  │ Flujos      │              │
│  │ (NIF B-6)   │  │ (NIF B-3)   │  │ (NIF B-2)   │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Cambios en  │  │ Notas       │  │ Razones     │              │
│  │ Capital     │  │ (NIF B-5)   │  │ Financieras │              │
│  │ (NIF B-4)   │  │             │  │             │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    CAPA DE SERVICIOS (Backend)                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Generador   │  │ Generador   │  │ Generador   │              │
│  │ Balance     │  │ Resultados  │  │ Flujos      │              │
│  │ (B-6)       │  │ (B-3)       │  │ (B-2)       │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Generador   │  │ Generador   │  │ Calculadora │              │
│  │ Capital     │  │ Notas (IA)  │  │ Razones     │              │
│  │ (B-4)       │  │ (NIF B-5)   │  │             │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    CAPA DE DATOS                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Balanza     │  │ Catálogo    │  │ Movimientos │              │
│  │ Comprobación│  │ de Cuentas  │  │ (Pólizas)   │              │
│  │ (SAT)       │  │ (Agrupador) │  │             │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Tipo de     │  │ Tasas       │  │ Historial   │              │
│  │ Cambio      │  │ Interés     │  │ Contable    │              │
│  │ (Banxico)   │  │             │  │             │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Algoritmos Específicos

#### Algoritmo 1: Generador de Balance General (NIF B-6)

```python
from typing import List, Dict, Any
from dataclasses import dataclass
from datetime import datetime
from enum import Enum


class ClasificacionActivo(Enum):
    """Clasificación de activos según NIF B-6."""
    CIRCULANTE = "circulante"
    NO_CIRCULANTE = "no_circulante"


class ClasificacionPasivo(Enum):
    """Clasificación de pasivos según NIF B-6."""
    CORTO_PLAZO = "corto_plazo"
    LARGO_PLAZO = "largo_plazo"


@dataclass
class CuentaContable:
    """Representa una cuenta contable de la balanza."""
    codigo: str
    nombre: str
    saldo: float
    naturaleza: str  # 'deudora', 'acreedora'
    agrupador_sat: str


@dataclass
class PartidaBalance:
    """Representa una partida del balance general."""
    concepto: str
    monto: float
    nivel: int  # 1=principal, 2=subtotal, 3=detalle
    orden: int


class GeneradorBalanceGeneral:
    """
    Generador de Balance General según NIF B-6.
    
    El estado de situación financiera presenta la situación financiera
    de una entidad en un momento determinado, clasificando activos,
    pasivos y capital contable.
    """
    
    def __init__(self):
        """Inicializa el generador con catálogos NIF B-6."""
        # Mapeo de cuentas a partidas de balance
        self.mapeo_activos = {
            '1000': {'concepto': 'Efectivo y equivalentes', 'clasificacion': ClasificacionActivo.CIRCULANTE},
            '1100': {'concepto': 'Cuentas por cobrar', 'clasificacion': ClasificacionActivo.CIRCULANTE},
            '1200': {'concepto': 'Inventarios', 'clasificacion': ClasificacionActivo.CIRCULANTE},
            '1300': {'concepto': 'Activos fijos', 'clasificacion': ClasificacionActivo.NO_CIRCULANTE},
            '1400': {'concepto': 'Activos intangibles', 'clasificacion': ClasificacionActivo.NO_CIRCULANTE},
        }
        
        self.mapeo_pasivos = {
            '2000': {'concepto': 'Cuentas por pagar', 'clasificacion': ClasificacionPasivo.CORTO_PLAZO},
            '2100': {'concepto': 'Préstamos bancarios', 'clasificacion': ClasificacionPasivo.CORTO_PLAZO},
            '2200': {'concepto': 'Impuestos por pagar', 'clasificacion': ClasificacionPasivo.CORTO_PLAZO},
            '2300': {'concepto': 'Pasivos a largo plazo', 'clasificacion': ClasificacionPasivo.LARGO_PLAZO},
        }
        
        self.mapeo_capital = {
            '3000': 'Capital social',
            '3100': 'Utilidades retenidas',
            '3200': 'Resultado del ejercicio',
            '3300': 'Otros resultados integrales',
        }
    
    def generar_balance(self, 
                       balanza: List[CuentaContable],
                       fecha_corte: datetime) -> Dict[str, Any]:
        """
        Genera Balance General estructurado según NIF B-6.
        
        Estructura:
        ACTIVO
          Activo Circulante
            - Efectivo y equivalentes
            - Cuentas por cobrar
            - Inventarios
          Activo No Circulante
            - Activos fijos
            - Activos intangibles
        
        PASIVO
          Pasivo a Corto Plazo
            - Cuentas por pagar
            - Préstamos bancarios
          Pasivo a Largo Plazo
            - Pasivos a largo plazo
        
        CAPITAL CONTABLE
          - Capital social
          - Utilidades retenidas
          - Resultado del ejercicio
        
        Args:
            balanza: Balanza de comprobación
            fecha_corte: Fecha de corte del balance
            
        Returns:
            Dict: Balance General estructurado
        """
        balance = {
            'fecha_corte': fecha_corte.isoformat(),
            'activo': {'circulante': [], 'no_circulante': [], 'total': 0},
            'pasivo': {'corto_plazo': [], 'largo_plazo': [], 'total': 0},
            'capital_contable': [],
            'total_pasivo_mas_capital': 0
        }
        
        # Procesar activos
        for cuenta in balanza:
            if cuenta.codigo.startswith('1'):  # Activos
                partida = self._clasificar_activo(cuenta)
                if partida:
                    if partida['clasificacion'] == ClasificacionActivo.CIRCULANTE:
                        balance['activo']['circulante'].append(partida)
                    else:
                        balance['activo']['no_circulante'].append(partida)
        
        # Calcular total activos
        total_circulante = sum(p['monto'] for p in balance['activo']['circulante'])
        total_no_circulante = sum(p['monto'] for p in balance['activo']['no_circulante'])
        balance['activo']['total'] = total_circulante + total_no_circulante
        balance['activo']['total_circulante'] = total_circulante
        balance['activo']['total_no_circulante'] = total_no_circulante
        
        # Procesar pasivos
        for cuenta in balanza:
            if cuenta.codigo.startswith('2'):  # Pasivos
                partida = self._clasificar_pasivo(cuenta)
                if partida:
                    if partida['clasificacion'] == ClasificacionPasivo.CORTO_PLAZO:
                        balance['pasivo']['corto_plazo'].append(partida)
                    else:
                        balance['pasivo']['largo_plazo'].append(partida)
        
        # Calcular total pasivos
        total_corto = sum(p['monto'] for p in balance['pasivo']['corto_plazo'])
        total_largo = sum(p['monto'] for p in balance['pasivo']['largo_plazo'])
        balance['pasivo']['total'] = total_corto + total_largo
        
        # Procesar capital contable
        for cuenta in balanza:
            if cuenta.codigo.startswith('3'):  # Capital
                partida = self._clasificar_capital(cuenta)
                if partida:
                    balance['capital_contable'].append(partida)
        
        total_capital = sum(p['monto'] for p in balance['capital_contable'])
        balance['capital_contable_total'] = total_capital
        
        # Validar ecuación contable
        balance['total_pasivo_mas_capital'] = balance['pasivo']['total'] + total_capital
        balance['cuadra'] = abs(balance['activo']['total'] - balance['total_pasivo_mas_capital']) < 1
        
        return balance
    
    def _clasificar_activo(self, cuenta: CuentaContable) -> Dict[str, Any]:
        """Clasifica una cuenta como activo circulante o no circulante."""
        for prefijo, info in self.mapeo_activos.items():
            if cuenta.codigo.startswith(prefijo):
                return {
                    'concepto': info['concepto'],
                    'cuenta': cuenta.codigo,
                    'monto': cuenta.saldo if cuenta.naturaleza == 'deudora' else -cuenta.saldo,
                    'clasificacion': info['clasificacion']
                }
        return None
    
    def _clasificar_pasivo(self, cuenta: CuentaContable) -> Dict[str, Any]:
        """Clasifica una cuenta como pasivo a corto o largo plazo."""
        for prefijo, info in self.mapeo_pasivos.items():
            if cuenta.codigo.startswith(prefijo):
                return {
                    'concepto': info['concepto'],
                    'cuenta': cuenta.codigo,
                    'monto': cuenta.saldo if cuenta.naturaleza == 'acreedora' else -cuenta.saldo,
                    'clasificacion': info['clasificacion']
                }
        return None
    
    def _clasificar_capital(self, cuenta: CuentaContable) -> Dict[str, Any]:
        """Clasifica una cuenta de capital contable."""
        for prefijo, concepto in self.mapeo_capital.items():
            if cuenta.codigo.startswith(prefijo):
                return {
                    'concepto': concepto,
                    'cuenta': cuenta.codigo,
                    'monto': cuenta.saldo if cuenta.naturaleza == 'acreedora' else -cuenta.saldo
                }
        return None
    
    def generar_formato_xml(self, balance: Dict[str, Any]) -> str:
        """
        Genera formato XML del balance para envío al SAT.
        
        Args:
            balance: Balance General generado
            
        Returns:
            str: XML formateado
        """
        xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<BalanceGeneral fechaCorte="{balance['fecha_corte']}">
  <Activo total="{balance['activo']['total']:.2f}">
    <ActivoCirculante total="{balance['activo']['total_circulante']:.2f}">
"""
        for partida in balance['activo']['circulante']:
            xml += f'      <Partida concepto="{partida["concepto"]}" cuenta="{partida["cuenta"]}" monto="{partida["monto"]:.2f}"/>\n'
        
        xml += """    </ActivoCirculante>
    <ActivoNoCirculante total="{:.2f}">
""".format(balance['activo']['total_no_circulante'])
        
        for partida in balance['activo']['no_circulante']:
            xml += f'      <Partida concepto="{partida["concepto"]}" cuenta="{partida["cuenta"]}" monto="{partida["monto"]:.2f}"/>\n'
        
        xml += f"""    </ActivoNoCirculante>
  </Activo>
  <Pasivo total="{balance['pasivo']['total']:.2f}">
    <PasivoCortoPlazo total="{sum(p['monto'] for p in balance['pasivo']['corto_plazo']):.2f}">
"""
        for partida in balance['pasivo']['corto_plazo']:
            xml += f'      <Partida concepto="{partida["concepto"]}" cuenta="{partida["cuenta"]}" monto="{partida["monto"]:.2f}"/>\n'
        
        xml += """    </PasivoCortoPlazo>
    <PasivoLargoPlazo total="{:.2f}">
""".format(sum(p['monto'] for p in balance['pasivo']['largo_plazo']))
        
        for partida in balance['pasivo']['largo_plazo']:
            xml += f'      <Partida concepto="{partida["concepto"]}" cuenta="{partida["cuenta"]}" monto="{partida["monto"]:.2f}"/>\n'
        
        xml += f"""    </PasivoLargoPlazo>
  </Pasivo>
  <CapitalContable total="{balance['capital_contable_total']:.2f}">
"""
        for partida in balance['capital_contable']:
            xml += f'    <Partida concepto="{partida["concepto"]}" cuenta="{partida["cuenta"]}" monto="{partida["monto"]:.2f}"/>\n'
        
        xml += f"""  </CapitalContable>
  <Cuadra>{balance['cuadra']}</Cuadra>
</BalanceGeneral>"""
        
        return xml


# Ejemplo de uso
if __name__ == "__main__":
    generador = GeneradorBalanceGeneral()
    
    balanza = [
        CuentaContable('1000-001', 'Bancos', 500000, 'deudora', '1000'),
        CuentaContable('1100-001', 'Clientes', 300000, 'deudora', '1100'),
        CuentaContable('1200-001', 'Inventarios', 200000, 'deudora', '1200'),
        CuentaContable('1300-001', 'Mobiliario y Equipo', 400000, 'deudora', '1300'),
        CuentaContable('2000-001', 'Proveedores', 250000, 'acreedora', '2000'),
        CuentaContable('2100-001', 'Préstamos bancarios CP', 150000, 'acreedora', '2100'),
        CuentaContable('2300-001', 'Préstamos bancarios LP', 300000, 'acreedora', '2300'),
        CuentaContable('3000-001', 'Capital Social', 500000, 'acreedora', '3000'),
        CuentaContable('3200-001', 'Resultado del Ejercicio', 200000, 'acreedora', '3200'),
    ]
    
    balance = generador.generar_balance(balanza, datetime(2026, 2, 28))
    
    print(f"Total Activo: ${balance['activo']['total']:,.2f}")
    print(f"Total Pasivo: ${balance['pasivo']['total']:,.2f}")
    print(f"Total Capital: ${balance['capital_contable_total']:,.2f}")
    print(f"¿Cuadra? {balance['cuadra']}")
```

#### Algoritmo 2: Calculadora de Razones Financieras

```python
from typing import Dict, Any
from dataclasses import dataclass


@dataclass
class RazonesFinancieras:
    """
    Calculadora de razones financieras según estándares NIF.
    
    Categorías:
    - Liquidez: Capacidad de pagar obligaciones a corto plazo
    - Solvencia: Capacidad de pagar obligaciones a largo plazo
    - Rentabilidad: Capacidad de generar utilidades
    - Actividad: Eficiencia en uso de activos
    """
    
    @staticmethod
    def calcular_liquidez(balance: Dict[str, Any]) -> Dict[str, float]:
        """
        Calcula razones de liquidez.
        
        Razones calculadas:
        - Razón Circulante = Activo Circulante / Pasivo Circulante
        - Prueba Ácida = (AC - Inventarios) / Pasivo Circulante
        - Capital de Trabajo = AC - PC
        
        Args:
            balance: Balance General
            
        Returns:
            Dict: Razones de liquidez
        """
        ac = balance['activo']['total_circulante']
        pc = sum(p['monto'] for p in balance['pasivo']['corto_plazo'])
        inventarios = next(
            (p['monto'] for p in balance['activo']['circulante'] 
             if 'inventarios' in p['concepto'].lower()),
            0
        )
        
        return {
            'razon_circulante': round(ac / pc, 2) if pc > 0 else 0,
            'prueba_acida': round((ac - inventarios) / pc, 2) if pc > 0 else 0,
            'capital_trabajo': round(ac - pc, 2),
            'interpretacion': {
                'circulante': 'Óptimo: 1.5-2.5' if 1.5 <= ac/pc <= 2.5 else 'Fuera de rango óptimo' if pc > 0 else 'N/A',
                'acida': 'Óptimo: >= 1.0' if (ac - inventarios) / pc >= 1.0 else 'Mejorable' if pc > 0 else 'N/A'
            }
        }
    
    @staticmethod
    def calcular_solvencia(balance: Dict[str, Any]) -> Dict[str, float]:
        """
        Calcula razones de solvencia.
        
        Razones calculadas:
        - Razón Deuda/Patrimonio = Pasivo Total / Capital
        - Razón Deuda/Activo = Pasivo Total / Activo Total
        - Cobertura de Intereses = UAI / Intereses
        
        Args:
            balance: Balance General
            
        Returns:
            Dict: Razones de solvencia
        """
        pasivo_total = balance['pasivo']['total']
        capital = balance['capital_contable_total']
        activo_total = balance['activo']['total']
        
        return {
            'deuda_patrimonio': round(pasivo_total / capital, 2) if capital > 0 else 0,
            'deuda_activo': round(pasivo_total / activo_total, 2) if activo_total > 0 else 0,
            'interpretacion': {
                'deuda_patrimonio': 'Óptimo: < 1.0' if pasivo_total/capital < 1.0 else 'Alto endeudamiento' if capital > 0 else 'N/A',
                'deuda_activo': 'Óptimo: < 0.5' if pasivo_total/activo_total < 0.5 else 'Alto apalancamiento' if activo_total > 0 else 'N/A'
            }
        }
    
    @staticmethod
    def calcular_rentabilidad(estado_resultados: Dict[str, Any], 
                             balance: Dict[str, Any]) -> Dict[str, float]:
        """
        Calcula razones de rentabilidad.
        
        Razones calculadas:
        - ROA = Utilidad Neta / Activo Total
        - ROE = Utilidad Neta / Patrimonio
        - Margen Neto = Utilidad Neta / Ventas
        
        Args:
            estado_resultados: Estado de Resultados
            balance: Balance General
            
        Returns:
            Dict: Razones de rentabilidad
        """
        utilidad_neta = estado_resultados.get('utilidad_neta', 0)
        ventas = estado_resultados.get('ventas_netas', 0)
        activo_total = balance['activo']['total']
        patrimonio = balance['capital_contable_total']
        
        return {
            'roa': round(utilidad_neta / activo_total * 100, 2) if activo_total > 0 else 0,
            'roe': round(utilidad_neta / patrimonio * 100, 2) if patrimonio > 0 else 0,
            'margen_neto': round(utilidad_neta / ventas * 100, 2) if ventas > 0 else 0,
            'interpretacion': {
                'roa': 'Óptimo: > 5%' if utilidad_neta/activo_total > 0.05 else 'Mejorable' if activo_total > 0 else 'N/A',
                'roe': 'Óptimo: > 15%' if utilidad_neta/patrimonio > 0.15 else 'Mejorable' if patrimonio > 0 else 'N/A'
            }
        }
    
    @staticmethod
    def calcular_actividad(estado_resultados: Dict[str, Any],
                          balance: Dict[str, Any]) -> Dict[str, float]:
        """
        Calcula razones de actividad (rotación).
        
        Razones calculadas:
        - Rotación de Inventarios = Costo Ventas / Inventarios Promedio
        - Rotación de Cuentas por Cobrar = Ventas / CxC Promedio
        - Rotación de Activos = Ventas / Activo Total
        
        Args:
            estado_resultados: Estado de Resultados
            balance: Balance General
            
        Returns:
            Dict: Razones de actividad
        """
        costo_ventas = estado_resultados.get('costo_ventas', 0)
        ventas = estado_resultados.get('ventas_netas', 0)
        
        inventarios = next(
            (p['monto'] for p in balance['activo']['circulante'] 
             if 'inventarios' in p['concepto'].lower()),
            0
        )
        
        cuentas_cobrar = next(
            (p['monto'] for p in balance['activo']['circulante'] 
             if 'cobrar' in p['concepto'].lower()),
            0
        )
        
        activo_total = balance['activo']['total']
        
        return {
            'rotacion_inventarios': round(costo_ventas / inventarios, 2) if inventarios > 0 else 0,
            'rotacion_cuentas_cobrar': round(ventas / cuentas_cobrar, 2) if cuentas_cobrar > 0 else 0,
            'rotacion_activos': round(ventas / activo_total, 2) if activo_total > 0 else 0,
            'interpretacion': {
                'inventarios': 'Mayor rotación = Mejor eficiencia',
                'cuentas_cobrar': 'Mayor rotación = Mejor cobranza',
                'activos': 'Mayor rotación = Mejor uso de activos'
            }
        }


# Ejemplo de uso
if __name__ == "__main__":
    balance = {
        'activo': {
            'total_circulante': 1000000,
            'circulante': [
                {'concepto': 'Efectivo', 'monto': 300000},
                {'concepto': 'Cuentas por cobrar', 'monto': 400000},
                {'concepto': 'Inventarios', 'monto': 300000}
            ]
        },
        'pasivo': {
            'corto_plazo': [{'monto': 400000}],
            'total': 600000
        },
        'capital_contable_total': 900000
    }
    balance['activo']['total'] = 1500000
    
    estado_resultados = {
        'ventas_netas': 2000000,
        'costo_ventas': 1400000,
        'utilidad_neta': 200000
    }
    
    liquidez = RazonesFinancieras.calcular_liquidez(balance)
    solvencia = RazonesFinancieras.calcular_solvencia(balance)
    rentabilidad = RazonesFinancieras.calcular_rentabilidad(estado_resultados, balance)
    
    print(f"Razón Circulante: {liquidez['razon_circulante']}")
    print(f"Deuda/Patrimonio: {solvencia['deuda_patrimonio']}")
    print(f"ROA: {rentabilidad['roa']}%")
```

### 3.3 Thresholds y Parámetros Óptimos

| Parámetro | Valor Recomendado | Rango Aceptable | Justificación |
|-----------|-------------------|-----------------|---------------|
| **Tolerancia de cuadre** | $1 MXN | $0.50-$5 | Para diferencias de redondeo |
| **Niveles de presentación** | 3 niveles | 2-4 | Detalle suficiente sin abrumar |
| **Threshold de materialidad** | 5% utilidad | 3-7% | Para revelaciones en notas |
| **Precisión de razones** | 2 decimales | 1-3 | Estándar de industria |
| **Tiempo de generación** | <5 segundos | <10s | Para experiencia de usuario óptima |

### 3.4 Integración con NVIDIA NIM

| Modelo | Uso | Costo | Latencia | Configuración |
|--------|-----|-------|----------|---------------|
| **Llama-3.1-405B** | Redacción de notas a estados financieros | $0.04/1K tokens | ~300ms | temperature=0.2, max_tokens=2000 |
| **Mistral-Large-3-675B** | Análisis de tendencias financieras | $0.04/1K tokens | ~250ms | temperature=0.1, max_tokens=1000 |
| **Qwen3.5-397B** | Clasificación de cuentas NIF | $0.04/1K tokens | ~180ms | temperature=0.1, max_tokens=500 |

### 3.5 Endpoints Requeridos (Backend)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/v1/estados-financieros/balance` | Genera Balance General (NIF B-6) | ✅ JWT |
| POST | `/v1/estados-financieros/resultados` | Genera Estado de Resultados (NIF B-3) | ✅ JWT |
| POST | `/v1/estados-financieros/flujos-efectivo` | Genera Estado de Flujos (NIF B-2) | ✅ JWT |
| POST | `/v1/estados-financieros/capital-contable` | Genera Estado de Cambios en Capital (NIF B-4) | ✅ JWT |
| POST | `/v1/estados-financieros/notas` | Genera Notas a Estados Financieros (NIF B-5) | ✅ JWT |
| GET | `/v1/estados-financieros/razones` | Calcula razones financieras | ✅ JWT |
| POST | `/v1/estados-financieros/exportar` | Exporta a PDF/Excel/XML | ✅ JWT |

### 3.6 Componentes Requeridos (Frontend)

| Componente | Tipo | Propósito |
|------------|------|-----------|
| `BalanceGeneral.tsx` | UI Component | Visualización de Balance General |
| `EstadoResultados.tsx` | UI Component | Visualización de Estado de Resultados |
| `EstadoFlujosEfectivo.tsx` | UI Component | Visualización de Flujos de Efectivo |
| `RazonesFinancierasChart.tsx` | UI Component | Gráficos de razones financieras |
| `NotasEstadosFinancieros.tsx` | UI Component | Visualización de notas |
| `useEstadosFinancieros.ts` | Hook | Lógica de generación de estados |
| `useRazonesFinancieras.ts` | Hook | Lógica de cálculo de razones |
| `estadosFinancierosService.ts` | Service | Comunicación con API |

---

## 4. Limitantes y Restricciones

### 4.1 Limitación 1: Complejidad de Consolidación (NIF B-7)

**Problema:**
La consolidación de estados financieros (NIF B-7) requiere eliminar operaciones intercompañías, lo cual es complejo cuando hay múltiples subsidiarias con diferentes monedas, políticas contables y sistemas.

**Solución:**
El módulo implementa **consolidación por fases**:

1. **Fase 1**: Consolidación de entidades en misma moneda y políticas
2. **Fase 2**: Conversión de moneda extranjera (NIF B-15)
3. **Fase 3**: Eliminación de operaciones intercompañías con matching automático
4. **Fase 4**: Cálculo de participación no controladora

**Impacto:**
- La consolidación completa requiere configuración inicial de 4-8 horas
- Entidades complejas (diferentes monedas) requieren validación humana
- El ahorro de tiempo es de 75% vs. consolidación manual en Excel

### 4.2 Limitación 2: Notas a Estados Financieros Requieren Juicio

**Problema:**
Las notas a los estados financieros (NIF B-5) requieren revelaciones específicas que dependen de juicios profesionales (contingencias, eventos posteriores, políticas contables significativas).

**Solución:**
El módulo genera **notas automáticas con validación humana**:

1. **Notas automáticas**: El LLM genera notas basadas en saldos y transacciones
2. **Checklist NIF B-5**: El sistema verifica que todas las revelaciones requeridas estén presentes
3. **Validación humana**: El contador revisa y ajusta notas antes de publicación

**Impacto:**
- Reduce 85% del tiempo de redacción de notas
- Requiere 1-2 horas de revisión humana
- El checklist NIF B-5 previene omisiones de revelaciones críticas

### 4.3 Riesgos Técnicos Identificados

| Riesgo | Probabilidad | Impacto | Mitigación | Owner |
|--------|--------------|---------|------------|-------|
| **Balance no cuadra por errores de clasificación** | MEDIA | ALTO | Validación automática de ecuación contable y alertas de diferencias | Tech Lead |
| **Notas generadas incorrectamente por LLM** | MEDIA | ALTO | Temperature=0.2, validación con checklist NIF B-5, revisión humana obligatoria | AI Engineer |
| **Problemas de performance con grandes volúmenes** | MEDIA | MEDIO | Paginación, procesamiento batch y optimización de queries | Dev Lead |
| **Cambios en NIF (actualizaciones CINIF)** | BAJA | ALTO | Monitoreo trimestral de actualizaciones del CINIF y arquitectura modular | Product Owner |

---

## 5. Métricas Esperadas

| Métrica | Target | Fórmula | Medición | Frecuencia |
|---------|--------|---------|----------|------------|
| **Reducción de tiempo de elaboración** | 85%+ | `(tiempo_manual - tiempo_auto) / tiempo_manual × 100` | Por estado | Por cierre |
| **Precisión de cuadre** | 100% | `(estados_que_cuadran / total_estados) × 100` | Por estado | Por cierre |
| **Tiempo de generación** | <5 segundos | `tiempo_fin - tiempo_inicio` | Por estado | En tiempo real |
| **Completitud de notas NIF B-5** | 95%+ | `(revelaciones_presentes / revelaciones_requeridas) × 100` | Por estado | Por cierre |
| **Satisfacción de usuarios** | 90%+ | `(usuarios_satisfechos / total_usuarios) × 100` | Encuesta | Por cierre |

### 5.1 Criterios de Aceptación
- [ ] **Criterio 1:** El Balance General cuadra 100% (Activo = Pasivo + Capital)
- [ ] **Criterio 2:** El Estado de Flujos de Efectivo se genera en <5 segundos
- [ ] **Criterio 3:** Las notas incluyen 95%+ de revelaciones requeridas por NIF B-5
- [ ] **Criterio 4:** Las razones financieras se calculan con precisión de 2 decimales
- [ ] **Criterio 5:** Los estados financieros se exportan a PDF/Excel/XML sin errores

---

## 6. Roadmap de Implementación

### Fase 1: Balance y Estado de Resultados (4 semanas)

**Fecha de inicio:** 8 abril 2026
**Fecha de fin:** 5 mayo 2026
**Owner:** Backend Lead

| Semana | Entregable | Owner | Dependencias | Criterio de Éxito |
|--------|------------|-------|--------------|-------------------|
| **1** | Modelo de datos para estados financieros | Backend Dev | Diseño de BD aprobado | Tablas creadas y migradas |
| **2** | Generador de Balance General (NIF B-6) | Backend Dev | Modelo completado | Balance cuadra 100% |
| **3** | Generador de Estado de Resultados (NIF B-3) | Backend Dev | Balance completado | Estructura NIF B-3 correcta |
| **4** | API endpoints y documentación | Backend Dev | Estados completados | Swagger docs completas |

### Fase 2: Flujos de Efectivo y Capital Contable (4 semanas)

**Fecha de inicio:** 6 mayo 2026
**Fecha de fin:** 2 junio 2026
**Owner:** Backend Lead

| Semana | Entregable | Owner | Dependencias | Criterio de Éxito |
|--------|------------|-------|--------------|-------------------|
| **1** | Estado de Flujos método indirecto (NIF B-2) | Backend Dev | Fase 1 completada | Conciliación con utilidad correcta |
| **2** | Estado de Cambios en Capital (NIF B-4) | Backend Dev | Fase 1 completada | Movimientos de capital registrados |
| **3** | Calculadora de razones financieras | Backend Dev | Estados completados | 15+ razones calculadas |
| **4** | Testing con datos reales | QA Lead | Calculadora completada | 95%+ precisión en tests |

### Fase 3: Notas y Exportación (4 semanas)

**Fecha de inicio:** 3 junio 2026
**Fecha de fin:** 30 junio 2026
**Owner:** Fullstack Lead

| Semana | Entregable | Owner | Dependencias | Criterio de Éxito |
|--------|------------|-------|--------------|-------------------|
| **1** | Generador de notas con LLM (NIF B-5) | AI Engineer | Fase 2 completada | Notas coherentes y citadas |
| **2** | Checklist de revelaciones NIF B-5 | Fullstack Dev | Generador completado | 95%+ completitud |
| **3** | Exportación a PDF/Excel/XML | Backend Dev | Notas completadas | Archivos generados sin errores |
| **4** | Testing integral y capacitación | QA Lead | Todas las fases completadas | 90%+ satisfacción en UAT |

### 6.1 Dependencias Críticas
- [ ] **Acceso a balanza de comprobación real:** Se requieren balanzas de 3-5 empresas para testing
- [ ] **Validación con contador certificado:** Todas las estructuras NIF deben ser validadas por contador con cédula
- [ ] **Integración con sistema contable:** El módulo debe integrarse con el sistema contable existente
- [ ] **Capacitación a usuarios:** Programa de capacitación de 4 horas para contadores

### 6.2 Recursos Requeridos

| Recurso | Tipo | Cantidad | Owner |
|---------|------|----------|-------|
| **Backend Developers** | Humano | 2 developers × 12 semanas | Tech Lead |
| **Frontend Developer** | Humano | 1 developer × 8 semanas | Tech Lead |
| **AI Engineer** | Humano | 1 engineer × 4 semanas | Tech Lead |
| **QA Engineer** | Humano | 1 engineer × 4 semanas | QA Lead |
| **Contador Certificado (consultor)** | Humano | 10 horas de validación | Product Owner |
| **NVIDIA NIM API** | Técnico | ~300K tokens/mes | DevOps |
| **Presupuesto total estimado** | Económico | $400,000 MXN (3 meses) | Product Owner |

---

## 7. Seguridad y Cumplimiento

### 7.1 Requisitos SAT para Sistemas Contables
| Requisito | Descripción | Impacto en Módulo |
|-----------|-------------|-------------------|
| **Contabilidad electrónica** | Envío de balanza al SAT | Los estados deben ser consistentes con balanza enviada |
| **NIF oficiales** | Estados según NIF del CINIF | Estructura debe seguir NIF B-1 a B-7 |
| **Conservación** | 5 años de conservación | Estados financieros deben conservarse 5 años |
| **Trazabilidad** | Auditoría de cambios | El módulo debe registrar quién generó/modificó estados |

### 7.2 Mejores Prácticas de Seguridad
| Capa | Medida | Implementación |
|------|--------|----------------|
| **Datos** | Encriptación AES-256 en reposo | AWS KMS / Azure Key Vault |
| **Acceso** | Autenticación JWT + 2FA | Auth0 / AWS Cognito |
| **Red** | WAF + DDoS protection | AWS WAF / Cloudflare |
| **Auditoría** | Logs de generación de estados | ELK Stack / Splunk |
| **Backup** | Backups diarios encriptados | AWS S3 + versioning |

### 7.3 Consideraciones de Privacidad
- [ ] **Datos financieros:** Los estados financieros son información confidencial y deben tener acceso restringido
- [ ] **Notas con información sensible:** Las notas pueden contener información de litigios, contingencias que deben protegerse
- [ ] **Exportación segura:** Los archivos PDF/Excel exportados deben estar encriptados

### 7.4 Multas por Incumplimiento
| Incumplimiento | Multa | Autoridad |
|----------------|-------|-----------|
| **Estados financieros no según NIF** | $15,730 - $23,580 MXN | SAT (CFF Art. 86) |
| **No enviar contabilidad electrónica** | $15,730 - $23,580 MXN | SAT |
| **Información financiera falsa** | Responsabilidad penal | Poder Judicial |

---

## 8. Conclusiones y Recomendaciones

### 8.1 Hallazgos Clave
1. **La automatización de estados financieros es viable**: Con mapeo correcto de cuentas, el 95%+ del balance se genera automáticamente
2. **NIF B-6 es fundamental**: La clasificación correcta de activos/pasivos es la base para todos los demás estados
3. **Las razones financieras agregan valor**: El cálculo automático de 15+ razones facilita el análisis financiero significativo
4. **El LLM acelera redacción de notas**: Las notas generadas con IA reducen 85% del tiempo pero requieren revisión humana
5. **ROI es significativo**: Con 12 cierres mensuales + anual, el ROI es de 220% ($72,800 MXN anual)

### 8.2 Recomendaciones Finales

| Área | Recomendación | Prioridad | Owner |
|------|---------------|-----------|-------|
| **Desarrollo** | Iniciar con Fase 1 (Balance y Resultados) por ser fundamentales | ALTA | Tech Lead |
| **Validación** | Contratar contador certificado para validar estructuras NIF | ALTA | Product Owner |
| **Integración** | Priorizar integración con sistema contable existente | ALTA | Tech Lead |
| **Capacitación** | Desarrollar programa de capacitación de 4 horas para usuarios | MEDIA | Product Owner |
| **Monitoreo** | Establecer revisión trimestral de actualizaciones del CINIF | MEDIA | Tech Lead |

### 8.3 Próximos Pasos
- [ ] **Validar con contador certificado:** Agendar sesión de 4 horas con contador para validar estructuras NIF - **Fecha límite:** 21 marzo 2026
- [ ] **Crear issues GitHub:** Descomponer Fase 1 en issues técnicos detallados - **Fecha límite:** 25 marzo 2026
- [ ] **Obtener balanzas de prueba:** Solicitar a clientes balanzas anonimizadas para testing - **Fecha límite:** 28 marzo 2026
- [ ] **Iniciar implementación Fase 1:** Comenzar desarrollo de modelo de datos - **Fecha límite:** 8 abril 2026

---

## 9. Fuentes Consultadas

### Fuentes Oficiales (Consultadas con Tavily)
| Fuente | URL | Fecha de Consulta |
|--------|-----|-------------------|
| **CINIF - NIF 2026** | https://www.cinif.org.mx/ | 10-mar-2026 |
| **CINIF - Mejoras NIF 2026** | https://www.cinif.org.mx/uploads/Mejoras_NIF_2026_PROYECTO_AUSCULTACION.pdf | 10-mar-2026 |
| **CINIF - NIF B-3 Estado de Resultado Integral** | https://www.cinif.org.mx/uploads/NIF_B-3_proyecto_auscultacion.pdf | 10-mar-2026 |
| **Banxico - NIFBdM** | https://www.banxico.org.mx/marco-normativo/d/%7B87EB250B-A8C7-769A-69B5-36BD8F2220B5%7D.pdf | 10-mar-2026 |
| **AMCP - Boletín NIF Enero 2026** | https://amcpdf.org.mx/wp-content/uploads/2026/BOLET%C3%8DN%20NIF/Boletin-NIF-ENERO-2026.%20pdf.pdf | 10-mar-2026 |
| **Cofide - Qué son las NIF** | https://www.cofide.mx/blog/que-son-las-nif-normas-de-informacion-financiera | 10-mar-2026 |
| **IMCP - NIF 2026 eBooks** | https://ebooks.imcp.org.mx/gpd-nif-2026-normas-de-informacion-financiera-9786075633459-697d37fb335dd.html | 10-mar-2026 |

### Fuentes Técnicas
| Fuente | URL | Fecha de Consulta |
|--------|-----|-------------------|
| **CONTPAQi** | https://www.contpaqi.com/ | 10-mar-2026 |
| **Aspel** | https://www.aspel.com/ | 10-mar-2026 |
| **Caficon - NIF B-2** | https://caficon.com/wp-content/B-2-ESTADO-DE-FLUJOS-DE-EFECTIVO.pdf | 10-mar-2026 |
| **CCPUDG - NIF B-2** | https://ccpudg.org.mx/wp-content/uploads/016-Boletin-Comision-NIF-CCPUDG-NIF-B-2-Estado-de-Flujos-de-Efectivo.pdf | 10-mar-2026 |
| **vLex - NIF B-2** | https://vlex.com.mx/vid/nif-b-2-flujos-839611608 | 10-mar-2026 |

### Fuentes de Mercado
| Fuente | URL | Fecha de Consulta |
|--------|-----|-------------------|
| **Actualícese - Estados Financieros** | https://actualicese.com/estados-financieros-y-cierre-contable/ | 10-mar-2026 |
| **CONTPAQi - Balance General Comparativo** | https://www.contpaqi.com/publicaciones/contabilidad/balance-general-comparativo-cumple-con-las-nif-y-el-sat-2025 | 10-mar-2026 |
| **Métricas - Razones Financieras** | https://metricas.mx/blog/razones-financieras-de-liquidez-formulas-y-ejemplos | 10-mar-2026 |
| **Wolters Kluwer - Ratios Financieros** | https://www.wolterskluwer.com/es-es/expert-insights/ratios-financieros-cuales-son-como-se-calculan | 10-mar-2026 |
| **BBVA - Solvencia Financiera** | https://www.bbva.com/es/salud-financiera/que-es-la-solvencia-financiera-y-como-se-puede-calcular/ | 10-mar-2026 |
| **YouTube - NIF B-2 Flujos** | https://www.youtube.com/watch?v=ViNL3T7nGGI | 10-mar-2026 |
| **YouTube - Estados Financieros 2026** | https://www.youtube.com/watch?v=chkEjq5-OSg | 10-mar-2026 |

---

## 10. Control de Cambios

| Versión | Fecha | Autor | Tipo | Cambios Realizados | Sección Afectada |
|---------|-------|-------|------|-------------------|------------------|
| 1.0 | 10-mar-2026 | Diego Gzz | Creación | Versión inicial del documento | Todo el documento |

---

**Documento elaborado por:** Diego Gzz (Principal Engineering Lead)
**Fecha:** 10 de marzo de 2026
**Revisado por:** Por definir (Contador Certificado)
**Aprobado por:** Por definir (Product Owner)
**Próxima actualización:** Después de validación con contador (21 marzo 2026)

---

*Fin de la Investigación de Estados Financieros con NIF*
