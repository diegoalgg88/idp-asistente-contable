# Investigación Técnica: Cumplimiento Normativo Multi-Autoridad

**Fecha:** 10 de marzo de 2026
**Versión:** 1.0
**Módulo:** Cumplimiento Normativo
**Prioridad:** 🟢 MEDIA
**Gap ID:** Gap #12
**Owner:** Diego Gzz (Principal Engineering Lead)

---

## 1. Descripción del Módulo

### 1.1 Propósito
El módulo de Cumplimiento Normativo automatiza el monitoreo y cumplimiento de obligaciones ante múltiples autoridades (IMSS, INFONAVIT, STPS, SAT, autoridades estatales y municipales), generando alertas de vencimientos, calculando multas potenciales, y centralizando la documentación requerida para auditorías. Este módulo reduce el riesgo de multas por incumplimiento y libera 40-60 horas mensuales de trabajo manual de seguimiento normativo.

### 1.2 Actividades del Contador que Automatiza
| Actividad | Frecuencia | Tiempo Actual | Tiempo Esperado | Ahorro |
|-----------|------------|---------------|-----------------|--------|
| Monitoreo de vencimientos IMSS/INFONAVIT | Mensual | 4-6 horas | 0.5 horas | 88-92% |
| Cálculo de cuotas obrero-patronales | Mensual | 3-5 horas | 0.5 horas | 83-90% |
| Revisión cumplimiento STPS (NOMs) | Trimestral | 8-12 horas | 1-2 horas | 75-83% |
| Gestión de licencias municipales | Anual | 4-8 horas | 1 hora | 75-88% |
| Preparación para auditorías | Por evento | 20-40 horas | 4-8 horas | 75-80% |
| Cálculo de multas potenciales | Mensual | 2-3 horas | 0.25 horas | 88-92% |

### 1.3 Dolor Principal que Resuelve
Los contadores y responsables de cumplimiento dedican 40-60 horas mensuales a monitorear manualmente calendarios de obligaciones ante IMSS, INFONAVIT, STPS, SAT y autoridades municipales. La falta de un sistema centralizado de alertas resulta en omisiones de pagos extemporáneos, generando multas que van desde $2,346 hasta $586,550 MXN (20-5,000 UMAs). Las inspecciones de STPS por incumplimiento de NOMs (seguridad e higiene, NOM-035) pueden resultar en clausuras temporales. La preparación para auditorías requiere recopilar documentación dispersa en múltiples sistemas y carpetas físicas.

### 1.4 ROI Esperado
| Concepto | Valor |
|----------|-------|
| Tiempo liberado por año | 500-700 horas |
| Valor de hora de contador compliance | $900 MXN |
| Ahorro anual en mano de obra | $450,000 - $630,000 MXN |
| Multas evitadas (promedio) | $150,000 - $300,000 MXN |
| **ROI anual** | **450-550%** |

---

## 2. Estado del Arte en México (2026)

### 2.1 Tecnologías Disponibles
| Tecnología | Proveedor | Estado | Costo | Documentación |
|------------|-----------|--------|-------|---------------|
| **SUA IMSS 3.7.1** | IMSS | ✅ Activa | Gratis | https://www.imss.gob.mx/patrones/sua |
| **IDSE** | IMSS | ✅ Activa | Gratis | https://www.imss.gob.mx/ |
| **Sistema de Multas STPS** | STPS | ✅ Activa | Gratis | https://www.gob.mx/stps |
| **Buzón Tributario** | SAT | ✅ Activa | Gratis | https://www.sat.gob.mx/ |
| **e.firma** | SAT | ✅ Activa | Gratis | https://www.sat.gob.mx/ |

### 2.2 Proveedores de APIs/Servicios
| Proveedor | API/Servicio | Sandbox | Autenticación | Límites |
|-----------|--------------|---------|---------------|---------|
| **IMSS** | API Movimientos Afiliatorios | ⚠️ Limitado | e.firma | 500 req/día |
| **SAT** | API CFDI y Contabilidad | ⚠️ Limitado | e.firma | Variable |
| **STPS** | Portal de Trámites | ❌ No | Usuario/Contraseña | N/A |
| **INFONAVIT** | Portal Patronal | ⚠️ Limitado | e.firma | N/A |

