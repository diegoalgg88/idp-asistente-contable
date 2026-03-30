# 🏗️ Infraestructura, Costos y Límites Operativos - IDP Asistente Contable

**Versión:** 1.0  
**Fecha:** 7 de marzo de 2026  
**Estado:** ✅ Aprobado para implementación

---

## 📋 Resumen Ejecutivo

Este documento complementa el plan principal con información **crítica de infraestructura** identificada durante la investigación técnica de NVIDIA NIM. Contiene:

1. Límites operativos de licencias NVIDIA NIM
2. Recomendaciones de hardware por escenario
3. Estimación de costos (CAPEX vs OPEX)
4. Matriz de riesgos de infraestructura
5. Estrategia de escalamiento

---

## 1️⃣ Límites de Licencia NVIDIA NIM

### Modelo de Licencias

| Tipo de Licencia | Límite | Costo | Uso Recomendado |
|-----------------|--------|-------|-----------------|
| **NIM Develop** | 40 RPM (2,400/hora) | Gratuito | Desarrollo, testing, pilotos |
| **NIM Enterprise** | Ilimitado | Cotizar con NVIDIA | Producción a escala |
| **NIM Enterprise-AI** | Ilimitado + SLA | Premium | Producción crítica |

### Conversión de Límites

```
40 RPM (requests per minute)
  = 2,400 requests/hora
  = 57,600 requests/día (24h)
  = 1,728,000 requests/mes (30 días)
```

### Impacto en Casos de Uso Reales

| Caso de Uso | Requests por documento | Documentos/día máx. | ¿Suficiente Develop? |
|-------------|------------------------|---------------------|----------------------|
| **OCR Factura** | 3 requests (OCR + Table + Validate) | ~19,200 facturas | ✅ Sí (despacho pequeño) |
| **Embedding RAG** | 1 request por chunk (5 chunks/query) | ~11,520 queries | ✅ Sí |
| **LLM Response** | 1 request por respuesta | ~57,600 respuestas | ✅ Sí |
| **Pipeline completo IDP** | 5 requests (OCR+Table+Embed+Classify+Validate) | ~11,520 facturas | ⚠️ Límite para despacho mediano |

> **⚠️ Advertencia Crítica:** Si tu despacho procesa **más de 11,520 facturas/día** o tiene **más de 50 usuarios concurrentes**, necesitarás licencia **Enterprise**.

---

## 2️⃣ Hardware Recomendado por Escenario

### Escenario 1: Desarrollo/Testing (CPU-only)

| Componente | Especificación | Costo Estimado |
|------------|----------------|----------------|
| **CPU** | 8-core / 16-thread (Ryzen 7 o i7) | Incluido en workstation |
| **RAM** | 32 GB DDR4 | $100 USD |
| **Almacenamiento** | 500 GB NVMe SSD | $50 USD |
| **GPU** | Ninguna (integrada) | $0 |
| **Total** | | **~$150 USD** (upgrade) |

**Performance Esperado:**
- OCR 1 factura: ~30 segundos
- 100 facturas: ~50 minutos
- Throughput máximo: ~2-3 RPS (requests por segundo)
- Límite práctico: ~200-300 facturas/hora

**Recomendado para:**
- Desarrollo local
- Testing de pipelines
- Pilotos pequeños (<500 facturas)

---

### Escenario 2: Producción Baja (GPU RTX 4090)

| Componente | Especificación | Costo Estimado |
|------------|----------------|----------------|
| **CPU** | 16-core / 32-thread (Ryzen 9 o i9) | $500 USD |
| **RAM** | 64 GB DDR5 | $200 USD |
| **Almacenamiento** | 1 TB NVMe SSD | $100 USD |
| **GPU** | NVIDIA RTX 4090 (24GB VRAM) | $1,600 USD |
| **PSU** | 1000W 80+ Gold | $150 USD |
| **Total** | | **~$2,550 USD** |

