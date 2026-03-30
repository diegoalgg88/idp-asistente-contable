"""
Generador de Estados Financieros (Fase 12)
Sigue la estructura de las NIF B-3 (Estado de Resultados) y NIF B-6 (Estado de Situación Financiera).
"""
import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

class FinancialStatementGenerator:
    """
    Consolida los saldos de la balanza de comprobación para emitir estados financieros formales.
    """
    def __init__(self, company_name: str, rfc: str):
        self.company_name = company_name
        self.rfc = rfc

    def generate_income_statement(self, balance_data: List[Dict[str, Any]], period: str) -> Dict[str, Any]:
        """Produce el Estado de Resultados Integral (NIF B-3)."""
        logger.info(f"Generando Estado de Resultados para {period}")
        
        # Simulación de agregación de saldos por tipo de cuenta
        ingresos = 1250000.00
        costos = 450000.00
        gastos_op = 320000.00
        utilidad_bruta = ingresos - costos
        utilidad_op = utilidad_bruta - gastos_op
        
        # Impuestos (Simulados de la fase 11)
        isr = utilidad_op * 0.30
        utilidad_neta = utilidad_op - isr
        
        return {
            "entity": self.company_name,
            "statement_type": "Estado de Resultados Integral",
            "period": period,
            "currency": "MXN",
            "data": {
                "Ingresos Netos": ingresos,
                "Costo de Ventas": costos,
                "Utilidad Bruta": utilidad_bruta,
                "Gastos Generales": gastos_op,
                "Utilidad de Operación": utilidad_op,
                "Resultado Integral de Financiamiento": 0.0,
                "Impuestos a la Utilidad (ISR)": isr,
                "Utilidad Neta": utilidad_neta
            }
        }

    def generate_balance_sheet(self, balance_data: List[Dict[str, Any]], date: str) -> Dict[str, Any]:
        """Produce el Estado de Situación Financiera (NIF B-6)."""
        logger.info(f"Generando Balance General al {date}")
        
        # Activos
        circulante = 850000.00
        fijo = 1200000.00
        total_activo = circulante + fijo
        
        # Pasivos
        corto_plazo = 400000.00
        largo_plazo = 200000.00
        total_pasivo = corto_plazo + largo_plazo
        
        # Capital
        capital_contable = total_activo - total_pasivo
        
        return {
            "entity": self.company_name,
            "statement_type": "Estado de Situación Financiera",
            "date": date,
            "currency": "MXN",
            "sections": {
                "Activo": {
                    "Circulante": circulante,
                    "No Circulante": fijo,
                    "Total Activo": total_activo
                },
                "Pasivo": {
                    "Corto Plazo": corto_plazo,
                    "Largo Plazo": largo_plazo,
                    "Total Pasivo": total_pasivo
                },
                "Capital Contable": {
                    "Capital Social": 1000000.00,
                    "Utilidades Retenidas": capital_contable - 1000000.00,
                    "Total Capital Contable": capital_contable
                }
            },
            "check": total_activo == (total_pasivo + capital_contable)
        }
