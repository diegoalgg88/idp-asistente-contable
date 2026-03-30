# 📊 Análisis Técnico Exhaustivo - Sección 4-10
## IDP-App - Asistente Contable con IA para México

**Fecha:** 10 de marzo de 2026  
**Versión:** 1.0  
**Complemento de:** `ANALISIS_TECNICO_EXHAUSTIVO.md`

---

## 4. Arquitectura de IA Detallada

### 4.1 Workflows LangGraph

#### A. Workflow de Conciliación Bancaria

```python
# backend/app/agents/conciliation_agent.py

from langgraph.graph import StateGraph, END
from typing import TypedDict, List, Annotated, Optional
from datetime import datetime
from enum import Enum

# Estado tipado del workflow
class ConciliationState(TypedDict):
    tenant_id: str
    bank_statement_id: str
    account_id: str
    period_start: datetime
    period_end: datetime
    transactions: List[dict]
    invoices: List[dict]
    matches: List[dict]
    anomalies: dict
    report: dict
    status: str
    error: Optional[str]
    requires_human_review: bool

# Nodos del grafo
def parse_bank_statement(state: ConciliationState):
    """
    Nodo 1: Parsea el estado de cuenta y extrae transacciones.
    Soporta: PDF (OCR), CSV, XLSX
    """
    from app.services.reconciliation.bank_statement_parser import parse_statement
    
    try:
        transactions = parse_statement(state["bank_statement_id"])
        return {
            "transactions": transactions,
            "status": "parsing_complete",
            "error": None
        }
    except Exception as e:
        return {
            "status": "error",
            "error": f"Error parsing bank statement: {str(e)}"
        }

def extract_invoices(state: ConciliationState):
    """
    Nodo 2: Extrae facturas del periodo desde PostgreSQL.
    Filtra por tenant_id y periodo del estado de cuenta.
    """
    from app.models.document import Document
    from sqlalchemy.orm import Session
    
    db = Session()
    invoices = db.query(Document).filter(
        Document.tenant_id == state["tenant_id"],
        Document.status == "processed",
        Document.extraction_json["fecha"].astext.between(
            state["period_start"].strftime("%Y-%m-%d"),
            state["period_end"].strftime("%Y-%m-%d")
        )
    ).all()
    
    return {
        "invoices": [doc.to_dict() for doc in invoices],
        "status": "invoices_extracted"
    }

def run_exact_matching(state: ConciliationState):
    """
    Nodo 3: Capa 1 - Exact matching (monto + fecha +/- 3 días).
    """
    from app.services.reconciliation.matching_engine import MatchingEngine
    from sqlalchemy.orm import Session
    
    db = Session()
    engine = MatchingEngine(db)
    matches = []
    
    for transaction in state.get("transactions", []):
        exact_matches = engine._exact_match(transaction, state["tenant_id"])
        for doc in exact_matches:
            matches.append({
                "transaction_id": transaction["id"],
                "document_id": str(doc.id),
                "match_type": "exact",
                "confidence": 0.95,
                "status": "pending"
            })
    
    return {
        "matches": matches,
        "status": "exact_matching_complete"
    }

def run_fuzzy_matching(state: ConciliationState):
    """
    Nodo 4: Capa 2 - Fuzzy matching para transacciones sin match exacto.
    """
    from app.services.reconciliation.matching_engine import MatchingEngine
    from sqlalchemy.orm import Session
    
    db = Session()
    engine = MatchingEngine(db)
    new_matches = []
    
    # Obtener IDs de transacciones ya matcheadas
    matched_tx_ids = {m["transaction_id"] for m in state.get("matches", [])}
    
    for transaction in state.get("transactions", []):
        if transaction["id"] in matched_tx_ids:
            continue  # Saltar si ya tiene match exacto
        
        fuzzy_matches = engine._fuzzy_match(transaction, state["tenant_id"])
        for doc, score in fuzzy_matches:
            if score >= engine.fuzzy_threshold:
                new_matches.append({
                    "transaction_id": transaction["id"],
                    "document_id": str(doc.id),
                    "match_type": "fuzzy",
                    "confidence": float(score),
                    "status": "pending"
                })
    
    return {
        "matches": state.get("matches", []) + new_matches,
        "status": "fuzzy_matching_complete"
    }

def run_llm_validation(state: ConciliationState):
    """
    Nodo 5: Capa 3 - LLM validation para matches con confianza < 85%.
    """
    from app.services.reconciliation.matching_engine import MatchingEngine
    from sqlalchemy.orm import Session
    
    db = Session()
    engine = MatchingEngine(db)
    validated_matches = []
    
    for match in state.get("matches", []):
        if match["confidence"] >= 0.85 or match["match_type"] == "exact":
            # No requiere validación LLM
            validated_matches.append(match)
        else:
            # Validar con LLM
            from app.models.bank_transaction import BankTransaction
            from app.models.document import Document
            
            transaction = db.query(BankTransaction).filter(
                BankTransaction.id == match["transaction_id"]
            ).first()
            
            document = db.query(Document).filter(
                Document.id == match["document_id"]
            ).first()
            
            if transaction and document:
                is_valid, llm_score, reasoning = engine._llm_validate(transaction, document)
                
                if is_valid and llm_score >= 0.70:
                    validated_matches.append({
                        **match,
                        "match_type": "llm_validated",
                        "confidence": float(llm_score),
                        "llm_reasoning": reasoning
                    })
                    # Guardar audit log
                    engine._save_audit_log(transaction, document, reasoning)
    
    return {
        "matches": validated_matches,
        "status": "llm_validation_complete"
    }

def detect_anomalies(state: ConciliationState):
    """
    Nodo 6: Detecta anomalías - facturas sin pago, pagos sin factura.
    """
    from app.services.reconciliation.anomaly_detector import AnomalyDetector
    from sqlalchemy.orm import Session
    
    db = Session()
    detector = AnomalyDetector(db)
    
    # IDs de transacciones y documentos matcheados
    matched_tx_ids = {m["transaction_id"] for m in state.get("matches", [])}
    matched_doc_ids = {m["document_id"] for m in state.get("matches", [])}
    
    # Facturas sin pago
    missing_payments = []
    for invoice in state.get("invoices", []):
        if invoice["id"] not in matched_doc_ids:
            missing_payments.append({
                "type": "invoice_without_payment",
                "document_id": invoice["id"],
                "amount": invoice["total_amount"],
                "due_date": invoice["extraction_json"].get("fecha"),
                "provider": invoice["extraction_json"].get("rfc_emisor")
            })
    
    # Pagos sin factura
    missing_invoices = []
    for transaction in state.get("transactions", []):
        if transaction["id"] not in matched_tx_ids:
            missing_invoices.append({
                "type": "payment_without_invoice",
                "transaction_id": transaction["id"],
                "amount": transaction["amount"],
                "date": transaction["transaction_date"],
                "description": transaction["description"]
            })
    
    return {
        "anomalies": {
            "missing_payments": missing_payments,
            "missing_invoices": missing_invoices,
            "total_missing_payments": len(missing_payments),
            "total_missing_invoices": len(missing_invoices)
        },
        "status": "anomaly_detection_complete"
    }

def generate_report(state: ConciliationState):
    """
    Nodo 7: Genera reporte de conciliación.
    """
    total_transactions = len(state.get("transactions", []))
    total_matches = len(state.get("matches", []))
    match_rate = total_matches / max(total_transactions, 1)
    
    requires_human_review = match_rate < 0.90 or len(state.get("anomalies", {}).get("missing_invoices", [])) > 10
    
    report = {
        "summary": {
            "total_transactions": total_transactions,
            "total_matches": total_matches,
            "match_rate": float(match_rate),
            "match_rate_percentage": f"{match_rate * 100:.1f}%",
            "total_anomalies": (
                len(state.get("anomalies", {}).get("missing_payments", [])) +
                len(state.get("anomalies", {}).get("missing_invoices", []))
            )
        },
        "matches_by_type": {
            "exact": len([m for m in state.get("matches", []) if m["match_type"] == "exact"]),
            "fuzzy": len([m for m in state.get("matches", []) if m["match_type"] == "fuzzy"]),
            "llm_validated": len([m for m in state.get("matches", []) if m["match_type"] == "llm_validated"])
        },
        "anomalies": state.get("anomalies", {}),
        "requires_human_review": requires_human_review,
        "generated_at": datetime.utcnow().isoformat()
    }
    
    return {
        "report": report,
        "status": "completed" if not requires_human_review else "pending_review",
        "requires_human_review": requires_human_review
    }

# Definición del grafo
conciliation_graph = StateGraph(ConciliationState)

# Agregar nodos
conciliation_graph.add_node("parse_bank_statement", parse_bank_statement)
conciliation_graph.add_node("extract_invoices", extract_invoices)
conciliation_graph.add_node("run_exact_matching", run_exact_matching)
conciliation_graph.add_node("run_fuzzy_matching", run_fuzzy_matching)
conciliation_graph.add_node("run_llm_validation", run_llm_validation)
conciliation_graph.add_node("detect_anomalies", detect_anomalies)
conciliation_graph.add_node("generate_report", generate_report)

# Definir arcos (transiciones)
conciliation_graph.set_entry_point("parse_bank_statement")
conciliation_graph.add_edge("parse_bank_statement", "extract_invoices")
conciliation_graph.add_edge("extract_invoices", "run_exact_matching")
conciliation_graph.add_edge("run_exact_matching", "run_fuzzy_matching")
conciliation_graph.add_edge("run_fuzzy_matching", "run_llm_validation")
conciliation_graph.add_edge("run_llm_validation", "detect_anomalies")
conciliation_graph.add_edge("detect_anomalies", "generate_report")
conciliation_graph.add_edge("generate_report", END)

# Compilar
app = conciliation_graph.compile()
```

