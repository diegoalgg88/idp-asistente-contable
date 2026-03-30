# Guía para Realización de Investigaciones Técnicas - IDP-App

**Fecha:** 10 de marzo de 2026
**Versión:** 1.0
**Propósito:** Establecer metodología estandarizada para investigación técnica de módulos
**Aplicación:** Todos los módulos del IDP-App Asistente Contable

---

## 1. Objetivo de la Guía

Estandarizar el proceso de investigación técnica para garantizar:
- ✅ **Consistencia** en formato y profundidad de investigación
- ✅ **Completitud** de aspectos técnicos, normativos y de mercado
- ✅ **Trazabilidad** entre investigación e implementación
- ✅ **Calidad** de documentación técnica generada

---

## 2. Alcance

Esta guía aplica para investigación de:
- **Módulos críticos** (Conciliación, CFDI, Clasificación, Nómina, Forecasting)
- **Gaps identificados** (15 gaps en ANALISIS_GAPS_INVESTIGACION.md)
- **Nuevas funcionalidades** (Fases 9-12 del roadmap)

---

## 3. Metodología de Investigación

### 3.1 Fases de Investigación (OBLIGATORIO)

```
┌─────────────────────────────────────────────────────────────┐
│                    FASE 1: PLANIFICACIÓN                     │
│  - Definir alcance del módulo                               │
│  - Identificar fuentes de información                       │
│  - Estimar tiempo de investigación                          │
│  - Revisar TRACKING_INVESTIGACION.md para Gap ID            │
│  - DURACIÓN: 2-4 horas                                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    FASE 2: RECOLECCIÓN ⚠️ CRÍTICA           │
│  - Investigación documental (normativa, leyes)              │
│  - Investigación de mercado (proveedores, APIs)             │
│  - Investigación técnica (algoritmos, modelos)              │
│  - USAR HERRAMIENTAS: Tavily web_search (4+ queries)        │
│  - Mínimo 10 fuentes consultadas                            │
│  - DURACIÓN: 8-12 horas                                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    FASE 3: ANÁLISIS                          │
│  - Validar información con fuentes primarias                │
│  - Identificar limitantes y restricciones                   │
│  - Definir métricas esperadas                               │
│  - Cruzar información de múltiples fuentes                  │
│  - DURACIÓN: 4-6 horas                                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    FASE 4: DOCUMENTACIÓN                     │
│  - Redactar documento técnico usando PLANTILLA              │
│  - Incluir código de ejemplo funcional                      │
│  - Citar TODAS las fuentes con URLs verificadas             │
│  - Agregar control de cambios (versiones 1.0, 1.1, 1.2)     │
│  - DURACIÓN: 6-8 horas                                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    FASE 5: VALIDACIÓN                        │
│  - Validar con contador certificado                         │
│  - Validar con equipo de desarrollo                         │
│  - Actualizar TRACKING_INVESTIGACION.md                     │
│  - Actualizar PLAN_MAESTRO_IMPLEMENTACION.md                │
│  - DURACIÓN: 2-4 horas                                      │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Reglas de Oro (NO OLVIDAR)

| # | Regla | Descripción | Consecuencia si no se cumple |
|---|-------|-------------|------------------------------|
| **1** | **FASE 2 es OBLIGATORIA** | Usar Tavily web_search con mínimo 4 queries | Investigación sin fuentes reales = RECHAZADA |
| **2** | **Mínimo 10 fuentes** | Consultar al menos 10 fuentes oficiales/técnicas | Información no verificada = RECHAZADA |
| **3** | **Usar plantillas** | Usar `plantillas/PLANTILLA_INVESTIGACION.md` | Formato inconsistente = RECHAZADA |
| **4** | **Control de cambios** | Documentar versiones (1.0, 1.1, 1.2) con Tavily | Sin trazabilidad = RECHAZADA |
| **5** | **Actualizar TRACKING** | Actualizar `TRACKING_INVESTIGACION.md` | Sin tracking = NO CONTABILIZADA |
| **6** | **Actualizar PLAN_MAESTRO** | Agregar mejoras al `PLAN_MAESTRO_IMPLEMENTACION.md` | Sin implementación = NO CONTABILIZADA |

---

## 4. Uso Obligatorio de Plantillas

### 4.1 Plantillas Disponibles

Todas las investigaciones DEBEN usar las plantillas en `Research/plantillas/`:

| Plantilla | Propósito | Ubicación |
|-----------|-----------|-----------|
| **PLANTILLA_INVESTIGACION.md** | Plantilla estándar para todas las investigaciones | `plantillas/PLANTILLA_INVESTIGACION.md` |
| **CHECKLIST_VALIDACION.md** | Checklist de validación (100 puntos) | `plantillas/CHECKLIST_VALIDACION.md` |
| **CONTROL_CAMBIOS.md** | Control de cambios y versiones | `plantillas/CONTROL_CAMBIOS.md` |

### 4.2 Cómo Usar las Plantillas

**Paso 1: Copiar plantilla**
```bash
# Copiar plantilla de investigación
cp Research/plantillas/PLANTILLA_INVESTIGACION.md \
   Research/01-investigaciones-modulos/07-[nombre-modulo].md
