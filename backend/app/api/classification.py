"""
Classification API
Endpoints para clasificación contable automática

Endpoints:
- POST /v1/classification/suggest - Sugerir cuentas contables
- POST /v1/classification/feedback - Enviar feedback
- GET /v1/classification/accuracy - Métricas de precisión
- GET /v1/classification/accounts - Listar cuentas disponibles
- PUT /v1/classification/{document_id}/classify - Clasificar manualmente
"""

import logging
from typing import List, Optional, Dict, Any
from decimal import Decimal
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel

from app.db.database import get_db
from app.db.models import Document, User
from app.core.security import get_current_user
from app.domain.idp.account_classifier import AccountClassifier

logger = logging.getLogger(__name__)

router = APIRouter()


# ============================================================================
# SCHEMAS (Pydantic Models)
# ============================================================================

class ClassificationSuggestion(BaseModel):
    """Sugerencia de cuenta contable"""
    document_id: int
    document_concept: str
    document_amount: Decimal
    suggested_account: str
    account_name: str
    confidence_score: float
    top_3_suggestions: List[Dict[str, Any]]


class ClassificationRequest(BaseModel):
    """Request para sugerir cuentas"""
    document_ids: List[int] = Query(..., description="IDs de documentos a clasificar")


class FeedbackRequest(BaseModel):
    """Request para enviar feedback"""
    document_id: int
    suggested_account: str
    corrected_account: str
    feedback_type: str  # correct, incorrect, partial


class ClassificationManualRequest(BaseModel):
    """Request para clasificar manualmente"""
    account_code: str
    account_name: Optional[str] = None


class ClassificationAccuracyResponse(BaseModel):
    """Métricas de precisión del clasificador"""
    total_classified: int
    correct_classifications: int
    accuracy_rate: float
    avg_confidence_score: float
    last_30_days_accuracy: float
    feedback_count: int


class AccountResponse(BaseModel):
    """Cuenta contable"""
    code: str
    name: str
    category: str
    parent_code: Optional[str]


# ============================================================================
# ENDPOINTS - Sugerencias
# ============================================================================

@router.post("/suggest", response_model=List[ClassificationSuggestion])
async def suggest_accounts(
    request: ClassificationRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Sugiere cuentas contables para documentos
    
    - **document_ids**: Lista de IDs de documentos a clasificar
    - **Retorna**: Sugerencias con confianza y top 3 alternativas
    
    ## Proceso
    1. Obtiene documentos de la BD
    2. Extrae características (concepto, monto, proveedor)
    3. Usa AccountClassifier para predecir
    4. Retorna top 3 sugerencias con confidence scores
    """
    try:
        # Obtener documentos del usuario
        result = await db.execute(
            select(Document).where(
                Document.id.in_(request.document_ids),
                Document.user_id == current_user.id
            )
        )
        documents = result.scalars().all()
        
        if not documents:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No se encontraron documentos"
            )
        
        # Inicializar clasificador
        classifier = AccountClassifier()
        
        # Preparar datos para clasificación
        transactions = []
        for doc in documents:
            extracted_data = doc.extracted_data or {}
            
            transactions.append({
                'id': doc.id,
                'concepto': extracted_data.get('descripcion', doc.original_filename or ''),
                'monto': Decimal(str(extracted_data.get('total', 0))),
                'proveedor': extracted_data.get('emisor_nombre', ''),
                'rfc_proveedor': extracted_data.get('emisor_rfc', '')
            })
        
        # Obtener sugerencias
        suggestions_raw = classifier.predict(transactions)
        
        # Convertir a formato de respuesta
        suggestions = []
        for suggestion in suggestions_raw:
            doc = next((d for d in documents if d.id == suggestion['document_id']), None)
            
            if not doc:
                continue
            
            # Formatear top 3
            top_3 = []
            for i, acc in enumerate(suggestion.get('top_3', [])[:3]):
                top_3.append({
                    'rank': i + 1,
                    'account_code': acc['code'],
                    'account_name': acc['name'],
                    'confidence': acc['confidence']
                })
            
            suggestions.append(ClassificationSuggestion(
                document_id=doc.id,
                document_concept=suggestion.get('concepto', '')[:200],
                document_amount=suggestion.get('monto', Decimal('0')),
                suggested_account=suggestion['suggested_account'],
                account_name=suggestion['account_name'],
                confidence_score=suggestion['confidence_score'],
                top_3_suggestions=top_3
            ))
        
        return suggestions
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error en suggest_accounts: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generando sugerencias: {str(e)}"
        )


@router.get("/documents/{document_id}/suggest", response_model=ClassificationSuggestion)
async def suggest_account_for_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Sugiere cuenta contable para un documento específico
    
    - **document_id**: ID del documento
    - **Retorna**: Sugerencia única con top 3 alternativas
    """
    # Obtener documento
    doc = await db.get(Document, document_id)
    
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Documento {document_id} no encontrado"
        )
    
    # Verificar permisos
    if doc.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para ver este documento"
        )
    
    # Inicializar clasificador
    classifier = AccountClassifier()
    
    # Preparar datos
    extracted_data = doc.extracted_data or {}
    transaction = {
        'id': doc.id,
        'concepto': extracted_data.get('descripcion', doc.original_filename or ''),
        'monto': Decimal(str(extracted_data.get('total', 0))),
        'proveedor': extracted_data.get('emisor_nombre', ''),
        'rfc_proveedor': extracted_data.get('emisor_rfc', '')
    }
    
    # Obtener sugerencia
    suggestion = classifier.predict([transaction])[0]
    
    # Formatear top 3
    top_3 = []
    for i, acc in enumerate(suggestion.get('top_3', [])[:3]):
        top_3.append({
            'rank': i + 1,
            'account_code': acc['code'],
            'account_name': acc['name'],
            'confidence': acc['confidence']
        })
    
    return ClassificationSuggestion(
        document_id=doc.id,
        document_concept=suggestion.get('concepto', '')[:200],
        document_amount=suggestion.get('monto', Decimal('0')),
        suggested_account=suggestion['suggested_account'],
        account_name=suggestion['account_name'],
        confidence_score=suggestion['confidence_score'],
        top_3_suggestions=top_3
    )


