# ✅ Checklist de Implementación - IDP Asistente Contable

**Creado**: 2026-03-12 | **Basado en**: ui_backend_analysis.json (100% preciso)

---

## 🔴 SPRITN 1 - CRÍTICO (1-2 días)

### 1.1 Estado de Resultados [ERROR CONTABLE]
- [ ] 1.1.1 Verificar frontend usa `type="P&L"` 
- [ ] 1.1.2 Mostrar estructura P&L correcta (Ingresos, Costos, Gastos, Utilidad)
- [ ] 1.1.3 Eliminar Activo/Pasivo/Capital de esta vista
- [ ] 1.1.4 Agregar prueba de coincidencia con backend
- **Archivo**: `frontend/src/pages/Finance.tsx`
- **Endpoint**: `GET /v1/finance/statements`
- **Tiempo**: ⏱️ 2-3h

### 1.2 Vista de Clientes
- [ ] 1.2.1 Agregar `GET /v1/clients`
- [ ] 1.2.2 Implementar filtrado por type (moral/física/prospecto)
- [ ] 1.2.3 Mostrar tabla con columnas completas
- [ ] 1.2.4 Agregar estado de carga y errores
- [ ] 1.2.5 Implementar búsqueda RFC/nombre
- [ ] 1.2.6 Botón "Registrar" → `POST /v1/clients`
- **Archivo**: `frontend/src/pages/Clients.tsx`
- **Tiempo**: ⏱️ 4-6h

### 1.3 Vista de Gastos
- [ ] 1.3.1 Agregar `GET /v1/expenses/pending`
- [ ] 1.3.2 Filtrar deducibles (`is_deductible=true`)
- [ ] 1.3.3 Filtrar no deducibles (`is_deductible=false`)
- [ ] 1.3.4 Mostrar lista completa de gastos
- [ ] 1.3.5 Badges de estado "Deducible" / "No Deducible"
- [ ] 1.3.6 Botón para reclasificar gasto
- **Archivo**: `frontend/src/pages/Expenses.tsx`
- **Tiempo**: ⏱️ 4-6h

### 1.4 Calendario Fiscal
- [ ] 1.4.1 `GET /v1/workspace/calendar` al montar
- [ ] 1.4.2 Mostrar eventos en formato calendario
- [ ] 1.4.3 CRUD completo (crear, editar, eliminar, completar)
- [ ] 1.4.4 Botón "Descargar ICS" funcional
- [ ] 1.4.5 Toast notification al descargar
- [ ] 1.4.6 Eventos auto-generados calendario mexicano
- **Archivo**: `frontend/src/components/Calendar.tsx`
- **Tiempo**: ⏱️ 6-8h

---

## 🟠 SPRINT 2 - ALTO (3-5 días)

### 2.1 Endpoint PTU Calculation
**Backend**:
- [ ] 2.1.1 Modelo `PTUCalculation`
- [ ] 2.1.2 `GET /v1/payroll/ptu-calculation`
- [ ] 2.1.3 Calcular PTU desde utilidad fiscal
- [ ] 2.1.4 `POST /v1/payroll/ptu-calculation` (generar proyecto)

**Frontend**:
- [ ] 2.1.5 Conectar vista PTU
- [ ] 2.1.6 Mostrar monto consistente con criterios
- [ ] 2.1.7 Tooltip distribución 50%/50%
- [ ] 2.1.8 Botón "Generar Proyecto de Reparto"
- **Tiempo**: ⏱️ 6-8h

### 2.2 Endpoint IMSS Settlement
**Backend**:
- [ ] 2.2.1 `GET /v1/payroll/monthly-settlement`
- [ ] 2.2.2 Calcular cuotas IMSS
- [ ] 2.2.3 Calcular retención INFONAVIT

**Frontend**:
- [ ] 2.2.4 Conectar vista SUA/IMSS
- [ ] 2.2.5 Selector de periodo
- [ ] 2.2.6 Fecha última sincronización
- [ ] 2.2.7 Instrucciones archivo .SUA
- **Tiempo**: ⏱️ 5-7h

### 2.3 Configuración Usuario
- [ ] 2.3.1 `GET /v1/users/me` (cargar perfil)
- [ ] 2.3.2 `GET /v1/users/me/settings` (configuración)
- [ ] 2.3.3 `PUT /v1/users/me/settings` (guardar)
- [ ] 2.3.4 `PUT /v1/users/me` (actualizar perfil)
- [ ] 2.3.5 Feedback visual "Guardando..."
- [ ] 2.3.6 Validación de campos
- **Archivo**: `frontend/src/pages/Settings.tsx`
- **Tiempo**: ⏱️ 3-4h