```

**Paso 2: Renombrar y llenar**
- Reemplazar `[nombre-modulo]` con nombre del módulo
- Llenar TODAS las secciones de la plantilla
- No eliminar secciones (pueden marcar como "No aplica" si es necesario)

**Paso 3: Usar checklist de validación**
- Copiar `CHECKLIST_VALIDACION.md`
- Llenar checklist (mínimo 90 puntos para aprobar)
- Adjuntar al documento final

**Paso 4: Agregar control de cambios**
- Copiar sección de `CONTROL_CAMBIOS.md`
- Documentar cada versión (1.0, 1.1, 1.2)
- Especificar si se usó Tavily y qué queries

### 4.3 Ejemplo de Control de Cambios (OBLIGATORIO)

```markdown
## 10. Control de Cambios

| Versión | Fecha | Autor | Tipo | Cambios Realizados | Sección Afectada |
|---------|-------|-------|------|-------------------|------------------|
| 1.0 | 10-mar-2026 | Diego Gzz | Creación | Versión inicial del documento | Todo el documento |
| 1.1 | 10-mar-2026 | Diego Gzz | Investigación | **Investigación profunda con Tavily** - Agregadas 10 fuentes oficiales del SAT, INDETEC, Expansión, Consolide | Secciones 2.3, 9 |
| 1.2 | 10-mar-2026 | Diego Gzz | Actualización | **Tablas ISR actualizadas** con valores oficiales 2026 (RMF Anexo 8 DOF 28-dic-2025) - Límites actualizados por inflación | Sección 3.2 |

**Notas de la actualización:**
- Las tablas ISR 2026 fueron actualizadas por inflación según RMF 2026 Anexo 8
- Límite inferior primer tramo: $0.01, límite superior primer tramo: $10,135.11 (actualizado de $7,734.99)
- Se agregó tramo adicional para ingresos >$4,256,419.90 con tasa 35%
- IVA fronterizo 8% vigente hasta 31-dic-2026 (estímulo fiscal)
```

---

## 5. Actualización del Plan Maestro de Implementación

### 5.1 Cuándo Actualizar PLAN_MAESTRO_IMPLEMENTACION.md

**DEBES actualizar el `PLAN_MAESTRO_IMPLEMENTACION.md` cuando:**

| Situación | Acción Requerida | Sección a Actualizar |
|-----------|------------------|---------------------|
| **Investigación completada** | Agregar documento a "Investigaciones Realizadas" | Sección 4.1 |
| **Nueva implementación** | Agregar a "Backend Implementations" o "Frontend Implementations" | Sección 5.x |
| **Corrección de error** | Agregar a "Control de Cambios" del módulo | Sección 10 del módulo |
| **Mejora de funcionalidad** | Actualizar "Estado Actual" del módulo | Sección 2.1 o 2.2 |
| **Nuevo gap identificado** | Agregar a "Investigaciones Pendientes" | Sección 4.2 |

### 5.2 Cómo Actualizar PLAN_MAESTRO_IMPLEMENTACION.md

**Ejemplo: Agregar investigación completada**

```markdown
### 4.1 Documentos de Investigación (Actualizado)

