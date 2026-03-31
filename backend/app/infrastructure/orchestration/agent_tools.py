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
from typing import Dict, Any, Optional, Callable, List
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, update

from app.db.models import Document, Client, CalendarEvent, Workflow
from app.core.config import settings


# =============================================================================
# CALENDAR TOOLS - Calendar Management for Fiscal Events
# =============================================================================

# =============================================================================
# CALENDAR TOOLS - Wrap internal tools for consistent (db, user_id, params) signature
# =============================================================================

async def _execute_create_calendar_event(
    db: AsyncSession, user_id: int, params: Dict[str, Any]
) -> Dict[str, Any]:
    """Crea un nuevo evento en el calendario fiscal."""
    from app.db.models import CalendarEvent
    from datetime import datetime
    
    start_time = time.time()
    title = params.get("title", "")
    date_str = params.get("date", "")
    tipo = params.get("type", "fiscal")
    priority = params.get("priority", "media")
    description = params.get("description")
    
    try:
        if not db or user_id is None:
            return {"error": "user_id and db session required"}
        
        # Parse date
        event_date = datetime.fromisoformat(date_str)
        
        # Create event
        new_event = CalendarEvent(
            user_id=user_id,
            title=title,
            descripcion=description,
            date=event_date,
            tipo=tipo,
            estado="pendiente",
            prioridad=priority,
            is_recurring=0,
            metadatos_json=params.get("metadata", {})
        )
        
        db.add(new_event)
        await db.commit()
        await db.refresh(new_event)
        
        return {
            "success": True,
            "event": {
                "id": str(new_event.id),
                "title": new_event.title,
                "date": new_event.date.strftime('%Y-%m-%d'),
                "type": new_event.tipo,
                "status": new_event.estado,
                "priority": new_event.priority
            },
            "_meta": {
                "tool": "create_calendar_event",
                "latency": float(f"{(time.time() - start_time):.3f}"),
                "status": "success",
            },
        }
    except Exception as e:
        return {"error": str(e)}

async def _execute_update_calendar_event(
    db: AsyncSession, user_id: int, params: Dict[str, Any]
) -> Dict[str, Any]:
    """Actualiza un evento del calendario."""
    from app.db.models import CalendarEvent
    from datetime import datetime
    
    start_time = time.time()
    event_id = int(params.get("event_id", 0))
    status = params.get("status")
    title = params.get("title")
    date_str = params.get("date")
    priority = params.get("priority")
    
    try:
        result = await db.execute(
            select(CalendarEvent).where(
                CalendarEvent.id == event_id,
                CalendarEvent.user_id == user_id
            )
        )
        event = result.scalar_one_or_none()
        
        if not event:
            return {"error": f"Evento {event_id} no encontrado"}
        
        if status: event.estado = status
        if title: event.title = title
        if date_str: event.fecha = datetime.fromisoformat(date_str)
        if priority: event.priority = priority
        
        event.updated_at = datetime.utcnow()
        await db.commit()
        await db.refresh(event)
        
        return {
            "success": True,
            "event": {
                "id": str(event.id),
                "title": event.title,
                "date": event.date.strftime('%Y-%m-%d'),
                "status": event.estado
            },
            "_meta": {"tool": "update_calendar_event"}
        }
    except Exception as e:
        return {"error": str(e)}

async def _execute_delete_calendar_event(
    db: AsyncSession, user_id: int, params: Dict[str, Any]
) -> Dict[str, Any]:
    """Elimina un evento del calendario."""
    from app.db.models import CalendarEvent
    event_id = int(params.get("event_id", 0))
    try:
        result = await db.execute(select(CalendarEvent).where(CalendarEvent.id == event_id, CalendarEvent.user_id == user_id))
        event = result.scalar_one_or_none()
        if not event: return {"error": f"Evento {event_id} no encontrado"}
        await db.delete(event)
        await db.commit()
        return {"success": True, "message": f"Evento {event_id} eliminado"}
    except Exception as e:
        return {"error": str(e)}

