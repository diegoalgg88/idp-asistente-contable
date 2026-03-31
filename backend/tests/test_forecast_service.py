"""
Tests para el Servicio de Forecasting (Fase 11)

Pruebas unitarias para:
- CashFlowForecaster: Proyección de flujo de efectivo
- TaxForecaster: Pronóstico de impuestos
- TaxHealthAnalyzer: Semáforo de salud fiscal
"""
import pytest

from app.domain.predictive.cashflow_forecaster import CashflowForecaster
from app.domain.predictive.tax_forecaster import TaxForecaster
from app.domain.predictive.health_score import TaxHealthAnalyzer


class TestCashFlowForecaster:
    """Tests para CashflowForecaster"""

    def test_predict_cashflow_healthy(self):
        """Prueba proyección con flujo saludable"""
        forecaster = CashflowForecaster()
        
        receivables = [
            {'amount': 100000, 'aging_term': 'current'},
            {'amount': 50000, 'aging_term': '1_to_30_days'},
        ]
        payables = [
            {'amount': 80000},
        ]
        current_balance = 150000.0
        
        result = forecaster.predict_cashflow(receivables, payables, current_balance)
        
        assert result['status'] == 'healthy'
        assert result['projected_inflows_adjusted'] > 0
        assert result['projected_final_balance'] > current_balance
        assert 'ÓPTIMO' in result['recommendation']

    def test_predict_cashflow_critical(self):
        """Prueba proyección con flujo crítico"""
        forecaster = CashflowForecaster()
        
        receivables = [
            {'amount': 20000, 'aging_term': 'over_90_days'},  # Baja probabilidad de cobro
        ]
        payables = [
            {'amount': 200000},  # Pagos altos
        ]
        current_balance = 50000.0
        
        result = forecaster.predict_cashflow(receivables, payables, current_balance)
        
        assert result['status'] == 'critical'
        assert result['projected_final_balance'] < 0
        assert 'ALERTA' in result['recommendation']

    def test_predict_cashflow_warning(self):
        """Prueba proyección con flujo en precaución"""
        forecaster = CashflowForecaster()
        
        receivables = [
            {'amount': 100000, 'aging_term': 'current'},
        ]
        payables = [
            {'amount': 90000},
        ]
        current_balance = 10000.0  # Balance inicial bajo
        
        result = forecaster.predict_cashflow(receivables, payables, current_balance)
        
        # Debería estar en warning si el balance final es < 20% de los pagos
        assert result['projected_final_balance'] >= 0

    def test_empty_receivables(self):
        """Prueba con cuentas por cobrar vacías"""
        forecaster = CashflowForecaster()
        
        result = forecaster.predict_cashflow([], [], 100000.0)
        
        assert result['projected_inflows_adjusted'] == 0
        assert result['projected_outflows'] == 0
        assert result['projected_final_balance'] == 100000.0

    def test_collection_probabilities(self):
        """Prueba probabilidades de cobro por antigüedad"""
        forecaster = CashflowForecaster()
        
        # 100% current
        receivables_current = [{'amount': 100000, 'aging_term': 'current'}]
        result = forecaster.predict_cashflow(receivables_current, [], 0)
        assert result['projected_inflows_adjusted'] == 95000.0  # 95%
        
        # 50% over_90_days
        receivables_old = [{'amount': 100000, 'aging_term': 'over_90_days'}]
        result = forecaster.predict_cashflow(receivables_old, [], 0)
        assert result['projected_inflows_adjusted'] == 20000.0  # 20%


class TestTaxForecaster:
    """Tests para TaxForecaster"""

    def test_predict_tax_with_fallback(self):
        """Prueba pronóstico con fallback (promedio móvil)"""
        forecaster = TaxForecaster()
        
        history = [
            {'ds': '2025-01-01', 'y': 15000},
            {'ds': '2025-02-01', 'y': 18000},
            {'ds': '2025-03-01', 'y': 45000},  # Pico anualidad
        ]
        
        result = forecaster.predict_tax(history, months_ahead=3)
        
        assert result['status'] in ['success', 'success_fallback']
        assert len(result['forecast']) == 3
        assert 'date' in result['forecast'][0]
        assert 'predicted_amount' in result['forecast'][0]

    def test_predict_tax_empty_history(self):
        """Prueba con histórico vacío"""
        forecaster = TaxForecaster()
        
        result = forecaster.predict_tax([], months_ahead=3)
        
        assert result['status'] == 'success_fallback'
        assert len(result['forecast']) == 3

    def test_predict_tax_insufficient_data(self):
        """Prueba con histórico insuficiente (< 2 puntos)"""
        forecaster = TaxForecaster()
        
        history = [{'ds': '2025-03-01', 'y': 15000}]
        
        result = forecaster.predict_tax(history, months_ahead=3)
        
        # Debería usar fallback
        assert result['status'] == 'success_fallback'

    def test_fallback_inflation_factor(self):
        """Prueba factor de inflación en fallback"""
        forecaster = TaxForecaster()
        
        history = [
            {'ds': '2025-01-01', 'y': 10000},
            {'ds': '2025-02-01', 'y': 10000},
        ]
        
        result = forecaster.predict_tax(history, months_ahead=3)
        
        # El primer mes debería tener inflación ~1%
        first_month = result['forecast'][0]['predicted_amount']
        assert first_month >= 10000  # Al menos el promedio

    def test_fallback_bounds(self):
        """Prueba límites inferior y superior en fallback"""
        forecaster = TaxForecaster()
        
        history = [
            {'ds': '2025-01-01', 'y': 10000},
        ]
        
        result = forecaster.predict_tax(history, months_ahead=1)
        
        forecast = result['forecast'][0]
        assert forecast['lower_bound'] < forecast['predicted_amount']
        assert forecast['upper_bound'] > forecast['predicted_amount']