### 2.3 Regulación Aplicable (IMSS, STPS, SAT, etc.)
| Norma/Regulación | Artículo | Vigencia | Impacto en Módulo |
|------------------|----------|----------|-------------------|
| **LSS** | Art. 304-A, 304-B | 2026 | Multas por incumplimiento IMSS (20-350 UMAs) |
| **Ley del INFONAVIT** | Art. 29 | 2026 | Multas por incumplimiento (20-300 VUMAs) |
| **LFT** | Art. 512, 1004-C | 2026 | Multas STPS por NOMs (250-5,000 UMAs) |
| **RFSST** | Art. 5 | 2026 | Reglamento Federal de Seguridad y Salud |
| **CFF** | Art. 32-A | 2026 | Dictamen fiscal obligatorio |
| **RMF 2026** | Anexo 18 | 2026 | Requisitos de dictamen |

### 2.4 Casos de Éxito Documentados
| Empresa | Caso | Resultado | Lección Aprendida |
|---------|------|-----------|-------------------|
| **Manufacturera NL** | Implementación sistema alertas IMSS | Evitó multa de $180,000 MXN por extemporáneo | Alertas 5 días antes permiten pago oportuno |
| **Despacho Contable** | Centralización cumplimiento STPS | Redujo 75% tiempo en preparación de auditorías | Carpeta maestra digital agiliza inspecciones |
| **PYME Retail** | Capacitación NOM-035 | Evitó multa de $282,850 MXN (2,500 UMAs) | Documentación DC-3 es crítica en inspecciones |
| **Constructora CDMX** | Licencias municipales al día | Evitó clausura temporal por 15 días | Renovación anticipada previene interrupciones |

### 2.5 Tendencias de Mercado
- **UMA 2026**: $108.57 MXN diarios (multas IMSS/STPS indexadas)
- **Buzón IMSS obligatorio**: Notificaciones electrónicas desde marzo 2026
- **SUA 3.7.1**: Actualización con clave "05 Responsabilidad Solidaria del 15A" para subcontratación
- **NOM-035**: Multas promedio de $282,850 MXN por incumplimiento en empresas 50+ empleados
- **Digitalización STPS**: Inspecciones con carpeta maestra digital reduce tiempo 75%

---

## 3. Implementación Técnica

### 3.1 Arquitectura Recomendada

