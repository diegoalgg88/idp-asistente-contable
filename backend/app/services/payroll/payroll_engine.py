"""
Payroll Engine - 2026 Calculations
Procesamiento de nómina con tablas reales de IMSS e ISR 2026.
"""

from decimal import Decimal, ROUND_HALF_UP
from typing import Dict, List

# Parámetros 2026 (Anexo 8 RMF 2026)
# Nota: UMA 2026 proyectada, salario mínimo 2026 oficial.
UMA_2026 = Decimal('108.45')
SALARIO_MINIMO_2026 = Decimal('248.93')
SALARIO_MINIMO_FRONTERA_2026 = Decimal('375.27')

class IMSSCalculator:
    """
    Calculadora de cuotas IMSS patronales y obreras 2026.
    Incluye reforma gradual de Cesantía y Vejez.
    """
    
    # Cuotas Fijas y Porcentajes 2026
    CUOTAS_PATRONALES = {
        'enfermedad_maternidad_fija': Decimal('0.2040'), # Sobre 1 UMA
        'enfermedad_maternidad_excedente': Decimal('0.0110'), # Sobre excedente de 3 UMA
        'prestaciones_dinero': Decimal('0.0070'),
        'gastos_medicos_pensionados': Decimal('0.0105'),
        'riesgo_trabajo_minimo': Decimal('0.0050'), # Clase I (Variable según empresa)
        'invalidez_vida': Decimal('0.0175'),
        'guarderia_prestaciones': Decimal('0.0100'),
    }
    
    CUOTAS_OBRERAS = {
        'enfermedad_maternidad_excedente': Decimal('0.0040'), # Sobre excedente de 3 UMA
        'prestaciones_dinero': Decimal('0.0025'),
        'gastos_medicos_pensionados': Decimal('0.00375'),
        'invalidez_vida': Decimal('0.00625'),
    }

    # Tabla Cesantía y Vejez Patronal 2026 (Reforma gradual art. 168 LSS)
    # Tramos basados en SBC expresado en SM o UMA
    TRAMOS_CV_2026 = [
        {'hasta': Decimal('1.00'), 'cuota': Decimal('0.03150')},
        {'hasta': Decimal('1.50'), 'cuota': Decimal('0.04519')},
        {'hasta': Decimal('2.00'), 'cuota': Decimal('0.05204')},
        {'hasta': Decimal('2.50'), 'cuota': Decimal('0.05615')},
        {'hasta': Decimal('3.00'), 'cuota': Decimal('0.05888')},
        {'hasta': Decimal('3.50'), 'cuota': Decimal('0.06085')},
        {'hasta': Decimal('4.00'), 'cuota': Decimal('0.06232')},
        {'hasta': None, 'cuota': Decimal('0.06410')},
    ]

    @classmethod
    def get_cv_patronal_rate(cls, sbc: Decimal) -> Decimal:
        """Determina la tasa de CV patronal según el SBC en relación a la UMA"""
        ratio = sbc / UMA_2026
        for tramo in cls.TRAMOS_CV_2026:
            hasta = tramo['hasta']
            if hasta is None or ratio <= hasta:
                return tramo['cuota']
        return Decimal('0.06410')

    @classmethod
    def calcular_cuotas(cls, sbc: Decimal, dias: int, riesgo_trabajo: Decimal = Decimal('0.0050')) -> Dict:
        """Calcula desglose completo de cuotas para el periodo"""
        base_uma = UMA_2026 * dias
        base_3_uma = UMA_2026 * 3 * dias
        total_sbc_periodo = sbc * dias
        
        # Patronal
        e_m_fija = base_uma * cls.CUOTAS_PATRONALES['enfermedad_maternidad_fija']
        excedente_val = max(Decimal('0'), total_sbc_periodo - base_3_uma)
        e_m_excedente_pat = excedente_val * cls.CUOTAS_PATRONALES['enfermedad_maternidad_excedente']
        pres_dinero_pat = total_sbc_periodo * cls.CUOTAS_PATRONALES['prestaciones_dinero']
        gm_pensionados_pat = total_sbc_periodo * cls.CUOTAS_PATRONALES['gastos_medicos_pensionados']
        riesgo_pat = total_sbc_periodo * riesgo_trabajo
        invalidez_pat = total_sbc_periodo * cls.CUOTAS_PATRONALES['invalidez_vida']
        guarderia_pat = total_sbc_periodo * cls.CUOTAS_PATRONALES['guarderia_prestaciones']
        
        tasa_cv = cls.get_cv_patronal_rate(sbc)
        retiro_pat = total_sbc_periodo * Decimal('0.02') # Invariable 2%
        cv_pat = total_sbc_periodo * tasa_cv
        
        # Obrera
        e_m_excedente_obr = excedente_val * cls.CUOTAS_OBRERAS['enfermedad_maternidad_excedente']
        pres_dinero_obr = total_sbc_periodo * cls.CUOTAS_OBRERAS['prestaciones_dinero']
        gm_pensionados_obr = total_sbc_periodo * cls.CUOTAS_OBRERAS['gastos_medicos_pensionados']
        invalidez_obr = total_sbc_periodo * cls.CUOTAS_OBRERAS['invalidez_vida']
        cv_obr = total_sbc_periodo * Decimal('0.01125') # Invariable 1.125%
        
        total_patronal = (e_m_fija + e_m_excedente_pat + pres_dinero_pat + gm_pensionados_pat + 
                          riesgo_pat + invalidez_pat + guarderia_pat + retiro_pat + cv_pat)
        total_obrera = (e_m_excedente_obr + pres_dinero_obr + gm_pensionados_obr + invalidez_obr + cv_obr)
        
        return {
            'patronal': {
                'total': total_patronal.quantize(Decimal('0.01'), ROUND_HALF_UP),
                'desglose': {
                    'enfermedad_fija': e_m_fija,
                    'enfermedad_excedente': e_m_excedente_pat,
                    'cesantia_vejez': cv_pat,
                    'retiro': retiro_pat,
                    'riesgo_trabajo': riesgo_pat
                }
            },
            'obrera': {
                'total': total_obrera.quantize(Decimal('0.01'), ROUND_HALF_UP),
                'desglose': {
                    'enfermedad_excedente': e_m_excedente_obr,
                    'cesantia_vejez': cv_obr
                }
            },
            'infonavit': (total_sbc_periodo * Decimal('0.05')).quantize(Decimal('0.01'), ROUND_HALF_UP)
        }