| # | Módulo | Archivo | Líneas | Estado | Gap ID |
|---|--------|---------|--------|--------|--------|
| 1 | Conciliación Bancaria | `01-conciliacion-bancaria.md` | ~350 | ✅ Completo | Gap #1 |
| 2 | Validación CFDI 69-B | `02-validacion-cfdi-69b.md` | ~400 | ✅ Completo | Gap #3 |
| 3 | Clasificación Contable | `03-clasificacion-contable.md` | ~350 | ✅ Completo | Gap #2 |
| 4 | Cálculo Nómina IMSS | `04-calculo-nomina-imss.md` | ~400 | ✅ Completo | Gap #7 |
| 5 | Forecasting Impuestos | `05-forecasting-impuestos.md` | ~350 | ✅ Completo | Gap #9 |
| 6 | **Cálculo ISR/IVA** | `06-calculo-isr-iva.md` | ~730 | ✅ Completo | **Gap #4** |

**Total:** ~2,400 líneas de investigación técnica (6 documentos)
```

**Ejemplo: Agregar implementación de backend**

```markdown
#### Backend Implementations (Actualizado)

| Semana | Componente | Archivo | Investigación | Estado |
|--------|------------|---------|---------------|--------|
| **1** | Modelos SQLAlchemy | `app/models/reconciliation.py` | `01-conciliacion-bancaria.md` | ⏳ Pendiente |
| **2** | **Calculadora ISR** | `app/services/fiscal/isr_calculator.py` | `06-calculo-isr-iva.md` | ✅ Completado |
| **2** | **Calculadora IVA** | `app/services/fiscal/iva_calculator.py` | `06-calculo-isr-iva.md` | ✅ Completado |
```

### 5.3 Control de Cambios del PLAN_MAESTRO

**Agregar al final del PLAN_MAESTRO_IMPLEMENTACION.md:**

```markdown
## 12. Control de Cambios del Plan Maestro

| Versión | Fecha | Autor | Cambios Realizados |
|---------|-------|-------|-------------------|
| 1.0 | 10-mar-2026 | Diego Gzz | Versión inicial del plan maestro |
| 1.1 | 10-mar-2026 | Diego Gzz | **Agregada investigación ISR/IVA** - Sección 4.1 actualizada con documento 06-calculo-isr-iva.md (730 líneas) |
| 1.2 | 10-mar-2026 | Diego Gzz | **Actualizada GUÍA_INVESTIGACION_TECNICA** - Agregadas 5 fases detalladas, uso obligatorio de plantillas, actualización de plan maestro |
```

---

## 6. Estructura del Documento de Investigación

### 4.1 Plantilla Estándar

````
# Investigación Técnica: [Nombre del Módulo]

**Fecha:** [Fecha de elaboración]
**Versión:** 1.0
**Módulo:** [Nombre del módulo]
**Prioridad:** 🔴 CRÍTICA / 🟡 ALTA / 🟢 MEDIA
**Gap ID:** Gap #[número]

---

## 1. Descripción del Módulo

### 1.1 Propósito
[Descripción clara del propósito del módulo]

### 1.2 Actividades del Contador que Automatiza
| Actividad | Frecuencia | Tiempo Actual | Tiempo Esperado | Ahorro |
|-----------|------------|---------------|-----------------|--------|
| [Actividad 1] | [Diario/Semanal/Mensual] | [X horas] | [Y horas] | [Z%] |

### 1.3 Dolor Principal que Resuelve
[Descripción del dolor/pain point del usuario]

---

## 2. Estado del Arte en México (2026)

### 2.1 Tecnologías Disponibles
| Tecnología | Proveedor | Estado | Costo | Documentación |
|------------|-----------|--------|-------|---------------|
| [Tecnología 1] | [Proveedor] | ✅ Activa | $X | [URL] |

### 2.2 Proveedores de APIs/Servicios
| Proveedor | API/Servicio | Sandbox | Autenticación | Límites |
|-----------|--------------|---------|---------------|---------|
| [Proveedor 1] | [Nombre API] | ✅ Sí | OAuth2 | 1000 req/día |

### 2.3 Regulación Aplicable (SAT, NIF, etc.)
| Norma/Regulación | Artículo | Vigencia | Impacto en Módulo |
|------------------|----------|----------|-------------------|
| [Norma 1] | Art. [número] | [Fecha] | [Descripción] |

### 2.4 Casos de Éxito Documentados
| Empresa | Caso | Resultado | Lección Aprendida |
|---------|------|-----------|-------------------|
| [Empresa 1] | [Descripción] | [Resultado] | [Lección] |

---

## 3. Implementación Técnica

### 3.1 Arquitectura Recomendada
[Diagrama ASCII o descripción de arquitectura]

### 3.2 Algoritmos Específicos (con código)
```python
#Código de ejemplo completo y funcional
def ejemplo_algoritmo(parametros):
    """
    Descripción del algoritmo.
    
    Args:
        parametros: Descripción de parámetros
    
    Returns:
        Descripción de retorno
    """
    # Implementación
    pass
