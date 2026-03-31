import json
import logging
import requests
from typing import List, Dict, Any
from app.core.config import settings

logger = logging.getLogger(__name__)

class AccountClassifier:
    """
    Account Classifier with Cold Start (NVIDIA NIM) Fallback.
    Initializes Random Forest predictions if trained dict exists.
    Otherwise uses LLaMA 3.3 70B Instruct as Fallback (Cold Start).
    """
    def __init__(self):
        # En una implementación real, aquí cargaríamos un modelo pkl de Scikit-Learn (Random Forest)
        # o un diccionario de embeddings ChromaDB
        self.is_model_trained = False
        self.api_key = settings.NVIDIA_API_KEY
        self.llm_url = f"{settings.LLM_BASE_URL}/chat/completions"
        self.llm_model = settings.LLM_MODEL

    def predict(self, transactions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Produce suggested accounts.
        If Random Forest is not trained (Cold Start), routes requests to NIM LLM.
        """
        results = []
        for index, transaction in enumerate(transactions):
            if self.is_model_trained:
                # Mock ML logic para Random Forest
                results.append(self._mock_traditional_ml(transaction, index))
            else:
                # COLD START AI Fallback
                try:
                    nim_result = self._call_nim_fallback(transaction, index)
                    results.append(nim_result)
                except Exception as e:
                    logger.error(f"Error in NIM Cold Start fallback: {e}")
                    # Retornando mock genérico de fallback ante excepciones de red/API
                    results.append(self._mock_traditional_ml(transaction, index))

        return results

    def _call_nim_fallback(self, tx: Dict[str, Any], index: int) -> Dict[str, Any]:
        """Llama a LLaMA-3.3-70B vía NVIDIA NIM para clasificar un concepto nuevo."""
        if not self.api_key:
            raise ValueError("No API Key configured for NIM.")

        prompt = f"""Eres un experto contador en México especializado en las NIF.
Debes clasificar la siguiente transacción a la cuenta de gastos/costos más apropiada.
DATOS DE LA TRANSACCIÓN:
Concepto: {tx.get('concepto')}
Monto: {tx.get('monto')}
Proveedor: {tx.get('proveedor')}
RFC: {tx.get('rfc_proveedor')}

Catálogo Disponible (NIF B-3):
- 501-01-001 Costo de Ventas
- 601-01-001 Sueldos y Salarios
- 601-02-001 Seguridad Social
- 601-03-001 Arrendamientos
- 601-04-001 Servicios Públicos
- 601-06-001 Teléfono e Internet
- 601-08-001 Combustibles
- 601-10-001 Honorarios Profesionales
- 601-11-001 Gastos Financieros

INSTRUCCIONES: Responde ÚNICAMENTE con un objeto JSON (sin markdown, sin explicaciones, sin formato de bloque de código) con esta estructura exacta:
{{
    "suggested_account": "601-04-001",
    "account_name": "Servicios Públicos",
    "confidence_score": 0.92,
    "top_3": [
        {{"code": "601-04-001", "name": "Servicios Públicos", "confidence": 0.92}},
        {{"code": "601-08-001", "name": "Combustibles", "confidence": 0.05}},
        {{"code": "601-10-001", "name": "Honorarios Profesionales", "confidence": 0.03}}
    ]
}}"""

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }

        payload = {
            "model": self.llm_model,
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 512,
            "temperature": 0.1,
            "top_p": 1.0,
            "stream": False
        }

        response = requests.post(self.llm_url, headers=headers, json=payload, timeout=15.0)
        
        if response.status_code == 200:
            data = response.json()
            content = data["choices"][0]["message"]["content"]
            # Ensuciarse con bloques de markdown opcionales que LLaMA a veces regresa a pesar del prompt
            content = content.replace("```json", "").replace("```", "").strip()
            parsed_json = json.loads(content)
            
            # Incorporamos properties requeridas para compatibilidad
            parsed_json['document_id'] = tx.get('id', index)
            parsed_json['concepto'] = tx.get('concepto', '')
            parsed_json['monto'] = tx.get('monto', 0)
            return parsed_json
        else:
            raise RuntimeError(f"NIM API Failed with {response.status_code}: {response.text}")

    def _mock_traditional_ml(self, tx: Dict[str, Any], index: int) -> Dict[str, Any]:
        """Respuesta fija rápida para Random Forest simulado (Mock original)."""
        return {
            'document_id': tx.get('id', index),
            'concepto': tx.get('concepto', ''),
            'monto': tx.get('monto', 0),
            'suggested_account': '601-01-001',
            'account_name': 'Sueldos y Salarios',
            'confidence_score': 0.95,
            'top_3': [
                {'code': '601-01-001', 'name': 'Sueldos y Salarios', 'confidence': 0.95},
                {'code': '601-10-001', 'name': 'Honorarios Profesionales', 'confidence': 0.80},
                {'code': '601-03-001', 'name': 'Arrendamientos', 'confidence': 0.60}
            ]
        }
