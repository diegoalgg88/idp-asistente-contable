# Investigación Técnica: Validación CFDI y Lista 69-B

**Fecha:** 10 de marzo de 2026
**Versión:** 1.0
**Módulo:** Validación CFDI vs SAT
**Prioridad:** 🔴 CRÍTICA
**Gap ID:** Gap #4 (parcialmente cubierto)

---

## 1. Requisitos SAT 2026

### 1.1 Cambios Críticos para 2026

| Requisito | Vigencia | Impacto en IDP-App |
|-----------|----------|-------------------|
| **Materialidad de operaciones** | Enero 2026 | Validar que CFDI represente operación real |
| **Anexo 29 RMF actualizado** | Enero 2026 | Nuevos catálogos y validaciones |
| **Carta Porte 3.0** | Marzo 2025 | Validación para transporte de mercancías |
| **Nuevos supuestos de retención** | Enero 2026 | Cálculo automático de retenciones |

### 1.2 Validación de Materialidad (Crítico 2026)

**Requisito SAT:**
El contribuyente debe demostrar que las operaciones amparadas por CFDI:
1. ✅ **Existieron realmente** (no son simuladas)
2. ✅ **Se prestaron o entregaron efectivamente**
3. ✅ **Se vinculan con la actividad del negocio**

**Implementación en IDP-App:**
```python
def validate_materialidad(cfdi: dict, tenant_operations: dict) -> dict:
    """
    Valida materialidad de operación según artículo 69-B CFF.

    Retorna:
        dict con nivel de riesgo y recomendaciones
    """
    risk_factors = []

    # 1. Validar que RFC emisor NO esté en lista 69-B
    if rfc_in_69b_list(cfdi['rfc_emisor']):
        risk_factors.append({
            'factor': 'Emisor en lista 69-B (EFO/EDO)',
            'severity': 'CRITICAL',
            'recommendation': 'No deducir. Solicitar factura a proveedor alterno.'
        })

    # 2. Validar coherencia con actividad económica del receptor
    if not is_coherent_with_business(cfdi, tenant_operations):
        risk_factors.append({
            'factor': 'Operación no coherente con actividad del negocio',
            'severity': 'HIGH',
            'recommendation': 'Documentar relación con actividad empresarial'
        })

    # 3. Validar monto vs histórico de operaciones con proveedor
    if amount_exceeds_historical_pattern(cfdi):
        risk_factors.append({
            'factor': 'Monto atípico vs histórico con proveedor',
            'severity': 'MEDIUM',
            'recommendation': 'Solicitar documentación soporte adicional'
        })

    # 4. Validar fecha vs fecha de entrega/servicio
    if date_inconsistency_detected(cfdi):
        risk_factors.append({
            'factor': 'Inconsistencia en fechas (emisión vs entrega)',
            'severity': 'MEDIUM',
            'recommendation': 'Verificar documentación de entrega'
        })

    return {
        'risk_level': calculate_overall_risk(risk_factors),
        'factors': risk_factors,
        'is_deductible': len([f for f in risk_factors if f['severity'] == 'CRITICAL']) == 0
    }
```

---

## 2. Lista 69-B - Implementación Técnica

### 2.1 Fuente de Datos

**URL oficial SAT:**
```
https://www.sat.gob.mx/cs/Satellite?blobcol=urldata&blobkey=id&blobtable=MungoBlobs&blobwhere=1576-500384&ssbinary=true
```

**Estructura del archivo:**
- Formato: PDF (requiere parsing)
- Actualización: Semanal (generalmente viernes)
- Contenido: RFC, nombre/razón social, situación (presunto/definitivo/sentencia favorable)

### 2.2 Estrategia de Actualización