```

### 3.3 Thresholds y Parámetros Óptimos

| Parámetro     | Valor Recomendado | Rango Aceptable | Justificación     |
| ------------- | ----------------- | --------------- | ----------------- |
| [Parámetro 1] | 0.85              | 0.70-0.95       | Basado en testing |

### 3.4 Integración con NVIDIA NIM

| Modelo     | Uso   | Costo        | Latencia | Configuración |
| ---------- | ----- | ------------ | -------- | ------------- |
| [Modelo 1] | [Uso] | $X/1K tokens | ~100ms   | [Config]      |

---

## 4. Limitantes y Restricciones

### 4.1 Limitación 1: [Nombre]

**Problema:**
[Descripción del problema]

**Solución:**

```python
# Código de solución o workaround
def solucion_limitacion():
    pass
```

### 4.2 Limitación 2: [Nombre]

**Problema:**
[Descripción del problema]

**Solución:**
[Descripción de solución]

### 4.3 Riesgos Técnicos Identificados

| Riesgo     | Probabilidad    | Impacto         | Mitigación   |
| ---------- | --------------- | --------------- | ------------ |
| [Riesgo 1] | ALTA/MEDIA/BAJA | ALTO/MEDIO/BAJO | [Mitigación] |

---

## 5. Métricas Esperadas

| Métrica     | Target | Fórmula                      | Medición        |
| ----------- | ------ | ---------------------------- | --------------- |
| [Métrica 1] | 85%+   | `(correctos / total) × 100`  | Por transacción |
| [Métrica 2] | <500ms | `tiempo_fin - tiempo_inicio` | Por operación   |

---

## 6. Roadmap de Implementación

### Fase [número]: [Nombre de la Fase] ([duración])

| Semana | Entregable     | Owner | Dependencias   | Criterio de Éxito |
| ------ | -------------- | ----- | -------------- | ----------------- |
| **1**  | [Entregable 1] | [Rol] | [Dependencias] | [Criterio]        |
| **2**  | [Entregable 2] | [Rol] | [Dependencias] | [Criterio]        |

---

## 7. Seguridad y Cumplimiento

### 7.1 Requisitos SAT para Sistemas Contables

| Requisito     | Descripción   | Impacto en Módulo |
| ------------- | ------------- | ----------------- |
| [Requisito 1] | [Descripción] | [Impacto]         |

### 7.2 Mejores Prácticas de Seguridad

| Capa      | Medida               | Implementación            |
| --------- | -------------------- | ------------------------- |
| **Datos** | Encriptación AES-256 | AWS KMS / Azure Key Vault |

---

## 8. Conclusiones y Recomendaciones

### Hallazgos Clave

1. [Hallazgo 1]
2. [Hallazgo 2]
3. [Hallazgo 3]

### Recomendaciones Finales

| Área     | Recomendación   | Prioridad       |
| -------- | --------------- | --------------- |
| [Área 1] | [Recomendación] | ALTA/MEDIA/BAJA |

---

**Documento elaborado para:** Equipo de desarrollo IDP-App
**Propósito:** Guiar implementación técnica del módulo [nombre]
**Próxima actualización:** Después de implementación de Fase [número]

---

*Fin de la Investigación de [Nombre del Módulo]*
````

---

## 7. Checklist de Contenido por Investigación

### Información General
- [ ] Descripción del módulo y propósito
- [ ] Actividades del contador que automatiza
- [ ] Frecuencia y tiempo promedio de la actividad
- [ ] Dolor principal que resuelve
- [ ] ROI esperado para el usuario

### Estado del Arte en México (2026)
- [ ] Tecnologías disponibles
- [ ] Proveedores de APIs/servicios
- [ ] Regulación aplicable (SAT, NIF, etc.)
- [ ] Casos de éxito documentados
- [ ] Tendencias de mercado

### Implementación Técnica
- [ ] Arquitectura recomendada (con diagrama)
- [ ] Algoritmos específicos (con código Python)
- [ ] Thresholds y parámetros óptimos
- [ ] Integración con NVIDIA NIM (modelos a usar)
- [ ] Ejemplos de código completos y funcionales

### Limitantes y Restricciones
- [ ] Limitación 1 + solución propuesta
- [ ] Limitación 2 + solución propuesta
- [ ] Riesgos técnicos identificados
- [ ] Estrategias de mitigación

### Métricas Esperadas
- [ ] Precisión/accuracy esperado
- [ ] Tiempo de procesamiento
- [ ] ROI para el usuario
- [ ] Criterios de aceptación

### Roadmap de Implementación
- [ ] Fases sugeridas
- [ ] Dependencias críticas
- [ ] Criterio de éxito por fase
- [ ] Owner recomendado por fase

### Seguridad y Cumplimiento
- [ ] Requisitos SAT aplicables
- [ ] Mejores prácticas de seguridad
- [ ] Consideraciones de privacidad
- [ ] Multas por incumplimiento

---

## 8. Fuentes de Información Recomendadas

### 8.1 Fuentes Oficiales
| Fuente        | URL                           | Tipo de Información                 |
| ------------- | ----------------------------- | ----------------------------------- |
| **SAT**       | https://www.sat.gob.mx/       | Normativa fiscal, CFDI, listas 69-B |
| **IMSS**      | https://www.imss.gob.mx/      | Cuotas patronales, normativa        |
| **INFONAVIT** | https://www.infonavit.org.mx/ | Aportaciones, descuentos            |
| **CINIF**     | https://www.cinif.org.mx/     | NIF, normas contables               |
| **IMCP**      | https://www.imcp.org.mx/      | Criterios contables, auditoría      |
| **DOF**       | https://www.dof.gob.mx/       | Publicación de normas, reformas     |
| **Banxico**   | https://www.banxico.org.mx/   | Tipo de cambio, UMA                 |
| **INEGI**     | https://www.inegi.org.mx/     | UMA, salarios mínimos               |

### 8.2 Fuentes Técnicas
| Fuente           | URL                                       | Tipo de Información             |
| ---------------- | ----------------------------------------- | ------------------------------- |
| **NVIDIA NIM**   | https://build.nvidia.com/                 | Modelos de IA, APIs, pricing    |
| **LangChain**    | https://python.langchain.com/             | Orquestación de LLM             |
| **LangGraph**    | https://langchain-ai.github.io/langgraph/ | Workflows de agentes            |
| **Prophet**      | https://facebook.github.io/prophet/       | Forecasting de series de tiempo |
| **Scikit-learn** | https://scikit-learn.org/                 | Modelos de ML                   |

### 8.3 Fuentes de Mercado
| Fuente                 | URL                                  | Tipo de Información |
| ---------------------- | ------------------------------------ | ------------------- |
| **BBVA Spark**         | https://developers.bbva.com/         | APIs bancarias      |
| **Santander Open API** | https://developers.santander.com.mx/ | APIs bancarias      |
| **STP**                | https://www.stp.com.mx/              | API SPEI            |
| **Finkok**             | https://finkok.com/                  | Timbrado CFDI       |
| **SW Sapien**          | https://www.sw.com.mx/               | Timbrado CFDI       |

---

## 9. Criterios de Calidad

### 9.1 Contenido Técnico
| Criterio               | Target        | Verificación                   |
| ---------------------- | ------------- | ------------------------------ |
| **Código funcional**   | 100%          | Ejecutar en entorno de pruebas |
| **Fuentes citadas**    | 100%          | Verificar URLs activas         |
| **Ejemplos numéricos** | 3+ por módulo | Verificar cálculos             |
| **Diagramas**          | 1+ por módulo | Claridad visual                |

### 9.2 Documentación
| Criterio       | Target               | Verificación                |
| -------------- | -------------------- | --------------------------- |
| **Estructura** | 100% plantilla       | Revisar secciones           |
| **Ortografía** | 0 errores            | Revisión manual + corrector |
| **Formato**    | Markdown consistente | Revisar renderizado         |
| **Longitud**   | 300-500 líneas       | Contar líneas               |

### 9.3 Validación
| Criterio                      | Target               | Verificación           |
| ----------------------------- | -------------------- | ---------------------- |
| **Revisión técnica**          | 1 revisor            | Firmar documento       |
| **Validación con experto**    | Contador certificado | Firma de validación    |
| **Actualización de tracking** | 100%                 | Actualizar TRACKING.md |

---

## 10. Ejemplo de Investigación Completada

### Módulo: Conciliación Bancaria

**Documento:** `Research/01-investigaciones-modulos/01-conciliacion-bancaria.md`

**Secciones Completadas:**
- ✅ Descripción del módulo (propósito, actividades, dolor)
- ✅ Estado del arte (APIs bancarias, Open Banking)
- ✅ Implementación técnica (Matching Engine 3 capas)
- ✅ Algoritmos (Fuzzy Matching con código)
- ✅ Thresholds (tabla de confianza)
- ✅ Limitantes (Open Banking limitado, formatos heterogéneos)
- ✅ Casos de éxito (Konfío, Vecttor/Cabify)
- ✅ Métricas (85%+ matches automáticos)
- ✅ Roadmap (Fase 9, 4 semanas)
- ✅ Seguridad (Anexo 29 RMF)
- ✅ Recomendaciones finales

**Lecciones Aprendidas:**
1. Open Banking en México es limitado → Priorizar upload manual
2. Matching de 3 capas es óptimo → Exact → Fuzzy → LLM
3. Thresholds empíricos → Basados en testing real

---

## 11. Timeline Estimado por Tipo de Investigación

### 11.1 Investigación Crítica (Gap #1-5)
| Fase          | Tiempo Estimado            | Entregable               |
| ------------- | -------------------------- | ------------------------ |
| Planificación | 2-4 horas                  | Alcance definido         |
| Recolección   | 8-12 horas                 | Información recopilada   |
| Análisis      | 4-6 horas                  | Limitantes identificadas |
| Documentación | 6-8 horas                  | Documento técnico        |
| Validación    | 2-4 horas                  | Documento aprobado       |
| **Total**     | **22-34 horas (3-4 días)** | Documento completo       |

### 11.2 Investigación Mayor (Gap #6-9)
| Fase          | Tiempo Estimado            | Entregable               |
| ------------- | -------------------------- | ------------------------ |
| Planificación | 1-2 horas                  | Alcance definido         |
| Recolección   | 6-8 horas                  | Información recopilada   |
| Análisis      | 3-4 horas                  | Limitantes identificadas |
| Documentación | 4-6 horas                  | Documento técnico        |
| Validación    | 2-3 horas                  | Documento aprobado       |
| **Total**     | **16-23 horas (2-3 días)** | Documento completo       |

### 11.3 Investigación Menor (Gap #10-15)
| Fase          | Tiempo Estimado            | Entregable               |
| ------------- | -------------------------- | ------------------------ |
| Planificación | 1 hora                     | Alcance definido         |
| Recolección   | 4-6 horas                  | Información recopilada   |
| Análisis      | 2-3 horas                  | Limitantes identificadas |
| Documentación | 3-4 horas                  | Documento técnico        |
| Validación    | 1-2 horas                  | Documento aprobado       |
| **Total**     | **11-16 horas (1-2 días)** | Documento completo       |

---

## 12. Control de Cambios

### 12.1 Principio de No Eliminación

**Regla fundamental:** Las implementaciones y correcciones se van **incrementando/agregando**, **NUNCA eliminando**.

**Justificación:**
- ✅ **Trazabilidad:** Permite entender la evolución del módulo
- ✅ **Auditoría:** Facilita revisión de cambios por nuevos miembros del equipo
- ✅ **Rollback:** Permite revertir a versiones anteriores si es necesario
- ✅ **Aprendizaje:** Documenta errores y correcciones para futuro referencia

**Cómo aplicar:**

| Acción                     | Correcto ✅                                     | Incorrecto ❌                   |
| -------------------------- | ---------------------------------------------- | ------------------------------ |
| **Agregar implementación** | Agregar nueva sección "Implementación v2.0"    | Eliminar "Implementación v1.0" |
| **Corregir error**         | Agregar sección "Corrección #1: [descripción]" | Borrar código incorrecto       |
| **Actualizar parámetro**   | Agregar tabla "Parámetros Actualizados (v2.0)" | Sobrescribir tabla original    |
| **Agregar fuente**         | Agregar nueva fila a "Fuentes Consultadas"     | Reemplazar fuentes anteriores  |

---

### 12.2 Formato de Control de Cambios

| Versión | Fecha       | Autor     | Tipo           | Cambios Realizados              | Sección Afectada  |
| ------- | ----------- | --------- | -------------- | ------------------------------- | ----------------- |
| 1.0     | 10-mar-2026 | Diego Gzz | Creación       | Versión inicial del documento   | Todo el documento |
| 1.1     | [Fecha]     | [Autor]   | Corrección     | [Descripción del cambio]        | [Sección]         |
| 1.2     | [Fecha]     | [Autor]   | Implementación | [Descripción de implementación] | [Sección]         |
| 2.0     | [Fecha]     | [Autor]   | Mayor          | [Descripción de cambio mayor]   | [Sección]         |

**Tipos de cambio:**
- **Creación:** Documento nuevo o sección nueva
- **Corrección:** Fix de error, typo, o información incorrecta
- **Implementación:** Agregar código, algoritmo, o funcionalidad
- **Actualización:** Cambiar parámetros, thresholds, o métricas
- **Mayor:** Cambio significativo que afecta múltiples secciones

---

### 12.3 Ejemplo de Control de Cambios

```markdown
## 10. Control de Cambios

