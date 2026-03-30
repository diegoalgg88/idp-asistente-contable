# Investigación Técnica: [Nombre del Módulo]

**Fecha:** [Fecha de elaboración]
**Versión:** 1.0
**Módulo:** [Nombre del módulo]
**Prioridad:** 🔴 CRÍTICA / 🟡 ALTA / 🟢 MEDIA
**Gap ID:** Gap #[número]
**Owner:** [Nombre del responsable]

---

## 1. Descripción del Módulo

### 1.1 Propósito
[Descripción clara del propósito del módulo. ¿Qué problema resuelve? ¿Por qué es necesario?]

### 1.2 Actividades del Contador que Automatiza
| Actividad | Frecuencia | Tiempo Actual | Tiempo Esperado | Ahorro |
|-----------|------------|---------------|-----------------|--------|
| [Actividad 1] | [Diario/Semanal/Mensual] | [X horas] | [Y horas] | [Z%] |
| [Actividad 2] | [Diario/Semanal/Mensual] | [X horas] | [Y horas] | [Z%] |
| [Actividad 3] | [Diario/Semanal/Mensual] | [X horas] | [Y horas] | [Z%] |

### 1.3 Dolor Principal que Resuelve
[Descripción detallada del dolor/pain point del usuario. ¿Qué le quita tiempo? ¿Qué le genera errores? ¿Qué le causa estrés?]

### 1.4 ROI Esperado
| Concepto | Valor |
|----------|-------|
| Tiempo liberado por semana | [X horas] |
| Valor de hora de contador | $[XXX] MXN |
| Ahorro semanal | $[X,XXX] MXN |
| **ROI anual** | **[XXX]%** |

---

## 2. Estado del Arte en México (2026)

### 2.1 Tecnologías Disponibles
| Tecnología | Proveedor | Estado | Costo | Documentación |
|------------|-----------|--------|-------|---------------|
| [Tecnología 1] | [Proveedor] | ✅ Activa | $X/1K tokens | [URL] |
| [Tecnología 2] | [Proveedor] | ✅ Activa | $X/mes | [URL] |
| [Tecnología 3] | [Proveedor] | ⚠️ Limitada | $X | [URL] |

### 2.2 Proveedores de APIs/Servicios
| Proveedor | API/Servicio | Sandbox | Autenticación | Límites |
|-----------|--------------|---------|---------------|---------|
| [Proveedor 1] | [Nombre API] | ✅ Sí | OAuth2 | 1000 req/día |
| [Proveedor 2] | [Nombre API] | ❌ No | API Key | 100 req/min |

### 2.3 Regulación Aplicable (SAT, NIF, etc.)
| Norma/Regulación | Artículo | Vigencia | Impacto en Módulo |
|------------------|----------|----------|-------------------|
| [Norma 1] | Art. [número] | [Fecha] | [Descripción del impacto] |
| [Norma 2] | Art. [número] | [Fecha] | [Descripción del impacto] |

### 2.4 Casos de Éxito Documentados
| Empresa | Caso | Resultado | Lección Aprendida |
|---------|------|-----------|-------------------|
| [Empresa 1] | [Descripción del caso] | [Resultado cuantificable] | [Lección] |
| [Empresa 2] | [Descripción del caso] | [Resultado cuantificable] | [Lección] |

### 2.5 Tendencias de Mercado
- [Tendencia 1: Descripción]
- [Tendencia 2: Descripción]
- [Tendencia 3: Descripción]

---

## 3. Implementación Técnica

### 3.1 Arquitectura Recomendada

```
┌─────────────────────────────────────────────────────────────┐
│                    [COMPONENTE PRINCIPAL]                    │
│  - [Subcomponente 1]                                        │
│  - [Subcomponente 2]                                        │
│  - [Subcomponente 3]                                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    [COMPONENTE SECUNDARIO]                   │
│  - [Subcomponente 1]                                        │
│  - [Subcomponente 2]                                        │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Algoritmos Específicos

#### Algoritmo 1: [Nombre]

```python
def nombre_algoritmo(parametros: tipo) -> tipo_retorno:
    """
    Descripción del algoritmo.
    
    Args:
        parametros: Descripción de parámetros
    
    Returns:
        Descripción de retorno
    
    Ejemplo:
        >>> resultado = nombre_algoritmo(valor)
        >>> print(resultado)
        valor_esperado
    """
    # Implementación
    pass
