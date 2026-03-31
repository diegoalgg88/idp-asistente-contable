"""
Reconciliation API
Endpoints para conciliación bancaria

Endpoints:
- POST /v1/reconciliation/upload - Subir estado de cuenta
- GET /v1/reconciliation/batches/{batch_id} - Obtener estado de lote
- GET /v1/reconciliation/matches - Obtener matches
- POST /v1/reconciliation/matches/{match_id}/confirm - Confirmar match
- POST /v1/reconciliation/matches/{match_id}/reject - Rechazar match
- GET /v1/reconciliation/stats - Estadísticas de conciliación
"""

import asyncio
import logging
from pathlib import Path
from typing import List, Optional
from decimal import Decimal
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, Integer
from pydantic import BaseModel, Field

from app.db.database import get_async_db
from app.db.models import Document, User
from app.db.models_reconciliation import (
    BankStatement,
    BankTransaction,
    ReconciliationMatch,
    ReconciliationBatch,
    BankStatementStatus,
    MatchStatus
)
from app.core.security import get_current_user
from app.domain.reconciliation import (
    BankStatementParser,
    ExactMatchingEngine,
    FuzzyMatchingEngine,
    LLMValidationEngine
)

logger = logging.getLogger(__name__)

router = APIRouter()


# ============================================================================
# SCHEMAS (Pydantic Models)
# ============================================================================

class BankStatementUploadResponse(BaseModel):
    """Respuesta de upload de estado de cuenta"""
    batch_id: int
    bank_statement_id: int
    bank_name: str
    bank_code: str
    total_transactions: int
    estado: str = Field(alias="status")
    message: str

    class Config:
        populate_by_name = True


class BatchStatusResponse(BaseModel):
    """Estado de procesamiento de lote"""
    batch_id: int
    bank_statement_id: int
    estado: str = Field(alias="status")
    progreso: float = Field(alias="progress")
    total_transactions: int
    total_matches_exact: int
    total_matches_fuzzy: int
    total_matches_llm: int
    total_unmatched: int
    iniciado_en: Optional[datetime]
    completado_en: Optional[datetime]
    error_message: Optional[str]

    class Config:
        populate_by_name = True


class MatchResultResponse(BaseModel):
    """Resultado de match individual"""
    match_id: int
    bank_transaction_id: int
    cfdi_id: int
    tipo_match: str = Field(alias="match_type")  # exact, fuzzy, llm_confirmed, llm_review
    puntuacion_confianza: float = Field(alias="puntuacion_confianza")
    bank_fecha: datetime
    bank_concepto: str
    bank_monto: Decimal
    cfdi_fecha: Optional[datetime]
    cfdi_descripcion: Optional[str]
    cfdi_monto: Optional[Decimal]
    estado: str  # pending, confirmed, rejected
    llm_reason: Optional[str]
    llm_flags: Optional[List[str]]

    class Config:
        populate_by_name = True


class MatchConfirmRequest(BaseModel):
    """Request para confirmar match"""
    match_id: int


class MatchRejectRequest(BaseModel):
    """Request para rechazar match"""
    match_id: int
    reason: str


class ReconciliationStatsResponse(BaseModel):
    """Estadísticas de conciliación"""
    total_batches: int
    total_transactions: int
    total_matches: int
    match_rate: float
    exact_matches: int
    fuzzy_matches: int
    llm_matches: int
    human_review_matches: int
    unmatched_transactions: int


# ============================================================================
# ENDPOINTS - Upload y Procesamiento
# ============================================================================

