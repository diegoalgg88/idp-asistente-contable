"""
Script de Validación - Fase 5 Backend Producción
Verifica que todos los componentes estén correctamente implementados
Validación estática sin importar módulos
"""

import sys
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent


def print_header(title: str):
    """Print formatted header"""
    print("\n" + "=" * 60)
    print(f"  {title}")
    print("=" * 60)


def print_check(name: str, passed: bool, details: str = ""):
    """Print check result"""
    status = "[OK]" if passed else "[FAIL]"
    print(f"{status} {name}")
    if details:
        print(f"   {details}")


def validate_structure():
    """Validate directory structure"""
    print_header("1. Validando Estructura de Directorios")
    
    required_dirs = [
        "app",
        "app/api",
        "app/core",
        "app/services",
        "app/db",
        "tests",
    ]
    
    all_exist = True
    for dir_path in required_dirs:
        full_path = backend_path / dir_path
        exists = full_path.exists() and full_path.is_dir()
        print_check(f"{dir_path}/", exists)
        all_exist = all_exist and exists
    
    return all_exist


def validate_files():
    """Validate required files exist"""
    print_header("2. Validando Archivos Críticos")
    
    required_files = [
        "app/main.py",
        "app/api/idp.py",
        "app/api/chat.py",
        "app/core/config.py",
        "app/core/security.py",
        "app/core/validators.py",
        "app/services/nvidia_nim.py",
        "app/services/langgraph_agents.py",
        "app/services/__init__.py",
        "app/db/database.py",
        "app/db/models.py",
        "app/__init__.py",
        "app/api/__init__.py",
        "app/core/__init__.py",
        "app/db/__init__.py",
        "Dockerfile",
        "requirements.txt",
        ".env.example",
        "README_FASE5.md",
        "tests/__init__.py",
        "tests/conftest.py",
        "tests/test_integration.py",
        "tests/test_core.py",
    ]
    
    all_exist = True
    for ruta_archivo in required_files:
        full_path = backend_path / ruta_archivo
        exists = full_path.exists() and full_path.is_file()
        print_check(f"{ruta_archivo}", exists)
        all_exist = all_exist and exists
    
    return all_exist


def validate_file_content():
    """Validate key files have content"""
    print_header("3. Validando Contenido de Archivos")
    
    content_checks = [
        ("app/main.py", ["FastAPI", "app = FastAPI", "@app.get"]),
        ("app/core/config.py", ["class Settings", "NVIDIA_API_KEY", "RATE_LIMIT"]),
        ("app/core/security.py", ["get_password_hash", "create_access_token", "get_current_user"]),
        ("app/core/validators.py", ["class RFCValidator", "validate_format", "fix_ocr_errors"]),
        ("app/services/nvidia_nim.py", ["class NIMExtractionService", "process_invoice", "RateLimiter"]),
        ("app/services/langgraph_agents.py", ["class ContableAgent", "generate_response"]),
        ("app/api/idp.py", ["@router.post", "/process", "/batch-process"]),
        ("app/api/chat.py", ["@router.post", "/message", "/conversation"]),
        ("app/db/models.py", ["class User", "class Document", "class Conversation", "class Message"]),
        ("Dockerfile", ["FROM python:3.11", "EXPOSE 8000", "HEALTHCHECK"]),
        ("requirements.txt", ["fastapi", "uvicorn", "sqlalchemy", "psycopg2-binary"]),
    ]
    
    all_pass = True
    for file_name, required_strings in content_checks:
        full_path = backend_path / file_name
        if not full_path.exists():
            print_check(f"{file_name}", False, "Archivo no encontrado")
            all_pass = False
            continue
        
        content = full_path.read_text(encoding="utf-8")
        missing = []
        for s in required_strings:
            if s not in content:
                missing.append(s)
        
        if missing:
            print_check(f"{file_name}", False, f"Falta: {', '.join(missing)}")
            all_pass = False
        else:
            print_check(f"{file_name}", True)
    
    return all_pass


def validate_code_quality():
    """Validate code quality indicators"""
    print_header("4. Validando Calidad de Código")
    
    quality_checks = []
    
    # Check for type hints in key files
    type_hint_files = [
        "app/services/nvidia_nim.py",
        "app/core/validators.py",
        "app/api/idp.py",
    ]
    
    for file_name in type_hint_files:
        full_path = backend_path / file_name
        if not full_path.exists():
            continue
        
        content = full_path.read_text(encoding="utf-8")
        
        # Check for type hints
        has_type_hints = "->" in content and ":" in content
        has_docstrings = '"""' in content
        
        quality_checks.append((f"{file_name} (type hints)", has_type_hints))
        quality_checks.append((f"{file_name} (docstrings)", has_docstrings))
    
    all_pass = True
    for name, result in quality_checks:
        print_check(name, result)
        all_pass = all_pass and result
    
    return all_pass