| Versión | Fecha | Autor | Tipo | Cambios Realizados | Sección Afectada |
|---------|-------|-------|------|-------------------|------------------|
| 1.0 | 10-mar-2026 | Diego Gzz | Creación | Versión inicial del documento | Todo el documento |
| 1.1 | 15-mar-2026 | Ana López | Corrección | Corregido threshold de fuzzy matching de 0.7 a 0.75 | Sección 3.3 |
| 1.2 | 20-mar-2026 | Carlos Ruiz | Implementación | Agregado código de parser para Banorte | Sección 4.2 |
| 1.3 | 25-mar-2026 | Diego Gzz | Actualización | Actualizadas tasas de IMSS 2026 | Sección 5.1 |
| 2.0 | 1-abr-2026 | Ana López | Mayor | Agregada validación de lista 69-B en tiempo real | Sección 6 |
```

**Nota:** Las versiones anteriores se mantienen en el historial. Si se requiere consultar la versión 1.0, se puede acceder mediante git history o backups.

---

### 12.4 Historial de Implementaciones

**Cada implementación debe registrar:**

```markdown
### Historial de Implementaciones

| ID | Fecha | Implementación | Owner | Estado | Notas |
|----|-------|----------------|-------|--------|-------|
| **IMP-001** | 10-mar-2026 | Matching Engine (Exact) | Backend Team | ✅ Completado | 60-70% éxito |
| **IMP-002** | 15-mar-2026 | Matching Engine (Fuzzy) | ML Team | ✅ Completado | 15-20% éxito |
| **IMP-003** | 20-mar-2026 | LLM Validation | Backend + ML | 🔄 En progreso | Pendiente testing |
| **IMP-004** | 25-mar-2026 | Parser BBVA | Backend | ⏳ Pendiente | Prioridad alta |
```

**Estados:**
- ✅ **Completado:** Implementación + tests + documentación
- 🔄 **En progreso:** Implementación en curso
- ⏳ **Pendiente:** Planificado, no iniciado
- ❌ **Cancelado:** No se implementará (documentar razón)

---

### 12.5 Historial de Correcciones

**Cada corrección debe registrar:**

```markdown
### Historial de Correcciones