```
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Dashboard  │  │  Calendario │  │  Multas     │         │
│  │  Cumplim.   │  │  Vencim.    │  │  Potenciales│         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE APLICACIÓN                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Calculadora│  │  Generador  │  │  Verificador│         │
│  │  Multas     │  │  Alertas    │  │  NOMs       │         │
│  │  (UMAs)     │  │  (5 días)   │  │  (Checklist)│         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE DATOS                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Catálogo   │  │  Histórico  │  │  Documentación│        │
│  │  UMAs/VUMAs │  │  Pagos      │  │  Digital    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Algoritmos Específicos

#### Algoritmo 1: Cálculo de Multas IMSS

```python
def calcular_multa_imss(
    tipo_infraccion: str,
    dias_retraso: int,
    num_trabajadores: int,
    uma_vigente: float = 108.57
) -> dict:
    """
    Calcula multa IMSS según tipo de infracción y días de retraso.
    
    Args:
        tipo_infraccion: Tipo de infracción ('registro_extemporaneo', 'no_registro', 'omision_cuotas', etc.)
        dias_retraso: Días de retraso en el cumplimiento
        num_trabajadores: Número de trabajadores afectados
        uma_vigente: Valor de UMA 2026 ($108.57)
    
    Returns:
        Diccionario con monto de multa y fundamento legal
    
    Ejemplo:
        >>> multa = calcular_multa_imss('registro_extemporaneo', dias_retraso=15, num_trabajadores=10)
    """
    # Tabla de multas IMSS 2026 (Art. 304-A, 304-B LSS)
    multas = {
        'registro_extemporaneo': {'min': 20, 'max': 75, 'uma': True},
        'no_registro': {'min': 20, 'max': 350, 'uma': True},
        'omision_cuotas': {'min': 40, 'max': 100, 'porcentaje': True},  # % del monto omitido
        'no_determinacion': {'min': 20, 'max': 75, 'uma': True},
        'no_retencion': {'min': 20, 'max': 350, 'uma': True},
        'no_comprobantes': {'min': 201, 'max': 250, 'uma': True},
        'no_informacion': {'min': 251, 'max': 300, 'uma': True},
        'no_permitir_inspeccion': {'min': 301, 'max': 350, 'uma': True}
    }
    
    if tipo_infraccion not in multas:
        raise ValueError(f"Tipo de infracción no válida: {tipo_infraccion}")
    
    config = multas[tipo_infraccion]
    
    # Calcular multiplicador por días de retraso y número de trabajadores
    multiplicador = 1.0
    if dias_retraso > 30:
        multiplicador += 0.5
    if dias_retraso > 60:
        multiplicador += 0.5
    if num_trabajadores > 50:
        multiplicador += 0.3
    if num_trabajadores > 200:
        multiplicador += 0.5
    
    # Calcular rango de multa
    if config.get('porcentaje'):
        # Multa porcentual (40-100% del monto omitido)
        multa_min = config['min']
        multa_max = config['max']
        return {
            'tipo_infraccion': tipo_infraccion,
            'fundamento': 'Art. 304-A, 304-B LSS',
            'tipo_calculo': 'Porcentual',
            'rango_porcentaje': f"{multa_min}-{multa_max}%",
            'multiplicador': round(multiplicador, 2),
            'nota': 'El porcentaje se aplica sobre el monto de cuotas omitidas'
        }
    else:
        # Multa en UMAs
        multa_min_umAs = config['min'] * multiplicador
        multa_max_umAs = config['max'] * multiplicador
        multa_min_pesos = multa_min_umAs * uma_vigente
        multa_max_pesos = multa_max_umAs * uma_vigente
        
        return {
            'tipo_infraccion': tipo_infraccion,
            'fundamento': 'Art. 304-A, 304-B LSS',
            'tipo_calculo': 'UMAs',
            'uma_vigente': uma_vigente,
            'multa_min_umAs': round(multa_min_umAs, 2),
            'multa_max_umAs': round(multa_max_umAs, 2),
            'multa_min_pesos': round(multa_min_pesos, 2),
            'multa_max_pesos': round(multa_max_pesos, 2),
            'multiplicador': round(multiplicador, 2),
            'nota': f'Multa calculada con UMA 2026 de ${uma_vigente} MXN'
        }