**Performance Esperado:**
- OCR 1 factura: ~2-3 segundos
- 100 facturas: ~3-5 minutos
- Throughput máximo: ~20 RPS
- Límite práctico: ~7,000 facturas/hora

**Recomendado para:**
- Despachos pequeños/medianos (10-50 clientes)
- Producción con <5,000 facturas/día
- Fine-tuning de modelos BERT

---

### Escenario 3: Producción Alta (GPU H100 Cloud)

| Componente | Especificación | Costo Estimado |
|------------|----------------|----------------|
| **Instancia Cloud** | 1× NVIDIA H100 (80GB) | $2.50/hora |
| **vCPU** | 32 vCPU | Incluido |
| **RAM** | 256 GB | Incluido |
| **Almacenamiento** | 2 TB NVMe | $200/mes |
| **Total (mensual)** | 720 horas × $2.50 | **~$1,800 USD/mes** |

**Performance Esperado:**
- OCR 1 factura: ~0.5-1 segundo
- 100 facturas: ~1-2 minutos
- Throughput máximo: ~100+ RPS
- Límite práctico: ~35,000+ facturas/hora

**Recomendado para:**
- Despachos grandes (50+ clientes)
- Producción con >10,000 facturas/día
- Múltiples tenants concurrentes
- Fine-tuning de LLMs

---

### Escenario 4: Producción Multi-GPU (Kubernetes)

| Componente | Especificación | Costo Estimado |
|------------|----------------|----------------|
| **Cluster K8s** | 4× nodos H100 | $10/hora |
| **Load Balancer** | Kong/AWS ALB | $50/mes |
| **Storage** | S3-compatible | $100/mes |
| **Total (mensual)** | | **~$7,500 USD/mes** |

**Performance Esperado:**
- Throughput máximo: ~400+ RPS
- Límite práctico: ~140,000+ facturas/hora
- Alta disponibilidad (99.9% SLA)

**Recomendado para:**
- SaaS multi-tenant
- >50,000 facturas/día
- Múltiples regiones

---

## 3️⃣ Estimación de Costos Totales

### CAPEX (Inversión Inicial)

| Concepto | Escenario Bajo | Escenario Alto |
|----------|----------------|----------------|
| **Hardware (RTX 4090)** | $2,550 USD | - |
| **Hardware (H100 on-prem)** | - | $30,000+ USD |
| **Setup inicial cloud** | - | $500 USD |
| **Licencias software** | $0 (open-source) | $500 USD |
| **Total CAPEX** | **$2,550 - $3,050 USD** | **$30,500+ USD** |

---

### OPEX (Costos Operativos Mensuales)

| Concepto | Escenario Bajo | Escenario Alto |
|----------|----------------|----------------|
| **Cloud GPU (H100)** | $0 (on-prem) | $1,800 USD |
| **Cloud Multi-GPU** | $0 | $7,500 USD |
| **NIM Enterprise** | $0 (Develop) | Cotizar (~$5K/mes) |
| **Almacenamiento S3** | $50 USD (1TB) | $200 USD (10TB) |
| **Electricidad** | $50 USD | $200 USD |
| **Mantenimiento** | $100 USD | $500 USD |
| **Total OPEX** | **~$200 USD/mes** | **~$15,000+ USD/mes** |

---

### Costo por Documento Procesado

| Volumen | CPU-only | RTX 4090 | H100 Cloud |
|---------|----------|----------|------------|
| **1,000 facturas/mes** | $0.15/doc | $0.08/doc | $0.50/doc |
| **10,000 facturas/mes** | $0.05/doc | $0.02/doc | $0.15/doc |
| **100,000 facturas/mes** | $0.02/doc | $0.008/doc | $0.05/doc |

> **💡 Insight:** A mayor volumen, más conveniente es GPU. CPU-only solo es viable para <5,000 facturas/mes.

---

## 4️⃣ Matriz de Riesgos de Infraestructura

