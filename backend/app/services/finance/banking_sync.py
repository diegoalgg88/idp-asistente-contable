"""
Banking Synchronization Service
Orquestador de conciliación: Parser -> Matching Engine -> Data Persistence.
"""

import logging
from typing import Dict
from datetime import datetime
from decimal import Decimal
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import Depends

from app.services.reconciliation.bank_parser import BankStatementParser
from app.services.finance.matching_engine import matching_engine
from app.db.database import get_db
from app.db.models_reconciliation import (
    BankStatement,
    BankTransaction,
    ReconciliationMatch,
    ReconciliationBatch,
    BankStatementStatus
)
from app.db.models import Document

logger = logging.getLogger(__name__)

class BankingSyncService:
    """
    Servicio unificado para la sincronización y conciliación bancaria.
    """
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.parser = BankStatementParser()

    async def process_file_upload(self, file_path: str, user_id: int, original_filename: str) -> Dict:
        """
        Punto de entrada para el procesamiento de archivos subidos.
        """
        # 1. Parsear el archivo
        try:
            transactions, bank_code, bank_name = self.parser.parse(file_path)
        except Exception as e:
            logger.error(f"Failed to parse bank statement: {str(e)}")
            raise ValueError(f"Formato de archivo inválido o banco no soportado: {str(e)}")

        if not transactions:
            raise ValueError("El archivo no contiene transacciones válidas.")

        # 2. Persistir el BankStatement
        stmt = BankStatement(
            user_id=user_id,
            banco=bank_code,
            fecha_inicio=min(tx.fecha for tx in transactions),
            fecha_fin=max(tx.fecha for tx in transactions),
            saldo_inicial=transactions[0].saldo or Decimal('0'),
            saldo_final=transactions[-1].saldo or Decimal('0'),
            archivo_path=file_path,
            archivo_nombre=original_filename,
            estado=BankStatementStatus.PROCESSING,
            total_transacciones=len(transactions)
        )
        self.db.add(stmt)
        await self.db.flush() # Obtener ID

        # 3. Guardar transacciones individuales
        for tx in transactions:
            tx.bank_statement_id = stmt.id
            self.db.add(tx)
        
        await self.db.commit()

        # 4. Iniciar Batch de Conciliación
        batch = ReconciliationBatch(
            user_id=user_id,
            bank_statement_id=stmt.id,
            estado="pending",
            total_transacciones=len(transactions)
        )
        self.db.add(batch)
        await self.db.commit()
        await self.db.refresh(batch)

        return {
            "batch_id": batch.id,
            "statement_id": stmt.id,
            "bank": bank_name,
            "count": len(transactions)
        }

    async def run_reconciliation(self, batch_id: int):
        """
        Ejecuta el pipeline de conciliación para un lote.
        """
        batch = await self.db.get(ReconciliationBatch, batch_id)
        if not batch: return

        # Obtener datos necesarios
        result = await self.db.execute(
            select(BankTransaction).where(BankTransaction.bank_statement_id == batch.bank_statement_id)
        )
        bank_txs = result.scalars().all()

        result = await self.db.execute(
            select(Document).where(
                Document.user_id == batch.user_id,
                Document.document_type == "cfdi"
            )
        )
        cfdis = result.scalars().all()

        # Ejecutar Matching Engine para cada transacción
        exact_count = 0
        fuzzy_count = 0
        llm_count = 0
        
        for tx in bank_txs:
            match_result = matching_engine.find_match(tx, cfdis)
            if match_result:
                db_match = ReconciliationMatch(
                    bank_transaction_id=tx.id,
                    cfdi_id=match_result['document'].id,
                    match_type=match_result['status'],
                    confidence_score=match_result['score'],
                    match_details={'details': match_result['details']},
                    estado="pending" if match_result['score'] < 0.95 else "confirmed"
                )
                self.db.add(db_match)
                
                # Actualizar estatus en la transacción
                tx.match_status = match_result['status']
                tx.cfdi_id = match_result['document'].id
                tx.confidence_score = match_result['score']
                
                if match_result['status'] == "exact": exact_count += 1
                elif match_result['status'] == "fuzzy": fuzzy_count += 1
                elif match_result['status'] == "llm": llm_count += 1

        batch.total_matches_exact = exact_count
        batch.total_matches_fuzzy = fuzzy_count
        batch.total_matches_llm = llm_count
        batch.estado = "completed"
        batch.completed_at = datetime.utcnow()
        
        await self.db.commit()

async def get_banking_sync_service(db: AsyncSession = Depends(get_db)):
    return BankingSyncService(db)
