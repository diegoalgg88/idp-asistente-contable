"""
Agent Tools Service
Definición de herramientas que el agente contable puede ejecutar.

Herramientas disponibles:
- get_clients_list: Lista resumen de clientes con RFC y estatus
- get_client_expediente: Detalle del expediente KYC de un cliente
- update_client_status: Cambia el estatus de un cliente
- analyze_cfdi: Analiza un XML de CFDI para extraer datos fiscales
- validate_sat_status: Consulta el estatus fiscal de un RFC en el SAT

Arquitectura:
- Cada tool tiene una definición JSON (para el LLM) y una función ejecutora (para el backend)
- El ReAct loop llama a las funciones según la decisión del LLM
"""

import os
import time
import requests
from typing import Dict, Any, Optional, Callable
from datetime import datetime
from sqlalchemy.orm import Session

from app.db.models import Document
from app.core.config import settings


# =============================================================================
# CALENDAR TOOLS - Calendar Management for Fiscal Events
# =============================================================================

def create_calendar_event_tool(
    title: str,
    date: str,
    type: str = "fiscal",
    priority: str = "media",
    description: Optional[str] = None,
    user_id: Optional[int] = None,
    db: Optional[Session] = None,
    **kwargs
) -> Dict[str, Any]:
    """
    Crea un nuevo evento en el calendario fiscal del usuario.
    
    Args:
        title: Título del evento (ej: "Declaración Mensual IVA")
        date: Fecha del evento en formato YYYY-MM-DD
        type: Tipo de evento (fiscal, nomina, seguridad_social, cliente)
        priority: Prioridad (alta, media, baja)
        description: Descripción opcional del evento
        user_id: ID del usuario (requerido)
        db: Sesión de base de datos (requerida)
    
    Returns:
        Dict con el resultado de la operación
    """
    from app.db.models import CalendarEvent
    from datetime import datetime
    
    start_time = time.time()
    
    try:
        if not db or user_id is None:
            return {"error": "user_id and db session required"}
        
        # Parse date
        event_date = datetime.fromisoformat(date)
        
        # Create event
        new_event = CalendarEvent(
            user_id=user_id,
            title=title,
            description=description,
            date=event_date,
            type=type,
            status="pendiente",
            priority=priority,
            is_recurring=0,
            metadata_json=kwargs.get("metadata", {})
        )
        
        db.add(new_event)
        db.commit()
        db.refresh(new_event)
        
        return {
            "success": True,
            "event": {
                "id": str(new_event.id),
                "title": new_event.title,
                "date": new_event.date.strftime('%Y-%m-%d'),
                "type": new_event.type,
                "status": new_event.status,
                "priority": new_event.priority
            },
            "_meta": {
                "tool": "create_calendar_event",
                "latency": float(f"{(time.time() - start_time):.3f}"),
                "status": "success",
            },
        }
        
    except Exception as e:
        return {
            "error": str(e),
            "_meta": {
                "tool": "create_calendar_event",
                "latency": float(f"{(time.time() - start_time):.3f}"),
                "status": "error",
            },
        }


def update_calendar_event_tool(
    event_id: int,
    status: Optional[str] = None,
    title: Optional[str] = None,
    date: Optional[str] = None,
    priority: Optional[str] = None,
    user_id: Optional[int] = None,
    db: Optional[Session] = None,
    **kwargs
) -> Dict[str, Any]:
    """
    Actualiza un evento del calendario fiscal.
    
    Args:
        event_id: ID del evento a actualizar
        status: Nuevo estado (pendiente, completado, en_preparacion, vencido)
        title: Nuevo título
        date: Nueva fecha (YYYY-MM-DD)
        priority: Nueva prioridad
        user_id: ID del usuario (requerido)
        db: Sesión de base de datos (requerida)
    
    Returns:
        Dict con el resultado de la operación
    """
    from app.db.models import CalendarEvent
    from datetime import datetime
    
    start_time = time.time()
    
    try:
        if not db or user_id is None:
            return {"error": "user_id and db session required"}
        
        # Get event
        event = db.query(CalendarEvent).filter(
            CalendarEvent.id == event_id,
            CalendarEvent.user_id == user_id
        ).first()
        
        if not event:
            return {"error": f"Event {event_id} not found"}
        
        # Update fields
        if status:
            event.status = status
        if title:
            event.title = title
        if date:
            event.date = datetime.fromisoformat(date)
        if priority:
            event.priority = priority
        
        event.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(event)
        
        return {
            "success": True,
            "event": {
                "id": str(event.id),
                "title": event.title,
                "date": event.date.strftime('%Y-%m-%d'),
                "status": event.status,
                "priority": event.priority
            },
            "_meta": {
                "tool": "update_calendar_event",
                "latency": float(f"{(time.time() - start_time):.3f}"),
                "status": "success",
            },
        }
        
    except Exception as e:
        return {
            "error": str(e),
            "_meta": {
                "tool": "update_calendar_event",
                "latency": float(f"{(time.time() - start_time):.3f}"),
                "status": "error",
            },
        }


