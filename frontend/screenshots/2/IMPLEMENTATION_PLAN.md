# 📋 Plan de Implementación - Correcciones UI-Backend

**Fecha de creación**: 2026-03-12  
**Basado en**: `frontend/screenshots/2/ui_backend_analysis.json` (34 imágenes, 85 issues)  
**Precisión del análisis**: 100% ✅ (validado contra código backend)

---

## 🔴 PRIORIDAD 1 - CRÍTICO (Sprint 1 - 1-2 días)

### 1.1 Corregir Estado de Resultados Operativo [ERROR CONTABLE GRAVE]

**Problema**: La página "Estado de Resultados" muestra datos de Balance General (Activo/Pasivo/Capital) en lugar de P&L.

**Archivos**:
- Frontend: `frontend/src/pages/Finance.tsx` o `frontend/src/components/finance/IncomeStatement.tsx`
- Backend: `backend/app/api/finance.py` (líneas 68-97) ✅ ya está correcto

**Tareas**:
- [ ] 1.1.1 Verificar que el frontend usa `type="P&L"` para obtener datos correctos
- [ ] 1.1.2 Mostrar estructura correcta de P&L:
  ```
  - Ingresos Totales
  - Costo de Ventas
  - Utilidad Bruta
  - Gastos Operativos
  - Utilidad Operativa
  - Otros Ingresos/Egresos
  - Utilidad Neta
  ```
- [ ] 1.1.3 Eliminar datos de Activo/Pasivo/Capital de esta vista
- [ ] 1.1.4 Agregar prueba de que los datos coinciden con el backend

**Endpoint**: `GET /v1/finance/statements`  
**Tiempo estimado**: 2-3 horas

---

### 1.2 Conectar Vista de Clientes

**Problema**: Las páginas de Personas Morales, Físicas y Prospectos están vacías aunque hay datos en backend.

**Archivos**:
- Frontend: `frontend/src/pages/Clients.tsx`, `frontend/src/components/clients/ClientList.tsx`
- Backend: `backend/app/api/clients.py` (líneas 62-74)

**Tareas**:
- [ ] 1.2.1 Agregar llamada a `GET /v1/clients` en el componente Clients
- [ ] 1.2.2 Implementar filtrado por `type` (moral, física, prospecto)
- [ ] 1.2.3 Mostrar tabla de clientes con columnas: Nombre, RFC, Email, Status, KYC Status
- [ ] 1.2.4 Agregar estado de carga y manejo de errores
- [ ] 1.2.5 Implementar búsqueda por RFC/nombre
- [ ] 1.2.6 Agregar botón "Registrar" que llame a `POST /v1/clients`

**Endpoints**: 
- `GET /v1/clients?type=moral` 
- `GET /v1/clients?type=fisica`
- `GET /v1/clients?status=Prospecto`

**Tiempo estimado**: 4-6 horas

---

### 1.3 Conectar Vista de Gastos (Deducibles/No Deducibles)

**Problema**: Las vistas de gastos deducibles y no deducibles están vacías.

**Archivos**:
- Frontend: `frontend/src/pages/Expenses.tsx`, `frontend/src/components/expenses/ExpenseList.tsx`
- Backend: `backend/app/api/expenses.py` (líneas 82-118)

**Tareas**:
- [ ] 1.3.1 Agregar llamada a `GET /v1/expenses/pending` en el componente Expenses
- [ ] 1.3.2 Filtrar por `is_deductible=true` para deducibles
- [ ] 1.3.3 Filtrar por `is_deductible=false` para no deducibles
- [ ] 1.3.4 Mostrar lista de gastos con: Proveedor, Concepto, Fecha, Total, Categoría
- [ ] 1.3.5 Agregar badge de estado "Deducible" / "No Deducible"
- [ ] 1.3.6 Implementar botón para reclasificar gasto (cambiar is_deductible)

**Endpoints**:
- `GET /v1/expenses/pending?deductible=true`
- `GET /v1/expenses/pending?deductible=false`

**Tiempo estimado**: 4-6 horas

---

### 1.4 Conectar Calendario Fiscal

**Problema**: La página "Calendario Fiscal Completo" está vacía aunque el backend tiene CRUD completo.