```python
class EFOListUpdater:
    """
    Actualizador semanal de lista 69-B.
    Se ejecuta todos los viernes a las 6:00 AM.
    """

    SAT_URL = "https://www.sat.gob.mx/cs/Satellite?blobcol=urldata&blobkey=id&blobtable=MungoBlobs&blobwhere=1576-500384&ssbinary=true"

    def __init__(self, db_session, chroma_client):
        self.db = db_session
        self.chroma = chroma_client

    def check_and_update(self) -> dict:
        """
        Verifica si hay nueva lista y actualiza ChromaDB.
        """
        # 1. Descargar PDF del SAT
        response = requests.get(self.SAT_URL, timeout=30)

        # 2. Parsear PDF (usando pdfplumber o similar)
        efo_list = self._parse_efo_pdf(response.content)

        # 3. Comparar con lista actual en ChromaDB
        collection = self.chroma.get_collection("lista_69b_efo")
        current_count = collection.count()

        if len(efo_list) != current_count:
            # 4. Actualizar colección
            collection.delete(where={})  # Limpiar colección

            for efo in efo_list:
                collection.add(
                    documents=[f"RFC: {efo['rfc']}, Nombre: {efo['nombre']}"],
                    metadatas=[{
                        'rfc': efo['rfc'],
                        'nombre': efo['nombre'],
                        'situacion': efo['situacion'],
                        'fecha_publicacion': efo['fecha']
                    }],
                    ids=[efo['rfc']]
                )

            # 5. Notificar a contadores sobre nuevos EFOs
            new_efos = self._detect_new_efos(efo_list)
            if new_efos:
                self._notify_accountants(new_efos)

            return {'updated': True, 'new_count': len(efo_list)}

        return {'updated': False, 'count': current_count}

    def check_rfc(self, rfc: str) -> dict:
        """
        Verifica si un RFC está en lista 69-B.
        """
        collection = self.chroma.get_collection("lista_69b_efo")
        results = collection.get(ids=[rfc])

        if results['ids']:
            return {
                'in_list': True,
                'rfc': rfc,
                'nombre': results['metadatas'][0]['nombre'],
                'situacion': results['metadatas'][0]['situacion'],
                'risk_level': 'CRITICAL'
            }

        return {'in_list': False, 'risk_level': 'LOW'}
```

### 2.3 Impacto en Deducibilidad

**Consecuencias de operar con EFO:**
| Concepto | Consecuencia |
|----------|--------------|
| **Crédito fiscal** | No acreditable (IVA) |
| **Deducción** | No deducible (ISR) |
| **Multa** | 55-75% del monto de la operación |
| **Delito** | Hasta 9 años de prisión (casos graves) |

**Ejemplo numérico:**
```
Operación con EFO: $100,000 MXN + $16,000 IVA

Consecuencias:
- IVA no acreditable: $16,000 MXN
- ISR no deducible: $100,000 MXN (x 30% = $30,000 MXN)
- Multa (55%): $55,000 MXN
- Total a pagar: $101,000 MXN

ROI de validación: 631% (evitas pagar $101k por validar $160)
```

---

## 3. Validación de CFDI 4.0

### 3.1 Campos Críticos a Validar

```python
CFDI_VALIDATION_FIELDS = {
    'required': [
        'Version', 'Serie', 'Folio', 'Fecha', 'SelloCFD',
        'NoCertificado', 'Certificado', 'SubTotal', 'Total',
        'Emisor.Rfc', 'Emisor.Nombre', 'Emisor.RegimenFiscal',
        'Receptor.Rfc', 'Receptor.Nombre', 'Receptor.UsoCFDI',
        'Conceptos.ClaveProdServ', 'Conceptos.ClaveUnidad',
        'Conceptos.Descripcion', 'Conceptos.Cantidad',
        'Conceptos.ValorUnitario', 'Conceptos.Importe'
    ],
    'conditional': [
        'CartaPorte', 'Complemento', 'Addenda'
    ],
    'catalogos_sat': [
        'ClaveProdServ', 'ClaveUnidad', 'Moneda',
        'TipoDeComprobante', 'MetodoPago', 'FormaPago',
        'RegimenFiscal', 'UsoCFDI'
    ]
}
```

### 3.2 Validación de Estructura

```python
def validate_cfdi_structure(xml_content: str) -> dict:
    """
    Valida estructura de CFDI 4.0 contra esquemas del SAT.

    Retorna:
        dict con errores de validación
    """
    from lxml import etree

    try:
        # Parsear XML
        parser = etree.XMLParser(schema=CFDI_40_SCHEMA)
        doc = etree.fromstring(xml_content.encode(), parser)

        # Validar contra esquema SAT
        errors = []
        for field in CFDI_VALIDATION_FIELDS['required']:
            value = extract_field(doc, field)
            if not value:
                errors.append(f"Campo requerido faltante: {field}")

        # Validar catálogos SAT
        for campo_catalogo in CFDI_VALIDATION_FIELDS['catalogos_sat']:
            value = extract_field(doc, campo_catalogo)
            if value and value not in SAT_CATALOGOS[campo_catalogo]:
                errors.append(f"Valor inválido en catálogo {campo_catalogo}: {value}")

        return {
            'is_valid': len(errors) == 0,
            'errors': errors,
            'warnings': []
        }

    except etree.XMLSchemaError as e:
        return {
            'is_valid': False,
            'errors': [str(e)],
            'warnings': []
        }
```

---

## 4. Detección de CFDI Falsos o Alterados

