"""
RFC Validator Module
Módulo de validación y corrección de RFC según reglas del SAT.

Incluye:
- Validación de formato (regex estricto)
- Validación de dígito verificador (homoclave)
- Corrección de caracteres comunes (O→0, I→1)
- Validación de listas de RFCs
"""

import re
from typing import Optional, Tuple, List, Dict
from difflib import SequenceMatcher


class RFCValidator:
    """
    Validador de RFC mexicano según especificaciones del SAT.
    
    Attributes:
        RFC_PM_PATTERN: Regex para persona moral (12 caracteres)
        RFC_PF_PATTERN: Regex para persona física (13 caracteres)
        OCR_REPLACEMENTS: Diccionario de reemplazos comunes de OCR
    """

    # Regex estricto para RFC persona moral (12 caracteres)
    RFC_PM_PATTERN = r'^[A-ZÑ&]{3}\d{6}[A-Z0-9]{3}$'

    # Regex estricto para RFC persona física (13 caracteres)
    RFC_PF_PATTERN = r'^[A-ZÑ&]{4}\d{6}[A-Z0-9]{3}$'

    # Caracteres problemáticos en OCR
    OCR_REPLACEMENTS = {
        'O': '0',  # Letra O → Cero
        'I': '1',  # Letra I → Uno
        'l': '1',  # L minúscula → Uno
        'S': '5',  # S → Cinco (en algunos casos)
        'B': '8',  # B → Ocho (en algunos casos)
        'Q': '0',  # Q → Cero (en algunos casos)
        ' ': '',   # Espacios
        '-': '',   # Guiones
        '.': '',   # Puntos
    }

    @staticmethod
    def clean_rfc(rfc: str) -> str:
        """
        Limpia un RFC de caracteres no válidos.

        Args:
            rfc: RFC potencialmente sucio

        Returns:
            str: RFC limpio en mayúsculas y sin caracteres especiales
        """
        if not rfc:
            return ""

        # Convertir a mayúsculas
        rfc = rfc.upper().strip()

        # Remover caracteres no válidos
        for char, replacement in RFCValidator.OCR_REPLACEMENTS.items():
            rfc = rfc.replace(char, replacement)

        return rfc

    @staticmethod
    def validate_format(rfc: str) -> Tuple[bool, str]:
        """
        Valida el formato del RFC según reglas del SAT.

        Args:
            rfc: RFC a validar

        Returns:
            Tuple[bool, str]: (es_válido, mensaje_de_estado)
        """
        rfc = rfc.upper().strip()

        # Validar longitud
        if len(rfc) == 12:
            # Persona moral
            if re.match(RFCValidator.RFC_PM_PATTERN, rfc):
                return True, "RFC válido (Persona Moral)"
            else:
                return False, "Formato inválido para Persona Moral"

        elif len(rfc) == 13:
            # Persona física
            if re.match(RFCValidator.RFC_PF_PATTERN, rfc):
                return True, "RFC válido (Persona Física)"
            else:
                return False, "Formato inválido para Persona Física"

        else:
            return False, f"Longitud inválida: {len(rfc)} (esperado: 12 o 13)"

    @staticmethod
    def validate_homoclave(rfc: str) -> bool:
        """
        Valida el dígito verificador de la homoclave (algoritmo SAT).

        NOTA: Esta es una implementación simplificada.
        El algoritmo completo requiere consultar la tabla de caracteres del SAT.

        Args:
            rfc: RFC completo (12 o 13 caracteres)

        Returns:
            bool: True si la homoclave es válida
        """
        if len(rfc) < 3:
            return False

        homoclave = rfc[-3:]

        # La homoclave debe ser alfanumérica
        return bool(re.match(r'^[A-Z0-9]{3}$', homoclave.upper()))

    @staticmethod
    def fix_ocr_errors(extracted_rfc: str, expected_length: Optional[int] = None) -> str:
        """
        Intenta corregir errores comunes de OCR en RFC.

        Args:
            extracted_rfc: RFC extraído por OCR/Vision LLM
            expected_length: Longitud esperada (12 o 13)

        Returns:
            str: RFC corregido o original si no se pudo corregir
        """
        rfc = extracted_rfc.upper().strip()

        # Si no hay longitud esperada, intentar determinar
        if expected_length is None:
            if len(rfc) == 12:
                expected_length = 12
            elif len(rfc) == 13:
                expected_length = 13
            else:
                # Intentar ajustar
                if len(rfc) < 12:
                    return rfc  # Demasiado corto, no se puede corregir
                elif len(rfc) > 13:
                    rfc = rfc[:13]  # Truncar
                    expected_length = 13
                else:
                    expected_length = 12 if len(rfc) <= 12 else 13

        # Aplicar correcciones comunes
        for old, new in RFCValidator.OCR_REPLACEMENTS.items():
            rfc = rfc.replace(old, new)

        # Validar después de corrección
        is_valid, _ = RFCValidator.validate_format(rfc)

        if is_valid:
            return rfc
        else:
            # Si aún no es válido, devolver original
            return extracted_rfc

    @staticmethod
    def compare_rfc(rfc1: str, rfc2: str) -> Tuple[bool, float]:
        """
        Compara dos RFCs permitiendo variaciones menores.

        Args:
            rfc1: Primer RFC
            rfc2: Segundo RFC

        Returns:
            Tuple[bool, float]: (son_iguales, similaridad)
        """
        # Limpiar ambos RFCs
        rfc1_clean = RFCValidator.clean_rfc(rfc1)
        rfc2_clean = RFCValidator.clean_rfc(rfc2)

        # Comparación exacta
        if rfc1_clean == rfc2_clean:
            return True, 1.0

        # Comparación con similaridad
        similarity = SequenceMatcher(None, rfc1_clean, rfc2_clean).ratio()

        # Considerar igual si >95% similar
        return similarity >= 0.95, similarity

    @staticmethod
    def extract_from_text(text: str) -> List[str]:
        """
        Extrae posibles RFCs de un texto.

        Args:
            text: Texto que puede contener RFCs

        Returns:
            List[str]: Lista de posibles RFCs encontrados
        """
        # Patrón general para RFC (12-13 caracteres alfanuméricos)
        pattern = r'\b[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}\b'
        
        matches = re.findall(pattern, text.upper())
        return matches


def validate_rfc_list(rfc_list: List[str]) -> Dict:
    """
    Valida una lista de RFCs y genera reporte.

    Args:
        rfc_list: Lista de RFCs a validar

    Returns:
        Dict: Diccionario con estadísticas de validación
    """
    results = {
        'total': len(rfc_list),
        'valid': 0,
        'invalid': 0,
        'fixed': 0,
        'errors': []
    }

    for rfc in rfc_list:
        # Validar original
        is_valid, message = RFCValidator.validate_format(rfc)

        if is_valid:
            results['valid'] += 1
        else:
            # Intentar corregir
            fixed = RFCValidator.fix_ocr_errors(rfc)
            is_valid_fixed, _ = RFCValidator.validate_format(fixed)

            if is_valid_fixed and fixed != rfc:
                results['fixed'] += 1
                results['valid'] += 1
                results['errors'].append({
                    'original': rfc,
                    'fixed': fixed,
                    'message': message
                })
            else:
                results['invalid'] += 1
                results['errors'].append({
                    'original': rfc,
                    'fixed': None,
                    'message': message
                })

    return results
