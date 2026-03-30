import pandas as pd
import io
import logging
from datetime import datetime
from sqlalchemy.orm import Session
from decimal import Decimal

from app.db.models import Document
from app.services.fiscal.tax_calculator import TaxCalculator

logger = logging.getLogger(__name__)

class PapelDeTrabajoService:
    """
    Servicio para generar el Papel de Trabajo Fiscal en Excel.
    Consolida ingresos y egresos de los CFDIs procesados y calcula impuestos mensuales.
    """
    
    def __init__(self, db: Session, user_id: int, rfc_cliente: str, year: int = 2026, regime: str = "RESICO_PF"):
        self.db = db
        self.user_id = user_id
        self.rfc_cliente = rfc_cliente
        self.year = year
        self.calculator = TaxCalculator(regime=regime)

    def generate_report(self) -> io.BytesIO:
        """
        Genera un archivo Excel con el resumen anual, detalle mensual y lista de CFDIs.
        """
        # 1. Obtener todos los documentos del usuario
        documents = self.db.query(Document).filter(
            Document.user_id == self.user_id,
            Document.status == "completed"
        ).all()

        # 2. Procesar datos para el reporte
        cfdi_data = []
        monthly_summary = {m: {"ingresos": Decimal("0.00"), "egresos": Decimal("0.00"), "iva_trasladado": Decimal("0.00"), "iva_acreditable": Decimal("0.00")} for m in range(1, 13)}

        for doc in documents:
            ext = doc.extracted_data or {}
            try:
                # Filtrar por fecha (si existe en los datos extraídos)
                fecha_str = ext.get("fecha_emision") or ext.get("date")
                if not fecha_str:
                    continue
                
                fecha = datetime.fromisoformat(fecha_str.split("T")[0])
                if fecha.year != self.year:
                    continue
                
                month = fecha.month
                total = Decimal(str(ext.get("total") or 0))
                subtotal = Decimal(str(ext.get("subtotal") or (total / Decimal("1.16")))) # Estimación si no hay subtotal
                iva = total - subtotal
                
                is_ingreso = ext.get("rfc_emisor") == self.rfc_cliente
                is_egreso = ext.get("rfc_receptor") == self.rfc_cliente
                
                doc_info = {
                    "UUID": ext.get("uuid", "N/A"),
                    "Fecha": fecha.strftime("%Y-%m-%d"),
                    "RFC Emisor": ext.get("rfc_emisor", "N/A"),
                    "RFC Receptor": ext.get("rfc_receptor", "N/A"),
                    "Subtotal": float(subtotal.quantize(Decimal("0.01"))),
                    "IVA": float(iva.quantize(Decimal("0.01"))),
                    "Total": float(total.quantize(Decimal("0.01"))),
                    "Tipo": "Ingreso" if is_ingreso else "Egreso"
                }
                cfdi_data.append(doc_info)

                if is_ingreso:
                    monthly_summary[month]["ingresos"] += subtotal
                    monthly_summary[month]["iva_trasladado"] += iva
                elif is_egreso:
                    monthly_summary[month]["egresos"] += subtotal
                    monthly_summary[month]["iva_acreditable"] += iva

            except Exception as e:
                logger.error(f"Error procesando documento {doc.id} para papel de trabajo: {e}")

        # 3. Calcular impuestos mensuales
        report_data = []
        for month, data in monthly_summary.items():
            isr_calc = self.calculator.calculate_isr(float(data["ingresos"]))
            iva_neto = data["iva_trasladado"] - data["iva_acreditable"]
            
            report_data.append({
                "Mes": datetime(self.year, month, 1).strftime("%B"),
                "Ingresos (Subtotal)": float(data["ingresos"]),
                "Egresos (Subtotal)": float(data["egresos"]),
                "IVA Trasladado": float(data["iva_trasladado"]),
                "IVA Acreditable": float(data["iva_acreditable"]),
                "IVA a Pagar/Favor": float(iva_neto.quantize(Decimal("0.01"))),
                "ISR a Pagar": isr_calc.get("isr_to_pay", 0.0),
                "Tasa ISR": isr_calc.get("rate") or isr_calc.get("row_applied", {}).get("percent", 0.0)
            })

        # 4. Crear DataFrames y Exportar a Excel
        df_summary = pd.DataFrame(report_data)
        df_cfdis = pd.DataFrame(cfdi_data)

        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df_summary.to_excel(writer, index=False, sheet_name='Resumen Mensual')
            df_cfdis.to_excel(writer, index=False, sheet_name='Detalle CFDIs')
            
            # Formatear celdas (opcional, pandas lo hace básico)
            workbook = writer.book
            for sheet in workbook.worksheets:
                for col in sheet.columns:
                    max_length = 0
                    column = col[0].column_letter
                    for cell in col:
                        try:
                            if len(str(cell.value)) > max_length:
                                max_length = len(str(cell.value))
                        except Exception:
                            pass
                    adjusted_width = (max_length + 2)
                    sheet.column_dimensions[column].width = adjusted_width

        output.seek(0)
        return output
