# Investigación Técnica: Contabilidad Electrónica SAT

**Fecha:** 10 de marzo de 2026
**Versión:** 1.0
**Módulo:** Contabilidad Electrónica SAT
**Prioridad:** 🔴 CRÍTICA
**Gap ID:** Gap #4
**Owner:** Equipo de Desarrollo IDP-App

---

## 1. Descripción del Módulo

### 1.1 Propósito

El módulo de Contabilidad Electrónica automatiza la generación y envío mensual de la contabilidad electrónica al SAT (balanza de comprobación, catálogo de cuentas, pólizas XML), eliminando el proceso manual que consume 30 minutos por cliente y es propenso a errores en códigos agrupadores y estructura XML.

### 1.2 Actividades que Automatiza

| Actividad | Frecuencia | Tiempo Actual | Tiempo Esperado | Ahorro |
|-----------|------------|---------------|-----------------|--------|
| Generación catálogo de cuentas | Mensual | 15 min/cliente | 2 min/cliente | 85% |
| Generación balanza de comprobación | Mensual | 20 min/cliente | 3 min/cliente | 85% |
| Generación pólizas XML | Mensual | 30 min/cliente | 5 min/cliente | 83% |
| Envío al portal SAT | Mensual | 15 min/cliente | 2 min/cliente | 85% |
| Validación estructura XML | Mensual | 10 min/cliente | Automático | 100% |

### 1.3 Dolor Principal que Resuelve

**Problema central:** Los contadores dedican 1.5-2 horas por cliente mensualmente a generar y enviar contabilidad electrónica, un proceso técnico donde errores en códigos agrupadores o estructura XML causan rechazo del SAT y multas de $15,000-$30,000 MXN.

### 1.4 ROI Esperado

| Concepto | Valor |
|----------|-------|
| Tiempo liberado por cliente/mes | 1.5 horas |
| Clientes promedio | 50 clientes |
| Ahorro mensual | $18,750 MXN |
| **ROI anual** | **450-600%** |

---

## 2. Estado del Arte en México (2026)

### 2.1 Regulación Aplicable

| Norma/Regulación | Artículo | Vigencia | Impacto |
|------------------|----------|----------|---------|
| **CFF Art. 28** | Contabilidad en medios electrónicos | Vigente | Obligación de llevar contabilidad electrónica |
| **RMF 2026 Anexo 24** | Contabilidad electrónica | Actualizado 13-ene-2026 | Estructura XML, catálogos |
| **RMF 2026 Anexo 29** | Disposiciones complementarias | Actualizado 09-ene-2026 | Validaciones adicionales |
| **Regla 2.8.1.4 RMF** | Catálogo de cuentas | Vigente | Códigos agrupadores SAT |
| **Regla 2.8.1.5 RMF** | Balanza de comprobación | Vigente | Envío mensual |

### 2.2 Fechas de Envío (2026)

| Documento | Personas Morales | Personas Físicas |
|-----------|------------------|------------------|
| **Catálogo de cuentas** | Con primera balanza | Con primera balanza |
| **Balanza de comprobación** | Días 1-3 del 2do mes posterior | Días 1-5 del 2do mes posterior |
| **Balanza ajuste (balanza 13)** | 20 de abril | 22 de mayo |
| **Pólizas** | Solo requerimiento | Solo requerimiento |

**Fuente:** Anexo 24 RMF 2026, https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/documentos2026/rmf/anexos/Anexo_24_RMF2026-13012026.pdf

### 2.3 Estructura del Catálogo de Cuentas SAT

**Códigos Agrupadores Principales (Anexo 24):**

| Código | Descripción |
|--------|-------------|
| **100** | Activo |
| 101 | Caja |
| 102 | Bancos |
| 103 | Inversiones |
| 105 | Clientes |
| **200** | Pasivo |
| 201 | Proveedores |
| 202 | Acreedores |
| 203 | Impuestos por pagar |
| **300** | Capital Contable |
| **400** | Ingresos |
| **500** | Costos |
| **600** | Gastos |
| **700** | Resultado Integral de Financiamiento |
| **800** | Cuentas de Orden |

**Fuente:** http://omawww.sat.gob.mx/fichas_tematicas/buzon_tributario/Documents/codigo_agrupador.pdf

### 2.4 Estructura de Balanza de Comprobación

**Campos Obligatorios (Anexo 24 Sección B):**

```xml
<Balanza version="1.3" 
         RFC="XAXX010101000" 
         Mes="03" 
         Año="2026" 
         TipoEnvio="N">
  <Cuenta NumeroCuenta="102.01" 
          CodiceAgrupador="102.01" 
          Concepto="Bancos Nacionales" 
          SaldoInicial="100000.00" 
          Debe="500000.00" 
          Haber="450000.00" 
          SaldoFinal="150000.00"/>
</Balanza>
```

