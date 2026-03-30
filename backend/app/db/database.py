"""
Database Configuration
Configuración de conexión a PostgreSQL con SQLAlchemy
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.core.config import settings
from app.core.security import get_password_hash

# Create database engine
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True,
    echo=settings.DEBUG,
)

# Create session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# Base class for models
Base = declarative_base()


def get_db():
    """
    Dependency for getting database session
    
    Usage:
        @app.get("/items/")
        def get_items(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


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
                hashed_password=get_password_hash("admin123"),
                full_name="Administrador",
                is_active=True,
            )
            db.add(admin_user)
            db.commit()
            print("✓ Default admin user created: admin@idp.com / admin123")
        else:
            # Update password if exists
            admin_user.hashed_password = get_password_hash("admin123")
            db.commit()
            print("✓ Default admin user already exists (password updated)")
    except Exception as e:
        db.rollback()
        print(f"⚠ Error creating default admin user: {e}")
    finally:
        db.close()
