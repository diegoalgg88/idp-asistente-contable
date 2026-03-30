# Control de Cambios - Investigaciones Técnicas

**Módulo:** [Nombre del módulo]
**Documento:** [Nombre del archivo]
**Fecha de inicio:** [Fecha]

---

## 1. Principio de No Eliminación

**Regla fundamental:** Las implementaciones y correcciones se van **incrementando/agregando**, **NUNCA eliminando**.

**Justificación:**
- ✅ **Trazabilidad:** Permite entender la evolución del módulo
- ✅ **Auditoría:** Facilita revisión de cambios por nuevos miembros del equipo
- ✅ **Rollback:** Permite revertir a versiones anteriores si es necesario
- ✅ **Aprendizaje:** Documenta errores y correcciones para futura referencia

---

## 2. Tabla de Control de Cambios

| Versión | Fecha | Autor | Tipo | Cambios Realizados | Sección Afectada |
|---------|-------|-------|------|-------------------|------------------|
| 1.0.0 | [Fecha] | [Autor] | Creación | Versión inicial del documento | Todo el documento |
| | | | | | |
| | | | | | |
| | | | | | |

**Tipos de cambio:**
- **Creación:** Documento nuevo o sección nueva
- **Corrección:** Fix de error, typo, o información incorrecta
- **Implementación:** Agregar código, algoritmo, o funcionalidad
- **Actualización:** Cambiar parámetros, thresholds, o métricas
- **Mayor:** Cambio significativo que afecta múltiples secciones

---

## 3. Historial de Implementaciones

| ID | Fecha | Implementación | Owner | Estado | Notas |
|----|-------|----------------|-------|--------|-------|
| **IMP-001** | [Fecha] | [Nombre de implementación] | [Owner] | ✅ Completado | [Notas] |
| **IMP-002** | [Fecha] | [Nombre de implementación] | [Owner] | 🔄 En progreso | [Notas] |
| **IMP-003** | [Fecha] | [Nombre de implementación] | [Owner] | ⏳ Pendiente | [Notas] |

**Estados:**
- ✅ **Completado:** Implementación + tests + documentación
- 🔄 **En progreso:** Implementación en curso
- ⏳ **Pendiente:** Planificado, no iniciado
- ❌ **Cancelado:** No se implementará (documentar razón)

### 3.1 Detalle de Implementaciones

#### IMP-001: [Nombre de Implementación]

**Fecha:** [Fecha]
**Owner:** [Nombre]
**Estado:** ✅ Completado

**Descripción:**
[Descripción detallada de la implementación]

**Código agregado:**
```python
def funcion_agregada():
    """
    Descripción de la función.
    """
    pass
```

**Secciones afectadas:**
- Sección X.X: [Nombre de sección]
- Sección Y.Y: [Nombre de sección]

**Tests:**
- [ ] Test unitario creado
- [ ] Test de integración creado
- [ ] Documentación actualizada

**Comentarios:**
```
[Espacio para comentarios]
```

---

## 4. Historial de Correcciones

| ID | Fecha | Corrección | Owner | Estado | Impacto |
|----|-------|------------|-------|--------|---------|
| **FIX-001** | [Fecha] | [Descripción de corrección] | [Owner] | ✅ Completado | 🔴 Crítico |
| **FIX-002** | [Fecha] | [Descripción de corrección] | [Owner] | 🔄 En progreso | 🟠 Alto |
| **FIX-003** | [Fecha] | [Descripción de corrección] | [Owner] | ⏳ Pendiente | 🟡 Medio |

**Niveles de impacto:**
- 🔴 **Crítico:** Errores que bloquean funcionalidad principal
- 🟠 **Alto:** Errores que afectan precisión o performance
- 🟡 **Medio:** Errores menores o mejoras de UX
- 🟢 **Bajo:** Typos, mejoras de documentación

### 4.1 Detalle de Correcciones

#### FIX-001: [Descripción de Corrección]

**Fecha:** [Fecha]
**Owner:** [Nombre]
**Estado:** ✅ Completado
**Impacto:** 🔴 Crítico

**Problema:**
[Descripción detallada del problema]

**Solución:**
[Descripción de la solución aplicada]

**Código corregido:**
```python
# Antes (incorrecto)
def funcion_incorrecta():
    resultado = calculo_erroneo()
    return resultado

# Después (correcto)
def funcion_correcta():
    resultado = calculo_correcto()
    return resultado
```

**Secciones afectadas:**
- Sección X.X: [Nombre de sección]

**Tests:**
- [ ] Test de regresión creado
- [ ] Tests existentes passing
- [ ] Documentación actualizada

**Comentarios:**
```
[Espacio para comentarios]
```

---

## 5. Versionado de Documentos

**Estructura de versiones:** `[MAJOR].[MINOR].[PATCH]`

### 5.1 Ejemplos

| Versión | Significado |
|---------|-------------|
| 1.0.0 | Versión inicial |
| 1.1.0 | Agregada nueva funcionalidad (backward compatible) |
| 1.1.1 | Corrección de error (patch) |
| 2.0.0 | Cambio mayor (breaking change) |

### 5.2 Reglas de Versionado

| Tipo de Cambio | MAJOR | MINOR | PATCH |
|----------------|-------|-------|-------|
| Corrección de typo/error menor | ❌ | ❌ | ✅ |
| Corrección de error funcional | ❌ | ✅ | ❌ |
| Agregada funcionalidad nueva | ❌ | ✅ | ❌ |
| Cambio de arquitectura | ✅ | ❌ | ❌ |
| Cambio de API (breaking) | ✅ | ❌ | ❌ |