class TestTaxHealthAnalyzer:
    """Tests para TaxHealthAnalyzer"""

    def test_calculate_score_healthy(self):
        """Prueba score saludable (sin riesgos)"""
        analyzer = TaxHealthAnalyzer()
        
        metrics = {
            'efos_detected': 0,
            'budget_variance_percent': 0.05,  # 5% desviación
            'over_90_days_ratio': 0.10,  # 10% cartera vencida
            'unpaid_taxes': False,
        }
        
        result = analyzer.calculate_score(metrics)
        
        assert result['score'] >= 85
        assert result['status'] == 'healthy'
        assert len(result['details']) == 0

    def test_calculate_score_critical_efos(self):
        """Prueba score crítico con EFOS detectados"""
        analyzer = TaxHealthAnalyzer()
        
        metrics = {
            'efos_detected': 2,
            'budget_variance_percent': 0.05,
            'over_90_days_ratio': 0.10,
            'unpaid_taxes': False,
        }
        
        result = analyzer.calculate_score(metrics)
        
        # 35% de penalización por EFOS = 65 puntos
        assert result['score'] == 65.0
        assert result['status'] == 'critical'
        assert any('69-B' in detail for detail in result['details'])

    def test_calculate_score_warning_budget(self):
        """Prueba score con desviación presupuestal"""
        analyzer = TaxHealthAnalyzer()
        
        metrics = {
            'efos_detected': 0,
            'budget_variance_percent': 0.25,  # 25% desviación
            'over_90_days_ratio': 0.10,
            'unpaid_taxes': False,
        }
        
        result = analyzer.calculate_score(metrics)
        
        # 25% > 10% threshold, penalización = min(25, 20) = 20 puntos
        # score = 100 - 20 = 80
        assert result['score'] == 80.0
        assert result['status'] == 'warning'
        assert any('Desviación' in detail for detail in result['details'])

    def test_calculate_score_aging_receivables(self):
        """Prueba score con cartera vencida alta"""
        analyzer = TaxHealthAnalyzer()
        
        metrics = {
            'efos_detected': 0,
            'budget_variance_percent': 0.05,
            'over_90_days_ratio': 0.30,  # 30% cartera vencida (> 15% threshold)
            'unpaid_taxes': False,
        }
        
        result = analyzer.calculate_score(metrics)
        
        # 30% > 15% threshold, penalización = min(30, 15) = 15 puntos
        # score = 100 - 15 = 85 (healthy porque >= 85)
        assert result['score'] == 85.0
        assert result['status'] == 'healthy'
        assert len(result['details']) == 1  # Se agregó detalle porque excede threshold
        assert 'Cartera Vencida' in result['details'][0]

    def test_calculate_score_unpaid_taxes(self):
        """Prueba score con impuestos no pagados"""
        analyzer = TaxHealthAnalyzer()
        
        metrics = {
            'efos_detected': 0,
            'budget_variance_percent': 0.05,
            'over_90_days_ratio': 0.10,
            'unpaid_taxes': True,  # Esto no tiene threshold, siempre resta
        }
        
        result = analyzer.calculate_score(metrics)
        
        # 15% de penalización por unpaid_taxes
        # score = 100 - 15 = 85 (healthy porque >= 85)
        assert result['score'] == 85.0
        assert result['status'] == 'healthy'
        assert len(result['details']) == 1  # Se agregó detalle
        assert 'fiscales' in result['details'][0].lower()

    def test_calculate_score_minimum_zero(self):
        """Prueba score mínimo (0)"""
        analyzer = TaxHealthAnalyzer()
        
        metrics = {
            'efos_detected': 10,
            'budget_variance_percent': 0.50,
            'over_90_days_ratio': 0.80,
            'unpaid_taxes': True,
        }
        
        result = analyzer.calculate_score(metrics)
        
        assert result['score'] >= 0
        assert result['score'] <= 100


class TestIntegration:
    """Tests de integración entre servicios"""

    def test_forecast_pipeline(self):
        """Prueba pipeline completo de forecasting"""
        cashflow_forecaster = CashflowForecaster()
        tax_forecaster = TaxForecaster()
        health_analyzer = TaxHealthAnalyzer()
        
        # 1. Proyección de flujo
        receivables = [{'amount': 200000, 'aging_term': 'current'}]
        payables = [{'amount': 150000}]
        cashflow_result = cashflow_forecaster.predict_cashflow(receivables, payables, 100000.0)
        
        # 2. Pronóstico de impuestos
        history = [
            {'ds': '2025-01-01', 'y': 15000},
            {'ds': '2025-02-01', 'y': 18000},
        ]
        tax_result = tax_forecaster.predict_tax(history, months_ahead=3)
        
        # 3. Salud fiscal
        health_metrics = {
            'efos_detected': 0,
            'budget_variance_percent': 0.05,
            'over_90_days_ratio': 0.10,
            'unpaid_taxes': False,
        }
        health_result = health_analyzer.calculate_score(health_metrics)
        
        # Validaciones
        assert cashflow_result['status'] == 'healthy'
        assert tax_result['status'] in ['success', 'success_fallback']
        assert health_result['status'] == 'healthy'


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
