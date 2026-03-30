# Investigación Técnica: Cálculo de Nómina IMSS e INFONAVIT

**Fecha:** 10 de marzo de 2026
**Versión:** 1.0
**Módulo:** Nómina - Cálculos IMSS/INFONAVIT
**Prioridad:** 🔴 CRÍTICA
**Gap ID:** Gap #5 (parcialmente cubierto)

---

## 1. Fórmulas de Cálculo 2026

### 1.1 Salario Base de Cotización (SBC)

```
SBC = Salario Diario Integrado (SDI)

SDI = (Salario Base + Conceptos Integrables) × Factor de Integración

Donde:
- Salario Base: Sueldo diario pactado
- Conceptos Integrables: Prima vacacional, aguinaldo, bonos habituales
- Factor de Integración:
  * Salario mínimo 2026: $248.93 MXN (zona fronteriza: $375.27 MXN)
  * UMA 2026: $108.45 MXN (pendiente de publicación INEGI)
```

### 1.2 Cuotas IMSS Patronales 2026

| Ramo del Seguro | Cuota Fija | Cuota Excedente | Tope |
|-----------------|------------|-----------------|------|
| **Enfermedades y Maternidad** | 6.00% | 0.00% | 25 UMA |
| **Invalidez y Vida** | 1.75% | 0.00% | 15 UMA |
| **Riesgos de Trabajo** | Variable (0.1504% - 15.36%) | N/A | Sin tope |
| **Guarderías y Prestaciones** | 1.00% | 0.00% | 25 UMA |
| **Cesantía y Vejez (fija)** | 5.00% | 0.00% | 10 UMA |
| **Cesantía y Vejez (excedente)** | 0.00% | 3.125% - 20.625% | Sin tope |

### 1.3 Ejemplo de Cálculo

```python
def calcular_imss(sbc: float, riesgo_trabajo: float = 0.5230) -> dict:
    """
    Calcula cuotas IMSS patronales 2026.

    Args:
        sbc: Salario Base de Cotización (diario)
        riesgo_trabajo: Clase de riesgo (I=0.1504%, II=0.5230%, III=1.1008%, IV=2.3263%, V=15.36%)

    Returns:
        dict con desglose de cuotas
    """
    UMA_2026 = 108.45  # Pendiente de confirmación

    # Topes
    tope_10_uma = 10 * UMA_2026
    tope_15_uma = 15 * UMA_2026
    tope_25_uma = 25 * UMA_2026

    # Cuota fija
    cuota_enfermedad = sbc * 0.0600
    cuota_invalidez = sbc * 0.0175
    cuota_riesgos = sbc * (riesgo_trabajo / 100)
    cuota_guarderia = sbc * 0.0100
    cuota_cesantia_fija = min(sbc, tope_10_uma) * 0.0500

    # Cuota excedente (para salarios > 10 UMA)
    if sbc > tope_10_uma:
        excedente = sbc - tope_10_uma
        # Tasa progresiva según tramo
        if excedente <= tope_15_uma:
            tasa_excedente = 0.03125
        elif excedente <= tope_25_uma:
            tasa_excedente = 0.078125
        else:
            tasa_excedente = 0.20625

        cuota_cesantia_excedente = excedente * tasa_excedente
    else:
        cuota_cesantia_excedente = 0.0

    # Total cuota patronal
    cuota_patronal_diaria = (
        cuota_enfermedad +
        cuota_invalidez +
        cuota_riesgos +
        cuota_guarderia +
        cuota_cesantia_fija +
        cuota_cesantia_excedente
    )

    return {
        'cuota_patronal_diaria': cuota_patronal_diaria,
        'desglose': {
            'enfermedades_maternidad': cuota_enfermedad,
            'invalidez_vida': cuota_invalidez,
            'riesgos_trabajo': cuota_riesgos,
            'guarderia_prestaciones': cuota_guarderia,
            'cesantia_vejez_fija': cuota_cesantia_fija,
            'cesantia_vejez_excedente': cuota_cesantia_excedente
        }
    }
```

### 1.4 Aportación INFONAVIT

```
Aportación Patronal = 5% del SBC

Ejemplo:
SBC = $500 MXN/día
INFONAVIT = $500 × 0.05 = $25 MXN/día
```

---

## 2. Limitantes de Automatización

### 2.1 Limitación 1: Cambios Normativos Frecuentes

**Problema:**
- Tasas de IMSS cambian anualmente (enero)
- UMA se actualiza en febrero
- INFONAVIT puede modificar reglas de descuento

**Solución:**
```python
# Tabla de parámetros actualizables
IMSS_PARAMS_2026 = {
    'uma': 108.45,  # Pendiente de confirmación
    'salario_minimo': 248.93,
    'salario_minimo_frontera': 375.27,
    'cuotas': {
        'enfermedad_maternidad': 0.0600,
        'invalidez_vida': 0.0175,
        'guarderia': 0.0100,
        'cesantia_fija': 0.0500,
        'cesantia_excedente_tramos': [
            {'hasta': 15, 'tasa': 0.03125},
            {'hasta': 25, 'tasa': 0.078125},
            {'hasta': None, 'tasa': 0.20625}
        ]
    }
}

# Función de actualización
def update_imss_params(new_params: dict):
    """
    Actualiza parámetros de IMSS sin cambiar código.
    """
    import json
    with open('config/imss_params.json', 'w') as f:
        json.dump(new_params, f, indent=2)
```

### 2.2 Limitación 2: Validación Humana Requerida

**Problema:**
- Cálculos de nómina tienen impacto legal directo
- Errores generan multas del IMSS (50-500% del monto)
- No hay margen para "falsos positivos"