### 5.3 Historial de Versiones

| Versión | Fecha | Autor | Cambios Principales |
|---------|-------|-------|---------------------|
| 1.0.0 | [Fecha] | [Autor] | Versión inicial |
| 1.1.0 | [Fecha] | [Autor] | [Descripción] |
| 2.0.0 | [Fecha] | [Autor] | [Descripción] |

---

## 6. Backups y Versiones Anteriores

### 6.1 Política de Backups

| Tipo | Frecuencia | Retención | Ubicación |
|------|------------|-----------|-----------|
| **Automático (git)** | Cada commit | Ilimitada | GitHub/GitLab |
| **Manual (pre-cambio mayor)** | Antes de v2.0+ | 12 meses | `docs/backups/` |
| **Semanal** | Cada viernes | 4 semanas | `docs/backups/weekly/` |
| **Mensual** | Último día del mes | 12 meses | `docs/backups/monthly/` |

### 6.2 Comandos Git para Acceder a Versiones Anteriores

```bash
# Ver historial de cambios
git log Research/[nombre_documento].md

# Ver commits específicos
git log --oneline Research/[nombre_documento].md

# Ver versión específica (commit)
git show abc123:Research/[nombre_documento].md

# Revertir a versión anterior
git checkout abc123 -- Research/[nombre_documento].md

# Ver diferencias entre versiones
git diff abc123 def456 -- Research/[nombre_documento].md
```

### 6.3 Backups Manuales Creados

| Fecha | Versión | Ubicación | Propósito |
|-------|---------|-----------|-----------|
| [Fecha] | 1.0.0 | `docs/backups/v1.0.0/` | Backup pre-cambio mayor |
| [Fecha] | 1.1.0 | `docs/backups/v1.1.0/` | Backup pre-cambio mayor |

---

## 7. Checklist de Control de Cambios

### 7.1 Antes de Actualizar un Documento

- [ ] **Identificar tipo de cambio** (Creación/Corrección/Implementación/Actualización/Mayor)
- [ ] **Asignar número de versión** (MAJOR.MINOR.PATCH)
- [ ] **Documentar en tabla de control de cambios**
- [ ] **Agregar entrada en historial de implementaciones/correcciones**
- [ ] **Crear backup** (si es cambio mayor v2.0+)
- [ ] **Notificar al equipo** (si afecta múltiples módulos)
- [ ] **Actualizar TRACKING_INVESTIGACION.md**

### 7.2 Después de Actualizar

- [ ] **Verificar que versión anterior es accesible** (git history)
- [ ] **Validar que cambios no rompen funcionalidad existente**
- [ ] **Actualizar documentación relacionada** (README, PLAN_MAESTRO_IMPLEMENTACION.md)
- [ ] **Commit con mensaje descriptivo** (ej. "feat: agregada validación 69-B v2.0")

---

## 8. Notificaciones al Equipo

### 8.1 Plantilla de Notificación

```
**ASUNTO:** Actualización de [Nombre del Módulo] - Versión [X.X.X]

**CAMBIOS REALIZADOS:**
- [Cambio 1]
- [Cambio 2]
- [Cambio 3]

**SECCIONES AFECTADAS:**
- [Sección 1]
- [Sección 2]

**IMPACTO:**
- [Impacto en otros módulos]
- [Impacto en implementación]

**ACCIONES REQUERIDAS:**
- [Acción 1] - [Owner] - [Fecha límite]
- [Acción 2] - [Owner] - [Fecha límite]

**DOCUMENTACIÓN ACTUALIZADA:**
- [Documento 1]
- [Documento 2]

**BACKUP CREADO:** ✅ Sí / ❌ No
**UBICACIÓN:** [Ruta del backup]
```

### 8.2 Historial de Notificaciones

| Fecha | Versión | Módulo | Canal | Owner |
|-------|---------|--------|-------|-------|
| [Fecha] | 1.1.0 | [Módulo] | Slack/Email | [Owner] |
| [Fecha] | 2.0.0 | [Módulo] | Slack/Email | [Owner] |

---

## 9. Auditoría de Cambios

### 9.1 Checklist de Auditoría

- [ ] **Todos los cambios están documentados** en la tabla de control de cambios
- [ ] **Todas las implementaciones tienen ID** (IMP-XXX)
- [ ] **Todas las correcciones tienen ID** (FIX-XXX)
- [ ] **Las versiones siguen semántica** (MAJOR.MINOR.PATCH)
- [ ] **Los backups están creados** para cambios mayores
- [ ] **Las notificaciones fueron enviadas** al equipo
- [ ] **El tracking fue actualizado** (TRACKING_INVESTIGACION.md)

### 9.2 Historial de Auditorías

| Fecha | Auditor | Cambios Revisados | Hallazgos | Estado |
|-------|---------|-------------------|-----------|--------|
| [Fecha] | [Nombre] | [Número] cambios | [Hallazgos] | ✅ OK / ❌ Observaciones |

---

## 10. Resumen de Cambios por Mes

| Mes | Versiones | Implementaciones | Correcciones | Cambios Mayores |
|-----|-----------|------------------|--------------|-----------------|
| [Mes/Año] | 1.0.0, 1.1.0 | 3 | 2 | 0 |
| [Mes/Año] | 2.0.0 | 5 | 1 | 1 |

---

**Documento elaborado por:** [Nombre]
**Fecha:** [Fecha]
**Última actualización:** [Fecha]
**Owner:** Tech Lead

---

*Fin del Control de Cambios*
