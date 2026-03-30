# 🗺️ Directorios del Proyecto - Clarificación

**Fecha:** 9 de marzo de 2026

---

## 📁 Los 3 Directorios Principales

### 1. `plan/` = 📋 **Documentación y Diseño**

**Propósito:** Documentar **QUÉ** vamos a construir

| Archivos | Estado | Contenido |
|----------|--------|-----------|
| `01-Blueprint.md` | ✅ | Arquitectura en 4 capas |
| `02-Specs.md` | ✅ | 7 módulos de IA |
| `03-Diagrams.md` | ✅ | 9 diagramas Mermaid |
| `04-07/*.md` | ✅ | Pipelines, agentes, RAG |
| `08-Testing_and_Validation.md` | ✅ | Plan de QA |
| `09-Application_Screen_Gallery.md` | ✅ | Diseño de UI |
| `10-Infrastructure_and_Costs.md` | ✅ | Infraestructura, costos, riesgos |

**Se usa cuando:** Necesitas saber qué estamos construyendo

---

### 2. `pilot/` = 🧪 **Validación de Tecnología**

**Propósito:** Validar que la tecnología **FUNCIONA** antes de construir la app completa

| Archivos | Estado | Contenido |
|----------|--------|-----------|
| `scripts/run_pipeline.py` | ✅ | Pipeline completo (extracción + validación + reporte) |
| `scripts/generate_invoices.py` | ✅ | Generador de 100-1,000 facturas |
| `src/extraction_service.py` | ✅ | NVIDIA NIM extraction (98.1% precisión) |
| `src/rfc_validator.py` | ✅ | Validador de RFCs |
| `dataset/pdf/`, `dataset/xml/` | ✅ | 100-1,000 facturas de prueba |
| `output/` | ✅ | Resultados del piloto |
| `monitoring/` | 🟢 | **FASE 4 ACTUAL**: Prometheus + Grafana |
| `output/dashboard/` | 🟢 | **FASE 4 ACTUAL**: Dashboard web |

**Se usa cuando:** Estás validando tecnología o ejecutando pilotos

**Estado:** ✅ **FASES 1-4 COMPLETADAS**
- ✅ Precisión: 98.1% (target: 95%)
- ✅ Throughput: 0.26 iter/s (target: 0.1)
- ✅ Tiempo (50 facturas): 3:15 min

---

### 3. `idp-asistente-contable/` = 🚀 **Aplicación de Producción**

**Propósito:** La aplicación **FINAL** que usarán los contadores

| Archivos | Estado | Contenido |
|----------|--------|-----------|
| `backend/app/main.py` | ⚠️ | Skeleton de FastAPI |
| `backend/app/api/` | ⏳ | Endpoints REST (vacío) |
| `backend/app/services/` | ⏳ | Servicios (vacío) |
| `backend/app/db/` | ⏳ | Modelos PostgreSQL (vacío) |
| `frontend/src/` | ⏳ | React UI (vacío) |
| `docker-compose.yml` | ✅ | Orquestación configurada |
| `data/pg_data/`, `data/chroma_data/` | ✅ | Volúmenes persistentes |

**Se usa cuando:** Vas a construir la aplicación de producción

**Estado:** ⏳ **EN ESPERA** - Esperando mover código validado desde `pilot/`

---

## 🔄 Flujo de Desarrollo

```
┌─────────────────────────────────────────────────────────────────┐
│  Flujo Completo                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. plan/ (Documentación)                                       │
│     └─→ "El sistema debe procesar facturas con NVIDIA NIM"      │
│         "Precisión target: >95%, Throughput: >0.1 iter/s"       │
│                          ↓                                      │
│  2. pilot/ (Validación)                                         │
│     └─→ ¿Funciona NVIDIA NIM?                                   │
│         ✅ SÍ! 98.1% precisión, 0.26 iter/s                     │
│         ✅ TECNOLOGÍA VALIDADA                                  │
│                          ↓                                      │
│  3. idp-asistente-contable/ (Producción)                        │
│     └─→ Mover código validado desde pilot/                      │
│         Agregar: PostgreSQL, auth, frontend React, etc.         │
│         Construir aplicación completa                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Estado Actual por Directorio

| Directorio | Fase | Estado | Próxima Actividad |
|------------|------|--------|-------------------|
| **`plan/`** | 0 | ✅ **100% COMPLETADO** | Referencia |
| **`pilot/`** | 1-4 | ✅ **VALIDACIÓN COMPLETADA** | Mover a producción |
| **`idp-asistente-contable/`** | 5-6 | ⏳ **EN ESPERA** | Recibir código de pilot/ |

---

## 🎯 ¿Por Qué Esta Separación?

### Razón: **Gestión de Riesgo Técnico**

**Problema:** ¿Qué pasa si construyes toda la aplicación y luego descubres que NVIDIA NIM no funciona?

**Solución:**
1. ✅ Primero documentas (`plan/`)
2. ✅ Luego validas la tecnología (`pilot/`)
3. ✅ Finalmente construyes la app (`idp-asistente-contable/`)

**Beneficio:** Si NVIDIA NIM hubiera fallado (<95% precisión), solo perdemos 1-2 días de piloto, no semanas de desarrollo.

---

## 🔮 ¿Qué Sigue Ahora?

### Inmediato (Fase 4 - `pilot/`)

1. **Monitoreo** → `pilot/monitoring/`
   - Prometheus configuration
   - Grafana dashboards
   - Alertas (Slack/Email)

2. **Dashboard** → `pilot/output/dashboard/`
   - Dashboard web (HTML/JS)
   - Métricas en tiempo real
   - Historial de procesamiento

---

### Corto Plazo (Fase 5 - `idp-asistente-contable/`)

**Mover código validado:**

```
pilot/src/extraction_service.py   →  idp-asistente-contable/backend/app/services/nvidia_nim.py
pilot/scripts/run_pipeline.py     →  idp-asistente-contable/backend/app/api/idp.py
pilot/src/rfc_validator.py        →  idp-asistente-contable/backend/app/core/validators.py
pilot/src/config.py               →  idp-asistente-contable/backend/app/core/config.py
```

**Agregar:**
- PostgreSQL models (SQLAlchemy)
- Authentication (JWT + OAuth2)
- REST endpoints completos
- Frontend React UI

---

## 📋 Resumen Visual

```
┌────────────────────────────────────────────────────────────────┐
│  IDP-App/                                                      │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  📋 plan/                  ✅ 100% COMPLETADO                  │
│     └─→ 10 documentos de diseño                                │
│                                                                │
│  🧪 pilot/                 ✅ VALIDACIÓN COMPLETADA            │
│     ├── scripts/           ✅ Pipeline completo                │
│     ├── src/               ✅ Servicios (98.1% precisión)      │
│     ├── dataset/           ✅ 100-1,000 facturas               │
│     ├── output/            ✅ Resultados                       │
│     ├── monitoring/        🟢 FASE 4 ACTUAL                    │
│     └── output/dashboard/  🟢 FASE 4 ACTUAL                    │
│                                                                │
│  🚀 idp-asistente-contable/  ⏳ EN ESPERA                      │
│     ├── backend/             ⏳ Mover desde pilot/             │
│     ├── frontend/            ⏳ Construir React UI             │
│     ├── docker-compose.yml   ✅ Configurado                    │
│     └── data/                ✅ Volúmenes listos               │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

**Última actualización:** 9 de marzo de 2026  
**Estado:** 🟢 **FASE 4 EN CURSO** (Monitoreo + Dashboard en `pilot/`)  
**Próximo:** 🚀 **FASE 5** (Mover a `idp-asistente-contable/` para producción)