@router.post("/upload", response_model=BankStatementUploadResponse)
async def upload_bank_statement(
    file: UploadFile = File(..., description="Archivo de estado de cuenta (CSV, XLSX)"),
    banco: Optional[str] = Form(None, description="Nombre del banco (opcional, se detecta automáticamente)"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Sube estado de cuenta bancario y procesa transacciones
    
    - **Archivo**: CSV, XLSX o XLS
    - **Banco**: Opcional, se detecta automáticamente si no se proporciona
    - **Procesamiento**: Asíncrono en background
    
    ## Bancos Soportados (15+)
    - BBVA, Santander, Banorte, Citibanamex
    - Scotiabank, HSBC, Inbursa, Banregio
    - Afirme, Bajío, BanCoppel, Azteca
    - BanCrédito, Multiva, Genérico
    """
    try:
        # Validar tipo de archivo
        allowed_extensions = ['.csv', '.xlsx', '.xls']
        file_ext = Path(file.filename).suffix.lower()
        
        if file_ext not in allowed_extensions:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Formato no soportado. Use: {', '.join(allowed_extensions)}"
            )
        
        # Validar tamaño (max 50MB)
        file_size = 0
        content = await file.read()
        file_size = len(content)
        
        if file_size > 50 * 1024 * 1024:  # 50MB
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Archivo muy grande. Máximo 50MB"
            )
        
        # Guardar archivo temporalmente
        import tempfile
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as tmp_file:
            tmp_file.write(content)
            tmp_ruta_archivo = tmp_file.name
        
        # Parsear estado de cuenta
        parser = BankStatementParser()
        transactions, banco_code, banco_nombre = parser.parse(tmp_ruta_archivo, banco)
        
        if not transactions:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No se encontraron transacciones en el archivo"
            )
        
        # Crear BankStatement
        bank_statement = BankStatement(
            user_id=current_user.id,
            banco=banco_code,
            fecha_inicio=min(tx.fecha for tx in transactions),
            fecha_fin=max(tx.fecha for tx in transactions),
            saldo_inicial=transactions[0].saldo if transactions[0].saldo else Decimal('0'),
            saldo_final=transactions[-1].saldo if transactions[-1].saldo else Decimal('0'),
            archivo_path=tmp_ruta_archivo,
            archivo_nombre=file.filename,
            archivo_size=file_size,
            estado=BankStatementStatus.PROCESSING,
            total_transacciones=len(transactions)
        )
        
        db.add(bank_statement)
        await db.commit()
        await db.refresh(bank_statement)
        
        # Crear BankTransactions
        db_transactions = []
        for tx in transactions:
            db_tx = BankTransaction(
                bank_statement_id=bank_statement.id,
                fecha=tx.fecha,
                fecha_valor=tx.fecha_valor,
                concepto=tx.concepto,
                concepto_limpio=tx.concepto_limpio,
                tipo=tx.tipo,
                monto=tx.monto,
                saldo=tx.saldo,
                referencia=tx.referencia,
                proveedor=tx.proveedor,
                rfc_proveedor=tx.rfc_proveedor,
                estado_match=tx.match_status
            )
            db_transactions.append(db_tx)
        
        db.add_all(db_transactions)
        await db.commit()
        
        # Crear ReconciliationBatch
        batch = ReconciliationBatch(
            user_id=current_user.id,
            bank_statement_id=bank_statement.id,
            estado="pending",
            total_transacciones=len(transactions)
        )
        
        db.add(batch)
        await db.commit()
        await db.refresh(batch)
        
        # Iniciar procesamiento en background
        asyncio.create_task(
            process_reconciliation_batch(batch.id, db)
        )
        
        # Verificar warnings del parser
        warnings = parser.get_warnings()
        errors = parser.get_errors()
        
        return BankStatementUploadResponse(
            batch_id=batch.id,
            bank_statement_id=bank_statement.id,
            bank_name=banco_nombre,
            bank_code=banco_code,
            total_transactions=len(transactions),
            status="processing",
            message=f"Estado de cuenta de {banco_nombre} procesado. {len(transactions)} transacciones. Warnings: {len(warnings)}, Errors: {len(errors)}"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error en upload: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error procesando archivo: {str(e)}"
        )


async def process_reconciliation_batch(batch_id: int, db: AsyncSession):
    """
    Procesa lote de conciliación en background
    
    Ejecuta las 3 capas de matching:
    1. Exact Matching
    2. Fuzzy Matching
    3. LLM Validation
    """
    try:
        # Obtener batch
        batch = await db.get(ReconciliationBatch, batch_id)
        if not batch:
            logger.error(f"Batch {batch_id} no encontrado")
            return
        
        # Actualizar estado
        batch.estado = "processing"
        batch.iniciado_en = datetime.utcnow()
        await db.commit()
        
        # Obtener transacciones del batch
        result = await db.execute(
            select(BankTransaction).where(
                BankTransaction.bank_statement_id == batch.bank_statement_id
            )
        )
        bank_transactions = result.scalars().all()
        
        # Obtener CFDIs del usuario
        result = await db.execute(
            select(Document).where(
                Document.user_id == batch.user_id,
                Document.document_type == "cfdi"
            )
        )
        cfdi_documents = result.scalars().all()
        
        logger.info(f"Procesando {len(bank_transactions)} transacciones con {len(cfdi_documents)} CFDIs")
        
        # CAPA 1: Exact Matching
        exact_engine = ExactMatchingEngine()
        exact_matches, remaining_txs = exact_engine.match(bank_transactions, cfdi_documents)
        
        # Guardar matches exactos
        for match_result in exact_matches:
            db_match = ReconciliationMatch(
                bank_transaction_id=match_result.bank_transaction.id,
                cfdi_id=match_result.cfdi.id,
                tipo_match=match_result.match_type,
                puntuacion_confianza=match_result.puntuacion_confianza,
                match_details=match_result.match_details,
                estado="confirmed"
            )
            db.add(db_match)
            
            # Actualizar transacción
            match_result.bank_transaction.estado_match = MatchStatus.EXACT
            match_result.bank_transaction.puntuacion_confianza = match_result.puntuacion_confianza
        
        await db.commit()
        
        batch.total_matches_exact = len(exact_matches)
        batch.progreso = 33.0
        await db.commit()
        
        logger.info(f"Exact matching: {len(exact_matches)} matches")
        
        # CAPA 2: Fuzzy Matching
        fuzzy_engine = FuzzyMatchingEngine()
        exact_match_ids = [tx.id for tx, _ in exact_matches]
        fuzzy_matches, remaining_txs = fuzzy_engine.match(
            remaining_txs,
            cfdi_documents,
            exact_match_ids
        )
        
        # Guardar matches fuzzy (alto confianza)
        for match_result in fuzzy_matches:
            if match_result.puntuacion_confianza >= fuzzy_engine.THRESHOLD_FUZZY_HIGH:
                estado = "confirmed"
            else:
                estado = "pending"  # Requiere LLM o revisión humana
            
            db_match = ReconciliationMatch(
                bank_transaction_id=match_result.bank_transaction.id,
                cfdi_id=match_result.cfdi.id,
                tipo_match=match_result.match_type,
                puntuacion_confianza=match_result.puntuacion_confianza,
                match_details=match_result.match_details,
                estado=estado
            )
            db.add(db_match)
            
            # Actualizar transacción
            match_result.bank_transaction.estado_match = (
                MatchStatus.FUZZY if estado == "confirmed"
                else MatchStatus.LLM
            )
            match_result.bank_transaction.puntuacion_confianza = match_result.puntuacion_confianza
        
        await db.commit()
        
        batch.total_matches_fuzzy = len(fuzzy_matches)
        batch.progreso = 66.0
        await db.commit()
        
        logger.info(f"Fuzzy matching: {len(fuzzy_matches)} matches")
        
        # CAPA 3: LLM Validation (para fuzzy de confianza media)
        llm_matches_to_validate = [
            m for m in fuzzy_matches
            if m.puntuacion_confianza < fuzzy_engine.THRESHOLD_FUZZY_HIGH
            and m.puntuacion_confianza >= fuzzy_engine.THRESHOLD_FUZZY_MEDIUM
        ]
        
        if llm_matches_to_validate:
            llm_engine = LLMValidationEngine()
            llm_confirmed, llm_rejected = await llm_engine.validate_matches(llm_matches_to_validate)
            
            # Actualizar matches confirmados por LLM
            for match_result in llm_confirmed:
                # Actualizar ReconciliationMatch existente
                result = await db.execute(
                    select(ReconciliationMatch).where(
                        ReconciliationMatch.bank_transaction_id == match_result.bank_transaction.id
                    )
                )
                db_match = result.scalar_one_or_none()
                
                if db_match:
                    db_match.tipo_match = match_result.match_type
                    db_match.puntuacion_confianza = match_result.puntuacion_confianza
                    db_match.match_details.update(match_result.match_details)
                    
                    if match_result.match_type == 'llm_confirmed':
                        db_match.estado = "confirmed"
                        match_result.bank_transaction.estado_match = MatchStatus.LLM
                    else:
                        db_match.estado = "pending"  # Revisión humana
                        match_result.bank_transaction.estado_match = MatchStatus.HUMAN_REVIEW
            
            await db.commit()
            
            batch.total_matches_llm = len(llm_confirmed)
        
        batch.progreso = 100.0
        batch.estado = "completed"
        batch.completado_en = datetime.utcnow()
        batch.total_unmatched = len(remaining_txs) - len(llm_rejected) if 'llm_rejected' in locals() else len(remaining_txs)
        
        await db.commit()
        
        logger.info(f"Batch {batch_id} completado: {batch.total_matches_exact} exact, {batch.total_matches_fuzzy} fuzzy, {batch.total_matches_llm} LLM")
        
    except Exception as e:
        logger.error(f"Error procesando batch {batch_id}: {e}")
        
        # Actualizar batch con error
        batch = await db.get(ReconciliationBatch, batch_id)
        if batch:
            batch.estado = "failed"
            batch.mensaje_error = str(e)
            await db.commit()


# ============================================================================
# ENDPOINTS - Consultas
# ============================================================================

@router.get("/batches/{batch_id}", response_model=BatchStatusResponse)
async def get_batch_status(
    batch_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Obtiene estado de procesamiento de lote
    
    - **batch_id**: ID del lote
    - **Progreso**: 0-100%
    - **Estados**: pending, processing, completed, failed
    """
    batch = await db.get(ReconciliationBatch, batch_id)
    
    if not batch:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lote {batch_id} no encontrado"
        )
    
    # Verificar permisos
    if batch.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para ver este lote"
        )
    
    return BatchStatusResponse(
        batch_id=batch.id,
        bank_statement_id=batch.bank_statement_id,
        status=batch.estado,
        progress=batch.progreso,
        total_transactions=batch.total_transacciones,
        total_matches_exact=batch.total_matches_exact,
        total_matches_fuzzy=batch.total_matches_fuzzy,
        total_matches_llm=batch.total_matches_llm,
        total_unmatched=batch.total_unmatched,
        iniciado_en=batch.iniciado_en,
        completado_en=batch.completado_en,
        error_message=batch.mensaje_error
    )


