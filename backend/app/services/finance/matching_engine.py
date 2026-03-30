"""
Matching Engine - Finance Module
Motor de conciliación de 3 capas: Exacto, Fuzzy (Levenshtein) y Validación LLM (NVIDIA NIM).
"""

from decimal import Decimal
from typing import List, Dict, Optional, Tuple
import logging
from difflib import SequenceMatcher
import json

from app.db.models_reconciliation import BankTransaction, MatchStatus
from app.db.models import Document
from app.services.nvidia_nim import chat_completion
from app.core.config import settings

logger = logging.getLogger(__name__)

class MatchingEngine:
    """
    Motor de conciliación bancaria inteligente.
    """

    def __init__(self):
        self.levenshtein_threshold = 0.85
        self.date_tolerance_days = 5

    def find_match(self, tx: BankTransaction, documents: List[Document]) -> Optional[Dict]:
        """
        Busca el mejor match para una transacción bancaria entre una lista de documentos (CFDIs).
        """
        # Capa 1: Exact Match (Monto exacto y fecha cercana)
        exact_matches = self._find_exact_matches(tx, documents)
        if exact_matches:
            best_exact = exact_matches[0]
            return {
                'document': best_exact,
                'status': MatchStatus.EXACT,
                'score': 1.0,
                'details': "Monto exacto y fecha dentro del rango."
            }

        # Capa 2: Fuzzy Match (Monto exacto + similitud de concepto)
        fuzzy_matches = self._find_fuzzy_matches(tx, documents)
        if fuzzy_matches:
            best_fuzzy, score = fuzzy_matches[0]
            if score >= self.levenshtein_threshold:
                return {
                    'document': best_fuzzy,
                    'status': MatchStatus.FUZZY,
                    'score': score,
                    'details': f"Monto coincidente. Similitud de concepto: {score:.2f}"
                }

        # Capa 3: LLM Validation (Para casos ambiguos o montos con diferencias menores)
        # Solo ejecutamos LLM si hay candidatos potenciales (mismo proveedor o montos muy cercanos)
        potential_candidates = self._get_potential_candidates(tx, documents)
        if potential_candidates:
            llm_match = self._validate_with_llm(tx, potential_candidates)
            if llm_match:
                return llm_match

        return None

    def _find_exact_matches(self, tx: BankTransaction, documents: List[Document]) -> List[Document]:
        """Busca documentos con monto exacto y fecha cercana (+/- tolerance)"""
        matches = []
        for doc in documents:
            data = doc.extracted_data or {}
            monto_doc = Decimal(str(data.get('total', 0)))
            
            # Comparación de montos con Decimal
            if abs(tx.monto - monto_doc) < Decimal('0.01'):
                # Comparación de fechas
                doc_date_str = data.get('fecha')
                if doc_date_str:
                    try:
                        doc_date = datetime.fromisoformat(doc_date_str.replace('Z', ''))
                        diff = abs((tx.fecha - doc_date).days)
                        if diff <= self.date_tolerance_days:
                            matches.append(doc)
                    except Exception:
                        continue
        return matches

    def _find_fuzzy_matches(self, tx: BankTransaction, documents: List[Document]) -> List[Tuple[Document, float]]:
        """Busca documentos con monto exacto pero variaciones en concepto/nombre"""
        matches = []
        for doc in documents:
            data = doc.extracted_data or {}
            monto_doc = Decimal(str(data.get('total', 0)))
            
            if abs(tx.monto - monto_doc) < Decimal('0.01'):
                # Calcular similitud de Levenshtein entre concepto bancario y emisor/receptor
                emisor = data.get('emisor_nombre', '').lower()
                score = SequenceMatcher(None, tx.concepto.lower(), emisor).ratio()
                if score >= 0.6: # Umbral mínimo para considerar fuzzy
                    matches.append((doc, score))
        
        # Ordenar por score descendente
        matches.sort(key=lambda x: x[1], reverse=True)
        return matches

    def _get_potential_candidates(self, tx: BankTransaction, documents: List[Document]) -> List[Document]:
        """Filtra documentos que podrían ser match para enviar a LLM"""
        candidates = []
        for doc in documents:
            data = doc.extracted_data or {}
            monto_doc = Decimal(str(data.get('total', 0)))
            
            # Diferencia de monto de hasta 5% (posibles comisiones o redondeos)
            diff_pct = abs(tx.monto - monto_doc) / tx.monto if tx.monto > 0 else 1
            if diff_pct <= 0.05:
                candidates.append(doc)
        return candidates[:5] # Limitar a top 5 para el LLM

    def _validate_with_llm(self, tx: BankTransaction, candidates: List[Document]) -> Optional[Dict]:
        """Usa NVIDIA NIM (Llama) para validar si alguna transacción es match semántico"""
        
        prompt = f"""
        Actúa como un experto contable senior en México.
        Debo conciliar la siguiente transacción bancaria con uno de los CFDIs listados.
        
        TRANSACCIÓN BANCARIA:
        - Fecha: {tx.fecha}
        - Concepto: {tx.concepto}
        - Monto: ${tx.monto}
        
        CANDIDATOS CFDI:
        """
        
        for i, doc in enumerate(candidates):
            data = doc.extracted_data or {}
            prompt += f"""
            [{i}] ID: {doc.id}
            - Fecha: {data.get('fecha')}
            - Emisor: {data.get('emisor_nombre')} (RFC: {data.get('emisor_rfc')})
            - Total: ${data.get('total')}
            - Concepto principal: {data.get('conceptos', [{}])[0].get('descripcion', 'N/A')}
            """

        prompt += """
        Responde ÚNICAMENTE en JSON con el formato:
        {
          "match_index": int (o null si no hay match claro),
          "confidence": float (0.0 a 1.0),
          "reasoning": "Breve explicación de por qué coinciden semánticamente"
        }
        """

        try:
            # Usar chat_completion para validación LLM
            response = chat_completion(
                prompt=prompt,
                model=settings.LLM_MODEL
            )

            # Limpiar y parsear respuesta
            content = response.get('choices', [{}])[0].get('message', {}).get('content', '')
            # Extraer JSON del contenido si hay texto extra
            if "{" in content:
                content = content[content.find("{"):content.rfind("}")+1]

            res_json = json.loads(content)

            if res_json.get('match_index') is not None and res_json['confidence'] >= 0.8:
                idx = res_json['match_index']
                best_doc = candidates[idx]
                return {
                    'document': best_doc,
                    'status': MatchStatus.LLM,
                    'score': res_json['confidence'],
                    'details': res_json['reasoning']
                }
        except Exception as e:
            logger.error(f"Error in LLM validation: {str(e)}")

        return None

# Singleton
matching_engine = MatchingEngine()
from datetime import datetime
