"""
Router de Auditoría y Estados Financieros (Fase 12)
"""
from fastapi import APIRouter
from typing import Dict, Any
from app.domain.audit.audit_engine import AuditEngine
from app.domain.audit.health_report import FiscalHealthReportGenerator
from app.domain.fiscal.financial_statements import FinancialStatementGenerator
from app.domain.fiscal.tax_advisor import TaxAdvisorService

router = APIRouter()
audit_engine = AuditEngine()
report_gen = FiscalHealthReportGenerator()
advisor = TaxAdvisorService()

@router.post("/run-audit")
def run_audit(payload: Dict[str, Any]):
    """Ejecuta una auditoría completa NIA."""
    return audit_engine.run_comprehensive_audit(payload)

@router.post("/financial-statements")
def get_financial_statements(payload: Dict[str, Any]):
    """Genera Balance General y Estado de Resultados."""
    company = payload.get("company", "Empresa Ejemplo SA")
    rfc = payload.get("rfc", "EXT990101NI1")
    gen = FinancialStatementGenerator(company, rfc)
    
    period = payload.get("period", "Marzo 2026")
    return {
        "IncomeStatement": gen.generate_income_statement([], period),
        "BalanceSheet": gen.generate_balance_sheet([], period)
    }

@router.post("/tax-advisor/ask")
def ask_advisor(payload: Dict[str, Any]):
    """Consulta al Asesor Fiscal RAG."""
    query = payload.get("query", "")
    return advisor.ask_fiscal_question(query)

@router.post("/final-report")
def get_final_report(payload: Dict[str, Any]):
    """Obtiene el dictamen ejecutivo final consolidado."""
    company = payload.get("company", "Empresa Ejemplo SA")
    audit_res = audit_engine.run_comprehensive_audit({})
    
    gen_fs = FinancialStatementGenerator(company, "EXT990101NI1")
    financials = {
        "IncomeStatement": gen_fs.generate_income_statement([], "Marzo 2026")
    }
    
    return report_gen.generate_final_report(company, audit_res, financials)
