from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from typing import Dict, Any
from app.domain.payroll.payroll_engine import engine as payroll_engine, SUAParser
from app.domain.payroll.spei_service import spei_service
from app.core.security import get_current_user
from app.db.models import User

router = APIRouter()

@router.post("/calculate")
async def calculate_payroll(payload: Dict[str, Any], current_user: User = Depends(get_current_user)):
    """Calcula nómina real (ISR + IMSS 2026)"""
    try:
        sbc = payload.get("sbc", 0.0)
        dias = payload.get("dias", 15)
        # TODO: Cargar datos de empleado de DB si existen
        receipt = payroll_engine.procesar_recibo({"sbc": sbc, "dias_pagados": dias})
        return receipt
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/upload-sua")
async def upload_sua(file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    """Parsea archivo SUA para extraer trabajadores"""
    content = await file.read()
    try:
        parser = SUAParser()
        workers = parser.parse_trabajadores(content.decode('utf-8'))
        return {"count": len(workers), "workers": workers}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error parsing SUA: {str(e)}")

@router.post("/disbursements")
async def trigger_disbursements(payload: Dict[str, Any], current_user: User = Depends(get_current_user)):
    """Dispersión de pagos vía SPEI/STP"""
    try:
        payments = payload.get("payments", [])
        if not payments:
            return {"status": "error", "message": "No payments provided"}
        
        batch_id = payload.get("batch_id", "PAYROLL-" + str(current_user.id))
        results = await spei_service.dispersar_nomina(batch_id, payments)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