def delete_calendar_event_tool(
    event_id: int,
    user_id: Optional[int] = None,
    db: Optional[Session] = None,
    **kwargs
) -> Dict[str, Any]:
    """
    Elimina un evento del calendario fiscal.
    
    Args:
        event_id: ID del evento a eliminar
        user_id: ID del usuario (requerido)
        db: Sesión de base de datos (requerida)
    
    Returns:
        Dict con el resultado de la operación
    """
    from app.db.models import CalendarEvent
    
    start_time = time.time()
    
    try:
        if not db or user_id is None:
            return {"error": "user_id and db session required"}
        
        # Get event
        event = db.query(CalendarEvent).filter(
            CalendarEvent.id == event_id,
            CalendarEvent.user_id == user_id
        ).first()
        
        if not event:
            return {"error": f"Event {event_id} not found"}
        
        db.delete(event)
        db.commit()
        
        return {
            "success": True,
            "message": f"Evento {event_id} eliminado exitosamente",
            "_meta": {
                "tool": "delete_calendar_event",
                "latency": float(f"{(time.time() - start_time):.3f}"),
                "status": "success",
            },
        }
        
    except Exception as e:
        return {
            "error": str(e),
            "_meta": {
                "tool": "delete_calendar_event",
                "latency": float(f"{(time.time() - start_time):.3f}"),
                "status": "error",
            },
        }


def list_calendar_events_tool(
    user_id: Optional[int] = None,
    db: Optional[Session] = None,
    limit: int = 10,
    **kwargs
) -> Dict[str, Any]:
    """
    Lista eventos del calendario fiscal del usuario.
    
    Args:
        user_id: ID del usuario (requerido)
        db: Sesión de base de datos (requerida)
        limit: Máximo número de eventos a retornar
    
    Returns:
        Dict con la lista de eventos
    """
    from app.db.models import CalendarEvent
    from datetime import datetime, timedelta
    
    start_time = time.time()
    
    try:
        if not db or user_id is None:
            return {"error": "user_id and db session required"}
        
        # Get events (next 60 days)
        now = datetime.utcnow()
        events = db.query(CalendarEvent).filter(
            CalendarEvent.user_id == user_id,
            CalendarEvent.date >= now - timedelta(days=7),
            CalendarEvent.date <= now + timedelta(days=60)
        ).order_by(CalendarEvent.date).limit(limit).all()
        
        return {
            "success": True,
            "events": [
                {
                    "id": str(e.id),
                    "title": e.title,
                    "date": e.date.strftime('%Y-%m-%d'),
                    "type": e.type,
                    "status": e.status,
                    "priority": e.priority
                }
                for e in events
            ],
            "count": len(events),
            "_meta": {
                "tool": "list_calendar_events",
                "latency": float(f"{(time.time() - start_time):.3f}"),
                "status": "success",
            },
        }
        
    except Exception as e:
        return {
            "error": str(e),
            "_meta": {
                "tool": "list_calendar_events",
                "latency": float(f"{(time.time() - start_time):.3f}"),
                "status": "error",
            },
        }


# =============================================================================
# WORKFLOW TOOLS - Workflow Management for IA Agent
# =============================================================================

def execute_workflow_tool(
    workflow_name: str,
    workflow_type: str,
    metadata: Optional[Dict] = None,
    user_id: Optional[int] = None,
    db: Optional[Session] = None,
    **kwargs
) -> Dict[str, Any]:
    """
    Ejecuta un nuevo workflow.
    
    Args:
        workflow_name: Nombre del workflow (ej: "Cierre Mensual Marzo 2026")
        workflow_type: Tipo (idp_ocr, bank_reconciliation, cierre_mensual, validacion_sat)
        metadata: Datos adicionales (document_ids, bank_statement_ids, month, year, etc)
        user_id: ID del usuario (requerido)
        db: Sesión de base de datos (requerida)
    
    Returns:
        Dict con resultado de la ejecución
    """
    from app.db.models import Workflow
    
    start_time = time.time()
    
    try:
        if not db or user_id is None:
            return {"error": "user_id and db session required"}
        
        # Crear workflow
        new_workflow = Workflow(
            user_id=user_id,
            name=workflow_name,
            description=f"Workflow {workflow_type} iniciado por IA",
            type=workflow_type,
            status="pending",
            progress=0,
            steps_total=5,
            steps_completed=0,
            metadata_json=metadata or {}
        )
        
        db.add(new_workflow)
        db.commit()
        db.refresh(new_workflow)
        
        # Auto-ejecutar si es tipo válido
        if workflow_type in ["idp_ocr", "bank_reconciliation", "cierre_mensual", "validacion_sat"]:
            # En producción, esto dispararía la ejecución real
            new_workflow.status = "pending"
            db.commit()
        
        return {
            "success": True,
            "workflow": {
                "id": str(new_workflow.id),
                "name": new_workflow.name,
                "type": new_workflow.type,
                "status": new_workflow.status,
                "progress": new_workflow.progress
            },
            "message": f"Workflow '{workflow_name}' creado exitosamente. ID: {new_workflow.id}",
            "_meta": {
                "tool": "execute_workflow",
                "latency": float(f"{(time.time() - start_time):.3f}"),
                "status": "success",
            },
        }
        
    except Exception as e:
        return {
            "error": str(e),
            "_meta": {
                "tool": "execute_workflow",
                "latency": float(f"{(time.time() - start_time):.3f}"),
                "status": "error",
            },
        }