**Diagrama ASCII del Grafo:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        WORKFLOW DE CONCILIACIÓN                              │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────────────┐
    │   START (Input)  │
    │ - tenant_id      │
    │ - bank_stmt_id   │
    │ - period         │
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────────────┐
    │  1. parse_bank_statement │
    │  - OCR PDF / Parse CSV   │
    │  - Extraer transacciones │
    │  - Validar formato       │
    └────────┬─────────────────┘
             │
             ▼
    ┌──────────────────────────┐
    │  2. extract_invoices     │
    │  - Query PostgreSQL      │
    │  - Filtrar por periodo   │
    │  - Cargar documentos     │
    └────────┬─────────────────┘
             │
             ▼
    ┌──────────────────────────┐
    │  3. run_exact_matching   │──────────────────────┐
    │  - Monto exacto          │                      │
    │  - Fecha +/- 3 días      │ Match Rate > 70%?    │
    │  - RFC emisor/receptor   │                      │
    └────────┬─────────────────┘                      │
             │                                        │
             │ Match Rate < 70%                       │
             ▼                                        │
    ┌──────────────────────────┐                      │
    │  4. run_fuzzy_matching   │──────────────────────┤
    │  - Levenshtein distance  │                      │
    │  - Conceptos bancarios   │ Match Rate > 85%?    │
    │  - Proveedores similares │                      │
    └────────┬─────────────────┘                      │
             │                                        │
             │ Match Rate < 85%                       │
             ▼                                        │
    ┌──────────────────────────┐                      │
    │  5. run_llm_validation   │──────────────────────┤
    │  - Llama-3.3-70B         │                      │
    │  - Validación semántica  │ Match Rate > 90%?    │
    │  - Guardar reasoning     │                      │
    └────────┬─────────────────┘                      │
             │                                        │
             └────────────────────────────────────────┘
             │
             ▼
    ┌──────────────────────────┐
    │  6. detect_anomalies     │
    │  - Facturas sin pago     │
    │  - Pagos sin factura     │
    │  - Alertas de riesgo     │
    └────────┬─────────────────┘
             │
             ▼
    ┌──────────────────────────┐
    │  7. generate_report      │
    │  - Summary statistics    │
    │  - Match rate by type    │
    │  - Anomalies count       │
    │  - Requires review?      │
    └────────┬─────────────────┘
             │
             ▼
    ┌──────────────────────────┐
    │   END (Output)           │
    │ - matches[]              │
    │ - anomalies{}            │
    │ - report{}               │
    │ - status                 │
    └──────────────────────────┘
```

#### B. Workflow de Nómina

```python
# backend/app/agents/payroll_agent.py

from langgraph.graph import StateGraph, END
from typing import TypedDict, List, Optional
from datetime import datetime

class PayrollState(TypedDict):
    tenant_id: str
    payroll_period: str  # "2026-03-15"
    employees: List[dict]
    perceptions: List[dict]
    deductions: List[dict]
    imss_quotas: List[dict]
    infonavit_credits: List[dict]
    isr_withholding: List[dict]
    cfdi_generated: List[dict]
    validation_errors: List[dict]
    status: str
    requires_human_review: bool

# Nodos principales
def parse_employee_data(state: PayrollState):
    """Carga datos de empleados desde PostgreSQL."""
    pass

def calculate_perceptions(state: PayrollState):
    """Calcula percepciones: sueldo base, horas extras, bonos, etc."""
    pass

def calculate_deductions(state: PayrollState):
    """Calcula deducciones: ISR, cuotas obreras, préstamos, etc."""
    pass

def calculate_imss(state: PayrollState):
    """Calcula cuotas IMSS (enfermedad, maternidad, riesgos, cesantía, vejez)."""
    pass

def calculate_infonavit(state: PayrollState):
    """Calcula aportaciones y descuentos INFONAVIT."""
    pass

def calculate_isr(state: PayrollState):
    """Calcula retención de ISR según tablas SAT 2026."""
    pass

def generate_cfdi(state: PayrollState):
    """Genera CFDI de nómina 1.2 para cada empleado."""
    pass

