"""
Servicio del Detector de Riesgos (EFOs y Variaciones Atípicas) (Fase 10)
"""
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

class RiskDetector:
    """
    Detecta operaciones con EFOs (Artículo 69-B) en el historial y busca
    anomalías numéricas fiscales sospechosas.
    """
    def __init__(self):
        pass

    def evaluate_transaction_risks(self, transactions: List[Dict[str, Any]], efos_list: List[str]) -> Dict[str, Any]:
        """
        Evalúa iterativamente una serie de transacciones para localizar
        cruces con las empresas facturadoras de operaciones simuladas (EFO).

        Args:
        - transactions: lista dicts conteniendo 'id', 'rfc_proveedor', 'monto', 'concepto'
        - efos_list: lista de strings de RFCs clasificados actualmente como EFO definitivos o presuntos.
        """
        risks = []
        total_risk_amount: float = 0.0

        for tx in transactions:
            rfc = tx.get("rfc_proveedor", "").strip().upper()
            monto = tx.get("monto", 0.0)

            if not rfc:
                continue

            # Regla Primaria: Pertenece al padrón 69-B
            if rfc in efos_list:
                risks.append({
                    "risk_type": "EFO_DETECTED",
                    "severity": "CRITICAL",
                    "transaction_id": tx.get("id"),
                    "rfc_involved": rfc,
                    "amount_at_risk": round(monto, 2),
                    "action_required": "URGENTE: Suspender pago, notificar al contador y recabar materialidad (entregables, contratos) para defensa SAT."
                })
                total_risk_amount += monto

            # Regla Secundaria: Anomalía Numérica (Montos redondos exactos atípicos para servicios grandes)
            # Esto suele ser un "red flag" fiscal en MX para consultorías de humo.
            elif monto >= 500000.0 and monto.is_integer():
                concepto = tx.get("concepto", "").lower()
                if "asesoria" in concepto or "consultoria" in concepto or "honorarios" in concepto:
                    risks.append({
                        "risk_type": "ROUND_AMOUNT_INTANGIBLE_SERVICE",
                        "severity": "WARNING",
                        "transaction_id": tx.get("id"),
                        "rfc_involved": rfc,
                        "amount_at_risk": round(monto, 2),
                        "action_required": "Verificar materialidad estricta. Montos tan cerrados en intangibles son frecuente objeto de revisión."
                    })

        return {
            "total_incidents": len(risks),
            "critical_efos": sum(1 for r in risks if r["risk_type"] == "EFO_DETECTED"),
            "total_financial_risk": round(total_risk_amount, 2),
            "incidents": risks
        }