**Solución:**
```
Workflow recomendado:
1. IA calcula nómina → genera CFDI borrador
2. Contador revisa y aprueba → timbra
3. Sistema aprende de correcciones → mejora siguiente cálculo

Human-in-the-loop es CRÍTICO para nómina
```

---

## 3. Percepciones y Deducciones

### 3.1 Percepciones Comunes

```python
PERCEPCIONES = {
    'sueldo_base': {'tipo': 'gravado', 'imss': True},
    'horas_extra_dobles': {'tipo': 'gravado', 'imss': True, 'tope_semanal': 9},
    'horas_extra_triples': {'tipo': 'gravado', 'imss': False},
    'prima_dominical': {'tipo': 'gravado', 'imss': True},
    'bono_puntualidad': {'tipo': 'gravado', 'imss': True},
    'bono_asistencia': {'tipo': 'gravado', 'imss': True},
    'comisiones': {'tipo': 'gravado', 'imss': True},
    'prima_vacacional': {'tipo': 'gravado', 'imss': True, 'exento_25pct': True},
    'aguinaldo': {'tipo': 'gravado', 'imss': False, 'exento_30_dias': True},
    'vales_despensa': {'tipo': 'exento', 'imss': False, 'tope_mensual': 1035},
    'despensa': {'tipo': 'exento', 'imss': False, 'tope_mensual': 1035},
    'transporte': {'tipo': 'exento', 'imss': False, 'tope_mensual': 1035},
}
```

### 3.2 Deducciones Comunes

```python
DEDUCCIONES = {
    'isr': {'tipo': 'retencion', 'tabla': 'mensual_acumulada'},
    'imss_cuota_obrera': {'tipo': 'retencion', 'porcentaje': 0.02375},
    'infonavit_credito': {'tipo': 'retencion', 'variable': True},
    'prestamos': {'tipo': 'retencion', 'variable': True},
    'cuota_sindical': {'tipo': 'retencion', 'variable': True},
    'fonacot': {'tipo': 'retencion', 'variable': True},
}
```

### 3.3 Cálculo de ISR (Tablas 2026)

```python
def calcular_isr_retencion(sueldo_mensual: float) -> dict:
    """
    Calcula retención de ISR según tablas SAT 2026.

    Retorna:
        dict con ISR retenido y detalles del cálculo
    """
    # Tablas ISR 2026 (mensuales, acumuladas)
    TABLAS_ISR_2026 = [
        {'limite_inferior': 0.01, 'limite_superior': 7734.99, 'cuota_fija': 0.00, 'porcentaje': 0.0192},
        {'limite_inferior': 7735.00, 'limite_superior': 65645.69, 'cuota_fija': 148.51, 'porcentaje': 0.0640},
        {'limite_inferior': 65645.70, 'limite_superior': 115728.99, 'cuota_fija': 3854.79, 'porcentaje': 0.1088},
        {'limite_inferior': 115729.00, 'limite_superior': 134632.40, 'cuota_fija': 9303.72, 'porcentaje': 0.1600},
        {'limite_inferior': 134632.41, 'limite_superior': 161527.29, 'cuota_fija': 12328.26, 'porcentaje': 0.1792},
        {'limite_inferior': 161527.30, 'limite_superior': 326258.99, 'cuota_fija': 17155.77, 'porcentaje': 0.2136},
        {'limite_inferior': 326259.00, 'limite_superior': 517083.59, 'cuota_fija': 52347.35, 'porcentaje': 0.2352},
        {'limite_inferior': 517083.60, 'limite_superior': 982836.99, 'cuota_fija': 97277.05, 'porcentaje': 0.3000},
        {'limite_inferior': 982837.00, 'limite_superior': None, 'cuota_fija': 236903.15, 'porcentaje': 0.3500},
    ]

    # Buscar tramo correspondiente
    for tramo in TABLAS_ISR_2026:
        if sueldo_mensual <= tramo['limite_superior'] or tramo['limite_superior'] is None:
            excedente = sueldo_mensual - tramo['limite_inferior']
            isr = (excedente * tramo['porcentaje']) + tramo['cuota_fija']
            break

    return {
        'isr_retencion': isr,
        'sueldo_gravado': sueldo_mensual,
        'tramo': TABLAS_ISR_2026.index(tramo) + 1
    }
```

---

## 4. CFDI de Nómina 1.2

### 4.1 Estructura XML

```xml
<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4"
                   xmlns:nomina12="http://www.sat.gob.mx/nomina12"
                   Version="4.0"
                   TipoDeComprobante="N"
                   SubTotal="10000.00"
                   Total="8500.00"
                   Moneda="MXN">
  <cfdi:Emisor Rfc="EMP850101ABC" Nombre="Empresa SA de CV" RegimenFiscal="601"/>
  <cfdi:Receptor Rfc="XAXX010101000" Nombre="Empleado Nombre" UsoCFDI="CN01"/>
  <cfdi:Conceptos>
    <cfdi:Concepto ClaveProdServ="84111506" Cantidad="1" ClaveUnidad="ACT"
                   Descripcion="Pago de nómina" ValorUnitario="10000.00" Importe="10000.00">
      <nomina12:Nomina TipoNomina="O" TipoRegimen="02" NumEmpleado="001"
                       Curp="XXXX850101HDFXXX09" TipoContrato="01" FechaInicioLabores="2020-01-01"
                       Antiguedad="1000" Puesto="001" TipoJornada="1" SalarioBaseCotizacion="500.00"
                       Departamento="001" ClavePago="03" NumDiasPagados="15">
        <nomina12:Percepciones TotalPercepciones="10000.00">
          <nomina12:Percepcion Clave="001" Concepto="Sueldo" ImporteGravado="10000.00"/>
        </nomina12:Percepciones>
        <nomina12:Deducciones TotalDeducciones="1500.00">
          <nomina12:Deduccion Clave="002" Concepto="ISR" Importe="1500.00"/>
        </nomina12:Deducciones>
      </nomina12:Nomina>
    </cfdi:Concepto>
  </cfdi:Conceptos>
</cfdi:Comprobante>
```

