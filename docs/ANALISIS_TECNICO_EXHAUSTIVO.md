# 📊 Análisis Técnico Exhaustivo del Plan de Implementación
## IDP-App - Asistente Contable con IA para México

**Fecha:** 10 de marzo de 2026  
**Versión:** 1.0  
**Estado:** ✅ Listo para implementación  
**Fase Actual:** 7 completada (Backend + Frontend integrados)  
**Próximas Fases:** 8-12 (Automatización crítica + Producción)

---

## 📋 Tabla de Contenidos

1. [Matriz de Trazabilidad Completa](#1-matriz-de-trazabilidad-completa)
2. [Análisis de Brechas (Gap Analysis)](#2-análisis-de-brechas-gap-analysis)
3. [Especificación Técnica de Funcionalidades Pendientes](#3-especificación-técnica-de-funcionalidades-pendientes)
4. [Arquitectura de IA Detallada](#4-arquitectura-de-ia-detallada)
5. [Plan de Implementación Detallado por Fases (8-12)](#5-plan-de-implementación-detallado-por-fases-8-12)
6. [Especificación de UI/UX Detallada](#6-especificación-de-uiux-detallada)
7. [Matriz de Riesgos Técnica](#7-matriz-de-riesgos-técnica)
8. [KPIs Técnicos Detallados](#8-kpis-técnicos-detallados)
9. [Estrategia de Testing](#9-estrategia-de-testing)
10. [Checklist de Producción](#10-checklist-de-producción)

---

## 1. Matriz de Trazabilidad Completa

### 1.1 Módulo 1: IDP (Procesamiento Inteligente de Documentos)

| Funcionalidad | Actividad Contador | Estado | Prioridad | Esfuerzo | Dependencias | Endpoints | Componentes UI |
|---------------|-------------------|--------|-----------|----------|--------------|-----------|----------------|
| **OCR de CFDI (XML/PDF)** | Captura de facturas (3-5 hrs/sem) | ✅ 80% | 🔴 Crítica | M | NVIDIA NIM OCR | `POST /v1/idp/upload` | `Documents.tsx` |
| **Clasificación contable automática** | Clasificación de gastos (2-4 hrs/sem) | 🔄 40% | 🔴 Crítica | M | OCR completado | `POST /v1/idp/classify` | `DocumentClassifier.tsx` ⚠️ Nuevo |
| **Validación CFDI vs SAT** | Verificación de deducibilidad | 🔄 30% | 🔴 Crítica | M | OCR + RFC emisor | `GET /v1/idp/validate/{uuid}` | `CFDIValidator.tsx` ⚠️ Nuevo |
| **Detección lista 69-B EFO** | Prevención de multas ($19k-$58k) | ❌ 0% | 🔴 Crítica | S | Validación SAT | `GET /v1/idp/efo-check/{rfc}` | `EFOChecker.tsx` ⚠️ Nuevo |
| **Extracción de campos CFDI 4.0** | Registro automático de pólizas | ✅ 75% | 🔴 Crítica | S | NVIDIA NIM Table | `GET /v1/idp/{id}/extract` | `Documents.tsx` |
| **Sugerencia de cuenta contable** | Automatización de registro | 🔄 50% | 🟡 Alta | M | Clasificación ML | `GET /v1/idp/{id}/account-suggestion` | `DocumentClassifier.tsx` ⚠️ Nuevo |
| **Batch processing (100+ docs)** | Procesamiento masivo para despachos | ✅ 60% | 🟡 Alta | L | OCR + cola Redis | `POST /v1/idp/batch-upload` | `Documents.tsx` (multi-select) |

### 1.2 Módulo 2: Conciliación Inteligente (Matching Engine)

| Funcionalidad | Actividad Contador | Estado | Prioridad | Esfuerzo | Dependencias | Endpoints | Componentes UI |
|---------------|-------------------|--------|-----------|----------|--------------|-----------|----------------|
| **Upload de estados de cuenta** | Conciliación bancaria (1-2 hrs/cliente) | ❌ 0% | 🔴 Crítica | M | Parser bancario | `POST /v1/reconciliation/upload-bank-statement` | `BankStatementUpload.tsx` ⚠️ Nuevo |
| **Fuzzy matching (monto + fecha)** | Identificación de pagos | ❌ 0% | 🔴 Crítica | L | IDP completado | `GET /v1/reconciliation/matches` | `MatchingTable.tsx` ⚠️ Nuevo |
| **LLM validation de matches** | Validación de conceptos bancarios | ❌ 0% | 🔴 Crítica | L | Fuzzy matching | `POST /v1/reconciliation/confirm-match` | `MatchingTable.tsx` ⚠️ Nuevo |
| **Detección de facturas faltantes** | Alertas de no deducibilidad | ❌ 0% | 🔴 Crítica | M | Matching completado | `GET /v1/reconciliation/missing-invoices` | `UnmatchedAlerts.tsx` ⚠️ Nuevo |
| **Detección de pagos sin factura** | Control de ingresos no registrados | ❌ 0% | 🔴 Crítica | M | Matching completado | `GET /v1/reconciliation/unmatched-payments` | `UnmatchedAlerts.tsx` ⚠️ Nuevo |
| **Matching de pagos parciales** | CFDI con pagos múltiples | ❌ 0% | 🟡 Alta | L | Matching engine | `GET /v1/reconciliation/partial-matches` | `MatchingTable.tsx` ⚠️ Nuevo |
| **Histórico de conciliaciones** | Aprendizaje de patrones | ❌ 0% | 🟢 Media | M | Matching + DB | `GET /v1/reconciliation/history` | `MatchingTable.tsx` (tab history) |

### 1.3 Módulo 3: Workflows de Negocio (LangGraph)

| Funcionalidad | Actividad Contador | Estado | Prioridad | Esfuerzo | Dependencias | Endpoints | Componentes UI |
|---------------|-------------------|--------|-----------|----------|--------------|-----------|----------------|
| **Cierre mensual automatizado** | Cierre contable (3-5 hrs/cliente) | ❌ 0% | 🟡 Alta | XL | IDP + Conciliación | `POST /v1/workflows/monthly-close/start` | `WorkflowProgress.tsx` ⚠️ Nuevo |
| **Declaración mensual ISR/IVA** | Presentación de declaraciones (30 min/cliente) | ❌ 0% | 🟡 Alta | XL | Cálculo impuestos | `POST /v1/workflows/monthly-declaration/prepare` | `WorkflowProgress.tsx` ⚠️ Nuevo |
| **Declaración anual (HITL)** | Declaración anual (2-8 hrs/cliente) | ❌ 0% | 🟡 Alta | XL | Todas las anteriores | `POST /v1/workflows/annual-declaration/prepare` | `WorkflowProgress.tsx` ⚠️ Nuevo |
| **Contabilidad electrónica SAT** | Envío de balanza al SAT | ❌ 0% | 🟡 Alta | L | Cierre mensual | `POST /v1/workflows/e-accounting/submit` | `WorkflowProgress.tsx` ⚠️ Nuevo |
| **Estado de workflows activos** | Monitoreo de procesos | 🔄 30% | 🟡 Alta | S | LangGraph base | `GET /v1/workflows/{id}/status` | `AgentStatus.tsx` ⚠️ Nuevo |
| **Pausa y aprobación humana** | Validación antes de envío | 🔄 40% | 🟡 Alta | M | LangGraph HITL | `POST /v1/workflows/{id}/approve` | `WorkflowProgress.tsx` ⚠️ Nuevo |

### 1.4 Módulo 4: Asistente Conversacional (RAG)

| Funcionalidad | Actividad Contador | Estado | Prioridad | Esfuerzo | Dependencias | Endpoints | Componentes UI |
|---------------|-------------------|--------|-----------|----------|--------------|-----------|----------------|
| **RAG Legal (LISR, LIVA, CFF)** | Asesoría fiscal (1 hr/sesión) | ✅ 70% | 🟡 Alta | S | ChromaDB + NIM | `POST /v1/chat/stream` | `Chat.tsx` |
| **RAG Documentos del cliente** | Consultas sobre datos propios | ✅ 60% | 🟡 Alta | S | Multi-tenant DB | `POST /v1/chat/stream` | `Chat.tsx` |
| **Citas de fuentes legales** | Fundamentación de respuestas | ✅ 65% | 🟡 Alta | S | Reranker NIM | `POST /v1/chat/stream` | `Chat.tsx` (citation viewer) |
| **Auto-update de leyes (Watcher DOF)** | Actualización normativa | ❌ 0% | 🟡 Alta | M | RAG base | `POST /v1/rag/update-laws` | `Settings.tsx` (law update section) ⚠️ Nuevo |
| **Query expansion legal** | Traducción a términos legales | 🔄 50% | 🟡 Alta | M | RAG base | `POST /v1/chat/stream` | `Chat.tsx` |
| **Modo dual (Legal vs Datos)** | Respuestas contextuales | 🔄 40% | 🟡 Alta | M | Router LangGraph | `POST /v1/chat/stream` | `Chat.tsx` (mode indicator) |

### 1.5 Módulo 5: Análisis Predictivo y Alertas

| Funcionalidad | Actividad Contador | Estado | Prioridad | Esfuerzo | Dependencias | Endpoints | Componentes UI |
|---------------|-------------------|--------|-----------|----------|--------------|-----------|----------------|
| **Forecasting de IVA** | Proyección de impuestos a pagar | ❌ 0% | 🟡 Alta | L | Histórico financiero | `GET /v1/analytics/tax-forecast` | `TaxForecastChart.tsx` ⚠️ Nuevo |
| **Forecasting de ISR** | Proyección anual de ISR | ❌ 0% | 🟡 Alta | L | Histórico + coeficiente | `GET /v1/analytics/tax-forecast` | `TaxForecastChart.tsx` ⚠️ Nuevo |
| **Tax Health Score (semáforo)** | Evaluación de riesgo fiscal | ❌ 0% | 🟡 Alta | M | Múltiples factores | `GET /v1/analytics/health-score` | `TaxHealthScore.tsx` ⚠️ Nuevo |
| **Detección de riesgo EFO** | Alerta de proveedores en lista negra | ❌ 0% | 🔴 Crítica | M | Lista 69-B + IDP | `GET /v1/analytics/efo-alerts` | `TaxHealthScore.tsx` ⚠️ Nuevo |
| **Alertas de vencimientos** | Recordatorio de obligaciones | ❌ 0% | 🟡 Alta | S | Calendario fiscal | `GET /v1/analytics/deadline-alerts` | `Dashboard.tsx` (alerts panel) ⚠️ Nuevo |
| **Proyección de flujo de caja** | Forecast de liquidez | ❌ 0% | 🟡 Alta | L | Conciliación + histórico | `GET /v1/analytics/cash-flow` | `CashFlowChart.tsx` ⚠️ Nuevo |
| **Detección de discrepancia fiscal** | Diferencia ingresos vs depósitos | ❌ 0% | 🟡 Alta | M | Bancos + Facturación | `GET /v1/analytics/discrepancy-check` | `TaxHealthScore.tsx` ⚠️ Nuevo |

### 1.6 Módulo 6: Agentes Autónomos

| Funcionalidad | Actividad Contador | Estado | Prioridad | Esfuerzo | Dependencias | Endpoints | Componentes UI |
|---------------|-------------------|--------|-----------|----------|--------------|-----------|----------------|
| **Agente Descargador SAT** | Descarga masiva de XML | ❌ 0% | 🟢 Media | XL | Scraping SAT | `POST /v1/agents/sat/download-xmls` | `AgentStatus.tsx` ⚠️ Nuevo |
| **Agente de Nómina** | Cálculo de percepciones/deducciones | ❌ 0% | 🟡 Alta | XL | IMSS/INFONAVIT calc | `POST /v1/agents/payroll/calculate` | `PayrollCalculator.tsx` ⚠️ Nuevo |
| **Agente de Notificación** | Emails a clientes por faltantes | ❌ 0% | 🟢 Media | M | Matching + Email | `POST /v1/agents/notifications/send` | `Settings.tsx` (notification config) ⚠️ Nuevo |
| **Agente Auditor** | Revisión continua de operaciones | ❌ 0% | 🟢 Media | L | Reglas de auditoría | `POST /v1/agents/auditor/start` | `AgentStatus.tsx` ⚠️ Nuevo |
| **Estado de agentes** | Monitoreo de actividad | 🔄 30% | 🟡 Alta | S | LangGraph | `GET /v1/agents/status` | `AgentStatus.tsx` ⚠️ Nuevo |
| **Timbrado de nómina CFDI** | Generación de recibos timbrados | ❌ 0% | 🟡 Alta | XL | Agente nómina + PAC | `POST /v1/agents/payroll/stamp` | `PayrollCalculator.tsx` ⚠️ Nuevo |

### 1.7 Módulo 7: Arquitectura Multi-tenant

| Funcionalidad | Actividad Contador | Estado | Prioridad | Esfuerzo | Dependencias | Endpoints | Componentes UI |
|---------------|-------------------|--------|-----------|----------|--------------|-----------|----------------|
| **Aislamiento de datos por tenant** | Gestión de múltiples clientes | ✅ 60% | 🔴 Crítica | M | PostgreSQL RLS | Todos los endpoints (tenant_id) | `Clients.tsx` (selector) |
| **Gestión de clientes (CRUD)** | Alta/baja de clientes en despacho | ✅ 70% | 🔴 Crítica | S | Multi-tenant DB | `GET/POST/PUT /v1/clients` | `Clients.tsx` |
| **Roles y permisos** | Control de acceso (Socio, Contador, Auxiliar) | 🔄 40% | 🟡 Alta | M | Auth JWT | `GET/POST /v1/users/roles` | `Settings.tsx` (user management) ⚠️ Nuevo |
| **Namespacing en ChromaDB** | Aislamiento vectorial | ✅ 50% | 🔴 Crítica | S | ChromaDB collections | Interno (servicios RAG) | N/A |
| **Límites de consumo por plan** | Control de tier (standard/enterprise) | ❌ 0% | 🟡 Alta | M | Multi-tenant base | `GET /v1/tenants/usage` | `Settings.tsx` (usage meter) ⚠️ Nuevo |
| **Facturación y billing** | Cobro por cliente/usuario | ❌ 0% | 🟢 Media | L | Límites de consumo | `GET /v1/billing/invoices` | `Settings.tsx` (billing tab) ⚠️ Nuevo |

---

## 2. Análisis de Brechas (Gap Analysis)

### 2.1 Documento 01-Blueprint.md

| Aspecto del Plan | Implementado | Parcial | Faltante | Discrepancias | Recomendaciones |
|-----------------|--------------|---------|----------|---------------|-----------------|
| **Arquitectura microservicios** | ✅ FastAPI + LangGraph | - | - | Ninguna | Mantener arquitectura actual |
| **NVIDIA NIM (4 modelos)** | ✅ LLM + Embeddings + Reranker + OCR | - | ⚠️ Table Extraction | Falta integrar NIM Table Extraction explícitamente | Agregar endpoint específico para table extraction en IDP |
| **LangGraph orquestador** | ✅ Base implementada | ⚠️ Workflows complejos | - | Workflows de negocio (cierre, nómina) no implementados | Priorizar Fase 11 para workflows |
| **Streaming SSE** | ✅ Implementado 90% | - | - | Ninguna | Completar optimización de latencia (<800ms TTFT) |
| **Worker OCR asíncrono** | 🔄 Parcialmente | - | ⚠️ Celery/Redis | No hay cola de tareas asíncronas implementada | Implementar Celery en Fase 8 para batch processing |
| **Traza de auditoría IA** | ❌ No implementado | - | - | Tabla `ai_audit_logs` del blueprint no existe | Crear modelo SQLAlchemy y logging en Fase 9 |

### 2.2 Documento 02-Specs.md (7 Módulos)

| Módulo | Implementado | Parcial | Faltante | Discrepancias | Recomendaciones |
|--------|--------------|---------|----------|---------------|-----------------|
| **Módulo 1: IDP** | ✅ OCR básico (80%) | ⚠️ Clasificación (40%) | ❌ Validación SAT, 69-B | Plan menciona "destilled model" para clasificación, no implementado | Usar `nvidia/nemotron-4-min-8b` para clasificación rápida en Fase 9 |
| **Módulo 2: Conciliación** | ❌ No implementado | - | ❌ Todo | Fuzzy logic + LLM matching no comenzado | Prioridad CRÍTICA - Fase 9 |
| **Módulo 3: Workflows** | 🔄 LangGraph base (30%) | - | ❌ Workflows de negocio | Solo hay estructura, no workflows definidos | Definir 3 workflows en Fase 11: cierre, declaración, nómina |
| **Módulo 4: RAG** | ✅ Legal (70%) | ⚠️ Modo dual (40%) | ❌ Auto-update | Watcher DOF no implementado | Implementar en Fase 10 con cron job semanal |
| **Módulo 5: Predictivo** | ❌ No implementado | - | ❌ Todo | Prophet/LightGBM no integrados | Fase 10 - comenzar con Prophet (más simple) |
| **Módulo 6: Agentes** | ❌ No implementado | - | ❌ Todo | Ningún agente autónomo implementado | Fase 11 - comenzar con Agente de Nómina (mayor ROI) |
| **Módulo 7: Multi-tenant** | ✅ Esquema básico (60%) | ⚠️ Roles (40%) | ❌ Billing | Aislamiento de datos funcional, falta gestión de roles | Completar roles en Fase 8, billing en Fase 12 |

### 2.3 Documento 03-Diagrams.md

| Elemento | Implementado | Discrepancias | Acciones Requeridas |
|----------|--------------|---------------|---------------------|
| **Grafo LangGraph (diagrama)** | 🔄 Parcial | El diagrama muestra nodos que no existen (SAT_Check, Human_Loop) | Actualizar diagrama o implementar nodos faltantes |
| **Tabla `tenants`** | ✅ Implementada | - | Verificar columnas: `plan_tier`, `api_key_vault_ref` |
| **Tabla `documents`** | ✅ Implementada | ⚠️ Faltan campos: `clv_prod_serv`, `deducibility_score`, `accounting_account_suggested` | Agregar campos en migración Fase 9 |
| **Tabla `ai_audit_logs`** | ❌ No existe | - | Crear en Fase 9 para trazabilidad de decisiones IA |
| **Endpoints core** | 🔄 60% | Faltan endpoints de conciliación, predictivo, agentes | Ver sección 3 de este documento |
| **WebSocket para OCR** | ❌ No implementado | Plan menciona WebSocket, actual usa polling SSE | Evaluar migración a WebSocket en Fase 8 |

### 2.4 Documento 04-Intake_Pipeline_and_RAG.md

| Componente | Implementado | Discrepancias | Acciones Requeridas |
|------------|--------------|---------------|---------------------|
| **Fuentes de datos (LISR, LIVA, CFF, RMF)** | ✅ 70% | ⚠️ RMF no completamente cargada | Completar ingesta de RMF 2026 en Fase 8 |
| **Chunking semántico (800-1000 tokens)** | ✅ Implementado | - | Verificar overlap de 150 tokens en tests |
| **Metadatos por chunk** | 🔄 Parcial | ⚠️ Faltan: `fraccion`, `vigencia` | Agregar en migración de colecciones ChromaDB |
| **Query expansion** | 🔄 50% | No hay reescritura de consultas legal | Implementar en Fase 9 con LLM router |
| **Reranker (Top 20 → Top 5)** | ✅ Implementado | - | Monitorear métrica de relevancia en producción |
| **Colección `normativa_fiscal`** | ✅ Implementada | - | Verificar aislamiento multi-tenant |
| **Colección `tenant_documents_{id}`** | ✅ Implementada | - | Implementar namespacing correcto |
| **Watcher DOF** | ❌ No implementado | - | Fase 10 - cron job semanal + alertas |

### 2.5 Documento 05-Intelligence_Module.md

| Componente | Implementado | Discrepancias | Acciones Requeridas |
|------------|--------------|---------------|---------------------|
| **Capa heurística (Exact Match)** | ❌ No implementada | - | Fase 9 - implementar matching por monto/fecha/RFC |
| **Capa Fuzzy Logic (Levenshtein)** | ❌ No implementada | - | Fase 9 - usar `python-Levenshtein` o `fuzzywuzzy` |
| **Capa LLM Validation (NIM)** | ❌ No implementada | - | Fase 9 - usar `llama-3.3-70b-instruct` para validación |
| **Detección de facturas sin pago** | ❌ No implementada | - | Fase 9 - query de documentos sin match bancario |
| **Detección de pagos sin factura** | ❌ No implementada | - | Fase 9 - query de movimientos bancarios sin CFDI |
| **Clasificación de flujo de caja** | ❌ No implementada | - | Fase 9 - categorías: Operativo, Inversión, Financiamiento |

### 2.6 Documento 06-Agents_and_Workflows.md

| Componente | Implementado | Discrepancias | Acciones Requeridas |
|------------|--------------|---------------|---------------------|
| **Patrón HITL (Pausa y Aprobación)** | 🔄 40% | LangGraph tiene base, no hay UI de aprobación | Fase 11 - implementar nodos de pausa + UI |
| **Agente Descargador** | ❌ No implementado | - | Fase 11 - scraping SAT con Playwright/Selenium |
| **Agente de Nómina** | ❌ No implementado | - | Fase 11 - cálculos IMSS, INFONAVIT, ISR |
| **Agente de Notificación** | ❌ No implementado | - | Fase 11 - integración con SendGrid/Resend |
| **Reintento exponencial** | ❌ No implementado | - | Fase 8 - implementar backoff en servicios externos |
| **Estado BLOCKED + ticket** | ❌ No implementado | - | Fase 8 - sistema de alertas para intervención humana |

### 2.7 Documento 07-Predictive_Dashboard_and_Fiscal_Health.md

| Componente | Implementado | Discrepancias | Acciones Requeridas |
|------------|--------------|---------------|---------------------|
| **Forecasting de IVA** | ❌ No implementado | - | Fase 10 - Prophet con histórico de IVA mensual |
| **Forecasting de ISR** | ❌ No implementado | - | Fase 10 - coeficiente de utilidad + proyección anual |
| **Riesgo EFO (lista 69-B)** | ❌ No implementado | - | Fase 9 - check de RFCs de proveedores contra lista SAT |
| **Opinión de cumplimiento** | ❌ No implementado | - | Fase 10 - integración con API SAT (opinión positiva/negativa) |
| **Discrepancia fiscal** | ❌ No implementado | - | Fase 10 - comparación ingresos declarados vs depósitos |

### 2.8 Documento 08-Testing_and_Validation_Plan_(QA).md

| Tipo de Test | Implementado | Discrepancias | Acciones Requeridas |
|--------------|--------------|---------------|---------------------|
| **Unit Testing (Pytest)** | 🔄 40% | Algunos servicios tienen tests, no todos | Fase 8 - alcanzar 80% de cobertura |
| **AI Validation (RAGAS)** | ❌ No implementado | - | Fase 8 - integrar RAGAS para evaluar RAG |
| **Integration Testing** | 🔄 30% | Tests básicos de API, faltan flujos completos | Fase 8 - tests de integración DB + API + NIM |
| **E2E Testing (Playwright)** | ❌ No implementado | - | Fase 8 - implementar Playwright (ya está en package.json) |
| **Security/PenTest (OWASP)** | ❌ No implementado | - | Fase 12 - pentest profesional antes de producción |
| **Golden Dataset (200 CFDI)** | ❌ No implementado | - | Fase 9 - crear dataset de prueba con XML reales |
| **Pruebas de carga (20 concurrentes)** | ❌ No implementado | - | Fase 12 - locust.io o k6 para load testing |

### 2.9 Documento 09-Application_Screen_Gallery.md

| Pantalla | Implementada | Discrepancias | Acciones Requeridas |
|----------|--------------|---------------|---------------------|
| **Workspace Central (Dashboard + Chat)** | ✅ 80% | Faltan KPIs predictivos en dashboard | Fase 10 - agregar TaxHealthScore y forecasting |
| **Vista Contextual (Split Screen IDP)** | 🔄 60% | Visualizador PDF básico, falta análisis IA | Fase 9 - panel de auditoría de IA con confidence score |
| **Vista de Agentes y Workflows** | ❌ 20% | No existe UI de estado de agentes | Fase 11 - crear `AgentStatus.tsx` y `WorkflowProgress.tsx` |
| **Vista RAG (Búsqueda Legal)** | 🔄 50% | Chat muestra respuestas, faltan citas visuales | Fase 9 - panel lateral de fuentes legales con highlight |

### 2.10 Documento 10-Infrastructure_and_Costs.md

| Aspecto | Implementado | Discrepancias | Acciones Requeridas |
|---------|--------------|---------------|---------------------|
| **NIM Develop (40 RPM)** | ✅ Configurado | - | Monitorear rate limits en producción |
| **CPU-only (desarrollo)** | ✅ Funcional | - | Documentar limitaciones de performance |
| **RTX 4090 (piloto)** | ❌ No adquirido | - | Fase 2 - adquirir GPU para piloto producción |
| **H100 Cloud (producción)** | ❌ No provisionado | - | Fase 3 - evaluar AWS/Azure según demanda |
| **Rate limiting** | ❌ No implementado | - | Fase 8 - implementar throttling en endpoints |
| **Monitoring (Prometheus + Grafana)** | ❌ No implementado | - | Fase 12 - stack de monitoreo completo |
| **Backup automatizado** | 🔄 Parcial | PostgreSQL tiene backup, ChromaDB no | Fase 8 - backup diario de ChromaDB + S3 |

---

## 3. Especificación Técnica de Funcionalidades Pendientes

### 3.1 Conciliación Bancaria (Fase 9 - CRÍTICA)

#### A. Especificación Backend

```markdown
### Conciliación Bancaria - Matching Engine

- **Endpoint(s):**
  - `POST /v1/reconciliation/upload-bank-statement` - Subir estado de cuenta (PDF/CSV/XLSX)
  - `GET /v1/reconciliation/matches?tenant_id={id}&month={YYYY-MM}` - Obtener matches sugeridos
  - `POST /v1/reconciliation/confirm-match` - Confirmar match manual
  - `GET /v1/reconciliation/missing-invoices` - Facturas sin pago detectado
  - `GET /v1/reconciliation/unmatched-payments` - Pagos sin factura
  - `GET /v1/reconciliation/partial-matches` - Pagos parciales detectados

- **Modelos de Datos (SQLAlchemy):**

```python
# backend/app/models/reconciliation.py

from sqlalchemy import Column, String, DateTime, ForeignKey, Numeric, Enum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
import enum

class MatchStatus(enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    REJECTED = "rejected"
    PARTIAL = "partial"

class MatchType(enum.Enum):
    EXACT = "exact"           # Monto + fecha exacta
    FUZZY = "fuzzy"           # Fuzzy matching en concepto
    LLM_VALIDATED = "llm"     # Validado por LLM
    MANUAL = "manual"         # Confirmado manualmente por usuario

class BankStatement(Base):
    __tablename__ = "bank_statements"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    account_number = Column(String(20), nullable=False)
    bank_name = Column(String(100), nullable=False)
    statement_period_start = Column(DateTime, nullable=False)
    statement_period_end = Column(DateTime, nullable=False)
    file_path_s3 = Column(String(512), nullable=False)
    status = Column(Enum("pending", "processed", "error"), default="pending")
    total_transactions = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relación con transacciones
    transactions = relationship("BankTransaction", back_populates="statement")

class BankTransaction(Base):
    __tablename__ = "bank_transactions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    statement_id = Column(UUID(as_uuid=True), ForeignKey("bank_statements.id"), nullable=False)
    transaction_date = Column(DateTime, nullable=False)
    description = Column(String(500), nullable=False)
    amount = Column(Numeric(15, 2), nullable=False)
    currency = Column(String(3), default="MXN")
    transaction_type = Column(Enum("debit", "credit"), nullable=False)
    reference = Column(String(100))  # Referencia bancaria
    matched_document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id"))
    match_status = Column(Enum("unmatched", "matched", "partial"), default="unmatched")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relación
    statement = relationship("BankStatement", back_populates="transactions")
    matched_document = relationship("Document", backref="matched_transactions")

class ReconciliationMatch(Base):
    __tablename__ = "reconciliation_matches"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    bank_transaction_id = Column(UUID(as_uuid=True), ForeignKey("bank_transactions.id"), nullable=False)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id"), nullable=False)
    match_type = Column(Enum(MatchType), nullable=False)
    match_status = Column(Enum(MatchStatus), default=MatchStatus.PENDING)
    confidence_score = Column(Numeric(5, 4), default=0.0)  # 0.0000 - 1.0000
    llm_reasoning = Column(JSONB)  # Razón del LLM si fue validado
    confirmed_by_user = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    confirmed_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relaciones
    bank_transaction = relationship("BankTransaction")
    document = relationship("Document")
    user = relationship("User")
```

- **Servicios (backend/app/services/reconciliation/):**

```
backend/app/services/reconciliation/
├── __init__.py
├── bank_statement_parser.py    # Parser de PDF/CSV/XLSX a transacciones
├── matching_engine.py          # Motor de matching (3 capas)
├── anomaly_detector.py         # Detección de faltantes
└── llm_validator.py            # Validación de matches con NIM
```

**`matching_engine.py` - Algoritmo de 3 capas:**

```python
# backend/app/services/reconciliation/matching_engine.py

from typing import List, Tuple, Optional
from difflib import SequenceMatcher
from datetime import timedelta
from sqlalchemy.orm import Session
from app.models.reconciliation import BankTransaction, Document, ReconciliationMatch, MatchType, MatchStatus
from app.services.nvidia_nim import call_nvidia_nim_chat

class MatchingEngine:
    """
    Motor de matching de 3 capas:
    1. Exact Match (monto + fecha)
    2. Fuzzy Match (concepto + Levenshtein)
    3. LLM Validation (razonamiento semántico)
    """
    
    def __init__(self, db: Session):
        self.db = db
        self.date_tolerance_days = 3
        self.fuzzy_threshold = 0.7
        self.llm_threshold = 0.85
    
    def find_matches(self, bank_transaction: BankTransaction, tenant_id: str) -> List[Tuple[Document, float, MatchType]]:
        """
        Encuentra todos los matches posibles para una transacción bancaria.
        Retorna lista de tuplas: (documento, confianza, tipo_de_match)
        """
        candidates = []
        
        # Capa 1: Exact Match
        exact_matches = self._exact_match(bank_transaction, tenant_id)
        if exact_matches:
            candidates.extend([(doc, 0.95, MatchType.EXACT) for doc in exact_matches])
        
        # Capa 2: Fuzzy Match (si no hay exactos o para ampliar candidatos)
        if not candidates or len(candidates) < 3:
            fuzzy_matches = self._fuzzy_match(bank_transaction, tenant_id)
            candidates.extend([(doc, score, MatchType.FUZZY) for doc, score in fuzzy_matches])
        
        # Capa 3: LLM Validation (para matches con confianza < 85%)
        validated_candidates = []
        for doc, score, match_type in candidates:
            if score < self.llm_threshold:
                llm_validated, llm_score, reasoning = self._llm_validate(bank_transaction, doc)
                if llm_validated:
                    validated_candidates.append((doc, llm_score, MatchType.LLM_VALIDATED))
                    # Guardar razonamiento para auditoría
                    self._save_audit_log(bank_transaction, doc, reasoning)
            else:
                validated_candidates.append((doc, score, match_type))
        
        # Ordenar por confianza
        validated_candidates.sort(key=lambda x: x[1], reverse=True)
        return validated_candidates[:5]  # Top 5 matches
    
    def _exact_match(self, transaction: BankTransaction, tenant_id: str) -> List[Document]:
        """
        Capa 1: Match exacto por monto y fecha (+/- 3 días).
        """
        min_date = transaction.transaction_date - timedelta(days=self.date_tolerance_days)
        max_date = transaction.transaction_date + timedelta(days=self.date_tolerance_days)
        
        query = self.db.query(Document).filter(
            Document.tenant_id == tenant_id,
            Document.status == "processed",
            Document.total_amount == transaction.amount,
            Document.extraction_json["fecha"].astext.between(
                min_date.strftime("%Y-%m-%d"),
                max_date.strftime("%Y-%m-%d")
            )
        )
        return query.all()
    
    def _fuzzy_match(self, transaction: BankTransaction, tenant_id: str) -> List[Tuple[Document, float]]:
        """
        Capa 2: Fuzzy matching en descripción/concepto.
        Usa distancia de Levenshtein para comparar nombres de proveedores.
        """
        # Obtener todos los documentos procesados del tenant en el periodo
        candidates = self.db.query(Document).filter(
            Document.tenant_id == tenant_id,
            Document.status == "processed",
            Document.total_amount.between(transaction.amount * 0.9, transaction.amount * 1.1)  # +/- 10%
        ).all()
        
        matches = []
        transaction_desc_lower = transaction.description.lower()
        
        for doc in candidates:
            # Extraer nombre del emisor/receptor del documento
            doc_provider = doc.extraction_json.get("rfc_emisor", "") or doc.extraction_json.get("rfc_receptor", "")
            doc_concept = doc.extraction_json.get("concepto", "")
            
            # Calcular similitud con descripción bancaria
            fuzzy_score_provider = SequenceMatcher(None, transaction_desc_lower, doc_provider.lower()).ratio()
            fuzzy_score_concept = SequenceMatcher(None, transaction_desc_lower, doc_concept.lower()).ratio()
            
            best_score = max(fuzzy_score_provider, fuzzy_score_concept)
            
            if best_score >= self.fuzzy_threshold:
                matches.append((doc, best_score))
        
        return matches
    
    def _llm_validate(self, transaction: BankTransaction, document: Document) -> Tuple[bool, float, dict]:
        """
        Capa 3: Validación semántica con NVIDIA NIM (Llama-3.3-70B).
        Determina si la transacción bancaria y el documento corresponden al mismo evento económico.
        """
        prompt = f"""
Eres un experto contador público en México. Tu tarea es determinar si una transacción bancaria 
y un CFDI (factura mexicana) corresponden al mismo evento económico.

**Transacción Bancaria:**
- Fecha: {transaction.transaction_date.strftime("%Y-%m-%d")}
- Descripción: {transaction.description}
- Monto: ${transaction.amount:,.2f} {transaction.currency}
- Tipo: {"Cargo" if transaction.transaction_type == "debit" else "Abono"}

**CFDI:**
- UUID: {document.uuid_sat}
- Fecha: {document.extraction_json.get("fecha", "N/A")}
- Emisor: {document.extraction_json.get("rfc_emisor", "N/A")}
- Receptor: {document.extraction_json.get("rfc_receptor", "N/A")}
- Concepto: {document.extraction_json.get("concepto", "N/A")}
- Total: ${float(document.total_amount):,.2f} {document.currency}

**Instrucciones:**
1. Analiza si la descripción bancaria podría corresponder al proveedor del CFDI.
2. Considera variaciones comunes en nombres (ej. "AMAZON MEXICO" vs "AMZN MKTPLACE MEX").
3. Evalúa si los montos son consistentes (puede haber diferencias por retenciones o pagos parciales).
4. Determina si es el mismo evento económico.

Responde EXACTAMENTE en este formato JSON:
{{
  "match": true/false,
  "confidence": 0.0-1.0,
  "reasoning": "Explicación detallada de tu razonamiento",
  "match_type": "exact|fuzzy|partial|no_match"
}}
"""
        
        try:
            response = call_nvidia_nim_chat(
                model="meta/llama-3.3-70b-instruct",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                max_tokens=500
            )
            
            # Parsear respuesta JSON
            import json
            result = json.loads(response.strip())
            
            return (
                result.get("match", False),
                result.get("confidence", 0.0),
                result
            )
        except Exception as e:
            # En caso de error, no validar
            return False, 0.0, {"error": str(e)}
    
    def _save_audit_log(self, transaction: BankTransaction, document: Document, reasoning: dict):
        """Guarda el razonamiento del LLM para auditoría."""
        from app.models.audit import AIAuditLog
        
        audit_log = AIAuditLog(
            document_id=document.id,
            agent_name="Reconciliation-MatchingEngine",
            prompt_version="v1.0",
            input_tokens=0,  # Calcular si es necesario
            output_tokens=0,
            reasoning_path=str(reasoning),
            user_override=False
        )
        self.db.add(audit_log)
        self.db.commit()
```

- **Agentes LangGraph:** Workflow de conciliación

```python
# backend/app/services/reconciliation/workflow.py

from langgraph.graph import StateGraph, END
from typing import TypedDict, List, Annotated
from langgraph.graph.message import add_messages
from app.services.reconciliation.matching_engine import MatchingEngine
from app.services.reconciliation.anomaly_detector import AnomalyDetector

# Estado del workflow
class ConciliationState(TypedDict):
    tenant_id: str
    bank_statement_id: str
    matches: List[dict]
    anomalies: List[dict]
    report: dict
    status: str  # "processing", "pending_review", "completed"

# Definición del grafo
conciliation_graph = StateGraph(ConciliationState)

# Nodos del grafo
def parse_bank_statement(state: ConciliationState):
    """Parsea el estado de cuenta y extrae transacciones."""
    from app.services.reconciliation.bank_statement_parser import parse_statement
    
    transactions = parse_statement(state["bank_statement_id"])
    return {"transactions": transactions, "status": "parsing_complete"}

def extract_invoices(state: ConciliationState):
    """Extrae facturas del periodo del tenant."""
    # Query a documentos del tenant en el periodo del estado de cuenta
    pass

def run_matching(state: ConciliationState):
    """Ejecuta el motor de matching para cada transacción."""
    engine = MatchingEngine(db)
    matches = []
    
    for transaction in state.get("transactions", []):
        transaction_matches = engine.find_matches(transaction, state["tenant_id"])
        matches.extend(transaction_matches)
    
    return {"matches": matches, "status": "matching_complete"}

def detect_anomalies(state: ConciliationState):
    """Detecta anomalías: facturas sin pago, pagos sin factura."""
    detector = AnomalyDetector(db)
    anomalies = detector.detect_all(state["tenant_id"])
    return {"anomalies": anomalies, "status": "anomaly_detection_complete"}

def generate_report(state: ConciliationState):
    """Genera reporte de conciliación."""
    report = {
        "total_transactions": len(state.get("transactions", [])),
        "total_matches": len(state.get("matches", [])),
        "match_rate": len(state["matches"]) / max(len(state.get("transactions", [])), 1),
        "anomalies_count": len(state.get("anomalies", [])),
        "status": "pending_review"  # Requiere revisión humana
    }
    return {"report": report, "status": "pending_review"}

# Agregar nodos al grafo
conciliation_graph.add_node("parse_bank_statement", parse_bank_statement)
conciliation_graph.add_node("extract_invoices", extract_invoices)
conciliation_graph.add_node("run_matching", run_matching)
conciliation_graph.add_node("detect_anomalies", detect_anomalies)
conciliation_graph.add_node("generate_report", generate_report)

# Definir arcos (transiciones)
conciliation_graph.set_entry_point("parse_bank_statement")
conciliation_graph.add_edge("parse_bank_statement", "extract_invoices")
conciliation_graph.add_edge("extract_invoices", "run_matching")
conciliation_graph.add_edge("run_matching", "detect_anomalies")
conciliation_graph.add_edge("detect_anomalies", "generate_report")
conciliation_graph.add_edge("generate_report", END)

# Compilar
app = conciliation_graph.compile()
```

- **Modelos NVIDIA NIM:**
  - `meta/llama-3.3-70b-instruct` - Validación semántica de matches
  - `nvidia/nv-rerankqa-mistral-4b-v3` - Reranking de candidatos (opcional)

- **Colecciones ChromaDB:**
  - `historico_conciliaciones_{tenant_id}` - Matches históricos para ML (opcional)

- **Validaciones:**
  - Monto debe estar dentro de +/- 10% para fuzzy matching
  - Fecha debe estar dentro de +/- 3 días para exact matching
  - Confidence score mínimo: 0.70 para sugerir match
  - LLM validation requerida para scores entre 0.70 y 0.85

- **Tests:**
  - `test_exact_match()` - Verificar matching exacto de monto + fecha
  - `test_fuzzy_match()` - Verificar matching con variaciones en nombre
  - `test_llm_validation()` - Verificar que LLM identifica matches correctos
  - `test_partial_match()` - Verificar detección de pagos parciales
  - `test_missing_invoice_detection()` - Verificar detección de cargos sin factura
```

#### B. Especificación Frontend

```markdown
### Conciliación Bancaria - UI

- **Pantalla:** Dashboard de Conciliación
- **Propósito:** Upload de estados de cuenta, revisión de matches sugeridos, confirmación manual

- **Componentes Nuevos:**

```
frontend/src/components/reconciliation/
├── BankStatementUpload.tsx    # Upload drag-and-drop de estados de cuenta
├── MatchingTable.tsx          # Tabla de matches sugeridos con acciones
├── UnmatchedAlerts.tsx        # Alertas de faltantes (facturas/pagos)
├── PartialMatchesPanel.tsx    # Panel de pagos parciales
└── ReconciliationDashboard.tsx # Pantalla principal (layout)
```

**`BankStatementUpload.tsx`:**
- Drag-and-drop zone para PDF/CSV/XLSX
- Selector de cuenta bancaria (CRUD de cuentas)
- Selector de periodo (mes/año)
- Progress bar de procesamiento (polling SSE)
- Notificación de completado

**`MatchingTable.tsx`:**
- Tabla con columnas: Fecha, Descripción Banco, Documento Match, Monto, Confianza, Acciones
- Filtros: Por tipo de match (Exact/Fuzzy/LLM), por confianza (>90%, 70-90%, <70%)
- Acciones por fila:
  - ✅ Confirmar match (con atajo de teclado)
  - ❌ Rechazar match (abre modal para buscar manualmente)
  - 🔍 Ver documento (abre split screen con PDF)
- Resumen en header: "85 de 100 transacciones conciliadas (85%)"

**`UnmatchedAlerts.tsx`:**
- Dos pestañas:
  1. "Facturas sin pago" - Lista de CFDI de egreso sin movimiento bancario
  2. "Pagos sin factura" - Lista de cargos bancarios sin CFDI asociado
- Acciones:
  - Marcar como resuelto
  - Asociar manualmente
  - Ignorar (con justificación)

- **Services (frontend/src/services/):**

```typescript
// frontend/src/services/reconciliation.service.ts

import api from './api';

export interface BankStatement {
  id: string;
  account_number: string;
  bank_name: string;
  statement_period_start: string;
  statement_period_end: string;
  status: 'pending' | 'processed' | 'error';
  total_transactions: number;
}

export interface Match {
  id: string;
  bank_transaction_id: string;
  document_id: string;
  match_type: 'exact' | 'fuzzy' | 'llm' | 'manual';
  match_status: 'pending' | 'confirmed' | 'rejected' | 'partial';
  confidence_score: number;
  bank_transaction: BankTransaction;
  document: Document;
}

export interface BankTransaction {
  id: string;
  transaction_date: string;
  description: string;
  amount: number;
  transaction_type: 'debit' | 'credit';
}

export const reconciliationService = {
  // Subir estado de cuenta
  uploadBankStatement: async (
    file: File,
    accountId: string,
    periodStart: string,
    periodEnd: string
  ): Promise<{ task_id: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('account_id', accountId);
    formData.append('period_start', periodStart);
    formData.append('period_end', periodEnd);
    
    const response = await api.post('/v1/reconciliation/upload-bank-statement', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Obtener matches sugeridos
  getMatches: async (tenantId: string, month: string): Promise<Match[]> => {
    const response = await api.get('/v1/reconciliation/matches', {
      params: { tenant_id: tenantId, month },
    });
    return response.data;
  },

  // Confirmar match
  confirmMatch: async (matchId: string): Promise<void> => {
    await api.post('/v1/reconciliation/confirm-match', { match_id: matchId });
  },

  // Rechazar match
  rejectMatch: async (matchId: string, reason: string): Promise<void> => {
    await api.post('/v1/reconciliation/reject-match', { match_id: matchId, reason });
  },

  // Obtener facturas faltantes
  getMissingInvoices: async (tenantId: string): Promise<Document[]> => {
    const response = await api.get('/v1/reconciliation/missing-invoices', {
      params: { tenant_id: tenantId },
    });
    return response.data;
  },

  // Obtener pagos sin factura
  getUnmatchedPayments: async (tenantId: string): Promise<BankTransaction[]> => {
    const response = await api.get('/v1/reconciliation/unmatched-payments', {
      params: { tenant_id: tenantId },
    });
    return response.data;
  },

  // Obtener estado de cuenta
  getBankStatements: async (tenantId: string): Promise<BankStatement[]> => {
    const response = await api.get('/v1/reconciliation/bank-statements', {
      params: { tenant_id: tenantId },
    });
    return response.data;
  },
};
```

- **Estado Global (Zustand):**

```typescript
// frontend/src/store/reconciliation.store.ts

import { create } from 'zustand';
import { reconciliationService, Match, BankStatement, BankTransaction, Document } from '@/services/reconciliation.service';

interface ReconciliationState {
  // Estado
  bankStatements: BankStatement[];
  matches: Match[];
  missingInvoices: Document[];
  unmatchedPayments: BankTransaction[];
  isLoading: boolean;
  uploadProgress: number;
  selectedMonth: string;
  
  // Acciones
  fetchBankStatements: (tenantId: string) => Promise<void>;
  uploadBankStatement: (file: File, accountId: string, periodStart: string, periodEnd: string) => Promise<void>;
  fetchMatches: (tenantId: string, month: string) => Promise<void>;
  confirmMatch: (matchId: string) => Promise<void>;
  rejectMatch: (matchId: string, reason: string) => Promise<void>;
  fetchMissingInvoices: (tenantId: string) => Promise<void>;
  fetchUnmatchedPayments: (tenantId: string) => Promise<void>;
  setSelectedMonth: (month: string) => void;
}

export const useReconciliationStore = create<ReconciliationState>((set, get) => ({
  bankStatements: [],
  matches: [],
  missingInvoices: [],
  unmatchedPayments: [],
  isLoading: false,
  uploadProgress: 0,
  selectedMonth: new Date().toISOString().slice(0, 7), // YYYY-MM
  
  fetchBankStatements: async (tenantId: string) => {
    set({ isLoading: true });
    try {
      const statements = await reconciliationService.getBankStatements(tenantId);
      set({ bankStatements: statements, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  uploadBankStatement: async (file, accountId, periodStart, periodEnd) => {
    set({ isLoading: true, uploadProgress: 0 });
    try {
      const { task_id } = await reconciliationService.uploadBankStatement(
        file, accountId, periodStart, periodEnd
      );
      
      // Polling de progreso (SSE o polling)
      const pollProgress = async () => {
        const response = await api.get(`/v1/reconciliation/task-status/${task_id}`);
        set({ uploadProgress: response.data.progress });
        
        if (response.data.status === 'completed') {
          set({ isLoading: false, uploadProgress: 100 });
          // Recargar lista de estados de cuenta
          get().fetchBankStatements(accountId); // Asumiendo que accountId es tenant_id
        } else if (response.data.status === 'error') {
          set({ isLoading: false, uploadProgress: 0 });
          throw new Error(response.data.error);
        } else {
          setTimeout(pollProgress, 2000); // Poll cada 2s
        }
      };
      
      pollProgress();
    } catch (error) {
      set({ isLoading: false, uploadProgress: 0 });
      throw error;
    }
  },
  
  fetchMatches: async (tenantId, month) => {
    set({ isLoading: true });
    try {
      const matches = await reconciliationService.getMatches(tenantId, month);
      set({ matches, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  confirmMatch: async (matchId) => {
    await reconciliationService.confirmMatch(matchId);
    // Actualizar estado local
    set((state) => ({
      matches: state.matches.map((m) =>
        m.id === matchId ? { ...m, match_status: 'confirmed' as const } : m
      ),
    }));
  },
  
  rejectMatch: async (matchId, reason) => {
    await reconciliationService.rejectMatch(matchId, reason);
    set((state) => ({
      matches: state.matches.filter((m) => m.id !== matchId),
    }));
  },
  
  fetchMissingInvoices: async (tenantId) => {
    set({ isLoading: true });
    try {
      const invoices = await reconciliationService.getMissingInvoices(tenantId);
      set({ missingInvoices: invoices, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  fetchUnmatchedPayments: async (tenantId) => {
    set({ isLoading: true });
    try {
      const payments = await reconciliationService.getUnmatchedPayments(tenantId);
      set({ unmatchedPayments: payments, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  setSelectedMonth: (month) => set({ selectedMonth: month }),
}));
```

- **Flujo de Usuario:**

```
1. Usuario navega a "Conciliación" en el menú lateral
2. Selecciona cuenta bancaria y periodo (mes/año)
3. Sube estado de cuenta (PDF/CSV/XLSX) vía drag-and-drop
4. Sistema procesa el estado de cuenta (progress bar en tiempo real)
5. Al completar, se muestra tabla de matches sugeridos
6. Usuario revisa matches:
   - Confirma con ✅ (o tecla Enter) los matches correctos
   - Rechaza con ❌ los incorrectos (abre modal de búsqueda manual)
   - Filtra por tipo de match o confianza
7. Sistema actualiza porcentaje de conciliación en tiempo real
8. Usuario revisa pestaña "Faltantes":
   - Facturas sin pago → Asocia manualmente o marca como resuelto
   - Pagos sin factura → Solicita factura al cliente o ignora
9. Al llegar a 90%+ de conciliación, sistema permite "Cerrar conciliación"
10. Usuario cierra conciliación → Se genera reporte y se actualizan saldos
```

- **Validaciones UI:**
  - Archivo debe ser PDF, CSV o XLSX (máx 10MB)
  - Periodo debe ser válido (no futuro, no mayor a 31 días)
  - Confirmar match requiere confianza >70% (warning si <85%)
  - Rechazar match requiere justificación (modal con textarea)
  - Cerrar conciliación requiere mínimo 90% de matches confirmados
```

#### C. Criterios de Aceptación

```markdown
### Conciliación Bancaria - Criterios de Aceptación

**Funcionales:**
- [ ] El sistema acepta upload de estados de cuenta en PDF, CSV y XLSX
- [ ] El parsing extrae correctamente: fecha, descripción, monto, tipo (cargo/abono)
- [ ] El matching engine encuentra matches exactos (monto + fecha +/- 3 días) con 100% de precisión
- [ ] El fuzzy matching identifica proveedores con nombres similares (ej. "AMAZON MEXICO" vs "AMZN MKTPLACE") con 85%+ de precisión
- [ ] La validación LLM mejora la precisión de matches fuzzy en al menos 10%
- [ ] El sistema detecta facturas sin pago (CFDI de egreso sin movimiento bancario)
- [ ] El sistema detecta pagos sin factura (cargo bancario sin CFDI asociado)
- [ ] El sistema soporta pagos parciales (múltiples pagos para un mismo CFDI)
- [ ] El usuario puede confirmar/rechazar matches con un clic
- [ ] El usuario puede buscar y asociar manualmente documentos no detectados
- [ ] El sistema calcula y muestra porcentaje de conciliación en tiempo real
- [ ] El cierre de conciliación requiere mínimo 90% de matches confirmados

**No Funcionales:**
- [ ] El procesamiento de un estado de cuenta de 100 transacciones toma <30 segundos
- [ ] La tabla de matches soporta 1000+ filas sin degradación de performance (virtual scrolling)
- [ ] La UI es responsive (funcional en tablets)
- [ ] Los atajos de teclado funcionan (Enter para confirmar, Esc para cancelar)
- [ ] El sistema guarda audit log de todas las acciones del usuario

**Métricas de IA:**
- [ ] Precisión de matching exacto: 100%
- [ ] Precisión de fuzzy matching: >85%
- [ ] Precisión de LLM validation: >90%
- [ ] Tasa de matches automáticos (sin intervención humana): >70%
- [ ] Falsos positivos (matches incorrectos confirmados por error): <5%
```

---

*(Continuará con las siguientes funcionalidades pendientess...)*

**Nota:** Debido a la extensión masiva de este documento (10 secciones completas), el análisis continuaría con:

- **3.2 Clasificación Contable Automática** (Fase 9)
- **3.3 Validación CFDI vs SAT** (Fase 9)
- **3.4 Dashboard Predictivo** (Fase 10)
- **3.5 Agente de Nómina** (Fase 11)
- **Sección 4:** Arquitectura de IA Detallada (workflows LangGraph, pipeline RAG, modelos ML)
- **Sección 5:** Plan de Implementación por Fases (8-12) con sprint plans detallados
- **Sección 6:** Especificación de UI/UX (wireframes ASCII, componentes Shadcn)
- **Sección 7:** Matriz de Riesgos Técnica (20+ riesgos identificados)
- **Sección 8:** KPIs Técnicos (30+ métricas)
- **Sección 9:** Estrategia de Testing (unitarios, integración, E2E, IA, carga)
- **Sección 10:** Checklist de Producción (100+ items)

**¿Deseas que continúe generando el resto del documento?** Puedo:
1. **Continuar ahora** con las secciones restantes (serán ~1500-2000 líneas adicionales)
2. **Generar por secciones** individuales bajo demanda
3. **Crear archivos separados** para cada sección (mejor para navegación)
