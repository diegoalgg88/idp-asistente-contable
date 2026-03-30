@echo off
echo ========================================
echo IDP Frontend - Docker Build (Desarrollo)
echo ========================================
echo.

cd /d "%~dp0frontend"

echo [1/3] Construyendo imagen Docker (modo desarrollo)...
docker build -f Dockerfile.dev -t idp-frontend:dev .

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: El build de Docker fallo.
    echo Verifica que Docker Desktop este instalado y ejecutandose.
    exit /b 1
)

echo.
echo [2/3] Imagen creada exitosamente!
docker images idp-frontend:dev

echo.
echo [3/3] Iniciando contenedor...
docker run -d -p 5173:5173 --name idp-frontend-dev idp-frontend:dev

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: No se pudo iniciar el contenedor.
    echo Puede que ya exista un contenedor con ese nombre.
    echo Ejecuta: docker stop idp-frontend-dev ^&^& docker rm idp-frontend-dev
    exit /b 1
)

echo.
echo ========================================
echo Frontend corriendo en: http://localhost:5173
echo (Modo Desarrollo - Vite Hot Reload)
echo ========================================
echo.
echo Para ver logs: docker logs -f idp-frontend-dev
echo Para detener:  docker stop idp-frontend-dev ^&^& docker rm idp-frontend-dev
echo.