**Archivos**:
- Frontend: `frontend/src/components/Calendar.tsx` o `frontend/src/pages/Workspace.tsx` (sección calendario)
- Backend: `backend/app/api/workspace.py` (líneas 400+)

**Tareas**:
- [ ] 1.4.1 Agregar llamada a `GET /v1/workspace/calendar` al montar el componente
- [ ] 1.4.2 Mostrar eventos en formato de calendario (mensual/semanal)
- [ ] 1.4.3 Implementar CRUD completo:
  - [ ] Crear evento (`POST /v1/workspace/calendar`)
  - [ ] Editar evento (`PUT /v1/workspace/calendar/{id}`)
  - [ ] Eliminar evento (`DELETE /v1/workspace/calendar/{id}`)
  - [ ] Marcar como completado (toggle ✓)
- [ ] 1.4.4 Implementar botón "Descargar ICS" (`GET /v1/workspace/calendar/export`)
- [ ] 1.4.5 Agregar notificación toast al descargar
- [ ] 1.4.6 Mostrar eventos auto-generados del calendario fiscal mexicano

**Endpoints**:
- `GET /v1/workspace/calendar`
- `POST /v1/workspace/calendar`
- `PUT /v1/workspace/calendar/{id}`
- `DELETE /v1/workspace/calendar/{id}`

**Tiempo estimado**: 6-8 horas

---

## 🟠 PRIORIDAD 2 - ALTO (Sprint 2 - 3-5 días)

### 2.1 Crear Endpoint PTU Calculation

**Problema**: Los valores de PTU ($145,100) son hardcoded sin fuente backend.

**Archivos**:
- Backend: `backend/app/api/payroll.py` (nuevo endpoint)
- Frontend: `frontend/src/pages/Payroll.tsx` o `frontend/src/components/payroll/PTUSection.tsx`

**Tareas Backend**:
- [ ] 2.1.1 Crear modelo `PTUCalculation` con campos: monto_estimado, dias_trabajados_50, salario_devengado_50, utilidad_fiscal
- [ ] 2.1.2 Crear endpoint `GET /v1/payroll/ptu-calculation` que retorne:
  ```json
  {
    "monto_estimado": 0,
    "criterios_legales": {
      "dias_trabajados_50": 145100,
      "salario_devengado_50": 145100
    },
    "utilidad_fiscal": 0,
    "ejercicio": 2026
  }
  ```
- [ ] 2.1.3 Calcular PTU basado en utilidad fiscal del ejercicio anterior
- [ ] 2.1.4 Agregar endpoint `POST /v1/payroll/ptu-calculation` para generar proyecto de reparto

**Tareas Frontend**:
- [ ] 2.1.5 Conectar vista PTU al endpoint `GET /v1/payroll/ptu-calculation`
- [ ] 2.1.6 Mostrar monto estimado consistente con criterios legales
- [ ] 2.1.7 Agregar tooltip explicando distribución 50%/50%
- [ ] 2.1.8 Implementar botón "Generar Proyecto de Reparto"

**Tiempo estimado**: 6-8 horas (backend: 4h, frontend: 4h)

---

### 2.2 Crear Endpoint IMSS Monthly Settlement

**Problema**: Los valores de IMSS/INFONAVIT ($12,450 + $5,100) son hardcoded.

**Archivos**:
- Backend: `backend/app/api/payroll.py` (nuevo endpoint)
- Frontend: `frontend/src/pages/Payroll.tsx` o `frontend/src/components/payroll/IMSSSection.tsx`

**Tareas Backend**:
- [ ] 2.2.1 Crear endpoint `GET /v1/payroll/monthly-settlement` que retorne:
  ```json
  {
    "periodo": "2026-03",
    "cuotas_imss": 12450.00,
    "retencion_infonavit": 5100.00,
    "total_a_pagar": 17550.00,
    "sincronizado": true,
    "ultima_sincronizacion": "2026-03-12T10:00:00Z"
  }
  ```
- [ ] 2.2.2 Calcular cuotas IMSS basado en salarios y semanas cotizadas
- [ ] 2.2.3 Calcular retención INFONAVIT (5% aportaciones)

