from datetime import datetime
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import User, Client, KYCDocument
from app.core.security import get_current_user

router = APIRouter()


class ClientResponse(BaseModel):
    id: int
    name: str
    type: str
    rfc: str
    status: str
    email: str
    phone: str
    regime: str
    kyc_status: str
    created_at: datetime

    class Config:
        from_attributes = True


class ClientCreate(BaseModel):
    name: str
    type: str
    rfc: str
    email: str
    phone: str = ""
    regime: str = ""


class ClientUpdate(BaseModel):
    name: Optional[str] = None
    status: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    regime: Optional[str] = None
    kyc_status: Optional[str] = None


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
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Lista todos los clientes con filtros opcionales."""
    query = db.query(Client).filter(Client.user_id == current_user.id)
    if status:
        query = query.filter(Client.status == status)
    if type:
        query = query.filter(Client.type == type)
    return query.all()


@router.get("/{client_id}", response_model=ClientResponse)
async def get_client(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Obtiene un cliente por ID."""
    client = db.query(Client).filter(
        Client.id == client_id,
        Client.user_id == current_user.id
    ).first()
    if not client:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return client


@router.post("", response_model=ClientResponse)
async def create_client(
    data: ClientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Crea un nuevo cliente."""
    new_client = Client(
        user_id=current_user.id,
        **data.model_dump(),
        status="Prospecto",
        kyc_status="Sin iniciar"
    )
    db.add(new_client)
    db.commit()
    db.refresh(new_client)
    return new_client


@router.put("/{client_id}", response_model=ClientResponse)
async def update_client(
    client_id: int,
    data: ClientUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Actualiza un cliente."""
    client = db.query(Client).filter(
        Client.id == client_id,
        Client.user_id == current_user.id
    ).first()
    if not client:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(client, key, value)
    
    db.commit()
    db.refresh(client)
    return client


@router.delete("/{client_id}")
async def delete_client(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Elimina un cliente."""
    client = db.query(Client).filter(
        Client.id == client_id,
        Client.user_id == current_user.id
    ).first()
    if not client:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    
    db.delete(client)
    db.commit()
    return {"message": f"Cliente {client_id} eliminado"}


@router.get("/{client_id}/expediente", response_model=ExpedienteResponse)
async def get_expediente(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Obtiene el expediente KYC completo de un cliente."""
    client = db.query(Client).filter(
        Client.id == client_id,
        Client.user_id == current_user.id
    ).first()
    if not client:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")

    # Obtener documentos KYC reales
    kyc_docs = db.query(KYCDocument).filter(KYCDocument.client_id == client.id).all()
    
    # Si no hay documentos, devolver estructura básica por ahora
    doc_list = []
    for doc in kyc_docs:
        doc_list.append({
            "name": doc.name,
            "status": doc.status,
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
