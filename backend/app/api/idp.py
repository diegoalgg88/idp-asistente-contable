"""
IDP (Intelligent Document Processing) Endpoints
Endpoints para procesamiento inteligente de documentos contables.

Endpoints disponibles:
- POST /v1/idp/process - Procesar documento individual
- POST /v1/idp/batch-process - Procesamiento masivo de documentos
- GET /v1/idp/{document_id} - Obtener estado de procesamiento
"""

import os
import uuid
import shutil
from datetime import datetime
from typing import List, Optional, Dict, Any
from pathlib import Path
import asyncio
import io
import pandas as pd

from fastapi import APIRouter, HTTPException, UploadFile, File, Depends, BackgroundTasks, Query
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.database import get_async_db
from app.db.models import Document, User
from app.infrastructure.ai.nvidia_nim import NIMExtractionService, process_batch_async
from app.core.config import settings
from app.core.security import get_current_user


router = APIRouter()


# =============================================================================
# REQUEST/RESPONSE MODELS
# =============================================================================

class DocumentProcessingRequest(BaseModel):
    """Request model for document processing"""
    document_type: str = Field(..., description="Tipo de documento (factura, recibo, estado_cuenta, etc.)")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Metadatos adicionales")


class DocumentProcessingResponse(BaseModel):
    """Response model for document processing"""
    document_id: str
    estado: str = Field(alias="status")
    datos_extraidos: Optional[Dict[str, Any]] = None
    puntuacion_confianza: Optional[float] = Field(None, alias="puntuacion_confianza")
    latency: Optional[float] = None
    message: str

    class Config:
        populate_by_name = True


class DocumentStatusResponse(BaseModel):
    """Response model for document status"""
    document_id: str
    estado: str = Field(alias="status")
    tipo_documento: str = Field(alias="document_type")
    created_at: datetime
    updated_at: datetime
    datos_extraidos: Optional[Dict[str, Any]] = None
    puntuacion_confianza: Optional[float] = Field(None, alias="puntuacion_confianza")
    error_message: Optional[str] = None

    class Config:
        populate_by_name = True


class BatchProcessRequest(BaseModel):
    """Request model for batch processing"""
    document_type: str = Field(..., description="Tipo de documento")
    max_workers: int = Field(default=4, ge=1, le=10, description="Número de workers paralelos")


class BatchProcessResponse(BaseModel):
    """Response model for batch processing"""
    batch_id: str
    total_documents: int
    estado: str = Field(alias="status")
    message: str
    estimated_time: Optional[str] = None

    class Config:
        populate_by_name = True


# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def save_uploaded_file(file: UploadFile, upload_dir: Optional[str] = None) -> str:
    """
    Guarda un archivo subido y retorna su ruta.

    Args:
        file: Archivo subido
        upload_dir: Directorio de destino (default: settings.UPLOAD_DIR)

    Returns:
        str: Ruta del archivo guardado
    """
    if upload_dir is None:
        upload_dir = settings.UPLOAD_DIR

    # Crear directorio si no existe
    os.makedirs(upload_dir, exist_ok=True)

    # Generar nombre único
    file_extension = Path(file.filename).suffix if file.filename else ".pdf"
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    ruta_archivo = os.path.join(upload_dir, unique_filename)

    # Guardar archivo
    with open(ruta_archivo, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return ruta_archivo


def extract_entities_from_result(result: Dict[str, Any]) -> Dict[str, Any]:
    """
    Extrae entidades del resultado del servicio NVIDIA.

    Args:
        result: Resultado del procesamiento

    Returns:
        Dict[str, Any]: Entidades extraídas
    """
    entity_extraction = result.get("steps", {}).get("entity_extraction", {})
    return entity_extraction.get("entities", {})


def calculate_puntuacion_confianza(result: Dict[str, Any]) -> float:
    """
    Calcula score de confianza basado en el resultado.

    Args:
        result: Resultado del procesamiento

    Returns:
        float: Score de confianza (0-1)
    """
    if result.get("status") != "success":
        return 0.0

    entities = extract_entities_from_result(result)
    
    # Calcular confianza basada en campos completados
    required_fields = ["rfc_emisor", "rfc_receptor", "uuid", "total"]
    completed_fields = sum(1 for field in required_fields if entities.get(field))
    
    base_confidence = completed_fields / len(required_fields)
    
    # Ajustar por latencia (mejor latencia = mayor confianza)
    latency = result.get("total_latency", 10)
    latency_factor = min(1.0, 10.0 / latency) if latency > 0 else 1.0
    
    return round(float(base_confidence * 0.8 + latency_factor * 0.2), 2)


# =============================================================================
# ENDPOINTS
# =============================================================================

@router.post("/process", response_model=DocumentProcessingResponse)
async def process_document(
    document_type: str = Query(..., description="Tipo de documento (factura, recibo, estado_cuenta, etc.)"),
    file: UploadFile = File(..., description="Archivo del documento (PDF, imagen)"),
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user),
) -> DocumentProcessingResponse:
    """
    Procesa un documento contable (factura, recibo, estado_cuenta, etc.)

    - **document_type**: Tipo de documento
    - **file**: Archivo del documento (PDF, PNG, JPG)

    El documento se procesa usando NVIDIA NIM Vision para extraer:
    - RFC del emisor
    - RFC del receptor
    - UUID del CFDI
    - Montos (total, subtotal)
    - Fecha de emisión

    Returns:
        DocumentProcessingResponse: Resultado del procesamiento
    """
    # Validar extensión del archivo
    file_extension = Path(file.filename).suffix.lower() if file.filename else ""
    allowed_extensions = settings.ALLOWED_EXTENSIONS
    
    if file_extension.replace(".", "") not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Extensión no permitida. Extensiones válidas: {', '.join(allowed_extensions)}"
        )

    # Validar tamaño del archivo
    file.file.seek(0, 2)  # Ir al final
    file_size = file.file.tell()
    file.file.seek(0)  # Regresar al inicio
    
    if file_size > settings.MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"Archivo demasiado grande ({file_size / 1024 / 1024:.2f} MB). Máximo: {settings.MAX_FILE_SIZE / 1024 / 1024:.0f} MB"
        )

    try:
        # Guardar archivo
        ruta_archivo = save_uploaded_file(file)

        # Crear registro en base de datos
        db_document = Document(
            user_id=current_user.id,
            tipo_documento=document_type,
            ruta_archivo=ruta_archivo,
            nombre_original=file.filename,
            estado="processing",
        )
        db.add(db_document)
        await db.commit()
        await db.refresh(db_document)

        # Procesar documento
        service = NIMExtractionService()
        result = service.process_invoice(ruta_archivo)

        # Actualizar registro en BD
        if result.get("status") == "success":
            datos_extraidos = extract_entities_from_result(result)
            puntuacion_confianza = calculate_puntuacion_confianza(result)
            
            db_document.estado = "completed"
            db_document.datos_extraidos = datos_extraidos
            db_document.puntuacion_confianza = puntuacion_confianza
        else:
            db_document.estado = "failed"
            db_document.datos_extraidos = {"error": result.get("error", "Error desconocido")}

        await db.commit()

        # Preparar respuesta
        if result.get("status") == "success":
            return DocumentProcessingResponse(
                document_id=str(db_document.id),
                estado="completed",
                datos_extraidos=datos_extraidos, # Use local var
                puntuacion_confianza=puntuacion_confianza, # Use local var
                latency=result.get("total_latency"),
                message="Documento procesado exitosamente"
            )
        else:
            return DocumentProcessingResponse(
                document_id=str(db_document.id),
                estado="failed",
                puntuacion_confianza=0.0,
                latency=result.get("total_latency"),
                message=f"Error en procesamiento: {result.get('error', 'Error desconocido')}"
            )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error procesando documento: {str(e)}")


@router.post("/batch-process", response_model=BatchProcessResponse)
async def batch_process_documents(
    document_type: str = Query(..., description="Tipo de documento"),
    files: List[UploadFile] = File(..., description="Lista de archivos a procesar"),
    max_workers: int = Query(default=4, ge=1, le=10, description="Número de workers paralelos"),
    background_tasks: BackgroundTasks = None,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user),
) -> BatchProcessResponse:
    """
    Procesa múltiples documentos en lote.

    - **document_type**: Tipo de documento
    - **files**: Lista de archivos (PDF, imágenes)
    - **max_workers**: Número de workers paralelos (1-10)

    El procesamiento se realiza en segundo plano con rate limiting de 40 RPM.

    Returns:
        BatchProcessResponse: Resultado del procesamiento masivo
    """
    batch_id = str(uuid.uuid4())
    total_documents = len(files)

    # Validar número de documentos
    if total_documents > 100:
        raise HTTPException(
            status_code=400,
            detail="Máximo 100 documentos por lote"
        )

    # Estimación de tiempo (basado en piloto: ~10s por documento)
    estimated_time = f"~{total_documents * 10 / 60:.1f} minutos"

    # Crear registros en BD
    document_ids = []
    ruta_archivos = []

    for file in files:
        try:
            ruta_archivo = save_uploaded_file(file)
            ruta_archivos.append(ruta_archivo)

            db_document = Document(
                user_id=current_user.id,
                tipo_documento=document_type,
                ruta_archivo=ruta_archivo,
                nombre_original=file.filename,
                estado="pending",
            )
            db.add(db_document)
            document_ids.append(db_document.id)
        except Exception:
            continue

    await db.commit()

    # Procesar en background
    async def process_batch():
        try:
            results = await process_batch_async(ruta_archivos, max_workers=max_workers)

            # Actualizar resultados en BD
            for i, result in enumerate(results):
                if i < len(document_ids):
                    result_doc = await db.execute(select(Document).where(Document.id == document_ids[i]))
                    db_doc = result_doc.scalar_one_or_none()
                    if db_doc:
                        if result.get("status") == "success":
                            db_doc.estado = "completed"
                            db_doc.datos_extraidos = extract_entities_from_result(result)
                            db_doc.puntuacion_confianza = calculate_puntuacion_confianza(result)
                        else:
                            db_doc.estado = "failed"
                            db_doc.datos_extraidos = {"error": result.get("error", "Error desconocido")}
            
            await db.commit()
        except Exception as e:
            print(f"Error en procesamiento batch: {e}")
            await db.rollback()

    if background_tasks:
        background_tasks.add_task(lambda: asyncio.run(process_batch()))

    return BatchProcessResponse(
        batch_id=batch_id,
        total_documents=total_documents,
        estado="queued",
        message=f"Procesando {total_documents} documentos en segundo plano",
        estimated_time=estimated_time
    )