def validate_payroll(state: PayrollState):
    """Valida cálculos y genera reporte de errores."""
    pass

# Grafo
payroll_graph = StateGraph(PayrollState)
payroll_graph.add_node("parse_employee_data", parse_employee_data)
payroll_graph.add_node("calculate_perceptions", calculate_perceptions)
payroll_graph.add_node("calculate_deductions", calculate_deductions)
payroll_graph.add_node("calculate_imss", calculate_imss)
payroll_graph.add_node("calculate_infonavit", calculate_infonavit)
payroll_graph.add_node("calculate_isr", calculate_isr)
payroll_graph.add_node("generate_cfdi", generate_cfdi)
payroll_graph.add_node("validate_payroll", validate_payroll)

payroll_graph.set_entry_point("parse_employee_data")
payroll_graph.add_edge("parse_employee_data", "calculate_perceptions")
payroll_graph.add_edge("calculate_perceptions", "calculate_deductions")
payroll_graph.add_edge("calculate_deductions", "calculate_imss")
payroll_graph.add_edge("calculate_imss", "calculate_infonavit")
payroll_graph.add_edge("calculate_infonavit", "calculate_isr")
payroll_graph.add_edge("calculate_isr", "generate_cfdi")
payroll_graph.add_edge("generate_cfdi", "validate_payroll")
payroll_graph.add_edge("validate_payroll", END)
```

### 4.2 Pipeline RAG Mejorado

#### A. Nuevas Fuentes de Datos

```python
# backend/app/services/rag/law_ingestor.py

from typing import List, Dict
from app.services.embeddings import generate_embedding
from app.core.chromadb import get_chroma_client

# Fuentes de datos para RAG
RAG_SOURCES = {
    "normativa_fiscal": {
        "collections": ["lisr", "liva", "cff", "rmf"],
        "sources": [
            {
                "name": "LISR",
                "url": "https://www.diputados.gob.mx/LeyesBiblio/pdf/102_2025.pdf",
                "type": "pdf",
                "chunk_strategy": "by_article"
            },
            {
                "name": "LIVA",
                "url": "https://www.diputados.gob.mx/LeyesBiblio/pdf/106_2025.pdf",
                "type": "pdf",
                "chunk_strategy": "by_article"
            },
            {
                "name": "CFF",
                "url": "https://www.diputados.gob.mx/LeyesBiblio/pdf/66_2025.pdf",
                "type": "pdf",
                "chunk_strategy": "by_article"
            },
            {
                "name": "RMF 2026",
                "url": "https://www.sat.gob.mx/cs/Satellite?blobcol=urldata&blobkey=id&blobtable=MungoBlobs&blobwhere=1694-446956&ssbinary=true",
                "type": "pdf",
                "chunk_strategy": "by_section"
            }
        ]
    },
    "catalogos_sat": {
        "collections": ["cat_productos", "cat_servicios", "cat_regimenes"],
        "sources": [
            {
                "name": "Catálogo de Productos y Servicios",
                "url": "https://www.sat.gob.mx/aplicacion/operacion/31624/descarga-el-catalogo-de-productos-y-servicios-del-sat",
                "type": "csv",
                "chunk_strategy": "by_row"
            },
            {
                "name": "Catálogo de Regímenes Fiscales",
                "url": "https://www.sat.gob.mx/aplicacion/operacion/31624/descarga-el-catalogo-de-regimenes-fiscales",
                "type": "csv",
                "chunk_strategy": "by_row"
            }
        ]
    },
    "lista_69b": {
        "collections": ["efo_presuntos", "edo_sentencia_favorable"],
        "sources": [
            {
                "name": "Lista 69-B (Presuntos)",
                "url": "https://www.sat.gob.mx/cs/Satellite?blobcol=urldata&blobkey=id&blobtable=MungoBlobs&blobwhere=1576-500384&ssbinary=true",
                "type": "pdf",
                "update_frequency": "weekly",
                "chunk_strategy": "by_rfc"
            },
            {
                "name": "Lista 69-B (Sentencia Favorable)",
                "url": "https://www.sat.gob.mx/cs/Satellite?blobcol=urldata&blobkey=id&blobtable=MungoBlobs&blobwhere=1576-500385&ssbinary=true",
                "type": "pdf",
                "update_frequency": "weekly",
                "chunk_strategy": "by_rfc"
            }
        ]
    },
    "nif_niif": {
        "collections": ["nif_mexico", "niif_internacional"],
        "sources": [
            {
                "name": "NIF Mexicanas",
                "url": "https://www.cinif.org.mx/normatividad/nif.html",
                "type": "html",
                "chunk_strategy": "by_standard"
            },
            {
                "name": "NIIF Internacionales",
                "url": "https://www.ifrs.org/issued-standards/",
                "type": "html",
                "chunk_strategy": "by_standard"
            }
        ]
    }
}

# Estrategia de chunking específica por fuente
CHUNK_STRATEGIES = {
    "by_article": {
        "description": "Chunking por artículo de ley",
        "params": {
            "chunk_size": 1000,
            "chunk_overlap": 150,
            "separators": ["Artículo", "Art.", "FRACCIÓN", "Fracc."],
            "metadata_fields": ["ley", "articulo", "fraccion", "vigencia"]
        }
    },
    "by_section": {
        "description": "Chunking por sección de documento",
        "params": {
            "chunk_size": 1200,
            "chunk_overlap": 200,
            "separators": ["\n##", "\n###", "\n\n"],
            "metadata_fields": ["documento", "seccion", "subseccion"]
        }
    },
    "by_row": {
        "description": "Chunking por fila de CSV",
        "params": {
            "chunk_size": 500,
            "chunk_overlap": 0,
            "format": "csv_row",
            "metadata_fields": ["clave", "descripcion", "vigencia_desde"]
        }
    },
    "by_standard": {
        "description": "Chunking por norma contable",
        "params": {
            "chunk_size": 1500,
            "chunk_overlap": 250,
            "separators": ["NIF", "NIIF", "Sección", "Párrafo"],
            "metadata_fields": ["norma", "seccion", "parrafo", "tipo"]
        }
    },
    "by_rfc": {
        "description": "Chunking por RFC en lista 69-B",
        "params": {
            "chunk_size": 300,
            "chunk_overlap": 0,
            "format": "structured",
            "metadata_fields": ["rfc", "nombre_razon_social", "situacion", "fecha_publicacion"]
        }
    }
}
```

#### B. Watcher DOF (Diario Oficial de la Federación)

```python
# backend/app/services/rag/law_updater.py

import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
from app.core.logger import get_logger

logger = get_logger(__name__)