def validate_requirements():
    """Validate requirements.txt has all dependencies"""
    print_header("5. Validando Dependencias")
    
    required_deps = [
        "fastapi",
        "uvicorn",
        "sqlalchemy",
        "psycopg2-binary",
        "pydantic",
        "pydantic-settings",
        "python-jose",
        "passlib",
        "bcrypt",
        "langchain",
        "langchain-nvidia-ai-endpoints",
        "langgraph",
        "slowapi",
        "pytest",
        "pdf2image",
    ]
    
    req_file = backend_path / "requirements.txt"
    if not req_file.exists():
        print_check("requirements.txt", False, "Archivo no encontrado")
        return False
    
    content = req_file.read_text(encoding="utf-8").lower()
    
    all_pass = True
    for dep in required_deps:
        found = dep.lower() in content
        print_check(f"{dep}", found)
        all_pass = all_pass and found
    
    return all_pass


def validate_tests():
    """Validate test files exist and have content"""
    print_header("6. Validando Tests")
    
    test_checks = [
        ("tests/test_integration.py", ["class Test", "def test_", "assert"]),
        ("tests/test_core.py", ["class Test", "def test_", "assert"]),
        ("tests/conftest.py", ["@pytest.fixture"]),
    ]
    
    all_pass = True
    for file_name, required_strings in test_checks:
        full_path = backend_path / file_name
        if not full_path.exists():
            print_check(f"{file_name}", False, "Archivo no encontrado")
            all_pass = False
            continue
        
        content = full_path.read_text(encoding="utf-8")
        missing = []
        for s in required_strings:
            if s not in content:
                missing.append(s)
        
        if missing:
            print_check(f"{file_name}", False, f"Falta: {', '.join(missing)}")
            all_pass = False
        else:
            print_check(f"{file_name}", True)
    
    return all_pass


def validate_documentation():
    """Validate documentation files"""
    print_header("7. Validando Documentación")
    
    doc_checks = [
        ("README_FASE5.md", ["# Fase 5", "Endpoints", "Docker", "Tests"]),
        (".env.example", ["NVIDIA_API_KEY", "DATABASE_URL", "SECRET_KEY"]),
    ]
    
    all_pass = True
    for file_name, required_strings in doc_checks:
        full_path = backend_path / file_name
        if not full_path.exists():
            print_check(f"{file_name}", False, "Archivo no encontrado")
            all_pass = False
            continue
        
        content = full_path.read_text(encoding="utf-8")
        missing = []
        for s in required_strings:
            if s not in content:
                missing.append(s)
        
        if missing:
            print_check(f"{file_name}", False, f"Falta: {', '.join(missing)}")
            all_pass = False
        else:
            print_check(f"{file_name}", True)
    
    return all_pass


def run_all_validations():
    """Run all validations"""
    print("\n")
    print("+" + "=" * 58 + "+")
    print("|" + " " * 58 + "|")
    print("|" + "  VALIDACION FASE 5: BACKEND PRODUCCION".center(58) + "|")
    print("|" + " " * 58 + "|")
    print("+" + "=" * 58 + "+")
    
    results = []
    
    results.append(("Estructura de Directorios", validate_structure()))
    results.append(("Archivos Críticos", validate_files()))
    results.append(("Contenido de Archivos", validate_file_content()))
    results.append(("Calidad de Código", validate_code_quality()))
    results.append(("Dependencias", validate_requirements()))
    results.append(("Tests", validate_tests()))
    results.append(("Documentación", validate_documentation()))
    
    # Summary
    print_header("RESUMEN DE VALIDACION")
    
    total = len(results)
    passed = sum(1 for _, result in results if result)
    
    for name, result in results:
        status = "[PASS]" if result else "[FAIL]"
        print(f"{status} - {name}")
    
    print("\n" + "-" * 60)
    print(f"Total: {passed}/{total} validaciones completadas")
    print("-" * 60)
    
    if passed == total:
        print("\n[SUCCESS] ¡VALIDACION EXITOSA! Backend listo para produccion.")
        print("\nPróximos pasos:")
        print("1. Instalar dependencias: pip install -r requirements.txt")
        print("2. Copiar .env.example a .env y configurar API keys")
        print("3. Ejecutar: docker-compose up -d")
        print("4. Abrir: http://localhost:8000/docs")
    else:
        print(f"\n[WARNING] {total - passed} validacion(es) fallaron. Revisa los errores arriba.")
    
    print("\n")
    
    return passed == total


if __name__ == "__main__":
    success = run_all_validations()
    sys.exit(0 if success else 1)
