"""
API de Riesgos y Variaciones (Fase 10)
"""
from fastapi import APIRouter
from typing import Dict, Any

from app.services.predictive.risk_detector import RiskDetector
from app.services.predictive.budget_analyzer import BudgetAnalyzer

router = APIRouter()

@router.post("/efo-risks")
def get_efo_risks(payload: Dict[str, Any]):
    """
    Evalúa historial de transacciones para localizar cruces con la lista 69-B del SAT.
    Espera: 'transactions' list, 'efos_list' list.
    """
    transactions = payload.get("transactions", [])
    efos_list = payload.get("efos_list", []) 
    
    detector = RiskDetector()
    return detector.evaluate_transaction_risks(transactions, efos_list)

@router.post("/budget-variances")
def get_budget_variances(payload: Dict[str, Any]):
    """
    Compara presupuestos vs montos ejecutados reales.
    Espera: 'real_amounts', 'budget_amounts'.
    """
    real = payload.get("real_amounts", {})
    budget = payload.get("budget_amounts", {})
    
    analyzer = BudgetAnalyzer()
    return {"variances": analyzer.analyze_variance(real, budget)}
    
@router.post("/break-even-point")
def get_break_even(payload: Dict[str, float]):
    """
    Calcula punto de equilibrio (BEP).
    Espera: 'fixed_costs', 'price_per_unit', 'variable_cost_per_unit'.
    """
    fc = payload.get("fixed_costs", 0.0)
    price = payload.get("price_per_unit", 0.0)
    vc = payload.get("variable_cost_per_unit", 0.0)
    
    analyzer = BudgetAnalyzer()
    return analyzer.break_even_point(fc, vc, price)
