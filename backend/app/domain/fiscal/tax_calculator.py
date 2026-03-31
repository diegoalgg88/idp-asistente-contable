"""
Calculadora Fiscal: ISR e IVA (Fase 11)
Actualizado con tablas de ISR 2026 reales extraídas de la RMF 2026 Anexo 8.
"""
import logging
from typing import Dict, Any
from decimal import Decimal, ROUND_HALF_UP

logger = logging.getLogger(__name__)

class TaxCalculator:
    """
    Gestiona el cálculo de ISR mensual basado en límites y cuotas fijas (RMF 2026),
    así como el cálculo del IVA trasladado/acreditable.
    """
    
    # Tablas ISR 2026 (Mensuales - Régimen General - DOF 28-dic-2025)
    # Fuente: RMF 2026 Anexo 8
    ISR_TABLE_GENERAL_2026 = [
        {"limit_inf": Decimal("0.01"), "limit_sup": Decimal("10135.11"), "fixed_fee": Decimal("0.00"), "percent": Decimal("0.0192")},
        {"limit_inf": Decimal("10135.12"), "limit_sup": Decimal("85825.69"), "fixed_fee": Decimal("194.60"), "percent": Decimal("0.0640")},
        {"limit_inf": Decimal("85825.70"), "limit_sup": Decimal("151215.19"), "fixed_fee": Decimal("5039.80"), "percent": Decimal("0.1088")},
        {"limit_inf": Decimal("151215.20"), "limit_sup": Decimal("175965.59"), "fixed_fee": Decimal("12154.37"), "percent": Decimal("0.1600")},
        {"limit_inf": Decimal("175965.60"), "limit_sup": Decimal("211095.29"), "fixed_fee": Decimal("16114.43"), "percent": Decimal("0.1792")},
        {"limit_inf": Decimal("211095.30"), "limit_sup": Decimal("426725.99"), "fixed_fee": Decimal("22406.76"), "percent": Decimal("0.2136")},
        {"limit_inf": Decimal("426726.00"), "limit_sup": Decimal("676725.59"), "fixed_fee": Decimal("68454.66"), "percent": Decimal("0.2352")},
        {"limit_inf": Decimal("676725.60"), "limit_sup": Decimal("1284725.99"), "fixed_fee": Decimal("127354.66"), "percent": Decimal("0.3000")},
        {"limit_inf": Decimal("1284726.00"), "limit_sup": Decimal("4256419.90"), "fixed_fee": Decimal("309754.66"), "percent": Decimal("0.3200")},
        {"limit_inf": Decimal("4256419.91"), "limit_sup": Decimal("Infinity"), "fixed_fee": Decimal("1260608.66"), "percent": Decimal("0.3500")},
    ]

    # Tablas ISR 2026 (Mensuales - RESICO PF)
    ISR_TABLE_RESICO_PF_2026 = [
        {"limit_inf": Decimal("0.01"), "limit_sup": Decimal("33688.34"), "rate": Decimal("0.01")},
        {"limit_inf": Decimal("33688.35"), "limit_sup": Decimal("50000.00"), "rate": Decimal("0.011")},
        {"limit_inf": Decimal("50000.01"), "limit_sup": Decimal("83333.33"), "rate": Decimal("0.015")},
        {"limit_inf": Decimal("83333.34"), "limit_sup": Decimal("208333.33"), "rate": Decimal("0.02")},
        {"limit_inf": Decimal("208333.34"), "limit_sup": Decimal("Infinity"), "rate": Decimal("0.025")},
    ]

    def __init__(self, regime: str = "RESICO_PF"):
        self.regime = regime
        
    def calculate_isr(self, taxable_income: float) -> Dict[str, Any]:
        """Calcula el ISR mensual aplicando la tarifa del periodo con precisión Decimal."""
        income = Decimal(str(taxable_income))
        
        if self.regime == "RESICO_PF":
            return self._calculate_resico_pf(income)
            
        # Régimen General / Actividad Profesional
        for row in self.ISR_TABLE_GENERAL_2026:
            if row["limit_inf"] <= income <= row["limit_sup"]:
                excess = income - row["limit_inf"]
                tax = row["fixed_fee"] + (excess * row["percent"])
                
                return {
                    "taxable_income": float(income.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)),
                    "isr_to_pay": float(tax.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)),
                    "effective_rate": float(((tax / income) * 100).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)) if income > 0 else 0.0,
                    "regime": "GENERAL_PF",
                    "details": {
                        "limit_inf": float(row["limit_inf"]),
                        "fixed_fee": float(row["fixed_fee"]),
                        "percent": float(row["percent"])
                    }
                }
        return {"isr_to_pay": 0.0}

    def _calculate_resico_pf(self, income: Decimal) -> Dict[str, Any]:
        """Cálculo RESICO PF 2026 usando tablas reales y Decimal."""
        rate = Decimal("0.01")
        for row in self.ISR_TABLE_RESICO_PF_2026:
            if row["limit_inf"] <= income <= row["limit_sup"]:
                rate = row["rate"]
                break
        
        tax = income * rate
        return {
            "taxable_income": float(income.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)),
            "isr_to_pay": float(tax.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)),
            "rate": float(rate),
            "regime": "RESICO_PF"
        }

    def calculate_iva(self, subtotal: float, rate: float = 0.16) -> Dict[str, Any]:
        """Calcula el IVA dada una tasa (16%, 8% o 0%) con precisión Decimal."""
        val = Decimal(str(subtotal))
        r = Decimal(str(rate))
        iva = val * r
        return {
            "subtotal": float(val.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)),
            "iva": float(iva.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)),
            "total": float((val + iva).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)),
            "rate": float(r)
        }
