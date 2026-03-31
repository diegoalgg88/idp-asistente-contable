"""
Router Fiscal y Declaraciones (Fase 11)
"""
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from datetime import datetime
from typing import Dict, Any
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.security import get_current_user
from app.db.models import User
from app.domain.fiscal.tax_calculator import TaxCalculator
from app.domain.fiscal.declaraciones import DeclarationGenerator
from app.domain.fiscal.electronic_accounting import ElectronicAccountingGenerator
from app.domain.fiscal.papel_de_trabajo import PapelDeTrabajoService

router = APIRouter()

@router.post("/calculate-taxes")
def calculate_taxes(payload: Dict[str, Any]):
    """Calcula ISR e IVA para un periodo."""
    calc = TaxCalculator(regime=payload.get("regime", "RESICO_PF"))
    income = payload.get("income", 0.0)
    subtotal_iva = payload.get("subtotal_iva", 0.0)
    
    return {
        "isr": calc.calculate_isr(income),
        "iva": calc.calculate_iva(subtotal_iva)
    }

@router.get("/export-working-paper")
async def export_working_paper(
    rfc: str,
    year: int = 2026,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Genera y descarga el Papel de Trabajo Fiscal en Excel."""
    service = PapelDeTrabajoService(db, current_user.id, rfc, year)
    try:
        output = service.generate_report()
        headers = {
            'Content-Disposition': f'attachment; filename="papel_trabajo_{rfc}_{year}.xlsx"'
        }
        return StreamingResponse(
            output,
            headers=headers,
            media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generando el reporte: {str(e)}")

@router.post("/generate-declaration")
def generate_declaration(payload: Dict[str, Any]):
    """Genera el XML de la declaración mensual."""
    gen = DeclarationGenerator()
    return gen.generate_monthly_declaration(
        payload.get("tax_data", {}),
        payload.get("period", "2026-03"),
        payload.get("rfc", "EXT990101NI1")
    )

@router.post("/electronic-accounting")
def generate_accounting_xml(payload: Dict[str, Any]):
    """Genera archivos de Contabilidad Electrónica Anexo 24."""
    rfc = payload.get("rfc", "EXT990101NI1")
    month = payload.get("month", 3)
    year = payload.get("year", 2026)
    type = payload.get("type", "CT") # CT, BC, PL
    
    gen = ElectronicAccountingGenerator(rfc)
    if type == "CT":
        return gen.generate_account_catalog(payload.get("accounts", []), month, year)
    elif type == "BC":
        return gen.generate_trial_balance(payload.get("balances", []), month, year)
    elif type == "PL":
        return gen.generate_journal_entries(payload.get("entries", []), month, year)
    
    return {"status": "error", "message": "Invalid accounting type"}

@router.post("/sync-sat")
async def sync_sat_documents(payload: Dict[str, Any]):
    """Inicia la sincronización masiva de documentos desde el SAT."""
    from app.domain.fiscal.sat_massive_download import SATMassiveDownloadClient
    import os
    
    # En un entorno real, estos vendrían de la configuración del cliente/empresa
    cert_path = payload.get("cert_path", "C:/Users/DiegoGzz/Documents/Programas/My-Projects/CPP_APP/IDP-App/idp-asistente-contable/backend/certs/fake_cert.cer")
    key_path = payload.get("key_path", "C:/Users/DiegoGzz/Documents/Programas/My-Projects/CPP_APP/IDP-App/idp-asistente-contable/backend/certs/fake_key.key")
    passphrase = os.getenv("EFIRMA_PASSPHRASE", "password123")
    
    client = SATMassiveDownloadClient(cert_path, key_path, passphrase)
    
    try:
        success = client.authenticate()
        if not success:
            return {"status": "error", "message": "Fallo de autenticación con e.firma"}
            
        # Iniciar consulta (ejemplo para el mes actual)
        request_id = await client.query_cfdi(
            rfc=payload.get("rfc", "EXT990101NI1"),
            start_date=datetime(2026, 3, 1),
            end_date=datetime(2026, 3, 31)
        )
        
        return {
            "status": "success",
            "message": "Sincronización iniciada correctamente",
            "request_id": request_id
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@router.get("/compliance-opinion")
async def get_compliance_opinion(rfc: str):
    """Obtiene la Opinión del Cumplimiento 32-D vía scraper."""
    from app.domain.fiscal.scraper_32d import ComplianceOpinionScraper
    
    scraper = ComplianceOpinionScraper(rfc)
    pdf_path = await scraper.get_opinion_pdf()
    
    if pdf_path:
        return {
            "status": "success",
            "message": "Opinión obtenida correctamente",
            "pdf_url": pdf_path,
            "rfc": rfc,
            "date": datetime.now().isoformat()
        }
    else:
        return {"status": "error", "message": "No se pudo obtener la opinión del cumplimiento"}