def get_workflow_status_tool(
    workflow_id: int,
    user_id: Optional[int] = None,
    db: Optional[Session] = None,
    **kwargs
) -> Dict[str, Any]:
    """
    Obtiene el estatus actual de un workflow.
    
    Args:
        workflow_id: ID del workflow
        user_id: ID del usuario (requerido)
        db: Sesión de base de datos (requerida)
    
    Returns:
        Dict con estatus del workflow
    """
    from app.db.models import Workflow
    
    start_time = time.time()
    
    try:
        if not db or user_id is None:
            return {"error": "user_id and db session required"}
        
        workflow = db.query(Workflow).filter(
            Workflow.id == workflow_id,
            Workflow.user_id == user_id
        ).first()
        
        if not workflow:
            return {"error": f"Workflow {workflow_id} not found"}
        
        return {
            "success": True,
            "workflow": {
                "id": str(workflow.id),
                "name": workflow.name,
                "type": workflow.type,
                "status": workflow.status,
                "progress": workflow.progress,
                "steps_completed": workflow.steps_completed,
                "steps_total": workflow.steps_total,
                "started_at": workflow.started_at.isoformat() if workflow.started_at else None,
                "completed_at": workflow.completed_at.isoformat() if workflow.completed_at else None,
                "metadata": workflow.metadata_json
            },
            "_meta": {
                "tool": "get_workflow_status",
                "latency": float(f"{(time.time() - start_time):.3f}"),
                "status": "success",
            },
        }
        
    except Exception as e:
        return {
            "error": str(e),
            "_meta": {
                "tool": "get_workflow_status",
                "latency": float(f"{(time.time() - start_time):.3f}"),
                "status": "error",
            },
        }


def cancel_workflow_tool(
    workflow_id: int,
    user_id: Optional[int] = None,
    db: Optional[Session] = None,
    **kwargs
) -> Dict[str, Any]:
    """
    Cancela un workflow en ejecución.
    
    Args:
        workflow_id: ID del workflow a cancelar
        user_id: ID del usuario (requerido)
        db: Sesión de base de datos (requerida)
    
    Returns:
        Dict con resultado de la cancelación
    """
    from app.db.models import Workflow
    from datetime import datetime
    
    start_time = time.time()
    
    try:
        if not db or user_id is None:
            return {"error": "user_id and db session required"}
        
        workflow = db.query(Workflow).filter(
            Workflow.id == workflow_id,
            Workflow.user_id == user_id
        ).first()
        
        if not workflow:
            return {"error": f"Workflow {workflow_id} not found"}
        
        if workflow.status == "completed":
            return {"error": "Cannot cancel a completed workflow"}
        
        workflow.status = "cancelled"
        workflow.updated_at = datetime.utcnow()
        workflow.metadata_json["cancelled_at"] = datetime.utcnow().isoformat()
        workflow.metadata_json["cancel_reason"] = kwargs.get("reason", "User requested")
        
        db.commit()
        
        return {
            "success": True,
            "message": f"Workflow {workflow_id} cancelado exitosamente",
            "workflow": {
                "id": str(workflow.id),
                "name": workflow.name,
                "status": workflow.status,
                "progress": workflow.progress
            },
            "_meta": {
                "tool": "cancel_workflow",
                "latency": float(f"{(time.time() - start_time):.3f}"),
                "status": "success",
            },
        }
        
    except Exception as e:
        return {
            "error": str(e),
            "_meta": {
                "tool": "cancel_workflow",
                "latency": float(f"{(time.time() - start_time):.3f}"),
                "status": "error",
            },
        }