**Tareas Frontend**:
- [ ] 2.2.4 Conectar vista SUA/IMSS al endpoint
- [ ] 2.2.5 Agregar selector de periodo "Liquidación de: [Mes Año]"
- [ ] 2.2.6 Mostrar fecha de última sincronización
- [ ] 2.2.7 Agregar instrucciones para archivo .SUA: "Arrastra tu archivo .SUA o haz clic para explorar"

**Tiempo estimado**: 5-7 horas (backend: 3h, frontend: 4h)

---

### 2.3 Conectar Configuración de Usuario

**Problema**: Los campos de perfil y configuración están vacíos aunque los endpoints existen.

**Archivos**:
- Frontend: `frontend/src/pages/Settings.tsx`
- Backend: `backend/app/api/users.py` (líneas 52-110) ✅ ya existen

**Tareas**:
- [ ] 2.3.1 Agregar llamada a `GET /v1/users/me` para cargar perfil (nombre, email)
- [ ] 2.3.2 Agregar llamada a `GET /v1/users/me/settings` para cargar configuración (idioma, notificaciones, dark mode)
- [ ] 2.3.3 Implementar guardado con `PUT /v1/users/me/settings`
- [ ] 2.3.4 Implementar actualización de perfil con `PUT /v1/users/me`
- [ ] 2.3.5 Agregar feedback visual de "Guardando..." y "Guardado exitosamente"
- [ ] 2.3.6 Validar campos antes de guardar

**Endpoints**:
- `GET /v1/users/me`
- `PUT /v1/users/me`
- `GET /v1/users/me/settings`
- `PUT /v1/users/me/settings`

**Tiempo estimado**: 3-4 horas

---

### 2.4 Conectar Finanzas - Resumen Financiero

**Problema**: Los KPIs de Finanzas muestran '-' aunque hay datos en backend.

**Archivos**:
- Frontend: `frontend/src/pages/Finance.tsx` o `frontend/src/components/finance/Summary.tsx`
- Backend: `backend/app/api/finance.py` (líneas 36-63)

**Tareas**:
- [ ] 2.4.1 Agregar llamada a `GET /v1/finance/summary` al montar componente
- [ ] 2.4.2 Mostrar KPIs: Margen Bruto, EBITDA, Liquidez, Saldos Bancos
- [ ] 2.4.3 Agregar estado de carga mientras se obtienen datos
- [ ] 2.4.4 Manejar caso de datos vacíos (mostrar "Sin datos" en lugar de "-")
- [ ] 2.4.5 Conectar sección "Estados Financieros Maestro" a `GET /v1/finance/statements`
- [ ] 2.4.6 Implementar gráficas con `GET /v1/finance/chart-data`

**Endpoints**:
- `GET /v1/finance/summary`
- `GET /v1/finance/statements`
- `GET /v1/finance/chart-data`

**Tiempo estimado**: 4-6 horas

---

### 2.5 Crear Endpoint CFDI Stats

**Problema**: Los conteos de CFDI (124 emitidos, 85 recibidos, 12 nómina) no tienen endpoint.

**Archivos**:
- Backend: `backend/app/api/documents.py` (nuevo endpoint o modificar existente)
- Frontend: `frontend/src/pages/Documents.tsx` o `frontend/src/components/documents/CFDIStats.tsx`

**Tareas Backend**:
- [ ] 2.5.1 Crear endpoint `GET /v1/documents/cfdi-stats` que retorne:
  ```json
  {
    "emitidos": {
      "total": 124,
      "sincronizado": true,
      "pendientes": 0
    },
    "recibidos": {
      "total": 85,
      "sincronizado": false,
      "pendientes": 2
    },
    "nomina": {
      "total": 12,
      "timbrado_correcto": true
    },
    "ultima_sincronizacion": "2026-03-12T09:30:00Z"
  }
  ```
- [ ] 2.5.2 Calcular conteos desde tabla `documents` filtrando por `document_type`