```

#### Algoritmo 2: [Nombre]

```python
def nombre_algoritmo(parametros: tipo) -> tipo_retorno:
    """
    Descripción del algoritmo.
    """
    # Implementación
    pass
```

### 3.3 Thresholds y Parámetros Óptimos
| Parámetro | Valor Recomendado | Rango Aceptable | Justificación |
|-----------|-------------------|-----------------|---------------|
| [Parámetro 1] | 0.85 | 0.70-0.95 | Basado en testing con [N] muestras |
| [Parámetro 2] | 500ms | <1000ms | Límite de percepción humana |
| [Parámetro 3] | 100 | 50-200 | Balance entre precisión y performance |

### 3.4 Integración con NVIDIA NIM
| Modelo | Uso | Costo | Latencia | Configuración |
|--------|-----|-------|----------|---------------|
| [Modelo 1] | [Uso específico] | $X/1K tokens | ~100ms | [Config] |
| [Modelo 2] | [Uso específico] | $X/1K tokens | ~200ms | [Config] |

### 3.5 Endpoints Requeridos (Backend)
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/v1/[modulo]/[accion]` | [Descripción] | ✅ JWT |
| GET | `/v1/[modulo]/[recurso]` | [Descripción] | ✅ JWT |

### 3.6 Componentes Requeridos (Frontend)
| Componente | Tipo | Propósito |
|------------|------|-----------|
| `[NombreComponente].tsx` | UI Component | [Propósito] |
| `[NombreHook].ts` | Hook | [Propósito] |
| `[NombreService].ts` | Service | [Propósito] |

---

## 4. Limitantes y Restricciones

### 4.1 Limitación 1: [Nombre]
**Problema:**
[Descripción clara del problema. ¿Qué no se puede hacer? ¿Por qué?]

**Solución:**
```python
def solucion_limitacion():
    """
    Código de solución o workaround.
    """
    pass
```

**Impacto:**
- [Impacto 1]
- [Impacto 2]

### 4.2 Limitación 2: [Nombre]
**Problema:**
[Descripción clara del problema]

**Solución:**
[Descripción de solución. Si no hay solución, indicar "Sin solución disponible"]

**Impacto:**
- [Impacto 1]
- [Impacto 2]

### 4.3 Riesgos Técnicos Identificados
| Riesgo | Probabilidad | Impacto | Mitigación | Owner |
|--------|--------------|---------|------------|-------|
| [Riesgo 1] | ALTA/MEDIA/BAJA | ALTO/MEDIO/BAJO | [Mitigación] | [Owner] |
| [Riesgo 2] | ALTA/MEDIA/BAJA | ALTO/MEDIO/BAJO | [Mitigación] | [Owner] |

---

## 5. Métricas Esperadas

| Métrica | Target | Fórmula | Medición | Frecuencia |
|---------|--------|---------|----------|------------|
| [Métrica 1] | 85%+ | `(correctos / total) × 100` | Por transacción | Diaria |
| [Métrica 2] | <500ms | `tiempo_fin - tiempo_inicio` | Por operación | En tiempo real |
| [Métrica 3] | 99.5% | `(tiempo_activo / tiempo_total) × 100` | Uptime del servicio | Semanal |

### 5.1 Criterios de Aceptación
- [ ] **Criterio 1:** [Descripción medible]
- [ ] **Criterio 2:** [Descripción medible]
- [ ] **Criterio 3:** [Descripción medible]

---

## 6. Roadmap de Implementación

### Fase [número]: [Nombre de la Fase] ([duración])

**Fecha de inicio:** [Fecha]
**Fecha de fin:** [Fecha]
**Owner:** [Nombre]

| Semana | Entregable | Owner | Dependencias | Criterio de Éxito |
|--------|------------|-------|--------------|-------------------|
| **1** | [Entregable 1] | [Rol] | [Dependencias] | [Criterio medible] |
| **2** | [Entregable 2] | [Rol] | [Dependencias] | [Criterio medible] |
| **3** | [Entregable 3] | [Rol] | [Dependencias] | [Criterio medible] |
| **4** | [Entregable 4] | [Rol] | [Dependencias] | [Criterio medible] |