| Riesgo | Probabilidad | Impacto | Mitigación | Owner |
|--------|--------------|---------|------------|-------|
| **Límite 40 RPM insuficiente** | Media (30%) | Alto | Rate limiting, cola de requests, upgrade a Enterprise | DevOps |
| **CPU demasiado lento para producción** | Alta (80%) | Alto | GPU RTX 4090 en Fase 2, procesamiento asíncrono | Tech Lead |
| **Fine-tuning inviable sin GPU** | Alta (90%) | Medio | Postponer personalización a Fase 3, usar modelos pre-entrenados | ML Engineer |
| **Sin casos de estudio contables** | Media (40%) | Medio | Piloto interno con 5K facturas, métricas de precisión | QA Lead |
| **Costos cloud exceden presupuesto** | Media (35%) | Alto | Optimizar queries, caching agresivo, spot instances | FinOps |
| **GPU H100 sin disponibilidad cloud** | Baja (10%) | Alto | Multi-cloud (AWS + Azure + GCP), RTX 4090 on-prem | DevOps |
| **NIM API downtime** | Baja (15%) | Crítico | Fallback a Tesseract/EasyOCR, circuit breaker | Backend Lead |

---

## 5️⃣ Estrategia de Escalamiento

### Fase 1: MVP (Mes 1-2)

**Infraestructura:** CPU-only (desarrollo)
- **Volumen:** <500 facturas/día
- **Usuarios:** <10 concurrentes
- **Costo:** $0 (hardware existente)
- **Riesgo:** Lentitud aceptable para MVP

---

### Fase 2: Piloto Producción (Mes 3-4)

**Infraestructura:** RTX 4090 on-prem
- **Volumen:** <5,000 facturas/día
- **Usuarios:** <50 concurrentes
- **Costo:** $2,550 USD (CAPEX) + $200/mes (OPEX)
- **Riesgo:** Suficiente para validar product-market fit

---

### Fase 3: Producción Temprana (Mes 5-6)

**Infraestructura:** H100 cloud (1 instancia)
- **Volumen:** <20,000 facturas/día
- **Usuarios:** <200 concurrentes
- **Costo:** $1,800/mes (OPEX)
- **Riesgo:** Escalabilidad elástica según demanda

---

### Fase 4: Escalamiento (Mes 7-8)

**Infraestructura:** H100 cloud (multi-instancia) + NIM Enterprise
- **Volumen:** >50,000 facturas/día
- **Usuarios:** >500 concurrentes
- **Costo:** $7,500+/mes (OPEX) + Enterprise license
- **Riesgo:** Complejidad de orquestación (Kubernetes)

---

## 6️⃣ Decisiones Críticas por Tomar

### Decisión 1: ¿GPU on-prem o cloud?

| Criterio | On-Prem (RTX 4090) | Cloud (H100) |
|----------|-------------------|--------------|
| **CAPEX** | $2,550 USD (una vez) | $0 |
| **OPEX** | $50/mes (electricidad) | $1,800/mes |
| **Break-even** | ~2 meses | N/A |
| **Mantenimiento** | Tu responsabilidad | Incluido |
| **Escalabilidad** | Limitada | Elástica |
| **Recomendación** | **Fase 2** | **Fase 3+** |

---

### Decisión 2: ¿Cuándo upgrade a NIM Enterprise?

**Señales de alerta:**
- ✅ Quédate en Develop si: <40 RPM promedio (2,400/hora)
- ⚠️ Considera Enterprise si: 30-40 RPM sostenidos (80% del límite)
- 🔴 Upgrade inmediato si: >40 RPM o errores de rate limit

**Proceso de upgrade:**
1. Contactar ventas NVIDIA (2-4 semanas)
2. Negociar volumen y SLA
3. Migrar keys de API (downtime <1 hora)

---

### Decisión 3: ¿Fine-tuning o prompt engineering?

