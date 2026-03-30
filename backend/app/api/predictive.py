"""
API de Dashboard Predictivo (Fase 10)
"""
from fastapi import APIRouter
from typing import Dict, Any

from app.services.predictive.tax_forecaster import TaxForecaster
from app.services.predictive.cashflow_forecaster import CashflowForecaster
from app.services.predictive.health_score import TaxHealthAnalyzer

router = APIRouter()

@router.post("/tax-forecast")
def get_tax_forecast(payload: Dict[str, Any]):
    """
    Obtiene el forecast con Prophet de IVAs/ISRs.
    Espera: 'history': [{'ds': 'YYYY-MM-DD', 'y': amount}], 'months_ahead': int
    """
    history = payload.get("history", [])
    months = payload.get("months_ahead", 3)
    
    forecaster = TaxForecaster()
    result = forecaster.predict_tax(history, months)
    return result

@router.post("/cashflow")
def get_cashflow_projection(payload: Dict[str, Any]):
    """
    Calcula flujo de efectivo a 90 días con probabilidades ponderadas.
    Espera 'receivables', 'payables', 'current_balance'
    """
    receivables = payload.get("receivables", [])
    payables = payload.get("payables", [])
    balance = payload.get("current_balance", 0.0)
    
    forecaster = CashflowForecaster()
    result = forecaster.predict_cashflow(receivables, payables, balance)
    return result

@router.post("/health-score")
def get_health_score(payload: Dict[str, Any]):
    """
    Calcula el Tax Health Score.
    Espera 'metrics' dict.
    """
    metrics = payload.get("metrics", {})
    analyzer = TaxHealthAnalyzer()
    return analyzer.calculate_score(metrics)