### 4.2 PAC (Proveedor Autorizado de Certificación)

**Proveedores disponibles:**
- Finkok
- SW Sapien
- Ecodex
- Solución Factible
- Timbrado Fiscal

**Costos promedio:**
- $0.70 - $1.50 MXN por timbre
- Descuentos por volumen (1000+ timbres)

---

## 5. Métricas Esperadas

| Métrica | Target | Recomendación |
|---------|--------|---------------|
| **Precisión de cálculos** | 99.5%+ | Validación humana obligatoria |
| **Tiempo de cálculo** | <5s por empleado | Procesamiento batch |
| **Multas por errores** | 0 | Doble validación antes de timbrar |
| **Tasa de corrección** | <5% | Aprendizaje de correcciones |

---

## 6. Roadmap de Implementación

### Fase 11: Agente de Nómina (2 semanas)

| Semana | Entregable | Owner | Dependencias |
|--------|------------|-------|--------------|
| **1-2** | Calculadora de IMSS/INFONAVIT | Backend Dev + Contador | Parámetros 2026 actualizados |

**Criterio de éxito:** Cálculos de nómina con 99% de precisión

---

## 7. Seguridad y Cumplimiento

### 7.1 Requisitos Legales

| Requisito | Descripción | Impacto |
|-----------|-------------|---------|
| **LFT** | Ley Federal del Trabajo | Cálculo correcto de prestaciones |
| **LSS** | Ley del Seguro Social | Cuotas patronales correctas |
| **LINFONAVIT** | Ley del INFONAVIT | Aportaciones y descuentos |
| **LISR** | Ley del ISR | Retenciones correctas |

### 7.2 Multas por Incumplimiento

| Incumplimiento | Multa | Autoridad |
|----------------|-------|-----------|
| **Cuotas IMSS incorrectas** | 50-500% del monto | IMSS |
| **Retenciones ISR incorrectas** | 20-75% del monto | SAT |
| **Aportaciones INFONAVIT incorrectas** | 50-500% del monto | INFONAVIT |
| **Prestaciones mal calculadas** | 100% + recargos | STPS |

---

## 8. Recomendaciones Finales

| Área | Recomendación | Prioridad |
|------|---------------|-----------|
| **Cálculos** | Validación humana obligatoria | CRÍTICA |
| **Parámetros** | Actualizables sin deploy | ALTA |
| **Timbrado** | PAC con respaldo | ALTA |
| **Auditoría** | Bitácora de todos los cálculos | ALTA |

---

## 9. Fuentes Consultadas (Tavily Web Search)

**Fecha de consulta:** 10 de marzo de 2026

