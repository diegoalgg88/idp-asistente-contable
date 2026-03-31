"""
Reconciliation Models
Modelos de base de datos para conciliación bancaria
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Float, Text, Numeric
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.db.database import Base


class BankStatementStatus(str, enum.Enum):
    """Estado de procesamiento de estado de cuenta"""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class MatchStatus(str, enum.Enum):
    """Estado de match de transacción"""
    UNMATCHED = "unmatched"
    EXACT = "exact"
    FUZZY = "fuzzy"
    LLM = "llm"
    HUMAN_REVIEW = "human_review"
    CONFIRMED = "confirmed"
    REJECTED = "rejected"


class BankStatement(Base):
    """
    BankStatement model
    
    Representa un estado de cuenta bancario subido por el usuario
    """
    __tablename__ = "bank_statements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    banco = Column(String, nullable=False)  # BBVA, Santander, Banorte, Citibanamex
    cuenta = Column(String)  # Número de cuenta (últimos 4 dígitos)
    fecha_inicio = Column(DateTime, nullable=False)
    fecha_fin = Column(DateTime, nullable=False)
    saldo_inicial = Column(Numeric(15, 2), nullable=False)
    saldo_final = Column(Numeric(15, 2), nullable=False)
    archivo_path = Column(String, nullable=False)
    archivo_nombre = Column(String)
    archivo_size = Column(Integer)  # bytes
    estado = Column(String, default=BankStatementStatus.PENDING)
    total_transacciones = Column(Integer, default=0)
    total_matches = Column(Integer, default=0)
    stmt_metadata = Column(JSON)  # Metadatos del parsing
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="bank_statements")
    transactions = relationship("BankTransaction", back_populates="bank_statement", cascade="all, delete-orphan")


class BankTransaction(Base):
    """
    BankTransaction model
    
    Representa una transacción individual de un estado de cuenta bancario
    """
    __tablename__ = "bank_transactions"

    id = Column(Integer, primary_key=True, index=True)
    bank_statement_id = Column(Integer, ForeignKey("bank_statements.id"), nullable=False)
    fecha = Column(DateTime, nullable=False, index=True)
    fecha_valor = Column(DateTime)  # Fecha de valor
    concepto = Column(Text, nullable=False)
    concepto_limpio = Column(Text)  # Concepto normalizado
    tipo = Column(String)  # cargo, abono
    monto = Column(Numeric(15, 2), nullable=False, index=True)
    saldo = Column(Numeric(15, 2))  # Saldo después de la transacción
    referencia = Column(String, index=True)  # Referencia bancaria
    proveedor = Column(String)  # Nombre del proveedor (extraído)
    rfc_proveedor = Column(String, index=True)  # RFC del proveedor
    estado_match = Column(String, default=MatchStatus.UNMATCHED, index=True)
    cfdi_id = Column(Integer, ForeignKey("documents.id"))  # CFDI matcheado
    puntuacion_confianza = Column(Float)  # Score de confianza del match
    revisado_por = Column(Integer, ForeignKey("users.id"))  # Usuario que revisó
    revisado_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    bank_statement = relationship("BankStatement", back_populates="transactions")
    match = relationship("ReconciliationMatch", back_populates="bank_transaction", uselist=False)
    reviewer = relationship("User", foreign_keys=[revisado_por])


class ReconciliationMatch(Base):
    """
    ReconciliationMatch model
    
    Representa un match entre una transacción bancaria y un CFDI
    """
    __tablename__ = "reconciliation_matches"

    id = Column(Integer, primary_key=True, index=True)
    bank_transaction_id = Column(Integer, ForeignKey("bank_transactions.id"), nullable=False, unique=True)
    cfdi_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    tipo_match = Column(String, nullable=False)  # exact, fuzzy, llm
    puntuacion_confianza = Column(Float, nullable=False)
    match_details = Column(JSON)  # Detalles del match (campos comparados)
    estado = Column(String, default="pending")  # pending, confirmed, rejected
    rechazo_razon = Column(Text)  # Razón de rechazo (si aplica)
    confirmado_por = Column(Integer, ForeignKey("users.id"))
    confirmado_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    bank_transaction = relationship("BankTransaction", back_populates="match")
    cfdi = relationship("Document", foreign_keys=[cfdi_id])
    confirmer = relationship("User", foreign_keys=[confirmado_por])


class ReconciliationBatch(Base):
    """
    ReconciliationBatch model
    
    Representa un lote de procesamiento de conciliación
    """
    __tablename__ = "reconciliation_batches"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    bank_statement_id = Column(Integer, ForeignKey("bank_statements.id"), nullable=False)
    estado = Column(String, default="pending")  # pending, processing, completed, failed
    total_transacciones = Column(Integer, default=0)
    total_matches_exact = Column(Integer, default=0)
    total_matches_fuzzy = Column(Integer, default=0)
    total_matches_llm = Column(Integer, default=0)
    total_unmatched = Column(Integer, default=0)
    progreso = Column(Float, default=0.0)  # 0-100
    iniciado_en = Column(DateTime)
    completado_en = Column(DateTime)
    mensaje_error = Column(Text)
    batch_metadata = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User")
    bank_statement = relationship("BankStatement")
