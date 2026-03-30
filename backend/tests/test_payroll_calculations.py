from decimal import Decimal
from app.services.payroll.payroll_engine import IMSSCalculator, ISRCalculator

def test_imss_patronal_rate_2026():
    # SBC = 1000, UMA = 108.45 -> Ratio = 9.22
    # Tramo > 4.00 UMA -> 6.410%
    rate = IMSSCalculator.get_cv_patronal_rate(Decimal('1000.00'))
    assert rate == Decimal('0.06410')

    # SBC = 150 -> Ratio = 1.38 -> Tramo <= 1.5 -> 4.519% (based on TRAMOS_CV_2026 in engine)
    rate_low = IMSSCalculator.get_cv_patronal_rate(Decimal('150.00'))
    assert rate_low == Decimal('0.04519')

def test_isr_calculation_2026():
    # Test a middle bracket
    # 50,000 MXN monthly
    # Base = 50000 - 37510.98 = 12489.02
    # Tax = 12489.02 * 0.2352 + 6010.51 = 2937.42 + 6010.51 = 8947.93
    isr = ISRCalculator.calcular_mensual(Decimal('50000.00'))
    assert isr == Decimal('8947.93')

def test_imss_quota_calculation():
    calc = IMSSCalculator()
    # SBC = 500, Days = 30
    quotas = calc.calcular_cuotas(Decimal('500.00'), 30)
    
    assert "patronal" in quotas
    assert "obrera" in quotas
    assert quotas["patronal"]["total"] > 0
    assert quotas["obrera"]["total"] > 0
    assert isinstance(quotas["patronal"]["total"], Decimal)