class DOFWatcher:
    """
    Monitor del Diario Oficial de la Federación para detectar cambios normativos.
    Se ejecuta semanalmente (cada lunes a las 6:00 AM).
    """
    
    DOF_URL = "https://www.dof.gob.mx/"
    KEYWORDS = [
        "Ley del Impuesto sobre la Renta",
        "LISR",
        "Ley del Impuesto al Valor Agregado",
        "LIVA",
        "Código Fiscal de la Federación",
        "CFF",
        "Resolución Miscelánea Fiscal",
        "RMF",
        "Reglas Generales de Comercio Exterior"
    ]
    
    def __init__(self, db_session, chroma_client):
        self.db = db_session
        self.chroma = chroma_client
    
    def check_for_updates(self) -> List[dict]:
        """
        Revisa el DOF de los últimos 7 días en busca de cambios normativos.
        """
        updates = []
        
        # Obtener página principal del DOF
        response = requests.get(self.DOF_URL, timeout=30)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Buscar ediciones de la última semana
        ediciones = self._parse_ediciones(soup)
        
        for edicion in ediciones:
            fecha_edicion = edicion["fecha"]
            
            # Solo procesar ediciones de los últimos 7 días
            if fecha_edicion < datetime.now() - timedelta(days=7):
                continue
            
            # Buscar documentos relacionados con leyes fiscales
            documentos = self._parse_documentos(edicion["url"])
            
            for doc in documentos:
                if any(keyword.lower() in doc["titulo"].lower() for keyword in self.KEYWORDS):
                    updates.append({
                        "fecha": fecha_edicion,
                        "titulo": doc["titulo"],
                        "url": doc["url"],
                        "tipo": doc["tipo"],
                        "ley_afectada": self._identificar_ley_afectada(doc["titulo"])
                    })
        
        return updates
    
    def trigger_update(self, update: dict):
        """
        Dispara el proceso de actualización de una ley específica.
        """
        logger.info(f"Iniciando actualización de {update['ley_afectada']}")
        
        # 1. Descargar nuevo documento
        doc_content = self._download_document(update["url"])
        
        # 2. Re-procesar chunking con la estrategia adecuada
        chunks = self._process_document(doc_content, update["ley_afectada"])
        
        # 3. Actualizar colección en ChromaDB
        collection = self.chroma.get_collection(f"normativa_{update['ley_afectada'].lower()}")
        
        # Eliminar chunks antiguos de la misma ley
        collection.delete(where={"ley": update["ley_afectada"]})
        
        # Agregar nuevos chunks
        for chunk in chunks:
            collection.add(
                documents=[chunk["text"]],
                metadatas=[chunk["metadata"]],
                ids=[chunk["id"]]
            )
        
        # 4. Notificar a usuarios administradores
        self._notify_admins(update)
        
        logger.info(f"Actualización completada: {update['titulo']}")
    
    def _parse_ediciones(self, soup) -> List[dict]:
        """Parsea la lista de ediciones del DOF."""
        # Implementación específica del scraping del DOF
        pass
    
    def _parse_documentos(self, url_edicion) -> List[dict]:
        """Parsea los documentos de una edición específica."""
        pass
    
    def _identificar_ley_afectada(self, titulo: str) -> str:
        """Identifica qué ley está siendo modificada."""
        if "LISR" in titulo.upper() or "IMPUESTO SOBRE LA RENTA" in titulo.upper():
            return "LISR"
        elif "LIVA" in titulo.upper() or "IMPUESTO AL VALOR AGREGADO" in titulo.upper():
            return "LIVA"
        elif "CFF" in titulo.upper() or "CODIGO FISCAL" in titulo.upper():
            return "CFF"
        elif "MISCELANEA" in titulo.upper():
            return "RMF"
        else:
            return "OTRA"
    
    def _notify_admins(self, update: dict):
        """Envía notificación a administradores sobre la actualización."""
        from app.services.notification import send_email
        
        admins = self.db.query(User).filter(User.role == "admin").all()
        
        for admin in admins:
            send_email(
                to=admin.email,
                subject=f"Actualización Normativa: {update['ley_afectada']}",
                body=f"""
Se ha detectado una actualización normativa en el DOF:

Ley: {update['ley_afectada']}
Título: {update['titulo']}
Fecha: {update['fecha'].strftime('%Y-%m-%d')}
URL: {update['url']}

El sistema ha sido actualizado automáticamente con los nuevos contenidos.

Saludos,
IDP-App Asistente Contable
                """
            )
```

### 4.3 Modelos de ML

#### A. Modelo de Clasificación Contable

```python
# backend/app/ml/account_classifier.py

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, f1_score
import pandas as pd
import numpy as np
from typing import List, Tuple