def list_workflows_tool(
    user_id: Optional[int] = None,
    db: Optional[Session] = None,
    limit: int = 10,
    status_filter: Optional[str] = None,
    **kwargs
) -> Dict[str, Any]:
    """
    Lista workflows del usuario.
    
    Args:
        user_id: ID del usuario (requerido)
        db: Sesión de base de datos (requerida)
        limit: Máximo de workflows a retornar
        status_filter: Filtrar por estado (pending, running, completed, cancelled, failed)
    
    Returns:
        Dict con lista de workflows
    """
    from app.db.models import Workflow
    
    start_time = time.time()
    
    try:
        if not db or user_id is None:
            return {"error": "user_id and db session required"}
        
        query = db.query(Workflow).filter(Workflow.user_id == user_id)
        
        if status_filter:
            query = query.filter(Workflow.status == status_filter)
        
        workflows = query.order_by(Workflow.created_at.desc()).limit(limit).all()
        
        return {
            "success": True,
            "workflows": [
                {
                    "id": str(wf.id),
                    "name": wf.name,
                    "type": wf.type,
                    "status": wf.status,
                    "progress": wf.progress,
                    "created_at": wf.created_at.isoformat(),
                    "completed_at": wf.completed_at.isoformat() if wf.completed_at else None
                }
                for wf in workflows
            ],
            "count": len(workflows),
            "_meta": {
                "tool": "list_workflows",
                "latency": float(f"{(time.time() - start_time):.3f}"),
                "status": "success",
            },
        }
        
    except Exception as e:
        return {
            "error": str(e),
            "_meta": {
                "tool": "list_workflows",
                "latency": float(f"{(time.time() - start_time):.3f}"),
                "status": "error",
            },
        }


# =============================================================================
# TOOL DEFINITIONS (JSON Schema para el LLM)
# =============================================================================