@router.get("/matches", response_model=List[MatchResultResponse])
async def get_matches(
    batch_id: int,
    match_type: Optional[str] = Query(None, description="Filtrar por tipo: exact, fuzzy, llm_confirmed, llm_review"),
    estado: Optional[str] = Query(None, description="Filtrar por estado: pending, confirmed, rejected"),
    confidence_min: Optional[float] = Query(0.0, description="Confianza mínima"),
    limit: Optional[int] = Query(100, description="Límite de resultados"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Obtiene matches de conciliación con filtros
    
    - **batch_id**: ID del lote
    - **match_type**: exact, fuzzy, llm_confirmed, llm_review
    - **estado**: pending, confirmed, rejected
    - **confidence_min**: Confianza mínima (0.0-1.0)
    - **limit**: Máximo de resultados (default 100)
    """
    # Verificar que el batch existe y pertenece al usuario
    batch = await db.get(ReconciliationBatch, batch_id)
    
    if not batch:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lote {batch_id} no encontrado"
        )
    
    if batch.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para ver este lote"
        )
    
    # Construir query
    query = select(ReconciliationMatch).join(
        BankTransaction,
        ReconciliationMatch.bank_transaction_id == BankTransaction.id
    ).where(
        BankTransaction.bank_statement_id == batch.bank_statement_id
    )
    
    # Aplicar filtros
    if match_type:
        query = query.where(ReconciliationMatch.match_type == match_type)
    
    if estado:
        query = query.where(ReconciliationMatch.estado == estado)
    
    if confidence_min:
        query = query.where(ReconciliationMatch.puntuacion_confianza >= confidence_min)
    
    query = query.limit(limit)
    
    result = await db.execute(query)
    matches = result.scalars().all()
    
    # Convertir a response
    response = []
    for match in matches:
        bank_tx = match.bank_transaction
        cfdi = match.cfdi
        
        response.append(MatchResultResponse(
            match_id=match.id,
            bank_transaction_id=match.bank_transaction_id,
            cfdi_id=match.cfdi_id,
            match_type=match.tipo_match,
            puntuacion_confianza=float(match.puntuacion_confianza),
            bank_fecha=bank_tx.fecha,
            bank_concepto=bank_tx.concepto,
            bank_monto=bank_tx.monto,
            cfdi_fecha=cfdi.datos_extraidos.get('fecha') if cfdi.datos_extraidos else None,
            cfdi_descripcion=cfdi.datos_extraidos.get('descripcion') if cfdi.datos_extraidos else None,
            cfdi_monto=cfdi.datos_extraidos.get('total') if cfdi.datos_extraidos else None,
            estado=match.estado,
            llm_reason=match.match_details.get('llm_reason') if 'llm_reason' in match.match_details else None,
            llm_flags=match.match_details.get('llm_flags') if 'llm_flags' in match.match_details else None
        ))
    
    return response


# ============================================================================
# ENDPOINTS - Acciones
# ============================================================================

@router.post("/matches/{match_id}/confirm")
async def confirm_match(
    match_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Confirma match de conciliación (humano en el loop)
    
    - **match_id**: ID del match a confirmar
    - **Requiere**: Autenticación
    """
    match = await db.get(ReconciliationMatch, match_id)
    
    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Match {match_id} no encontrado"
        )
    
    # Confirmar match
    match.estado = "confirmed"
    match.confirmado_por = current_user.id
    match.confirmado_at = datetime.utcnow()
    
    # Actualizar transacción
    bank_tx = match.bank_transaction
    bank_tx.estado_match = MatchStatus.CONFIRMED
    bank_tx.revisado_por = current_user.id
    bank_tx.revisado_at = datetime.utcnow()
    
    await db.commit()
    
    return {
        "message": "Match confirmado exitosamente",
        "match_id": match_id,
        "estado": "confirmed"
    }


@router.post("/matches/{match_id}/reject")
async def reject_match(
    match_id: int,
    reason: str = Form(..., description="Razón del rechazo"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Rechaza match de conciliación
    
    - **match_id**: ID del match a rechazar
    - **reason**: Razón del rechazo (requerido)
    """
    match = await db.get(ReconciliationMatch, match_id)
    
    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Match {match_id} no encontrado"
        )
    
    # Rechazar match
    match.estado = "rejected"
    match.rechazo_razon = reason
    match.confirmado_por = current_user.id
    match.confirmado_at = datetime.utcnow()
    
    # Actualizar transacción
    bank_tx = match.bank_transaction
    bank_tx.estado_match = MatchStatus.REJECTED
    bank_tx.revisado_por = current_user.id
    bank_tx.revisado_at = datetime.utcnow()
    
    await db.commit()
    
    return {
        "message": "Match rechazado exitosamente",
        "match_id": match_id,
        "estado": "rejected",
        "razon": reason
    }


# ============================================================================
# ENDPOINTS - Estadísticas
# ============================================================================

@router.get("/stats", response_model=ReconciliationStatsResponse)
async def get_reconciliation_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Obtiene estadísticas de conciliación del usuario
    
    Retorna:
    - Total de batches
    - Total de transacciones
    - Total de matches y match rate
    - Desglose por tipo de match
    """
    # Total batches
    result = await db.execute(
        select(func.count(ReconciliationBatch.id)).where(
            ReconciliationBatch.user_id == current_user.id
        )
    )
    total_batches = result.scalar() or 0
    
    # Total transacciones
    result = await db.execute(
        select(func.sum(ReconciliationBatch.total_transacciones)).where(
            ReconciliationBatch.user_id == current_user.id
        )
    )
    total_transactions = result.scalar() or 0
    
    # Total matches por tipo
    result = await db.execute(
        select(
            func.sum(func.cast(ReconciliationMatch.tipo_match == 'exact', Integer)),
            func.sum(func.cast(ReconciliationMatch.tipo_match == 'fuzzy', Integer)),
            func.sum(func.cast(ReconciliationMatch.tipo_match.like('llm%'), Integer)),
            func.sum(func.cast(ReconciliationMatch.tipo_match == 'human_review', Integer))
        ).join(
            BankTransaction,
            ReconciliationMatch.bank_transaction_id == BankTransaction.id
        ).join(
            BankStatement,
            BankTransaction.bank_statement_id == BankStatement.id
        ).where(
            BankStatement.user_id == current_user.id
        )
    )
    
    row = result.first()
    exact_matches = row[0] or 0
    fuzzy_matches = row[1] or 0
    llm_matches = row[2] or 0
    human_review_matches = row[3] or 0
    
    total_matches = exact_matches + fuzzy_matches + llm_matches
    
    # Match rate
    match_rate = (total_matches / total_transactions * 100) if total_transactions > 0 else 0.0
    
    # Unmatched
    unmatched_transactions = total_transactions - total_matches
    
    return ReconciliationStatsResponse(
        total_batches=total_batches,
        total_transactions=total_transactions,
        total_matches=total_matches,
        match_rate=match_rate,
        exact_matches=exact_matches,
        fuzzy_matches=fuzzy_matches,
        llm_matches=llm_matches,
        human_review_matches=human_review_matches,
        unmatched_transactions=unmatched_transactions
    )