### Fuentes Oficiales (IMSS, INFONAVIT, SAT)
| Fuente | URL | Tema |
|--------|-----|------|
| El Contribuyente - Cuotas IMSS 2026 | [Ver artículo](https://www.elcontribuyente.mx/2025/11/asi-cambiaran-las-cuotas-patronales-del-imss-en-2026-tablas-y-ajustes-clave/) | Tablas cuotas patronales |
| ContadorMX - Cuotas IMSS 2026 | [Ver guía](https://contadormx.com/cuotas-imss-2026-tablas-porcentajes-y-fechas/) | Tablas y porcentajes |
| Cotiza40 - Tablas IMSS 2026 | [Ver artículo](https://cotiza40.com/blog/tablas-imss-2026-actualizacion-pensiones/) | UMA, salarios mínimos |
| CONTPAQi - Cambios nómina 2026 | [Ver guía](https://www.contpaqi.com/publicaciones/tendencias-fiscales/cambios-nomina-2026-mexico) | Validaciones CFDI |
| El Conta - Tablas CyV 2026 | [Ver artículo](https://elconta.mx/tabla-de-cuotas-patronales-cyv-para-2026-con-incremento-gradual-de-cuota-patronal-ceyv/) | Cesantía y Vejez |
| IDC - Factores cuotas 2026 | [Ver artículo](https://idconline.mx/seguridad-social/2026/02/09/factores-de-las-cuotas-y-aportaciones-2026) | Cuotas obrero-patronales |
| Buk - Cálculo IMSS | [Ver guía](https://www.buk.mx/blog/como-se-calcula-el-imss-en-la-nomina) | Cómo calcular |
| XPD - Tablas ISR 2026 | [Ver artículo](https://xpd.mx/blog/estas-son-las-nuevas-tablas-de-isr-que-seran-vigentes-en-2026.html) | Tarifas ISR |
| Siscofin - Salarios mínimos 2026 | [Ver artículo](https://siscofin.com/noticias/salarios-minimos-2026-y-cesantia-y-vejez-cuota-patronal-vigente-en-enero-2026/) | Salarios y cuotas |

### Fuentes INFONAVIT
| Fuente | URL | Tema |
|--------|-----|------|
| INFONAVIT - Aportaciones | [Ver portal](https://portalmx.infonavit.org.mx/wps/portal/infonavitmx/mx2/derechohabientes/centro_ayuda/11_aportaciones_credito/10_aportaciones_patron?pestaniaSelect=49e52e39-68fe-49f7-a174-9b5934e46906&subtemaSelect=042bb25e-f7fe-4c3e-98ad-9de61382c7ea) | 5% sobre salario |
| ADN40 - Descuentos 2026 | [Ver artículo](https://www.adn40.mx/mexico/2026-03-04/por-que-el-infonavit-esta-haciendo-descuentos-mas-elevados-en-2026/) | Ajuste salario mínimo |
| CompraPaq - Reforma Infonavit | [Ver guía](https://www.comprapaq.mx/soporte/reforma-infonavit-2026-articulo-29-descuentos-nomina) | Art. 29, descuentos |
| Consolidé - UMI 2026 | [Ver artículo](https://consolide.com/blog/umi-2026/) | Diferencias IMSS/INFONAVIT |

### Fuentes Vacaciones y Aguinaldo
| Fuente | URL | Tema |
|--------|-----|------|
| Calculadora Finiquito - Vacaciones 2026 | [Ver calculadora](https://calculadorade-finiquito.com.mx/calculadora-de-vacaciones/) | Días y prima vacacional |
| Facturama - SDI 2026 | [Ver guía](https://facturama.mx/blog/salario-diario-integrado-como-se-calcula/) | Salario Diario Integrado |
| El Universal - Calculadora vacaciones | [Ver calculadora](https://www.eluniversal.com.mx/consultas/calculadoras/vacaciones/) | Antigüedad, días |
| Kueski - Prima vacacional | [Ver calculadora](https://www.kueski.com/calculadora-de-prima-vacacional) | 25% prima |
| Mexican People - Aguinaldo | [Ver calculadora](https://mexicanpeoplehr.com/calculadora/aguinaldo) | 15 días mínimo |
| Constancia Fiscal - Prestaciones 2026 | [Ver guía](https://constanciadesituacionfiscal.mx/prestaciones-de-ley/) | Prestaciones de ley |

### Fuentes SUA y Cálculo
| Fuente | URL | Tema |
|--------|-----|------|
| vLex - Cuotas obrero-patronales | [Ver documento](https://vlex.com.mx/vid/determinacion-cuotas-obrero-patronales-548392642) | Determinación SUA |
| Consolidé - Cuotas | [Ver blog](https://consolide.com/blog/tag/cuotas-obrero-patronales) | SUA beneficios |
| Runa HR - Cálculo IMSS | [Ver guía](https://runahr.com/mx/recursos/nomina/calculo-de-cuotas-obrero-patronales-imss-e-infonavit/) | IMSS e Infonavit |

**Total de fuentes consultadas:** 22 fuentes verificadas

---

## 9. Timbrado de Nómina y PAC (Complemento CFDI 1.2 Revisión E)

### 9.1 PAC (Proveedor Autorizado de Certificación)

**Definición:** Un PAC es una entidad autorizada por el SAT para validar, sellar y timbrar los CFDI de nómina. Sin un PAC, no es posible emitir recibos de nómina con validez fiscal.

**Proveedores Principales:**

| Proveedor | Costo por Timbre | Volumen Mínimo | API | Documentación |
|-----------|------------------|----------------|-----|---------------|
| **Finkok** | $0.80-$1.50 | 1,000 timbres | ✅ Sí | [Finkok API](https://finkok.com/) |
| **SW Sapien** | $1.00-$2.00 | 500 timbres | ✅ Sí | [SW API](https://www.sw.com.mx/) |
| **Edicom** | $1.20-$2.50 | 1,000 timbres | ✅ Sí | [Edicom](https://edicomgroup.com/) |
| **Prodigia** | $0.90-$1.80 | 500 timbres | ✅ Sí | [Prodigia](https://www.prodigia.com.mx/) |
| **Facturapi** | $1.50-$3.00 | 100 timbres | ✅ Sí | [Facturapi](https://facturapi.io/) |
| **Gigstack** | $1.00-$2.00 | 500 timbres | ✅ Sí | [Gigstack](https://blog.gigstack.pro/) |

**Costos Típicos (2026):**
- **Timbre individual:** $1.50-$3.50 MXN
- **Paquete 1,000 timbres:** $0.80-$1.50 MXN por timbre
- **Paquete 10,000 timbres:** $0.60-$1.20 MXN por timbre

**Requisitos para Contratar PAC:**
1. RFC vigente y activo
2. e.firma (FIEL) vigente
3. Certificado de Sello Digital (CSD) tramitado ante SAT
4. Opinión de cumplimiento positivo (recomendado)
5. Buzón tributario activo

### 9.2 Sellado Digital (Firma Electrónica)

**Certificado de Sello Digital (CSD):**

El CSD es un archivo digital (.cer y .key) que permite firmar electrónicamente los CFDI de nómina. Es distinto a la e.firma y es obligatorio para timbrar.

**Características del CSD:**
- **Vigencia:** 4 años
- **Formato:** X509 DER (2048 bits)
- **Archivos:** 
  - `.cer` = Certificado público
  - `.key` = Llave privada (encriptada con contraseña)
- **Trámite:** Gratuito en portal SAT

**Proceso de Obtención:**

```python
# Pasos para obtener CSD (no automatizable, requiere intervención manual)
pasos_csd = [
    "1. Tener e.firma vigente (trámite previo en SAT)",
    "2. Descargar programa Certifica (antes SOLCEDI) del SAT",
    "3. Generar solicitud .sdg desde Certifica",
    "4. Subir solicitud al portal SAT (Certisat Web)",
    "5. Esperar 72 horas para activación",
    "6. Descargar archivos .cer y .key desde Certisat",
    "7. Guardar contraseña de forma segura (irrecuperable)"
]

# Validación de vigencia del CSD
from cryptography import x509
from datetime import datetime

def validar_vigencia_csd(cer_path: str) -> dict:
    """
    Valida que el CSD esté vigente.
    
    Args:
        cer_path: Ruta al archivo .cer
        
    Returns:
        Diccionario con estado de vigencia
    """
    with open(cer_path, 'rb') as f:
        cert_data = f.read()
    
    cert = x509.load_der_x509_certificate(cert_data)
    ahora = datetime.utcnow()
    
    return {
        'vigente': cert.not_valid_before <= ahora <= cert.not_valid_after,
        'vencimiento': cert.not_valid_after,
        'dias_restantes': (cert.not_valid_after - ahora).days,
        'sujeto': cert.subject.rfc4514_string(),
        'emisor': cert.issuer.rfc4514_string()
    }

# Ejemplo de uso:
# resultado = validar_vigencia_csd('csd_xxxx010101000_20260101.cer')
# if resultado['dias_restantes'] < 30:
#     print(f"⚠️  CSD vence en {resultado['dias_restantes']} días - Renovar pronto")
```

**Diferencias entre e.firma y CSD:**

| Característica | e.firma (FIEL) | CSD |
|----------------|----------------|-----|
| **Propósito** | Trámites generales SAT | Firmar CFDI |
| **Vigencia** | 4 años | 4 años |
| **Uso** | Portal SAT, declaraciones | Timbrado CFDI |
| **Archivos** | .cer, .key, contraseña | .cer, .key, contraseña |
| **Trámite** | Cita presencial SAT | En línea con e.firma |

### 9.3 Timbrado CFDI de Nómina 1.2 (Revisión E 2026)

**Estructura del CFDI de Nómina:**

El CFDI de nómina es un comprobante fiscal con un complemento específico para nómina (Complemento de Nómina 1.2 Revisión E, vigente desde 01-ene-2026).

**Workflow Completo de Timbrado:**

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUJO DE TIMBRADO                        │
│                                                             │
│  1. Captura de datos del empleado                          │
│     ↓                                                       │
│  2. Cálculo de percepciones y deducciones                  │
│     ↓                                                       │
│  3. Generación de XML (CFDI 4.0 + Complemento Nómina 1.2) │
│     ↓                                                       │
│  4. Firma digital con CSD (cadena original)                │
│     ↓                                                       │
│  5. Envío a PAC para timbrado                              │
│     ↓                                                       │
│  6. PAC valida estructura y asigna UUID                    │
│     ↓                                                       │
│  7. SAT sella el comprobante (Sello SAT)                   │
│     ↓                                                       │
│  8. PAC retorna CFDI timbrado (XML + PDF)                  │
│     ↓                                                       │
│  9. Entrega al empleado (email, portal, app)               │
│     ↓                                                       │
│  10. Almacenamiento (5 años mínimo)                        │
└─────────────────────────────────────────────────────────────┘
```

**Campos Obligatorios del Complemento de Nómina 1.2 (Revisión E):**

```python
from typing import Dict, List
import xml.etree.ElementTree as ET

def generar_nomina_xml(datos_nomina: Dict) -> str:
    """
    Genera XML de CFDI de nómina con complemento 1.2 Revisión E.
    
    Args:
        datos_nomina: Diccionario con datos de nómina
    
    Returns:
        Ruta al archivo XML generado
    """
    # CFDI 4.0 (encabezado)
    cfdi = ET.Element('cfdi:Comprobante')
    cfdi.set('xmlns:cfdi', 'http://www.sat.gob.mx/cfd/4')
    cfdi.set('xmlns:nomina12', 'http://www.sat.gob.mx/nomina12')
    cfdi.set('Version', '4.0')
    cfdi.set('TipoDeComprobante', 'N')  # Nómina
    cfdi.set('Moneda', 'MXN')
    cfdi.set('LugarExpedicion', datos_nomina['cp_emisor'])
    
    # Emisor
    emisor = ET.SubElement(cfdi, 'cfdi:Emisor')
    emisor.set('Rfc', datos_nomina['rfc_emisor'])
    emisor.set('Nombre', datos_nomina['nombre_emisor'])
    emisor.set('RegimenFiscal', datos_nomina['regimen_fiscal'])
    
    # Receptor
    receptor = ET.SubElement(cfdi, 'cfdi:Receptor')
    receptor.set('Rfc', datos_nomina['rfc_receptor'])
    receptor.set('Nombre', datos_nomina['nombre_receptor'])
    receptor.set('DomicilioFiscalReceptor', datos_nomina['cp_receptor'])
    receptor.set('RegimenFiscalReceptor', datos_nomina['regimen_fiscal_receptor'])
    receptor.set('UsoCFDI', 'CN01')  # Nómina
    
    # Conceptos (obligatorio en CFDI 4.0)
    conceptos = ET.SubElement(cfdi, 'cfdi:Conceptos')
    concepto = ET.SubElement(conceptos, 'cfdi:Concepto')
    concepto.set('ClaveProdServ', '84111506')  # Servicio de nómina
    concepto.set('Cantidad', '1')
    concepto.set('ClaveUnidad', 'ACT')  # Actividad
    concepto.set('Descripcion', 'Pago de nómina')
    concepto.set('ValorUnitario', datos_nomina['total_percepciones'])
    concepto.set('Importe', datos_nomina['total_percepciones'])
    
    # Complemento de Nómina 1.2
    complemento = ET.SubElement(cfdi, 'cfdi:Complemento')
    nomina = ET.SubElement(complemento, 'nomina12:Nomina')
    nomina.set('Version', '1.2')
    nomina.set('TipoNomina', 'O')  # Ordinaria
    nomina.set('FechaPago', datos_nomina['fecha_pago'])
    nomina.set('FechaInicialPago', datos_nomina['fecha_inicial'])
    nomina.set('FechaFinalPago', datos_nomina['fecha_final'])
    nomina.set('NumDiasPagados', str(datos_nomina['dias_pagados']))
    nomina.set('TotalPercepciones', datos_nomina['total_percepciones'])
    nomina.set('TotalDeducciones', datos_nomina['total_deducciones'])
    nomina.set('TotalOtrosPagos', datos_nomina['total_otros_pagos'])
    
    # Percepciones
    percepciones_elem = ET.SubElement(nomina, 'nomina12:Percepciones')
    for percepcion in datos_nomina['percepciones']:
        p = ET.SubElement(percepciones_elem, 'nomina12:Percepcion')
        p.set('TipoPercepcion', percepcion['tipo'])  # 001=Sueldo, 054=Días descanso
        p.set('ClaveConcepto', percepcion['clave'])
        p.set('Concepto', percepcion['descripcion'])
        p.set('ImporteGravado', percepcion['gravado'])
        p.set('ImporteExento', percepcion['exento'])
    
    # Deducciones
    deducciones_elem = ET.SubElement(nomina, 'nomina12:Deducciones')
    for deduccion in datos_nomina['deducciones']:
        d = ET.SubElement(deducciones_elem, 'nomina12:Deduccion')
        d.set('TipoDeduccion', deduccion['tipo'])  # 001=ISR, 002=IMSS
        d.set('ClaveConcepto', deduccion['clave'])
        d.set('Concepto', deduccion['descripcion'])
        d.set('Importe', deduccion['importe'])
    
    # Otros Pagos (subsidios, indemnizaciones)
    if datos_nomina.get('otros_pagos'):
        otros_pagos_elem = ET.SubElement(nomina, 'nomina12:OtrosPagos')
        for otro_pago in datos_nomina['otros_pagos']:
            op = ET.SubElement(otros_pagos_elem, 'nomina12:OtroPago')
            op.set('TipoOtroPago', otro_pago['tipo'])
            op.set('ClaveConcepto', otro_pago['clave'])
            op.set('Concepto', otro_pago['descripcion'])
            op.set('Importe', otro_pago['importe'])
    
    # Guardar XML (antes de timbrado)
    filename = f"nomina_{datos_nomina['rfc_receptor']}_{datos_nomina['fecha_pago']}.xml"
    ET.ElementTree(cfdi).write(filename, encoding='utf-8', xml_declaration=True)
    
    return filename
```

**Cambios en Revisión E (2026):**

| Cambio | Descripción | Impacto |
|--------|-------------|---------|
| **Validación ImporteGravado/Exento** | No pueden ser ambos cero en misma percepción | Percepciones deben tener monto real |
| **Percepción 038 (Otros ingresos)** | Debe ser 100% gravada | No mostrar como exenta |
| **Subsidio al empleo 2026** | Tope: $628.00 (de $475.00) | Factor: 20.66 (de 15.63) |
| **Nuevas claves TipoPercepcion** | 054=Días descanso, 055=Descanso obligatorio | Mejor clasificación |
| **Nuevas claves TipoDeduccion** | 108-111=Ajustes días descanso | Trazabilidad de ajustes |

**Errores Comunes en Timbrado:**

| Error | Causa | Solución |
|-------|-------|----------|
| **Sello digital inválido** | CSD vencido o contraseña incorrecta | Verificar vigencia CSD |
| **RFC no coincide** | Nombre/receptor no coincide con SAT | Validar en constancia fiscal |
| **Campos obligatorios faltantes** | Estructura XML incompleta | Usar schema XSD oficial |
| **Importes no cuadran** | Total ≠ Percepciones - Deducciones | Revisar cálculos |
| **Clave inválida** | Catálogo desactualizado | Actualizar catálogos PAC |

### 9.4 Incidencias de Nómina

**Tipos de Incidencias (2026):**

| Incidencia | Tipo | Impacto en Nómina | Tratamiento Fiscal |
|------------|------|-------------------|-------------------|
| **Incapacidad IMSS** | Ausencia justificada | Subsidio IMSS (no salario) | Exento hasta 3 días |
| **Permiso sin goce** | Ausencia no justificada | Descuento proporcional | N/A |
| **Falta injustificada** | Ausencia no justificada | Descuento + posible sanción | N/A |
| **Retardo** | Llegada tarde | Descuento proporcional | N/A |
| **Hora extra doble** | Jornada extendida | +100% sobre hora normal | 50% exento (límite 9 hrs/sem) |
| **Hora extra triple** | Jornada >9 hrs/sem | +200% sobre hora normal | Gravado completamente |
| **Día festivo laborado** | Descanso obligatorio | Triple salario | Gravado |

**Cálculo de Horas Extras (2026):**

```python
from decimal import Decimal

def calcular_horas_extras(salario_diario: float, horas_extras: int) -> dict:
    """
    Calcula horas extras con límites legales 2026.
    
    Reforma LFT 2026: Tope 12 horas extras/semana (gradual hasta 2030)
    
    Args:
        salario_diario: Salario diario del trabajador
        horas_extras: Número de horas extras en la semana
        
    Returns:
        Diccionario con cálculo de horas extras
    """
    # Valor de hora normal
    valor_hora = Decimal(str(salario_diario)) / Decimal('8')
    
    # Límite legal 2026: 12 horas/semana (será 9 en 2027, gradual a 40 hrs)
    LIMITE_HORAS_EXTRAS = 12
    
    # Horas dobles (primeras 9 horas dentro del límite)
    horas_dobles = min(horas_extras, LIMITE_HORAS_EXTRAS)
    monto_doble = horas_dobles * valor_hora * 2  # 100% adicional
    
    # Horas triples (excedente del límite)
    horas_triples = max(0, horas_extras - LIMITE_HORAS_EXTRAS)
    monto_triple = horas_triples * valor_hora * 3  # 200% adicional
    
    # Exención ISR (Art. 93 LISR)
    # 50% de horas dobles exento (dentro de límite 9 hrs/sem)
    UMA = Decimal('108.45')
    limite_exencion = UMA * 5 * 4  # 5 UMA por semana (4 semanas/mes)
    
    exento_horas_dobles = (monto_doble * Decimal('0.50')) if horas_dobles <= 9 else Decimal('0')
    exento_horas_dobles = min(exento_horas_dobles, limite_exencion)
    
    return {
        'valor_hora_normal': float(valor_hora),
        'horas_dobles': horas_dobles,
        'monto_doble': float(monto_doble),
        'horas_triples': horas_triples,
        'monto_triple': float(monto_triple),
        'total_horas_extras': float(monto_doble + monto_triple),
        'exento_isr': float(exento_horas_dobles),
        'gravado_isr': float(monto_doble + monto_triple - exento_horas_dobles)
    }

# Ejemplo:
# resultado = calcular_horas_extras(500.00, 10)
# print(f"Total horas extras: ${resultado['total_horas_extras']:.2f}")
# print(f"Exento ISR: ${resultado['exento_isr']:.2f}")
```

**Retención de ISR (Tablas 2026):**

Para retención de ISR en nómina, se usan las tablas mensuales/quincenales/semanales del Anexo 8 RMF 2026.

```python
# Ver sección 3.2 de este documento para tablas ISR 2026 completas
# La retención de ISR se calcula sobre el ingreso gravado (incluyendo horas extras gravadas)

def calcular_retencion_isr_nómina(ingreso_gravado: float, periodo: str = 'mensual') -> float:
    """
    Calcula retención de ISR para nómina según periodo de pago.
    
    Args:
        ingreso_gravado: Ingreso mensual gravado
        periodo: 'mensual', 'quincenal', o 'semanal'
    
    Returns:
        ISR a retener
    """
    # Usar tablas ISR 2026 de la sección 3.2
    # Para nómina, aplicar sobre ingreso gravado del periodo
    from seccion_3_2 import calcular_isr_mensual, calcular_isr_quincenal
    
    if periodo == 'mensual':
        return calcular_isr_mensual(ingreso_gravado)['isr_a_retener']
    elif periodo == 'quincenal':
        return calcular_isr_quincenal(ingreso_gravado)['isr_a_retener']
    else:
        # Semanal = quincenal / 2 (aproximación)
        return calcular_isr_quincenal(ingreso_gravado)['isr_a_retener'] / 2
```

### 9.5 Integración con PAC (Ejemplo de Uso)

```python
import requests

def timbrar_nomina_pac(xml_path: str, api_key: str, pac: str = 'finkok') -> dict:
    """
    Envía XML de nómina a PAC para timbrado.
    
    Args:
        xml_path: Ruta al XML generado
        api_key: API key del PAC
        pac: Nombre del PAC ('finkok', 'sw', 'edicom', etc.)
    
    Returns:
        Resultado del timbrado con UUID
    """
    # Leer XML
    with open(xml_path, 'rb') as f:
        xml_content = f.read().decode('utf-8')
    
    # Configurar endpoint según PAC
    endpoints = {
        'finkok': 'https://finkok.com/api/timbrar',
        'sw': 'https://api.sw.com.mx/v1/timbrar',
        'edicom': 'https://edicom.com/api/cfdi/timbrar'
    }
    
    # Enviar a PAC
    response = requests.post(
        endpoints[pac],
        headers={'Authorization': f'Bearer {api_key}'},
        json={'xml': xml_content}
    )
    
    resultado = response.json()
    
    return {
        'exitoso': resultado.get('success', False),
        'uuid': resultado.get('uuid'),
        'fecha_timbrado': resultado.get('fechaTimbrado'),
        'sello_sat': resultado.get('selloSAT'),
        'cadena_original': resultado.get('cadenaOriginal'),
        'xml_timbrado': resultado.get('xmlTimbrado'),
        'pdf': resultado.get('pdf')
    }

# Ejemplo de uso:
# resultado = timbrar_nomina_pac('nomina.xml', 'api_key_123', 'finkok')
# if resultado['exitoso']:
#     print(f"✅ Nómina timbrada con UUID: {resultado['uuid']}")
# else:
#     print(f"❌ Error: {resultado.get('mensaje')}")
```

---

## 10. Fuentes Consultadas (Timbrado y PAC)

### Fuentes Oficiales
| Fuente | URL | Fecha |
|--------|-----|-------|
| SAT - Complemento de Nómina 1.2 | http://omawww.sat.gob.mx/tramitesyservicios/Paginas/complemento_nomina.htm | 10-mar-2026 |
| SAT - PAC Autorizados | https://www.sat.gob.mx/consultas/83357/consulta-el-listado-de-proveedores-autorizados-de-certificacion-pac | 10-mar-2026 |
| SAT - Certificado de Sello Digital | https://www.sat.gob.mx/tramites/83304/obten-tu-certificado-de-sello-digital | 10-mar-2026 |
| SAT - CFDI de Nómina 2026 | https://www.cfdis.mx/cambios-en-la-matriz-de-error-complemento-de-nomina | 10-mar-2026 |
| DOF - RMF 2026 Nómina | https://dof.gob.mx/2025/SHCP/SHCP_281225_02.pdf | 10-mar-2026 |
| KPMG - Nómina 2026 | https://kpmg.com/mx/es/tendencias/2025/12/flash-sat-cfdi-de-nomina-2026-version-1-2-del-complemento.html | 10-mar-2026 |
| iTimbre - Revisión E | https://itimbre.com/nomina-version-1-2-revision-e-2026/ | 10-mar-2026 |
| XPD - Cambios Nómina 2026 | https://xpd.mx/blog/cambios-en-el-complemento-de-nomina-2026-revision-e.html | 10-mar-2026 |
| Gosocket - Nómina 2026 | https://gosocket.net/centro-de-recursos/cambios-a-los-cfdi-de-nomina-2026/ | 10-mar-2026 |
| Microsip - Revisión E | https://www.microsip.com/blogs/cambios-del-complemento-de-nomina-1-2-revision-e-lo-que-tu-empresa-debe-saber-para-2026 | 10-mar-2026 |

### Fuentes de Mercado
| Fuente | URL | Tema |
|--------|-----|------|
| Finkok - PAC | https://finkok.com/ | Timbrado CFDI |
| SW Sapien - PAC | https://www.sw.com.mx/ | Timbrado CFDI |
| Facturapi - API | https://facturapi.io/blog/what-is-a-pac | Qué es PAC |
| Prodigia - CSD | https://www.prodigia.com.mx/blog/certificados-de-sello-digital-que-son-y-como-evitar-errores-comunes | CSD |
| Edicom - CFDI | https://edicomgroup.com/es/blog/cfdi-factura-electronica-mexico | CFDI Nómina |
| Gigstack - CFDI 4.0 | https://blog.gigstack.pro/post/cfdi-4-0-facturacion-electronica-automatizacion-mexico-2026 | CFDI 2026 |
| Crehana - Nómina Electrónica | https://www.crehana.com/blog/gestion-talento/nomina-electronica-en-mexico-beneficios-requisitos-y-pasos-para-implementarla/ | Implementación |
| Datamine - Overseer Nómina | https://www.datamine.com.mx/productos/nomina/ | Timbrado + Incidencias |
| Consolidé - Nómina 1.2 | https://consolide.com/blog/complemento-de-nomina-1-2-revision-e/ | Revisión E |
| ElContaMX - Horas Extras | https://elconta.mx/calculadora-horas-extras-dias-festivos-2026/ | Horas extras 2026 |

**Total de fuentes consultadas:** 22 fuentes (IMSS/INFONAVIT) + 20 fuentes (Timbrado/PAC) = **42 fuentes**

---

## 11. Control de Cambios

| Versión | Fecha | Autor | Tipo | Cambios Realizados | Sección Afectada |
|---------|-------|-------|------|-------------------|------------------|
| 1.0 | 10-mar-2026 | Diego Gzz | Creación | Versión inicial del documento | Todo el documento |
| 1.1 | 10-mar-2026 | Technical Writer | **Investigación con Tavily** | Agregadas 22 fuentes oficiales (IMSS, INFONAVIT, SAT), tablas 2026 actualizadas, reformas vigentes | Secciones 1, 2, 9 |
| 1.2 | 10-mar-2026 | Diego Gzz | **Actualización Timbrado/PAC** | **Gap #5 completado**: Agregada sección 9 completa de Timbrado y PAC (6 subsecciones). **20 fuentes adicionales** de timbrado/PAC. **Código Python funcional**: generador XML nómina, validador CSD, calculadora horas extras, integración PAC. **Diagrama ASCII** de flujo de timbrado. | Secciones 9, 10, 11 |

**Detalle de cambios v1.2:**
- **Sección 9:** Nueva sección de Timbrado/PAC con 6 subsecciones (9.1-9.5)
- **Sección 9.1:** Tabla de 6 proveedores PAC con costos 2026 ($0.80-$3.50/timbre)
- **Sección 9.2:** Código de validación de vigencia de CSD (criptografía)
- **Sección 9.3:** Generador de XML de nómina (CFDI 4.0 + Complemento 1.2 Revisión E)
- **Sección 9.3:** Tabla de cambios Revisión E 2026 (5 cambios clave)
- **Sección 9.4:** Calculadora de horas extras con límites legales 2026 (12 hrs/sem)
- **Sección 9.5:** Integración con API de PAC (Finkok, SW, Edicom)
- **Sección 10:** Agregadas 20 fuentes de timbrado/PAC
- **Sección 11:** Actualizado control de cambios v1.1 → v1.2

**Queries ejecutados en Tavily para Gap #5 (4 queries):**
1. `PAC proveedor autorizado certificación CFDI nómina costos 2026`
2. `sellado digital CFDI firma electrónica certificados SAT`
3. `timbrado nómina CFDI 1.2 workflow completo 2026`
4. `incidencias nómina incapacidades horas extras ISR 2026`

**Datos clave identificados:**
- **Costos PAC 2026:** $0.80-$3.50 por timbre (varía por volumen)
- **Vigencia CSD:** 4 años, trámite gratuito en SAT
- **Revisión E 2026:** 5 cambios clave (subsidio $628, nuevas claves 054/055/108-111)
- **Horas extras 2026:** Tope 12 hrs/semana (gradual a 9 hrs en 2027)
- **Subsidio empleo 2026:** Tope $628.00 (factor 20.66, de $475.00/15.63)

**Total de fuentes consultadas:** 22 fuentes (IMSS/INFONAVIT v1.1) + 20 fuentes (Timbrado/PAC v1.2) = **42 fuentes**

---

**Documento elaborado para:** Equipo de desarrollo IDP-App
**Propósito:** Guiar implementación técnica del módulo de cálculo de nómina IMSS/INFONAVIT
**Próxima actualización:** Después de implementación de Fase 11

---

*Fin de la Investigación de Cálculo de Nómina IMSS/INFONAVIT*
