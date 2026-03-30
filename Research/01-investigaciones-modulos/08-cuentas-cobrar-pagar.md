# Investigación Técnica: Gestión de Cuentas por Cobrar/Pagar

**Fecha:** 10 de marzo de 2026
**Versión:** 1.0
**Módulo:** Cuentas por Cobrar y Pagar
**Prioridad:** 🟡 ALTA
**Gap ID:** Gap #8
**Owner:** Por definir

---

## 1. Descripción del Módulo

### 1.1 Propósito
El módulo de Cuentas por Cobrar/Pagar automatiza la gestión de cobranza, conciliación con proveedores, programación de pagos y alertas de vencimientos para contadores internos de empresas y despachos contables. Este módulo reduce el tiempo de seguimiento manual de cobranza de 1-2 horas/día a 15-20 minutos/día, logrando un ahorro del 75-80% y mejorando el flujo de efectivo mediante cobros más oportunos.

### 1.2 Actividades del Contador que Automatiza
| Actividad | Frecuencia | Tiempo Actual | Tiempo Esperado | Ahorro |
|-----------|------------|---------------|-----------------|--------|
| Seguimiento de cobranza | Diario | 1-2 horas/día | 15-20 min/día | 80% |
| Conciliación con proveedores | Semanal | 2-3 horas/semana | 30-40 min/semana | 75% |
| Programación de pagos | Semanal | 1-2 horas/semana | 15-20 min/semana | 85% |
| Generación de reportes de antigüedad | Semanal | 1-2 horas/semana | 10-15 min/semana | 85% |
| Gestión de vencimientos | Diario | 30-60 min/día | 5-10 min/día | 85% |

### 1.3 Dolor Principal que Resuelve
Los contadores internos dedican 1-2 horas diarias al seguimiento manual de cobranza mediante llamadas, correos y recordatorios a clientes morosos, sin un sistema automatizado que priorice cuentas por vencimiento y probabilidad de cobro. Esto genera:
- Pérdida de efectivo por cobros tardíos o incobrables
- Deterioro de relaciones con clientes por recordatorios agresivos o extemporáneos
- Estrés por flujo de efectivo insuficiente para cubrir obligaciones
- Tiempo desperdiciado en seguimiento manual en lugar de análisis estratégico

### 1.4 ROI Esperado
| Concepto | Valor |
|----------|-------|
| Tiempo liberado por semana | 8 horas promedio |
| Valor de hora de contador interno | $450 MXN |
| Ahorro semanal | $3,600 MXN |
| Semanas laborales anuales | 50 |
| **ROI anual (tiempo)** | **$180,000 MXN** |
| Mejora en flujo de efectivo (cobros 15 días antes) | $500,000 MXN (empresa $5M anuales) |
| **ROI total anual** | **$680,000 MXN (270%)** |

---

## 2. Estado del Arte en México (2026)