| ID | Fecha | Corrección | Owner | Estado | Impacto |
|----|-------|------------|-------|--------|---------|
| **FIX-001** | 12-mar-2026 | Error en cálculo de ISR (tabla 2026) | Backend Team | ✅ Completado | Crítico |
| **FIX-002** | 18-mar-2026 | Fuga de memoria en parser PDF | Backend | ✅ Completado | Alto |
| **FIX-003** | 22-mar-2026 | Threshold de confianza muy bajo | ML Team | 🔄 En progreso | Medio |
```

**Niveles de impacto:**
- 🔴 **Crítico:** Errores que bloquean funcionalidad principal
- 🟠 **Alto:** Errores que afectan precisión o performance
- 🟡 **Medio:** Errores menores o mejoras de UX
- 🟢 **Bajo:** Typos, mejoras de documentación

---

### 12.6 Versionado de Documentos

**Estructura de versiones:**

```
[MAJOR].[MINOR].[PATCH]

Ejemplos:
- 1.0.0 → Versión inicial
- 1.1.0 → Agregada nueva funcionalidad (backward compatible)
- 1.1.1 → Corrección de error (patch)
- 2.0.0 → Cambio mayor (breaking change)
```

**Cuándo actualizar cada número:**

| Tipo de Cambio | MAJOR | MINOR | PATCH |
|----------------|-------|-------|-------|
| Corrección de typo/error menor | ❌ | ❌ | ✅ |
| Corrección de error funcional | ❌ | ✅ | ❌ |
| Agregada funcionalidad nueva | ❌ | ✅ | ❌ |
| Cambio de arquitectura | ✅ | ❌ | ❌ |
| Cambio de API (breaking) | ✅ | ❌ | ❌ |

---

### 12.7 Backups y Versiones Anteriores

**Política de backups:**

| Tipo | Frecuencia | Retención | Ubicación |
|------|------------|-----------|-----------|
| **Automático (git)** | Cada commit | Ilimitada | GitHub/GitLab |
| **Manual (pre-cambio mayor)** | Antes de v2.0+ | 12 meses | `docs/backups/` |
| **Semanal** | Cada viernes | 4 semanas | `docs/backups/weekly/` |
| **Mensual** | Último día del mes | 12 meses | `docs/backups/monthly/` |

**Cómo acceder a versiones anteriores:**

```bash
# Ver historial de cambios
git log Research/01-investigaciones-modulos/01-conciliacion-bancaria.md

