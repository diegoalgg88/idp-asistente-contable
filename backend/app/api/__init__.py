"""
API Routes Package - IDP Asistente Contable
Paquete de endpoints de la API REST para el asistente contable.

Endpoints disponibles:
- auth: Autenticación y autorización
- idp: Procesamiento de documentos
- chat: Conversaciones con el asistente
- agent: Gestión de agentes
- workspace: Gestión de espacio de trabajo
- clients: Gestión de clientes
- fiscal: Operaciones fiscales
- payroll: Nómina
- finance: Finanzas
- expenses: Gastos
- users: Gestión de usuarios
- rag: Retrieval-Augmented Generation con ChromaDB
"""

from app.api import (
    auth,
    idp,
    chat,
    agent,
    workspace,
    clients,
    fiscal,
    payroll,
    finance,
    expenses,
    users,
    rag,
)

__all__ = [
    "auth",
    "idp",
    "chat",
    "agent",
    "workspace",
    "clients",
    "fiscal",
    "payroll",
    "finance",
    "expenses",
    "users",
    "rag",
]