### 4.1 Validación de Sello Digital

```python
def validate_cfdi_seal(xml_content: str, certificado_sat: str) -> dict:
    """
    Valida sello digital del CFDI contra certificado del SAT.

    Retorna:
        dict con resultado de validación
    """
    from cryptography.hazmat.primitives import hashes, serialization
    from cryptography.hazmat.backends import default_backend
    import base64

    try:
        # Extraer sello y certificado del XML
        sello = extract_field(xml_content, 'SelloCFD')
        no_certificado = extract_field(xml_content, 'NoCertificado')

        # Obtener cadena original (CFO)
        cfo = generate_cadena_original(xml_content)

        # Verificar sello con certificado SAT
        public_key = serialization.load_pem_public_key(
            certificado_sat.encode(),
            backend=default_backend()
        )

        is_valid = public_key.verify(
            base64.b64decode(sello),
            cfo.encode(),
            # Parámetros de verificación RSA-SHA256
        )

        return {
            'seal_valid': is_valid,
            'certificate_number': no_certificado,
            'errors': [] if is_valid else ['Sello digital inválido']
        }

    except Exception as e:
        return {
            'seal_valid': False,
            'certificate_number': None,
            'errors': [str(e)]
        }
```

### 4.2 Indicadores de CFDI Alterado

```python
RED_FLAGS_CFDI = [
    'RFC emisor en lista 69-B (EFO/EDO)',
    'Sello digital inválido o no verificable',
    'Certificado cancelado o vencido',
    'Monto total inconsistente con conceptos',
    'Fecha de emisión futura o muy antigua',
    'ClaveProdServ no corresponde a actividad del emisor',
    'Domicilio fiscal del emisor no existe',
    'Múltiples CFDI con mismo folio fiscal',
    'Receptor no relacionado con actividad comercial'
]

def calculate_risk_score(cfdi: dict) -> dict:
    """
    Calcula score de riesgo de CFDI basado en red flags.

    Retorna:
        dict con score de riesgo (0-100) y recomendación
    """
    risk_score = 0
    detected_flags = []

    for flag in RED_FLAGS_CFDI:
        if check_flag(cfdi, flag):
            risk_score += get_flag_weight(flag)
            detected_flags.append(flag)

    return {
        'risk_score': min(risk_score, 100),
        'risk_level': get_risk_level(risk_score),
        'detected_flags': detected_flags,
        'recommendation': get_recommendation(risk_score)
    }

def get_risk_level(score: int) -> str:
    if score >= 70:
        return 'CRITICAL'
    elif score >= 50:
        return 'HIGH'
    elif score >= 30:
        return 'MEDIUM'
    else:
        return 'LOW'
```

---

## 5. Integración con Descarga Masiva del SAT

### 5.1 Estrategia de Descarga

```python
class SATMassiveDownloader:
    """
    Descarga masiva de CFDI desde el portal del SAT.
    Usa scraping ético con delays y rotación de user agents.
    """

    SAT_URL = 'https://cfdidescargamasiva.sat.gob.mx/'

    def __init__(self, rfc: str, password: str):
        self.rfc = rfc
        self.password = password
        self.session = requests.Session()

    def login(self) -> bool:
        """
        Autenticación en portal del SAT.
        """
        # Implementación con Selenium/Playwright
        # para manejar JavaScript y CAPTCHA si es necesario
        pass

    def download_xmls(self, start_date: str, end_date: str) -> list:
        """
        Descarga XMLs de un periodo específico.
        """
        # Descargar desde buzón tributario
        # Retornar lista de XMLs descargados
        pass

    def process_downloaded_xmls(self, xml_list: list) -> list:
        """
        Procesa XMLs descargados y extrae información relevante.
        """
        processed = []
        for xml in xml_list:
            cfdi_data = parse_cfdi_xml(xml)
            validation = validate_cfdi_structure(xml)
            risk = calculate_risk_score(cfdi_data)

            processed.append({
                'uuid': cfdi_data['uuid'],
                'fecha': cfdi_data['fecha'],
                'emisor': cfdi_data['emisor'],
                'receptor': cfdi_data['receptor'],
                'total': cfdi_data['total'],
                'validation': validation,
                'risk': risk
            })

        return processed
```

---

## 6. Métricas Esperadas

| Métrica | Target | Recomendación |
|---------|--------|---------------|
| **Detección de EFOs** | 100% | Actualización semanal automática |
| **Validación de estructura** | 98%+ | Validación contra esquemas SAT |
| **Falsos positivos** | <2% | Revisión humana para riesgo MEDIUM |
| **Tiempo de validación** | <2s por CFDI | Validación asíncrona en batch |