AGENT_TOOL_DEFINITIONS = [
    {
        "name": "get_clients_list",
        "description": (
            "Obtiene la lista de clientes registrados con su nombre, RFC, tipo "
            "(Persona Moral/Física), estatus (Activo/Inactivo/Prospecto) y fecha de registro."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "status_filter": {
                    "type": "string",
                    "enum": ["Activo", "Inactivo", "Prospecto", "all"],
                    "description": "Filtrar por estatus del cliente. Usa 'all' para ver todos.",
                },
            },
            "required": [],
        },
    },
    {
        "name": "get_client_expediente",
        "description": (
            "Recupera el expediente completo de un cliente: documentos KYC, estado de "
            "cumplimiento, facturas procesadas y observaciones."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "client_id": {
                    "type": "string",
                    "description": "ID único del cliente",
                },
                "rfc": {
                    "type": "string",
                    "description": "RFC del cliente (alternativa al ID)",
                },
            },
            "required": [],
        },
    },
    {
        "name": "update_client_status",
        "description": (
            "Actualiza el estatus de un cliente (Activo, Inactivo, Prospecto) "
            "tras validar documentos o cumplimiento fiscal."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "client_id": {
                    "type": "string",
                    "description": "ID del cliente a actualizar",
                },
                "new_status": {
                    "type": "string",
                    "enum": ["Activo", "Inactivo", "Prospecto"],
                    "description": "Nuevo estatus del cliente",
                },
                "reason": {
                    "type": "string",
                    "description": "Razón del cambio de estatus",
                },
            },
            "required": ["client_id", "new_status"],
        },
    },
    {
        "name": "analyze_cfdi",
        "description": (
            "Analiza un CFDI (XML de factura) para extraer y validar: "
            "UUID, RFC emisor/receptor, montos, impuestos y estatus de vigencia."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "document_id": {
                    "type": "string",
                    "description": "ID del documento almacenado en el sistema",
                },
                "file_path": {
                    "type": "string",
                    "description": "Ruta al archivo XML (alternativa al ID)",
                },
            },
            "required": [],
        },
    },
    {
        "name": "validate_sat_status",
        "description": (
            "Valida la situación fiscal de un contribuyente en el SAT. "
            "Verifica: opinión de cumplimiento, estatus de RFC y obligaciones."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "rfc": {
                    "type": "string",
                    "description": "RFC del contribuyente a consultar",
                },
            },
            "required": ["rfc"],
        },
    },
    {
        "name": "search_documents",
        "description": (
            "Busca documentos procesados en la base de datos por tipo, fecha o cliente. "
            "Útil para encontrar facturas, constancias o acuses."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "Texto de búsqueda",
                },
                "document_type": {
                    "type": "string",
                    "enum": ["factura", "constancia", "acuse", "opinion", "all"],
                    "description": "Tipo de documento a buscar",
                },
                "limit": {
                    "type": "integer",
                    "description": "Número máximo de resultados (default: 10)",
                },
            },
            "required": ["query"],
        },
    },
    {
        "name": "internet_search",
        "description": (
            "Busca en internet noticias fiscales, reglamentaciones del SAT o "
            "actualizaciones contables recientes en México."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "Texto de búsqueda (ej: 'reformas fiscales 2026 México')",
                },
            },
            "required": ["query"],
        },
    },
    {
        "name": "get_current_time",
        "description": "Obtiene la fecha y hora actual del sistema.",
        "parameters": {
            "type": "object",
            "properties": {},
            "required": [],
        },
    },
    {
        "name": "list_directory",
        "description": "Lista los archivos en un directorio específico permitido.",
        "parameters": {
            "type": "object",
            "properties": {
                "path": {
                    "type": "string",
                    "description": "Ruta relativa o absoluta permitida",
                },
            },
            "required": ["path"],
        },
    },
    {
        "name": "read_file",
        "description": "Lee el contenido de un archivo de texto.",
        "parameters": {
            "type": "object",
            "properties": {
                "path": {
                    "type": "string",
                    "description": "Ruta al archivo",
                },
            },
            "required": ["path"],
        },
    },
    {
        "name": "sync_sat_documents",
        "description": (
            "Inicia o verifica una sincronía masiva con el SAT usando la e.firma del cliente. "
            "Permite descargar CFDIs emitidos o recibidos en un rango de fechas."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "rfc": {
                    "type": "string",
                    "description": "RFC del cliente a sincronizar",
                },
                "start_date": {
                    "type": "string",
                    "description": "Fecha inicial (YYYY-MM-DD)",
                },
                "end_date": {
                    "type": "string",
                    "description": "Fecha final (YYYY-MM-DD)",
                },
                "type": {
                    "type": "string",
                    "enum": ["Emitidos", "Recibidos"],
                    "description": "Tipo de comprobantes a descargar",
                },
            },
            "required": ["rfc", "start_date", "end_date"],
        },
    },
    # Calendar Management Tools
    {
        "name": "create_calendar_event",
        "description": (
            "Crea un nuevo evento en el calendario fiscal del usuario. "
            "Útil para agendar declaraciones, pagos provisionales, presentaciones de contabilidad, etc."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "title": {
                    "type": "string",
                    "description": "Título del evento (ej: 'Declaración Mensual IVA', 'Entrega de contabilidad')",
                },
                "date": {
                    "type": "string",
                    "description": "Fecha del evento en formato YYYY-MM-DD",
                },
                "type": {
                    "type": "string",
                    "enum": ["fiscal", "nomina", "seguridad_social", "cliente"],
                    "description": "Tipo de evento",
                },
                "priority": {
                    "type": "string",
                    "enum": ["alta", "media", "baja"],
                    "description": "Prioridad del evento",
                },
                "description": {
                    "type": "string",
                    "description": "Descripción opcional del evento",
                },
            },
            "required": ["title", "date"],
        },
    },
    {
        "name": "update_calendar_event",
        "description": (
            "Actualiza un evento existente del calendario fiscal. "
            "Puedes cambiar el estado a 'completado', modificar la fecha, o actualizar la prioridad."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "event_id": {
                    "type": "integer",
                    "description": "ID del evento a actualizar",
                },
                "status": {
                    "type": "string",
                    "enum": ["pendiente", "completado", "en_preparacion", "vencido"],
                    "description": "Nuevo estado del evento",
                },
                "title": {
                    "type": "string",
                    "description": "Nuevo título del evento",
                },
                "date": {
                    "type": "string",
                    "description": "Nueva fecha del evento (YYYY-MM-DD)",
                },
                "priority": {
                    "type": "string",
                    "enum": ["alta", "media", "baja"],
                    "description": "Nueva prioridad del evento",
                },
            },
            "required": ["event_id"],
        },
    },
    {
        "name": "delete_calendar_event",
        "description": (
            "Elimina un evento del calendario fiscal. "
            "Úsalo cuando el usuario cancele una declaración o tarea programada."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "event_id": {
                    "type": "integer",
                    "description": "ID del evento a eliminar",
                },
            },
            "required": ["event_id"],
        },
    },
    {
        "name": "list_calendar_events",
        "description": (
            "Lista los eventos próximos del calendario fiscal del usuario. "
            "Muestra declaraciones, pagos, y tareas contables programadas."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "limit": {
                    "type": "integer",
                    "description": "Máximo número de eventos a retornar (default: 10)",
                },
            },
            "required": [],
        },
    },
    # Workflow Management Tools
    {
        "name": "execute_workflow",
        "description": (
            "Ejecuta un nuevo workflow automatizado. "
            "Útil para procesamiento de documentos, conciliación bancaria, cierres mensuales, etc."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "workflow_name": {
                    "type": "string",
                    "description": "Nombre del workflow (ej: 'Cierre Mensual Marzo 2026')",
                },
                "workflow_type": {
                    "type": "string",
                    "enum": ["idp_ocr", "bank_reconciliation", "cierre_mensual", "validacion_sat"],
                    "description": "Tipo de workflow a ejecutar",
                },
                "metadata": {
                    "type": "object",
                    "description": "Datos adicionales según el tipo (document_ids, month, year, etc)",
                },
            },
            "required": ["workflow_name", "workflow_type"],
        },
    },
    {
        "name": "get_workflow_status",
        "description": (
            "Obtiene el estatus actual de un workflow. "
            "Muestra progreso, estado, y detalles de ejecución."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "workflow_id": {
                    "type": "integer",
                    "description": "ID del workflow a consultar",
                },
            },
            "required": ["workflow_id"],
        },
    },
    {
        "name": "cancel_workflow",
        "description": (
            "Cancela un workflow en ejecución. "
            "Solo se puede cancelar si está en estado 'pending' o 'running'."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "workflow_id": {
                    "type": "integer",
                    "description": "ID del workflow a cancelar",
                },
                "reason": {
                    "type": "string",
                    "description": "Razón de la cancelación",
                },
            },
            "required": ["workflow_id"],
        },
    },
    {
        "name": "list_workflows",
        "description": (
            "Lista los workflows del usuario. "
            "Muestra historial de workflows ejecutados, en progreso y completados."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "limit": {
                    "type": "integer",
                    "description": "Máximo de workflows a retornar (default: 10)",
                },
                "status_filter": {
                    "type": "string",
                    "enum": ["pending", "running", "completed", "cancelled", "failed"],
                    "description": "Filtrar por estado del workflow",
                },
            },
            "required": [],
        },
    },
]


