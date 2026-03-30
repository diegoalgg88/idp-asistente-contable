# Documento 6: Agentes Autónomos y Workflows de Cumplimiento

Este documento detalla cómo los agentes ejecutan tareas de principio a fin, interactuando con sistemas externos (SAT) y el usuario contador.

## 1. Arquitectura "Human-in-the-Loop" (HITL)

Para procesos sensibles como la **Declaración Anual**, el agente no opera de forma aislada. Se implementa un patrón de **Pausa y Aprobación**:

1. **Estado de Preparación:** El agente recolecta toda la información (Módulos 1, 2 y 4).
2. **Estado de Borrador:** El agente genera un JSON con la propuesta de declaración.
3. **Estado de Interrupción:** El sistema envía una notificación al contador: *"He preparado el borrador. ¿Deseas revisarlo o enviarlo?"*.
4. **Estado de Ejecución:** Solo tras el "OK" humano, el agente procede a la acción final.

## 2. Especialización de Agentes (Roles)

| **Agente**                 | **Misión Principal**                                         | **Herramientas (Tools)**                |
| -------------------------- | ------------------------------------------------------------ | --------------------------------------- |
| **Agente Descargador**     | Mantener sincronizado el repositorio local con el portal del SAT. | `SAT_Scraper`, `UUID_Checker`.          |
| **Agente de Nómina**       | Validar que los recibos de nómina coincidan con las retenciones de ley. | `IMSS_Calculator`, `Payroll_Validator`. |
| **Agente de Notificación** | Comunicarse con los clientes del despacho para solicitar información. | `Email_Sender`, `WhatsApp_API`.         |

## 3. Manejo de Errores y "Self-Healing"

Si un agente falla (ej. el portal del SAT está caído), el flujo de LangGraph detecta la excepción y activa una política de reintento:

- **Reintento Exponencial:** Esperar 5, 10, 30 minutos.
- **Notificación de Bloqueo:** Si tras 3 intentos falla, el agente cambia su estado a `BLOCKED` y genera un ticket en el dashboard para que el contador intervenga manualmente.

------