class AccountClassifier:
    """
    Modelo de clasificación automática de gastos en cuentas contables.
    Usa nemotron-4-min-8b para feature extraction + Random Forest para clasificación.
    """
    
    # Catálogo de cuentas sugerido (NIF B-3)
    ACCOUNT_CATEGORIES = {
        "501-01-001": "Compras de mercancías",
        "501-02-001": "Compras de materia prima",
        "601-01-001": "Sueldos y salarios",
        "601-02-001": "Seguridad social (cuotas patronales)",
        "602-01-001": "Arrendamientos",
        "602-02-001": "Agua, electricidad y gas",
        "602-03-001": "Teléfonos y comunicaciones",
        "602-04-001": "Publicidad y propaganda",
        "602-05-001": "Viáticos y gastos de viaje",
        "602-06-001": "Honorarios profesionales",
        "602-07-001": "Mantenimiento y conservación",
        "602-08-001": "Útiles y materiales de oficina",
        "602-09-001": "Combustibles y lubricantes",
        "602-10-001": "Seguros y fianzas",
        "602-11-001": "Gastos financieros (intereses)",
        "801-01-001": "ISR del ejercicio"
    }
    
    def __init__(self):
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=20,
            min_samples_split=5,
            class_weight='balanced',
            random_state=42
        )
        self.is_trained = False
    
    def extract_features(self, documents: List[dict]) -> np.ndarray:
        """
        Extrae features de documentos usando nemotron-4-min-8b.
        Features:
        - Embedding del concepto (384 dimensiones)
        - Monto (normalizado)
        - Día de la semana
        - Mes
        - RFC emisor (encoded)
        - Palabras clave (one-hot)
        """
        from app.services.nvidia_nim import call_nvidia_nim_embeddings
        
        features = []
        
        for doc in documents:
            concepto = doc.get("concepto", "")
            monto = doc.get("total", 0)
            fecha = doc.get("fecha", "")
            rfc_emisor = doc.get("rfc_emisor", "")
            
            # Embedding del concepto (usar modelo local para velocidad)
            embedding = call_nvidia_nim_embeddings(
                model="nvidia/nv-embedqa-e5-v5",
                texts=[concepto]
            )[0][:32]  # Usar primeros 32 dims para reducir dimensionalidad
            
            # Features numéricas
            monto_norm = np.log1p(monto) / 10  # Normalizar
            dia_semana = self._parse_dia_semana(fecha)
            mes = self._parse_mes(fecha)
            
            # One-hot para palabras clave
            keywords = self._extract_keywords(concepto)
            
            # Concatenar todas las features
            feature_vector = np.concatenate([
                embedding,
                [monto_norm, dia_semana, mes],
                keywords
            ])
            
            features.append(feature_vector)
        
        return np.array(features)
    
    def train(self, documents: List[dict], labels: List[str]) -> dict:
        """
        Entrena el modelo con documentos etiquetados.
        """
        X = self.extract_features(documents)
        y = np.array(labels)
        
        # Split train/test
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Entrenar
        self.model.fit(X_train, y_train)
        
        # Evaluar
        y_pred = self.model.predict(X_test)
        
        metrics = {
            "f1_score": f1_score(y_test, y_pred, average='weighted'),
            "accuracy": self.model.score(X_test, y_test),
            "classification_report": classification_report(y_test, y_pred)
        }
        
        self.is_trained = True
        
        return metrics
    
    def predict(self, documents: List[dict]) -> List[Tuple[str, float]]:
        """
        Predice la cuenta contable para documentos nuevos.
        Retorna: [(cuenta, confianza), ...]
        """
        if not self.is_trained:
            raise ValueError("El modelo no ha sido entrenado")
        
        X = self.extract_features(documents)
        
        predictions = self.model.predict(X)
        probabilities = self.model.predict_proba(X)
        
        results = []
        for pred, prob in zip(predictions, probabilities):
            confidence = float(max(prob))
            results.append((pred, confidence))
        
        return results
    
    def _parse_dia_semana(self, fecha: str) -> float:
        """Convierte fecha a día de la semana (0-6)."""
        from datetime import datetime
        try:
            dt = datetime.strptime(fecha, "%Y-%m-%d")
            return dt.weekday() / 6.0  # Normalizar a 0-1
        except:
            return 0.0
    
    def _parse_mes(self, fecha: str) -> float:
        """Convierte fecha a mes (0-11)."""
        from datetime import datetime
        try:
            dt = datetime.strptime(fecha, "%Y-%m-%d")
            return dt.month / 12.0  # Normalizar a 0-1
        except:
            return 0.0
    
    def _extract_keywords(self, concepto: str) -> np.ndarray:
        """Extrae palabras clave del concepto (one-hot encoding)."""
        keywords_list = [
            "sueldo", "salario", "nomina", "imss", "infonavit",
            "arrendamiento", "renta", "oficina", "local",
            "luz", "agua", "gas", "electricidad", "telefono", "internet",
            "viatico", "hotel", "avion", "taxi", "uber", "gasolina",
            "honorarios", "servicios profesionales", "asesoria",
            "mantenimiento", "reparacion", "refaccion",
            "papeleria", "util", "material", "oficina",
            "publicidad", "marketing", "anuncio", "propaganda",
            "seguro", "fianza", "poliza",
            "interes", "comision", "gasto financiero"
        ]
        
        concepto_lower = concepto.lower()
        return np.array([1 if kw in concepto_lower else 0 for kw in keywords_list])
```

#### B. Modelo de Matching Bancario

```python
# backend/app/ml/bank_matching.py

from sklearn.ensemble import GradientBoostingClassifier
import numpy as np
from typing import List, Tuple

class BankMatchingModel:
    """
    Modelo de matching bancario para conciliación automática.
    Predice si una transacción bancaria y un documento corresponden al mismo evento.
    """
    
    def __init__(self):
        self.model = GradientBoostingClassifier(
            n_estimators=150,
            max_depth=6,
            learning_rate=0.1,
            random_state=42
        )
        self.is_trained = False
    
    def extract_features(self, transaction: dict, document: dict) -> np.ndarray:
        """
        Extrae features para el matching:
        - Diferencia de monto (absoluta y porcentual)
        - Diferencia de fecha (días)
        - Similitud de conceptos (Levenshtein)
        - Match de RFC
        - Histórico de matches con este proveedor
        """
        from difflib import SequenceMatcher
        
        # Diferencia de monto
        monto_diff_abs = abs(transaction["amount"] - document["total"])
        monto_diff_pct = monto_diff_abs / max(document["total"], 1)
        
        # Diferencia de fecha
        from datetime import datetime
        try:
            tx_date = datetime.strptime(transaction["date"], "%Y-%m-%d")
            doc_date = datetime.strptime(document["fecha"], "%Y-%m-%d")
            fecha_diff = abs((tx_date - doc_date).days)
        except:
            fecha_diff = 999
        
        # Similitud de conceptos
        concepto_sim = SequenceMatcher(
            None,
            transaction["description"].lower(),
            document.get("concepto", "").lower()
        ).ratio()
        
        # Match de RFC
        rfc_match = 1.0 if (
            transaction.get("rfc") == document.get("rfc_emisor") or
            transaction.get("rfc") == document.get("rfc_receptor")
        ) else 0.0
        
        # Histórico de matches (si existe)
        historical_match = self._get_historical_match_rate(
            transaction.get("provider"),
            document.get("rfc_emisor")
        )
        
        features = np.array([
            monto_diff_abs,
            monto_diff_pct,
            fecha_diff,
            concepto_sim,
            rfc_match,
            historical_match
        ])
        
        return features
    
    def train(self, training_data: List[Tuple[dict, dict, int]]) -> dict:
        """
        Entrena con datos históricos de matches.
        training_data: [(transaction, document, label), ...]
        label: 1 = match confirmado, 0 = no match
        """
        X = np.array([self.extract_features(tx, doc) for tx, doc, _ in training_data])
        y = np.array([label for _, _, label in training_data])
        
        from sklearn.model_selection import train_test_split
        from sklearn.metrics import precision_score, recall_score
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        self.model.fit(X_train, y_train)
        
        y_pred = self.model.predict(X_test)
        
        metrics = {
            "accuracy": self.model.score(X_test, y_test),
            "precision": precision_score(y_test, y_pred),
            "recall": recall_score(y_test, y_pred),
            "f1": 2 * precision_score(y_test, y_pred) * recall_score(y_test, y_pred) / 
                  (precision_score(y_test, y_pred) + recall_score(y_test, y_pred))
        }
        
        self.is_trained = True
        
        return metrics
    
    def predict_match(self, transaction: dict, document: dict) -> Tuple[bool, float]:
        """
        Predice si hay match entre transacción y documento.
        Retorna: (is_match, confidence)
        """
        if not self.is_trained:
            raise ValueError("El modelo no ha sido entrenado")
        
        features = self.extract_features(transaction, document).reshape(1, -1)
        
        prediction = self.model.predict(features)[0]
        confidence = float(self.model.predict_proba(features)[0][1])
        
        return prediction == 1, confidence
    
    def _get_historical_match_rate(self, provider1: str, provider2: str) -> float:
        """
        Obtiene tasa histórica de matches entre dos proveedores.
        """
        # Query a histórico de conciliaciones
        # Retorna porcentaje de matches previos entre estos proveedores
        pass
```

#### C. Modelo de Forecasting de Impuestos

```python
# backend/app/ml/tax_forecaster.py

from prophet import Prophet
import pandas as pd
import numpy as np
from typing import Dict, List

