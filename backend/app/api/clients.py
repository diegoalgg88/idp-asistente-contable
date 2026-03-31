from datetime import datetime
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.database import get_async_db
from app.db.models import User, Client, KYCDocument
from app.core.security import get_current_user

router = APIRouter()


class ClientResponse(BaseModel):
    id: int
    name: str
    tipo: str = Field(alias="type")
    rfc: str
    estado: str = Field(alias="status")
    email: str
    phone: str
    regime: str
    kyc_status: str
    created_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True


class ClientCreate(BaseModel):
    name: str
    tipo: str = Field(alias="type")
    rfc: str
    email: str
    phone: str = ""
    regime: str = ""

    class Config:
        populate_by_name = True


class ClientUpdate(BaseModel):
    name: Optional[str] = None
    estado: Optional[str] = Field(None, alias="status")
    email: Optional[str] = None
    phone: Optional[str] = None
    regime: Optional[str] = None
    kyc_status: Optional[str] = None

    class Config:
        populate_by_name = True


class ExpedienteResponse(BaseModel):
    client_id: int
    name: str
    rfc: str
    kyc_documents: List[Dict[str, Any]]
    processed_invoices: int
    pending_issues: int
    last_update: datetime


@router.get("", response_model=List[ClientResponse])
async def list_clients(
    status: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user),
):
    """Lista todos los clientes con filtros opcionales."""
    query = select(Client).where(Client.user_id == current_user.id)
    if status:
        query = query.where(Client.estado == status)
    if type:
        query = query.where(Client.tipo == type)
    
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{client_id}", response_model=ClientResponse)
async def get_client(
    client_id: int,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user),
):
    """Obtiene un cliente por ID."""
    result = await db.execute(
        select(Client).where(
            Client.id == client_id,
            Client.user_id == current_user.id
        )
    )
    client = result.scalar_one_or_none()
    if not client:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return client


@router.post("", response_model=ClientResponse)
async def create_client(
    data: ClientCreate,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user),
):
    """Crea un nuevo cliente."""
    new_client = Client(
        user_id=current_user.id,
        **data.model_dump(by_alias=False),
        estado="Prospecto",
        kyc_status="Sin iniciar"
    )
    db.add(new_client)
    await db.commit()
    await db.refresh(new_client)
    return new_client


@router.put("/{client_id}", response_model=ClientResponse)
async def update_client(
    client_id: int,
    data: ClientUpdate,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user),
):
    """Actualiza un cliente."""
    result = await db.execute(
        select(Client).where(
            Client.id == client_id,
            Client.user_id == current_user.id
        )
    )
    client = result.scalar_one_or_none()
    if not client:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    
    update_data = data.model_dump(exclude_unset=True, by_alias=False)
    for key, value in update_data.items():
        setattr(client, key, value)
    
    await db.commit()
    await db.refresh(client)
    return client


@router.delete("/{client_id}")
async def delete_client(
    client_id: int,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user),
):
    """Elimina un cliente."""
    result = await db.execute(
        select(Client).where(
            Client.id == client_id,
            Client.user_id == current_user.id
        )
    )
    client = result.scalar_one_or_none()
    if not client:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    
    await db.delete(client)
    await db.commit()
    return {"message": f"Cliente {client_id} eliminado"}


@router.get("/{client_id}/expediente", response_model=ExpedienteResponse)
async def get_expediente(
    client_id: int,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user),
):
    """Obtiene el expediente KYC completo de un cliente."""
    result = await db.execute(
        select(Client).where(
            Client.id == client_id,
            Client.user_id == current_user.id
        )
    )
    client = result.scalar_one_or_none()
    if not client:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")

    # Obtener documentos KYC reales
    result = await db.execute(
        select(KYCDocument).where(KYCDocument.client_id == client.id)
    )
    kyc_docs = result.scalars().all()
    
    # Si no hay documentos, devolver estructura básica por ahora
    doc_list = []
    for doc in kyc_docs:
        doc_list.append({
            "name": doc.name,
            "status": doc.estado,
            "expires": doc.expiry_date.strftime("%Y-%m-%d") if doc.expiry_date else None
        })
    
    if not doc_list:
        doc_list = [
            {"name": "Constancia de Situación Fiscal", "status": "Sin iniciar", "expires": None},
            {"name": "Opinión de Cumplimiento", "status": "Sin iniciar", "expires": None},
        ]

    return ExpedienteResponse(
        client_id=client.id,
        name=client.name,
        rfc=client.rfc,
        kyc_documents=doc_list,
        processed_invoices=0, 
        pending_issues=0,
        last_update=client.updated_at,
    )
