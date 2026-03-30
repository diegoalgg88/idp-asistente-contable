"""
SQLAlchemy Models
Modelos de base de datos para la aplicación
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Float, Text
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.database import Base


class User(Base):
    """User model"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    is_active = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    documents = relationship("Document", back_populates="user")
    conversations = relationship("Conversation", back_populates="user")
    bank_statements = relationship("BankStatement", back_populates="user")
    clients = relationship("Client", back_populates="user")
    calendar_events = relationship("CalendarEvent", back_populates="user", order_by="CalendarEvent.date")
    workflows = relationship("Workflow", back_populates="user", order_by="Workflow.created_at.desc()")


class Document(Base):
    """Document model for processed contable documents"""
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    document_type = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    original_filename = Column(String)
    extracted_data = Column(JSON)
    confidence_score = Column(Float)
    status = Column(String, default="pending")  # pending, processing, completed, failed
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="documents")
    bank_matches = relationship("ReconciliationMatch", back_populates="cfdi")


class Conversation(Base):
    """Conversation model for chat history"""
    __tablename__ = "conversations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", order_by="Message.created_at")


class Message(Base):
    """Message model for conversation messages"""
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=False)
    role = Column(String, nullable=False)  # user, assistant, system
    content = Column(Text, nullable=False)
    msg_metadata = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    conversation = relationship("Conversation", back_populates="messages")


class Client(Base):
    """Client model - Personas Físicas o Morales gestionadas por el despacho"""
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    type = Column(String)  # Moral, Física
    rfc = Column(String, index=True)
    status = Column(String)  # Activo, Inactivo, Prospecto
    email = Column(String)
    phone = Column(String)
    regime = Column(String)
    kyc_status = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="clients")
    kyc_documents = relationship("KYCDocument", back_populates="client")


class KYCDocument(Base):
    """KYC Document model - Documentación legal del cliente (SAT ID, Opinión 32D, etc)"""
    __tablename__ = "kyc_documents"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    name = Column(String, nullable=False)
    status = Column(String)  # Vigente, Pendiente, Sin iniciar, Revisión
    expiry_date = Column(DateTime)
    file_path = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    client = relationship("Client", back_populates="kyc_documents")


class UserSettings(Base):
    """User settings model for persistent workspace preferences"""
    __tablename__ = "user_settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    language = Column(String, default="es-MX")
    notifications = Column(Integer, default=1)  # 1 for True, 0 for False
    dark_mode = Column(Integer, default=1)
    workspace_layout = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class CalendarEvent(Base):
    """Calendar Event model - Eventos del calendario fiscal del usuario"""
    __tablename__ = "calendar_events"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    date = Column(DateTime, nullable=False)
    type = Column(String, default="fiscal")  # fiscal, nomina, seguridad_social, cliente
    status = Column(String, default="pendiente")  # pendiente, completado, en_preparacion, vencido
    priority = Column(String, default="media")  # alta, media, baja
    is_recurring = Column(Integer, default=0)  # 1 for True, 0 for False
    recurring_pattern = Column(String)  # monthly, yearly, weekly
    metadata_json = Column(JSON)  # Datos adicionales (RFC, periodo, etc)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="calendar_events")


class Workflow(Base):
    """Workflow model - Procesos automatizados del sistema"""
    __tablename__ = "workflows"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text)
    type = Column(String, default="general")  # cierre_mensual, validacion_sat, conciliacion
    status = Column(String, default="pending")  # pending, running, completed, failed
    progress = Column(Integer, default=0)  # 0-100 porcentaje
    steps_total = Column(Integer, default=0)
    steps_completed = Column(Integer, default=0)
    metadata_json = Column(JSON)  # Datos del workflow
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="workflows")


# Add relationship to User model
User.calendar_events = relationship("CalendarEvent", back_populates="user", order_by="CalendarEvent.date")
User.workflows = relationship("Workflow", back_populates="user", order_by="Workflow.created_at.desc()")