---

## 7. Roadmap de Implementación

### Fase 10: Validación CFDI + 69-B (2 semanas)

| Semana | Entregable | Owner | Dependencias |
|--------|------------|-------|--------------|
| **1** | Validación de RFC emisor vs lista 69-B | Backend | ChromaDB actualizado |
| **2** | Validación de requisitos SAT (Anexo 29) | Backend | IDP completado |

**Criterio de éxito:** Detección 100% de EFOs, alertas en tiempo real

---

## 8. Seguridad y Cumplimiento

### 8.1 Requisitos SAT para Sistemas Contables

#### Anexo 29 RMF 2026

**Requisitos de almacenamiento:**
- ✅ Conservar CFDI por **5 años**
- ✅ Disponibilidad en **domicilio fiscal**
- ✅ Medios electrónicos (magnéticos, ópticos, digitales)
- ✅ Integridad de la información (no alterable)

**Requisitos técnicos:**
```
1. Backup automático diario
2. Encriptación en reposo (AES-256)
3. Encriptación en tránsito (TLS 1.3)
4. Control de accesos (RBAC)
5. Bitácora de auditoría (logs inalterables)
6. Autenticación de dos factores (2FA)
```

---

## 9. Recomendaciones Finales

| Área | Recomendación | Prioridad |
|------|---------------|-----------|
| **69-B** | Actualización semanal automática | CRÍTICA |
| **Validación estructura** | Contra esquemas SAT | ALTA |
| **Sello digital** | Validación con certificado SAT | ALTA |
| **Descarga masiva** | Scraping ético con delays | MEDIA |
| **Alertas** | En tiempo real para EFOs | CRÍTICA |

---

## 10. Fuentes Consultadas (Tavily Web Search)

**Fecha de consulta:** 10 de marzo de 2026