| Enfoque | Costo | Tiempo | Precisión | Recomendación |
|---------|-------|--------|-----------|---------------|
| **Prompt engineering** | $0 | 1-2 días | 85-90% | **Fase 1-2** |
| **Adapter-tuning (LoRA)** | $500 (GPU cloud) | 1-2 semanas | 90-95% | **Fase 3** |
| **Full fine-tuning** | $5,000+ (GPU cluster) | 1-2 meses | 95-98% | **Fase 4** |

---

## 7️⃣ Checklist de Infraestructura

### Para Comenzar (Fase 1 - CPU-only)

- [ ] Workstation con 8-core CPU
- [ ] 32 GB RAM (upgrade si <32GB)
- [ ] 500 GB SSD NVMe
- [ ] Docker Desktop instalado
- [ ] NVIDIA API key ( Develop license)
- [ ] Variables de entorno configuradas

---

### Para Piloto (Fase 2 - RTX 4090)

- [ ] RTX 4090 comprada e instalada
- [ ] PSU 1000W 80+ Gold
- [ ] Drivers NVIDIA actualizados
- [ ] Docker con soporte GPU (nvidia-docker)
- [ ] Monitoring de temperatura GPU
- [ ] Backup de datos configurado

---

### Para Producción (Fase 3+ - H100 Cloud)

- [ ] Cuenta AWS/Azure/GCP creada
- [ ] Instancia H100 provisionada
- [ ] Security groups configurados
- [ ] Load balancer (Kong/ALB)
- [ ] Auto-scaling configurado
- [ ] Monitoring (Prometheus + Grafana)
- [ ] Alertas de costo (budget alerts)
- [ ] Backup automatizado (S3 + snapshots)

---

## 8️⃣ KPIs de Infraestructura

| KPI | Target | Alert Threshold | Medición |
|-----|--------|-----------------|----------|
| **Latencia OCR (p95)** | <3s (GPU), <30s (CPU) | >5s (GPU), >60s (CPU) | Prometheus |
| **Throughput** | >20 RPS (GPU), >2 RPS (CPU) | <15 RPS (GPU), <1 RPS (CPU) | Grafana |
| **GPU Utilization** | 60-80% | <40% o >95% | nvidia-smi |
| **RAM Usage** | <80% | >90% | System metrics |
| **Costo por documento** | <$0.05 (alto volumen) | >$0.10 | FinOps dashboard |
| **API Error Rate** | <1% | >2% | API logs |
| **Rate Limit Hits** | 0 | >10/día | NIM dashboard |

---

## 9️⃣ Referencias y Recursos

### Documentación Oficial

| Recurso | URL |
|---------|-----|
| NVIDIA NIM Docs | https://docs.nvidia.com/nim/ |
| NIM Pricing | https://www.nvidia.com/en-us/ai/nim/pricing/ |
| NIM Benchmarks | https://developer.nvidia.com/blog/nvidia-nemo-retriever-delivers-accurate-multimodal-pdf-data-extraction-15x-faster/ |
| H100 Cloud Pricing (AWS) | https://aws.amazon.com/ec2/instance-types/p4/ |
| H100 Cloud Pricing (Azure) | https://azure.microsoft.com/en-us/pricing/details/virtual-machines/ |

### Calculadoras de Costo

- **AWS Pricing Calculator:** https://calculator.aws/
- **Azure Pricing Calculator:** https://azure.microsoft.com/en-us/pricing/calculator/
- **GPU Cost Comparison:** https://cloud-gpus.com/

---

## 📞 Contacto para Decisiones

| Rol | Responsable | Decisión |
|-----|-------------|----------|
| **Tech Lead** | [Nombre] | Arquitectura, selección de hardware |
| **FinOps** | [Nombre] | Presupuesto, aprobación de gastos cloud |
| **DevOps Lead** | [Nombre] | Deployment, monitoring, alertas |
| **Product Owner** | [Nombre] | Priorización de fases (2, 3, 4) |

---

**Última actualización:** 7 de marzo de 2026  
**Próxima revisión:** 14 de marzo de 2026 (post-piloto)