### 6.1 Dependencias Críticas
- [ ] **Dependencia 1:** [Descripción]
- [ ] **Dependencia 2:** [Descripción]
- [ ] **Dependencia 3:** [Descripción]

### 6.2 Recursos Requeridos
| Recurso | Tipo | Cantidad | Owner |
|---------|------|----------|-------|
| [Recurso 1] | [Humano/Técnico/Económico] | [Cantidad] | [Owner] |
| [Recurso 2] | [Humano/Técnico/Económico] | [Cantidad] | [Owner] |

---

## 7. Seguridad y Cumplimiento

### 7.1 Requisitos SAT para Sistemas Contables
| Requisito | Descripción | Impacto en Módulo |
|-----------|-------------|-------------------|
| [Requisito 1] | [Descripción] | [Impacto] |
| [Requisito 2] | [Descripción] | [Impacto] |

### 7.2 Mejores Prácticas de Seguridad
| Capa | Medida | Implementación |
|------|--------|----------------|
| **Datos** | Encriptación AES-256 | AWS KMS / Azure Key Vault |
| **Acceso** | 2FA obligatorio | Auth0 / AWS Cognito |
| **Red** | WAF + DDoS protection | AWS WAF / Cloudflare |

### 7.3 Consideraciones de Privacidad
- [ ] **Dato sensible 1:** [Descripción y protección]
- [ ] **Dato sensible 2:** [Descripción y protección]

### 7.4 Multas por Incumplimiento
| Incumplimiento | Multa | Autoridad |
|----------------|-------|-----------|
| [Incumplimiento 1] | $[X,XXX] MXN | [Autoridad] |
| [Incumplimiento 2] | $[X,XXX] MXN | [Autoridad] |

---

## 8. Conclusiones y Recomendaciones

### 8.1 Hallazgos Clave
1. [Hallazgo 1: Descripción]
2. [Hallazgo 2: Descripción]
3. [Hallazgo 3: Descripción]

### 8.2 Recomendaciones Finales
| Área | Recomendación | Prioridad | Owner |
|------|---------------|-----------|-------|
| [Área 1] | [Recomendación] | ALTA/MEDIA/BAJA | [Owner] |
| [Área 2] | [Recomendación] | ALTA/MEDIA/BAJA | [Owner] |

### 8.3 Próximos Pasos
- [ ] **Paso 1:** [Descripción] - [Fecha límite]
- [ ] **Paso 2:** [Descripción] - [Fecha límite]
- [ ] **Paso 3:** [Descripción] - [Fecha límite]

---

## 9. Fuentes Consultadas

### Fuentes Oficiales
| Fuente | URL | Fecha de Consulta |
|--------|-----|-------------------|
| SAT | https://www.sat.gob.mx/ | [Fecha] |
| IMSS | https://www.imss.gob.mx/ | [Fecha] |
| DOF | https://www.dof.gob.mx/ | [Fecha] |

### Fuentes Técnicas
| Fuente | URL | Fecha de Consulta |
|--------|-----|-------------------|
| NVIDIA NIM | https://build.nvidia.com/ | [Fecha] |
| LangChain | https://python.langchain.com/ | [Fecha] |

### Fuentes de Mercado
| Fuente | URL | Fecha de Consulta |
|--------|-----|-------------------|
| BBVA Spark | https://developers.bbva.com/ | [Fecha] |
| Santander Open API | https://developers.santander.com.mx/ | [Fecha] |

---

## 10. Control de Cambios

| Versión | Fecha | Autor | Tipo | Cambios Realizados | Sección Afectada |
|---------|-------|-------|------|-------------------|------------------|
| 1.0 | [Fecha] | [Autor] | Creación | Versión inicial del documento | Todo el documento |

---

**Documento elaborado por:** [Nombre]
**Fecha:** [Fecha]
**Revisado por:** [Nombre]
**Aprobado por:** [Nombre]
**Próxima actualización:** [Fecha]

---

*Fin de la Plantilla de Investigación*