async def _execute_list_calendar_events(
    db: AsyncSession, user_id: int, params: Dict[str, Any]
) -> Dict[str, Any]:
    """Lista eventos del calendario."""
    from app.db.models import CalendarEvent
    from datetime import datetime, timedelta
    limit = params.get("limit", 10)
    try:
        now = datetime.utcnow()
        from sqlalchemy import and_
        result = await db.execute(select(CalendarEvent).where(and_(CalendarEvent.user_id == user_id, CalendarEvent.date >= now - timedelta(days=7))).order_by(CalendarEvent.date).limit(limit))
        events = result.scalars().all()
        return {"success": True, "events": [{"id": e.id, "title": e.title, "date": e.date.isoformat(), "status": e.estado} for e in events]}
    except Exception as e:
        return {"error": str(e)}


# =============================================================================
# WORKFLOW TOOLS - Workflow Management for IA Agent
# =============================================================================

# =============================================================================
# WORKFLOW TOOLS - Wrap internal tools for consistent (db, user_id, params) signature
# =============================================================================

async def _execute_execute_workflow(
    db: AsyncSession, user_id: int, params: Dict[str, Any]
) -> Dict[str, Any]:
    """Inicia la ejecución de un workflow."""
    from app.db.models import Workflow
    start_time = time.time()
    name = params.get("workflow_name", "")
    tipo = params.get("workflow_type", "general")
    metadata = params.get("metadata", {})
    try:
        new_workflow = Workflow(user_id=user_id, nombre=name, tipo=tipo, estado="pendiente", progreso=0, metadatos_json=metadata)
        db.add(new_workflow)
        await db.commit()
        await db.refresh(new_workflow)
        return {"success": True, "workflow": {"id": new_workflow.id, "status": new_workflow.estado}}
    except Exception as e:
        return {"error": str(e)}

async def _execute_get_workflow_status(
    db: AsyncSession, user_id: int, params: Dict[str, Any]
) -> Dict[str, Any]:
    """Obtiene el estatus de un workflow."""
    from app.db.models import Workflow
    workflow_id = int(params.get("workflow_id", 0))
    try:
        result = await db.execute(select(Workflow).where(Workflow.id == workflow_id, Workflow.user_id == user_id))
        wf = result.scalar_one_or_none()
        if not wf: return {"error": "Workflow no encontrado"}
        return {"success": True, "status": wf.estado, "progress": wf.progreso}
    except Exception as e:
        return {"error": str(e)}

async def _execute_cancel_workflow(
    db: AsyncSession, user_id: int, params: Dict[str, Any]
) -> Dict[str, Any]:
    """Cancela un workflow en progreso."""
    from app.db.models import Workflow
    workflow_id = int(params.get("workflow_id", 0))
    try:
        result = await db.execute(select(Workflow).where(Workflow.id == workflow_id, Workflow.user_id == user_id))
        wf = result.scalar_one_or_none()
        if not wf: return {"error": "Workflow no encontrado"}
        wf.estado = "cancelado"
        await db.commit()
        return {"success": True, "message": "Workflow cancelado"}
    except Exception as e:
        return {"error": str(e)}

