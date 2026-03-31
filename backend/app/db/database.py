"""
Database Configuration
Configuración de conexión a PostgreSQL con SQLAlchemy 2.0 (Sync & Async)
"""

from sqlalchemy import create_engine, select
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import sessionmaker, declarative_base

from app.core.config import settings
from app.core.security import get_password_hash

# =============================================================================
# SYNCHRONOUS CONFIGURATION (Legacy/Scripts)
# =============================================================================
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True,
    echo=settings.DEBUG,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# =============================================================================
# ASYNCHRONOUS CONFIGURATION (Production/API)
# =============================================================================

# Transform DATABASE_URL for asyncpg if it's a postgres URL
async_db_url = settings.DATABASE_URL
if async_db_url.startswith("postgresql://"):
    async_db_url = async_db_url.replace("postgresql://", "postgresql+asyncpg://", 1)
elif async_db_url.startswith("sqlite://"):
    async_db_url = async_db_url.replace("sqlite://", "sqlite+aiosqlite://", 1)

async_engine = create_async_engine(
    async_db_url,
    pool_pre_ping=True,
    echo=settings.DEBUG,
)

AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)

# Base class for models
Base = declarative_base()


def get_db():
    """Dependency for getting synchronous database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_async_db():
    """Dependency for getting asynchronous database session"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


def init_db():
    """Initialize database (create tables and default user)"""
    # Import all models to ensure they're registered with Base
    from app.db import models  # noqa: F401
    from app.db import models_reconciliation  # noqa: F401
    from app.db.models import User

    Base.metadata.create_all(bind=engine)

    # Create default admin user if not exists
    db = SessionLocal()
    try:
        admin_user = db.query(User).filter(User.email == "admin@idp.com").first()
        if not admin_user:
            admin_user = User(
                email="admin@idp.com",
                contrasena_hash=get_password_hash("admin123"),
                nombre_completo="Administrador",
                esta_activo=True,
            )
            db.add(admin_user)
            db.commit()
            print("✓ Default admin user created: admin@idp.com / admin123")
        else:
            # Update password if exists
            admin_user.contrasena_hash = get_password_hash("admin123")
            db.commit()
            print("✓ Default admin user already exists (password updated)")
    except Exception as e:
        db.rollback()
        print(f"⚠ Error creating default admin user: {e}")
    finally:
        db.close()
