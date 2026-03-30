"""
Análisis de Presupuestos y Variaciones (Fase 10)
"""
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class BudgetAnalyzer:
    """
    Comparativo Real vs Presupuestado y Punto de Equilibrio
    """
    def __init__(self):
        pass
        
    def analyze_variance(self, real_amounts: Dict[str, float], budget_amounts: Dict[str, float]) -> Dict[str, Any]:
        """
        Calcula las variaciones porcentuales y absolutas entre lo real ejecutado
        y el presupuesto asignado para cada cuenta contable.
        """
        variances = {}
        for account, real_val in real_amounts.items():
            budget_val = budget_amounts.get(account, 0.0)
            diff = real_val - budget_val
            perc = (diff / budget_val) if budget_val else 0.0

            # Asignar un semáforo por cuenta
            status = "on_track"
            if diff > (budget_val * 0.1):
                # Más de 10% por encima del presupuesto (Gasto excedido)
                status = "over_budget"
            elif diff < -(budget_val * 0.1):
                # Más de 10% por debajo del presupuesto (Ahorro / Sub-ejercicio)
                status = "under_budget"

            variances[account] = {
                "real": round(real_val, 2),
                "budget": round(budget_val, 2),
                "variance_amount": round(diff, 2),
                "variance_percent": round(perc, 4),
                "status": status
            }

        return variances
        
    def break_even_point(self, fixed_costs: float, variable_cost_per_unit: float, price_per_unit: float) -> Dict[str, Any]:
        """
        Calcula el punto de equilibrio financiero en unidades y dinero (Break-Even Point).
        """
        if price_per_unit <= variable_cost_per_unit:
            return {
                "status": "error",
                "message": "Precio de venta no puede ser menor o igual al costo variable unitario (Margen negativo)."
            }

        contribution_margin = price_per_unit - variable_cost_per_unit
        bep_units = fixed_costs / contribution_margin

        return {
            "status": "success",
            "fixed_costs": round(fixed_costs, 2),
            "contribution_margin_per_unit": round(contribution_margin, 2),
            "break_even_units": round(bep_units, 2),
            "break_even_sales": round(bep_units * price_per_unit, 2),
            "message": f"Se requieren vender {bep_units:,.2f} unidades para cubrir los costos."
        }