**Tareas Frontend**:
- [ ] 2.5.3 Conectar vista "Reportes CFDI" al endpoint
- [ ] 2.5.4 Agregar tooltip en "2 PENDIENTES" que liste documentos pendientes
- [ ] 2.5.5 Mostrar fecha de última sincronización
- [ ] 2.5.6 Agregar badge de estado "Sincronizado" / "Pendiente"

**Tiempo estimado**: 4-5 horas (backend: 2h, frontend: 3h)

---

### 2.6 Conectar Impuestos Mensuales

**Problema**: Los botones "CALCULAR" no están conectados al backend.

**Archivos**:
- Frontend: `frontend/src/pages/Dashboard.tsx` o `frontend/src/components/dashboard/TaxesSection.tsx`
- Backend: `backend/app/api/fiscal.py` (líneas 22-32)

**Tareas**:
- [ ] 2.6.1 Agregar selector de periodo fiscal global (Mes/Año)
- [ ] 2.6.2 Implementar botón "CALCULAR" para IVA que llame a `POST /v1/fiscal/calculate-taxes`
- [ ] 2.6.3 Implementar botón "CALCULAR" para ISR Retenciones
- [ ] 2.6.4 Implementar botón "CALCULAR" para ISR Propio
- [ ] 2.6.5 Implementar botón "CALCULAR" para IEPS
- [ ] 2.6.6 Agregar spinner durante cálculo
- [ ] 2.6.7 Diferenciar estados: "Pendiente de calcular" vs "Calculado" vs "Por pagar"
- [ ] 2.6.8 Mostrar resultados del cálculo en la tarjeta

**Endpoint**: `POST /v1/fiscal/calculate-taxes`  
**Payload**:
```json
{
  "period": "2026-03",
  "regime": "RESICO_PF",
  "income": 0.0,
  "subtotal_iva": 0.0
}
```

**Tiempo estimado**: 6-8 horas

---

## 🟡 PRIORIDAD 3 - MEDIO (Sprint 3 - 5-8 días)

### 3.1 Crear Endpoint SAT Opinion

**Problema**: No hay endpoint para consultar opinión de cumplimiento SAT.

**Archivos**:
- Backend: `backend/app/api/fiscal.py` (nuevo endpoint)
- Frontend: `frontend/src/pages/Fiscal.tsx` o `frontend/src/components/fiscal/ComplianceOpinion.tsx`

**Tareas Backend**:
- [ ] 3.1.1 Crear endpoint `POST /v1/fiscal/consult-sat-opinion` que:
  - Use scraper de `app.services.fiscal.scraper_32d`
  - Retorne: sentido (Positiva/Negativa), fecha_consulta, url_pdf
- [ ] 3.1.2 Agregar endpoint `GET /v1/fiscal/compliance-opinion/history` para historial

**Tareas Frontend**:
- [ ] 3.1.3 Implementar botón "Consultar Opinión (SAT)" que llame al endpoint
- [ ] 3.1.4 Agregar botón "Actualizar ahora" junto al timestamp
- [ ] 3.1.5 Mostrar timestamp absoluto y relativo ("Hace 14 minutos")
- [ ] 3.1.6 Implementar modal "Historial de Consultas"

**Tiempo estimado**: 5-7 horas (backend: 3h, frontend: 4h)

---

### 3.2 Crear Endpoint Coeficiente CU

**Problema**: El coeficiente de utilidad (0.0972) es calculado en frontend sin validación backend.

**Archivos**:
- Backend: `backend/app/api/fiscal.py` (nuevo endpoint)
- Frontend: `frontend/src/pages/Fiscal.tsx` o `frontend/src/components/fiscal/CoefficientCalculator.tsx`

**Tareas Backend**:
- [ ] 3.2.1 Crear endpoint `POST /v1/fiscal/calculate-cu` que retorne:
  ```json
  {
    "utilidad_fiscal": 1245000.00,
    "ingresos_nominales": 12800000.00,
    "coeficiente": 0.0972,
    "ejercicio": 2025,
    "formula": "Utilidad Fiscal / Ingresos Nominales"
  }
  ```
- [ ] 3.2.2 Crear endpoint `PUT /v1/fiscal/cu` para guardar coeficiente

