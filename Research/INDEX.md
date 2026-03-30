# Índice de Investigación - IDP-App Research

**Fecha de actualización:** 10 de marzo de 2026  
**Estado:** ✅ 100% Investigaciones Completadas | ⏳ 0% Validaciones Completadas  
**Total de documentos:** 98 archivos | ~45,000 líneas | 345+ fuentes oficiales

---

## 📋 Visión General

### Propósito del Directorio Research

Este directorio contiene la **investigación técnica completa** para el desarrollo del **IDP-App Asistente Contable**, un sistema de IA especializado para contadores públicos en México. La documentación cubre **19 módulos funcionales** y **44 investigaciones técnicas complementarias** que fundamentan el desarrollo del producto.

### Metodología de Investigación

El proceso de investigación siguió **5 fases sistemáticas**:

```
Fase 1: Identificación de Gaps → Fase 2: Investigación Técnica → Fase 3: Validación → Fase 4: Implementación → Fase 5: Producción
```

| Fase | Descripción | Estado | Owner |
|------|-------------|--------|-------|
| **Fase 1** | Identificación de 15 gaps críticos | ✅ Completada | Product Owner |
| **Fase 2** | Investigación técnica de gaps | ✅ Completada | AI Research Team |
| **Fase 3** | Validación con expertos contadores | ⏳ Pendiente (21-mar a 04-abr) | Contadores Certificados |
| **Fase 4** | Implementación técnica | 🔄 En curso (Fase 9) | Engineering Team |
| **Fase 5** | Producción y escalamiento | ⏳ Pendiente | DevOps + Security |

### Estadísticas Clave

| Métrica | Cantidad | Target | Estado |
|---------|----------|--------|--------|
| **Documentos de investigación** | 98 archivos | - | ✅ Completado |
| **Líneas totales de documentación** | ~45,000 líneas | - | ✅ Completado |
| **Fuentes oficiales consultadas** | 345+ fuentes | 10+ por documento | ✅ Superado (18.2 promedio) |
| **Queries Tavily ejecutados** | 76+ queries | 4+ por documento | ✅ Cumplido |
| **Puntos promedio en checklists** | 93/100 | 90+ | ✅ Superado |
| **Módulos investigados** | 19/19 | 100% | ✅ Completado |
| **Investigaciones complementarias** | 44/44 | 100% | ✅ Completado |
| **Validaciones con expertos** | 0/19 | 100% | ⏳ Pendiente |

---

## 📁 Estructura del Directorio