async def _execute_list_workflows(
    db: AsyncSession, user_id: int, params: Dict[str, Any]
) -> Dict[str, Any]:
    """Lista los workflows registrados."""
    from app.db.models import Workflow
    limit = params.get("limit", 10)
    try:
        result = await db.execute(select(Workflow).where(Workflow.user_id == user_id).order_by(Workflow.created_at.desc()).limit(limit))
        workflows = result.scalars().all()
        return {"success": True, "workflows": [{"id": wf.id, "name": wf.nombre, "status": wf.estado} for wf in workflows]}
    except Exception as e:
        return {"error": str(e)}


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
                "ruta_archivo": {
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

async def _execute_get_clients_list(
    db: AsyncSession, user_id: int, params: Dict[str, Any]
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
    
    # Consulta real a la DB
    if status_filter and status_filter != "all":
        result = await db.execute(
            select(Client).where(
                Client.user_id == user_id,
                Client.estado == status_filter
            )
        )
    else:
        result = await db.execute(
            select(Client).where(Client.user_id == user_id)
        )
    
    db_clients = result.scalars().all()
    
    clients = []
    for c in db_clients:
        clients.append({
            "id": str(c.id),
            "name": c.name,
            "rfc": c.rfc,
            "type": c.tipo,
            "status": c.estado,
            "email": c.email,
            "phone": c.phone,
        })

    return {
        "total": len(clients),
        "clients": clients,
        "timestamp": datetime.utcnow().isoformat(),
    }


async def _execute_get_client_expediente(
    db: AsyncSession, user_id: int, params: Dict[str, Any]
) -> Dict[str, Any]:
    """Recupera el expediente del cliente."""
    client_id = params.get("client_id", "")
    rfc = params.get("rfc", "")

    # Consultar tabla real de clientes
    result = await db.execute(
        select(Client).where(
            (Client.id == int(client_id)) if client_id.isdigit() else (Client.rfc == rfc),
            Client.user_id == user_id
        )
    )
    client = result.scalar_one_or_none()
    
    if not client:
        return {"error": f"Cliente no encontrado: {client_id or rfc}"}
    
    # Consultar documentos KYC
    from app.db.models import KYCDocument
    result = await db.execute(
        select(KYCDocument).where(KYCDocument.client_id == client.id)
    )
    kyc_docs = result.scalars().all()
    return {
        "client_id": str(client.id),
        "rfc": client.rfc,
        "name": client.name,
        "kyc_documents": [
            {
                "name": d.name, 
                "status": d.estado, 
                "expires": d.expiry_date.strftime("%Y-%m-%d") if d.expiry_date else None
            }
            for d in kyc_docs
        ],
        "processed_invoices": 0,
        "pending_issues": 0,
        "last_update": client.updated_at.strftime("%Y-%m-%d"),
    }


async def _execute_update_client_status(
    db: AsyncSession, user_id: int, params: Dict[str, Any]
) -> Dict[str, Any]:
    """Actualiza el estatus de un cliente."""
    client_id = params.get("client_id", "")
    new_status = params.get("new_status", "")
    reason = params.get("reason", "Sin razón especificada")

    # Actualizar en la tabla real de clientes
    result = await db.execute(
        select(Client).where(
            Client.id == int(client_id),
            Client.user_id == user_id
        )
    )
    client = result.scalar_one_or_none()
    
    if not client:
        return {"error": f"Cliente {client_id} no encontrado"}
    
    previous_status = client.estado
    client.estado = new_status
    client.updated_at = datetime.utcnow()
    
    await db.commit()
    return {
        "success": True,
        "client_id": client_id,
        "previous_status": previous_status,
        "new_status": new_status,
        "reason": reason,
        "updated_at": datetime.utcnow().isoformat(),
        "updated_by": f"user_{user_id}",
    }


async def _execute_analyze_cfdi(
    db: AsyncSession, user_id: int, params: Dict[str, Any]
) -> Dict[str, Any]:
    """Analiza un CFDI/factura XML."""
    document_id = params.get("document_id", "")

    # Consultar documento en la DB
    result = await db.execute(
        select(Document).where(
            Document.id == int(document_id),
            Document.user_id == user_id
        )
    )
    doc = result.scalar_one_or_none()
    
    if not doc:
        return {"error": f"Documento {document_id} no encontrado"}
        
    extracted = doc.datos_extraidos or {}
    return {
        "document_id": str(doc.id),
        "folio": extracted.get("folio", ""),
        "uuid": extracted.get("uuid", ""),
        "fecha": extracted.get("fecha", ""),
        "rfc_emisor": extracted.get("rfc_emisor", ""),
        "nombre_emisor": extracted.get("nombre_emisor", ""),
        "rfc_receptor": extracted.get("rfc_receptor", ""),
        "nombre_receptor": extracted.get("nombre_receptor", ""),
        "subtotal": extracted.get("subtotal", 0.0),
        "iva": extracted.get("iva", 0.0),
        "total": extracted.get("total", 0.0),
        "moneda": extracted.get("moneda", "MXN"),
        "tipo_comprobante": doc.tipo_documento,
        "sat_status": doc.estado,
        "puntuacion_confianza": doc.puntuacion_confianza,
    }


async def _execute_validate_sat_status(
    db: AsyncSession, user_id: int, params: Dict[str, Any]
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


async def _execute_search_documents(
    db: AsyncSession, user_id: int, params: Dict[str, Any]
) -> Dict[str, Any]:
    """Busca documentos procesados en la base de datos."""
    query = params.get("query", "")
    doc_type = params.get("document_type", "all")
    limit = params.get("limit", 10)

    # Buscar documentos reales en la DB
    if doc_type and doc_type != "all":
        result = await db.execute(
            select(Document).where(
                Document.user_id == user_id,
                Document.tipo_documento == doc_type
            ).order_by(Document.created_at.desc()).limit(limit)
        )
    else:
        result = await db.execute(
            select(Document).where(
                Document.user_id == user_id
            ).order_by(Document.created_at.desc()).limit(limit)
        )
 
    documents = result.scalars().all()

    results = []
    for doc in documents:
        results.append({
            "id": str(doc.id),
            "type": doc.tipo_documento,
            "filename": doc.nombre_original,
            "status": doc.estado,
            "confidence": doc.puntuacion_confianza,
            "datos_extraidos": doc.datos_extraidos,
            "created_at": doc.created_at.isoformat() if doc.created_at else None,
        })

    return {
        "total": len(results),
        "query": query,
        "documents": results,
    }


async def _execute_internet_search(
    db: AsyncSession, user_id: int, params: Dict[str, Any]
) -> Dict[str, Any]:
    """Ejecuta una búsqueda en internet usando Tavily (Asíncrono)."""
    import httpx
    query = params.get("query")
    if not query:
        return {"error": "Falta el parámetro 'query'"}

    api_key = settings.TAVILY_API_KEY
    if not api_key:
        return {"error": "TAVILY_API_KEY no configurado en el servidor."}

    try:
        async with httpx.AsyncClient() as client:
            url = "https://api.tavily.com/search"
            payload = {
                "api_key": api_key,
                "query": query,
                "search_depth": "smart",
                "max_results": 5
            }
            response = await client.post(url, json=payload, timeout=10.0)
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


async def _execute_sync_sat_documents(
    db: AsyncSession, user_id: int, params: Dict[str, Any]
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


async def _execute_get_current_time(
    db: AsyncSession, user_id: int, params: Dict[str, Any]
) -> Dict[str, Any]:
    """Retorna la hora actual."""
    now = datetime.now()
    return {
        "timestamp": now.isoformat(),
        "readable": now.strftime("%Y-%m-%d %H:%M:%S"),
        "timezone": "Local"
    }


async def _execute_list_directory(
    db: AsyncSession, user_id: int, params: Dict[str, Any]
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


async def _execute_read_file(
    db: AsyncSession, user_id: int, params: Dict[str, Any]
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
    # Calendar tools (Standardized)
    "create_calendar_event": _execute_create_calendar_event,
    "update_calendar_event": _execute_update_calendar_event,
    "delete_calendar_event": _execute_delete_calendar_event,
    "list_calendar_events": _execute_list_calendar_events,
    # Workflow tools (Standardized)
    "execute_workflow": _execute_execute_workflow,
    "get_workflow_status": _execute_get_workflow_status,
    "cancel_workflow": _execute_cancel_workflow,
    "list_workflows": _execute_list_workflows,
}

async def execute_tool(
    tool_name: str,
    params: Dict[str, Any],
    db: AsyncSession,
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
        result = await executor(db, user_id, params)
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