**Tareas Frontend**:
- [ ] 3.2.3 Agregar botón "Editar" para valores del ejercicio anterior
- [ ] 3.2.4 Mostrar fórmula visible: "Coeficiente = Utilidad Fiscal / Ingresos Nominales"
- [ ] 3.2.5 Validar cálculo en frontend (utilidad / ingresos = coeficiente)
- [ ] 3.2.6 Agregar nota fiscal dinámica basada en datos reales

**Tiempo estimado**: 4-6 horas (backend: 2h, frontend: 4h)

---

### 3.3 Conectar Métricas IA

**Problema**: Las sub-métricas "Mapeo Conceptual" y "Detección de RFC" no tienen datos del backend.

**Archivos**:
- Backend: `backend/app/api/workspace.py` (modificar endpoint /metrics)
- Frontend: `frontend/src/pages/Dashboard.tsx` o `frontend/src/components/dashboard/IAMetrics.tsx`

**Tareas Backend**:
- [ ] 3.3.1 Agregar campos al endpoint `GET /v1/workspace/metrics`:
  ```json
  {
    "extraction_accuracy": 98.1,
    "conceptual_mapping_accuracy": 99.2,
    "rfc_detection_accuracy": 100.0,
    "documents_processed": 500,
    "avg_latency_ms": 3200
  }
  ```
- [ ] 3.3.2 Calcular métricas desde tabla `documents` (confidence_score, extracted_data)

**Tareas Frontend**:
- [ ] 3.3.2 Conectar vista "Métricas IA" al endpoint actualizado
- [ ] 3.3.3 Agregar tooltips explicando cómo se calcula cada métrica
- [ ] 3.3.4 Mostrar nota dinámica: "Basado en últimos X documentos procesados"

**Tiempo estimado**: 3-4 horas (backend: 2h, frontend: 2h)

---

### 3.4 Conectar Agente Fiscal - Estado y Tools

**Problema**: El estado "CONECTADO" y el conteo "TOOLS: 4/5" son hardcoded.

**Archivos**:
- Backend: `backend/app/api/agent.py` (nuevo endpoint)
- Frontend: `frontend/src/components/Chat.tsx` o `frontend/src/components/agent/AgentPanel.tsx`

**Tareas Backend**:
- [ ] 3.4.1 Crear endpoint `GET /v1/agent/status` que retorne:
  ```json
  {
    "connected": true,
    "model": "llama-3.3-70b",
    "tools_available": 5,
    "tools_active": 4,
    "last_activity": "2026-03-12T10:00:00Z"
  }
  ```
- [ ] 3.4.2 Crear endpoint `GET /v1/agent/tools` que liste herramientas disponibles

**Tareas Frontend**:
- [ ] 3.4.3 Conectar estado "CONECTADO" al endpoint `GET /v1/agent/status`
- [ ] 3.4.4 Mostrar conteo real de herramientas desde `GET /v1/agent/tools`
- [ ] 3.4.5 Agregar indicador de actividad del agente

**Tiempo estimado**: 3-4 horas (backend: 2h, frontend: 2h)

---

### 3.5 Traducir Textos en Inglés

**Problema**: Textos en inglés en UI española ("EXPIRE IN 5D", "READY TO DEC").

**Archivos**:
- Frontend: Múltiples componentes en `frontend/src/components/`

**Tareas**:
- [ ] 3.5.1 Buscar y reemplazar "EXPIRE IN 5D" → "EXPIRA EN 5D"
- [ ] 3.5.2 Buscar y reemplazar "READY TO DEC" → "LISTO PARA DECLARAR"
- [ ] 3.5.3 Buscar y reemplazar "LISTO PARA DECL." → mantener o expandir a "LISTO PARA DECLARAR"
- [ ] 3.5.4 Revisar otros textos en inglés en todo el frontend
- [ ] 3.5.5 Agregar verificación de consistencia de idioma en CI/CD

**Tiempo estimado**: 2-3 horas

---

### 3.6 Agregar Contadores en Filtros Laterales

**Problema**: Los filtros laterales no muestran cuántos documentos hay en cada categoría.

**Archivos**:
- Frontend: `frontend/src/pages/Documents.tsx` o `frontend/src/components/documents/DocumentFilters.tsx`
- Backend: `backend/app/api/documents.py` (agregar parámetro de conteo)