```
Research/
├── 📄 Archivos Raíz (4 archivos)
│   ├── GUIA_INVESTIGACION_TECNICA.md                    # Metodología de investigación (2,100+ líneas)
│   ├── PLAN_MAESTRO_IMPLEMENTACION.md                   # Roadmap de implementación (2,800+ líneas)
│   ├── INVESTIGACIONES_TECNICAS_COMPLEMENTARIAS.md  # Plan maestro 44 investigaciones (2,200+ líneas) ← MOVIDO DE 02-investigaciones-tecnicas/
│   └── Research.7z                                       # Archivo comprimido histórico
│
├── 📚 00-fundamentos/ (3 archivos)
│   ├── REPORTE_FUNCIONES_CONTADOR_PUBLICO_MEXICO.md     # 32+ actividades del contador (1,800+ líneas)
│   ├── RESUMEN_EJECUTIVO_OPORTUNIDADES_IA.md            # 5 oportunidades de alto impacto (600+ líneas)
│   └── SINTESIS_NECESIDADES_CONTADOR_VS_IDP_APP.md      # Mapa necesidades vs funcionalidades (1,400+ líneas)
│
├── 🔬 01-investigaciones-modulos/ (19 archivos)
│   ├── 01-conciliacion-bancaria.md                      # Gap #1 - Matching Engine 3 capas (430 líneas, v1.1, 92 pts)
│   ├── 02-validacion-cfdi-69b.md                        # Gap #3 - Lista 69-B EFO/EDO (565 líneas, v1.1, 94 pts)
│   ├── 03-clasificacion-contable.md                     # Gap #2 - ML + NVIDIA Embeddings (467 líneas, v1.1, 90 pts)
│   ├── 04-calculo-nomina-imss.md                        # Gap #7, #5 - Cuotas IMSS 2026 (889 líneas, v1.2, 95 pts)
│   ├── 05-forecasting-impuestos.md                      # Gap #9 - Prophet + estacionalidad (431 líneas, v1.1, 91 pts)
│   ├── 06-auditoria-nia.md                              # Gap #6 - NIA 530 muestreo (498 líneas, v1.0, 92 pts)
│   ├── 06-calculo-isr-iva.md                            # Gap #4 - Regímenes fiscales 2026 (730 líneas, v1.2, 95 pts)
│   ├── 07-asesoria-fiscal.md                            # Gap #7 - RAG Legal LISR/LIVA (502 líneas, v1.0, 92 pts)
│   ├── 08-cuentas-cobrar-pagar.md                       # Gap #8 - APIs de pago + SPEI (495 líneas, v1.0, 92 pts)
│   ├── 09-estados-financieros-nif.md                    # Gap #9 - NIF B-2 a B-7 (510 líneas, v1.0, 92 pts)
│   ├── 10-presupuestos-costos.md                        # Gap #10 - Forecasting Prophet (520 líneas, v1.0, 92 pts)
│   ├── 11-tesoreria-flujo.md                            # Gap #11 - CETES + forwards (510 líneas, v1.0, 92 pts)
│   ├── 12-cumplimiento-normativo.md                     # Gap #12 - NOMs STPS (485 líneas, v1.0, 90 pts)
│   ├── 13-outsourcing-contable.md                       # Gap #13 - Multi-tenant SaaS (425 líneas, v1.0, 90 pts)
│   ├── 14-auditoria-externa.md                          # Gap #14 - Due diligence (495 líneas, v1.0, 92 pts)
│   ├── 15-consultoria-especializada.md                  # Gap #15 - NIS B-1 ESG (515 líneas, v1.0, 92 pts)
│   ├── 17-captura-cfdi.md                               # Gap #1 - OCR NVIDIA NIM (982 líneas, v1.2, 95 pts)
│   ├── 18-declaraciones-mensuales.md                    # Gap #3 - Formatos DM-1/DM-2 (400 líneas, v1.2, 95 pts)
│   └── 19-contabilidad-electronica.md                   # Gap #4 - Anexo 24 RMF (450 líneas, v1.2, 95 pts)
│
├── ⚙️ 02-investigaciones-tecnicas/ (57 archivos)
│   │
│   ├── Módulos 1-5 (28 archivos)
│   │   ├── formatos-estados-cuenta-bancos-mexico.md     # 14 bancos mexicanos (450+ líneas)
│   │   ├── 2.1-estructura-cfdi-4-0-anexo-20.md          # CFDI 4.0 completo (650+ líneas)
│   │   ├── 2.2-catalogos-sat-cfdi-2026.md               # Catálogos SAT 2026 (647+ líneas)
│   │   ├── 2.3-pac-proveedores-autorizacion-2026.md     # 77 PACs autorizados (600+ líneas)
│   │   ├── 2.4-validacion-materialidad-operaciones.md   # CFF Art. 69-B (700+ líneas)
│   │   ├── 3.1-catalogo-cuentas-nif-b-3-detallado.md    # NIF B-3 + códigos SAT (942+ líneas)
│   │   ├── 3.2-embedding-cuentas-contables-mexico.md    # Dataset 10k+ conceptos (942+ líneas)
│   │   ├── 4.1-tablas-imss-inf onavit-2026.md            # Cuotas IMSS 2026 (800+ líneas)
│   │   ├── 4.2-cfdi-nomina-1-2-revision-e.md            # Nómina 1.2 Revisión E (900+ líneas)
│   │   ├── 4.3-tablas-isr-retencion-2026-anexo-8.md     # Tablas ISR 2026 (700+ líneas)
│   │   ├── 4.4-pac-nomina-timbrado-costos.md            # PACs especializados (650+ líneas)
│   │   ├── 4.5-uma-salarios-minimos-historico.md        # Histórico UMA 2016-2026 (800+ líneas)
│   │   ├── 5.1-dataset-historico-impuestos-mexico.md    # Estacionalidad mexicana (750+ líneas)
│   │   ├── llm-validation-conciliacion.md               # Validación LLM (380+ líneas)
│   │   ├── transaction-reconciliation-guide.md          # Mejores prácticas (250+ líneas)
│   │   ├── DZone-NLP-Powered_Ledger_Reconciliation.md   # Caso de éxito NLP (180+ líneas)
│   │   └── [13 archivos adicionales de módulos 1-5]
│   │
│   ├── Módulos 6-10 (15 archivos)
│   │   ├── 6.1-nia-530-muestreo-estadistico-guia.md     # Muestreo NIA 530 (780+ líneas)
│   │   ├── 6.2-caats-herramientas-auditoria.md          # CAATs IDEA/ACL (850+ líneas)
│   │   ├── 6.2-ml-clasificacion-gastos-dataset.md       # Dataset ML (700+ líneas)
│   │   ├── 6.3-random-forest-embeddings-nvidia.md       # Random Forest + NVIDIA (650+ líneas)
│   │   ├── 7.1-regimenes-fiscales-mexico-2026.md        # Catálogo regímenes (800+ líneas)
│   │   ├── 7.2-deducciones-personales-isr-2026.md       # Deducciones Art. 151 (700+ líneas)
│   │   ├── 7.3-tasas-iva-estados-mexico-2026.md         # Tasas IVA 16%/8%/0% (650+ líneas)
│   │   ├── 8.1-rag-legislacion-fiscal-mexicana.md       # RAG LISR/LIVA/CFF (1,300+ líneas)
│   │   ├── 8.2-tratados-tributarios-mexico-2026.md      # 60+ países (1,100+ líneas)
│   │   ├── 8.3-opinion-cumplimiento-sat-guia.md         # Opinión 32-D (1,000+ líneas)
│   │   ├── 9.1-apis-pago-mexico-2026.md                 # Stripe, Mercado Pago (650+ líneas)
│   │   ├── 9.1-gestion-cartera-vencida-estrategias-recuperacion.md (600+ líneas)
│   │   ├── 9.2-integracion-spei-stp-2026.md             # SPEI vía STP (600+ líneas)
│   │   ├── 9.2-proyeccion-flujo-efectivo-cuentas-cobrar.md (550+ líneas)
│   │   └── [1 archivo adicional]
│   │
│   ├── Módulos 11-16 (15 archivos)
│   │   ├── 12.1-cetes-directo-api-2026.md               # CETES Directo API (580+ líneas)
│   │   ├── 12.2-coberturas-cambiarias-forward.md        # Forwards, opciones (540+ líneas)
│   │   ├── 13.1-nom-stps-checklist-2026.md              # 13 NOMs STPS (560+ líneas)
│   │   ├── 13.2-uma-vuma-2026-valores.md                # UMA/VUMA 2026 (420+ líneas)
│   │   ├── 14.1-multi-tenant-saas-contable.md           # Multi-tenant (500+ líneas)
│   │   ├── 14.1-sla-despachos-contables-plantillas.md   # Plantillas SLA (480+ líneas)
│   │   ├── 14.2-sla-acuerdos-nivel-servicio.md          # ANS (450+ líneas)
│   │   ├── 15.1-due-diligence-financiero.md             # Due diligence (600+ líneas)
│   │   ├── 15.1-ley-benford-auditoria-ejemplos.md       # Ley de Benford (550+ líneas)
│   │   ├── 15.2-dictamen-fiscal-sat-anexo-18.md         # Dictamen fiscal (650+ líneas)
│   │   ├── 16.1-nis-b-1-indicadores-esg-2026.md         # ESG NIS B-1 (540+ líneas)
│   │   ├── 16.2-niif-s1-s2-issb-2026.md                 # NIIF S1/S2 ISSB (500+ líneas)
│   │   ├── 16.3-valuacion-empresas-mexico-metodos.md    # Valuación DCF (560+ líneas)
│   │   └── [2 archivos adicionales]
│   │
│   └── Módulos 17-19 (8 archivos)
│       ├── 17.1-xsd-cfdi-4-0-validacion.md              # Schemas XSD (832 líneas)
│       ├── 17.2-nvidia-nim-ocr-facturas-mexico.md       # OCR NVIDIA NIM (1,709 líneas)
│       ├── 17.3-descarga-masiva-sat-api.md              # Descarga masiva SAT (650+ líneas)
│       ├── 17.4-cadena-original-sello-digital.md        # Cadena original (650+ líneas)
│       ├── 18.1-formatos-declaraciones-sat-xml-dm1-dm2.md # DM-1/DM-2/DIM (1,198 líneas)
│       ├── 18.2-integracion-portal-sat-automatizacion-playwright.md # Playwright SAT (520+ líneas)
│       ├── 19.1-anexo-24-contabilidad-electronica.md    # Anexo 24 completo (1,484 líneas)
│       └── 19.2-buzon-tributario-sat-carga.md           # Buzón Tributario (1,230 líneas)
│
├── 📝 plantillas/ (7 archivos)
│   ├── PLANTILLA_INVESTIGACION.md                       # Estándar 10 secciones (450+ líneas)
│   ├── CHECKLIST_VALIDACION.md                          # Criterios 100 puntos (500+ líneas)
│   ├── CONTROL_CAMBIOS.md                               # Control de versiones (300+ líneas)
│   ├── CHECKLISTS_CONSOLIDADOS.md                       # Consolidado 01-05 (400+ líneas)
│   ├── CHECKLISTS_GAPS_MAYORES.md                       # Gaps #6-9 (350+ líneas)
│   ├── 01-conciliacion-bancaria-checklist.md            # Checklist específico (250+ líneas)
│   └── 06-auditoria-checklist.md                        # Checklist específico (250+ líneas)
│
└── ✅ validacion/ (8 archivos)
    ├── EMAIL_TEMPLATES.md                               # 5 templates de email (300+ líneas)
    ├── GAP01_PAQUETE_VALIDACION.md                      # Conciliación Bancaria (650+ líneas)
    ├── GAP02_PAQUETE_VALIDACION.md                      # Clasificación Contable (600+ líneas)
    ├── GAP03_PAQUETE_VALIDACION.md                      # Validación CFDI 69-B (600+ líneas)
    ├── GAP04_PAQUETE_VALIDACION.md                      # Cálculo ISR/IVA (600+ líneas)
    ├── GAP05_PAQUETE_VALIDACION.md                      # Forecasting Impuestos (600+ líneas)
    ├── GAP06-09_PAQUETES_VALIDACION.md                  # Gaps #6-9 consolidados (800+ líneas)
    └── GAP10-15_PAQUETES_VALIDACION.md                  # Gaps #10-15 consolidados (800+ líneas)
```

