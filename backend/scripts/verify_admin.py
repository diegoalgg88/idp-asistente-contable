"""
Script para verificar/crear usuario admin
"""
import sys
import os

# Agregar directorio padre al path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Importar modelos primero para evitar errores de relaciones
from app.db.database import SessionLocal
from app.db import models  # noqa: F401 - Importa todos los modelos
from app.db import models_reconciliation  # noqa: F401 - Importa modelos de reconciliación

from app.db.models import User
from app.core.security import get_password_hash

db = SessionLocal()
try:
    # Verificar si existe admin
    admin = db.query(User).filter(User.email == "admin@idp.com").first()
    
    if admin:
        print(f"✓ Usuario admin existe: {admin.email}")
        print(f"  ID: {admin.id}")
        print(f"  Activo: {admin.is_active}")
        
        # Actualizar password
        admin.hashed_password = get_password_hash("admin123")
        db.commit()
        print("✓ Contraseña actualizada a: admin123")
    else:
        # Crear usuario admin
        admin = User(
            email="admin@idp.com",
            hashed_password=get_password_hash("admin123"),
            full_name="Administrador",
            is_active=True
        )
        db.add(admin)
        db.commit()
        print("✓ Usuario admin CREADO:")
        print("  Email: admin@idp.com")
        print("  Password: admin123")
    
    # Listar todos los usuarios
    print("\n📋 Todos los usuarios:")
    users = db.query(User).all()
    for u in users:
        print(f"  - {u.email} (ID: {u.id}, Activo: {u.is_active})")
        
finally:
    db.close()