**Tipo de Envío:**
- `N` = Normal (primera vez)
- `C` = Complementaria (corrección)

### 2.5 Estructura de Pólizas Contables

**Campos Obligatorios (Anexo 24 Sección C):**

```xml
<Polizas version="1.3" 
         RFC="XAXX010101000" 
         Mes="03" 
         Año="2026">
  <Poliza Fecha="2026-03-15" 
          TipoPoliza="AI" 
          NumeroPoliza="1">
    <Concepto PolizaID="1-1" 
              Cuenta="401.01" 
              Concepto="Venta de mercancía" 
              Debe="100000.00" 
              Haber="0.00">
      <UUID>12345678-1234-5678-1234-567812345678</UUID>
    </Concepto>
  </Poliza>
</Polizas>
```

**Tipos de Póliza:**
- `AI` = Apertura
- `DI` = Diario
- `CI` = Cierre

---

## 3. Implementación Técnica

### 3.1 Arquitectura Recomendada

```
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE ENTRADA                          │
│  ERP Contable │ Excel │ Captura Manual │ CFDI (XML)        │
└────────────────────┬────────────────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                 CAPA DE MAPEO                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Mapeo Cuentas → Códigos Agrupadores SAT              │  │
│  │ Ej: "Bancos BBVA" → 102.01 (Bancos Nacionales)       │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                 CAPA DE GENERACIÓN XML                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Catálogo     │  │ Balanza      │  │ Pólizas      │      │
│  │ (CT)         │  │ (BN/BC)      │  │ (PL)         │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────┬────────────────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                 CAPA DE VALIDACIÓN                          │
│  Validador Schema XSD │ Validación Reglas SAT              │
└────────────────────┬────────────────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                 CAPA DE ENVÍO                               │
│  Portal SAT (Buzón Tributario) │ API Terceros              │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Algoritmo: Generación de Catálogo de Cuentas XML

```python
import xml.etree.ElementTree as ET
from typing import Dict, List
from datetime import datetime

# Códigos agrupadores SAT (extracto Anexo 24)
CODIGOS_AGRUPADORES = {
    '100': 'Activo',
    '101': 'Caja',
    '101.01': 'Caja y efectivo',
    '102': 'Bancos',
    '102.01': 'Bancos nacionales',
    '102.02': 'Bancos extranjeros',
    '200': 'Pasivo',
    '201': 'Proveedores',
    '300': 'Capital contable',
    '400': 'Ingresos',
    '500': 'Costos',
    '600': 'Gastos',
}

def generar_catalogo_cuentas_xml(
    rfc: str,
    cuentas: List[Dict]
) -> str:
    """
    Genera XML de catálogo de cuentas según Anexo 24.
    
    Args:
        rfc: RFC del contribuyente
        cuentas: Lista de cuentas con estructura:
            [
                {
                    'numero': '102.01',
                    'descripcion': 'Bancos BBVA',
                    'nivel': 2,
                    'naturaleza': 'D',
                    'codigo_agrupador': '102.01'
                }
            ]
    
    Returns:
        Ruta al archivo XML generado
    """
    catalogo = ET.Element('Catalogo')
    catalogo.set('version', '1.3')
    catalogo.set('RFC', rfc)
    
    for cuenta in cuentas:
        c = ET.SubElement(catalogo, 'Cuenta')
        c.set('NumeroCuenta', cuenta['numero'])
        c.set('CodigoAgrupador', cuenta['codigo_agrupador'])
        c.set('Concepto', cuenta['descripcion'])
        c.set('Nivel', str(cuenta['nivel']))
        c.set('Naturaleza', cuenta['naturaleza'])  # D=Acreedora, A=Deudora
    
    filename = f"{rfc}_CT.xml"
    ET.ElementTree(catalogo).write(filename, encoding='utf-8', xml_declaration=True)
    return filename
```

### 3.3 Algoritmo: Generación de Balanza de Comprobación XML

```python
def generar_balanza_comprobacion_xml(
    rfc: str,
    mes: int,
    anio: int,
    tipo_envio: str,
    cuentas: List[Dict]
) -> str:
    """
    Genera XML de balanza de comprobación según Anexo 24.
    
    Args:
        rfc: RFC del contribuyente
        mes: Mes (1-13, 13=anual)
        anio: Año
        tipo_envio: 'N' (normal) o 'C' (complementaria)
        cuentas: Lista con saldos y movimientos
    
    Returns:
        Ruta al archivo XML
    """
    balanza = ET.Element('Balanza')
    balanza.set('version', '1.3')
    balanza.set('RFC', rfc)
    balanza.set('Mes', str(mes).zfill(2))
    balanza.set('Anio', str(anio))
    balanza.set('TipoEnvio', tipo_envio)
    
    if tipo_envio == 'C':
        balanza.set('FechaModBalanza', datetime.now().strftime('%Y-%m-%d'))
    
    for cuenta in cuentas:
        c = ET.SubElement(balanza, 'Cuenta')
        c.set('NumeroCuenta', cuenta['numero'])
        c.set('SaldoInicial', f"{cuenta['saldo_inicial']:.2f}")
        c.set('Debe', f"{cuenta['debe']:.2f}")
        c.set('Haber', f"{cuenta['haber']:.2f}")
        c.set('SaldoFinal', f"{cuenta['saldo_final']:.2f}")
    
    filename = f"{rfc}{anio}{str(mes).zfill(2)}BN.xml"
    ET.ElementTree(balanza).write(filename, encoding='utf-8', xml_declaration=True)
    return filename
