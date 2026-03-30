"""
Servicio de Proyección de Flujo de Efectivo (Fase 10).
"""
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

class CashflowForecaster:
    """
    Pronóstico de Flujo de Efectivo a 90 días con Probabilidad Ponderada de Cobro.
    """
    def __init__(self):
        # Probabilidad de cobro basada en antigüedad de saldos (Research 11)
        self.collection_probabilities = {
            "current": 0.95,      # No vencido
            "1_to_30_days": 0.85, # 1-30 días vencido
            "31_to_60_days": 0.70,# 31-60 días vencido
            "61_to_90_days": 0.50,# 61-90 días vencido
            "over_90_days": 0.20  # Más de 90 días
        }

    def predict_cashflow(self, receivables: List[Dict[str, Any]], payables: List[Dict[str, Any]], current_balance: float = 0.0) -> Dict[str, Any]:
        """
        Calcula la proyección a 90 días del flujo de efectivo ponderando
        la probabilidad matemática de las cuentas por cobrar según su estatus.
        
        El dict espera tener las keys: 'amount' y 'aging_term'
        Ejemplo aging_term = 'current', '1_to_30_days', etc.
        """
        logger.info(f"Calculando flujo de efectivo a 90 días. Saldo inicial: {current_balance}")
        
        # 1. Proyectar Entradas Ponderadas (Cobros)
        projected_inflows = 0.0
        for rec in receivables:
            term = rec.get("aging_term", "current")
            amount = rec.get("amount", 0.0)
            prob = self.collection_probabilities.get(term, 0.50)
            projected_inflows += (amount * prob)
            
        # 2. Proyectar Salidas (Pagos - Asumimos 100% de pago obligatorio)
        projected_outflows = sum(pay.get("amount", 0.0) for pay in payables)
        
        # 3. Calcular métricas finales
        projected_balance = current_balance + projected_inflows - projected_outflows
        
        status_flag = "healthy"
        if projected_balance < 0:
            status_flag = "critical"
        elif projected_balance < (projected_outflows * 0.2):
            status_flag = "warning"
            
        return {
            "current_balance": current_balance,
            "projected_inflows_adjusted": round(projected_inflows, 2),
            "projected_outflows": round(projected_outflows, 2),
            "projected_final_balance": round(projected_balance, 2),
            "status": status_flag,
            "recommendation": self._generate_recommendation(status_flag)
        }

    def _generate_recommendation(self, status: str) -> str:
        if status == "critical":
            return "ALERTA: Se proyecta insolvencia. Urge negociar extensión de cuentas por pagar o solicitar línea de crédito a corto plazo."
        elif status == "warning":
            return "PRECAUCIÓN: Liquidez ajustada. Se recomienda acelerar gestiones de cobranza de la cartera vencida a 30 y 60 días."
        return "ÓPTIMO: Flujo de caja saludable para cubrir los compromisos a 90 días."