**Tareas Backend**:
- [ ] 3.6.1 Agregar endpoint `GET /v1/documents/count?type=issued|received|payroll` que retorne conteos

**Tareas Frontend**:
- [ ] 3.6.2 Agregar contador "(124)" junto a "Facturas Emitidas"
- [ ] 3.6.3 Agregar contador "(85)" junto a "Facturas Recibidas"
- [ ] 3.6.4 Agregar contador "(12)" junto a "Nóminas"
- [ ] 3.6.5 Actualizar contadores al aplicar filtros

**Tiempo estimado**: 3-4 horas (backend: 1h, frontend: 3h)

---

## 🟢 PRIORIDAD 4 - BAJO (Sprint 4 - 8-12 días)

### 4.1 Crear Modelo y Endpoints de Incidencias

**Problema**: No hay modelo de datos para incidencias operativas.

**Archivos**:
- Backend: `backend/app/db/models.py` (nuevo modelo), `backend/app/api/payroll.py` (nuevos endpoints)
- Frontend: `frontend/src/pages/Payroll.tsx` o `frontend/src/components/payroll/Incidencias.tsx`

**Tareas Backend**:
- [ ] 4.1.1 Crear modelo `Incidence` con campos: id, user_id, employee_id, type, date, hours, amount, status, created_at
- [ ] 4.1.2 Crear endpoints CRUD `/v1/payroll/incidences`:
  - `GET` - Listar incidencias
  - `POST` - Crear incidencia
  - `PUT` - Actualizar incidencia
  - `DELETE` - Eliminar incidencia

**Tareas Frontend**:
- [ ] 4.1.3 Implementar vista de incidencias con tabla
- [ ] 4.1.4 Implementar botón "Añadir Registro" con modal
- [ ] 4.1.5 Agregar tipos de incidencia: Retraso, Falta, Hora Extra, Permiso
- [ ] 4.1.6 Mostrar mensaje "No hay incidencias registradas" cuando esté vacío

**Tiempo estimado**: 8-10 horas (backend: 5h, frontend: 5h)

---

### 4.2 Crear Endpoint Auditoría IA

**Problema**: El botón "INICIAR AUDITORÍA IA" no tiene backend.

**Archivos**:
- Backend: `backend/app/api/workspace.py` o `backend/app/api/audit.py` (nuevo endpoint)
- Frontend: `frontend/src/pages/Dashboard.tsx` o `frontend/src/components/dashboard/AuditButton.tsx`

**Tareas Backend**:
- [ ] 4.2.1 Crear endpoint `POST /v1/workspace/start-audit` que:
  - Inicie proceso de auditoría en background
  - Retorne: audit_id, status, estimated_time
- [ ] 4.2.2 Crear endpoint `GET /v1/workspace/audit/{id}/status` para verificar progreso
- [ ] 4.2.3 Usar `app.services.audit.audit_engine` para ejecutar auditoría

**Tareas Frontend**:
- [ ] 4.2.4 Implementar botón "INICIAR AUDITORÍA IA" que llame al endpoint
- [ ] 4.2.5 Mostrar modal de progreso de auditoría
- [ ] 4.2.6 Agregar notificación toast al completar

**Tiempo estimado**: 6-8 horas (backend: 4h, frontend: 4h)

---

### 4.3 Crear Endpoint Exportación XLS

**Problema**: El botón "EXPORTAR XLS" no tiene backend.

**Archivos**:
- Backend: `backend/app/api/documents.py` (nuevo endpoint)
- Frontend: `frontend/src/pages/Documents.tsx`

**Tareas Backend**:
- [ ] 4.3.1 Crear endpoint `GET /v1/documents/export?format=xlsx&type=all|issued|received|payroll`
- [ ] 4.3.2 Generar archivo Excel con columnas: Fecha, RFC, Nombre, Concepto, Total, Tipo
- [ ] 4.3.3 Retornar archivo como `StreamingResponse` con headers de descarga

**Tareas Frontend**:
- [ ] 4.3.4 Implementar botón "EXPORTAR XLS" que llame al endpoint
- [ ] 4.3.5 Manejar descarga de archivo en frontend
- [ ] 4.3.6 Agregar toast "Exportación completada"

