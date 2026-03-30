@echo off
echo ========================================
echo IDP Frontend - Detener Contenedor
echo ========================================
echo.

echo Deteniendo contenedor de frontend...

docker stop idp-frontend 2>nul
if %ERRORLEVEL% EQU 0 (
    echo - Contenedor de produccion detenido.
) else (
    echo - No hay contenedor de produccion corriendo.
)

docker stop idp-frontend-dev 2>nul
if %ERRORLEVEL% EQU 0 (
    echo - Contenedor de desarrollo detenido.
) else (
    echo - No hay contenedor de desarrollo corriendo.
)

echo.
echo Eliminando contenedores...

docker rm idp-frontend 2>nul
if %ERRORLEVEL% EQU 0 (
    echo - Contenedor de produccion eliminado.
)

docker rm idp-frontend-dev 2>nul
if %ERRORLEVEL% EQU 0 (
    echo - Contenedor de desarrollo eliminado.
)

echo.
echo ========================================
echo Contenedores de frontend detenidos.
echo ========================================
