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
        admin_user.contrasena_hash = get_password_hash("admin123")
        admin_user.nombre_completo = "Administrador"
        admin_user.esta_activo = True
        print(f"✓ Usuario admin actualizado: {admin_user.email}")
    else:
        # Crear nuevo usuario
        admin_user = User(
            email="admin@idp.com",
            contrasena_hash=get_password_hash("admin123"),
            nombre_completo="Administrador",
            esta_activo=True,
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