# =============================================================================
# TOOL EXECUTORS (Funciones reales que el backend ejecuta)
# =============================================================================

def _execute_get_clients_list(
    db: Session, user_id: int, params: Dict[str, Any]
) -> Dict[str, Any]:
    """Ejecuta la búsqueda de clientes en la base de datos."""
    # TODO: Crear modelo Client cuando se implemente la tabla de clientes
    # Por ahora retornamos datos de ejemplo basados en la UI
    clients = [
        {
            "id": "1",
            "name": "Servicios Contables del Norte SA de CV",
            "rfc": "SCN210101ABC",
            "type": "Persona Moral",
            "status": "Activo",
            "kyc_status": "Completo",
            "email": "contacto@scn.mx",
            "last_audit": "2026-01-15",
        },
        {
            "id": "2",
            "name": "María González López",
            "rfc": "GOLM900215PQ3",
            "type": "Persona Física",
            "status": "Activo",
            "kyc_status": "Pendiente",
            "email": "maria@gmail.com",
            "last_audit": "2025-12-01",
        },
        {
            "id": "3",
            "name": "Tech Solutions MX SA de CV",
            "rfc": "TSM180601XY9",
            "type": "Persona Moral",
            "status": "Inactivo",
            "kyc_status": "Revision",
            "email": "admin@techsolutions.mx",
            "last_audit": "2025-09-20",
        },
    ]

    status_filter = params.get("status_filter", "all")
    if status_filter and status_filter != "all":
        clients = [c for c in clients if c["status"] == status_filter]

    return {
        "total": len(clients),
        "clients": clients,
        "timestamp": datetime.utcnow().isoformat(),
    }


def _execute_get_client_expediente(
    db: Session, user_id: int, params: Dict[str, Any]
) -> Dict[str, Any]:
    """Recupera el expediente del cliente."""
    client_id = params.get("client_id", "")
    rfc = params.get("rfc", "")

    # TODO: Consultar tabla real de clientes y expedientes
    return {
        "client_id": client_id or "1",
        "rfc": rfc or "SCN210101ABC",
        "name": "Servicios Contables del Norte SA de CV",
        "kyc_documents": [
            {"name": "Constancia de Situación Fiscal", "status": "Vigente", "expires": "2026-06-30"},
            {"name": "Opinión de Cumplimiento", "status": "Vigente", "expires": "2026-03-31"},
            {"name": "Acta Constitutiva", "status": "Completo", "expires": None},
            {"name": "INE Representante Legal", "status": "Pendiente", "expires": None},
        ],
        "processed_invoices": 47,
        "pending_issues": 1,
        "last_update": "2026-03-01",
    }


def _execute_update_client_status(
    db: Session, user_id: int, params: Dict[str, Any]
) -> Dict[str, Any]:
    """Actualiza el estatus de un cliente."""
    client_id = params.get("client_id", "")
    new_status = params.get("new_status", "")
    reason = params.get("reason", "Sin razón especificada")

    # TODO: Actualizar en la tabla real de clientes
    return {
        "success": True,
        "client_id": client_id,
        "previous_status": "Inactivo",
        "new_status": new_status,
        "reason": reason,
        "updated_at": datetime.utcnow().isoformat(),
        "updated_by": f"user_{user_id}",
    }