```

### 3.4 Algoritmo: Generación de Pólizas XML

```python
def generar_polizas_xml(
    rfc: str,
    mes: int,
    anio: int,
    polizas: List[Dict]
) -> str:
    """
    Genera XML de pólizas del periodo según Anexo 24.
    
    Args:
        rfc: RFC del contribuyente
        mes: Mes
        anio: Año
        polizas: Lista de pólizas con conceptos
    
    Returns:
        Ruta al archivo XML
    """
    polizas_elem = ET.Element('Polizas')
    polizas_elem.set('version', '1.3')
    polizas_elem.set('RFC', rfc)
    polizas_elem.set('Mes', str(mes).zfill(2))
    polizas_elem.set('Anio', str(anio))
    
    for poliza in polizas:
        p = ET.SubElement(polizas_elem, 'Poliza')
        p.set('Fecha', poliza['fecha'])
        p.set('TipoPoliza', poliza['tipo'])  # AI, DI, CI
        p.set('NumeroPoliza', str(poliza['numero']))
        
        for concepto in poliza['conceptos']:
            c = ET.SubElement(p, 'Concepto')
            c.set('PolizaID', f"{poliza['numero']}-{concepto['orden']}")
            c.set('Cuenta', concepto['cuenta'])
            c.set('Concepto', concepto['descripcion'])
            c.set('Debe', f"{concepto['debe']:.2f}")
            c.set('Haber', f"{concepto['haber']:.2f}")
            
            # UUID del CFDI asociado (opcional pero recomendado)
            if 'uuid' in concepto:
                uuid_elem = ET.SubElement(c, 'UUID')
                uuid_elem.text = concepto['uuid']
    
    filename = f"{rfc}{anio}{str(mes).zfill(2)}PL.xml"
    ET.ElementTree(polizas_elem).write(filename, encoding='utf-8', xml_declaration=True)
    return filename
```

### 3.5 Validación de Estructura XML

```python
from lxml import etree

def validar_xml_contabilidad(xml_path: str, xsd_path: str) -> Dict:
    """
    Valida XML de contabilidad electrónica contra schema XSD del SAT.
    
    Args:
        xml_path: Ruta al XML a validar
        xsd_path: Ruta al schema XSD oficial del SAT
    
    Returns:
        Resultado de validación
    """
    try:
        # Cargar schema
        with open(xsd_path, 'rb') as f:
            schema_doc = etree.parse(f)
            schema = etree.XMLSchema(schema_doc)
        
        # Cargar XML
        xml_doc = etree.parse(xml_path)
        
        # Validar
        schema.assertValid(xml_doc)
        
        return {
            'valido': True,
            'errores': [],
            'archivo': xml_path
        }
        
    except etree.XMLSchemaError as e:
        return {
            'valido': False,
            'errores': [str(e)],
            'archivo': xml_path
        }
