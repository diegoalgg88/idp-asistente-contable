"""
Script para crear/actualizar usuario admin
"""
import sys
sys.path.insert(0, '.')

from app.db.database import SessionLocal
from app.db.models import User
from app.core.security import get_password_hash

db = SessionLocal()
try:
    # Buscar usuario admin existente
    admin_user = db.query(User).filter(
        (User.email == "admin") | (User.email == "admin@idp.com")
    ).first()
    
    if admin_user:
        # Actualizar email y contraseña
        admin_user.email = "admin@idp.com"
        admin_user.hashed_password = get_password_hash("admin123")
        admin_user.full_name = "Administrador"
        admin_user.is_active = True
        print(f"✓ Usuario admin actualizado: {admin_user.email}")
    else:
        # Crear nuevo usuario
        admin_user = User(
            email="admin@idp.com",
            hashed_password=get_password_hash("admin123"),
            full_name="Administrador",
            is_active=True,
        )
        db.add(admin_user)
        print("✓ Usuario admin creado: admin@idp.com")
    
    db.commit()
    print("✓ Credenciales: admin@idp.com / admin123")
    
except Exception as e:
    db.rollback()
    print(f"✗ Error: {e}")
finally:
    db.close()