def _execute_analyze_cfdi(
    db: Session, user_id: int, params: Dict[str, Any]
) -> Dict[str, Any]:
    """Analiza un CFDI/factura XML."""
    document_id = params.get("document_id", "")
    file_path = params.get("file_path", "")

    # TODO: Integrar con NIMExtractionService y parseo de XML
    return {
        "document_id": document_id or "doc-xyz",
        "folio": "A-1234",
        "uuid": "6B2A4F8C-1D3E-4A5B-9C7D-2E6F8A0B3C5D",
        "fecha": "2026-02-15",
        "rfc_emisor": "SCN210101ABC",
        "nombre_emisor": "Servicios Contables del Norte SA de CV",
        "rfc_receptor": "GOLM900215PQ3",
        "nombre_receptor": "María González López",
        "subtotal": 15000.00,
        "iva": 2400.00,
        "total": 17400.00,
        "moneda": "MXN",
        "tipo_comprobante": "Ingreso",
        "concepto": "Servicios de consultoría contable",
        "sat_status": "Vigente",
        "is_deductible": True,
        "deductibility_notes": "Deducible según Art. 27 LISR - Gastos de servicios profesionales",
    }


def _execute_validate_sat_status(
    db: Session, user_id: int, params: Dict[str, Any]
) -> Dict[str, Any]:
    """Valida el estatus en el SAT."""
    rfc = params.get("rfc", "")

    # TODO: Integrar con API real del SAT o servicio de scraping
    return {
        "rfc": rfc,
        "nombre": "Servicios Contables del Norte SA de CV",
        "situacion_fiscal": "Activo",
        "opinion_cumplimiento": "Positiva",
        "fecha_consulta": datetime.utcnow().isoformat(),
        "obligaciones": [
            {"impuesto": "ISR", "status": "Al corriente"},
            {"impuesto": "IVA", "status": "Al corriente"},
            {"impuesto": "IMSS", "status": "Al corriente"},
        ],
        "domicilio_fiscal": "Monterrey, Nuevo León",
        "regimen_fiscal": "601 - General de Ley Personas Morales",
    }


def _execute_search_documents(
    db: Session, user_id: int, params: Dict[str, Any]
) -> Dict[str, Any]:
    """Busca documentos procesados en la base de datos."""
    query = params.get("query", "")
    doc_type = params.get("document_type", "all")
    limit = params.get("limit", 10)

    # Buscar documentos reales en la DB
    db_query = db.query(Document).filter(Document.user_id == user_id)

    if doc_type and doc_type != "all":
        db_query = db_query.filter(Document.document_type == doc_type)

    documents = db_query.order_by(Document.created_at.desc()).limit(limit).all()

    results = []
    for doc in documents:
        results.append({
            "id": str(doc.id),
            "type": doc.document_type,
            "filename": doc.original_filename,
            "status": doc.status,
            "confidence": doc.confidence_score,
            "extracted_data": doc.extracted_data,
            "created_at": doc.created_at.isoformat() if doc.created_at else None,
        })

    return {
        "total": len(results),
        "query": query,
        "documents": results,
    }