### 2.4 Finanzas - Resumen
- [ ] 2.4.1 `GET /v1/finance/summary`
- [ ] 2.4.2 Mostrar KPIs (Margen, EBITDA, Liquidez, Saldos)
- [ ] 2.4.3 Estado de carga
- [ ] 2.4.4 Manejar datos vacíos
- [ ] 2.4.5 Conectar "Estados Financieros Maestro"
- [ ] 2.4.6 Gráficas con `GET /v1/finance/chart-data`
- **Archivo**: `frontend/src/pages/Finance.tsx`
- **Tiempo**: ⏱️ 4-6h

### 2.5 Endpoint CFDI Stats
**Backend**:
- [ ] 2.5.1 `GET /v1/documents/cfdi-stats`
- [ ] 2.5.2 Calcular conteos desde DB

**Frontend**:
- [ ] 2.5.3 Conectar vista "Reportes CFDI"
- [ ] 2.5.4 Tooltip "2 PENDIENTES"
- [ ] 2.5.5 Fecha última sincronización
- [ ] 2.5.6 Badge de estado
- **Tiempo**: ⏱️ 4-5h

### 2.6 Impuestos Mensuales
- [ ] 2.6.1 Selector periodo fiscal global
- [ ] 2.6.2 Botón CALCULAR IVA → `POST /v1/fiscal/calculate-taxes`
- [ ] 2.6.3 Botón CALCULAR ISR Retenciones
- [ ] 2.6.4 Botón CALCULAR ISR Propio
- [ ] 2.6.5 Botón CALCULAR IEPS
- [ ] 2.6.6 Spinner durante cálculo
- [ ] 2.6.7 Diferenciar estados (Pendiente/Calculado/Pagar)
- [ ] 2.6.8 Mostrar resultados
- **Tiempo**: ⏱️ 6-8h

---

## 🟡 SPRINT 3 - MEDIO (5-8 días)

### 3.1 Endpoint SAT Opinion
**Backend**:
- [ ] 3.1.1 `POST /v1/fiscal/consult-sat-opinion`
- [ ] 3.1.2 `GET /v1/fiscal/compliance-opinion/history`

**Frontend**:
- [ ] 3.1.3 Botón "Consultar Opinión (SAT)"
- [ ] 3.1.4 Botón "Actualizar ahora"
- [ ] 3.1.5 Timestamp absoluto y relativo
- [ ] 3.1.6 Modal "Historial de Consultas"
- **Tiempo**: ⏱️ 5-7h

### 3.2 Endpoint Coeficiente CU
**Backend**:
- [ ] 3.2.1 `POST /v1/fiscal/calculate-cu`
- [ ] 3.2.2 `PUT /v1/fiscal/cu` (guardar)

**Frontend**:
- [ ] 3.2.3 Botón "Editar" valores
- [ ] 3.2.4 Mostrar fórmula
- [ ] 3.2.5 Validar cálculo
- [ ] 3.2.6 Nota fiscal dinámica
- **Tiempo**: ⏱️ 4-6h

### 3.3 Métricas IA
**Backend**:
- [ ] 3.3.1 Agregar campos a `GET /v1/workspace/metrics`
- [ ] 3.3.2 Calcular desde tabla documents

**Frontend**:
- [ ] 3.3.3 Conectar vista "Métricas IA"
- [ ] 3.3.4 Tooltips explicativos
- [ ] 3.3.5 Nota dinámica "Basado en X documentos"
- **Tiempo**: ⏱️ 3-4h

### 3.4 Agente Fiscal - Estado
**Backend**:
- [ ] 3.4.1 `GET /v1/agent/status`
- [ ] 3.4.2 `GET /v1/agent/tools`

**Frontend**:
- [ ] 3.4.3 Conectar estado "CONECTADO"
- [ ] 3.4.4 Mostrar tools reales
- [ ] 3.4.5 Indicador de actividad
- **Tiempo**: ⏱️ 3-4h

### 3.5 Traducir Inglés → Español
- [ ] 3.5.1 "EXPIRE IN 5D" → "EXPIRA EN 5D"
- [ ] 3.5.2 "READY TO DEC" → "LISTO PARA DECLARAR"
- [ ] 3.5.3 Revisar todo el frontend
- [ ] 3.5.5 Verificación CI/CD
- **Tiempo**: ⏱️ 2-3h

### 3.6 Contadores en Filtros
**Backend**:
- [ ] 3.6.1 `GET /v1/documents/count`

**Frontend**:
- [ ] 3.6.2 Contador en "Facturas Emitidas"
- [ ] 3.6.3 Contador en "Facturas Recibidas"
- [ ] 3.6.4 Contador en "Nóminas"
- [ ] 3.6.5 Actualizar al filtrar
- **Tiempo**: ⏱️ 3-4h

