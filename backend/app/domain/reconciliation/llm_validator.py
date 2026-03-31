"""
LLM Validation - Capa 3
Validación semántica con NVIDIA NIM Llama-3.3-70B-Instruct
"""

import asyncio
import logging
from typing import List, Dict, Tuple

from app.db.models_reconciliation import BankTransaction
from app.db.models import Document
from .matching_engine import MatchResult

logger = logging.getLogger(__name__)


class LLMValidationEngine:
    """
    Motor de validación con LLM
    
    Usa NVIDIA NIM Llama-3.3-70B-Instruct para:
    - Validar matches fuzzy de confianza media (0.70-0.84)
    - Generar razonamiento para auditoría
    - Detectar falsos positivos
    
    Thresholds:
    - LLM alto: >0.90 → Auto-confirmar con razonamiento
    - LLM medio: 0.75-0.90 → Revisión humana recomendada
    - LLM bajo: <0.75 → Rechazar match
    """
    
    # Thresholds de confianza LLM
    THRESHOLD_LLM_HIGH = 0.90
    THRESHOLD_LLM_MEDIUM = 0.75
    
    # Configuración de NVIDIA NIM
    NIM_CONFIG = {
        'model': 'nvidia/llama-3.3-70b-instruct',
        'temperature': 0.1,  # Bajo para consistencia
        'max_tokens': 100,
        'timeout': 30
    }
    
    # Prompt template para validación
    VALIDATION_PROMPT = """
Eres un experto en conciliación bancaria. Analiza si la transacción bancaria coincide con el CFDI.

## Transacción Bancaria:
- **Fecha:** {bank_fecha}
- **Monto:** ${bank_monto:,.2f} MXN
- **Concepto:** {bank_concepto}
- **Proveedor:** {bank_proveedor}
- **Referencia:** {bank_referencia}

## CFDI:
- **Fecha:** {cfdi_fecha}
- **Monto:** ${cfdi_monto:,.2f} MXN
- **Descripción:** {cfdi_descripcion}
- **Proveedor (RFC):** {cfdi_emisor} ({cfdi_rfc})
- **Uso CFDI:** {cfdi_uso}

## Contexto Adicional:
- **Diferencia de monto:** {monto_diff_pct:.2f}%
- **Diferencia de días:** {dias_diff} días
- **Fuzzy score previo:** {fuzzy_score:.2f}

## Instrucciones:
1. Analiza si son la MISMA operación
2. Considera variaciones comunes en nombres de proveedores
3. Evalúa si la diferencia de monto es razonable (pagos parciales, retenciones)
4. Verifica coherencia de fechas

## Formato de Respuesta (JSON):
{{
    "match": true/false,
    "confidence": 0.0-1.0,
    "reason": "Explicación breve (max 100 palabras)",
    "flags": ["lista de banderas si aplica"]
}}

## Banderas posibles:
- "MONTO_DIFERENTE": Diferencia de monto >5%
- "FECHA_DISTANTE": Diferencia >15 días
- "PROVEEDOR_SOSPECHOSO": Nombres muy diferentes
- "POSIBLE_RETENCION": Diferencia sugiere retención de ISR/IVA

Responde SOLO con el JSON válido.
"""
    
    def __init__(self, nvidia_api_key: str = None):
        """
        Inicializa el motor LLM
        
        Args:
            nvidia_api_key: API key de NVIDIA NIM (opcional, usa env var si no se proporciona)
        """
        self.api_key = nvidia_api_key
        self.matches_validated = 0
        self.matches_confirmed = 0
        self.matches_rejected = 0
    
    async def validate_matches(
        self,
        fuzzy_matches: List[MatchResult]
    ) -> Tuple[List[MatchResult], List[MatchResult]]:
        """
        Valida matches fuzzy con LLM
        
        Args:
            fuzzy_matches: Lista de matches fuzzy por validar
            
        Returns:
            Tuple: (confirmed_matches, rejected_matches)
        """
        confirmed = []
        rejected = []
        
        logger.info(f"Validando {len(fuzzy_matches)} matches con LLM")
        
        # Procesar en paralelo (batch de 5)
        batch_size = 5
        for i in range(0, len(fuzzy_matches), batch_size):
            batch = fuzzy_matches[i:i + batch_size]
            tasks = [self._validate_single_match(match) for match in batch]
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            for match, result in zip(batch, results):
                if isinstance(result, Exception):
                    logger.error(f"Error validando match {match.bank_transaction.id}: {result}")
                    rejected.append(match)
                    continue
                
                llm_confidence, llm_reason, flags = result
                
                # Actualizar match con información LLM
                match.puntuacion_confianza = llm_confidence
                match.match_details['llm_reason'] = llm_reason
                match.match_details['llm_flags'] = flags
                
                # Clasificar por confianza
                if llm_confidence >= self.THRESHOLD_LLM_HIGH:
                    match.match_type = 'llm_confirmed'
                    confirmed.append(match)
                    self.matches_confirmed += 1
                elif llm_confidence >= self.THRESHOLD_LLM_MEDIUM:
                    match.match_type = 'llm_review'
                    confirmed.append(match)  # Pero marca para revisión humana
                    self.matches_confirmed += 1
                else:
                    match.match_type = 'llm_rejected'
                    rejected.append(match)
                    self.matches_rejected += 1
                
                self.matches_validated += 1
        
        logger.info(
            f"LLM validation: {len(confirmed)} confirmados, "
            f"{len(rejected)} rechazados"
        )
        
        return confirmed, rejected
    
    async def _validate_single_match(
        self,
        match: MatchResult
    ) -> Tuple[float, str, List[str]]:
        """
        Valida un match individual con LLM
        
        Args:
            match: Match a validar
            
        Returns:
            Tuple: (confidence, reason, flags)
        """
        # Preparar datos para el prompt
        bank_tx = match.bank_transaction
        cfdi_data = match.cfdi.datos_extraidos or {}
        
        # Calcular diferencias
        monto_diff_pct = float(abs(bank_tx.monto - match.cfdi.total) / match.cfdi.total * 100) if match.cfdi.total else 0
        dias_diff = abs((bank_tx.fecha - match.cfdi.fecha).days) if match.cfdi.fecha else 0
        
        # Construir prompt
        prompt = self.VALIDATION_PROMPT.format(
            bank_fecha=bank_tx.fecha.strftime('%d/%m/%Y'),
            bank_monto=float(bank_tx.monto),
            bank_concepto=bank_tx.concepto[:200],
            bank_proveedor=bank_tx.proveedor or 'N/A',
            bank_referencia=bank_tx.referencia or 'N/A',
            cfdi_fecha=match.cfdi.fecha.strftime('%d/%m/%Y') if match.cfdi.fecha else 'N/A',
            cfdi_monto=float(match.cfdi.total) if match.cfdi.total else 0,
            cfdi_descripcion=self._get_cfdi_field(cfdi_data, 'descripcion')[:200],
            cfdi_emisor=self._get_cfdi_field(cfdi_data, 'emisor_nombre'),
            cfdi_rfc=self._get_cfdi_field(cfdi_data, 'emisor_rfc'),
            cfdi_uso=self._get_cfdi_field(cfdi_data, 'uso_cfdi'),
            monto_diff_pct=monto_diff_pct,
            dias_diff=dias_diff,
            fuzzy_score=match.puntuacion_confianza
        )
        
        # Llamar a NVIDIA NIM
        try:
            response = await self._call_nvidia_nim(prompt)
            
            # Parsear respuesta JSON
            result = self._parse_llm_response(response)
            
            return (
                result.get('confidence', 0.0),
                result.get('reason', ''),
                result.get('flags', [])
            )
            
        except Exception as e:
            logger.error(f"Error calling NVIDIA NIM: {e}")
            # Fallback: usar fuzzy score original
            return match.puntuacion_confianza, 'Error en validación LLM', ['LLM_ERROR']
    
    async def _call_nvidia_nim(self, prompt: str) -> str:
        """
        Llama a NVIDIA NIM API
        
        Args:
            prompt: Prompt para el LLM
            
        Returns:
            str: Respuesta del LLM
        """
        try:
            from langchain_nvidia_ai_endpoints import ChatNVIDIA
            
            # Configurar modelo
            llm = ChatNVIDIA(
                model=self.NIM_CONFIG['model'],
                temperature=self.NIM_CONFIG['temperature'],
                max_tokens=self.NIM_CONFIG['max_tokens'],
                nvidia_api_key=self.api_key
            )
            
            # Llamar al modelo
            response = await llm.ainvoke(prompt)
            
            return response.content
            
        except ImportError:
            logger.warning("langchain-nvidia-ai-endpoints no instalado. Usando fallback.")
            return self._fallback_validation()
            
        except Exception as e:
            logger.error(f"Error en NVIDIA NIM: {e}")
            raise
    
    def _fallback_validation(self) -> str:
        """
        Fallback si NVIDIA NIM no está disponible
        
        Returns:
            str: Respuesta JSON simulada
        """
        import json
        
        return json.dumps({
            'match': True,
            'confidence': 0.85,
            'reason': 'Validación fallback por indisponibilidad del servicio LLM',
            'flags': ['FALLBACK']
        })
    
    def _parse_llm_response(self, response: str) -> Dict:
        """
        Parsea respuesta JSON del LLM
        
        Args:
            response: Respuesta raw del LLM
            
        Returns:
            Dict: Respuesta parseada
        """
        import json
        import re
        
        # Extraer JSON de la respuesta (puede tener texto alrededor)
        json_match = re.search(r'\{.*\}', response, re.DOTALL)
        
        if json_match:
            try:
                return json.loads(json_match.group())
            except json.JSONDecodeError:
                logger.warning(f"No se pudo parsear JSON: {response}")
        
        # Fallback: respuesta por defecto
        return {
            'match': False,
            'confidence': 0.5,
            'reason': 'No se pudo parsear la respuesta del LLM',
            'flags': ['PARSE_ERROR']
        }
    
    def _get_cfdi_field(self, cfdi_data: Dict, field: str) -> str:
        """
        Obtiene campo del CFDI
        
        Args:
            cfdi_data: Datos extractados del CFDI
            field: Nombre del campo
            
        Returns:
            str: Valor del campo
        """
        # Intentar múltiples variaciones del nombre
        variants = [
            field,
            field.capitalize(),
            field.upper(),
            field.replace('_', ''),
            field.replace('_', ' ')
        ]
        
        for variant in variants:
            if variant in cfdi_data:
                value = cfdi_data[variant]
                return str(value) if value else 'N/A'
        
        return 'N/A'
    
    def get_stats(self) -> Dict:
        """
        Obtiene estadísticas de validación
        
        Returns:
            Dict: Estadísticas
        """
        return {
            'total_validated': self.matches_validated,
            'confirmed': self.matches_confirmed,
            'rejected': self.matches_rejected,
            'confirmation_rate': (
                self.matches_confirmed / self.matches_validated * 100
                if self.matches_validated > 0 else 0
            )
        }


class MatchResult:
    """
    Clase auxiliar para resultados de match
    
    Nota: Esta clase ya existe en matching_engine.py, pero la duplicamos
    aquí para evitar imports circulares si es necesario.
    """
    
    def __init__(
        self,
        match_type: str,
        puntuacion_confianza: float,
        bank_transaction: BankTransaction,
        cfdi: Document,
        match_details: Dict
    ):
        self.match_type = match_type
        self.puntuacion_confianza = puntuacion_confianza
        self.bank_transaction = bank_transaction
        self.cfdi = cfdi
        self.match_details = match_details