# Ver versión específica (commit)
git show abc123:Research/01-investigaciones-modulos/01-conciliacion-bancaria.md

# Revertir a versión anterior
git checkout abc123 -- Research/01-investigaciones-modulos/01-conciliacion-bancaria.md
```

---

### 12.8 Checklist de Control de Cambios

**Antes de actualizar un documento:**

- [ ] **Identificar tipo de cambio** (Creación/Corrección/Implementación/Actualización/Mayor)
- [ ] **Asignar número de versión** (MAJOR.MINOR.PATCH)
- [ ] **Documentar en tabla de control de cambios**
- [ ] **Agregar entrada en historial de implementaciones/correcciones**
- [ ] **Crear backup** (si es cambio mayor v2.0+)
- [ ] **Notificar al equipo** (si afecta múltiples módulos)
- [ ] **Actualizar TRACKING_INVESTIGACION.md**

**Después de actualizar:**

- [ ] **Verificar que versión anterior es accesible** (git history)
- [ ] **Validar que cambios no rompen funcionalidad existente**
- [ ] **Actualizar documentación relacionada** (README, PLAN_MAESTRO_IMPLEMENTACION.md)
- [ ] **Commit con mensaje descriptivo** (ej. "feat: agregada validación 69-B v2.0")

---

## 13. Anexos

### Anexo A: Glosario de Términos

| Término | Definición |
|---------|------------|
| **CFDI** | Comprobante Fiscal Digital por Internet |
| **EFO** | Empresa que Factura Operaciones (lista 69-B) |
| **NIF** | Normas de Información Financiera |
| **IMSS** | Instituto Mexicano del Seguro Social |
| **INFONAVIT** | Instituto del Fondo Nacional de la Vivienda para los Trabajadores |
| **SAT** | Servicio de Administración Tributaria |
| **UMA** | Unidad de Medida y Actualización |
| **SBC** | Salario Base de Cotización |
| **ML** | Machine Learning |
| **LLM** | Large Language Model |

### Anexo B: Plantillas Descargables

- **Plantilla de Investigación:** `plantillas/PLANTILLA_INVESTIGACION.md`
- **Checklist de Validación:** `plantillas/CHECKLIST_VALIDACION.md`
- **Control de Cambios:** `plantillas/CONTROL_CAMBIOS.md`

### Anexo C: Contactos para Validación

| Rol | Nombre/Entidad | Contacto | Estado |
|-----|----------------|----------|--------|
| Colegio de Contadores | CCPM | https://www.ccpm.org.mx/ | ⏳ Pendiente |
| IMCP | Instituto Mexicano | https://www.imcp.org.mx/ | ⏳ Pendiente |
| Contador Certificado | Por definir | - | ⏳ Pendiente |
| Auditor Certificado | Por definir | - | ⏳ Pendiente |

---

**Documento elaborado por:** Principal Engineering Lead
**Fecha:** 10 de marzo de 2026
**Próxima revisión:** Después de completar investigación de Semana 2
**Owner:** Tech Lead + Product Owner

---

*Fin de la Guía para Realización de Investigaciones Técnicas*