---

## 🟢 SPRINT 4 - BAJO (8-12 días)

### 4.1 Modelo Incidencias
**Backend**:
- [ ] 4.1.1 Modelo `Incidence` en `models.py`
- [ ] 4.1.2 CRUD `/v1/payroll/incidences`

**Frontend**:
- [ ] 4.1.3 Vista de incidencias con tabla
- [ ] 4.1.4 Botón "Añadir Registro" + modal
- [ ] 4.1.5 Tipos de incidencia
- [ ] 4.1.6 Mensaje "Sin incidencias"
- **Tiempo**: ⏱️ 8-10h

### 4.2 Endpoint Auditoría IA
**Backend**:
- [ ] 4.2.1 `POST /v1/workspace/start-audit`
- [ ] 4.2.2 `GET /v1/workspace/audit/{id}/status`
- [ ] 4.2.3 Usar `audit_engine`

**Frontend**:
- [ ] 4.2.4 Botón "INICIAR AUDITORÍA IA"
- [ ] 4.2.5 Modal de progreso
- [ ] 4.2.6 Toast al completar
- **Tiempo**: ⏱️ 6-8h

### 4.3 Endpoint Exportar XLS
**Backend**:
- [ ] 4.3.1 `GET /v1/documents/export?format=xlsx`
- [ ] 4.3.2 Generar Excel
- [ ] 4.3.3 StreamingResponse

**Frontend**:
- [ ] 4.3.4 Botón "EXPORTAR XLS"
- [ ] 4.3.5 Manejar descarga
- [ ] 4.3.6 Toast "Exportación completada"
- **Tiempo**: ⏱️ 4-5h

### 4.4 Endpoint Connection Status
**Backend**:
- [ ] 4.4.1 `GET /v1/workspace/connection-status`

**Frontend**:
- [ ] 4.4.2 Conectar barra de estado
- [ ] 4.4.3 Polling cada 30s
- [ ] 4.4.4 Indicador visual (verde/amarillo/rojo)
- **Tiempo**: ⏱️ 3-4h

### 4.5 Feedback Visual en Botones
- [ ] 4.5.1 Botones "CALCULAR" - spinner
- [ ] 4.5.2 Botón "Descargar ICS" - toast
- [ ] 4.5.3 Botones Fiscal - estado de carga
- [ ] 4.5.4 Botón "GENERAR PAPEL DE TRABAJO" - barra progreso
- [ ] 4.5.5 Botón "CONSULTAR OPINIÓN (SAT)" - spinner + toast
- **Tiempo**: ⏱️ 4-6h

---

## 📊 Progreso

### Sprint 1 - CRÍTICO
- [ ] 1.1 Estado de Resultados
- [ ] 1.2 Clientes
- [ ] 1.3 Gastos
- [ ] 1.4 Calendario
**Total**: 0/4 completados

### Sprint 2 - ALTO
- [ ] 2.1 PTU Calculation
- [ ] 2.2 IMSS Settlement
- [ ] 2.3 Configuración
- [ ] 2.4 Finanzas
- [ ] 2.5 CFDI Stats
- [ ] 2.6 Impuestos
**Total**: 0/6 completados

### Sprint 3 - MEDIO
- [ ] 3.1 SAT Opinion
- [ ] 3.2 Coeficiente CU
- [ ] 3.3 Métricas IA
- [ ] 3.4 Agente Fiscal
- [ ] 3.5 Traducción
- [ ] 3.6 Contadores
**Total**: 0/6 completados

### Sprint 4 - BAJO
- [ ] 4.1 Incidencias
- [ ] 4.2 Auditoría IA
- [ ] 4.3 Exportar XLS
- [ ] 4.4 Connection Status
- [ ] 4.5 Feedback Visual
**Total**: 0/5 completados

---

## 📈 Métricas

| Métrica | Valor |
|---------|-------|
| **Total Tareas** | 77 |
| **Completadas** | 0 |
| **En Progreso** | 0 |
| **Pendientes** | 77 |
| **Tiempo Total** | 91-122 horas |
| **Avance** | 0% |

---

## 🎯 Próximas Tareas (Esta Semana)

1. [ ] 1.1 Corregir Estado de Resultados (🔴 CRÍTICA)
2. [ ] 1.2 Conectar Clientes (🔴 CRÍTICA)
3. [ ] 1.3 Conectar Gastos (🔴 CRÍTICA)
4. [ ] 1.4 Conectar Calendario (🔴 CRÍTICA)

---

**Última actualización**: 2026-03-12 22:45 CST  
**Próxima revisión**: Diario a las 9:00 AM