```

#### Algoritmo 2: Verificador de Cumplimiento STPS (NOMs)

```python
def verificar_cumplimiento_stps(
    nom: str,
    num_trabajadores: int,
    documentos: list
) -> dict:
    """
    Verifica cumplimiento de NOM específica de STPS.
    
    Args:
        nom: Clave de la NOM (ej. 'NOM-035', 'NOM-017', 'NOM-001')
        num_trabajadores: Número de trabajadores en el centro de trabajo
        documentos: Lista de documentos disponibles
    
    Returns:
        Diccionario con estatus de cumplimiento y documentos faltantes
    
    Ejemplo:
        >>> cumplimiento = verificar_cumplimiento_stps('NOM-035', num_trabajadores=50, documentos=['reglamento_interior'])
    """
    # Requisitos por NOM (simplificado para 2026)
    requisitos_noms = {
        'NOM-035': {
            'nombre': 'Factores de Riesgo Psicosocial',
            'documentos_requeridos': [
                'politica_prevencion_riesgos_psicosociales',
                'evaluacion_entorno_organizacional',
                'medidas_control',
                'expedientes_clinicos',
                'capacitacion_dc3'
            ],
            'aplica_para': '15+ trabajadores',
            'multa_min_umAs': 250,
            'multa_max_umAs': 5000
        },
        'NOM-017': {
            'nombre': 'Equipo de Protección Personal (EPP)',
            'documentos_requeridos': [
                'estudio_identificacion_riesgos',
                'registro_entrega_epp',
                'procedimiento_seleccion_epp',
                'capacitacion_uso_epp'
            ],
            'aplica_para': 'Todos los centros de trabajo',
            'multa_min_umAs': 250,
            'multa_max_umAs': 5000
        },
        'NOM-001': {
            'nombre': 'Edificios, locales e instalaciones',
            'documentos_requeridos': [
                'dictamen_proteccion_civil',
                'mantenimiento_instalaciones',
                'senalizacion_seguridad',
                'recorridos_seguridad'
            ],
            'aplica_para': 'Todos los centros de trabajo',
            'multa_min_umAs': 250,
            'multa_max_umAs': 5000
        },
        'NOM-002': {
            'nombre': 'Prevención y protección contra incendios',
            'documentos_requeridos': [
                'extintores_vigentes',
                'senalizacion_rutas_evacuacion',
                'simulacros_incendios',
                'capacitacion_brigadistas'
            ],
            'aplica_para': 'Todos los centros de trabajo',
            'multa_min_umAs': 250,
            'multa_max_umAs': 5000
        }
    }
    
    if nom not in requisitos_noms:
        return {'error': f'NOM {nom} no encontrada en base de datos'}
    
    nom_config = requisitos_noms[nom]
    
    # Verificar documentos
    documentos_faltantes = [
        doc for doc in nom_config['documentos_requeridos']
        if doc not in documentos
    ]
    
    documentos_presentes = [
        doc for doc in nom_config['documentos_requeridos']
        if doc in documentos
    ]
    
    porcentaje_cumplimiento = (len(documentos_presentes) / len(nom_config['documentos_requeridos'])) * 100
    
    estatus = 'Cumple' if porcentaje_cumplimiento == 100 else 'No Cumple'
    riesgo_multa = 'ALTO' if porcentaje_cumplimiento < 50 else 'MEDIO' if porcentaje_cumplimiento < 80 else 'BAJO'
    
    return {
        'nom': nom,
        'nombre': nom_config['nombre'],
        'aplica_para': nom_config['aplica_para'],
        'cumple': porcentaje_cumplimiento == 100,
        'estatus': estatus,
        'porcentaje_cumplimiento': round(porcentaje_cumplimiento, 2),
        'documentos_presentes': documentos_presentes,
        'documentos_faltantes': documentos_faltantes,
        'riesgo_multa': riesgo_multa,
        'multa_potencial_min': f"${nom_config['multa_min_umAs'] * 108.57:,.2f} MXN ({nom_config['multa_min_umAs']} UMAs)",
        'multa_potencial_max': f"${nom_config['multa_max_umAs'] * 108.57:,.2f} MXN ({nom_config['multa_max_umAs']} UMAs)",
        'recomendacion': f"Completar {len(documentos_faltantes)} documentos faltantes para evitar multa de hasta ${nom_config['multa_max_umAs'] * 108.57:,.2f} MXN"
    }
```

### 3.3 Thresholds y Parámetros Óptimos
| Parámetro | Valor Recomendado | Rango Aceptable | Justificación |
|-----------|-------------------|-----------------|---------------|
| **Días alerta vencimiento** | 5 días antes | 3-10 días | Tiempo suficiente para pago |
| **UMA 2026** | $108.57 MXN | Fijo | Valor oficial DOF |
| **VUMA 2026** | $117.31 MXN | Fijo | Valor oficial STPS |
| **Frecuencia revisión NOMs** | Trimestral | Mensual-Trimestral | Balance entre carga y riesgo |
| **Retención documental** | 5 años | 5-10 años | Requisito legal mínimo |

### 3.4 Integración con NVIDIA NIM
| Modelo | Uso | Costo | Latencia | Configuración |
|--------|-----|-------|----------|---------------|
| **meta/llama-3.1-70b-instruct** | Generación de recomendaciones de cumplimiento | $0.0007/1K tokens | ~150ms | Temperature 0.5, max_tokens 400 |
| **nvidia/nemotron-4-340b-instruct** | Análisis de riesgos de multa | $0.0014/1K tokens | ~200ms | Temperature 0.3, max_tokens 600 |

### 3.5 Endpoints Requeridos (Backend)
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/v1/cumplimiento/calendario` | Obtener calendario de vencimientos | ✅ JWT |
| GET | `/v1/cumplimiento/multas/imss` | Calcular multas IMSS potenciales | ✅ JWT |
| GET | `/v1/cumplimiento/noms/estatus` | Verificar estatus de NOMs | ✅ JWT |
| POST | `/v1/cumplimiento/documentos/upload` | Subir documentos de cumplimiento | ✅ JWT |
| GET | `/v1/cumplimiento/auditoria/preparacion` | Generar checklist para auditoría | ✅ JWT |