def _execute_internet_search(
    db: Session, user_id: int, params: Dict[str, Any]
) -> Dict[str, Any]:
    """Ejecuta una búsqueda en internet usando Tavily."""
    query = params.get("query")
    if not query:
        return {"error": "Falta el parámetro 'query'"}

    api_key = settings.TAVILY_API_KEY
    if not api_key:
        return {"error": "TAVILY_API_KEY no configurado en el servidor."}

    try:
        url = "https://api.tavily.com/search"
        payload = {
            "api_key": api_key,
            "query": query,
            "search_depth": "smart",
            "max_results": 5
        }
        response = requests.post(url, json=payload, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        results = []
        for result in data.get("results", []):
            results.append({
                "title": result.get("title"),
                "url": result.get("url"),
                "content": result.get("content", "")[:500] if result.get("content") else "" # Truncar para el modelo
            })
            
        return {
            "results": results,
            "summary": "Búsqueda completada exitosamente.",
            "source": "Tavily Search API"
        }
    except Exception as e:
        return {"error": f"Error en la búsqueda: {str(e)}"}


def _execute_sync_sat_documents(
    db: Session, user_id: int, params: Dict[str, Any]
) -> Dict[str, Any]:
    """Inicia sincronía con el SAT."""
    # TODO: Instanciar SATMassiveDownloadClient con credenciales del usuario
    return {
        "status": "Iniciado",
        "request_id": "REQ-SAT-2026-VAL-999",
        "message": "La solicitud de descarga masiva ha sido enviada al SAT. El proceso puede tardar de 1 a 24 horas."
    }


# =============================================================================
# TOOL REGISTRY
# =============================================================================


def _execute_get_current_time(
    db: Session, user_id: int, params: Dict[str, Any]
) -> Dict[str, Any]:
    """Retorna la hora actual."""
    now = datetime.now()
    return {
        "timestamp": now.isoformat(),
        "readable": now.strftime("%Y-%m-%d %H:%M:%S"),
        "timezone": "Local"
    }


def _execute_list_directory(
    db: Session, user_id: int, params: Dict[str, Any]
) -> Dict[str, Any]:
    """Lista archivos en un directorio."""
    path = params.get("path", ".")
    try:
        # Validación básica de seguridad
        if ".." in path:
            return {"error": "Acceso no permitido: navegación superior detectada."}
            
        files = os.listdir(path)
        items = []
        for f in files:
            full_path = os.path.join(path, f)
            items.append({
                "name": f,
                "is_dir": os.path.isdir(full_path),
                "size": os.path.getsize(full_path) if os.path.isfile(full_path) else None
            })
        return {"directory": path, "items": items}
    except Exception as e:
        return {"error": str(e)}


def _execute_read_file(
    db: Session, user_id: int, params: Dict[str, Any]
) -> Dict[str, Any]:
    """Lee un archivo."""
    path = params.get("path")
    try:
        if not path:
            return {"error": "Ruta no proporcionada."}
            
        if ".." in str(path):
            return {"error": "Ruta inválida o no permitida."}
            
        with open(str(path), "r", encoding="utf-8") as f:
            content = f.read()
        return {"path": str(path), "content": content}
    except Exception as e:
        return {"error": str(e)}


# Mapeo de nombres de herramientas a sus funciones ejecutoras
TOOL_EXECUTORS: Dict[str, Callable] = {
    "get_clients_list": _execute_get_clients_list,
    "get_client_expediente": _execute_get_client_expediente,
    "update_client_status": _execute_update_client_status,
    "analyze_cfdi": _execute_analyze_cfdi,
    "validate_sat_status": _execute_validate_sat_status,
    "search_documents": _execute_search_documents,
    "internet_search": _execute_internet_search,
    "get_current_time": _execute_get_current_time,
    "list_directory": _execute_list_directory,
    "read_file": _execute_read_file,
    "sync_sat_documents": _execute_sync_sat_documents,
    # Calendar tools
    "create_calendar_event": create_calendar_event_tool,
    "update_calendar_event": update_calendar_event_tool,
    "delete_calendar_event": delete_calendar_event_tool,
    "list_calendar_events": list_calendar_events_tool,
    # Workflow tools
    "execute_workflow": execute_workflow_tool,
    "get_workflow_status": get_workflow_status_tool,
    "cancel_workflow": cancel_workflow_tool,
    "list_workflows": list_workflows_tool,
}

def execute_tool(
    tool_name: str,
    params: Dict[str, Any],
    db: Session,
    user_id: int,
) -> Dict[str, Any]:
    """
    Ejecuta una herramienta del agente por nombre.

    Args:
        tool_name: Nombre de la herramienta a ejecutar
        params: Parámetros de la herramienta
        db: Sesión de base de datos
        user_id: ID del usuario que ejecuta

    Returns:
        Dict con resultado de la ejecución

    Raises:
        ValueError: Si la herramienta no existe
    """
    executor = TOOL_EXECUTORS.get(tool_name)
    if not executor:
        available = ", ".join(TOOL_EXECUTORS.keys())
        raise ValueError(
            f"Herramienta '{tool_name}' no encontrada. "
            f"Disponibles: {available}"
        )

    start_time = time.time()
    try:
        result = executor(db, user_id, params)
        result["_meta"] = {
            "tool": tool_name,
            "latency": float(f"{(time.time() - start_time):.3f}"),
            "status": "success",
        }
        return result
    except Exception as e:
        return {
            "error": str(e),
            "_meta": {
                "tool": tool_name,
                "latency": float(f"{(time.time() - start_time):.3f}"),
                "status": "error",
            },
        }


def get_tools_prompt_section() -> str:
    """
    Genera la sección del prompt del sistema que describe las herramientas disponibles.
    
    Returns:
        String con la descripción formateada de las herramientas
    """
    lines = ["## Herramientas Disponibles\n"]
    lines.append("Puedes usar las siguientes herramientas para consultar y modificar datos:\n")
    
    for tool_def in AGENT_TOOL_DEFINITIONS:
        if not isinstance(tool_def, dict):
            continue
        lines.append(f"### `{tool_def.get('name', 'unknown')}`")
        lines.append(f"{tool_def.get('description', '')}")
        
        params = tool_def.get("parameters", {})
        if not isinstance(params, dict):
            continue
            
        props = params.get("properties", {})
        if isinstance(props, dict) and props:
            lines.append("Parámetros:")
            for param_name, param_info in props.items():
                if isinstance(param_info, dict):
                    desc = param_info.get("description", "")
                    lines.append(f"  - `{param_name}`: {desc}")
        lines.append("")
    
    lines.append(
        "Para llamar a una herramienta, responde con un bloque JSON en el formato:\n"
        "```json\n"
        '{"tool": "nombre_herramienta", "params": {...}}\n'
        "```\n"
        "Después de recibir el resultado, razona sobre él y genera tu respuesta final al usuario.\n"
    )
    
    return "\n".join(lines)
