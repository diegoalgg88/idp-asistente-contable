"""
Security utilities
Utilidades de seguridad para autenticación y autorización con JWT + OAuth2

Funcionalidades:
- Hash de contraseñas con bcrypt
- Generación y validación de tokens JWT
- OAuth2 password flow
- Dependencia para obtener usuario actual
"""

from datetime import datetime, timedelta, timezone
from typing import Optional, Annotated, Any, TYPE_CHECKING
from jose import JWTError, jwt, ExpiredSignatureError
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.config import settings

if TYPE_CHECKING:
    from app.db.models import User
else:
    User = Any


# =============================================================================
# CONFIGURATION
# =============================================================================

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/v1/auth/token")


# =============================================================================
# PASSWORD HASHING
# =============================================================================

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifica una contraseña contra un hash.

    Args:
        plain_password: Contraseña en texto plano
        hashed_password: Hash de contraseña

    Returns:
        bool: True si la contraseña coincide
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    Hashea una contraseña usando bcrypt.

    Args:
        password: Contraseña a hashear

    Returns:
        str: Hash de la contraseña
    """
    return pwd_context.hash(password)


# =============================================================================
# JWT TOKEN MANAGEMENT
# =============================================================================

def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Crea un token de acceso JWT.

    Args:
        data: Datos a incluir en el token (ej: {"sub": "user_id"})
        expires_delta: Duración del token (default: ACCESS_TOKEN_EXPIRE_MINUTES)

    Returns:
        str: Token JWT codificado
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode.update({"exp": expire, "iat": datetime.now(timezone.utc)})

    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )

    return encoded_jwt


def create_refresh_token(
    data: dict
) -> str:
    """
    Crea un token de refresco JWT.

    Args:
        data: Datos a incluir en el token

    Returns:
        str: Token JWT de refresco
    """
    return create_access_token(
        data=data,
        expires_delta=timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    )


def decode_access_token(token: str) -> Optional[dict]:
    """
    Decodifica un token de acceso JWT.

    Args:
        token: Token JWT a decodificar

    Returns:
        Optional[dict]: Payload del token o None si es inválido
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        return payload
    except (JWTError, ExpiredSignatureError):
        return None


def verify_token(token: str) -> Optional[dict]:
    """
    Verifica y decodifica un token JWT.

    Args:
        token: Token JWT a verificar

    Returns:
        Optional[dict]: Payload del token o None si es inválido
    """
    return decode_access_token(token)


# =============================================================================
# USER AUTHENTICATION
# =============================================================================

def authenticate_user(
    db: Session,
    email: str,
    password: str
) -> Optional[User]:
    """
    Autentica un usuario con email y contraseña.

    Args:
        db: Sesión de base de datos
        email: Email del usuario
        password: Contraseña en texto plano

    Returns:
        Optional[User]: Usuario si la autenticación es exitosa, None si falla
    """
    from app.db.models import User as DBUser
    user = db.query(DBUser).filter(DBUser.email == email).first()
    
    if not user:
        return None
    
    if not verify_password(password, user.hashed_password):
        return None
    
    return user


def get_current_user_from_token(
    token: str,
    db: Session
) -> Optional[User]:
    """
    Obtiene el usuario actual desde un token JWT.

    Args:
        token: Token JWT
        db: Sesión de base de datos

    Returns:
        Optional[User]: Usuario o None si el token es inválido
    """
    payload = decode_access_token(token)
    
    if payload is None:
        return None
    
    user_id = payload.get("sub")
    
    if user_id is None:
        return None
    
    try:
        user_id = int(user_id)
    except ValueError:
        return None
    
    from app.db.models import User as DBUser
    user = db.query(DBUser).filter(DBUser.id == user_id).first()
    
    if user is None or not user.is_active:
        return None
    
    return user


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
) -> User:
    """
    Dependencia para obtener el usuario actual desde un token JWT.

    Args:
        token: Token JWT (extraído automáticamente del header Authorization)

    Returns:
        User: Usuario autenticado

    Raises:
        HTTPException: 401 si el token es inválido o expirado
    """
    # Import db dependencies locally to avoid circular import
    from app.db.database import get_db
    
    db = next(get_db())
    try:
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
        payload = decode_access_token(token)
        
        if payload is None:
            raise credentials_exception
        
        user_id = payload.get("sub")
        
        if user_id is None:
            raise credentials_exception
        
        try:
            user_id = int(user_id)
        except ValueError:
            raise credentials_exception
        
        from app.db.models import User as DBUser
        user = db.query(DBUser).filter(DBUser.id == user_id).first()
        
        if user is None or not user.is_active:
            raise credentials_exception
        
        return user
    finally:
        db.close()


async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)]
) -> User:
    """
    Dependencia para obtener usuario activo actual.

    Args:
        current_user: Usuario actual (de get_current_user)

    Returns:
        User: Usuario activo

    Raises:
        HTTPException: 400 si el usuario está inactivo
    """
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    return current_user


async def get_current_superuser(
    current_user: Annotated[User, Depends(get_current_user)]
) -> User:
    """
    Dependencia para obtener superusuario actual.

    Args:
        current_user: Usuario actual

    Returns:
        User: Superusuario

    Raises:
        HTTPException: 403 si el usuario no es superusuario
    """
    # Asumir que los superusuarios tienen un flag is_superuser
    # Por ahora, verificar por email (implementar según necesidades)
    if not current_user.email.endswith("@admin.com"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges"
        )
    
    return current_user


# =============================================================================
# REQUEST/RESPONSE MODELS
# =============================================================================

class Token(BaseModel):
    """Token response model"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Token data model"""
    user_id: Optional[int] = None
    email: Optional[str] = None
    exp: Optional[datetime] = None


class UserCreate(BaseModel):
    """User creation model"""
    email: str
    password: str
    full_name: Optional[str] = None


class UserResponse(BaseModel):
    """User response model"""
    id: int
    email: str
    full_name: Optional[str]
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


# =============================================================================
# SECURITY UTILITIES
# =============================================================================

def generate_password_reset_token(email: str) -> str:
    """
    Genera un token para reseteo de contraseña.

    Args:
        email: Email del usuario

    Returns:
        str: Token de reseteo
    """
    return create_access_token(
        data={"sub": email, "type": "password_reset"},
        expires_delta=timedelta(hours=1)
    )


def verify_password_reset_token(token: str) -> Optional[str]:
    """
    Verifica un token de reseteo de contraseña.

    Args:
        token: Token a verificar

    Returns:
        Optional[str]: Email del usuario o None si es inválido
    """
    payload = decode_access_token(token)
    
    if payload is None:
        return None
    
    if payload.get("type") != "password_reset":
        return None
    
    return payload.get("sub")