### 3.6 Componentes Requeridos (Frontend)
| Componente | Tipo | Propósito |
|------------|------|-----------|
| `CumplimientoDashboard.tsx` | UI Component | Dashboard de cumplimiento multi-autoridad |
| `CalendarioVencimientos.tsx` | UI Component | Calendario de vencimientos IMSS/INFONAVIT/STPS |
| `MultasCalculator.tsx` | UI Component | Calculadora de multas potenciales |
| `NOMsChecklist.tsx` | UI Component | Checklist de documentos por NOM |
| `useCumplimientoStore.ts` | Hook | Estado global de cumplimiento |
| `cumplimientoService.ts` | Service | Llamadas a API de cumplimiento |

---

## 4. Limitantes y Restricciones

### 4.1 Limitación 1: APIs Gubernamentales Limitadas
**Problema:**
IMSS, STPS e INFONAVIT tienen APIs limitadas o inexistentes. La mayoría de las consultas requieren acceso vía portal web con e.firma, sin automatización directa.

**Solución:**
- Usar scraping ético con Selenium/Playwright para portales gubernamentales
- Implementar upload manual de comprobantes como fallback
- Notificar al usuario cuando se requiera acción manual

**Impacto:**
- Algunas verificaciones requieren intervención manual (2-4 horas/mes)
- Dependencia de estabilidad de portales gubernamentales

### 4.2 Limitación 2: Cambios Normativos Frecuentes
**Problema:**
Las regulaciones de IMSS, STPS y SAT cambian frecuentemente (Miscelánea Fiscal anual, actualizaciones de UMA, nuevas NOMs).

**Solución:**
- Monitorear DOF diariamente para cambios normativos
- Actualizar catálogo de multas trimestralmente
- Notificar a usuarios de cambios relevantes

**Impacto:**
- Requiere mantenimiento continuo del módulo (4-8 horas/mes)
- Riesgo de multas si no se actualiza a tiempo

### 4.3 Riesgos Técnicos Identificados
| Riesgo | Probabilidad | Impacto | Mitigación | Owner |
|--------|--------------|---------|------------|-------|
| **Portal IMSS inestable** | ALTA | MEDIO | Implementar retry logic + fallback manual | Backend Lead |
| **Cambio en valores UMA/VUMA** | MEDIA | ALTO | Actualizar automáticamente desde DOF | Product Owner |
| **Error en cálculo de multas** | BAJA | ALTO | Validar con contador certificado | Tech Lead |
| **No detectar nueva NOM** | MEDIA | ALTO | Monitorear STPS semanalmente | Product Owner |

---

## 5. Métricas Esperadas

| Métrica | Target | Fórmula | Medición | Frecuencia |
|---------|--------|---------|----------|------------|
| **Vencimientos detectados a tiempo** | 95%+ | `(detectados / totales) × 100` | Por mes | Mensual |
| **Multas evitadas** | 90%+ | `(evitadas / potenciales) × 100` | Por trimestre | Trimestral |
| **Tiempo preparación auditoría** | <8 horas | `tiempo_total / auditoría` | Por evento | Por evento |
| **Cumplimiento NOMs** | 100% | `(cumple / total_noms) × 100` | Por centro de trabajo | Trimestral |

