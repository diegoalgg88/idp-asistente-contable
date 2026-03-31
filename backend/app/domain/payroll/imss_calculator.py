"""
Calculadora de Retenciones y Cuotas Patronales IMSS/INFONAVIT (Fase 11)
Adaptado a la Ley del Seguro Social vigente (México 2026).
"""
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class IMSSCalculator:
    """
    Calculadora basada en el Salario Base de Cotización (SBC).
    Incluye riesgos de trabajo, enfermedades, maternidad, invalidez 
    y retiro, cesantía y vejez (RCV).
    """
    def __init__(self, uma_value_2026: float = 115.50, smg_value_2026: float = 290.00):
        # Valores simulados 2026 para la Unidad de Medida y Actualización y Salario Mínimo General
        self.uma = uma_value_2026
        self.smg = smg_value_2026
        self.tope_sbc = self.uma * 25  # Tope máximo de cotización: 25 UMAs
        
    def calculate_quotas(self, sbc: float, dias_trabajados: int, prima_riesgo: float = 0.50000) -> Dict[str, Any]:
        """
        Calcula las retenciones al empleado y las cuotas del patrón según los porcentajes de la LSS.
        """
        # Aplicar el tope legal máximo al SBC
        sbc_topado = min(sbc, self.tope_sbc)
        sbc_minimo = max(sbc_topado, self.smg) # Nunca puede cotizar por debajo del mínimo mensualizado
        
        base_calculo = sbc_minimo * dias_trabajados
        base_3_uma = self.uma * 3 * dias_trabajados
        excedente_3_uma = max(0.0, base_calculo - base_3_uma)
        
        # 1. Riesgos de Trabajo (Sólo Patrón)
        rt_patron = base_calculo * (prima_riesgo / 100)
        
        # 2. Enfermedades y Maternidad - Especie (Cuota fija Patrón)
        eym_fija_patron = base_3_uma * 0.2040
        
        # 3. Enfermedades y Maternidad - Excedente 3 UMA
        eym_exc_patron = excedente_3_uma * 0.0105
        eym_exc_obrero = excedente_3_uma * 0.0040
        
        # 4. Enfermedades y Maternidad - Gastos Médicos (Dinero)
        eym_dinero_patron = base_calculo * 0.0070
        eym_dinero_obrero = base_calculo * 0.0025
        eym_gm_patron = base_calculo * 0.0105
        eym_gm_obrero = base_calculo * 0.00375
        
        # 5. Invalidez y Vida
        iyv_patron = base_calculo * 0.0175
        iyv_obrero = base_calculo * 0.00625
        
        # 6. Retiro, Cesantía en edad avanzada y Vejez (RCV)
        retiro_patron = base_calculo * 0.0200
        # NOTA: La cuota patronal de Cesantía se incrementó gradualmente (Reforma). Para 2026 dependerá del SBC vs UMA.
        # Simulamos un % promedio reformado para 2026 ~ 4.5% al 6%
        factor_renta = sbc_minimo / self.uma
        if factor_renta <= 1.0:
            cesantia_patron = base_calculo * 0.03150
        elif factor_renta <= 2.0:
            cesantia_patron = base_calculo * 0.04500
        else:
            cesantia_patron = base_calculo * 0.06000 # Tope simplificado 2026
            
        cesantia_obrero = base_calculo * 0.01125
        
        # 7. Guarderías y Prestaciones Sociales (Sólo Patrón)
        guarderias_patron = base_calculo * 0.0100
        
        # 8. INFONAVIT (Aportación Patronal)
        infonavit_patron = base_calculo * 0.0500
        
        total_patron = rt_patron + eym_fija_patron + eym_exc_patron + eym_dinero_patron + eym_gm_patron + iyv_patron + retiro_patron + cesantia_patron + guarderias_patron
        total_obrero = eym_exc_obrero + eym_dinero_obrero + eym_gm_obrero + iyv_obrero + cesantia_obrero
        
        return {
            "sbc_topado": round(sbc_minimo, 2),
            "dias_cotizados": dias_trabajados,
            "aportaciones_patronales": {
                "imss_total": round(total_patron, 2),
                "infonavit": round(infonavit_patron, 2),
                "desglose_rt": round(rt_patron, 2),
                "desglose_retiro": round(retiro_patron, 2),
                "desglose_cesantia": round(cesantia_patron, 2)
            },
            "retenciones_obreras": {
                "imss_total": round(total_obrero, 2),
                "desglose_excedente": round(eym_exc_obrero, 2),
                "desglose_invalidez": round(iyv_obrero, 2),
                "desglose_cesantia": round(cesantia_obrero, 2)
            }
        }