class ISRCalculator:
    """Calculadora de retención de ISR 2026 (Mensual/Quincenal/Semanal)"""
    
    # Tablas Mensuales 2026 (Proyectadas Anexo 8)
    TABLA_MENSUAL_2026 = [
        {'limite_inferior': Decimal('0.01'), 'limite_superior': Decimal('895.34'), 'cuota_fija': Decimal('0.00'), 'porcentaje': Decimal('0.0192')},
        {'limite_inferior': Decimal('895.35'), 'limite_superior': Decimal('7598.67'), 'cuota_fija': Decimal('17.18'), 'porcentaje': Decimal('0.0640')},
        {'limite_inferior': Decimal('7598.68'), 'limite_superior': Decimal('13364.51'), 'cuota_fija': Decimal('446.18'), 'porcentaje': Decimal('0.1088')},
        {'limite_inferior': Decimal('13364.52'), 'limite_superior': Decimal('15510.60'), 'cuota_fija': Decimal('1073.49'), 'porcentaje': Decimal('0.1600')},
        {'limite_inferior': Decimal('15510.61'), 'limite_superior': Decimal('18571.21'), 'cuota_fija': Decimal('1416.86'), 'porcentaje': Decimal('0.1792')},
        {'limite_inferior': Decimal('18571.22'), 'limite_superior': Decimal('37510.97'), 'cuota_fija': Decimal('1965.29'), 'porcentaje': Decimal('0.2136')},
        {'limite_inferior': Decimal('37510.98'), 'limite_superior': Decimal('59155.19'), 'cuota_fija': Decimal('6010.51'), 'porcentaje': Decimal('0.2352')},
        {'limite_inferior': Decimal('59155.20'), 'limite_superior': Decimal('112932.73'), 'cuota_fija': Decimal('11107.24'), 'porcentaje': Decimal('0.3000')},
        {'limite_inferior': Decimal('112932.74'), 'limite_superior': Decimal('150576.97'), 'cuota_fija': Decimal('27240.50'), 'porcentaje': Decimal('0.3200')},
        {'limite_inferior': Decimal('150576.98'), 'limite_superior': Decimal('451730.93'), 'cuota_fija': Decimal('39286.66'), 'porcentaje': Decimal('0.3400')},
        {'limite_inferior': Decimal('451730.94'), 'limite_superior': None, 'cuota_fija': Decimal('141679.00'), 'porcentaje': Decimal('0.3500')},
    ]

    @classmethod
    def calcular_mensual(cls, ingreso_gravado: Decimal) -> Decimal:
        """Calcula retención mensual de ISR"""
        for tramo in cls.TABLA_MENSUAL_2026:
            superior = tramo['limite_superior']
            inferior = tramo.get('limite_inferior')
            if (superior is None or ingreso_gravado <= superior) and inferior is not None:
                base = ingreso_gravado - inferior
                porcentaje = tramo.get('porcentaje', Decimal('0'))
                cuota_fija = tramo.get('cuota_fija', Decimal('0'))
                impuesto = (base * porcentaje) + cuota_fija
                return impuesto.quantize(Decimal('0.01'), ROUND_HALF_UP)
        return Decimal('0')