### 5.1 Criterios de Aceptación
- [ ] **Criterio 1:** Las alertas de vencimiento se generan 5 días antes con 95%+ de precisión
- [ ] **Criterio 2:** El cálculo de multas coincide con cálculos oficiales (±5%)
- [ ] **Criterio 3:** El checklist de auditoría incluye 100% de documentos requeridos por STPS
- [ ] **Criterio 4:** El sistema soporta 50+ centros de trabajo sin degradación

---

## 6. Roadmap de Implementación

### Fase 1: MVP (8 semanas)

**Fecha de inicio:** 15 de abril de 2026
**Fecha de fin:** 10 de junio de 2026
**Owner:** Backend Lead

| Semana | Entregable | Owner | Dependencias | Criterio de Éxito |
|--------|------------|-------|--------------|-------------------|
| **1-2** | Modelos + Catálogo UMAs/VUMAs | Backend Dev | Investigación completada | CRUD de cumplimiento funcional |
| **3-4** | Calculadora de multas IMSS/STPS | Backend Dev | Algoritmos validados | Cálculos 95% precisos |
| **5-6** | Calendario de vencimientos | Fullstack Dev | APIs documentadas | Alertas generadas correctamente |
| **7-8** | Dashboard frontend + NOMs checklist | Frontend Dev | APIs completas | UI/UX aprobada |

### 6.1 Dependencias Críticas
- [ ] **Validación con contador certificado:** Validar cálculos de multas antes de producción
- [ ] **Integración con módulo nómina:** Necesaria para obtener datos de trabajadores
- [ ] **Monitoreo DOF:** Implementar scraper de cambios normativos

### 6.2 Recursos Requeridos
| Recurso | Tipo | Cantidad | Owner |
|---------|------|----------|-------|
| **Backend Developer** | Humano | 1 FTE × 8 semanas | Tech Lead |
| **Frontend Developer** | Humano | 0.5 FTE × 4 semanas | Tech Lead |
| **Contador Certificado** | Validación | 8 horas | Product Owner |
| **Abogado Laboral** | Validación | 4 horas | Product Owner |

---

## 7. Seguridad y Cumplimiento

### 7.1 Requisitos SAT/IMSS/STPS
| Requisito | Descripción | Impacto en Módulo |
|-----------|-------------|-------------------|
| **e.firma vigente** | Requerida para trámites IMSS/SAT | Integrar validación de vigencia |
| **Buzón Tributario** | Notificaciones electrónicas | Monitorear buzón diariamente |
| **Retención documental** | 5 años mínimo | Implementar política de retención |
| **Bitácora de cambios** | Auditoría de modificaciones | Logs de todos los cambios |

### 7.2 Multas por Incumplimiento
| Incumplimiento | Multa | Autoridad |
|----------------|-------|-----------|
| **No registrar trabajadores IMSS** | $2,346 - $41,058 MXN (20-350 UMAs) | IMSS |
| **No pagar cuotas IMSS** | 40-100% del monto omitido | IMSS |
| **No cumplir NOM-035** | $29,327 - $586,550 MXN (250-5,000 UMAs) | STPS |
| **No tener licencias municipales** | Clausura + $5,000-50,000 MXN | Municipio |

---

## 8. Conclusiones y Recomendaciones

### 8.1 Hallazgos Clave
1. **UMA 2026**: $108.57 MXN diarios, multas IMSS van de $2,346 a $41,058 MXN
2. **VUMA 2026**: $117.31 MXN diarios, multas STPS van de $29,327 a $586,550 MXN
3. **NOM-035**: Multas promedio de $282,850 MXN para empresas 50+ empleados
4. **SUA 3.7.1**: Nueva clave "05 Responsabilidad Solidaria del 15A" para subcontratación
5. **Buzón IMSS**: Obligatorio desde marzo 2026, notificaciones electrónicas