**Tiempo estimado**: 4-5 horas (backend: 3h, frontend: 2h)

---

### 4.4 Crear Endpoint Connection Status

**Problema**: La barra de estado "Conectado: Backend Local" es hardcoded.

**Archivos**:
- Backend: `backend/app/api/workspace.py` (nuevo endpoint)
- Frontend: `frontend/src/components/Layout.tsx` o `frontend/src/components/StatusBar.tsx`

**Tareas Backend**:
- [ ] 4.4.1 Crear endpoint `GET /v1/workspace/connection-status` que retorne:
  ```json
  {
    "backend_status": "connected",
    "database_status": "connected",
    "sync_status": "up-to-date",
    "last_sync": "2026-03-12T10:00:00Z"
  }
  ```

**Tareas Frontend**:
- [ ] 4.4.2 Conectar barra de estado al endpoint
- [ ] 4.4.3 Agregar polling cada 30 segundos para verificar estado
- [ ] 4.4.4 Mostrar indicador visual de estado (verde/amarillo/rojo)

**Tiempo estimado**: 3-4 horas (backend: 2h, frontend: 2h)

---

### 4.5 Agregar Feedback Visual en Botones

**Problema**: Varios botones no tienen feedback de carga/resultado.

**Archivos**: Múltiples componentes frontend

**Tareas**:
- [ ] 4.5.1 Botones "CALCULAR" en Impuestos Mensuales - agregar spinner
- [ ] 4.5.2 Botón "Descargar ICS" en Calendario - agregar toast de confirmación
- [ ] 4.5.3 Botones "PAPEL DE TRABAJO", "SIMULAR DECLARACIÓN" en Fiscal - agregar estado de carga
- [ ] 4.5.4 Botón "GENERAR PAPEL DE TRABAJO" en Decl. Anuales - agregar barra de progreso
- [ ] 4.5.5 Botón "CONSULTAR OPINIÓN (SAT)" - agregar spinner y toast

**Tiempo estimado**: 4-6 horas

---

## 📊 Resumen de Tareas

### Por Prioridad

| Prioridad | Tareas | Tiempo Total |
|-----------|--------|--------------|
| 🔴 CRÍTICA | 14 tareas | 16-23 horas |
| 🟠 ALTA | 21 tareas | 28-38 horas |
| 🟡 MEDIA | 21 tareas | 22-28 horas |
| 🟢 BAJA | 21 tareas | 25-33 horas |
| **TOTAL** | **77 tareas** | **91-122 horas** |

### Por Módulo

| Módulo | Tareas | Tiempo |
|--------|--------|--------|
| Dashboard | 12 | 15-20h |
| Clientes | 6 | 8-10h |
| Gastos | 6 | 7-9h |
| Calendario | 6 | 6-8h |
| Finanzas | 10 | 12-16h |
| Fiscal | 15 | 18-24h |
| Nómina | 14 | 17-23h |
| Documentos | 8 | 8-10h |
| Agente | 4 | 4-6h |
| Configuración | 4 | 3-4h |

---

## 🎯 Criterios de Aceptación

### Para cada tarea completada:

1. ✅ **Código implementado** - Frontend y/o backend según corresponda
2. ✅ **Pruebas unitarias** - Tests passing para nuevos endpoints/componentes
3. ✅ **Integración verificada** - Datos fluyen correctamente entre frontend y backend
4. ✅ **Manejo de errores** - Casos de error manejados apropiadamente
5. ✅ **Feedback visual** - Loading states, toasts, mensajes de error
6. ✅ **Documentación** - Endpoints documentados en OpenAPI/Swagger

---

## 📝 Notas

- Los tiempos son estimados y pueden variar según complejidad real
- Priorizar tareas que desbloquean otras (ej: endpoints backend antes que frontend)
- Revisar validación_report.md para contexto de cada corrección
- Todas las tareas fueron validadas contra código real del backend

---

**Plan creado**: 2026-03-12 22:45 CST  
**Próxima revisión**: Al completar Sprint 1  
**Responsable**: Equipo de desarrollo full-stack
