#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import shutil
from pathlib import Path

# Lista de directorios de entornos virtuales comunes a excluir.
# Cualquier ruta que contenga uno de estos nombres será ignorada.
VIRTUAL_ENV_DIRS = [
    "venv",
    ".venv",
    "env",
    "v_env",
    "virtualenv",
    # Puedes añadir otros si es necesario, por ejemplo, si usas poetry o pipenv
]

def is_in_excluded_dir(path: Path, excluded_dirs: list[str]) -> bool:
    """
    Verifica si alguna parte del camino contiene un nombre de directorio excluido
    (típicamente un entorno virtual).
    """
    # Recorremos los componentes del camino (partes de la ruta)
    # y comprobamos si alguno coincide con un directorio excluido.
    return any(part in excluded_dirs for part in path.parts)

def clear_python_cache():
    """
    Elimina todos los archivos y directorios de caché de Python,
    excluyendo los entornos virtuales.
    """
    # Patrones de directorios de caché a eliminar
    cache_dirs = [
        "__pycache__",
        ".pytest_cache",
        ".coverage",
        "htmlcov",
        ".tox",
        ".eggs",
        "build",
        "dist"
    ]
    
    # Patrones de archivos de caché a eliminar
    cache_files = [
        "*.pyc",
        "*.pyo", 
        "*.pyd",
        ".coverage",
        "*.egg-info" # Nota: La carpeta *.egg-info se maneja por separado abajo
    ]
    
    # Contadores para mostrar estadísticas
    dirs_deleted = 0
    files_deleted = 0
    
    print("🔍 Buscando y eliminando caches de Python (excluyendo entornos virtuales)...")
    print("-" * 50)
    
    # Eliminar directorios de caché
    for dir_pattern in cache_dirs:
        try:
            # Buscar directorios que coincidan con el patrón
            for dir_path in Path('.').rglob(dir_pattern):
                if dir_path.is_dir():
                    
                    # *** Lógica de Exclusión de Entornos Virtuales ***
                    if is_in_excluded_dir(dir_path, VIRTUAL_ENV_DIRS):
                        print(f"⏩ Ignorando (Entorno Virtual Detectado): {dir_path}")
                        continue
                    # **********************************************
                        
                    try:
                        shutil.rmtree(dir_path)
                        print(f"🗑️ Directorio eliminado: {dir_path}")
                        dirs_deleted += 1
                    except Exception as e:
                        print(f"❌ Error eliminando {dir_path}: {e}")
        except Exception as e:
            print(f"❌ Error buscando {dir_pattern}: {e}")
    
    # Eliminar archivos de caché
    for file_pattern in cache_files:
        try:
            # Buscar archivos que coincidan con el patrón
            # Usamos `glob` aquí, aunque `rglob` podría ser más eficiente en algunos casos,
            # mantenemos el uso original.
            for ruta_archivo in Path('.').rglob(file_pattern):
                if ruta_archivo.is_file():
                    
                    # *** Lógica de Exclusión de Entornos Virtuales ***
                    if is_in_excluded_dir(ruta_archivo, VIRTUAL_ENV_DIRS):
                        # Nota: Es menos probable encontrar archivos cacheables fuera de los directorios excluidos,
                        # pero la verificación es segura.
                        continue
                    # **********************************************
                        
                    try:
                        ruta_archivo.unlink()
                        print(f"🗑️ Archivo eliminado: {ruta_archivo}")
                        files_deleted += 1
                    except Exception as e:
                        print(f"❌ Error eliminando {ruta_archivo}: {e}")
        except Exception as e:
            print(f"❌ Error buscando {file_pattern}: {e}")
    
    # Eliminar carpetas .egg-info (que pueden tener nombres variables)
    try:
        for egg_info_dir in Path('.').rglob("*.egg-info"):
            if egg_info_dir.is_dir():
                
                # *** Lógica de Exclusión de Entornos Virtuales ***
                if is_in_excluded_dir(egg_info_dir, VIRTUAL_ENV_DIRS):
                    print(f"⏩ Ignorando (Entorno Virtual Detectado): {egg_info_dir}")
                    continue
                # **********************************************
                
                try:
                    shutil.rmtree(egg_info_dir)
                    print(f"🗑️ Directorio egg-info eliminado: {egg_info_dir}")
                    dirs_deleted += 1
                except Exception as e:
                    print(f"❌ Error eliminando {egg_info_dir}: {e}")
    except Exception as e:
        print(f"❌ Error buscando directorios egg-info: {e}")
    
    # Mostrar estadísticas finales
    print("-" * 50)
    print("✅ Eliminación completada!")
    print(f"📁 Directorios eliminados: {dirs_deleted}")
    print(f"📄 Archivos eliminados: {files_deleted}")
    print("✨ Todos los caches de Python han sido limpiados (excepto en venvs)")

def main():
    """
    Función principal
    """
    print("🧹 Script de limpieza de caches de Python (Con exclusión de venvs)")
    print("=" * 50)
    print("Iniciando limpieza automática...")
    clear_python_cache()

if __name__ == "__main__":
    main()