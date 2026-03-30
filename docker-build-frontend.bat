@echo off
echo ========================================
echo IDP Frontend - Docker Build (Produccion)
echo ========================================
echo.

cd /d "%~dp0frontend"

echo [1/3] Construyendo imagen Docker...
docker build -t idp-frontend:latest .

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: El build de Docker fallo.
    echo Verifica que Docker Desktop este instalado y ejecutandose.
    exit /b 1
)

echo.
echo [2/3] Imagen creada exitosamente!
docker images idp-frontend:latest

echo.
echo [3/3] Iniciando contenedor...
docker run -d -p 3000:80 --name idp-frontend idp-frontend:latest

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: No se pudo iniciar el contenedor.
    echo Puede que ya exista un contenedor con ese nombre.
    echo Ejecuta: docker stop idp-frontend ^&^& docker rm idp-frontend
    exit /b 1
)

echo.
echo ========================================
echo Frontend corriendo en: http://localhost:3000
echo Health check: http://localhost:3000/health
echo ========================================
echo.
echo Para ver logs: docker logs -f idp-frontend
echo Para detener:  docker stop idp-frontend ^&^& docker rm idp-frontend
echo.
