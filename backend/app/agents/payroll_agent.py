"""
Agente Inteligente de Nómina (Fase 11)
Diseñado para ser inyectado como Node en un grafo (LangGraph).
"""
import logging
from typing import Dict, Any

from app.domain.payroll.imss_calculator import IMSSCalculator
from app.domain.payroll.perceptions import PerceptionsManager
from app.domain.payroll.stamping import PayrollStamper

logger = logging.getLogger(__name__)

class PayrollWorkflowAgent:
    """
    Agente Orquestador para flujos de nómina.
    Conecta el Motor de Cálculos (IMSS + Percepciones) con el validador humano
    y posteriormente con el timbrador del PAC.
    """
    def __init__(self):
        self.imss_calc = IMSSCalculator()
        self.perceptions_mgr = PerceptionsManager()
        self.stamper = PayrollStamper()

    def create_payroll_draft(self, employee_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calcula números base y se detiene (Yields) para validación humana."""
        emp_id = employee_data.get('id', 'Desconocido')
        logger.info(f"Paso 1: Generando borrador para empleado {emp_id}")
        
        sbc = employee_data.get("sbc_diario", 300.0)
        dias = employee_data.get("dias_trabajados", 15)
        hx = employee_data.get("horas_extras", 0)
        aguinaldo = employee_data.get("aguinaldo", 0.0)
        
        percs = self.perceptions_mgr.process_payroll_receipt(sbc, dias, hx, aguinaldo)
        imss_dues = self.imss_calc.calculate_quotas(sbc, dias)
        
        # Simulación ISR Retenido base (por el TaxCalculator)
        isr_retenido = 0.0 # En un escenario real vendría del TaxCalculator
        retenciones_totales = imss_dues["retenciones_obreras"]["imss_total"] + isr_retenido
        
        net_pay = percs["percepciones_totales"] - retenciones_totales
        
        # 4. PTU (si aplica)
        ptu_monto = employee_data.get("ptu", 0.0)
        if ptu_monto > 0:
            ptu_calc = self.perceptions_mgr.calculate_ptu(ptu_monto)
            percs["percepciones_totales"] += ptu_monto
            percs["ingreso_gravable_isr"] += ptu_calc["importe_gravado"]
            percs["conceptos"].append(ptu_calc)

        return {
            "status": "AWAITING_HUMAN_VALIDATION",
            "message": "Nómina pre-calculada. Pendiente visto bueno de UI.",
            "net_payment": round(net_pay + ptu_monto, 2),
            "breakdown": {
                "perceptions": percs,
                "imss_obrero_patronal": imss_dues
            },
            "next_action": "Validar en UI IMSSValidator.tsx"
        }
        
    def stamp_approved_payroll(self, approved_draft: Dict[str, Any], emisor_rfc: str) -> Dict[str, Any]:
        """Una vez validado el Human-in-the-loop, pedir el timbre electrónico."""
        logger.info(f"Paso 2: Timbrado post-aprobación para emisor {emisor_rfc}")
        
        if approved_draft.get("human_approved") is not True:
            return {
                "status": "error",
                "message": "Operación abortada: La nómina carece de validación humana explícita."
            }
            
        return self.stamper.generate_and_stamp(approved_draft, emisor_rfc)