class TaxForecaster:
    """
    Modelo de forecasting de impuestos (IVA e ISR) usando Prophet.
    """
    
    def __init__(self):
        self.models = {
            "iva": Prophet(
                yearly_seasonality=True,
                weekly_seasonality=False,
                daily_seasonality=False
            ),
            "isr": Prophet(
                yearly_seasonality=True,
                weekly_seasonality=False,
                daily_seasonality=False
            )
        }
        self.is_trained = False
    
    def train(self, historical_data: pd.DataFrame) -> Dict[str, any]:
        """
        Entrena modelos con histórico de impuestos.
        
        historical_data debe tener columnas:
        - ds: fecha (YYYY-MM-DD)
        - iva: IVA pagado en el periodo
        - isr: ISR pagado en el periodo
        """
        metrics = {}
        
        for tax in ["iva", "isr"]:
            df = historical_data[["ds", tax]].rename(columns={tax: "y"})
            
            # Agregar regresores externos (opcional)
            # df["inflacion"] = ...
            # df["tipo_cambio"] = ...
            
            self.models[tax].fit(df)
            
            # Evaluar con cross-validation
            from prophet.diagnostics import cross_validation, performance_metrics
            
            df_cv = cross_validation(self.models[tax], horizon="365 days", period="180 days")
            df_metrics = performance_metrics(df_cv)
            
            metrics[tax] = {
                "mape": float(df_metrics["mape"].mean()),
                "rmse": float(df_metrics["rmse"].mean())
            }
        
        self.is_trained = True
        
        return metrics
    
    def forecast(self, periods: int = 12) -> Dict[str, pd.DataFrame]:
        """
        Genera proyección de impuestos para los próximos `periods` meses.
        """
        if not self.is_trained:
            raise ValueError("El modelo no ha sido entrenado")
        
        forecasts = {}
        
        for tax in ["iva", "isr"]:
            future = self.models[tax].make_future_dataframe(periods=periods, freq="M")
            forecast = self.models[tax].predict(future)
            forecasts[tax] = forecast[["ds", "yhat", "yhat_lower", "yhat_upper"]]
        
        return forecasts
    
    def get_tax_liability(self, current_month: str) -> Dict[str, float]:
        """
        Calcula la provisión de impuestos estimada para el mes actual.
        """
        forecast = self.forecast(periods=1)
        
        iva_forecast = forecast["iva"].iloc[-1]
        isr_forecast = forecast["isr"].iloc[-1]
        
        return {
            "iva_estimado": float(iva_forecast["yhat"]),
            "iva_min": float(iva_forecast["yhat_lower"]),
            "iva_max": float(iva_forecast["yhat_upper"]),
            "isr_estimado": float(isr_forecast["yhat"]),
            "isr_min": float(isr_forecast["yhat_lower"]),
            "isr_max": float(isr_forecast["yhat_upper"])
        }
