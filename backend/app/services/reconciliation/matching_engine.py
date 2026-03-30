"""
Matching Engine - Exact Match
Capa 1: Matching por monto exacto + fecha ±3 días
"""

from datetime import datetime
from typing import List, Dict, Optional, Tuple
from decimal import Decimal
import logging

from app.db.models_reconciliation import BankTransaction
from app.db.models import Document

logger = logging.getLogger(__name__)


class MatchResult:
    """Resultado de matching"""
    
    def __init__(
        self,
        match_type: str,
        confidence_score: float,
        bank_transaction: BankTransaction,
        cfdi: Document,
        match_details: Dict
    ):
        self.match_type = match_type
        self.confidence_score = confidence_score
        self.bank_transaction = bank_transaction
        self.cfdi = cfdi
        self.match_details = match_details
    
    def to_dict(self) -> Dict:
        """Convierte a diccionario"""
        return {
            'match_type': self.match_type,
            'confidence_score': self.confidence_score,
            'bank_transaction_id': self.bank_transaction.id,
            'cfdi_id': self.cfdi.id,
            'match_details': self.match_details
        }


class ExactMatchingEngine:
    """
    Motor de matching exacto
    
    Criterios:
    - Monto: ±0.01 MXN (por redondeo)
    - Fecha: ±3 días hábiles
    - RFC: emisor/receptor coincidente (opcional)
    """
    
    # Tolerancia de monto (±0.01 MXN)
    AMOUNT_TOLERANCE = Decimal('0.01')
    
    # Tolerancia de fecha (±3 días)
    DATE_TOLERANCE_DAYS = 3
    
    # Threshold de confianza para exact match
    CONFIDENCE_THRESHOLD = 0.95
    
    def __init__(self):
        self.matches: List[MatchResult] = []
        self.unmatched: List[BankTransaction] = []
    
    def match(
        self,
        bank_transactions: List[BankTransaction],
        cfdi_documents: List[Document]
    ) -> Tuple[List[MatchResult], List[BankTransaction]]:
        """
        Ejecuta matching exacto
        
        Args:
            bank_transactions: Lista de transacciones bancarias
            cfdi_documents: Lista de CFDIs
            
        Returns:
            Tuple: (matches, unmatched_transactions)
        """
        self.matches = []
        self.unmatched = []
        matched_cfdi_ids = set()
        
        for bank_tx in bank_transactions:
            best_match: Optional[MatchResult] = None
            
            for cfdi in cfdi_documents:
                # Saltar CFDIs ya matcheados
                if cfdi.id in matched_cfdi_ids:
                    continue
                
                # Verificar match
                match_result = self._check_match(bank_tx, cfdi)
                
                if match_result:
                    # Guardar mejor match (mayor confianza)
                    if not best_match or match_result.confidence_score > best_match.confidence_score:
                        best_match = match_result
            
            if best_match:
                self.matches.append(best_match)
                matched_cfdi_ids.add(best_match.cfdi.id)
                bank_tx.match_status = 'exact'
                bank_tx.confidence_score = best_match.confidence_score
            else:
                self.unmatched.append(bank_tx)
                bank_tx.match_status = 'unmatched'
        
        logger.info(f"Exact matching: {len(self.matches)} matches, {len(self.unmatched)} unmatched")
        
        return self.matches, self.unmatched
    
    def _check_match(
        self,
        bank_tx: BankTransaction,
        cfdi: Document
    ) -> Optional[MatchResult]:
        """
        Verifica si hay match entre transacción y CFDI
        
        Args:
            bank_tx: Transacción bancaria
            cfdi: CFDI
            
        Returns:
            Optional[MatchResult]: Resultado si hay match, None si no
        """
        # Extraer datos del CFDI
        cfdi_data = cfdi.extracted_data or {}
        
        # Obtener monto CFDI
        cfdi_monto = self._get_cfdi_amount(cfdi_data)
        if not cfdi_monto:
            return None
        
        # Obtener fecha CFDI
        cfdi_fecha = self._get_cfdi_date(cfdi_data)
        if not cfdi_fecha:
            return None
        
        # Criterio 1: Monto exacto (±0.01)
        monto_match = self._check_amount_match(bank_tx.monto, cfdi_monto)
        if not monto_match:
            return None
        
        # Criterio 2: Fecha ±3 días
        fecha_match = self._check_date_match(bank_tx.fecha, cfdi_fecha)
        if not fecha_match:
            return None
        
        # Criterio 3: RFC (opcional, aumenta confianza)
        rfc_match = self._check_rfc_match(bank_tx, cfdi_data)
        
        # Calcular confianza
        confidence = self._calculate_confidence(monto_match, fecha_match, rfc_match)
        
        if confidence < self.CONFIDENCE_THRESHOLD:
            return None
        
        # Crear resultado
        match_details = {
            'monto_banco': float(bank_tx.monto),
            'monto_cfdi': float(cfdi_monto),
            'diferencia_monto': float(abs(bank_tx.monto - cfdi_monto)),
            'fecha_banco': bank_tx.fecha.isoformat(),
            'fecha_cfdi': cfdi_fecha.isoformat(),
            'diferencia_dias': abs((bank_tx.fecha - cfdi_fecha).days),
            'rfc_match': rfc_match
        }
        
        return MatchResult(
            match_type='exact',
            confidence_score=confidence,
            bank_transaction=bank_tx,
            cfdi=cfdi,
            match_details=match_details
        )
    
    def _get_cfdi_amount(self, cfdi_data: Dict) -> Optional[Decimal]:
        """Obtiene monto total del CFDI"""
        # Intentar múltiples campos
        for field in ['total', 'Total', 'monto', 'Monto']:
            if field in cfdi_data and cfdi_data[field]:
                try:
                    return Decimal(str(cfdi_data[field]))
                except Exception:
                    continue
        return None
    
    def _get_cfdi_date(self, cfdi_data: Dict) -> Optional[datetime]:
        """Obtiene fecha del CFDI"""
        # Intentar múltiples campos
        for field in ['fecha', 'Fecha', 'fecha_emision', 'date']:
            if field in cfdi_data and cfdi_data[field]:
                try:
                    if isinstance(cfdi_data[field], str):
                        return datetime.fromisoformat(cfdi_data[field])
                    elif isinstance(cfdi_data[field], datetime):
                        return cfdi_data[field]
                except Exception:
                    continue
        return None
    
    def _check_amount_match(
        self,
        bank_monto: Decimal,
        cfdi_monto: Decimal
    ) -> bool:
        """Verifica match de monto (±0.01)"""
        return abs(bank_monto - cfdi_monto) <= self.AMOUNT_TOLERANCE
    
    def _check_date_match(
        self,
        bank_fecha: datetime,
        cfdi_fecha: datetime
    ) -> bool:
        """Verifica match de fecha (±3 días)"""
        diff = abs((bank_fecha - cfdi_fecha).days)
        return diff <= self.DATE_TOLERANCE_DAYS
    
    def _check_rfc_match(
        self,
        bank_tx: BankTransaction,
        cfdi_data: Dict
    ) -> bool:
        """Verifica match de RFC (opcional)"""
        if not bank_tx.rfc_proveedor:
            return False  # No hay RFC en banco
        
        # Extraer RFC del CFDI
        cfdi_rfc = cfdi_data.get('emisor_rfc') or cfdi_data.get('rfc_emisor')
        
        if not cfdi_rfc:
            return False
        
        return bank_tx.rfc_proveedor == cfdi_rfc
    
    def _calculate_confidence(
        self,
        monto_match: bool,
        fecha_match: bool,
        rfc_match: bool
    ) -> float:
        """Calcula score de confianza"""
        if not monto_match or not fecha_match:
            return 0.0
        
        # Peso de cada criterio
        peso_monto = 0.6
        peso_fecha = 0.3
        peso_rfc = 0.1
        
        confidence = peso_monto + peso_fecha  # Monto y fecha son obligatorios
        
        if rfc_match:
            confidence += peso_rfc
        
        return min(confidence, 1.0)
