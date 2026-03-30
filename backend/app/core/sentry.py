"""
Sentry Error Tracking Configuration

Configuración de Sentry para monitoreo de errores en producción.
Proporciona:
- Error tracking automático de excepciones
- Performance monitoring (traces)
- Contexto de usuario y requests
- Session replay para debugging

Nota: sentry-sdk[fastapi] debe estar instalado en el entorno virtual.
Instalación:
    pip install sentry-sdk[fastapi]
"""

import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
from app.core.config import settings


def init_sentry() -> None:
    """
    Inicializa Sentry para error tracking.
    
    La inicialización solo ocurre si:
    1. SENTRY_DSN está configurado
    2. No estamos en modo desarrollo (opcional, configurable)
    
    Configuración:
    - traces_sample_rate: 0.1 (10% de transacciones para performance monitoring)
    - profiles_sample_rate: 0.1 (10% de perfiles para debugging)
    - send_default_pii: True (enviar información de usuario para debugging)
    """
    sentry_dsn = getattr(settings, 'SENTRY_DSN', None)
    
    if not sentry_dsn:
        print("⚠ Sentry no configurado: SENTRY_DSN no encontrado en .env")
        print("  Para habilitar error tracking, agrega SENTRY_DSN a tu .env")
        return
    
    environment = getattr(settings, 'ENVIRONMENT', 'development')
    
    # Configurar Sentry
    sentry_sdk.init(
        dsn=sentry_dsn,
        environment=environment,
        integrations=[
            FastApiIntegration(),
            SqlalchemyIntegration(),
        ],
        # Tracing - 10% de las transacciones en producción
        traces_sample_rate=0.1 if environment != 'development' else 0.0,
        
        # Profiling - 10% de los requests
        profiles_sample_rate=0.1 if environment != 'development' else 0.0,
        
        # Enviar información de usuario para debugging
        send_default_pii=True,
        
        # No enviar errores en desarrollo (opcional)
        before_send=lambda event, hint: None if environment == 'development' else event,
        
        # Configurar contexto antes de enviar
        before_send_transaction=lambda transaction, hint: configure_transaction(transaction, environment),
        
        # Debug mode (solo para debugging de Sentry)
        debug=False,
        
        # Release tracking (opcional, usar versión de la app)
        release=f"idp-asistente-contable@{settings.APP_VERSION}",
    )
    
    print(f"✓ Sentry inicializado correctamente (environment: {environment})")


def configure_transaction(transaction: dict, environment: str) -> dict:
    """
    Configura el contexto de transacciones antes de enviar a Sentry.
    
    Args:
        transaction: Diccionario de transacción de Sentry
        environment: Ambiente actual (development, staging, production)
    
    Returns:
        dict: Transacción configurada o None para descartar
    """
    # Descartar transacciones de health check
    if transaction.get('transaction') in ['/health', '/health/detailed', '/']:
        return None
    
    # Agregar tags globales
    transaction.setdefault('tags', {})
    transaction['tags']['environment'] = environment
    transaction['tags']['app_version'] = settings.APP_VERSION
    
    return transaction


def set_user_context(user_id: str, email: str = None, username: str = None) -> None:
    """
    Establece el contexto del usuario actual para Sentry.
    
    Args:
        user_id: ID único del usuario
        email: Email del usuario (opcional)
        username: Nombre de usuario (opcional)
    """
    sentry_sdk.set_user({
        'id': user_id,
        'email': email,
        'username': username,
    })


def clear_user_context() -> None:
    """Limpia el contexto del usuario (útil después de logout)"""
    sentry_sdk.set_user(None)


def set_request_context(request_path: str, method: str, user_agent: str = None) -> None:
    """
    Establece contexto del request actual.
    
    Args:
        request_path: Path del request
        method: Método HTTP (GET, POST, etc.)
        user_agent: User agent del cliente (opcional)
    """
    sentry_sdk.set_tag('route', request_path)
    sentry_sdk.set_tag('method', method)
    
    if user_agent:
        sentry_sdk.set_context('request', {
            'user_agent': user_agent,
        })


def capture_exception_manual(exception: Exception, context: dict = None) -> None:
    """
    Captura una excepción manualmente.
    
    Args:
        exception: Excepción a capturar
        context: Contexto adicional (opcional)
    """
    if context:
        sentry_sdk.set_context('additional', context)
    
    sentry_sdk.capture_exception(exception)


def capture_message_manual(message: str, level: str = 'info') -> None:
    """
    Captura un mensaje para debugging.
    
    Args:
        message: Mensaje a capturar
        level: Nivel de severidad ('debug', 'info', 'warning', 'error')
    """
    sentry_sdk.capture_message(message, level=level)