```

---

## 5. Plan de Implementación Detallado por Fases (8-12)

### Fase 8: Tests E2E y Optimización (2 semanas)

**Objetivo Principal:** Estabilizar lo implementado y preparar infraestructura para funcionalidades críticas.

**Duración:** 2 semanas (10 días hábiles)

**Owner:** Tech Lead + QA Engineer

#### Entregables:

| # | Entregable | Criterios de Aceptación | Owner | Dependencias |
|---|------------|------------------------|-------|--------------|
| 1 | Tests E2E con Playwright | 15+ tests críticos passing, cobertura de flujos principales | QA Engineer | Frontend estable |
| 2 | Error tracking con Sentry | 100% de errores capturados, alertas configuradas | Backend Dev | Cuenta Sentry |
| 3 | PWA (offline mode) | Lighthouse PWA score >90, service workers funcionando | Frontend Dev | - |
| 4 | Optimización de performance | Lighthouse performance >90, API latency <500ms (p95) | Fullstack Dev | - |
| 5 | Backup automatizado ChromaDB | Backup diario en S3, restore probado | DevOps | AWS S3 bucket |
| 6 | Rate limiting en API | Throttling configurado (40 RPM para NIM Develop) | Backend Dev | - |
| 7 | CI/CD pipeline | GitHub Actions con tests automáticos en PR | DevOps | - |

#### Sprint Plan:

**Sprint 1 (Días 1-5):**

| Día | Tareas | Owner |
|-----|--------|-------|
| 1 | Configurar Playwright + escribir 5 tests E2E críticos | QA |
| 2 | Escribir 5 tests E2E adicionales + integrar con CI | QA |
| 3 | Integrar Sentry en backend + frontend | Backend + Frontend |
| 4 | Configurar alertas de Sentry + dashboard | Backend |
| 5 | Implementar service workers para PWA | Frontend |

**Sprint 2 (Días 6-10):**

| Día | Tareas | Owner |
|-----|--------|-------|
| 6 | Optimizar queries PostgreSQL (índices, explain analyze) | Backend |
| 7 | Implementar caching Redis para consultas frecuentes | Backend |
| 8 | Configurar backup automatizado ChromaDB → S3 | DevOps |
| 9 | Implementar rate limiting con slowapi | Backend |
| 10 | Configurar GitHub Actions CI/CD + documentación | DevOps |

#### Riesgos:

| Riesgo | Probabilidad | Impacto | Mitigación | Owner |
|--------|--------------|---------|------------|-------|
| Tests E2E inestables (flaky) | Media (40%) | Medio | Usar waits explícitos, retry logic | QA |
| Sentry genera demasiadas alertas | Media (50%) | Bajo | Configurar thresholds, agrupación | Backend |
| PWA no funciona en todos los browsers | Baja (20%) | Medio | Testing cross-browser, polyfills | Frontend |
| Backup ChromaDB falla | Media (30%) | Alto | Testing de restore, alertas de fallo | DevOps |

---

### Fase 9: Conciliación y Clasificación (4 semanas)

**Objetivo Principal:** Implementar funcionalidades críticas de automatización (matching bancario + clasificación contable).

**Duración:** 4 semanas (20 días hábiles)

**Owner:** Backend Lead + ML Engineer

#### Entregables:

| # | Entregable | Criterios de Aceptación | Owner | Dependencias |
|---|------------|------------------------|-------|--------------|
| 1 | Matching Engine (3 capas) | 85%+ de matches automáticos, precisión >90% | ML Engineer | IDP completado |
| 2 | Parser de estados de cuenta | Soporte PDF/CSV/XLSX, 95%+ de precisión en parsing | Backend Dev | - |
| 3 | Clasificación contable automática | 85%+ de precisión en sugerencia de cuentas | ML Engineer | Modelo entrenado |
| 4 | Validación CFDI vs SAT | 100% de validaciones correctas, respuesta <2s | Backend Dev | API SAT disponible |
| 5 | Detección lista 69-B | Alertas en tiempo real para RFCs en lista | Backend Dev | Lista 69-B actualizada |
| 6 | UI de conciliación | Tabla de matches, filtros, acciones rápidas | Frontend Dev | Backend API |
| 7 | UI de clasificación | Sugerencias de cuentas, corrección manual | Frontend Dev | Backend API |

#### Sprint Plan:

**Sprint 1 (Días 1-5): Backend - Matching Engine**

| Día | Tareas | Owner |
|-----|--------|-------|
| 1 | Modelos SQLAlchemy (BankStatement, BankTransaction, ReconciliationMatch) | Backend |
| 2 | Parser de estados de cuenta (PDF con OCR, CSV, XLSX) | Backend |
| 3 | Capa 1: Exact matching (monto + fecha) | Backend |
| 4 | Capa 2: Fuzzy matching (Levenshtein) | ML Engineer |
| 5 | Capa 3: LLM validation + audit logging | Backend + ML |

**Sprint 2 (Días 6-10): Backend - Clasificación + Validación**

| Día | Tareas | Owner |
|-----|--------|-------|
| 6 | Entrenar modelo de clasificación contable | ML Engineer |
| 7 | Integrar modelo en endpoint `/v1/idp/classify` | Backend |
| 8 | Validación CFDI vs SAT (consulta UUID) | Backend |
| 9 | Integración lista 69-B (download + parse) | Backend |
| 10 | Endpoints de conciliación + tests unitarios | Backend |

**Sprint 3 (Días 11-15): Frontend - UI de Conciliación**

| Día | Tareas | Owner |
|-----|--------|-------|
| 11 | Componente BankStatementUpload (drag-and-drop) | Frontend |
| 12 | Componente MatchingTable (tabla con acciones) | Frontend |
| 13 | Componente UnmatchedAlerts (faltantes) | Frontend |
| 14 | Integración con backend (services + store) | Frontend |
| 15 | Testing manual + bug fixes | Fullstack |

**Sprint 4 (Días 16-20): Frontend - UI de Clasificación + QA**

| Día | Tareas | Owner |
|-----|--------|-------|
| 16 | Componente DocumentClassifier (sugerencias de cuentas) | Frontend |
| 17 | Componente CFDIValidator (check SAT + 69-B) | Frontend |
| 18 | Tests E2E de conciliación y clasificación | QA |
| 19 | Optimización de performance (virtual scrolling) | Frontend |
| 20 | Bug fixes + documentación de API | Fullstack |

#### Riesgos:

| Riesgo | Probabilidad | Impacto | Mitigación | Owner |
|--------|--------------|---------|------------|-------|
| API SAT no disponible o lenta | Media (40%) | Alto | Fallback a validación local, caching | Backend |
| Modelo de clasificación con baja precisión | Media (35%) | Alto | Más datos de entrenamiento, fine-tuning | ML |
| Parsing de estados de cuenta falla con formatos no estándar | Alta (60%) | Medio | Soporte para 3 formatos principales, fallback manual | Backend |
| LLM validation muy lento (>5s por match) | Media (30%) | Medio | Batch validation, caching de resultados | Backend |
| UI de conciliación lenta con 1000+ transacciones | Media (40%) | Medio | Virtual scrolling, pagination | Frontend |

---

### Fase 10: Dashboard Predictivo (3 semanas)

**Objetivo Principal:** Proporcionar visión estratégica al contador con proyecciones de impuestos y alertas de riesgo fiscal.

**Duración:** 3 semanas (15 días hábiles)

**Owner:** Data Scientist + Backend Lead

#### Entregables:

| # | Entregable | Criterios de Aceptación | Owner | Dependencias |
|---|------------|------------------------|-------|--------------|
| 1 | Forecasting de IVA | Proyección con <10% de error vs real | Data Scientist | Histórico 6+ meses |
| 2 | Forecasting de ISR | Proyección con <15% de error vs real | Data Scientist | Histórico 6+ meses |
| 3 | Tax Health Score | Semáforo con 5+ factores de riesgo | Backend Dev | Múltiples servicios |
| 4 | Detección de riesgo EFO | Alertas para proveedores en lista 69-B | Backend Dev | Lista 69-B actualizada |
| 5 | Alertas de vencimientos | Notificaciones de obligaciones fiscales | Backend Dev | Calendario fiscal |
| 6 | Dashboard de BI | Gráficas de flujo de caja, ingresos, gastos | Frontend Dev | Backend APIs |
| 7 | Proyección de flujo de caja | Forecast 3-6 meses con 85%+ de precisión | Data Scientist | Conciliación completada |

#### Sprint Plan:

**Sprint 1 (Días 1-5): Modelos Predictivos**

| Día | Tareas | Owner |
|-----|--------|-------|
| 1 | Extraer histórico de impuestos desde PostgreSQL | Data |
| 2 | Entrenar modelo Prophet para IVA | Data |
| 3 | Entrenar modelo Prophet para ISR | Data |
| 4 | Validar modelos con datos históricos | Data |
| 5 | Crear endpoints `/v1/analytics/tax-forecast` | Backend |

**Sprint 2 (Días 6-10): Tax Health Score + Alertas**

| Día | Tareas | Owner |
|-----|--------|-------|
| 6 | Definir factores de riesgo (EFO, discrepancia, etc.) | Backend + Contador |
| 7 | Implementar cálculo de Tax Health Score | Backend |
| 8 | Integrar con lista 69-B para detección EFO | Backend |
| 9 | Implementar calendario fiscal + alertas | Backend |
| 10 | Endpoints de health score y alertas | Backend |

**Sprint 3 (Días 11-15): Dashboard UI**

| Día | Tareas | Owner |
|-----|--------|-------|
| 11 | Componente TaxHealthScore (semáforo visual) | Frontend |
| 12 | Componente TaxForecastChart (gráfica de proyección) | Frontend |
| 13 | Componente CashFlowChart (flujo de caja) | Frontend |
| 14 | Panel de alertas en Dashboard principal | Frontend |
| 15 | Testing + bug fixes + documentación | Fullstack |

#### Riesgos:

| Riesgo | Probabilidad | Impacto | Mitigación | Owner |
|--------|--------------|---------|------------|-------|
| Histórico insuficiente para forecasting | Alta (50%) | Alto | Usar datos de prueba, ajustar modelo | Data |
| Proyecciones con error >20% | Media (40%) | Medio | Mostrar rangos (min-max), no valores exactos | Data |
| Tax Health Score demasiado complejo | Media (30%) | Medio | Comenzar con 3-5 factores clave | Backend |
| Dashboard lento con muchas gráficas | Baja (20%) | Medio | Lazy loading, memoization | Frontend |

---

### Fase 11: Agentes de Nómina y Fiscales (4 semanas)

**Objetivo Principal:** Automatizar obligaciones complejas (nómina, declaraciones, descarga SAT).

**Duración:** 4 semanas (20 días hábiles)

**Owner:** Backend Lead + Contador Certificado

#### Entregables:

| # | Entregable | Criterios de Aceptación | Owner | Dependencias |
|---|------------|------------------------|-------|--------------|
| 1 | Agente de Nómina | Cálculo correcto de percepciones y deducciones | Backend Dev | - |
| 2 | Cálculo IMSS/INFONAVIT | 99%+ de precisión en cuotas | Backend Dev | Tablas IMSS 2026 |
| 3 | Timbrado de CFDI de nómina | Integración con PAC, timbrado exitoso | Backend Dev | Proveedor PAC |
| 4 | Generación de declaraciones | Pre-llenado de formatos SAT | Backend Dev | Cálculo impuestos |
| 5 | Agente de Notificación | Emails automáticos a clientes | Backend Dev | Matching completado |
| 6 | Agente Descargador SAT | Descarga masiva de XML | Backend Dev | Scraping SAT |
| 7 | UI de nómina | Calculadora, validación, timbrado | Frontend Dev | Backend APIs |

#### Sprint Plan:

**Sprint 1 (Días 1-5): Agente de Nómina**

| Día | Tareas | Owner |
|-----|--------|-------|
| 1 | Modelos SQLAlchemy (Employee, PayrollPeriod, etc.) | Backend |
| 2 | Cálculo de percepciones (sueldo, horas extras, bonos) | Backend |
| 3 | Cálculo de deducciones (ISR, préstamos, etc.) | Backend |
| 4 | Cálculo de cuotas IMSS (enfermedad, maternidad, riesgos) | Backend + Contador |
| 5 | Cálculo de aportaciones INFONAVIT | Backend |

**Sprint 2 (Días 6-10): Timbrado + Declaraciones**

| Día | Tareas | Owner |
|-----|--------|-------|
| 6 | Integración con PAC para timbrado | Backend |
| 7 | Generación de CFDI de nómina 1.2 | Backend |
| 8 | Cálculo de ISR para declaración mensual | Backend |
| 9 | Pre-llenado de formato de declaración | Backend |
| 10 | Tests de validación con contador | Backend + Contador |

**Sprint 3 (Días 11-15): Agentes SAT + Notificación**

| Día | Tareas | Owner |
|-----|--------|-------|
| 11 | Scraping de portal SAT (descarga de XML) | Backend |
| 12 | Parser de XML descargados | Backend |
| 13 | Agente de notificación (SendGrid/Resend) | Backend |
| 14 | Plantillas de emails para clientes | Backend |
| 15 | Endpoints de agentes + tests | Backend |

**Sprint 4 (Días 16-20): UI de Nómina + QA**

| Día | Tareas | Owner |
|-----|--------|-------|
| 16 | Componente PayrollCalculator (calculadora de nómina) | Frontend |
| 17 | Componente IMSSValidator (validación de cuotas) | Frontend |
| 18 | Vista de Agentes (estado, logs, controles) | Frontend |
| 19 | Tests E2E de flujos de nómina | QA |
| 20 | Bug fixes + documentación | Fullstack |

#### Riesgos:

| Riesgo | Probabilidad | Impacto | Mitigación | Owner |
|--------|--------------|---------|------------|-------|
| Cálculos IMSS incorrectos | Media (30%) | Alto | Validación con contador certificado, tests exhaustivos | Backend |
| Scraping SAT bloqueado | Alta (60%) | Alto | Rotación de user agents, fallback manual | Backend |
| PAC de timbrado con downtime | Media (40%) | Alto | Múltiples proveedores PAC, retry logic | Backend |
| Errores en declaraciones pre-llenadas | Media (35%) | Alto | Validación humana obligatoria (HITL) | Backend |
| Emails marcados como spam | Baja (20%) | Medio | Configurar SPF, DKIM, usar dominio verificado | Backend |

---

### Fase 12: Escalamiento y Producción (3 semanas)

**Objetivo Principal:** Preparar para lanzamiento comercial con 50 usuarios beta.

**Duración:** 3 semanas (15 días hábiles)

**Owner:** Todo el equipo

#### Entregables:

| # | Entregable | Criterios de Aceptación | Owner | Dependencias |
|---|------------|------------------------|-------|--------------|
| 1 | Optimización de infraestructura | GPU RTX 4090 instalada, throughput >20 RPS | DevOps | Hardware adquirido |
| 2 | Pentest de seguridad | OWASP Top 10 vulnerabilities resueltas | Security Engineer | - |
| 3 | Documentación de usuario | Guía completa, tutoriales en video | Technical Writer | - |
| 4 | Programa beta testers | 50 usuarios activos, feedback recogido | Product Owner | Marketing |
| 5 | Monitoreo completo | Prometheus + Grafana, alertas configuradas | DevOps | - |
| 6 | Plan de disaster recovery | Backup/restore probado, RTO <4h | DevOps | - |
| 7 | NPS >40 | Satisfacción de usuarios beta | Product | Producto estable |

#### Sprint Plan:

**Sprint 1 (Días 1-5): Infraestructura + Seguridad**

| Día | Tareas | Owner |
|-----|--------|-------|
| 1 | Instalar GPU RTX 4090 + configurar nvidia-docker | DevOps |
| 2 | Load testing con GPU (objetivo: >20 RPS) | DevOps |
| 3 | Pentest de seguridad (OWASP Top 10) | Security |
| 4 | Remediar vulnerabilities encontradas | Backend + Frontend |
| 5 | Configurar monitoreo (Prometheus + Grafana) | DevOps |

**Sprint 2 (Días 6-10): Documentación + Beta**

| Día | Tareas | Owner |
|-----|--------|-------|
| 6 | Escribir documentación de usuario | Tech Writer |
| 7 | Crear tutoriales en video | Tech Writer |
| 8 | Reclutar 50 beta testers | Product |
| 9 | Onboarding de beta testers (webinar) | Product |
| 10 | Configurar sistema de feedback | Product |

**Sprint 3 (Días 11-15): QA Final + Lanzamiento**

| Día | Tareas | Owner |
|-----|--------|-------|
| 11 | Tests E2E completos de todo el sistema | QA |
| 12 | Bug fixes críticos | Fullstack |
| 13 | Prueba de disaster recovery (backup/restore) | DevOps |
| 14 | Recolección de feedback de beta testers | Product |
| 15 | Retrospectiva + planificación de Fase 13 | Todo el equipo |

#### Riesgos:

| Riesgo | Probabilidad | Impacto | Mitigación | Owner |
|--------|--------------|---------|------------|-------|
| GPU RTX 4090 sin disponibilidad | Media (30%) | Alto | Comprar con anticipación, considerar alternativa cloud | DevOps |
| Vulnerabilidades críticas en pentest | Media (40%) | Alto | Tiempo buffer para remediation | Security |
| Beta testers no activos | Media (35%) | Medio | Incentivos, seguimiento cercano | Product |
| NPS <40 en beta | Media (30%) | Alto | Feedback rápido, iteraciones ágiles | Product |
| Costos cloud más altos de lo esperado | Media (40%) | Medio | Optimizar queries, caching agresivo | DevOps |

---

*(Continuará con Sección 6: UI/UX, Sección 7: Matriz de Riesgos, Sección 8: KPIs, Sección 9: Testing, Sección 10: Checklist de Producción)*
