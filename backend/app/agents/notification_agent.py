"""
Agente Notificador / Alertas (Fase 11)
"""
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class NotificationAgent:
    """
    Simula el envío de comunicaciones (Emails, Push) cuando el sistema 
    detecte hitos críticos, como nóminas pendientes de autorizar o 
    declaraciones fiscales por vencer.
    """
    def __init__(self):
        self.channels = ["EMAIL", "IN_APP_ALERT"]
        
    def dispatch_alert(self, event_type: str, user_id: str, context: Dict[str, Any]) -> bool:
        """
        Dispara interactivamente la alerta al frontend / buzón del usuario.
        """
        try:
            message = self._compose_message(event_type, context)
            logger.info(f"ALERTA DESPACHADA a {user_id}: {message}")
            # Simulador envío SendGrid o WebSockets
            return True
            
        except Exception as e:
            logger.error(f"Falla entregando notificación para {event_type}: {e}")
            return False
            
    def _compose_message(self, event_type: str, ctx: Dict[str, Any]) -> str:
        if event_type == "HUMAN_VALIDATION_REQUIRED":
            return f"Nómina Pre-calculada lista para Autorización. Periodo: {ctx.get('periodo')}. Importe total neto: ${ctx.get('net_pay', 0.0)}"
        elif event_type == "TAX_DEADLINE_WARNING":
            return f"URGENTE: Declaración {ctx.get('tipo')} vence en {ctx.get('dias_restantes')} días."
        elif event_type == "EFO_DETECTED":
            return f"CRÍTICO: Se detectó proveedor {ctx.get('rfc')} en lista negra."
        return "Nueva notificación del IDP Asistente Contable."