### Fuentes Oficiales (SAT, DOF)
| Fuente | URL | Tema |
|--------|-----|------|
| SAT - Lista 69-B | [Ver portal](https://www.gob.mx/sat/acciones-y-programas/notificacion-a-contribuyentes-con-operaciones-presuntamente-inexistentes-y-listados-definitivos-333336) | Notificación EFO/EDO |
| DOF - CFF 2026 | [Ver reforma](https://consolide.com/blog/cff-2026-reforma-fiscal/) | Reformas Código Fiscal |
| SAT - Anexo 5 RMF 2026 | [Ver PDF](https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/documentos2026/rmf/anexos/Anexo-5-RMF-2026_DOF-28122025.pdf) | Multas y sanciones |
| DOF - RMF 2026 | [Ver PDF](https://dof.gob.mx/2025/SHCP/SHCP_281225_01.pdf) | Resolución Miscelánea Fiscal |

### Fuentes Técnicas (Validación CFDI)
| Fuente | URL | Tema |
|--------|-----|------|
| STEL Order - CFDI 4.0 | [Ver guía](https://www.stelorder.com/mexico/blog/cfdi-4-0/) | Validador CFDI |
| Alegra - Uso CFDI 2026 | [Ver artículo](https://blog.alegra.com/mexico/uso-de-cfdi-en-2026/) | Deducibilidad fiscal |
| Gigstack - CFDI 4.0 México | [Ver guía](https://blog.gigstack.pro/post/cfdi-4-0-mexico-2026-guia-practica) | Validación CP 2026 |
| MySuite - RMF 2026 CFDI | [Ver artículo](https://blog.mysuitemex.com/2026/01/02/rmf-2026-impacto-en-cfdi-y-cumplimiento-fiscal/) | Impacto RMF |
| ContadorMX - Cambios CFDI 2026 | [Ver artículo](https://contadormx.com/cambios-al-cfdi-4-0-en-2026-actualizacion-del-sat/) | Actualización catálogos |

### Fuentes Legales (Materialidad, 69-B)
| Fuente | URL | Tema |
|--------|-----|------|
| Pérez Gongora - Materialidad | [Ver artículo](https://www.perezgongora.com/blog/la-materialidad-de-las-operaciones-mas-alla-del-cfdi-en-la-fiscalizacion-moderna) | Materialidad operaciones |
| Contadores México - Materialidad 2026 | [Ver curso](https://www.contadoresmexico.org.mx/Vida-colegiada/Materialidad-legalidad-y-cumplimiento-fiscal-en-2026) | Materialidad legalidad |
| ContadorMX - Materialidad SAT | [Ver solución](https://contadormx.com/solucion-materialidad-de-las-operaciones-sat/) | Evidencia operaciones |
| DIGID - Materialidad NOM-151 | [Ver artículo](https://www.digid.com.mx/blog/materialidad-en-las-operaciones-sat-2026) | Certificación digital |
| Prodecon - Auditoría proveedores | [Ver PDF](https://www.prodecon.gob.mx/wp-content/uploads/2026/02/TA_febrero-2026.pdf) | Lista 69-B auditoría |
| BMT-DFK - Lista 69-B pasos | [Ver guía](https://bmtc-dfk.com/tu-proveedor-aparecio-publicado-en-la-lista-del-69-b-pasos-importantes-para-proteger-tus-deducciones-y-tu-certificado-de-sello-digital/) | Defensa fiscal |

### Fuentes de Sanciones (Multas SAT)
| Fuente | URL | Tema |
|--------|-----|------|
| Siigo - Guía sanciones SAT | [Ver guía](https://www.siigo.com/mx/blog/obligaciones-fiscales/guia-sanciones-sat/) | Multas EFOS |
| El Informador - Lista negra SAT | [Ver artículo](https://www.informador.mx/amp/mexico/sat-agrega-mas-factureras-a-su-lista-negra-20260226-0024.html) | Actualización lista |
| Ámbito - Consulta lista negra | [Ver artículo](https://www.ambito.com/mexico/informacion-general/lista-negra-del-sat-asi-puedes-consultar-si-apareces-y-evitar-multas-o-problemas-fiscales-n6253325) | Consulta RFC |
| Impuestum - Facturas falsas | [Ver artículo](https://impuestum.com/noticias/facturas-falsas-lo-que-el-sat-revisara-en-2026/) | Revisión SAT 2026 |
| El Financiero - Cambios SAT 2026 | [Ver artículo](https://www.elfinanciero.com.mx/mis-finanzas/2026/01/04/aguas-con-el-sat-en-2026-que-sabemos-de-los-cambios-que-aplicara-para-combatir-las-facturas-falsas/) | Combate facturas falsas |
| PR Newswire - SAT endurece control | [Ver nota](https://www.prnewswire.com/mx/comunicados-de-prensa/el-sat-endurece-el-control-para-2026-visitas-domiciliarias-y-fin-a-las-cancelaciones-de-facturas-expres-302708555.html) | Fiscalización 2026 |
| Basham - Modificaciones RMF | [Ver artículo](https://basham.com.mx/principales-modificaciones-a-la-rmf-para-2026/) | Tasas recargos |

**Total de fuentes consultadas:** 20 fuentes verificadas

---

## 11. Control de Cambios

| Versión | Fecha | Autor | Tipo | Cambios Realizados | Sección Afectada |
|---------|-------|-------|------|-------------------|------------------|
| 1.0 | 10-mar-2026 | Diego Gzz | Creación | Versión inicial del documento | Todo el documento |
| 1.1 | 10-mar-2026 | Technical Writer | **Investigación con Tavily** | Agregadas 20 fuentes oficiales (SAT, DOF, expertos fiscales), regulación 2026 actualizada, sanciones y multas detalladas | Secciones 1, 2, 10 |

**Detalle de cambios v1.1:**
- **Sección 1:** Agregados cambios críticos 2026 con fuentes DOF
- **Sección 2:** Actualizada estrategia de actualización lista 69-B con URLs SAT verificadas
- **Sección 10:** Agregadas 20 fuentes consultadas vía Tavily web search (SAT, DOF, expertos)
- **Sección 11:** Agregado control de cambios v1.0 → v1.1

**Queries ejecutados en Tavily (4 queries):**
1. `lista 69-B SAT enero 2026 EFO operaciones simuladas`
2. `validación CFDI 4.0 estructura sat México 2026`
3. `materialidad operaciones artículo 69-B CFF 2026`
4. `multas SAT operaciones inexistentes 2026 México`

**Datos clave identificados:**
- **Multas por EFO:** 55-75% del monto de operación + IVA no acreditable + ISR no deducible
- **Actualización lista 69-B:** Semanal (viernes) vía portal SAT
- **Materialidad:** Requiere evidencia más allá de CFDI (contratos, bitácoras, NOM-151)
- **CFDI 4.0 2026:** Validación cruzada de CP, catálogos actualizados, reglas de deducibilidad

---

**Documento elaborado para:** Equipo de desarrollo IDP-App
**Propósito:** Guiar implementación técnica del módulo de validación CFDI y lista 69-B
**Próxima actualización:** Después de implementación de Fase 10

---

*Fin de la Investigación de Validación CFDI y Lista 69-B*
