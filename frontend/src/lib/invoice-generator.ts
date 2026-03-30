/**
 * Utility for generating tax-compliant invoice documents (Conceptual CFDI 4.0)
 */

import { apiRequest } from './api-client';
import { toast } from 'sonner';

export interface InvoiceData {
  id: string;
  rfc_emisor: string;
  rfc_receptor: string;
  fecha: string;
  total: number;
  subtotal: number;
  iva: number;
  conceptos: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    amount: number;
  }>;
  stamp?: string; // Conceptually the SAT digital signature
}

export const generateInvoiceXML = (data: InvoiceData): string => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante 
    xmlns:cfdi="http://www.sat.gob.mx/cfd/4" 
    Version="4.0" 
    Serie="A" 
    Folio="${data.id}" 
    Fecha="${data.fecha}T12:00:00" 
    SubTotal="${data.subtotal.toFixed(2)}" 
    Total="${data.total.toFixed(2)}" 
    TipoDeComprobante="I" 
    Exportacion="01" 
    LugarExpedicion="06600">
  <cfdi:Emisor Rfc="${data.rfc_emisor}" Nombre="IDP ASISTENTE CONTABLE SA DE CV" RegimenFiscal="601"/>
  <cfdi:Receptor Rfc="${data.rfc_receptor}" Nombre="CLIENTE DEMO" UsoCFDI="G03" RegimenFiscalReceptor="601" DomicilioFiscalReceptor="06600"/>
  <cfdi:Conceptos>
    ${data.conceptos.map(c => `
    <cfdi:Concepto ClaveProdServ="84111506" Cantidad="${c.quantity}" ClaveUnidad="E48" Descripcion="${c.description}" ValorUnitario="${c.unit_price.toFixed(2)}" Importe="${c.amount.toFixed(2)}">
      <cfdi:Impuestos>
        <cfdi:Traslados>
          <cfdi:Traslado Base="${c.amount.toFixed(2)}" Impuesto="002" TipoFactor="Tasa" TasaOCuota="0.160000" Importe="${(c.amount * 0.16).toFixed(2)}"/>
        </cfdi:Traslados>
      </cfdi:Impuestos>
    </cfdi:Concepto>`).join('')}
  </cfdi:Conceptos>
  <cfdi:Complemento>
    <tfd:TimbreFiscalDigital xmlns:tfd="http://www.sat.gob.mx/TimbreFiscalDigital" UUID="${crypto.randomUUID()}" FechaTimbrado="${new Date().toISOString()}" SelloCFD="${data.stamp || 'SAMPLE_STAMP'}"/>
  </cfdi:Complemento>
