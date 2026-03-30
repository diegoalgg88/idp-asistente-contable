# Investigación: Formatos de Estados de Cuenta - Bancos México 2026

**Fecha:** 10 de marzo de 2026
**Propósito:** Documentar formatos de estados de cuenta de 15+ bancos mexicanos
**Fuente:** Condusef, sitios oficiales de bancos, investigación web

---

## 📋 Normativa Condusef 2026

### Columnas Obligatorias (Acuerdo Condusef)

Según el Acuerdo de Condusef sobre estados de cuenta, los bancos deben incluir:

| Columna | Nombre Oficial | Descripción | Formato |
|---------|---------------|-------------|---------|
| **Fecha de Operación** | `fecha_operacion` | Fecha cuando se realizó la transacción | DD/MM/YYYY |
| **Fecha de Valor** | `fecha_valor` | Fecha cuando se aplica el saldo | DD/MM/YYYY |
| **Descripción del Movimiento** | `descripcion` | Concepto detallado de la operación | Texto (200 chars) |
| **Cargo/Retiro** | `cargo` | Monto de egreso | $ MXN |
| **Abono/Depósito** | `abono` | Monto de ingreso | $ MXN |
| **Saldo** | `saldo` | Saldo después del movimiento | $ MXN |
| **Referencia** | `referencia` | Número de referencia de operación | Alfanumérico |

---

## 🏦 Formatos por Banco

### 1. BBVA México

**Formato de Descarga:**
- PDF (predeterminado)
- CSV (vía ConversorExtracto)
- Excel (vía conversión)

**Columnas Típicas:**
```
Fecha, Concepto, Cargo, Abono, Saldo, Referencia
```

**Patrones de Detección:**
- Encabezado: "BBVA México" o "BBVA Bancomer"
- Formato de fecha: DD/MM/YYYY
- Montos negativos entre paréntesis: `(1,500.00)`
- Saldo siempre positivo

**Ejemplo:**
```csv
Fecha,Concepto,Cargo,Abono,Saldo,Referencia
01/03/2026,PAGO SERVICIO AZUL SA DE CV,1500.00,,5000.00,REF123456
02/03/2026,TRANSFERENCIA RECIBIDA,,3000.00,8000.00,REF789012
```

---

### 2. Santander México

**Formato de Descarga:**
- PDF (predeterminado)
- Excel (solicitud en sucursal)
- CSV (vía banca en línea)

**Columnas Típicas:**
```
Fecha, Descripción, Retiros, Depósitos, Saldo, Referencia
```

**Patrones de Detección:**
- Encabezado: "Santander" o "Banco Santander"
- Formato de fecha: DD/MM/YYYY
- Columnas: "Retiros" (cargo), "Depósitos" (abono)

**Ejemplo:**
```csv
Fecha,Descripcion,Retiros,Depositos,Saldo,Referencia
01/03/2026,PAGO TARJETA CREDITO,2000.00,,10000.00,987654
02/03/2026,NOMINA EMPRESA SA,,15000.00,25000.00,123456
```

---

### 3. Banorte

**Formato de Descarga:**
- PDF (predeterminado)
- Excel (banca en línea)
- CSV (empresarial)

**Columnas Típicas:**
```
Fecha, Descripción, Cargo, Abono, Saldo, Referencia
```

**Patrones de Detección:**
- Encabezado: "Banorte" o "GBM Banorte"
- Formato de fecha: DD/MM/YYYY
- Montos con signo: negativos para cargos

**Ejemplo:**
```csv
Fecha,Descripcion,Cargo,Abono,Saldo,Referencia
01/03/2026,PAGO PROVEEDOR ABC,-1000.00,,5000.00,REF111
02/03/2026,DEPOSITO EFECTIVO,,2000.00,7000.00,REF222
```

---

### 4. Citibanamex

**Formato de Descarga:**
- PDF (predeterminado)
- Excel (solicitud)
- CSV (banca en línea)

**Columnas Típicas:**
```
Fecha, Descripción, Cargo, Abono, Saldo
```

**Patrones de Detección:**
- Encabezado: "Citibanamex" o "Citi Banamex"
- Formato de fecha: DD/MM/YYYY

---

### 5. Scotiabank

**Formato de Descarga:**
- PDF (predeterminado)
- Excel (banca en línea)

**Columnas Típicas:**
```
Fecha, Concepto, Retiro, Depósito, Saldo
```

**Patrones de Detección:**
- Encabezado: "Scotiabank" o "Scotia"

---

### 6. HSBC

**Formato de Descarga:**
- PDF (predeterminado)
- Excel (banca en línea)

**Columnas Típicas:**
```
Fecha, Descripción, Cargo, Abono, Saldo
```

**Patrones de Detección:**
- Encabezado: "HSBC" o "HSBC México"

---

### 7. Inbursa

**Formato de Descarga:**
- PDF (predeterminado)
- Excel (sucursal)

**Columnas Típicas:**
```
Fecha, Concepto, Cargo, Abono, Saldo
```

**Patrones de Detección:**
- Encabezado: "Inbursa" o "Banco Inbursa"

---

### 8. Banregio

**Formato de Descarga:**
- PDF (predeterminado)
- Excel (banca en línea)

**Columnas Típicas:**
```
Fecha, Descripción, Cargo, Abono, Saldo
```

**Patrones de Detección:**
- Encabezado: "Banregio" o "Banco Banregio"

