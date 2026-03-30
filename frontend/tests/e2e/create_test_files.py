"""
Script para generar archivos de prueba para tests E2E

Genera:
- test-document.pdf: PDF pequeño (< 1MB)
- test-cfdi.xml: CFDI XML de prueba
- large-file.pdf: PDF grande (> 10MB) para testing de límites
- invalid-format.txt: Archivo con formato no soportado
"""

import os
from pathlib import Path

# Directorio de output
OUTPUT_DIR = Path(__file__).parent / 'files'
OUTPUT_DIR.mkdir(exist_ok=True)

def create_test_pdf(filename: str, size_kb: int = 100):
    """
    Crear un PDF de prueba usando reportlab o estructura básica
    
    Args:
        filename: Nombre del archivo
        size_kb: Tamaño aproximado en KB
    """
    try:
        from reportlab.pdfgen import canvas
        from reportlab.lib.pagesizes import letter
        
        pdf_path = OUTPUT_DIR / filename
        c = canvas.Canvas(str(pdf_path), pagesize=letter)
        
        # Agregar contenido repetido hasta alcanzar el tamaño deseado
        y_position = 750
        page_count = 0
        current_size = 0
        
        while current_size < size_kb * 1024:
            c.drawString(100, y_position, f"Documento de prueba para E2E tests - {filename}")
            c.drawString(100, y_position - 20, f"Página {page_count + 1}")
            c.drawString(100, y_position - 40, "Este es un archivo generado automáticamente para pruebas de upload.")
            c.drawString(100, y_position - 60, "ID: TEST-" + "X" * 50)  # Contenido repetido
            
            y_position -= 100
            
            if y_position < 100:
                page_count += 1
                c.showPage()
                y_position = 750
            
            # Guardar temporalmente para verificar tamaño
            temp_path = OUTPUT_DIR / f".temp_{filename}"
            c.save()
            current_size = os.path.getsize(temp_path)
        
        c.save()
        
        # Renombrar si se creó con nombre temporal
        temp_path = OUTPUT_DIR / f".temp_{filename}"
        if temp_path.exists():
            temp_path.rename(pdf_path)
        
        print(f"✓ Creado: {pdf_path} ({os.path.getsize(pdf_path) / 1024:.1f} KB)")
        
    except ImportError:
        # Fallback: crear PDF básico sin reportlab
        print(f"⚠ reportlab no disponible, creando PDF básico para {filename}")
        create_basic_pdf(filename, size_kb)


def create_basic_pdf(filename: str, size_kb: int = 100):
    """
    Crear un PDF básico sin dependencias externas
    Usa estructura PDF mínima
    """
    pdf_path = OUTPUT_DIR / filename
    
    # Encabezado PDF mínimo
    content = b"%PDF-1.4\n"
    content += b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"
    content += b"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n"
    content += b"3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>\nendobj\n"
    content += b"xref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n"
    content += b"trailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n193\n%%EOF\n"
    
    # Rellenar para alcanzar tamaño deseado
    padding = b" " * (size_kb * 1024 - len(content))
    content += padding
    
    with open(pdf_path, 'wb') as f:
        f.write(content)
    
    print(f"✓ Creado (básico): {pdf_path} ({os.path.getsize(pdf_path) / 1024:.1f} KB)")


def create_test_cfdi():
    """
    Crear un CFDI XML de prueba
    """
    xml_content = """<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4"
    Version="4.0"
    Folio="TEST-001"
    Fecha="2026-03-10T12:00:00"
    Sello=""
    FormaPago="01"
    NoCertificado=""
    Certificado=""
    SubTotal="1000.00"
    Total="1160.00"
    TipoDeComprobante="I"
    Exportacion="01"
    Moneda="MXN"
    LugarExpedicion="06600">
    
    <cfdi:Emisor Rfc="XAXX010101000" Nombre="Empresa Test SA de CV" RegimenFiscal="601"/>
    
    <cfdi:Receptor Rfc="XEXX010101000" Nombre="Cliente Test" DomicilioFiscalReceptor="06600"
        RegimenFiscalReceptor="616" UsoCFDI="G03"/>
    
    <cfdi:Conceptos>
        <cfdi:Concepto ClaveProdServ="01010101" Cantidad="1" ClaveUnidad="E48"
            Descripcion="Servicio de consultoría" ValorUnitario="1000.00" Importe="1000.00">
            <cfdi:Impuestos>
                <cfdi:Traslados>
                    <cfdi:Traslado Base="1000.00" Impuesto="002" TipoFactor="Tasa"
                        TasaOCuota="0.160000" Importe="160.00"/>
                </cfdi:Traslados>
            </cfdi:Impuestos>
        </cfdi:Concepto>
    </cfdi:Conceptos>
    
    <cfdi:Impuestos TotalImpuestosTrasladados="160.00">
        <cfdi:Traslados>
            <cfdi:Traslado Base="1000.00" Impuesto="002" TipoFactor="Tasa"
                TasaOCuota="0.160000" Importe="160.00"/>
        </cfdi:Traslados>
    </cfdi:Impuestos>
</cfdi:Comprobante>
"""
    
    xml_path = OUTPUT_DIR / 'test-cfdi.xml'
    with open(xml_path, 'w', encoding='utf-8') as f:
        f.write(xml_content)
    
    print(f"✓ Creado: {xml_path} ({os.path.getsize(xml_path)} bytes)")


def create_invalid_format():
    """
    Crear archivo con formato no soportado
    """
    txt_path = OUTPUT_DIR / 'invalid-format.txt'
    
    with open(txt_path, 'w', encoding='utf-8') as f:
        f.write("Este es un archivo de texto plano.\n")
        f.write("No es un formato soportado por el sistema IDP.\n")
        f.write("Solo se aceptan PDF, XML y CSV.\n")
    
    print(f"✓ Creado: {txt_path} ({os.path.getsize(txt_path)} bytes)")


def main():
    print("=" * 60)
    print("Generando archivos de prueba para E2E tests")
    print("=" * 60)
    
    # Crear PDF pequeño (< 1MB)
    create_test_pdf('test-document.pdf', size_kb=100)
    
    # Crear XML CFDI
    create_test_cfdi()
    
    # Crear archivo inválido
    create_invalid_format()
    
    # Crear PDF grande (> 10MB) para testing de límites
    print("\nCreando archivo grande (esto puede tardar)...")
    create_test_pdf('large-file.pdf', size_kb=11000)  # ~11MB
    
    print("\n" + "=" * 60)
    print("Archivos generados exitosamente")
    print("=" * 60)
    
    # Listar archivos creados
    print("\nArchivos en", OUTPUT_DIR)
    for file in OUTPUT_DIR.iterdir():
        if file.is_file() and not file.name.startswith('.'):
            size = file.stat().st_size
            size_str = f"{size / 1024:.1f} KB" if size < 1024 * 1024 else f"{size / (1024 * 1024):.1f} MB"
            print(f"  - {file.name}: {size_str}")


if __name__ == '__main__':
    main()
