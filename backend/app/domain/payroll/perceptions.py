"""
Gestor de Percepciones y Deducciones según la LFT (Fase 11)
"""
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class PerceptionsManager:
    """
    Calcula horas extras (dobles o triples), aguinaldo gravado/exento
    y percepciones estándar basadas en la LFT de México.
    """
    def __init__(self, uma_value_2026: float = 115.50):
        self.uma = uma_value_2026
        
    def process_payroll_receipt(self, sbc_diario: float, dias_trabajados: int, horas_extras_semanales: int = 0, aguinaldo_otorgado: float = 0.0) -> Dict[str, Any]:
        """
        Produce el bloque "Percepciones" de un recibo de nómina timbrable.
        """
        percepciones_totales = 0.0
        ingreso_gravable_isr = 0.0
        desglose = []
        
        # 1. Pago de Sueldo Ordinario
        sueldo_ordinario = sbc_diario * dias_trabajados
        percepciones_totales += sueldo_ordinario
        ingreso_gravable_isr += sueldo_ordinario
        desglose.append({
            "tipo_percepcion": "001",
            "concepto": "Sueldo",
            "importe_gravado": round(float(sueldo_ordinario), 2),
            "importe_exento": 0.0
        })
        
        # 2. Horas Extras (LFT Art 66, 67, 68)
        if horas_extras_semanales > 0:
            salario_por_hora = sbc_diario / 8.0 # Asumiendo jornada diurna de 8h
            
            horas_dobles = min(horas_extras_semanales, 9)
            horas_triples = max(0, horas_extras_semanales - 9)
            
            monto_dobles = horas_dobles * (salario_por_hora * 2)
            monto_triples = horas_triples * (salario_por_hora * 3)
            
            # Exención de horas dobles (50% topado a 5 UMAs semanales)
            exento_dobles = min(monto_dobles / 2, self.uma * 5)
            gravado_dobles = monto_dobles - exento_dobles
            
            percepciones_totales += (monto_dobles + monto_triples)
            ingreso_gravable_isr += (gravado_dobles + monto_triples) # Triples van 100% gravadas
            
            desglose.append({
                "tipo_percepcion": "019",
                "concepto": "Horas extras",
                "importe_gravado": round(float(gravado_dobles + monto_triples), 2),
                "importe_exento": round(float(exento_dobles), 2)
            })
            
        # 3. Aguinaldo (Tope 30 UMAs exentas)
        if aguinaldo_otorgado > 0:
            tope_aguinaldo_exento = self.uma * 30
            excedente_gravado = max(0.0, aguinaldo_otorgado - tope_aguinaldo_exento)
            exento_final = aguinaldo_otorgado - excedente_gravado
            
            percepciones_totales += aguinaldo_otorgado
            ingreso_gravable_isr += excedente_gravado
            
            desglose.append({
                "tipo_percepcion": "002",
                "concepto": "Aguinaldo",
                "importe_gravado": round(float(excedente_gravado), 2),
                "importe_exento": round(float(exento_final), 2)
            })
            
        return {
            "percepciones_totales": round(float(percepciones_totales), 2),
            "ingreso_gravable_isr": round(float(ingreso_gravable_isr), 2),
            "conceptos": desglose
        }
    def calculate_ptu(self, ptu_amount: float) -> Dict[str, Any]:
        """
        Calcula PTU gravado y exento (Art 93 LISR: 15 días de UMA exentos).
        """
        tope_exento = self.uma * 15
        exento = min(ptu_amount, tope_exento)
        gravado = ptu_amount - exento
        
        return {
            "tipo_percepcion": "003",
            "concepto": "PTU",
            "importe_gravado": round(float(gravado), 2),
            "importe_exento": round(float(exento), 2),
            "total": round(float(ptu_amount), 2)
        }
