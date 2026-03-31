"""
Matching Engine - Fuzzy Match
Capa 2: Matching por similitud de conceptos (Levenshtein, Jaccard, Provider Matching)
"""

from difflib import SequenceMatcher
from typing import List, Dict, Optional, Tuple
from decimal import Decimal
import logging
import re
import unicodedata

from app.db.models_reconciliation import BankTransaction
from app.db.models import Document
from .matching_engine import MatchResult

logger = logging.getLogger(__name__)


class FuzzyMatchingEngine:
    """
    Motor de fuzzy matching
    
    Algoritmos:
    - Levenshtein distance (conceptos)
    - Jaccard similarity (tokens)
    - Provider name matching (nombres comerciales)
    
    Thresholds:
    - Exact: >0.95 → Auto-confirmar
    - Fuzzy alto: 0.85-0.95 → Auto-confirmar con flag
    - Fuzzy medio: 0.70-0.84 → Enviar a LLM
    - Fuzzy bajo: <0.70 → Marcar como no conciliado
    """
    
    # Thresholds de confianza
    THRESHOLD_EXACT = 0.95
    THRESHOLD_FUZZY_HIGH = 0.85
    THRESHOLD_FUZZY_MEDIUM = 0.70
    
    # Tolerancia de monto para fuzzy (±10%)
    AMOUNT_TOLERANCE_PCT = 0.10
    
    # Tolerancia de fecha para fuzzy (±7 días)
    DATE_TOLERANCE_DAYS = 7
    
    # Pesos para cálculo de confianza
    WEIGHT_LEVENSHTEIN = 0.20
    WEIGHT_JACCARD = 0.35
    WEIGHT_PROVIDER = 0.30
    WEIGHT_AMOUNT = 0.10
    WEIGHT_DATE = 0.05
    
    # Stopwords para limpieza de texto
    STOPWORDS = [
        'pago', 'servicio', 'serv', 'sa', 'sc', 'rl', 'cv',
        'mex', 'mexico', 'de', 'del', 'la', 'el', 'los', 'las',
        'un', 'una', 'unos', 'unas', 'por', 'en', 'con', 'sin',
        'transferencia', 'spei', 'movimiento', 'operacion'
    ]
    
    # Abreviaciones comunes
    ABBREVIATIONS = {
        'amzn': 'amazon',
        'mktplace': 'marketplace',
        'serv': 'servicio',
        'prod': 'producto',
        'dist': 'distribuidora',
        'cfe': 'comision federal de electricidad',
        'tel': 'telmex',
        'att': 'at&t',
        'oxxo': 'tiendas oxxo',
        'walmex': 'walmart de mexico',
        'soriana': 'organizacion soriana',
        'liverpool': 'el puerto de liverpool',
        'palacio': 'el palacio de hierro',
        'sube': 'tarjeta sube',
        'rfc': 'registro federal de contribuyentes'
    }
    
    def __init__(self):
        self.matches: List[MatchResult] = []
        self.unmatched: List[BankTransaction] = []
    
    def match(
        self,
        bank_transactions: List[BankTransaction],
        cfdi_documents: List[Document],
        exact_matches: Optional[List[int]] = None
    ) -> Tuple[List[MatchResult], List[BankTransaction]]:
        """
        Ejecuta fuzzy matching
        
        Args:
            bank_transactions: Lista de transacciones bancarias
            cfdi_documents: Lista de CFDIs
            exact_matches: IDs de transacciones ya matcheadas por exact matching
            
        Returns:
            Tuple: (matches, unmatched_transactions)
        """
        self.matches = []
        self.unmatched = []
        matched_cfdi_ids = set()
        exact_match_ids = set(exact_matches or [])
        
        for bank_tx in bank_transactions:
            # Saltar transacciones ya matcheadas por exact matching
            if bank_tx.id in exact_match_ids:
                continue
            
            best_match: Optional[MatchResult] = None
            
            for cfdi in cfdi_documents:
                # Saltar CFDIs ya matcheados
                if cfdi.id in matched_cfdi_ids:
                    continue
                
                # Verificar match fuzzy
                match_result = self._check_fuzzy_match(bank_tx, cfdi)
                
                if match_result is not None and match_result.puntuacion_confianza >= self.THRESHOLD_FUZZY_MEDIUM:
                    # Guardar mejor match (mayor confianza)
                    if best_match is None or match_result.puntuacion_confianza > best_match.puntuacion_confianza:
                        best_match = match_result
            
            if best_match:
                self.matches.append(best_match)
                matched_cfdi_ids.add(best_match.cfdi.id)
                
                # Actualizar estado de transacción
                if best_match.puntuacion_confianza >= self.THRESHOLD_FUZZY_HIGH:
                    bank_tx.match_status = 'fuzzy'
                else:
                    bank_tx.match_status = 'llm'  # Requiere validación LLM
                
                bank_tx.puntuacion_confianza = best_match.puntuacion_confianza
            else:
                self.unmatched.append(bank_tx)
                bank_tx.match_status = 'unmatched'
        
        logger.info(
            f"Fuzzy matching: {len(self.matches)} matches, "
            f"{len(self.unmatched)} unmatched"
        )
        
        return self.matches, self.unmatched
    
    def _check_fuzzy_match(
        self,
        bank_tx: BankTransaction,
        cfdi: Document
    ) -> Optional[MatchResult]:
        """
        Verifica si hay match fuzzy entre transacción y CFDI
        
        Args:
            bank_tx: Transacción bancaria
            cfdi: CFDI
            
        Returns:
            Optional[MatchResult]: Resultado si hay match, None si no
        """
        # Extraer datos del CFDI
        cfdi_data = cfdi.datos_extraidos or {}
        
        # Obtener monto CFDI
        cfdi_monto = self._get_cfdi_amount(cfdi_data)
        if not cfdi_monto:
            return None
        
        # Obtener fecha CFDI
        cfdi_fecha = self._get_cfdi_date(cfdi_data)
        if not cfdi_fecha:
            return None
        
        # Obtener concepto/proveedor CFDI
        cfdi_concepto = self._get_cfdi_concept(cfdi_data)
        cfdi_proveedor = self._get_cfdi_provider(cfdi_data)
        
        # Criterio 1: Monto dentro de tolerancia (±10%)
        monto_match = self._check_amount_tolerance(bank_tx.monto, cfdi_monto)
        if not monto_match:
            return None
        
        # Criterio 2: Fecha ±7 días
        fecha_match = self._check_date_tolerance(bank_tx.fecha, cfdi_fecha)
        if not fecha_match:
            return None
        
        # Calcular similitudes
        levenshtein_score = self._levenshtein_similarity(
            bank_tx.concepto_limpio or bank_tx.concepto,
            cfdi_concepto
        )
        
        jaccard_score = self._jaccard_similarity(
            bank_tx.concepto_limpio or bank_tx.concepto,
            cfdi_concepto
        )
        
        provider_score = self._match_provider_names(
            bank_tx.proveedor or bank_tx.concepto,
            cfdi_proveedor or cfdi_concepto
        )
        
        # Calcular confianza ponderada
        confidence = self._calculate_confidence(
            levenshtein_score,
            jaccard_score,
            provider_score,
            monto_match,
            fecha_match
        )
        
        if confidence < self.THRESHOLD_FUZZY_MEDIUM:
            return None
        
        # Crear resultado
        match_details = {
            'levenshtein_score': levenshtein_score,
            'jaccard_score': jaccard_score,
            'provider_score': provider_score,
            'monto_banco': float(bank_tx.monto),
            'monto_cfdi': float(cfdi_monto),
            'diferencia_monto_pct': float(abs(bank_tx.monto - cfdi_monto) / cfdi_monto * 100),
            'fecha_banco': bank_tx.fecha.isoformat(),
            'fecha_cfdi': cfdi_fecha.isoformat(),
            'diferencia_dias': abs((bank_tx.fecha - cfdi_fecha).days),
            'concepto_banco': bank_tx.concepto[:100],
            'concepto_cfdi': str(cfdi_concepto)[:100] if cfdi_concepto else None
        }
        
        return MatchResult(
            match_type='fuzzy',
            puntuacion_confianza=confidence,
            bank_transaction=bank_tx,
            cfdi=cfdi,
            match_details=match_details
        )
    
    def _levenshtein_similarity(self, s1: str, s2: str) -> float:
        """
        Calcula similitud Levenshtein (SequenceMatcher)
        
        Args:
            s1: Primer string
            s2: Segundo string
            
        Returns:
            float: Similitud (0-1)
        """
        if not s1 or not s2:
            return 0.0
        
        # Normalizar antes de comparar para mejorar ratio
        sn1 = self._normalize_text(s1)
        sn2 = self._normalize_text(s2)
        
        if not sn1 or not sn2:
            return SequenceMatcher(None, s1.lower(), s2.lower()).ratio()
            
        return SequenceMatcher(None, sn1, sn2).ratio()
    
    def _jaccard_similarity(self, s1: str, s2: str) -> float:
        """
        Calcula similitud Jaccard por tokens
        
        Jaccard = |A ∩ B| / |A ∪ B|
        
        Args:
            s1: Primer string
            s2: Segundo string
            
        Returns:
            float: Similitud (0-1)
        """
        if not s1 or not s2:
            return 0.0
        
        # Tokenizar
        tokens1 = set(s1.lower().split())
        tokens2 = set(s2.lower().split())
        
        # Intersección y unión
        intersection = tokens1 & tokens2
        union = tokens1 | tokens2
        
        if not union:
            return 0.0
        
        # Peso extra si hay palabras clave compartidas pero el union es grande
        return len(intersection) / len(union)
    
    def _match_provider_names(self, bank_concept: str, cfdi_concept: str) -> float:
        """
        Matching especializado para nombres de proveedores.
        
        Uses token-overlap: extracts meaningful keywords from both strings
        (after expanding abbreviations and removing stopwords), then checks
        how many provider-name tokens appear in the bank concept.
        
        Returns:
            float: Similitud (0-1)
        """
        if not bank_concept or not cfdi_concept:
            return 0.0
        
        # Expandir abreviaciones
        bank_expanded = self._expand_abbreviations(bank_concept)
        cfdi_expanded = self._expand_abbreviations(cfdi_concept)
        
        # Tokenize and remove stopwords
        bank_tokens = set(bank_expanded.lower().split()) - set(self.STOPWORDS)
        cfdi_tokens = set(cfdi_expanded.lower().split()) - set(self.STOPWORDS)
        
        if not cfdi_tokens:
            return 0.0
        
        # How many CFDI provider tokens appear in bank concept?
        overlap = bank_tokens & cfdi_tokens
        # Score = fraction of provider tokens found in bank concept
        score = len(overlap) / len(cfdi_tokens) if cfdi_tokens else 0.0
        
        # Also check SequenceMatcher as a fallback for partial word matches
        seq_score = SequenceMatcher(None, bank_expanded.lower(), cfdi_expanded.lower()).ratio()
        
        # Return the best of both approaches
        return max(score, seq_score)

    
    def _expand_abbreviations(self, text: str) -> str:
        """
        Expande abreviaciones comunes
        
        Args:
            text: Texto con posibles abreviaciones
            
        Returns:
            str: Texto con abreviaciones expandidas
        """
        result = text.lower()
        
        for abbr, full in self.ABBREVIATIONS.items():
            # Reemplazar solo si es palabra completa
            result = re.sub(r'\b' + abbr + r'\b', full, result, flags=re.IGNORECASE)
        
        return result
    
    def _normalize_text(self, text: str) -> str:
        """
        Normaliza texto para comparación
        
        Args:
            text: Texto a normalizar
            
        Returns:
            str: Texto normalizado
        """
        # Minúsculas
        text = text.lower()
        
        # Eliminar acentos
        text = unicodedata.normalize('NFD', text)
        text = ''.join(c for c in text if unicodedata.category(c) != 'Mn')
        
        # Eliminar caracteres especiales
        text = re.sub(r'[^a-z0-9\s]', ' ', text)
        
        # Eliminar stopwords
        text = ' '.join(word for word in text.split() if word not in self.STOPWORDS)
        
        # Eliminar espacios múltiples
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    def _check_amount_tolerance(
        self,
        bank_monto: Decimal,
        cfdi_monto: Decimal
    ) -> bool:
        """Verifica match de monto con tolerancia ±10%"""
        if cfdi_monto == 0:
            return False
        
        diff_pct = abs(bank_monto - cfdi_monto) / cfdi_monto
        return diff_pct <= self.AMOUNT_TOLERANCE_PCT
    
    def _check_date_tolerance(
        self,
        bank_fecha,
        cfdi_fecha
    ) -> bool:
        """Verifica match de fecha con tolerancia ±7 días"""
        diff = abs((bank_fecha - cfdi_fecha).days)
        return diff <= self.DATE_TOLERANCE_DAYS
    
    def _calculate_confidence(
        self,
        levenshtein: float,
        jaccard: float,
        provider: float,
        monto_match: bool,
        fecha_match: bool
    ) -> float:
        """Calcula score de confianza ponderado"""
        if not monto_match or not fecha_match:
            return 0.0
        
        confidence = (
            levenshtein * self.WEIGHT_LEVENSHTEIN +
            jaccard * self.WEIGHT_JACCARD +
            provider * self.WEIGHT_PROVIDER
        )
        
        # Bonus por monto y fecha exactos
        if monto_match:
            confidence += self.WEIGHT_AMOUNT
        if fecha_match:
            confidence += self.WEIGHT_DATE
        
        return min(confidence, 1.0)
    
    def _get_cfdi_amount(self, cfdi_data: Dict) -> Optional[Decimal]:
        """Obtiene monto total del CFDI"""
        for field in ['total', 'Total', 'monto', 'Monto']:
            if field in cfdi_data and cfdi_data[field]:
                try:
                    return Decimal(str(cfdi_data[field]))
                except Exception:
                    continue
        return None
    
    def _get_cfdi_date(self, cfdi_data: Dict):
        """Obtiene fecha del CFDI"""
        for field in ['fecha', 'Fecha', 'fecha_emision', 'date']:
            if field in cfdi_data and cfdi_data[field]:
                try:
                    if isinstance(cfdi_data[field], str):
                        from datetime import datetime
                        return datetime.fromisoformat(cfdi_data[field])
                    elif isinstance(cfdi_data[field], datetime):
                        return cfdi_data[field]
                except Exception:
                    continue
        return None
    
    def _get_cfdi_concept(self, cfdi_data: Dict) -> str:
        """Obtiene concepto/descripción del CFDI"""
        for field in ['descripcion', 'Descripcion', 'concepto', 'Concepto', 'producto']:
            if field in cfdi_data and cfdi_data[field]:
                return str(cfdi_data[field])
        return ''
    
    def _get_cfdi_provider(self, cfdi_data: Dict) -> str:
        """Obtiene nombre del proveedor del CFDI"""
        for field in ['emisor_nombre', 'emisorNombre', 'razon_social', 'proveedor']:
            if field in cfdi_data and cfdi_data[field]:
                return str(cfdi_data[field])
        return ''
