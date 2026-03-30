"""
Auth API - Autenticación OAuth2 con JWT

Endpoints disponibles:
- POST /v1/auth/token - OAuth2 token endpoint
- POST /v1/auth/refresh - Refresh token endpoint
- GET  /v1/auth/me - Current user info
"""

from datetime import timedelta
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import User
from app.core.security import (
    authenticate_user,
    create_access_token,
    create_refresh_token,
    decode_access_token,
    get_current_user,
    Token,
)
from app.core.config import settings


router = APIRouter()


# =============================================================================
# REQUEST/RESPONSE MODELS
# =============================================================================

class RefreshTokenRequest(BaseModel):
    """Request model for token refresh"""
    refresh_token: str


# =============================================================================
# ENDPOINTS
# =============================================================================

@router.post("/token", response_model=Token)
async def login_for_access_token(
    db: Annotated[Session, Depends(get_db)],
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> Token:
    """
    OAuth2 token endpoint para obtener access_token y refresh_token.

    - **username**: Email del usuario (OAuth2 usa 'username' para el email)
    - **password**: Contraseña del usuario

    Returns:
        Token: Contiene access_token, refresh_token y token_type

    Raises:
        HTTPException: 401 si las credenciales son inválidas
    """
    # Autenticar usuario
    user = authenticate_user(db, form_data.username, form_data.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user",
        )

    # Crear tokens
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=access_token_expires,
    )

    refresh_token = create_refresh_token(
        data={"sub": str(user.id), "email": user.email},
    )

    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
    )


@router.get("/me", response_model=dict)
async def get_current_user_info(
    current_user: Annotated[User, Depends(get_current_user)],
) -> dict:
    """
    Obtiene información del usuario actual autenticado.

    Returns:
        dict: Información del usuario (id, email, full_name, is_active)
    """
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "is_active": current_user.is_active,
        "created_at": current_user.created_at,
    }


@router.post("/refresh", response_model=Token)
async def refresh_access_token(
    request: RefreshTokenRequest,
    db: Annotated[Session, Depends(get_db)],
) -> Token:
    """
    Refresh access token using refresh_token.

    - **refresh_token**: Refresh token JWT

    Returns:
        Token: Nuevo access_token y refresh_token

    Raises:
        HTTPException: 401 si el refresh token es inválido o expiró
    """
    # Decodificar refresh token
    payload = decode_access_token(request.refresh_token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")
    email = payload.get("email")

    if user_id is None or email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Verificar que el usuario existe y está activo
    try:
        user_id_int = int(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user ID in token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(User).filter(User.id == user_id_int).first()

    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Crear nuevos tokens
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=access_token_expires,
    )

    refresh_token = create_refresh_token(
        data={"sub": str(user.id), "email": user.email},
    )

    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
    )
