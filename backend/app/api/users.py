"""
Users API - Perfil, configuración, perfiles fiscales, suscripción
"""
from typing import List, Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.db.database import get_async_db
from app.db.models import User
from app.core.security import get_current_user

router = APIRouter()


class UserProfile(BaseModel):
    id: int
    email: str
    nombre_completo: str = Field(alias="full_name")
    esta_activo: bool = Field(alias="is_active")

    class Config:
        from_attributes = True
        populate_by_name = True


class UserUpdate(BaseModel):
    nombre_completo: Optional[str] = Field(None, alias="full_name")
    email: Optional[str] = None

    class Config:
        populate_by_name = True


class UserSettings(BaseModel):
    language: str = "es-MX"
    notifications: bool = True
    dark_mode: bool = True


class FiscalProfile(BaseModel):
    id: str
    rfc: str
    name: str
    regime: str
    status: str
    is_default: bool


class Subscription(BaseModel):
    plan: str
    status: str
    features: List[str]
    expires: Optional[str]
    price: str


@router.get("/me", response_model=UserProfile)
async def get_me(current_user: User = Depends(get_current_user)):
    """Perfil del usuario actual."""
    return UserProfile(
        id=current_user.id,
        email=current_user.email,
        nombre_completo=current_user.nombre_completo or "",
        esta_activo=bool(current_user.esta_activo),
    )


@router.put("/me", response_model=UserProfile)
async def update_me(
    data: UserUpdate,
    db: Session = Depends(get_async_db),
    current_user: User = Depends(get_current_user),
):
    """Actualiza el perfil del usuario."""
    if data.nombre_completo is not None:
        current_user.nombre_completo = data.nombre_completo
    if data.email is not None:
        current_user.email = data.email
    db.commit()
    db.refresh(current_user)
    return UserProfile(
        id=current_user.id,
        email=current_user.email,
        nombre_completo=current_user.nombre_completo or "",
        esta_activo=bool(current_user.esta_activo),
    )


@router.get("/me/settings", response_model=UserSettings)
async def get_settings(
    db: Session = Depends(get_async_db),
    current_user: User = Depends(get_current_user)
):
    """Configuración del usuario persistida en DB."""
    from app.db.models import UserSettings as UserSettingsModel
    settings = db.query(UserSettingsModel).filter(UserSettingsModel.user_id == current_user.id).first()
    
    if not settings:
        # Crear settings por defecto si no existen
        settings = UserSettingsModel(user_id=current_user.id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
        
    return UserSettings(
        language=settings.language,
        notifications=bool(settings.notifications),
        dark_mode=bool(settings.dark_mode)
    )


@router.put("/me/settings", response_model=UserSettings)
async def update_settings(
    data: UserSettings,
    db: Session = Depends(get_async_db),
    current_user: User = Depends(get_current_user),
):
    """Actualiza configuración del usuario en la base de datos."""
    from app.db.models import UserSettings as UserSettingsModel
    settings = db.query(UserSettingsModel).filter(UserSettingsModel.user_id == current_user.id).first()
    
    if not settings:
        settings = UserSettingsModel(user_id=current_user.id)
        db.add(settings)

    settings.language = data.language
    settings.notifications = 1 if data.notifications else 0
    settings.dark_mode = 1 if data.dark_mode else 0
    
    db.commit()
    db.refresh(settings)
    return UserSettings(
        language=settings.language,
        notifications=bool(settings.notifications),
        dark_mode=bool(settings.dark_mode)
    )


@router.get("/me/fiscal-profiles", response_model=List[FiscalProfile])
async def get_fiscal_profiles(current_user: User = Depends(get_current_user)):
    """Perfiles fiscales vinculados al usuario."""
    return [
        FiscalProfile(id="1", rfc="SCN210101ABC", name="Servicios Contables del Norte SA de CV", regime="601 - General de Ley PM", status="Activo", is_default=True),
        FiscalProfile(id="2", rfc="GUZD960101XYZ", name="Diego González - Persona Física", regime="625 - RESICO", status="Activo", is_default=False),
    ]


@router.get("/me/subscription", response_model=Subscription)
async def get_subscription(current_user: User = Depends(get_current_user)):
    """Información de suscripción."""
    return Subscription(
        plan="IDP Pro",
        status="Activa",
        features=[
            "Procesamiento ilimitado de CFDI",
            "Agente Fiscal IA",
            "Clasificación Automática de Gastos",
            "Reportes Avanzados",
            "Soporte Prioritario",
        ],
        expires="2027-03-09",
        price="$499/mes",
    )