### Descripción de Subdirectorios

| Subdirectorio | Archivos | Líneas | Propósito |
|---------------|----------|--------|-----------|
| **00-fundamentos/** | 3 | ~3,800 | Contexto del proyecto: perfil del contador, oportunidades de IA, mapa de necesidades |
| **01-investigaciones-modulos/** | 19 | ~10,454 | Investigación técnica de los 19 módulos del sistema con arquitectura, algoritmos y roadmap |
| **02-investigaciones-tecnicas/** | 58 | ~18,500 | Profundización técnica: normativos, datasets, APIs, algoritmos, casos de uso |
| **plantillas/** | 7 | ~2,500 | Estandarización: plantillas de investigación, checklists, control de cambios |
| **validacion/** | 8 | ~4,800 | Validación con expertos: paquetes GAP01-GAP15, email templates |

---

## 🔬 Investigaciones por Módulo

### Tabla Resumen de 19 Módulos

| # | Módulo | Gap ID | Archivo | Líneas | Versión | Puntos | Fuentes | Fase | Estado Validación |
|---|--------|--------|---------|--------|---------|--------|---------|------|-------------------|
| 1 | **Conciliación Bancaria** | Gap #1 | [01-conciliacion-bancaria.md](01-investigaciones-modulos/01-conciliacion-bancaria.md) | 430 | v1.1 | 92/100 | 12 | Fase 9 | ⏳ Pendiente |
| 2 | **Validación CFDI 69-B** | Gap #3 | [02-validacion-cfdi-69b.md](01-investigaciones-modulos/02-validacion-cfdi-69b.md) | 565 | v1.1 | 94/100 | 20 | Fase 9 | ⏳ Pendiente |
| 3 | **Clasificación Contable** | Gap #2 | [03-clasificacion-contable.md](01-investigaciones-modulos/03-clasificacion-contable.md) | 467 | v1.1 | 90/100 | 15 | Fase 9 | ⏳ Pendiente |
| 4 | **Cálculo Nómina IMSS** | Gap #7, #5 | [04-calculo-nomina-imss.md](01-investigaciones-modulos/04-calculo-nomina-imss.md) | 889 | v1.2 | 95/100 | 22 | Fase 11 | ⏳ Pendiente |
| 5 | **Forecasting Impuestos** | Gap #9 | [05-forecasting-impuestos.md](01-investigaciones-modulos/05-forecasting-impuestos.md) | 431 | v1.1 | 91/100 | 21 | Fase 10 | ⏳ Pendiente |
| 6 | **Auditoría NIA** | Gap #6 | [06-auditoria-nia.md](01-investigaciones-modulos/06-auditoria-nia.md) | 498 | v1.0 | 92/100 | 19 | Fase 12 | ⏳ Pendiente |
| 7 | **Cálculo ISR/IVA** | Gap #4 | [06-calculo-isr-iva.md](01-investigaciones-modulos/06-calculo-isr-iva.md) | 730 | v1.2 | 95/100 | 10 | Fase 11 | ⏳ Pendiente |
| 8 | **Asesoría Fiscal** | Gap #7 | [07-asesoria-fiscal.md](01-investigaciones-modulos/07-asesoria-fiscal.md) | 502 | v1.0 | 92/100 | 17 | Fase 12 | ⏳ Pendiente |
| 9 | **Cuentas Cobrar/Pagar** | Gap #8 | [08-cuentas-cobrar-pagar.md](01-investigaciones-modulos/08-cuentas-cobrar-pagar.md) | 495 | v1.0 | 92/100 | 15 | Fase 12 | ⏳ Pendiente |
| 10 | **Estados Financieros NIF** | Gap #9 | [09-estados-financieros-nif.md](01-investigaciones-modulos/09-estados-financieros-nif.md) | 510 | v1.0 | 92/100 | 16 | Fase 12 | ⏳ Pendiente |
| 11 | **Presupuestos y Costos** | Gap #10 | [10-presupuestos-costos.md](01-investigaciones-modulos/10-presupuestos-costos.md) | 520 | v1.0 | 92/100 | 20 | Fase 10 | ⏳ Pendiente |
| 12 | **Tesorería y Flujo** | Gap #11 | [11-tesoreria-flujo.md](01-investigaciones-modulos/11-tesoreria-flujo.md) | 510 | v1.0 | 92/100 | 22 | Fase 10 | ⏳ Pendiente |
| 13 | **Cumplimiento Normativo** | Gap #12 | [12-cumplimiento-normativo.md](01-investigaciones-modulos/12-cumplimiento-normativo.md) | 485 | v1.0 | 90/100 | 18 | Fase 11 | ⏳ Pendiente |
| 14 | **Outsourcing Contable** | Gap #13 | [13-outsourcing-contable.md](01-investigaciones-modulos/13-outsourcing-contable.md) | 425 | v1.0 | 90/100 | 16 | Fase 12 | ⏳ Pendiente |
| 15 | **Auditoría Externa** | Gap #14 | [14-auditoria-externa.md](01-investigaciones-modulos/14-auditoria-externa.md) | 495 | v1.0 | 92/100 | 24 | Fase 12 | ⏳ Pendiente |
| 16 | **Consultoría Especializada** | Gap #15 | [15-consultoria-especializada.md](01-investigaciones-modulos/15-consultoria-especializada.md) | 515 | v1.0 | 92/100 | 26 | Fase 12 | ⏳ Pendiente |
| 17 | **Captura CFDI** | Gap #1 | [17-captura-cfdi.md](01-investigaciones-modulos/17-captura-cfdi.md) | 982 | v1.2 | 95/100 | 22 | Fase 9 | ⏳ Pendiente |
| 18 | **Declaraciones Mensuales** | Gap #3 | [18-declaraciones-mensuales.md](01-investigaciones-modulos/18-declaraciones-mensuales.md) | 400 | v1.2 | 95/100 | 20 | Fase 9 | ⏳ Pendiente |
| 19 | **Contabilidad Electrónica** | Gap #4 | [19-contabilidad-electronica.md](01-investigaciones-modulos/19-contabilidad-electronica.md) | 450 | v1.2 | 95/100 | 20 | Fase 9 | ⏳ Pendiente |

### Priorización por Gap

#### 🔴 Gaps Críticos (Gap #1-5) - Fase 9

| Gap | Módulo | Impacto | Complejidad | Owner | Deadline Validación |
|-----|--------|---------|-------------|-------|---------------------|
| **Gap #1** | Conciliación Bancaria + Captura CFDI | Alto | Alta | Backend + ML | 21-mar-2026 |
| **Gap #2** | Clasificación Contable | Alto | Media | ML Engineer | 21-mar-2026 |
| **Gap #3** | Validación CFDI 69-B + Declaraciones | Alto | Media | Backend | 21-mar-2026 |
| **Gap #4** | Cálculo ISR/IVA + Contabilidad Electrónica | Alto | Alta | Backend + Contador | 21-mar-2026 |
| **Gap #5** | Forecasting Impuestos | Medio | Media | Data Scientist | 21-mar-2026 |

#### 🟡 Gaps Mayores (Gap #6-9) - Fase 12

| Gap | Módulo | Impacto | Complejidad | Owner | Deadline Validación |
|-----|--------|---------|-------------|-------|---------------------|
| **Gap #6** | Auditoría NIA | Medio | Alta | Backend + Auditor | 28-mar-2026 |
| **Gap #7** | Asesoría Fiscal + Nómina | Alto | Alta | Backend + Contador | 28-mar-2026 |
| **Gap #8** | Cuentas Cobrar/Pagar | Medio | Media | Backend | 28-mar-2026 |
| **Gap #9** | Estados Financieros NIF | Medio | Media | Frontend + Backend | 28-mar-2026 |

#### 🟢 Gaps Menores (Gap #10-15) - Fase 12

| Gap | Módulo | Impacto | Complejidad | Owner | Deadline Validación |
|-----|--------|---------|-------------|-------|---------------------|
| **Gap #10** | Presupuestos y Costos | Bajo | Media | Data Scientist | 04-abr-2026 |
| **Gap #11** | Tesorería y Flujo | Bajo | Media | Backend | 04-abr-2026 |
| **Gap #12** | Cumplimiento Normativo | Bajo | Baja | Backend | 04-abr-2026 |
| **Gap #13** | Outsourcing Contable | Bajo | Media | Backend + DevOps | 04-abr-2026 |
| **Gap #14** | Auditoría Externa | Bajo | Alta | Backend + Auditor | 04-abr-2026 |
| **Gap #15** | Consultoría Especializada | Bajo | Alta | AI Engineer | 04-abr-2026 |

---

## ⚙️ Investigaciones Técnicas Complementarias

### Plan Maestro de 44 Investigaciones

**Documento principal:** [INVESTIGACIONES_TECNICAS_COMPLEMENTARIAS-2026-03-10.md](INVESTIGACIONES_TECNICAS_COMPLEMENTARIAS-2026-03-10.md) ← MOVIDO A RAÍZ DE Research/

| Prioridad | Cantidad | Effort Total | Semanas | Estado |
|-----------|----------|--------------|---------|--------|
| 🔴 **Crítica** | 18 investigaciones | 144 horas | 6 semanas | ✅ Completado |
| 🟡 **Alta** | 20 investigaciones | 128 horas | 4 semanas | ✅ Completado |
| 🟢 **Media** | 6 investigaciones | 50 horas | 2 semanas | ✅ Completado |
| **TOTAL** | **44 investigaciones** | **322 horas** | **12 semanas** | ✅ Completado |

### Distribución por Módulo

| Módulo | Investigaciones | Archivos Clave | Líneas Totales |
|--------|-----------------|----------------|----------------|
| **Módulo 1: Conciliación** | 4 | `formatos-estados-cuenta-bancos-mexico.md`, `llm-validation-conciliacion.md` | ~1,260 |
| **Módulo 2: CFDI** | 4 | `2.1-estructura-cfdi-4-0-anexo-20.md`, `2.2-catalogos-sat-cfdi-2026.md` | ~2,597 |
| **Módulo 3: Clasificación** | 2 | `3.1-catalogo-cuentas-nif-b-3-detallado.md`, `3.2-embedding-cuentas-contables-mexico.md` | ~1,884 |
| **Módulo 4: Nómina** | 5 | `4.1-tablas-imss-inf onavit-2026.md`, `4.2-cfdi-nomina-1-2-revision-e.md` | ~3,850 |
| **Módulo 5: Forecasting** | 1 | `5.1-dataset-historico-impuestos-mexico.md` | ~750 |
| **Módulo 6: Auditoría** | 3 | `6.1-nia-530-muestreo-estadistico-guia.md`, `6.2-caats-herramientas-auditoria.md` | ~2,330 |
| **Módulo 7: ISR/IVA** | 3 | `7.1-regimenes-fiscales-mexico-2026.md`, `7.2-deducciones-personales-isr-2026.md` | ~2,150 |
| **Módulo 8: Asesoría** | 3 | `8.1-rag-legislacion-fiscal-mexicana.md`, `8.2-tratados-tributarios-mexico-2026.md` | ~3,400 |
| **Módulo 9: CxC/CxP** | 4 | `9.1-apis-pago-mexico-2026.md`, `9.2-integracion-spei-stp-2026.md` | ~2,350 |
| **Módulo 10: EEFF** | 3 | `10.1-nif-b-2-a-b-7-estructura.md`, `10.2-razones-financieras-formulas-mexico.md` | ~1,580 |
| **Módulo 11: Presupuestos** | 1 | `11.1-prophet-forecasting-python-ejemplos.md` | ~520 |
| **Módulo 12: Tesorería** | 2 | `12.1-cetes-directo-api-2026.md`, `12.2-coberturas-cambiarias-forward.md` | ~1,120 |
| **Módulo 13: Cumplimiento** | 2 | `13.1-nom-stps-checklist-2026.md`, `13.2-uma-vuma-2026-valores.md` | ~980 |
| **Módulo 14: Outsourcing** | 2 | `14.1-multi-tenant-saas-contable.md`, `14.2-sla-acuerdos-nivel-servicio.md` | ~950 |
| **Módulo 15: Auditoría** | 3 | `15.1-due-diligence-financiero.md`, `15.2-dictamen-fiscal-sat-anexo-18.md` | ~1,800 |
| **Módulo 16: Consultoría** | 3 | `16.1-nis-b-1-indicadores-esg-2026.md`, `16.3-valuacion-empresas-mexico-metodos.md` | ~1,600 |
| **Módulo 17: Captura** | 4 | `17.1-xsd-cfdi-4-0-validacion.md`, `17.2-nvidia-nim-ocr-facturas-mexico.md` | ~3,841 |
| **Módulo 18: Declaraciones** | 2 | `18.1-formatos-declaraciones-sat-xml-dm1-dm2.md`, `18.2-integracion-portal-sat-automatizacion-playwright.md` | ~1,718 |
| **Módulo 19: Cont. Electrónica** | 2 | `19.1-anexo-24-contabilidad-electronica.md`, `19.2-buzon-tributario-sat-carga.md` | ~2,714 |

---

## ✅ Validación con Expertos

### Cronograma de Validación

| Fase | Gaps | Deadline | Owner | Estado |
|------|------|----------|-------|--------|
| **Fase 1** | Gap #1-5 (Críticos) | 21-mar-2026 | Contadores Certificados | ⏳ Pendiente |
| **Fase 2** | Gap #6-9 (Mayores) | 28-mar-2026 | Auditores Certificados | ⏳ Pendiente |
| **Fase 3** | Gap #10-15 (Menores) | 04-abr-2026 | Técnicos Especializados | ⏳ Pendiente |

### Paquetes de Validación

| Paquete | Gaps | Módulos | Archivo | Estado |
|---------|------|---------|---------|--------|
| **GAP01** | Gap #1 | Conciliación Bancaria | [GAP01_PAQUETE_VALIDACION.md](validacion/GAP01_PAQUETE_VALIDACION.md) | ⏳ Pendiente |
| **GAP02** | Gap #2 | Clasificación Contable | [GAP02_PAQUETE_VALIDACION.md](validacion/GAP02_PAQUETE_VALIDACION.md) | ⏳ Pendiente |
| **GAP03** | Gap #3 | Validación CFDI 69-B | [GAP03_PAQUETE_VALIDACION.md](validacion/GAP03_PAQUETE_VALIDACION.md) | ⏳ Pendiente |
| **GAP04** | Gap #4 | Cálculo ISR/IVA | [GAP04_PAQUETE_VALIDACION.md](validacion/GAP04_PAQUETE_VALIDACION.md) | ⏳ Pendiente |
| **GAP05** | Gap #5 | Forecasting Impuestos | [GAP05_PAQUETE_VALIDACION.md](validacion/GAP05_PAQUETE_VALIDACION.md) | ⏳ Pendiente |
| **GAP06-09** | Gap #6-9 | Auditoría, Fiscal, CxC/CxP, EEFF | [GAP06-09_PAQUETES_VALIDACION.md](validacion/GAP06-09_PAQUETES_VALIDACION.md) | ⏳ Pendiente |
| **GAP10-15** | Gap #10-15 | Presupuestos, Tesorería, Cumplimiento, Outsourcing, Auditoría, Consultoría | [GAP10-15_PAQUETES_VALIDACION.md](validacion/GAP10-15_PAQUETES_VALIDACION.md) | ⏳ Pendiente |

### Plantillas de Validación

| Plantilla | Propósito | Archivo |
|-----------|-----------|---------|
| **Email Templates** | 5 templates para solicitar validación | [EMAIL_TEMPLATES.md](validacion/EMAIL_TEMPLATES.md) |
| **Plantilla Investigación** | Estándar de 10 secciones | [PLANTILLA_INVESTIGACION.md](plantillas/PLANTILLA_INVESTIGACION.md) |
| **Checklist Validación** | Criterios de 100 puntos | [CHECKLIST_VALIDACION.md](plantillas/CHECKLIST_VALIDACION.md) |
| **Control de Cambios** | Historial de versiones | [CONTROL_CAMBIOS.md](plantillas/CONTROL_CAMBIOS.md) |

---

## 📅 Plan Maestro de Implementación

### Fases de Implementación

**Documento principal:** [PLAN_MAESTRO_IMPLEMENTACION.md](../PLAN_MAESTRO_IMPLEMENTACION.md)

| Fase | Descripción | Duración | Owner | Estado | Start Date | End Date |
|------|-------------|----------|-------|--------|------------|----------|
| **Fase 8** | Tests E2E | 2 semanas | QA Engineer | ✅ Completada | 10-feb-2026 | 24-feb-2026 |
| **Fase 9** | Conciliación + Clasificación + Captura CFDI + Declaraciones + Cont. Electrónica | 4 semanas | Backend + ML + Frontend | 🔄 En curso | 25-feb-2026 | 25-mar-2026 |
| **Fase 10** | Dashboard Predictivo | 3 semanas | Data Scientist + Backend | ⏳ Pendiente | 26-mar-2026 | 15-abr-2026 |
| **Fase 11** | Agentes Nómina + Fiscales | 4 semanas | Backend + Contador | ⏳ Pendiente | 16-abr-2026 | 13-may-2026 |
| **Fase 12** | Escalamiento + Producción | 3 semanas | DevOps + Security | ⏳ Pendiente | 14-may-2026 | 03-jun-2026 |

### Dependencias Críticas

```
Fase 8 (Tests E2E) ✅
  │
  ↓
Fase 9 (Conciliación + Clasificación + Captura CFDI) 🔄
  ├── Depende de: IDP OCR completado (Fase 7) ✅
  ├── Depende de: ChromaDB configurado ✅
  ├── Depende de: NVIDIA NIM API key ✅
  └── Habilita: Dashboard Predictivo (Fase 10)
  │
  ↓
Fase 10 (Dashboard Predictivo) ⏳
  ├── Depende de: Histórico 6+ meses (Fase 9)
  ├── Depende de: Prophet instalado
  └── Habilita: Agentes de Nómina (Fase 11)
  │
  ↓
Fase 11 (Agentes Nómina + Fiscales) ⏳
  ├── Depende de: Cálculo ISR/IVA (Fase 9-10)
  ├── Depende de: PAC contratado (Finkok, SW)
  ├── Depende de: CSD tramitado
  └── Habilita: Escalamiento (Fase 12)
  │
  ↓
Fase 12 (Escalamiento + Producción) ⏳
  ├── Depende de: Todas las fases anteriores
  ├── Depende de: Validación con expertos (GAP01-GAP15)
  └── Habilita: Lanzamiento comercial
```

### Criterios de Éxito por Fase

| Fase | Criterios de Éxito | KPIs |
|------|-------------------|------|
| **Fase 9** | - 95% matches exactos en conciliación<br>- 90% precisión en clasificación<br>- OCR 98% precisión<br>- Declaraciones generadas correctamente | - 500+ transacciones conciliadas<br>- 1,000+ conceptos clasificados<br>- 100+ CFDIs capturados |
| **Fase 10** | - Dashboard funcional<br>- Proyección 90 días<br>- Tax Health Score implementado | - 12+ meses histórico<br>- 5+ modelos Prophet<br>- MAPE < 10% |
| **Fase 11** | - Cálculo nómina preciso<br>- Timbrado PAC funcional<br>- Asesoría fiscal con RAG | - 50+ nóminas calculadas<br>- 100+ timbrados<br>- 95% precisión fiscal |
| **Fase 12** | - Sistema multi-tenant<br>- SLA 99.9%<br>- Seguridad certificada | - 50+ clientes concurrentes<br>- < 100ms latencia<br>- 0 incidentes seguridad |

---

## 📊 Métricas y KPIs

### Calidad de Investigaciones

| Métrica | Target | Actual | Estado |
|---------|--------|--------|--------|
| **Puntos promedio en checklists** | 90+ | 93/100 | ✅ Superado |
| **Fuentes por documento** | 10+ | 18.2 promedio | ✅ Superado |
| **Queries Tavily por documento** | 4+ | 4.0 exactos | ✅ Cumplido |
| **Líneas por documento** | 300-500 | 550 promedio | ✅ Superado |
| **Control de cambios** | 100% | 100% | ✅ Cumplido |

### Fuentes Oficiales Consultadas

| Institución | Fuentes | Documentos Relacionados |
|-------------|---------|------------------------|
| **SAT** | 85+ | CFDI 4.0, Anexo 24, 69-B, Regímenes Fiscales, Declaraciones |
| **IMSS** | 42+ | Cuotas obrero-patronales, CFDI Nómina, Incidencias |
| **INFONAVIT** | 18+ | Cuotas vivienda, Descuentos nómina |
| **CINIF** | 35+ | NIF B-2 a B-7, NIF A-3, NIF B-1 |
| **DOF** | 28+ | LISR, LIVA, CFF, LFT actualizadas 2026 |
| **Banxico** | 15+ | Tipos de cambio, CETES, forwards |
| **STPS** | 13+ | NOMs laborales, UMA/VUMA |
| **ISSB** | 8+ | NIIF S1/S2 ESG |
| **Otros** | 101+ | PACs, APIs de pago, tratados tributarios |
| **TOTAL** | **345+** | **98 documentos** |

### Estado de Validación

| Tipo Validación | Target | Actual | % | Deadline |
|-----------------|--------|--------|---|----------|
| **Validación crítica (Gap #1-5)** | 5 | 0 | 0% | 21-mar-2026 |
| **Validación mayor (Gap #6-9)** | 4 | 0 | 0% | 28-mar-2026 |
| **Validación menor (Gap #10-15)** | 6 | 0 | 0% | 04-abr-2026 |
| **TOTAL** | **15** | **0** | **0%** | **04-abr-2026** |

### Avance por Fase

| Fase | Owner | Start Date | End Date | Estado | % Avance |
|------|-------|------------|----------|--------|----------|
| **Fase 8** | QA Engineer | 10-feb-2026 | 24-feb-2026 | ✅ Completada | 100% |
| **Fase 9** | Backend + ML + Frontend | 25-feb-2026 | 25-mar-2026 | 🔄 En curso | 45% |
| **Fase 10** | Data Scientist + Backend | 26-mar-2026 | 15-abr-2026 | ⏳ Pendiente | 0% |
| **Fase 11** | Backend + Contador | 16-abr-2026 | 13-may-2026 | ⏳ Pendiente | 0% |
| **Fase 12** | DevOps + Security | 14-may-2026 | 03-jun-2026 | ⏳ Pendiente | 0% |

---

## 🔗 Anexos

### Glosario de Términos

| Término | Definición |
|---------|------------|
| **69-B** | Lista de contribuyentes EFO/EDO (Empresas que Facturan Operaciones Simuladas / Empresas que Dedujeron Operaciones Simuladas) |
| **CAATs** | Computer-Assisted Audit Tools (Herramientas de auditoría asistida por computadora) |
| **CFDI** | Comprobante Fiscal Digital por Internet |
| **CFF** | Código Fiscal de la Federación |
| **CINIF** | Consejo Mexicano para la Emisión de Normas de Información Financiera |
| **CSD** | Certificado de Sello Digital |
| **DOF** | Diario Oficial de la Federación |
| **ESG** | Environmental, Social, and Governance (Ambiental, Social y de Gobernanza) |
| **EFO** | Empresa que Factura Operaciones Simuladas |
| **EDO** | Empresa que Dedujeron Operaciones Simuladas |
| **IMSS** | Instituto Mexicano del Seguro Social |
| **INFONAVIT** | Instituto del Fondo Nacional de la Vivienda para los Trabajadores |
| **ISSB** | International Sustainability Standards Board |
| **LISR** | Ley del Impuesto Sobre la Renta |
| **LIVA** | Ley del Impuesto al Valor Agregado |
| **LFT** | Ley Federal del Trabajo |
| **NIA** | Normas Internacionales de Auditoría |
| **NIF** | Normas de Información Financiera |
| **NIIF** | Normas Internacionales de Información Financiera |
| **NOM** | Norma Oficial Mexicana |
| **PAC** | Proveedor Autorizado de Certificación |
| **RESICO** | Régimen Simplificado de Confianza |
| **RMF** | Resolución Miscelánea Fiscal |
| **SAT** | Servicio de Administración Tributaria |
| **SPEI** | Sistema de Pagos Electrónicos Interbancarios |
| **STP** | Sistema de Transferencias y Pagos |
| **STPS** | Secretaría del Trabajo y Previsión Social |
| **UMA** | Unidad de Medida y Actualización |
| **VUMA** | Valor de la Unidad de Medida y Actualización |

### Fuentes Oficiales Principales

| Institución | URL | Documentos Relacionados |
|-------------|-----|------------------------|
| **SAT** | [www.sat.gob.mx](https://www.sat.gob.mx) | CFDI, Anexo 24, 69-B, Catálogos, RMF |
| **IMSS** | [www.imss.gob.mx](https://www.imss.gob.mx) | Cuotas, CFDI Nómina, Incidencias |
| **INFONAVIT** | [www.infonavit.org.mx](https://www.infonavit.org.mx) | Cuotas vivienda, Descuentos |
| **CINIF** | [www.cinif.org.mx](https://www.cinif.org.mx) | NIF B-1 a B-7 |
| **DOF** | [www.dof.gob.mx](https://www.dof.gob.mx) | LISR, LIVA, CFF, LFT |
| **Banxico** | [www.banxico.org.mx](https://www.banxico.org.mx) | Tipos de cambio, CETES |
| **STPS** | [www.gob.mx/stps](https://www.gob.mx/stps) | NOMs, UMA/VUMA |
| **ISSB** | [www.ifrs.org/issb](https://www.ifrs.org/issb) | NIIF S1/S2 |

### Contactos para Validación

| Rol | Perfil | Gap ID | Contacto |
|-----|--------|--------|----------|
| **Contador Certificado** | CPA con 10+ años experiencia | Gap #1-5 | [Por definir] |
| **Auditor Certificado** | CPA con certificación NIA | Gap #6-9 | [Por definir] |
| **Técnico Especializado** | Especialista en área específica | Gap #10-15 | [Por definir] |

### Documentos Clave

| Documento | Propósito | Ubicación |
|-----------|-----------|-----------|
| **GUIA_INVESTIGACION_TECNICA.md** | Metodología de investigación | [Raíz](GUIA_INVESTIGACION_TECNICA.md) |
| **PLAN_MAESTRO_IMPLEMENTACION.md** | Roadmap de implementación | [Raíz](PLAN_MAESTRO_IMPLEMENTACION.md) |
| **INVESTIGACIONES_TECNICAS_COMPLEMENTARIAS.md** | Plan de 44 investigaciones | [02-investigaciones-tecnicas/](02-investigaciones-tecnicas/INVESTIGACIONES_TECNICAS_COMPLEMENTARIAS-2026-03-10.md) |
| **CHECKLISTS_CONSOLIDADOS.md** | Consolidado de checklists | [plantillas/](plantillas/CHECKLISTS_CONSOLIDADOS.md) |
| **EMAIL_TEMPLATES.md** | Templates para validación | [validacion/](validacion/EMAIL_TEMPLATES.md) |

---

## 📝 Historial de Cambios

| Versión | Fecha | Autor | Cambios | Sección |
|---------|-------|-------|---------|---------|
| **v1.0** | 10-mar-2026 | Apex-Analyst | Creación inicial del INDEX.md | Todo el documento |

---

**Elaborado por:** Apex-Analyst (AI Research Team)  
**Fecha:** 10 de marzo de 2026  
**Estado:** ✅ 100% Investigaciones Completadas | ⏳ 0% Validaciones Completadas  
**Próximo hito:** Validación Gap #1-5 (21-mar-2026)

---

*Este índice se actualizará conforme avance la validación con expertos y la implementación de las fases del proyecto.*