class SUAParser:
    """
    Parser para archivos del Sistema Único de Autodeterminación (SUA).
    Permite importar movimientos y trabajadores desde archivos .txt de SUA.
    """
    
    @staticmethod
    def parse_trabajadores(file_content: str) -> List[Dict]:
        """Parsea archivo de trabajadores de SUA (Estructura fija)"""
        trabajadores = []
        lines = file_content.splitlines()
        for line in lines:
            if len(line) < 120: continue
            
            # Usando variables temporales y validando longitud para evitar errores de Pyre2 en Windows
            rp = str(line[0:11]).strip()
            nss = str(line[11:22]).strip()
            rfc = str(line[22:35]).strip()
            curp = str(line[35:53]).strip()
            nombre = str(line[53:103]).strip()
            sbc_raw = str(line[113:120]).strip()
            
            data = {
                'registro_patronal': rp,
                'nss': nss,
                'rfc': rfc,
                'curp': curp,
                'nombre': nombre,
                'tipo_trabajador': str(line[103:104]),
                'jornada': str(line[104:105]),
                'fecha_alta': str(line[105:113]),
                'sbc': Decimal(sbc_raw) / Decimal('100')
            }
            trabajadores.append(data)
        return trabajadores

class PayrollEngine:
    """Orquestador de cálculos de nómina"""
    
    def __init__(self):
        self.imss = IMSSCalculator()
        self.isr = ISRCalculator()
        
    def procesar_recibo(self, datos: Dict) -> Dict:
        """
        Procesa un recibo individual.
        Datos esperados: sueldo_bruto, dias_pagados, sbc, riesgo_trabajo, etc.
        """
        sueldo_bruto = Decimal(str(datos.get('sueldo_bruto', 0)))
        dias = int(datos.get('dias_pagados', 15))
        sbc = Decimal(str(datos.get('sbc', sueldo_bruto / dias)))
        
        # Deducciones
        cuotas_imss = self.imss.calcular_cuotas(sbc, dias, Decimal(str(datos.get('riesgo_trabajo', '0.0050'))))
        retencion_isr = self.isr.calcular_mensual(sueldo_bruto) # Simplificado a mensual para este ejemplo
        
        total_deducciones = cuotas_imss['obrera']['total'] + retencion_isr
        neto_pagar = sueldo_bruto - total_deducciones
        
        return {
            'percepciones': {
                'sueldo_bruto': sueldo_bruto,
                'total': sueldo_bruto
            },
            'deducciones': {
                'imss_obrera': cuotas_imss['obrera']['total'],
                'isr_retencion': retencion_isr,
                'total': total_deducciones
            },
            'costo_patronal': {
                'imss_patronal': cuotas_imss['patronal']['total'],
                'infonavit': cuotas_imss['infonavit'],
                'total': cuotas_imss['patronal']['total'] + cuotas_imss['infonavit']
            },
            'neto_pagar': neto_pagar.quantize(Decimal('0.01'), ROUND_HALF_UP),
            'detalles': {
                'imss_full_desglose': cuotas_imss
            }
        }

# Singleton instance
engine = PayrollEngine()