### 8.2 Recomendaciones Finales
| Área | Recomendación | Prioridad | Owner |
|------|---------------|-----------|-------|
| **Implementación** | Comenzar con MVP (calendario + multas) | ALTA | Tech Lead |
| **Validación** | Validar con contador y abogado laboral | ALTA | Product Owner |
| **Monitoreo** | Implementar scraper de DOF para cambios | MEDIA | Backend Lead |
| **Capacitación** | Tutorial de NOMs para usuarios | MEDIA | UX Lead |

### 8.3 Próximos Pasos
- [ ] **Validar algoritmos con contador:** 21 de abril de 2026
- [ ] **Completar MVP (Fase 1):** 10 de junio de 2026
- [ ] **Testing con usuarios beta:** 15 de junio de 2026
- [ ] **Lanzamiento producción:** 1 de julio de 2026

---

## 9. Fuentes Consultadas

### Fuentes Oficiales
| Fuente | URL | Fecha de Consulta |
|--------|-----|-------------------|
| **IMSS - SUA 3.7.1** | https://www.imss.gob.mx/patrones/sua | 10-mar-2026 |
| **STPS - NOMs** | https://www.gob.mx/stps | 10-mar-2026 |
| **SAT - RMF 2026** | https://www.sat.gob.mx/ | 10-mar-2026 |
| **DOF - CFF** | https://www.diputados.gob.mx/ | 10-mar-2026 |
| **INFONAVIT - Portal Patronal** | https://www.infonavit.org.mx/ | 10-mar-2026 |

### Fuentes de Mercado
| Fuente | URL | Fecha de Consulta |
|--------|-----|-------------------|
| **IDC - Multas IMSS 2026** | https://idconline.mx/seguridad-social/2026/02/16/obligaciones-y-multas-para-2026-imss-e-infonavit/ | 10-mar-2026 |
| **Consolidé - Incumplimiento IMSS** | https://consolide.com/blog/incumplimiento-de-pago-de-cuotas-obrero-patronales/ | 10-mar-2026 |
| **EHS Integral - Multas STPS** | https://ehsintegral.com/multas-stps-2026-montos-evidencias-como-evitarlas/ | 10-mar-2026 |
| **Twind - NOMs STPS** | https://twind.io/mx/normas-oficiales-mexicanas-seguridad-salud-trabajo/ | 10-mar-2026 |
| **Job Connection - Guía IMSS/INFONAVIT** | https://jobconnection.com.mx/blog/guia-cumplimiento-imss-infonavit-2026.html | 10-mar-2026 |
| **Tress - Obligaciones Patronales** | https://tress.com.mx/blog/obligaciones-del-patron-segun-la-lft-checklist-actualizado-2026/ | 10-mar-2026 |
| **Asiec - UMA 2026** | https://asiec.com.mx/blog/actualizacion-uma-2026-el-nuevo-costo-real-de-una-multa-por-incumplimiento-en-seguridad-laboral/ | 10-mar-2026 |
| **Cofide - Calendario Fiscal** | https://www.cofide.mx/blog/fechas-clave-del-calendario-fiscal | 10-mar-2026 |
| **Yahoo Noticias - Multas Laborales** | https://es-us.noticias.yahoo.com/aumentan-multas-laborales-2026-sanciones-140500544.html | 10-mar-2026 |
| **Vivecer - Multas NOMs** | https://www.vivecer.com.mx/noticias/multas-por-incumplimiento-en-las-noms-de-la-stps-lo-que-toda-empresa-debe-saber | 10-mar-2026 |

---

## 10. Control de Cambios

| Versión | Fecha | Autor | Tipo | Cambios Realizados | Sección Afectada |
|---------|-------|-------|------|-------------------|------------------|
| 1.0 | 10-mar-2026 | Diego Gzz | Creación | Versión inicial del documento | Todo el documento |

---

**Documento elaborado por:** Diego Gzz (Principal Engineering Lead)
**Fecha:** 10 de marzo de 2026
**Revisado por:** Por revisar
**Aprobado por:** Por aprobar
**Próxima actualización:** Después de implementación de Fase 1 (junio 2026)

---

*Fin de la Investigación de Cumplimiento Normativo*