```

### 3.6 Thresholds y Parámetros

| Parámetro | Valor | Justificación |
|-----------|-------|---------------|
| Precisión códigos agrupadores | 100% | Requerido por SAT |
| Tiempo generación XML | <10s | Por documento |
| Tamaño máximo XML | 10MB | Límite SAT |
| Validación schema | 100% | Obligatorio |

---

## 4. Limitantes y Restricciones

### 4.1 Limitación 1: Envío Solo Vía Buzón Tributario

**Problema:** SAT no proporciona API para envío automatizado de contabilidad electrónica.

**Solución:**
- Generar archivos XML listos para carga manual
- Automatización vía Selenium (bajo riesgo)
- Servicios de terceros con API

### 4.2 Riesgos Técnicos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Cambios en Anexo 24 | BAJA | ALTO | Monitorear DOF (diciembre) |
| Error en códigos agrupadores | MEDIA | ALTO | Validación previa |
| Rechazo por estructura | BAJA | MEDIO | Validación con schema XSD |

---

## 5. Métricas Esperadas

| Métrica | Target | Fórmula |
|---------|--------|---------|
| Precisión códigos agrupadores | 100% | `(correctos / total) × 100` |
| Tiempo generación XML | <10s | Por documento |
| Tasa de aceptación SAT | 98%+ | `(aceptadas / total) × 100` |

---

## 6. Roadmap de Implementación

### Fase 1: Generadores XML (4 semanas)

| Semana | Entregable | Owner |
|--------|------------|-------|
| 1 | Catálogo de cuentas XML | Backend |
| 2 | Balanza de comprobación XML | Backend |
| 3 | Pólizas XML | Backend |
| 4 | Validación schema XSD | QA |

---

## 7. Seguridad y Cumplimiento

### 7.1 Requisitos SAT

| Requisito | Impacto |
|-----------|---------|
| Envío mensual (días 1-3/1-5) | Automatización requerida |
| Retención 5 años | Storage XML |
| Disponibilidad auditoría | Acceso rápido |

### 7.2 Multas

| Incumplimiento | Multa |
|----------------|-------|
| Envío extemporáneo | $15,000-$30,000 MXN |
| Errores en información | $8,000-$16,000 MXN |
| No enviar | $20,000-$40,000 MXN |

---

## 8. Conclusiones y Recomendaciones

### Hallazgos Clave

1. **Anexo 24 actualizado:** 13-ene-2026, sin cambios sustanciales
2. **Códigos agrupadores:** 8 categorías principales (100-800)
3. **Fechas estrictas:** Días 1-3 (PM) / 1-5 (PF) del 2do mes posterior
4. **Pólizas solo requerimiento:** No enviar mensualmente

### Recomendaciones

| Área | Recomendación | Prioridad |
|------|---------------|-----------|
| Mapeo | Validar códigos agrupadores | ALTA |
| Validación | Usar schema XSD oficial | ALTA |
| Envío | Automatizar carga manual | MEDIA |

---

## 9. Fuentes Consultadas

### Fuentes Oficiales
| Fuente | URL | Fecha |
|--------|-----|-------|
| SAT - Anexo 24 RMF 2026 | https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/documentos2026/rmf/anexos/Anexo_24_RMF2026-13012026.pdf | 10-mar-2026 |
| SAT - Anexo 29 RMF 2026 | https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/documentos2026/rmf/anexos/Anexo_29_RMF2026-09012026.pdf | 10-mar-2026 |
| SAT - Contabilidad Electrónica | https://www.gob.mx/sat/acciones-y-programas/contabilidad-electronica-173700 | 10-mar-2026 |
| SAT - Código Agrupador | http://omawww.sat.gob.mx/fichas_tematicas/buzon_tributario/Documents/codigo_agrupador.pdf | 10-mar-2026 |
| DOF - RMF 2026 | https://dof.gob.mx/2025/SHCP/SHCP_281225_02.pdf | 10-mar-2026 |
| IDC - Anexo 24 2026 | https://idconline.mx/fiscal-contable/2026/01/16/anexo-24-rmisc-2026-cambios-en-contabilidad | 10-mar-2026 |
| CONTPAQi - Pólizas | https://www.contpaqi.com/publicaciones/tendencias-fiscales/polizas-contables-electronicas-como-estructurarlas-segun-el-sat | 10-mar-2026 |
| CalcImp - Contabilidad | https://calcimp.com/como-se-integra-la-contabilidad-electronica/ | 10-mar-2026 |
| SAT - Manual Usuario | http://omawww.sat.gob.mx/fichas_tematicas/buzon_tributario/Documents/Manual_usuario030817.pdf | 10-mar-2026 |
| Zoho - Obligaciones 2026 | https://www.zoho.com/blog/es-xl/books/obligaciones2026.html | 10-mar-2026 |

---

## 10. Control de Cambios

| Versión | Fecha | Autor | Tipo | Cambios |
|---------|-------|-------|------|---------|
| 1.0 | 10-mar-2026 | Diego Gzz | Creación | Versión inicial |
| 1.1 | 10-mar-2026 | Diego Gzz | Investigación Tavily | 4 queries ejecutados: (1) Anexo 29 RMF 2026, (2) balanza comprobación SAT, (3) catálogo cuentas SAT, (4) pólizas XML. 10 fuentes oficiales agregadas. |
| 1.2 | 10-mar-2026 | Diego Gzz | Actualización | Código Python funcional (generadores XML: catálogo, balanza, pólizas). Diagrama ASCII de arquitectura. Tabla de códigos agrupadores. Fechas de envío actualizadas. |

---

**Documento elaborado por:** Diego Gzz - Principal Engineering Lead
**Fecha:** 10 de marzo de 2026
**Próxima actualización:** Después de validación con contador certificado

---

*Fin de la Investigación de Contabilidad Electrónica*