@router.get("/{document_id}", response_model=DocumentStatusResponse)
async def get_document_status(
    document_id: str,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user),
) -> DocumentStatusResponse:
    """
    Obtiene el estado de procesamiento de un documento.

    - **document_id**: ID del documento

    Returns:
        DocumentStatusResponse: Estado y datos extraídos
    """
    try:
        doc_id = int(document_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="ID de documento inválido")

    result = await db.execute(
        select(Document).where(
            Document.id == doc_id,
            Document.user_id == current_user.id
        )
    )
    db_document = result.scalar_one_or_none()

    if not db_document:
        raise HTTPException(status_code=404, detail="Documento no encontrado")

    return DocumentStatusResponse(
        document_id=str(db_document.id),
        estado=db_document.estado,
        tipo_documento=db_document.tipo_documento,
        created_at=db_document.created_at,
        updated_at=db_document.updated_at,
        datos_extraidos=db_document.datos_extraidos,
        puntuacion_confianza=db_document.puntuacion_confianza,
        error_message=db_document.datos_extraidos.get("error") if db_document.estado == "failed" else None
    )


@router.delete("/{document_id}")
async def delete_document(
    document_id: str,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user),
):
    """
    Elimina un documento procesado.

    - **document_id**: ID del documento a eliminar

    Returns:
        Mensaje de confirmación
    """
    try:
        doc_id = int(document_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="ID de documento inválido")

    result = await db.execute(
        select(Document).where(
            Document.id == doc_id,
            Document.user_id == current_user.id
        )
    )
    db_document = result.scalar_one_or_none()

    if not db_document:
        raise HTTPException(status_code=404, detail="Documento no encontrado")

    # Eliminar archivo físico
    try:
        if os.path.exists(db_document.ruta_archivo):
            os.unlink(db_document.ruta_archivo)
    except Exception as e:
        print(f"Error eliminando archivo: {e}")

    # Eliminar registro de BD
    await db.delete(db_document)
    await db.commit()

@router.get("/export/xlsx")
async def export_documents_xlsx(
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user),
):
    """
    Exporta la lista de documentos procesados a un archivo Excel.
    """
    result = await db.execute(select(Document).where(Document.user_id == current_user.id))
    documents = result.scalars().all()
    
    if not documents:
        raise HTTPException(status_code=404, detail="No hay documentos para exportar")

    data = []
    for doc in documents:
        ext_data = doc.datos_extraidos or {}
        data.append({
            "ID": doc.id,
            "Nombre Original": doc.nombre_original,
            "Tipo": doc.tipo_documento,
            "Status": doc.estado,
            "RFC Emisor": ext_data.get("rfc_emisor", "N/A"),
            "RFC Receptor": ext_data.get("rfc_receptor", "N/A"),
            "UUID": ext_data.get("uuid", "N/A"),
            "Total": ext_data.get("total", 0),
            "Fecha Emisión": ext_data.get("fecha_emision", "N/A"),
            "Fecha Proceso": doc.created_at.strftime("%Y-%m-%d %H:%M:%S")
        })

    df = pd.DataFrame(data)
    
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name='Documentos')
    
    output.seek(0)
    
    headers = {
        'Content-Disposition': 'attachment; filename="reporte_documentos.xlsx"'
    }
    
    return StreamingResponse(
        output, 
        headers=headers, 
        media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