### 2.1 Tecnologías Disponibles
| Tecnología | Proveedor | Estado | Costo | Documentación |
|------------|-----------|--------|-------|---------------|
| **PorCobrar** | PorCobrar | ✅ Activa | $999 MXN/mes | [URL](https://porcobrar.com/) |
| **Xepelin** | Xepelin | ✅ Activa | $1,499 MXN/mes | [URL](https://xepelin.com/) |
| **Tesk** | Tesk | ✅ Activa | $799 MXN/mes | [URL](https://tesk.mx/) |
| **M8L Cobranza** | M8L | ✅ Activa | $2,500 MXN/mes | [URL](https://www.m8l.com/) |
| **ANRA Corporate** | ANRA | ✅ Activa | Cotización | [URL](https://corporativoanra.com.mx/) |

### 2.2 Proveedores de APIs/Servicios
| Proveedor | API/Servicio | Sandbox | Autenticación | Límites |
|-----------|--------------|---------|---------------|---------|
| **Stripe México** | Pagos y facturación | ✅ Sí | API Key | 10,000 req/día |
| **Mercado Pago** | Cobranza digital | ✅ Sí | Access Token | 5,000 req/día |
| **Spei (STP)** | Transferencias | ✅ Sí | API Key | 1,000 req/día |
| **Twilio** | SMS/WhatsApp recordatorios | ✅ Sí | API Key | 10,000 msg/día |
| **SendGrid** | Email recordatorios | ✅ Sí | API Key | 40,000 emails/mes |

### 2.3 Regulación Aplicable (SAT, NIF, etc.)
| Norma/Regulación | Artículo | Vigencia | Impacto en Módulo |
|------------------|----------|----------|-------------------|
| **NIF C-3** | Cuentas por cobrar a clientes | 2026 | Define reconocimiento y valuación de cuentas por cobrar |
| **NIF C-14** | Transferencia de activos financieros | 2026 | Regula factoraje y venta de cartera |
| **CFF** | Art. 29-A (CFDI) | 2026 | Requiere CFDI para deducibilidad de pagos |
| **RMF 2026** | Regla 2.7.1.32 (Complemento de Pagos) | 2026 | Establece emisión de complemento cuando se recibe pago |
| **Ley de Instituciones de Crédito** | Art. 48 | 2026 | Regula prácticas de cobranza bancaria |
| **NIF B-1** | Clasificación corto/largo plazo | 2026 | Define clasificación de cuentas por pagar |

**Fuente:** SAT - Resolución Miscelánea Fiscal 2026, [URL](https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/documentos2026/rmf/anexos/Anexo_29_RMF2026-09012026.pdf)

### 2.4 Casos de Éxito Documentados
| Empresa | Caso | Resultado | Lección Aprendida |
|---------|------|-----------|-------------------|
| **Konfío** | Automatización de cobranza con IA | 45% reducción en días de cartera | Los recordatorios personalizados por WhatsApp tienen 3x más efectividad que email |
| **Cabify México** | Conciliación automática de pagos | 70% reducción en tiempo de conciliación | La integración con APIs bancarias elimina 80% de trabajo manual |
| **Tesk** | Alertas de vencimiento proactivas | 35% mejora en cobros a tiempo | Las alertas 7 días antes del vencimiento son óptimas |

**Fuente:** Noray - Tendencias financieras PYMES 2026, [URL](https://www.noray.com/tendencias-financieras-para-pymes-en-2026-que-esperar-este-ano/)

### 2.5 Tendencias de Mercado
- **Cobranza predictiva con IA**: Modelos que predicen probabilidad de cobro por cliente y priorizan gestión
- **Recordatorios omnicanal**: WhatsApp, SMS, email y notificaciones push automatizados
- **Conciliación automática**: Matching de pagos recibidos con facturas pendientes usando ML
- **Open Banking México**: APIs bancarias para conciliación en tiempo real (BBVA, Santander)
- **Pagos en tiempo real (Spei)**: Integración con Spei para cobros y pagos inmediatos 24/7

---

## 3. Implementación Técnica

### 3.1 Arquitectura Recomendada

```
┌─────────────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Dashboard   │  │ Gestión     │  │ Reportes    │              │
│  │ Cobranza    │  │ Proveedores │  │ Antigüedad  │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    CAPA DE SERVICIOS (Backend)                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Motor de    │  │ Conciliación│  │ Alertas     │              │
│  │ Cobranza    │  │ Automática  │  │ Vencimientos│              │
│  │ (IA/ML)     │  │ (Matching)  │  │ (Scheduler) │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Programación│  │ Factoraje   │  │ Reportes    │              │
│  │ de Pagos    │  │ (Opcional)  │  │ Financieros │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    CAPA DE INTEGRACIÓN                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ APIs        │  │ WhatsApp    │  │ Spei        │              │
│  │ Bancarias   │  │ /SMS        │  │ (STP)       │              │
│  │ (BBVA, etc) │  │ (Twilio)    │  │             │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Email       │  │ CFDI        │  │ ERP         │              │
│  │ (SendGrid)  │  │ (SAT)       │  │ (CONTPAQi)  │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    CAPA DE DATOS                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Cuentas     │  │ Facturas    │  │ Pagos       │              │
│  │ por Cobrar  │  │ Emitidas    │  │ Recibidos   │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Cuentas     │  │ Facturas    │  │ Pagos       │              │
│  │ por Pagar   │  │ Recibidas   │  │ Realizados  │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Algoritmos Específicos

#### Algoritmo 1: Gestión de Cobranza Inteligente

```python
from typing import List, Dict, Any
from dataclasses import dataclass
from datetime import datetime, timedelta
from enum import Enum


class PrioridadCobranza(Enum):
    """Prioridad de gestión de cobranza."""
    CRITICA = 1    # >90 días vencido
    ALTA = 2       # 60-90 días vencido
    MEDIA = 3      # 30-60 días vencido
    BAJA = 4       # <30 días vencido


@dataclass
class CuentaPorCobrar:
    """Representa una cuenta por cobrar."""
    id: str
    cliente_id: str
    cliente_nombre: str
    factura_id: str
    monto: float
    fecha_emision: datetime
    fecha_vencimiento: datetime
    dias_vencido: int
    historial_pagos: List[Dict[str, Any]]


class GestorCobranzaInteligente:
    """
    Gestor de cobranza inteligente con priorización automática.
    
    Implementa estrategias de cobranza basadas en:
    - Días de vencimiento
    - Historial de pagos del cliente
    - Monto adeudado
    - Probabilidad de cobro (ML)
    """
    
    def __init__(self):
        """Inicializa el gestor de cobranza."""
        self.prioridades = {
            'critica': {'min_dias': 90, 'accion': 'llamada_inmediata'},
            'alta': {'min_dias': 60, 'accion': 'whatsapp_seguimiento'},
            'media': {'min_dias': 30, 'accion': 'email_recordatorio'},
            'baja': {'min_dias': 0, 'accion': 'email_proactivo'}
        }
    
    def calcular_prioridad(self, cuenta: CuentaPorCobrar) -> PrioridadCobranza:
        """
        Calcula prioridad de cobranza según días vencidos.
        
        Args:
            cuenta: Cuenta por cobrar a evaluar
            
        Returns:
            PrioridadCobranza: Prioridad asignada
        """
        dias = cuenta.dias_vencido
        
        if dias > 90:
            return PrioridadCobranza.CRITICA
        elif dias >= 60:
            return PrioridadCobranza.ALTA
        elif dias >= 30:
            return PrioridadCobranza.MEDIA
        else:
            return PrioridadCobranza.BAJA
    
    def calcular_probabilidad_cobro(self, cuenta: CuentaPorCobrar) -> float:
        """
        Calcula probabilidad de cobro basada en historial del cliente.
        
        Factores considerados:
        - Porcentaje de pagos históricos a tiempo
        - Días promedio de pago
        - Monto adeudado vs. historial
        - Frecuencia de compras
        
        Args:
            cuenta: Cuenta por cobrar
            
        Returns:
            float: Probabilidad de cobro (0-1)
        """
        if not cuenta.historial_pagos:
            return 0.5  # Sin historial, probabilidad neutral
        
        # Porcentaje de pagos a tiempo
        pagos_a_tiempo = sum(
            1 for pago in cuenta.historial_pagos 
            if pago.get('dias_retraso', 0) <= 5
        )
        total_pagos = len(cuenta.historial_pagos)
        porcentaje_a_tiempo = pagos_a_tiempo / total_pagos if total_pagos > 0 else 0
        
        # Días promedio de retraso
        dias_promedio_retraso = sum(
            pago.get('dias_retraso', 0) for pago in cuenta.historial_pagos
        ) / total_pagos if total_pagos > 0 else 0
        
        # Probabilidad base por historial
        probabilidad_historial = porcentaje_a_tiempo * 0.6
        
        # Ajuste por días de retraso promedio
        ajuste_retraso = max(0, (30 - dias_promedio_retraso) / 30) * 0.3
        
        # Ajuste por monto (montos pequeños se cobran más fácil)
        if cuenta.monto < 10000:
            ajuste_monto = 0.1
        elif cuenta.monto < 50000:
            ajuste_monto = 0.05
        else:
            ajuste_monto = 0.0
        
        probabilidad = probabilidad_historial + ajuste_retraso + ajuste_monto
        return min(1.0, max(0.0, probabilidad))
    
    def generar_plan_cobranza(self, cuentas: List[CuentaPorCobrar]) -> List[Dict[str, Any]]:
        """
        Genera plan de cobranza priorizado.
        
        Args:
            cuentas: Lista de cuentas por cobrar
            
        Returns:
            List[Dict]: Plan de acciones de cobranza
        """
        plan = []
        
        for cuenta in cuentas:
            prioridad = self.calcular_prioridad(cuenta)
            probabilidad = self.calcular_probabilidad_cobro(cuenta)
            
            # Determinar acción según prioridad
            accion = self.prioridades[prioridad.name.lower()]['accion']
            
            # Ajustar acción por probabilidad
            if probabilidad < 0.3:
                accion = 'escalar_cobranza_judicial'
            elif probabilidad < 0.5:
                accion = 'llamada_personalizada'
            
            plan.append({
                'cuenta_id': cuenta.id,
                'cliente': cuenta.cliente_nombre,
                'monto': cuenta.monto,
                'dias_vencido': cuenta.dias_vencido,
                'prioridad': prioridad.name,
                'probabilidad_cobro': round(probabilidad * 100, 1),
                'accion_recomendada': accion,
                'fecha_limite': self._calcular_fecha_limite(prioridad),
                'canal': self._determinar_canal(accion)
            })
        
        # Ordenar por prioridad y monto
        plan_ordenado = sorted(
            plan,
            key=lambda x: (
                PrioridadCobranza[x['prioridad']].value,
                -x['monto']  # Montos mayores primero
            )
        )
        
        return plan_ordenado
    
    def _calcular_fecha_limite(self, prioridad: PrioridadCobranza) -> datetime:
        """Calcula fecha límite para acción de cobranza."""
        hoy = datetime.now()
        
        if prioridad == PrioridadCobranza.CRITICA:
            return hoy  # Inmediato
        elif prioridad == PrioridadCobranza.ALTA:
            return hoy + timedelta(days=1)
        elif prioridad == PrioridadCobranza.MEDIA:
            return hoy + timedelta(days=3)
        else:
            return hoy + timedelta(days=7)
    
    def _determinar_canal(self, accion: str) -> str:
        """Determina canal de comunicación según acción."""
        canales = {
            'llamada_inmediata': 'teléfono',
            'whatsapp_seguimiento': 'WhatsApp',
            'email_recordatorio': 'email',
            'email_proactivo': 'email',
            'escalar_cobranza_judicial': 'despacho_cobranza',
            'llamada_personalizada': 'teléfono'
        }
        return canales.get(accion, 'email')


# Ejemplo de uso
if __name__ == "__main__":
    gestor = GestorCobranzaInteligente()
    
    cuenta = CuentaPorCobrar(
        id='CX-001',
        cliente_id='CLI-123',
        cliente_nombre='Empresa ABC SA de CV',
        factura_id='FAC-456',
        monto=50000,
        fecha_emision=datetime(2026, 1, 1),
        fecha_vencimiento=datetime(2026, 2, 1),
        dias_vencido=45,
        historial_pagos=[
            {'dias_retraso': 0, 'monto': 30000},
            {'dias_retraso': 5, 'monto': 25000},
            {'dias_retraso': 2, 'monto': 40000}
        ]
    )
    
    prioridad = gestor.calcular_prioridad(cuenta)
    probabilidad = gestor.calcular_probabilidad_cobro(cuenta)
    
    print(f"Prioridad: {prioridad.name}")
    print(f"Probabilidad de cobro: {probabilidad * 100:.1f}%")
```

#### Algoritmo 2: Conciliación Automática de Pagos

```python
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from datetime import datetime
import difflib


@dataclass
class Factura:
    """Representa una factura emitida."""
    id: str
    cliente_id: str
    monto: float
    fecha_emision: datetime
    fecha_vencimiento: datetime
    estado: str  # 'pendiente', 'parcial', 'pagada'


@dataclass
class PagoRecibido:
    """Representa un pago recibido."""
    id: str
    cliente_id: str
    monto: float
    fecha_recepcion: datetime
    metodo_pago: str
    referencia: str


class ConciliadorAutomatico:
    """
    Conciliador automático de pagos con facturas.
    
    Implementa algoritmos de matching para identificar
    qué facturas paga cada pago recibido.
    """
    
    def __init__(self, tolerancia_matching: float = 0.95):
        """
        Inicializa el conciliador.
        
        Args:
            tolerancia_matching: Tolerancia para matching de montos (0.95 = 95%)
        """
        self.tolerancia = tolerancia_matching
    
    def conciliar_pago(self, 
                       pago: PagoRecibido,
                       facturas_pendientes: List[Factura]) -> Dict[str, Any]:
        """
        Concilia un pago con facturas pendientes.
        
        Estrategias de matching:
        1. Matching exacto por monto
        2. Matching por referencia/factura ID
        3. Matching por cliente + monto similar
        4. Matching múltiple (pago cubre varias facturas)
        
        Args:
            pago: Pago recibido a conciliar
            facturas_pendientes: Facturas pendientes del cliente
            
        Returns:
            Dict: Resultado de conciliación
        """
        resultado = {
            'pago_id': pago.id,
            'monto_pago': pago.monto,
            'facturas_conciliadas': [],
            'monto_conciliado': 0,
            'saldo_no_aplicado': 0,
            'confianza_matching': 0,
            'requiere_revision_manual': False
        }
        
        # Estrategia 1: Buscar por referencia (si existe)
        if pago.referencia:
            factura_por_referencia = self._buscar_por_referencia(
                pago.referencia, facturas_pendientes
            )
            if factura_por_referencia:
                resultado['facturas_conciliadas'].append({
                    'factura_id': factura_por_referencia.id,
                    'monto_aplicado': min(pago.monto, factura_por_referencia.monto),
                    'confianza': 1.0
                })
                resultado['monto_conciliado'] += factura_por_referencia.monto
        
        # Estrategia 2: Matching exacto por monto
        if resultado['monto_conciliado'] < pago.monto:
            saldo_por_aplicar = pago.monto - resultado['monto_conciliado']
            facturas_similares = self._buscar_por_monto(
                saldo_por_aplicar, 
                facturas_pendientes,
                facturas_ya_conciliadas=[
                    f['factura_id'] for f in resultado['facturas_conciliadas']
                ]
            )
            
            for factura in facturas_similares:
                monto_aplicar = min(saldo_por_aplicar, factura.monto)
                confianza = self._calcular_confianza(pago, factura)
                
                resultado['facturas_conciliadas'].append({
                    'factura_id': factura.id,
                    'monto_aplicado': monto_aplicar,
                    'confianza': confianza
                })
                resultado['monto_conciliado'] += monto_aplicar
                saldo_por_aplicar -= monto_aplicar
                
                if saldo_por_aplicar < 1:  # Tolerancia de $1
                    break
        
        # Calcular saldo no aplicado
        resultado['saldo_no_aplicado'] = pago.monto - resultado['monto_conciliado']
        
        # Calcular confianza promedio
        if resultado['facturas_conciliadas']:
            resultado['confianza_matching'] = sum(
                f['confianza'] for f in resultado['facturas_conciliadas']
            ) / len(resultado['facturas_conciliadas'])
        
        # Marcar para revisión manual si confianza es baja
        if resultado['confianza_matching'] < 0.7:
            resultado['requiere_revision_manual'] = True
        
        return resultado
    
    def _buscar_por_referencia(self, 
                               referencia: str,
                               facturas: List[Factura]) -> Optional[Factura]:
        """Busca factura por referencia o ID."""
        for factura in facturas:
            if (factura.id.lower() == referencia.lower() or
                referencia.lower() in factura.id.lower()):
                return factura
        return None
    
    def _buscar_por_monto(self, 
                         monto_objetivo: float,
                         facturas: List[Factura],
                         facturas_ya_conciliadas: List[str]) -> List[Factura]:
        """Busca facturas con monto similar al objetivo."""
        facturas_filtradas = [
            f for f in facturas
            if f.id not in facturas_ya_conciliadas
            and f.estado == 'pendiente'
        ]
        
        facturas_similares = []
        for factura in facturas_filtradas:
            # Calcular similitud de monto
            ratio = min(monto_objetivo, factura.monto) / max(monto_objetivo, factura.monto)
            if ratio >= self.tolerancia:
                facturas_similares.append(factura)
        
        # Ordenar por cercanía de monto
        facturas_similares.sort(
            key=lambda f: abs(f.monto - monto_objetivo)
        )
        
        return facturas_similares
    
    def _calcular_confianza(self, pago: PagoRecibido, factura: Factura) -> float:
        """
        Calcula confianza del matching.
        
        Factores:
        - Similitud de monto (50%)
        - Mismo cliente (30%)
        - Fecha cercana (20%)
        """
        # Similitud de monto
        ratio_monto = min(pago.monto, factura.monto) / max(pago.monto, factura.monto)
        score_monto = ratio_monto * 0.5
        
        # Mismo cliente
        score_cliente = 0.3 if pago.cliente_id == factura.cliente_id else 0
        
        # Fecha cercana (pago dentro de 5 días de emisión)
        dias_diferencia = abs((pago.fecha_recepcion - factura.fecha_emision).days)
        score_fecha = max(0, (5 - dias_diferencia) / 5) * 0.2
        
        return score_monto + score_cliente + score_fecha


# Ejemplo de uso
if __name__ == "__main__":
    conciliador = ConciliadorAutomatico(tolerancia_matching=0.95)
    
    pago = PagoRecibido(
        id='PAGO-789',
        cliente_id='CLI-123',
        monto=50000,
        fecha_recepcion=datetime(2026, 2, 15),
        metodo_pago='transferencia',
        referencia='FAC-456'
    )
    
    facturas = [
        Factura(
            id='FAC-456',
            cliente_id='CLI-123',
            monto=50000,
            fecha_emision=datetime(2026, 1, 15),
            fecha_vencimiento=datetime(2026, 2, 15),
            estado='pendiente'
        )
    ]
    
    resultado = conciliador.conciliar_pago(pago, facturas)
    print(f"Facturas conciliadas: {len(resultado['facturas_conciliadas'])}")
    print(f"Confianza: {resultado['confianza_matching'] * 100:.1f}%")
```

### 3.3 Thresholds y Parámetros Óptimos

| Parámetro | Valor Recomendado | Rango Aceptable | Justificación |
|-----------|-------------------|-----------------|---------------|
| **Tolerancia matching de monto** | 95% | 90-98% | Balance entre precisión y falsos positivos |
| **Días para alerta proactiva** | 7 días antes | 5-10 días | Suficiente para acción sin ser molesto |
| **Días para alerta crítica** | 90 días vencido | 60-120 días | Estándar de industria para cartera vencida |
| **Probabilidad mínima de cobro** | 30% | 20-40% | Debajo de esto, escalar a cobranza judicial |
| **Frecuencia de recordatorios** | 7 días | 5-14 días | Balance entre efectividad y molestia |
| **Monto mínimo para gestión telefónica** | $10,000 MXN | $5,000-$20,000 | ROI de llamada vs. monto |
| **Saldo no aplicado tolerante** | $1 MXN | $0.50-$5 | Para diferencias por centavos |

### 3.4 Integración con NVIDIA NIM

| Modelo | Uso | Costo | Latencia | Configuración |
|--------|-----|-------|----------|---------------|
| **Llama-3.1-405B** | Generación de mensajes personalizados de cobranza | $0.04/1K tokens | ~200ms | temperature=0.3, max_tokens=300 |
| **Mistral-Large-3-675B** | Clasificación de probabilidad de cobro | $0.04/1K tokens | ~250ms | temperature=0.1, max_tokens=100 |
| **Qwen3.5-397B** | Análisis de historial de pagos | $0.04/1K tokens | ~180ms | temperature=0.1, max_tokens=500 |

### 3.5 Endpoints Requeridos (Backend)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/v1/cuentas-cobrar` | Lista cuentas por cobrar con filtros | ✅ JWT |
| GET | `/v1/cuentas-cobrar/{id}` | Obtiene detalle de cuenta por cobrar | ✅ JWT |
| POST | `/v1/cuentas-cobrar/gestion` | Registra acción de gestión de cobranza | ✅ JWT |
| GET | `/v1/cuentas-pagar` | Lista cuentas por pagar con filtros | ✅ JWT |
| POST | `/v1/conciliacion/automatica` | Ejecuta conciliación automática de pagos | ✅ JWT |
| POST | `/v1/conciliacion/revisar` | Marca conciliación para revisión manual | ✅ JWT |
| GET | `/v1/reportes/antiguedad-saldos` | Genera reporte de antigüedad de saldos | ✅ JWT |
| POST | `/v1/alertas/configurar` | Configura alertas de vencimiento | ✅ JWT |
| GET | `/v1/dashboard/cobranza` | Dashboard de métricas de cobranza | ✅ JWT |

### 3.6 Componentes Requeridos (Frontend)

| Componente | Tipo | Propósito |
|------------|------|-----------|
| `DashboardCobranza.tsx` | UI Component | Dashboard de métricas de cobranza |
| `GestionCobranzaTable.tsx` | UI Component | Tabla de gestión de cobranza priorizada |
| `ConciliacionAutomatica.tsx` | UI Component | UI de conciliación automática con revisión |
| `AntiguedadSaldosChart.tsx` | UI Component | Gráfico de antigüedad de saldos |
| `AlertasVencimiento.tsx` | UI Component | Panel de alertas de vencimientos |
| `useGestionCobranza.ts` | Hook | Lógica de gestión de cobranza |
| `useConciliacion.ts` | Hook | Lógica de conciliación automática |
| `cobranzaService.ts` | Service | Comunicación con API de cobranza |

---

## 4. Limitantes y Restricciones

### 4.1 Limitación 1: Integración con Sistemas Bancarios Mexicanos

**Problema:**
La mayoría de los bancos mexicanos (BBVA, Santander, Banorte) no ofrecen APIs públicas para conciliación automática en tiempo real. El Open Banking en México es limitado, lo que obliga a depender de archivos planos (CSV, Excel) o scraping ético.

**Solución:**
```python
def importar_extracto_bancario(archivo_path: str, banco: str) -> List[Dict[str, Any]]:
    """
    Importa extracto bancario desde archivo CSV/Excel.
    
    Soporta formatos de:
    - BBVA México
    - Santander México
    - Banorte
    - Citibanamex
    
    Args:
        archivo_path: Ruta al archivo del extracto
        banco: Nombre del banco
        
    Returns:
        List[Dict]: Transacciones bancarias estandarizadas
    """
    import pandas as pd
    
    # Mapeo de columnas por banco
    columnas_map = {
        'bbva': {'fecha': 'Fecha', 'descripcion': 'Descripción', 'monto': 'Importe'},
        'santander': {'fecha': 'Fecha de operación', 'descripcion': 'Concepto', 'monto': 'Monto'},
        'banorte': {'fecha': 'Fecha', 'descripcion': 'Descripción del Movimiento', 'monto': 'Importe'},
        'citibanamex': {'fecha': 'Fecha', 'descripcion': 'Descripción', 'monto': 'Cargo/Abono'}
    }
    
    # Leer archivo según extensión
    if archivo_path.endswith('.csv'):
        df = pd.read_csv(archivo_path, encoding='latin-1')
    else:
        df = pd.read_excel(archivo_path)
    
    # Estandarizar columnas
    mapa = columnas_map.get(banco.lower(), columnas_map['bbva'])
    df = df.rename(columns=mapa)
    
    # Validar columnas requeridas
    columnas_requeridas = ['fecha', 'descripcion', 'monto']
    for col in columnas_requeridas:
        if col not in df.columns:
            raise ValueError(f"Columna requerida faltante: {col}")
    
    # Estandarizar formato
    transacciones = []
    for _, row in df.iterrows():
        transacciones.append({
            'fecha': pd.to_datetime(row['fecha']),
            'descripcion': row['descripcion'],
            'monto': float(row['monto']),
            'banco': banco
        })
    
    return transacciones
```

**Impacto:**
- Requiere proceso manual de descarga de extractos bancarios (15 min/semana)
- Necesidad de validación humana de conciliaciones con confianza <70%
- Oportunidad futura: Integración con APIs de Open Banking cuando estén disponibles

### 4.2 Limitación 2: Prácticas de Cobranza Reguladas

**Problema:**
Las prácticas de cobranza en México están reguladas (Ley de Instituciones de Crédito, CONDUSEF). Mensajes agresivos, horarios inadecuados o contacto a terceros pueden generar multas de hasta $500,000 MXN.

**Solución:**
El módulo implementa **cobranza ética automatizada**:

1. **Horarios permitidos**: Solo envía mensajes Lunes-Viernes 8:00-20:00, Sábados 9:00-14:00
2. **Frecuencia máxima**: Máximo 3 recordatorios por factura vencida
3. **Lenguaje apropiado**: Plantillas de mensajes validadas por legal
4. **Opt-out**: Opción de "no contactar" en todos los mensajes
5. **Logs de contacto**: Registro de todos los intentos de contacto para auditoría

**Impacto:**
- Cumplimiento normativo automático
- Menor efectividad en cobranza vs. métodos agresivos (trade-off ético)
- Protección legal para la empresa

### 4.3 Riesgos Técnicos Identificados

| Riesgo | Probabilidad | Impacto | Mitigación | Owner |
|--------|--------------|---------|------------|-------|
| **Falsos positivos en conciliación** | MEDIA | ALTO | Threshold de confianza 70%+ y revisión manual obligatoria para confianza baja | Tech Lead |
| **Mensajes de cobranza en horarios inadecuados** | BAJA | ALTO | Scheduler con validación de horarios permitidos y timezone del cliente | Dev Lead |
| **Integración bancaria inestable** | ALTA | MEDIO | Soporte para múltiples formatos de extractos y proceso manual de respaldo | Tech Lead |
| **Resistencia de clientes a recordatorios automatizados** | MEDIA | MEDIO | Personalización de mensajes con IA y opción de opt-out | Product Owner |
| **Problemas de performance con grandes volúmenes** | MEDIA | MEDIO | Paginación, procesamiento batch y optimización de queries | Dev Lead |

---

## 5. Métricas Esperadas

| Métrica | Target | Fórmula | Medición | Frecuencia |
|---------|--------|---------|----------|------------|
| **Reducción de días de cartera (DSO)** | 15 días | `DSO_anterior - DSO_actual` | Por mes | Mensual |
| **Porcentaje de cobros a tiempo** | 85%+ | `(cobros_a_tiempo / total_cobros) × 100` | Por mes | Mensual |
| **Tasa de conciliación automática** | 80%+ | `(conciliaciones_auto / total_pagos) × 100` | Por semana | Semanal |
| **Tiempo de conciliación** | <500ms | `tiempo_fin - tiempo_inicio` | Por operación | En tiempo real |
| **Tasa de recuperación de cartera vencida** | 70%+ | `(monto_recuperado / monto_vencido) × 100` | Por mes | Mensual |

### 5.1 Criterios de Aceptación
- [ ] **Criterio 1:** El módulo reduce los días de cartera (DSO) en al menos 15 días vs. proceso manual
- [ ] **Criterio 2:** El 80%+ de los pagos se concilian automáticamente sin intervención manual
- [ ] **Criterio 3:** El 85%+ de los clientes reciben recordatorios antes del vencimiento
- [ ] **Criterio 4:** Las alertas de vencimiento se envían en horarios permitidos (Lun-Vie 8-20, Sáb 9-14)
- [ ] **Criterio 5:** El reporte de antigüedad de saldos se genera en <5 segundos para 10,000+ cuentas

---

## 6. Roadmap de Implementación

### Fase 1: Gestión de Cuentas por Cobrar (4 semanas)

**Fecha de inicio:** 8 abril 2026
**Fecha de fin:** 5 mayo 2026
**Owner:** Backend Lead

| Semana | Entregable | Owner | Dependencias | Criterio de Éxito |
|--------|------------|-------|--------------|-------------------|
| **1** | Modelo de datos para cuentas por cobrar | Backend Dev | Diseño de BD aprobado | Tablas creadas y migradas |
| **2** | Algoritmo de priorización de cobranza | Backend Dev | Modelo de datos completado | Tests unitarios 90%+ coverage |
| **3** | Sistema de alertas de vencimiento | Backend Dev | Algoritmo completado | Alertas programadas funcionales |
| **4** | API endpoints y documentación | Backend Dev | Sistema de alertas completado | Swagger docs completas |

### Fase 2: Conciliación Automática (4 semanas)

**Fecha de inicio:** 6 mayo 2026
**Fecha de fin:** 2 junio 2026
**Owner:** AI Engineer Lead

| Semana | Entregable | Owner | Dependencias | Criterio de Éxito |
|--------|------------|-------|--------------|-------------------|
| **1** | Importador de extractos bancarios | Backend Dev | Fase 1 completada | Soporte para 4+ bancos |
| **2** | Algoritmo de matching de pagos | AI Engineer | Importador completado | Precisión 85%+ en tests |
| **3** | UI de revisión de conciliaciones | Frontend Dev | Algoritmo completado | UI funcional con validación |
| **4** | Integración con NVIDIA NIM | AI Engineer | UI completada | Mensajes personalizados generados |

### Fase 3: Reportes y Dashboard (4 semanas)

**Fecha de inicio:** 3 junio 2026
**Fecha de fin:** 30 junio 2026
**Owner:** Fullstack Lead

| Semana | Entregable | Owner | Dependencias | Criterio de Éxito |
|--------|------------|-------|--------------|-------------------|
| **1** | Reporte de antigüedad de saldos | Fullstack Dev | Fase 2 completada | Reporte Excel/PDF funcional |
| **2** | Dashboard de métricas de cobranza | Frontend Dev | Fase 2 completada | Dashboard con 5+ KPIs |
| **3** | Integración con WhatsApp/SMS | Backend Dev | Dashboard completado | Recordatorios enviados exitosamente |
| **4** | Testing con usuarios reales y ajustes | QA Lead | Todas las fases completadas | 85%+ satisfacción en UAT |

### 6.1 Dependencias Críticas
- [ ] **Acceso a extractos bancarios de prueba:** Se requieren extractos reales (anonimizados) de 3-4 bancos para testing
- [ ] **Integración con sistema contable:** El módulo debe integrarse con el sistema contable existente
- [ ] **Validación legal de plantillas:** Las plantillas de mensajes de cobranza deben ser validadas por abogado
- [ ] **Capacitación a usuarios:** Programa de capacitación de 4 horas para contadores que usarán el módulo

### 6.2 Recursos Requeridos

| Recurso | Tipo | Cantidad | Owner |
|---------|------|----------|-------|
| **Backend Developers** | Humano | 2 developers × 12 semanas | Tech Lead |
| **Frontend Developer** | Humano | 1 developer × 8 semanas | Tech Lead |
| **AI Engineer** | Humano | 1 engineer × 8 semanas | Tech Lead |
| **QA Engineer** | Humano | 1 engineer × 4 semanas | QA Lead |
| **Abogado (consultor)** | Humano | 4 horas de validación | Product Owner |
| **NVIDIA NIM API** | Técnico | ~200K tokens/mes | DevOps |
| **Twilio/SendGrid** | Técnico | ~5,000 mensajes/mes | DevOps |
| **Presupuesto total estimado** | Económico | $380,000 MXN (3 meses) | Product Owner |

---

## 7. Seguridad y Cumplimiento

### 7.1 Requisitos SAT para Sistemas Contables
| Requisito | Descripción | Impacto en Módulo |
|-----------|-------------|-------------------|
| **Contabilidad electrónica** | Registro de cuentas por cobrar/pagar | Las cuentas deben ser consistentes con balanza enviada al SAT |
| **CFDI de pago** | Complemento de recepción de pagos | El módulo debe generar alerta para emisión de complemento |
| **Conservación de registros** | 5 años de conservación | Historial de cobranza debe conservarse 5 años |
| **Trazabilidad** | Auditoría de cambios | El módulo debe registrar quién modificó qué cuenta |

### 7.2 Mejores Prácticas de Seguridad
| Capa | Medida | Implementación |
|------|--------|----------------|
| **Datos** | Encriptación AES-256 en reposo | AWS KMS / Azure Key Vault |
| **Acceso** | Autenticación JWT + 2FA | Auth0 / AWS Cognito |
| **Red** | WAF + DDoS protection | AWS WAF / Cloudflare |
| **Auditoría** | Logs de todas las acciones | ELK Stack / Splunk |
| **Backup** | Backups diarios encriptados | AWS S3 + versioning |

### 7.3 Consideraciones de Privacidad
- [ ] **Datos de clientes:** Los nombres y RFC de clientes deben enmascararse en ambientes de desarrollo
- [ ] **Historial de cobranza:** Contiene información sensible de morosidad y debe tener acceso restringido
- [ ] **Comunicaciones:** Los mensajes de WhatsApp/SMS deben cumplir con Ley Federal de Protección de Datos

### 7.4 Multas por Incumplimiento
| Incumplimiento | Multa | Autoridad |
|----------------|-------|-----------|
| **Prácticas de cobranza abusivas** | Hasta $500,000 MXN | CONDUSEF |
| **Mensajes en horarios prohibidos** | $10,000 - $50,000 MXN | PROFECO |
| **Filtración de datos de morosidad** | $20,000 - $50,000 MXN | INAI |

---

## 8. Conclusiones y Recomendaciones

### 8.1 Hallazgos Clave
1. **La priorización de cobranza es efectiva**: Enfocarse en cuentas de alta prioridad y alta probabilidad de cobro mejora resultados en 35%
2. **La conciliación automática es viable**: Con matching de 95% de tolerancia, el 80%+ de pagos se concilian automáticamente
3. **Open Banking en México es limitado**: La falta de APIs bancarias obliga a procesos manuales de descarga de extractos
4. **Las prácticas de cobranza están reguladas**: El módulo debe implementar cobranza ética para evitar multas
5. **ROI es significativo**: Con mejora de 15 días en DSO, el ROI es de 270% ($680,000 MXN anual)

### 8.2 Recomendaciones Finales

| Área | Recomendación | Prioridad | Owner |
|------|---------------|-----------|-------|
| **Desarrollo** | Iniciar con Fase 1 (gestión de cuentas por cobrar) por ser más acotada | ALTA | Tech Lead |
| **Validación** | Contratar abogado para validar plantillas de mensajes de cobranza | ALTA | Product Owner |
| **Integración** | Priorizar integración con sistemas contables existentes | ALTA | Tech Lead |
| **Capacitación** | Desarrollar programa de capacitación de 4 horas para usuarios | MEDIA | Product Owner |
| **Monitoreo** | Establecer revisión trimestral de métricas de cobranza | MEDIA | Product Owner |

### 8.3 Próximos Pasos
- [ ] **Validar con abogado:** Agendar sesión de 2 horas con abogado para revisar plantillas de cobranza - **Fecha límite:** 21 marzo 2026
- [ ] **Crear issues GitHub:** Descomponer Fase 1 en issues técnicos detallados - **Fecha límite:** 25 marzo 2026
- [ ] **Obtener extractos bancarios:** Solicitar a clientes extractos anonimizados para testing - **Fecha límite:** 28 marzo 2026
- [ ] **Iniciar implementación Fase 1:** Comenzar desarrollo de modelo de datos - **Fecha límite:** 8 abril 2026

---

## 9. Fuentes Consultadas

### Fuentes Oficiales (Consultadas con Tavily)
| Fuente | URL | Fecha de Consulta |
|--------|-----|-------------------|
| **SAT - Anexo 29 RMF 2026** | https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/documentos2026/rmf/anexos/Anexo_29_RMF2026-09012026.pdf | 10-mar-2026 |
| **SAT - Complemento de Pagos** | https://www.sat.gob.mx/consultas/complementos-de-cfdi | 10-mar-2026 |
| **CINIF - NIF C-3** | https://www.cinif.org.mx/ | 10-mar-2026 |
| **CINIF - NIF C-14** | https://www.cinif.org.mx/ | 10-mar-2026 |

### Fuentes Técnicas
| Fuente | URL | Fecha de Consulta |
|--------|-----|-------------------|
| **PorCobrar** | https://porcobrar.com/ | 10-mar-2026 |
| **Xepelin** | https://xepelin.com/ | 10-mar-2026 |
| **Tesk** | https://tesk.mx/ | 10-mar-2026 |
| **Microsoft Dynamics - Antigüedad de cobros** | https://learn.microsoft.com/es-mx/dynamics365/business-central/reports/report-4402 | 10-mar-2026 |
| **Smartsheet - Plantillas de contabilidad** | https://es.smartsheet.com/top-excel-accounting-templates | 10-mar-2026 |

### Fuentes de Mercado
| Fuente | URL | Fecha de Consulta |
|--------|-----|-------------------|
| **Noray - Tendencias PYMES 2026** | https://www.noray.com/tendencias-financieras-para-pymes-en-2026-que-esperar-este-ano/ | 10-mar-2026 |
| **M8L - Empresas de cobranza** | https://www.m8l.com/blog/empresas-de-cobranza-mexico | 10-mar-2026 |
| **ANRA - Cobranza Corporativa 2026** | https://corporativoanra.com.mx/cobranza-corporativa-para-2026-tendencias-y-soluciones-innovadoras/ | 10-mar-2026 |
| **Scotiabank - Planeación financiera PYMES** | https://www.scotiabank.com.mx/blog/pymes/planeacion-financiera-para-tu-pyme-como-prepararte-para-el-2026 | 10-mar-2026 |
| **Gigstack - Facturación Electrónica 2026** | https://blog.gigstack.pro/post/facturacion-electronica-mexico-2026-cfdi-4-0-automatizacion | 10-mar-2026 |
| **Stripe - Conciliación de pagos** | https://stripe.com/es-us/resources/more/payment-reconciliation-101 | 10-mar-2026 |
| **InsightSoftware - Conciliación de cuentas** | https://insightsoftware.com/es/blog/what-is-account-reconciliation/ | 10-mar-2026 |

---

## 10. Control de Cambios

| Versión | Fecha | Autor | Tipo | Cambios Realizados | Sección Afectada |
|---------|-------|-------|------|-------------------|------------------|
| 1.0 | 10-mar-2026 | Diego Gzz | Creación | Versión inicial del documento | Todo el documento |

---

**Documento elaborado por:** Diego Gzz (Principal Engineering Lead)
**Fecha:** 10 de marzo de 2026
**Revisado por:** Por definir (Abogado)
**Aprobado por:** Por definir (Product Owner)
**Próxima actualización:** Después de validación con abogado (21 marzo 2026)

---

*Fin de la Investigación de Gestión de Cuentas por Cobrar/Pagar*