</cfdi:Comprobante>`;
};

/**
 * Downloads a file to the browser
 */
export const downloadFile = (content: string, filename: string, contentType: string) => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Generates and downloads the PDF version (Conceptual)
 * In a real scenario, this would use a library or a backend print service.
 */
export const downloadInvoicePDF = (data: InvoiceData) => {
  // Creating a simple HTML representation for demo purposes
  // Simulated QR Code (Conceptual)
  const qrPlaceholder = `<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0H30V10H10V30H0V0Z" fill="black"/>
    <path d="M50 0H80V30H70V10H50V0Z" fill="black"/>
    <path d="M0 50V80H30V70H10V50H0Z" fill="black"/>
    <path d="M15 15H25V25H15V15Z" fill="black"/>
    <path d="M55 15H65V25H55V15Z" fill="black"/>
    <path d="M15 55H25V65H15V55Z" fill="black"/>
    <rect x="35" y="35" width="10" height="10" fill="black"/>
    <rect x="45" y="45" width="10" height="10" fill="black"/>
    <rect x="35" y="55" width="10" height="10" fill="black"/>
    <rect x="55" y="35" width="10" height="10" fill="black"/>
  </svg>`;

  const html = `
    <html>
      <head>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
          body { font-family: 'Inter', sans-serif; padding: 40px; color: #1f2937; line-height: 1.5; }
          .header { display: flex; justify-content: space-between; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; }
          .logo { background: #3b82f6; color: white; padding: 10px; font-weight: bold; border-radius: 4px; font-size: 20px; }
          .details { margin-top: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
          .label { color: #6b7280; font-size: 10px; font-weight: bold; text-transform: uppercase; margin-bottom: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 40px; border: 1px solid #e5e7eb; }
          th { background: #f9fafb; text-align: left; padding: 12px; border-bottom: 2px solid #e5e7eb; font-size: 12px; }
          td { padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 12px; }
          .footer { margin-top: 50px; display: flex; justify-content: space-between; align-items: flex-end; }
          .fiscal-info { font-size: 9px; color: #9ca3af; max-width: 400px; word-break: break-all; font-family: monospace; }
          .totals { width: 250px; }
          .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
          .grand-total { font-weight: bold; font-size: 18px; color: #111827; border-top: 2px solid #e5e7eb; padding-top: 12px; margin-top: 8px; }
          .qr-section { display: flex; gap: 20px; align-items: center; border: 1px solid #e5e7eb; padding: 10px; border-radius: 8px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">IDP ASISTENTE</div>
            <p style="margin:10px 0 0 0; font-size: 18px; font-weight: bold;">Comprobante Fiscal Digital (CFDI)</p>
            <p style="margin:4px 0; color: #6b7280;">Folio: <strong>${data.id}</strong> | Serie: A</p>
          </div>
          <div style="text-align: right;">
            <p class="label">Emisor</p>
            <p style="font-weight: bold; margin:0;">IDP ASISTENTE CONTABLE SA DE CV</p>
            <p style="margin:2px 0;">${data.rfc_emisor}</p>
            <p style="margin:2px 0; color: #6b7280; font-size: 11px;">601 - General de Ley Personas Morales</p>
          </div>
        </div>
        <div class="details">
          <div>
            <p class="label">Receptor</p>
            <p style="font-weight: bold; margin:0;">CLIENTE DEMO S.A. DE C.V.</p>
            <p style="margin:2px 0;">RFC: ${data.rfc_receptor}</p>
            <p style="margin:2px 0; color: #6b7280; font-size: 11px;">Uso CFDI: G03 - Gastos en General</p>
          </div>
          <div style="text-align: right;">
            <p class="label">Información de Pago</p>
            <p style="margin:2px 0;">Método: PUE - Pago en una sola exhibición</p>
            <p style="margin:2px 0;">Forma: 03 - Transferencia electrónica</p>
            <p style="margin:2px 0;">Moneda: MXN - Peso Mexicano</p>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Clave SAT</th>
              <th>Descripción</th>
              <th style="text-align: right;">Cant</th>
              <th style="text-align: right;">P. Unitario</th>
              <th style="text-align: right;">Importe</th>
            </tr>
          </thead>
          <tbody>
            ${data.conceptos.map(c => `
              <tr>
                <td><span style="color:#9ca3af">84111506</span></td>
                <td>${c.description}</td>
                <td style="text-align: right;">${c.quantity}</td>
                <td style="text-align: right;">$${c.unit_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td style="text-align: right; font-weight: bold;">$${c.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          <div class="qr-section">
            ${qrPlaceholder}
            <div class="fiscal-info">
              <p style="margin:0 0 4px 0; font-weight:bold; color:#4b5563">Sello Digital del SAT</p>
              ${data.stamp || 'NI+c79879as8d79as8d79as8d798a7s9d8a7s9d8a7s9d8a7s9d8a7s9d8a7s9d8a7s9d8a7s9d8a7s9d8a7s9d8a7s9d8a7s9d8a7s9d8a7s9d8a7s9d8a7s9d8a7s9d8a7s9d8a7s9d8a7s9d8a7s9d8a7s9d8a7s9d8a7s9d8a7s9d8a7s9d8a7s9d8a7s9d8a7s9d8a7s9d8a7s9d8a7s9d8a=='}
              <p style="margin:8px 0 4px 0; font-weight:bold; color:#4b5563">Cadena Original del Complemento de Certificación</p>
              ||1.1|${crypto.randomUUID()}|${new Date().toISOString()}|${data.stamp || 'SAMPLE_STAMP'}||
            </div>
          </div>
          <div class="totals">
            <div class="total-row"><span>Subtotal:</span> <span>$${data.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
            <div class="total-row"><span>IVA (16%):</span> <span>$${data.iva.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
            <div class="total-row grand-total"><span>TOTAL:</span> <span>$${data.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
          </div>
        </div>
      </body>
    </html>
  `;
  
  // Real implementation would use something like html2pdf
  downloadFile(html, `Factura_${data.id}.html`, 'text/html');
  toast.success('Documento PDF generado');
};
