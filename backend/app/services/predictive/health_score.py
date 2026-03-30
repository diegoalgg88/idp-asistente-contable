"""
Calculadora de Salud Fiscal (Tax Health Score) (Fase 10)
"""
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class TaxHealthAnalyzer:
    """
    Genera un semáforo ponderado (0-100) sobre 5 factores de riesgo tributario y financiero.
    """
    def __init__(self):
        self.weights = {
            "efos_presence": 0.35,      # 35% de peso (Riesgo más crítico, Multas 100%)
            "budget_variance": 0.20,    # 20%
            "aging_receivables": 0.15,  # 15%
            "tax_burden": 0.15,         # 15% 
            "unpaid_taxes": 0.15        # 15%
        }
        
    def calculate_score(self, metrics: Dict[str, Any]) -> Dict[str, Any]:
        """
        Evalúa las métricas operativas y retorna el score de 0 a 100.
        """
        score = 100.0
        details = []

        # 1. EFOS (Severidad Extrema)
        efos_detected = metrics.get("efos_detected", 0)
        if efos_detected > 0:
            score -= (self.weights["efos_presence"] * 100)
            details.append(f"Riesgo Crítico: {efos_detected} Proveedores en listado definitivo 69-B.")

        # 2. Desviación Presupuestal Excesiva
        variance = metrics.get("budget_variance_percent", 0.0)
        if variance > 0.10: # Tolerancia del 10%
            penalty = min(variance * 100, self.weights["budget_variance"] * 100)
            score -= penalty
            details.append(f"Desviación de presupuesto excedida: {variance:.1%}")

        # 3. Cartera Vencida Crítica (>90 días)
        aging_ratio = metrics.get("over_90_days_ratio", 0.0)
        if aging_ratio > 0.15: # Límite sano del 15%
            penalty = min(aging_ratio * 100, self.weights["aging_receivables"] * 100)
            score -= penalty
            details.append(f"Cartera Vencida severa: {aging_ratio:.1%} de las CxC.")

        # 4. Impuestos no pagados / Atrasados
        unpaid = metrics.get("unpaid_taxes", False)
        if unpaid:
            score -= (self.weights["unpaid_taxes"] * 100)
            details.append("Riesgo Medio: Obligaciones fiscales vencidas sin pago.")

        # Asegurar score mínimo de 0
        score = max(0.0, score)

        # Asignar semáforo
        status = "healthy"
        if score < 70:
            status = "critical"
        elif score < 85:
            status = "warning"

        return {
            "score": round(score, 1),
            "status": status,
            "details": details
        }