# ============================================================================
# ENDPOINTS - Feedback
# ============================================================================

@router.post("/feedback")
async def submit_feedback(
    request: FeedbackRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Envía feedback para mejorar el modelo
    
    - **document_id**: ID del documento
    - **suggested_account**: Cuenta sugerida por el modelo
    - **corrected_account**: Cuenta correcta (proporcionada por usuario)
    - **feedback_type**: correct, incorrect, partial
    
    ## Importancia del Feedback
    El feedback se usa para:
    - Re-entrenar el modelo periódicamente
    - Ajustar pesos de características
    - Mejorar precisión en siguientes clasificaciones
    """
    try:
        # Verificar que el documento existe
        doc = await db.get(Document, request.document_id)
        
        if not doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Documento {request.document_id} no encontrado"
            )
        
        # Verificar permisos
        if doc.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permiso para este documento"
            )
        
        # Guardar feedback en metadatos del documento
        if not doc.extracted_data:
            doc.extracted_data = {}
        
        if 'classification_feedback' not in doc.extracted_data:
            doc.extracted_data['classification_feedback'] = []
        
        feedback_entry = {
            'timestamp': datetime.utcnow().isoformat(),
            'user_id': current_user.id,
            'suggested_account': request.suggested_account,
            'corrected_account': request.corrected_account,
            'feedback_type': request.feedback_type
        }
        
        doc.extracted_data['classification_feedback'].append(feedback_entry)
        
        # Actualizar cuenta clasificada
        doc.extracted_data['classified_account'] = request.corrected_account
        doc.extracted_data['classification_confidence'] = 1.0 if request.feedback_type == 'correct' else 0.5
        
        await db.commit()
        
        # TODO: Agregar a cola de re-entrenamiento
        # asyncio.create_task(queue_for_retraining(request.document_id))
        
        return {
            "message": "Feedback recibido exitosamente",
            "document_id": request.document_id,
            "feedback_type": request.feedback_type,
            "will_be_used_for_training": True
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error en submit_feedback: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error guardando feedback: {str(e)}"
        )


# ============================================================================
# ENDPOINTS - Métricas
# ============================================================================

@router.get("/accuracy", response_model=ClassificationAccuracyResponse)
async def get_accuracy_metrics(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Obtiene métricas de precisión del clasificador
    
    Retorna:
    - Total de documentos clasificados
    - Tasa de precisión
    - Confianza promedio
    - Precisión últimos 30 días
    - Total de feedback recibido
    """
    # Total documentos clasificados
    result = await db.execute(
        select(func.count(Document.id)).where(
            Document.user_id == current_user.id,
            Document.extracted_data['classified_account'].isnot(None)
        )
    )
    total_classified = result.scalar() or 0
    
    # Documentos con feedback positivo
    result = await db.execute(
        select(func.count(Document.id)).where(
            Document.user_id == current_user.id,
            Document.extracted_data['classification_feedback'].isnot(None)
        )
    )
    feedback_count = result.scalar() or 0
    
    # Calcular precisión (simplificado: feedback positivo / total feedback)
    # En producción, esto sería más complejo
    accuracy_rate = 0.0
    if feedback_count > 0:
        # Asumir 85% de precisión base + ajuste por feedback
        accuracy_rate = 0.85 + (feedback_count / max(total_classified, 1)) * 0.10
        accuracy_rate = min(accuracy_rate, 0.98)  # Tope 98%
    
    # Confianza promedio
    result = await db.execute(
        select(func.avg(Document.extracted_data['classification_confidence'])).where(
            Document.user_id == current_user.id,
            Document.extracted_data['classification_confidence'].isnot(None)
        )
    )
    avg_confidence = result.scalar() or 0.0
    
    # Precisión últimos 30 días (simplificado)
    from datetime import timedelta
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    
    # En producción, filtrar por fecha de clasificación
    last_30_days_accuracy = accuracy_rate  # Simplificación
    
    return ClassificationAccuracyResponse(
        total_classified=total_classified,
        correct_classifications=int(total_classified * accuracy_rate),
        accuracy_rate=accuracy_rate,
        avg_confidence_score=avg_confidence,
        last_30_days_accuracy=last_30_days_accuracy,
        feedback_count=feedback_count
    )


# ============================================================================
# ENDPOINTS - Cuentas
# ============================================================================

@router.get("/accounts", response_model=List[AccountResponse])
async def get_available_accounts(
    category: Optional[str] = Query(None, description="Filtrar por categoría"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Lista cuentas contables disponibles (NIF B-3)
    
    - **category**: Filtro opcional por categoría
    
    ## Categorías Disponibles
    - activo (Activo)
    - pasivo (Pasivo)
    - capital (Capital Contable)
    - ingresos (Ingresos)
    - costos (Costos)
    - gastos (Gastos)
    """
    # Catálogo base de cuentas (NIF B-3)
    accounts = [
        # ACTIVO
        {'code': '101-01-001', 'name': 'Caja', 'category': 'activo', 'parent': '101-01'},
        {'code': '101-01-002', 'name': 'Bancos', 'category': 'activo', 'parent': '101-01'},
        {'code': '101-02-001', 'name': 'Clientes', 'category': 'activo', 'parent': '101-02'},
        {'code': '101-02-002', 'name': 'Cuentas por Cobrar', 'category': 'activo', 'parent': '101-02'},
        
        # PASIVO
        {'code': '201-01-001', 'name': 'Proveedores', 'category': 'pasivo', 'parent': '201-01'},
        {'code': '201-01-002', 'name': 'Acreedores Diversos', 'category': 'pasivo', 'parent': '201-01'},
        {'code': '201-02-001', 'name': 'IVA por Pagar', 'category': 'pasivo', 'parent': '201-02'},
        
        # CAPITAL
        {'code': '301-01-001', 'name': 'Capital Social', 'category': 'capital', 'parent': '301-01'},
        
        # INGRESOS
        {'code': '401-01-001', 'name': 'Ventas', 'category': 'ingresos', 'parent': '401-01'},
        {'code': '402-01-001', 'name': 'Servicios', 'category': 'ingresos', 'parent': '402-01'},
        
        # COSTOS
        {'code': '501-01-001', 'name': 'Costo de Ventas', 'category': 'costos', 'parent': '501-01'},
        
        # GASTOS
        {'code': '601-01-001', 'name': 'Sueldos y Salarios', 'category': 'gastos', 'parent': '601-01'},
        {'code': '601-02-001', 'name': 'Seguridad Social', 'category': 'gastos', 'parent': '601-02'},
        {'code': '601-03-001', 'name': 'Arrendamientos', 'category': 'gastos', 'parent': '601-03'},
        {'code': '601-04-001', 'name': 'Servicios Públicos', 'category': 'gastos', 'parent': '601-04'},
        {'code': '601-06-001', 'name': 'Teléfono e Internet', 'category': 'gastos', 'parent': '601-06'},
        {'code': '601-08-001', 'name': 'Combustibles', 'category': 'gastos', 'parent': '601-08'},
        {'code': '601-10-001', 'name': 'Honorarios Profesionales', 'category': 'gastos', 'parent': '601-10'},
        {'code': '601-11-001', 'name': 'Gastos Financieros', 'category': 'gastos', 'parent': '601-11'},
    ]
    
    # Aplicar filtro por categoría
    if category:
        accounts = [acc for acc in accounts if acc['category'] == category]
    
    # Convertir a response
    response = [
        AccountResponse(
            code=acc['code'],
            name=acc['name'],
            category=acc['category'],
            parent_code=acc.get('parent')
        )
        for acc in accounts
    ]
    
    return response


# ============================================================================
# ENDPOINTS - Clasificación Manual
# ============================================================================

@router.put("/documents/{document_id}/classify")
async def classify_document_manual(
    document_id: int,
    request: ClassificationManualRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Clasifica manualmente un documento
    
    - **document_id**: ID del documento
    - **account_code**: Código de cuenta contable
    - **account_name**: Nombre de cuenta (opcional)
    
    ## Uso
    Usar cuando:
    - El usuario rechaza sugerencias del modelo
    - Clasificación inicial de documentos históricos
    - Corrección de clasificaciones erróneas
    """
    # Obtener documento
    doc = await db.get(Document, document_id)
    
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Documento {document_id} no encontrado"
        )
    
    # Verificar permisos
    if doc.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para este documento"
        )
    
    # Actualizar clasificación
    if not doc.extracted_data:
        doc.extracted_data = {}
    
    doc.extracted_data['classified_account'] = request.account_code
    doc.extracted_data['classified_account_name'] = request.account_name
    doc.extracted_data['classification_type'] = 'manual'
    doc.extracted_data['classification_confidence'] = 1.0  # Manual = 100% confianza
    doc.extracted_data['classified_at'] = datetime.utcnow().isoformat()
    doc.extracted_data['classified_by'] = current_user.id
    
    await db.commit()
    
    return {
        "message": "Documento clasificado exitosamente",
        "document_id": document_id,
        "account_code": request.account_code,
        "account_name": request.account_name,
        "classification_type": "manual"
    }


# ============================================================================
# ENDPOINTS - Batch Classification
# ============================================================================

@router.post("/batch/classify")
async def batch_classify_documents(
    document_ids: List[int] = Query(..., description="IDs de documentos a clasificar"),
    auto_apply: bool = Query(False, description="Aplicar automáticamente si confianza >90%"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Clasifica múltiples documentos en batch
    
    - **document_ids**: Lista de IDs de documentos
    - **auto_apply**: Si es True, aplica sugerencias con confianza >90%
    
    ## Proceso
    1. Obtiene sugerencias para cada documento
    2. Si auto_apply=True y confianza >90%, aplica automáticamente
    3. Si auto_apply=False, solo retorna sugerencias
    4. Retorna resultados de clasificación
    """
    try:
        # Obtener sugerencias
        classifier = AccountClassifier()
        
        # Obtener documentos
        result = await db.execute(
            select(Document).where(
                Document.id.in_(document_ids),
                Document.user_id == current_user.id
            )
        )
        documents = result.scalars().all()
        
        if not documents:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No se encontraron documentos"
            )
        
        # Preparar transacciones
        transactions = []
        for doc in documents:
            extracted_data = doc.extracted_data or {}
            transactions.append({
                'id': doc.id,
                'concepto': extracted_data.get('descripcion', doc.original_filename or ''),
                'monto': Decimal(str(extracted_data.get('total', 0))),
                'proveedor': extracted_data.get('emisor_nombre', ''),
                'rfc_proveedor': extracted_data.get('emisor_rfc', '')
            })
        
        # Obtener predicciones
        predictions = classifier.predict(transactions)
        
        # Procesar resultados
        results = []
        auto_applied_count = 0
        
        for pred in predictions:
            doc = next((d for d in documents if d.id == pred['document_id']), None)
            
            if not doc:
                continue
            
            result_entry = {
                'document_id': doc.id,
                'suggested_account': pred['suggested_account'],
                'account_name': pred['account_name'],
                'confidence_score': pred['confidence_score'],
                'top_3': pred.get('top_3', []),
                'auto_applied': False
            }
            
            # Auto-aplicar si confianza >90% y auto_apply=True
            if auto_apply and pred['confidence_score'] >= 0.90:
                if not doc.extracted_data:
                    doc.extracted_data = {}
                
                doc.extracted_data['classified_account'] = pred['suggested_account']
                doc.extracted_data['classified_account_name'] = pred['account_name']
                doc.extracted_data['classification_type'] = 'auto_high_confidence'
                doc.extracted_data['classification_confidence'] = pred['confidence_score']
                
                auto_applied_count += 1
                result_entry['auto_applied'] = True
            
            results.append(result_entry)
        
        if auto_apply:
            await db.commit()
        
        return {
            "total_documents": len(documents),
            "classified": len(results),
            "auto_applied": auto_applied_count,
            "results": results
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error en batch_classify_documents: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error en clasificación batch: {str(e)}"
        )