---

### 9. Afirme

**Formato de Descarga:**
- PDF (predeterminado)
- Excel (banca en línea)

**Columnas Típicas:**
```
Fecha, Concepto, Cargo, Abono, Saldo
```

**Patrones de Detección:**
- Encabezado: "Afirme" o "Banco Afirme"

---

### 10. Banco del Bajío

**Formato de Descarga:**
- PDF (predeterminado)
- Excel (banca en línea)

**Columnas Típicas:**
```
Fecha, Descripción, Cargo, Abono, Saldo
```

**Patrones de Detección:**
- Encabezado: "Bajío" o "Banco del Bajío" o "BanBajío"

---

### 11. BanCoppel

**Formato de Descarga:**
- PDF (predeterminado)
- Excel (tienda física)

**Columnas Típicas:**
```
Fecha, Concepto, Cargo, Abono, Saldo
```

**Patrones de Detección:**
- Encabezado: "BanCoppel" o "Banco Coppel"

---

### 12. Banco Azteca

**Formato de Descarga:**
- PDF (predeterminado)
- Excel (tienda física)

**Columnas Típicas:**
```
Fecha, Descripción, Retiro, Depósito, Saldo
```

**Patrones de Detección:**
- Encabezado: "Azteca" o "Banco Azteca"

---

### 13. BanCrédito

**Formato de Descarga:**
- PDF (predeterminado)
- Excel (banca en línea)

**Columnas Típicas:**
```
Fecha, Concepto, Cargo, Abono, Saldo
```

**Patrones de Detección:**
- Encabezado: "BanCrédito" o "Banco BCrédito"

---

### 14. Multiva

**Formato de Descarga:**
- PDF (predeterminado)
- Excel (banca en línea)

**Columnas Típicas:**
```
Fecha, Descripción, Cargo, Abono, Saldo
```

**Patrones de Detección:**
- Encabezado: "Multiva" o "Banco Multiva"

---

## 📊 Resumen de Columnas Comunes

### Mapeo Estandarizado

| Término Banco | Columna Estándar | Variantes |
|---------------|------------------|-----------|
| **Fecha** | `fecha` | fecha_operacion, date, transaction_date |
| **Concepto** | `concepto` | descripcion, description, narrative, detalle |
| **Cargo** | `cargo` | retiros, debito, egreso, withdrawal, debit, charge |
| **Abono** | `abono` | depositos, credito, ingreso, deposit, credit, income |
| **Saldo** | `saldo` | balance, saldo_final, running_balance |
| **Referencia** | `referencia` | ref, folio, transaction_id, operation_number |

---

## 🔍 Patrones de Detección por Banco

### Keywords para Identificación

| Banco | Keywords (case-insensitive) |
|-------|----------------------------|
| **BBVA** | bbva, bbva méxico, bbva bancomer |
| **Santander** | santander, banco santander |
| **Banorte** | banorte, banco banorte, gbm banorte |
| **Citibanamex** | citibanamex, banamex, citi banamex |
| **Scotiabank** | scotiabank, scotia |
| **HSBC** | hsbc, hsbc méxico |
| **Inbursa** | inbursa, banco inbursa |
| **Banregio** | banregio, banco banregio |
| **Afirme** | afirme, banco afirme |
| **Bajío** | bajío, banco del bajío, banbajío |
| **BanCoppel** | bancoppel, banco coppel |
| **Azteca** | azteca, banco azteca |
| **BanCrédito** | bancrédito, banco bcrédito |
| **Multiva** | multiva, banco multiva |

---

## 💡 Recomendaciones para el Parser

### 1. Detección Automática
- Buscar keywords en primeras 10 líneas
- Si no hay keywords, detectar por columnas
- Fallback a genérico

### 2. Manejo de Encoding
- Detectar con `chardet`
- Soportar UTF-8, Latin-1, Windows-1252

### 3. Formato de Fechas
- Principal: DD/MM/YYYY
- Secundario: DD-MM-YYYY
- Terciario: YYYY/MM/DD

### 4. Formato de Montos
- Separador de miles: coma (`,`)
- Separador decimal: punto (`.`)
- Negativos: entre paréntesis `(1,500.00)` o con signo `-1500.00`

### 5. Stopwords para Limpieza
```python
STOPWORDS = [
    'pago', 'servicio', 'serv', 'sa', 'sc', 'rl', 'cv',
    'mex', 'mexico', 'de', 'del', 'la', 'el', 'los', 'las'
]
```

---

## 📌 Fuentes Consultadas

1. **Condusef** - Acuerdo de estados de cuenta: https://www.condusef.gob.mx/documentos/marco_legal/Acuerdo_estado_de_cuenta.pdf
2. **BBVA México** - Estados de cuenta: https://www.bbva.mx/personas/servicios-digitales/consulta-estado-de-cuenta.html
3. **Santander** - Banca en línea: https://www.santander.com.mx
4. **Banorte** - Servicios bancarios: https://www.banorte.com
5. **ConversorExtracto** - Conversión de estados de cuenta: https://conversorextracto.com/bancos/bbva-mexico

---

**Documento elaborado para:** Equipo de desarrollo IDP-App
**Propósito:** Mejorar parser de estados de cuenta con información real de bancos mexicanos
**Próxima actualización:** Cuando se agreguen nuevos bancos o cambien formatos

---

*Fin de la Investigación de Formatos Bancarios*
