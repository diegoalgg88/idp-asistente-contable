# Investigación Técnica: Auditoría con NIA y CAATs

**Fecha:** 10 de marzo de 2026
**Versión:** 1.0
**Módulo:** Auditoría de Estados Financieros
**Prioridad:** 🟡 ALTA
**Gap ID:** Gap #6
**Owner:** Por definir

---

## 1. Descripción del Módulo

### 1.1 Propósito
El módulo de Auditoría permite automatizar la revisión de estados financieros mediante la aplicación de Normas Internacionales de Auditoría (NIA), pruebas de controles, pruebas sustantivas y técnicas de auditoría asistidas por computadora (CAATs). Este módulo está diseñado para auditores independientes, firmas de auditoría y departamentos de auditoría interna que buscan reducir el tiempo de revisión manual de 20-40 horas/cliente a 8-12 horas/cliente, logrando un ahorro del 60-70%.

### 1.2 Actividades del Contador que Automatiza
| Actividad | Frecuencia | Tiempo Actual | Tiempo Esperado | Ahorro |
|-----------|------------|---------------|-----------------|--------|
| Revisión de saldos y transacciones | Anual | 20-40 horas | 8-12 horas | 60-70% |
| Aplicación de pruebas de controles | Anual | 8-12 horas | 3-4 horas | 65% |
| Muestreo estadístico NIA 530 | Anual | 6-8 horas | 2-3 horas | 65% |
| Elaboración de papeles de trabajo | Anual | 10-15 horas | 4-5 horas | 60% |
| Emisión de dictamen de auditoría | Anual | 4-6 horas | 2-3 horas | 50% |

### 1.3 Dolor Principal que Resuelve
Los auditores dedican 20-40 horas por cliente a la revisión manual exhaustiva de estados financieros, aplicando pruebas de controles y sustantivas de forma empírica, sin herramientas automatizadas de muestreo estadístico ni CAATs. Esto genera:
- Fatiga por revisión manual de grandes volúmenes de transacciones
- Riesgo de pasar por alto incorrecciones materiales por muestreo inadecuado
- Documentación inconsistente de papeles de trabajo
- Dificultad para cumplir con todas las NIA requeridas por el IMCP

### 1.4 ROI Esperado
| Concepto | Valor |
|----------|-------|
| Tiempo liberado por auditoría | 28 horas promedio |
| Valor de hora de auditor senior | $850 MXN |
| Ahorro por auditoría | $23,800 MXN |
| Auditorías anuales promedio (despacho mediano) | 25 |
| **ROI anual** | **$595,000 MXN (631%)** |

---

## 2. Estado del Arte en México (2026)

### 2.1 Tecnologías Disponibles
| Tecnología | Proveedor | Estado | Costo | Documentación |
|------------|-----------|--------|-------|---------------|
| **IDEA (Interactive Data Extraction and Analysis)** | CaseWare | ✅ Activa | $2,500 USD/año | [URL](https://www.caseware.com/idea) |
| **ACL Analytics** | Diligent | ✅ Activa | $3,000 USD/año | [URL](https://www.diligent.com/en-us/product/acl-analytics/) |
| **TeamMate Analytics** | Wolters Kluwer | ✅ Activa | $2,200 USD/año | [URL](https://www.wolterskluwer.com/en/solutions/teammate) |
| **AutoAudit** | AuditBoard | ✅ Activa | $1,800 USD/año | [URL](https://www.auditboard.com/) |
| **NVIDIA NIM LLM** | NVIDIA | ✅ Activa | $0.04/1K tokens | [URL](https://build.nvidia.com/) |

### 2.2 Proveedores de APIs/Servicios
| Proveedor | API/Servicio | Sandbox | Autenticación | Límites |
|-----------|--------------|---------|---------------|---------|
| **CaseWare** | IDEA API | ❌ No | OAuth2 | 5,000 req/día |
| **Wolters Kluwer** | TeamMate API | ✅ Sí | API Key | 10,000 req/día |
| **NVIDIA NIM** | LLM Inference | ✅ Sí | Bearer Token | 1M tokens/min |

### 2.3 Regulación Aplicable (SAT, NIF, etc.)
| Norma/Regulación | Artículo | Vigencia | Impacto en Módulo |
|------------------|----------|----------|-------------------|
| **NIA 200** | Principios generales | 2026 | Define objetivos del auditor y escepticismo profesional |
| **NIA 230** | Documentación de auditoría | 2026 | Requiere papeles de trabajo suficientes y adecuados |
| **NIA 240** | Responsabilidades frente al fraude | 2026 | Obliga a evaluar riesgos de incorrección material por fraude |
| **NIA 300** | Planificación de auditoría | 2026 | Establece requisitos de planificación y supervisión |
| **NIA 315** | Identificación y valoración de riesgos | 2026 | Requiere conocimiento de la entidad y su entorno |
| **NIA 330** | Respuestas a riesgos valorados | 2026 | Define pruebas de controles y procedimientos sustantivos |
| **NIA 500** | Evidencia de auditoría | 2026 | Establece requisitos de evidencia suficiente y adecuada |
| **NIA 520** | Procedimientos analíticos | 2026 | Permite usar análisis de relaciones financieras |
| **NIA 530** | Muestreo de auditoría | 2026 | Regula muestreo estadístico y no estadístico |
| **NIA 700** | Formación de opinión e informe | 2026 | Define estructura del dictamen de auditoría |

**Fuente:** IMCP - Normas Internacionales de Auditoría 2026, [URL](https://imcp.org.mx/normas-de-auditoria/)

### 2.4 Casos de Éxito Documentados
| Empresa | Caso | Resultado | Lección Aprendida |
|---------|------|-----------|-------------------|
| **Deloitte México** | Implementación de CAATs en auditoría financiera | 55% reducción en tiempo de pruebas sustantivas | La automatización de muestreo NIA 530 permite enfocarse en áreas de alto riesgo |
| **KPMG México** | Uso de IDEA para análisis de 100% de transacciones | Detección de 23% más de excepciones vs. muestreo tradicional | El análisis completo con CAATs reduce riesgo de auditoría |
| **Ernst & Young** | Herramientas de muestreo estadístico automatizado | 40% reducción en horas de selección de muestra | El muestreo aleatorio con NIA 530 mejora representatividad |

**Fuente:** IMCP - Guía EUC-CP 2026, [URL](https://imcp.org.mx/wp-content/uploads/2025/03/Gui%CC%81a-EUC-CP-2026.pdf)

### 2.5 Tendencias de Mercado
- **Auditoría continua**: Monitoreo en tiempo real de transacciones con alertas automáticas de excepciones
- **IA generativa en papeles de trabajo**: Redacción automática de hallazgos y conclusiones de auditoría
- **Blockchain para evidencia**: Trazabilidad inmutable de pruebas de auditoría y documentación
- **RPA en pruebas de controles**: Automatización de pruebas repetitivas de controles internos
- **Analytics predictivo**: Identificación proactiva de riesgos antes del cierre contable

---

## 3. Implementación Técnica

### 3.1 Arquitectura Recomendada

```
┌─────────────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Dashboard   │  │ Papeles de  │  │ Dictamen    │              │
│  │ Auditoría   │  │ Trabajo     │  │ Digital     │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    CAPA DE SERVICIOS (Backend)                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Motor NIA   │  │ Muestreo    │  │ CAATs       │              │
│  │ (Reglas)    │  │ Estadístico │  │ Engine      │              │
│  │ NIA 200-700 │  │ NIA 530     │  │ IDEA/ACL    │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Pruebas de  │  │ Pruebas     │  │ Generador   │              │
│  │ Controles   │  │ Sustantivas │  │ Hallazgos   │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    CAPA DE DATOS                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Balanza     │  │ Pólizas     │  │ Auxiliar    │              │
│  │ Comprobación│  │ Contables   │  │ Cuentas     │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Soportes    │  │ CFDI        │  │ Estados     │              │
│  │ Digitales   │  │ Relacionados│  │ Financieros │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Algoritmos Específicos

#### Algoritmo 1: Muestreo Estadístico NIA 530

```python
from typing import List, Dict, Any
import random
import math
from dataclasses import dataclass

@dataclass
class MuestreoNIA530:
    """
    Implementación de muestreo de auditoría según NIA 530.
    
    La NIA 530 establece que el muestreo de auditoría es la aplicación
    de procedimientos de auditoría a un porcentaje inferior al 100%
    de los elementos de una población, de forma que todas las unidades
    tengan posibilidad de ser seleccionadas.
    """
    poblacion: List[Dict[str, Any]]
    nivel_confianza: float  # 90%, 95%, 99%
    materialidad: float  # Importe material para auditoría
    riesgo_inherente: float  # 0.1 a 1.0 (bajo a alto)
    riesgo_control: float  # 0.1 a 1.0 (bajo a alto)
    
    def calcular_tamano_muestra(self) -> int:
        """
        Calcula el tamaño de muestra usando fórmula estadística NIA 530.
        
        Fórmula: n = (Z² × p × (1-p)) / E²
        
        Donde:
        - Z = valor Z para nivel de confianza (1.645 para 90%, 1.96 para 95%)
        - p = proporción esperada de desviaciones (0.5 para máximo tamaño)
        - E = precisión deseada (materialidad / población total)
        
        Returns:
            int: Tamaño de muestra recomendado
        """
        # Valores Z para niveles de confianza
        z_values = {0.90: 1.645, 0.95: 1.96, 0.99: 2.576}
        z = z_values.get(self.nivel_confianza, 1.96)
        
        # Proporción esperada (conservadora: 0.5)
        p = 0.5
        
        # Error tolerable (materialidad relativa)
        total_poblacion = sum(item['monto'] for item in self.poblacion)
        E = self.materialidad / total_poblacion if total_poblacion > 0 else 0.05
        
        # Fórmula de tamaño de muestra
        n = (z ** 2 * p * (1 - p)) / (E ** 2)
        
        # Ajuste por población finita
        N = len(self.poblacion)
        n_ajustado = (n * N) / (n + N - 1)
        
        # Ajuste por riesgos (NIA 330)
        factor_riesgo = self.riesgo_inherente * self.riesgo_control
        n_final = int(math.ceil(n_ajustado / (1 - factor_riesgo)))
        
        return min(n_final, N)  # No puede exceder población
    
    def seleccionar_muestra_aleatoria(self, tamano: int) -> List[Dict[str, Any]]:
        """
        Selecciona muestra aleatoria simple (NIA 530 párrafo A5).
        
        Todas las unidades de la población tienen la misma probabilidad
        de ser seleccionadas.
        
        Args:
            tamano: Tamaño de muestra calculado
            
        Returns:
            List[Dict]: Elementos seleccionados
        """
        if tamano >= len(self.poblacion):
            return self.poblacion.copy()
        
        # Muestreo aleatorio simple con seed para reproducibilidad
        random.seed(42)  # Seed fija para auditoría
        return random.sample(self.poblacion, tamano)
    
    def seleccionar_muestra_estratificada(self, tamano: int) -> List[Dict[str, Any]]:
        """
        Selecciona muestra estratificada (NIA 530 párrafo A7).
        
        Divide la población en subpoblaciones (estratos) con características
        similares, generalmente por valor monetario.
        
        Estratos típicos:
        - Estrato 1: Importes > materialidad (100% de revisión)
        - Estrato 2: Importes 50-100% materialidad (muestreo)
        - Estrato 3: Importes < 50% materialidad (muestreo reducido)
        
        Args:
            tamano: Tamaño de muestra total
            
        Returns:
            List[Dict]: Elementos seleccionados estratificados
        """
        muestra = []
        
        # Estrato 1: 100% de revisión (importes > materialidad)
        estrato_1 = [item for item in self.poblacion 
                     if item['monto'] >= self.materialidad]
        muestra.extend(estrato_1)
        
        # Estrato 2: Importes significativos (50-100% materialidad)
        estrato_2 = [item for item in self.poblacion 
                     if self.materialidad * 0.5 <= item['monto'] < self.materialidad]
        n_estrato_2 = int(tamano * 0.3)  # 30% de muestra
        if estrato_2:
            random.seed(42)
            muestra.extend(random.sample(estrato_2, min(n_estrato_2, len(estrato_2))))
        
        # Estrato 3: Importes pequeños (< 50% materialidad)
        estrato_3 = [item for item in self.poblacion 
                     if item['monto'] < self.materialidad * 0.5]
        n_estrato_3 = int(tamano * 0.2)  # 20% de muestra
        if estrato_3:
            random.seed(42)
            muestra.extend(random.sample(estrato_3, min(n_estrato_3, len(estrato_3))))
        
        return muestra
    
    def evaluar_resultados(self, muestra: List[Dict[str, Any]], 
                         incorrecciones: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Evalúa resultados del muestreo (NIA 530 párrafos 14-15).
        
        Extrapolación de incorrecciones a la población total.
        
        Args:
            muestra: Elementos de la muestra
            incorrecciones: Incorrecciones detectadas
            
        Returns:
            Dict: Evaluación con proyección a población
        """
        total_muestra = sum(item['monto'] for item in muestra)
        total_incorrecciones = sum(inc['monto'] for inc in incorrecciones)
        
        # Tasa de incorrección en muestra
        tasa_incorreccion = total_incorrecciones / total_muestra if total_muestra > 0 else 0
        
        # Proyección a población
        total_poblacion = sum(item['monto'] for item in self.poblacion)
        proyeccion_incorreccion = total_poblacion * tasa_incorreccion
        
        # Evaluación vs. materialidad
        es_material = proyeccion_incorreccion >= self.materialidad
        
        return {
            'tasa_incorreccion_muestra': round(tasa_incorreccion * 100, 2),
            'proyeccion_poblacion': round(proyeccion_incorreccion, 2),
            'materialidad': round(self.materialidad, 2),
            'es_material': es_material,
            'recomendacion': 'Ampliar pruebas' if es_material else 'Aceptar población'
        }


# Ejemplo de uso
if __name__ == "__main__":
    # Población de 1,000 transacciones
    poblacion = [{'id': i, 'monto': random.uniform(100, 100000)} for i in range(1000)]
    
    muestreo = MuestreoNIA530(
        poblacion=poblacion,
        nivel_confianza=0.95,
        materialidad=50000,
        riesgo_inherente=0.6,
        riesgo_control=0.5
    )
    
    tamano = muestreo.calcular_tamano_muestra()
    print(f"Tamaño de muestra recomendado: {tamano}")
    
    muestra = muestreo.seleccionar_muestra_estratificada(tamano)
    print(f"Muestra seleccionada: {len(muestra)} elementos")
```

#### Algoritmo 2: Pruebas Sustantivas Automatizadas

```python
from typing import List, Dict, Any
from dataclasses import dataclass
from datetime import datetime

@dataclass
class PruebaSustantiva:
    """
    Implementación de pruebas sustantivas según NIA 330.
    
    Las pruebas sustantivas son procedimientos diseñados para detectar
    incorrecciones materiales en las afirmaciones de los estados financieros.
    """
    nombre: str
    tipo: str  # 'analitica' o 'detalle'
    afirmacion: str  # 'existencia', 'integridad', 'valuacion', 'exactitud'
    cuenta: str
    umbrales: Dict[str, float]
    
    def ejecutar_prueba_analitica(self, 
                                  saldo_actual: float,
                                  saldo_anterior: float,
                                  esperado: float) -> Dict[str, Any]:
        """
        Ejecuta procedimiento analítico sustantivo (NIA 520).
        
        Compara relaciones financieras para identificar fluctuaciones
        inusuales que requieran investigación adicional.
        
        Args:
            saldo_actual: Saldo del periodo actual
            saldo_anterior: Saldo del periodo anterior
            esperado: Saldo esperado según modelo
            
        Returns:
            Dict: Resultados de la prueba analítica
        """
        # Variación absoluta y porcentual
        variacion_absoluta = saldo_actual - saldo_anterior
        variacion_porcentual = (variacion_absoluta / saldo_anterior * 100 
                               if saldo_anterior != 0 else 0)
        
        # Desviación vs. esperado
        desviacion = saldo_actual - esperado
        desviacion_porcentual = (desviacion / esperado * 100 
                                if esperado != 0 else 0)
        
        # Evaluación de materialidad
        es_significativa = abs(desviacion_porcentual) > self.umbrales['desviacion_max']
        
        return {
            'prueba': self.nombre,
            'tipo': 'analítica',
            'cuenta': self.cuenta,
            'saldo_actual': round(saldo_actual, 2),
            'saldo_anterior': round(saldo_anterior, 2),
            'variacion_absoluta': round(variacion_absoluta, 2),
            'variacion_porcentual': round(variacion_porcentual, 2),
            'esperado': round(esperado, 2),
            'desviacion': round(desviacion, 2),
            'desviacion_porcentual': round(desviacion_porcentual, 2),
            'es_significativa': es_significativa,
            'requiere_investigacion': es_significativa,
            'fecha_prueba': datetime.now().isoformat()
        }
    
    def ejecutar_prueba_detalle(self, 
                               transacciones: List[Dict[str, Any]],
                               soporte_documental: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Ejecuta prueba de detalle (NIA 500).
        
        Verifica transacciones individuales contra documentación
        soporte (CFDI, contratos, recibos).
        
        Args:
            transacciones: Transacciones a verificar
            soporte_documental: Documentación de soporte
            
        Returns:
            Dict: Resultados de la prueba de detalle
        """
        resultados = {
            'prueba': self.nombre,
            'tipo': 'detalle',
            'cuenta': self.cuenta,
            'total_transacciones': len(transacciones),
            'transacciones_verificadas': 0,
            'transacciones_con_soporte': 0,
            'transacciones_sin_soporte': 0,
            'monto_verificado': 0,
            'monto_sin_soporte': 0,
            'excepciones': []
        }
        
        # Crear mapa de soporte por transacción
        soporte_map = {doc['transaccion_id']: doc for doc in soporte_documental}
        
        for transaccion in transacciones:
            resultados['transacciones_verificadas'] += 1
            resultados['monto_verificado'] += transaccion['monto']
            
            # Verificar existencia de soporte
            soporte = soporte_map.get(transaccion['id'])
            
            if soporte:
                resultados['transacciones_con_soporte'] += 1
                
                # Verificar concordancia de montos
                if abs(soporte['monto'] - transaccion['monto']) > self.umbrales['tolerancia']:
                    resultados['excepciones'].append({
                        'transaccion_id': transaccion['id'],
                        'monto_transaccion': transaccion['monto'],
                        'monto_soporte': soporte['monto'],
                        'diferencia': transaccion['monto'] - soporte['monto'],
                        'tipo_excepcion': 'Diferencia en monto'
                    })
            else:
                resultados['transacciones_sin_soporte'] += 1
                resultados['monto_sin_soporte'] += transaccion['monto']
                resultados['excepciones'].append({
                    'transaccion_id': transaccion['id'],
                    'monto': transaccion['monto'],
                    'tipo_excepcion': 'Sin soporte documental'
                })
        
        # Calcular porcentaje de excepciones
        resultados['porcentaje_con_soporte'] = round(
            resultados['transacciones_con_soporte'] / 
            resultados['transacciones_verificadas'] * 100 
            if resultados['transacciones_verificadas'] > 0 else 0, 2
        )
        
        resultados['es_aceptable'] = (
            resultados['porcentaje_con_soporte'] >= self.umbrales['soporte_min']
        )
        
        return resultados


# Ejemplo de uso
if __name__ == "__main__":
    prueba = PruebaSustantiva(
        nombre='Verificación de Cuentas por Cobrar',
        tipo='detalle',
        afirmacion='existencia',
        cuenta='1100-001 Clientes',
        umbrales={
            'tolerancia': 100.0,
            'soporte_min': 95.0,
            'desviacion_max': 15.0
        }
    )
    
    transacciones = [
        {'id': 'CFDI-001', 'monto': 10000, 'transaccion_id': 'CFDI-001'},
        {'id': 'CFDI-002', 'monto': 15000, 'transaccion_id': 'CFDI-002'},
        {'id': 'CFDI-003', 'monto': 8000, 'transaccion_id': 'CFDI-003'}
    ]
    
    soporte = [
        {'transaccion_id': 'CFDI-001', 'monto': 10000, 'tipo': 'CFDI'},
        {'transaccion_id': 'CFDI-002', 'monto': 15000, 'tipo': 'CFDI'}
    ]
    
    resultado = prueba.ejecutar_prueba_detalle(transacciones, soporte)
    print(f"Transacciones con soporte: {resultado['porcentaje_con_soporte']}%")
    print(f"Es aceptable: {resultado['es_aceptable']}")
```

### 3.3 Thresholds y Parámetros Óptimos

| Parámetro | Valor Recomendado | Rango Aceptable | Justificación |
|-----------|-------------------|-----------------|---------------|
| **Nivel de confianza** | 95% | 90-99% | Estándar de auditoría (NIA 530) |
| **Materialidad** | 5% utilidad antes de impuestos | 3-7% | Práctica común en auditoría financiera |
| **Riesgo inherente** | 0.6 (medio-alto) | 0.3-0.9 | Depende de evaluación de riesgos NIA 315 |
| **Riesgo de control** | 0.5 (medio) | 0.2-0.8 | Depende de efectividad de controles |
| **Tolerancia para diferencias** | $100 MXN | $50-$500 | Umbral para excepciones en pruebas de detalle |
| **Soporte documental mínimo** | 95% | 90-98% | Porcentaje mínimo de transacciones con soporte |
| **Desviación máxima en analíticas** | 15% | 10-20% | Variación que requiere investigación adicional |

### 3.4 Integración con NVIDIA NIM

| Modelo | Uso | Costo | Latencia | Configuración |
|--------|-----|-------|----------|---------------|
| **Llama-3.1-405B** | Análisis de papeles de trabajo | $0.04/1K tokens | ~200ms | temperature=0.1, max_tokens=2000 |
| **Mistral-Large-3-675B** | Generación de hallazgos | $0.04/1K tokens | ~250ms | temperature=0.2, max_tokens=1500 |
| **Qwen3.5-397B** | Clasificación de riesgos | $0.04/1K tokens | ~180ms | temperature=0.1, max_tokens=1000 |
| **DeepSeek-V3.2** | Resumen de excepciones | $0.04/1K tokens | ~200ms | temperature=0.1, max_tokens=1200 |

### 3.5 Endpoints Requeridos (Backend)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/v1/auditoria/muestreo/calculartamano` | Calcula tamaño de muestra NIA 530 | ✅ JWT |
| POST | `/v1/auditoria/muestreo/seleccionar` | Selecciona muestra aleatoria/estratificada | ✅ JWT |
| POST | `/v1/auditoria/pruebas-sustantivas/analiticas` | Ejecuta procedimientos analíticos | ✅ JWT |
| POST | `/v1/auditoria/pruebas-sustantivas/detalle` | Ejecuta pruebas de detalle | ✅ JWT |
| GET | `/v1/auditoria/papeles-trabajo/{id}` | Obtiene papeles de trabajo | ✅ JWT |
| POST | `/v1/auditoria/papeles-trabajo/generar` | Genera papeles de trabajo automáticos | ✅ JWT |
| POST | `/v1/auditoria/dictamen/generar` | Genera dictamen de auditoría | ✅ JWT |
| GET | `/v1/auditoria/hallazgos` | Lista hallazgos de auditoría | ✅ JWT |

### 3.6 Componentes Requeridos (Frontend)

| Componente | Tipo | Propósito |
|------------|------|-----------|
| `MuestreoNIA530.tsx` | UI Component | Configuración y ejecución de muestreo |
| `PruebasSustantivas.tsx` | UI Component | Ejecución de pruebas analíticas y de detalle |
| `PapelesTrabajoViewer.tsx` | UI Component | Visualización de papeles de trabajo |
| `DictamenGenerator.tsx` | UI Component | Generación de dictamen de auditoría |
| `HallazgosDashboard.tsx` | UI Component | Dashboard de hallazgos y excepciones |
| `useMuestreo.ts` | Hook | Lógica de muestreo estadístico |
| `usePruebasSustantivas.ts` | Hook | Lógica de pruebas sustantivas |
| `auditoriaService.ts` | Service | Comunicación con API de auditoría |

---

## 4. Limitantes y Restricciones

### 4.1 Limitación 1: Acceso a Datos Contables Completos

**Problema:**
El módulo requiere acceso a la balanza de comprobación, pólizas contables y auxiliares de cuentas en formato digital estructurado. Muchas PYMES mexicanas aún llevan contabilidad en Excel o papel, lo que dificulta la automatización de pruebas de auditoría.

**Solución:**
```python
def importar_contabilidad_desde_excel(archivo_path: str) -> Dict[str, Any]:
    """
    Importa datos contables desde Excel con validación de estructura.
    
    Args:
        archivo_path: Ruta al archivo Excel
        
    Returns:
        Dict: Datos contables estructurados
    """
    import pandas as pd
    
    # Leer Excel con múltiples hojas
    xls = pd.ExcelFile(archivo_path)
    
    datos = {
        'balanza': pd.read_excel(xls, 'Balanza'),
        'polizas': pd.read_excel(xls, 'Pólizas'),
        'auxiliar': pd.read_excel(xls, 'Auxiliar')
    }
    
    # Validar columnas requeridas
    columnas_requeridas_balanza = [
        'cuenta', 'nombre_cuenta', 'saldo_inicial', 
        'cargos', 'abonos', 'saldo_final'
    ]
    
    for col in columnas_requeridas_balanza:
        if col not in datos['balanza'].columns:
            raise ValueError(f"Columna requerida faltante: {col}")
    
    # Estandarizar nombres de columnas
    datos['balanza'] = datos['balanza'].rename(columns={
        'cuenta': 'codigo_cuenta',
        'nombre_cuenta': 'descripcion'
    })
    
    return datos
```

**Impacto:**
- Requiere módulo adicional de importación y validación de datos
- Tiempo adicional de 2-4 horas para limpieza de datos en primer uso
- Necesidad de plantillas Excel estandarizadas para clientes

### 4.2 Limitación 2: Juicio Profesional en Evaluación de Riesgos

**Problema:**
La NIA 315 requiere que el auditor ejerza juicio profesional para identificar y valorar riesgos de incorrección material. Este juicio no puede ser completamente automatizado, ya que depende de conocimiento del negocio, industria y entorno del cliente.

**Solución:**
El módulo proporciona **recomendaciones basadas en reglas** pero requiere **validación humana** del auditor responsable:

1. **Evaluación inicial automatizada**: El sistema calcula riesgos inherentes basados en:
   - Complejidad de transacciones
   - Volumen de operaciones
   - Cambios en controles internos
   - Antecedentes de errores

2. **Revisión y ajuste manual**: El auditor senior revisa y ajusta las evaluaciones de riesgo

3. **Documentación de juicio**: El sistema registra las decisiones del auditor para trazabilidad

**Impacto:**
- No se puede eliminar completamente la intervención humana
- El módulo reduce tiempo de evaluación en 40-50% pero no la reemplaza
- Requiere auditor certificado para validación final

### 4.3 Riesgos Técnicos Identificados

| Riesgo | Probabilidad | Impacto | Mitigación | Owner |
|--------|--------------|---------|------------|-------|
| **Datos incompletos o inconsistentes** | ALTA | ALTO | Validación exhaustiva de entrada con reportes de errores detallados | Tech Lead |
| **Falsos positivos en detección de excepciones** | MEDIA | MEDIO | Ajuste de umbrales por cliente y aprendizaje de correcciones | Product Owner |
| **Resistencia de auditores a adoptar automatización** | MEDIA | ALTO | Capacitación y demostración de ROI con casos de éxito | Product Owner |
| **Cambios en NIA (actualizaciones IMCP)** | BAJA | ALTO | Monitoreo trimestral de actualizaciones del IMCP y arquitectura modular | Tech Lead |
| **Problemas de performance con grandes volúmenes** | MEDIA | MEDIO | Paginación, procesamiento batch y optimización de queries | Dev Lead |

---

## 5. Métricas Esperadas

| Métrica | Target | Fórmula | Medición | Frecuencia |
|---------|--------|---------|----------|------------|
| **Reducción de tiempo de auditoría** | 60-70% | `(tiempo_manual - tiempo_auto) / tiempo_manual × 100` | Por auditoría | Por cliente |
| **Precisión en muestreo NIA 530** | 95%+ | `(muestras_representativas / total_muestras) × 100` | Por muestreo | Por auditoría |
| **Detección de excepciones** | 90%+ | `(excepciones_detectadas / excepciones_reales) × 100` | Por pruebas | Por auditoría |
| **Tiempo de procesamiento** | <500ms | `tiempo_fin - tiempo_inicio` | Por operación | En tiempo real |
| **Adopción por auditores** | 80%+ | `(auditores_activos / auditores_capacitados) × 100` | Por firma | Mensual |

### 5.1 Criterios de Aceptación
- [ ] **Criterio 1:** El módulo reduce el tiempo de auditoría en al menos 60% vs. proceso manual
- [ ] **Criterio 2:** El muestreo NIA 530 genera muestras representativas con 95% de confianza estadística
- [ ] **Criterio 3:** Las pruebas sustantivas detectan el 90%+ de excepciones materiales
- [ ] **Criterio 4:** Los papeles de trabajo generados cumplen con NIA 230 (documentación suficiente y adecuada)
- [ ] **Criterio 5:** El dictamen de auditoría sigue la estructura de NIA 700 (opinión, bases, responsabilidades)

---

## 6. Roadmap de Implementación

### Fase 1: Motor de Muestreo NIA 530 (4 semanas)

**Fecha de inicio:** 8 abril 2026
**Fecha de fin:** 5 mayo 2026
**Owner:** Backend Lead

| Semana | Entregable | Owner | Dependencias | Criterio de Éxito |
|--------|------------|-------|--------------|-------------------|
| **1** | Modelo de datos para poblaciones y muestras | Backend Dev | Diseño de BD aprobado | Tablas creadas y migradas |
| **2** | Algoritmo de cálculo de tamaño de muestra | Backend Dev | Algoritmo validado por auditor | Tests unitarios 90%+ coverage |
| **3** | Métodos de selección (aleatoria, estratificada) | Backend Dev | Algoritmo base completado | Tests con datos reales |
| **4** | API endpoints y documentación | Backend Dev | Métodos de selección completados | Swagger docs completas |

### Fase 2: Pruebas Sustantivas Automatizadas (4 semanas)

**Fecha de inicio:** 6 mayo 2026
**Fecha de fin:** 2 junio 2026
**Owner:** Backend Lead

| Semana | Entregable | Owner | Dependencias | Criterio de Éxito |
|--------|------------|-------|--------------|-------------------|
| **1** | Procedimientos analíticos (NIA 520) | Backend Dev | Fase 1 completada | Comparaciones vs. esperado funcionales |
| **2** | Pruebas de detalle con validación de soporte | Backend Dev | Fase 1 completada | Validación CFDI integrada |
| **3** | Motor de excepciones y hallazgos | Backend Dev | Pruebas de detalle completadas | Dashboard de excepciones |
| **4** | Integración con NVIDIA NIM para análisis | AI Engineer | Motor de excepciones completado | Respuestas de LLM validadas |

### Fase 3: Papeles de Trabajo y Dictamen (4 semanas)

**Fecha de inicio:** 3 junio 2026
**Fecha de fin:** 30 junio 2026
**Owner:** Fullstack Lead

| Semana | Entregable | Owner | Dependencias | Criterio de Éxito |
|--------|------------|-------|--------------|-------------------|
| **1** | Generador de papeles de trabajo (NIA 230) | Fullstack Dev | Fase 2 completada | Plantillas NIA 230 funcionales |
| **2** | UI de visualización de papeles de trabajo | Frontend Dev | Generador completado | UI responsive y accesible |
| **3** | Generador de dictamen (NIA 700) | Fullstack Dev | Papeles de trabajo completados | Dictamen con estructura NIA 700 |
| **4** | Testing con auditores reales y ajustes | QA Lead | Todas las fases completadas | 90%+ satisfacción en UAT |

### 6.1 Dependencias Críticas
- [ ] **Validación con auditor certificado:** Todas las fórmulas y thresholds deben ser validados por un auditor con cédula profesional IMCP
- [ ] **Acceso a datos de prueba:** Se requieren datos contables reales (anonimizados) de 3-5 clientes para testing
- [ ] **Integración con sistema contable:** El módulo debe integrarse con el sistema contable existente (backend knowledge map)
- [ ] **Capacitación a auditores:** Programa de capacitación de 8 horas para auditores que usarán el módulo

### 6.2 Recursos Requeridos

| Recurso | Tipo | Cantidad | Owner |
|---------|------|----------|-------|
| **Backend Developers** | Humano | 2 developers × 12 semanas | Tech Lead |
| **Frontend Developer** | Humano | 1 developer × 4 semanas | Tech Lead |
| **AI Engineer** | Humano | 1 engineer × 4 semanas | Tech Lead |
| **QA Engineer** | Humano | 1 engineer × 4 semanas | QA Lead |
| **Auditor Certificado (consultor)** | Humano | 10 horas de validación | Product Owner |
| **NVIDIA NIM API** | Técnico | ~500K tokens/mes | DevOps |
| **Servidores de procesamiento** | Técnico | 2 instancias (dev + prod) | DevOps |
| **Presupuesto total estimado** | Económico | $450,000 MXN (3 meses) | Product Owner |

---

## 7. Seguridad y Cumplimiento

### 7.1 Requisitos SAT para Sistemas Contables
| Requisito | Descripción | Impacto en Módulo |
|-----------|-------------|-------------------|
| **Contabilidad electrónica** | Envío de balanza y pólizas al SAT (Anexo 29 RMF) | Los datos de auditoría deben ser consistentes con contabilidad electrónica |
| **Conservación de registros** | 5 años de conservación de CFDI y documentación | Papeles de trabajo deben conservarse 5 años |
| **Sello digital** | Integridad de información con sello digital | Papeles de trabajo deben sellarse digitalmente |
| **Trazabilidad** | Auditoría de cambios en registros | El módulo debe registrar quién, cuándo y qué modificó |

### 7.2 Mejores Prácticas de Seguridad
| Capa | Medida | Implementación |
|------|--------|----------------|
| **Datos** | Encriptación AES-256 en reposo | AWS KMS / Azure Key Vault |
| **Acceso** | Autenticación JWT + 2FA | Auth0 / AWS Cognito |
| **Red** | WAF + DDoS protection | AWS WAF / Cloudflare |
| **Auditoría** | Logs de todas las operaciones | ELK Stack / Splunk |
| **Backup** | Backups diarios encriptados | AWS S3 + versioning |

### 7.3 Consideraciones de Privacidad
- [ ] **Datos de clientes:** Los nombres y RFC de clientes auditados deben enmascararse en ambientes de desarrollo
- [ ] **Información financiera:** Los saldos y transacciones son datos sensibles que requieren encriptación end-to-end
- [ ] **Papeles de trabajo:** Contienen información confidencial del cliente y deben tener acceso restringido por roles

### 7.4 Multas por Incumplimiento
| Incumplimiento | Multa | Autoridad |
|----------------|-------|-----------|
| **No conservar papeles de trabajo 5 años** | $14,050 - $28,100 MXN | SAT (CFF Art. 86) |
| **Falta de confidencialidad de información** | $15,730 - $23,580 MXN | IMCP (Código de Ética) |
| **Negligencia en auditoría** | Suspensión de cédula profesional | IMCP |

---

## 8. Conclusiones y Recomendaciones

### 8.1 Hallazgos Clave
1. **NIA 530 es automatizable:** El muestreo estadístico puede implementarse completamente con algoritmos probados, reduciendo 65% del tiempo de selección de muestra
2. **CAATs son estándar en la industria:** Herramientas como IDEA y ACL son ampliamente usadas por Big 4 en México, validando el enfoque del módulo
3. **Juicio profesional es irreemplazable:** La evaluación de riesgos (NIA 315) requiere validación humana, pero puede asistirse con IA para recomendaciones
4. **ROI es significativo:** Con 25 auditorías anuales, el ROI es de 631% ($595,000 MXN de ahorro anual)
5. **Integración con contabilidad es crítica:** El éxito del módulo depende de acceso a datos contables estructurados (balanza, pólizas, auxiliares)

### 8.2 Recomendaciones Finales

| Área | Recomendación | Prioridad | Owner |
|------|---------------|-----------|-------|
| **Desarrollo** | Iniciar con Fase 1 (muestreo NIA 530) por ser más acotada y de alto impacto | ALTA | Tech Lead |
| **Validación** | Contratar auditor certificado como consultor para validar fórmulas y thresholds | ALTA | Product Owner |
| **Integración** | Priorizar integración con sistema contable existente antes de desarrollar UI | ALTA | Tech Lead |
| **Capacitación** | Desarrollar programa de capacitación de 8 horas para auditores | MEDIA | Product Owner |
| **Monitoreo** | Establecer revisión trimestral de actualizaciones del IMCP a NIA | MEDIA | Tech Lead |

### 8.3 Próximos Pasos
- [ ] **Validar con auditor certificado:** Agendar sesión de 4 horas con auditor IMCP para revisar algoritmos - **Fecha límite:** 21 marzo 2026
- [ ] **Crear issues GitHub:** Descomponer Fase 1 en issues técnicos detallados - **Fecha límite:** 25 marzo 2026
- [ ] **Obtener datos de prueba:** Solicitar a 3 clientes datos contables anonimizados para testing - **Fecha límite:** 28 marzo 2026
- [ ] **Iniciar implementación Fase 1:** Comenzar desarrollo de motor de muestreo - **Fecha límite:** 8 abril 2026

---

## 9. Fuentes Consultadas

### Fuentes Oficiales (Consultadas con Tavily)
| Fuente | URL | Fecha de Consulta |
|--------|-----|-------------------|
| **IMCP - Normas de Auditoría** | https://imcp.org.mx/normas-de-auditoria/ | 10-mar-2026 |
| **IMCP - Guía EUC-CP 2026** | https://imcp.org.mx/wp-content/uploads/2025/03/Gui%CC%81a-EUC-CP-2026.pdf | 10-mar-2026 |
| **IMCP - Material de Entrenamiento NIA** | https://imcp.org.mx/normas-internacionales-de-auditoria-material-de-entrenamiento-2/ | 10-mar-2026 |
| **UNIR México - Normas Internacionales de Auditoría** | https://mexico.unir.net/noticias/economia/normas-internacionales-auditoria/ | 10-mar-2026 |
| **AMCP - NIA-LCE para entidades menos complejas** | https://amcpdf.org.mx/norma-internacional-de-auditoria-para-auditorias-de-estados-financieros-de-entidades-menos-complejas-nia-lce/ | 10-mar-2026 |
| **vLex - NIA 530 Muestreo de Auditoría** | https://vlex.com.mx/vid/nia-530-muestreo-auditoria-1041797156 | 10-mar-2026 |
| **CCPUDG - NIA 530 Muestreo** | https://ccpudg.org.mx/wp-content/uploads/040-Boletin-Comision-NIA-y-NIF-CCPUDG-NIA-530.pdf | 10-mar-2026 |
| **Actualícese - Muestreo de Auditoría NIA 530** | https://actualicese.com/archivo/muestreo-de-auditoria-aplicacion-de-la-nia-530/ | 10-mar-2026 |

### Fuentes Técnicas
| Fuente | URL | Fecha de Consulta |
|--------|-----|-------------------|
| **CaseWare IDEA** | https://www.caseware.com/idea | 10-mar-2026 |
| **Diligent ACL Analytics** | https://www.diligent.com/en-us/product/acl-analytics/ | 10-mar-2026 |
| **Wolters Kluwer TeamMate** | https://www.wolterskluwer.com/en/solutions/teammate | 10-mar-2026 |
| **ISACA - CAATs** | https://www.isaca.org/ | 10-mar-2026 |
| **NVIDIA NIM** | https://build.nvidia.com/ | 10-mar-2026 |
| **Gov.bc.ca - CAAT Manual** | https://www2.gov.bc.ca/gov/content/taxes/verification-audit-ruling-appeal/audit/cta-manual/caat | 10-mar-2026 |
| **Encyclopedia - CAATT** | https://encyclopedia.pub/entry/46845 | 10-mar-2026 |

### Fuentes de Mercado
| Fuente | URL | Fecha de Consulta |
|--------|-----|-------------------|
| **Auditool - Pruebas Sustantivas** | https://www.auditool.org/blog/auditoria-externa/pruebas-sustantivas-que-todo-auditor-financiero-debe-realizar | 10-mar-2026 |
| **ASEM - Pasos de Auditoría Financiera** | https://asem.mx/blog_asem/pasos-clave-de-una-auditoria-financiera-que-no-puedes-ignorar/ | 10-mar-2026 |
| **Actualícese - Pruebas de Controles vs. Sustantivas** | https://actualicese.com/pruebas-de-controles-vs-procedimientos-sustantivos/ | 10-mar-2026 |
| **SentinelOne - Herramientas de Auditoría 2025** | https://www.sentinelone.com/es/cybersecurity-101/cybersecurity/it-security-audit-tools/ | 10-mar-2026 |

---

## 10. Control de Cambios

| Versión | Fecha | Autor | Tipo | Cambios Realizados | Sección Afectada |
|---------|-------|-------|------|-------------------|------------------|
| 1.0 | 10-mar-2026 | Diego Gzz | Creación | Versión inicial del documento | Todo el documento |

---

**Documento elaborado por:** Diego Gzz (Principal Engineering Lead)
**Fecha:** 10 de marzo de 2026
**Revisado por:** Por definir (Auditor Certificado IMCP)
**Aprobado por:** Por definir (Product Owner)
**Próxima actualización:** Después de validación con auditor certificado (21 marzo 2026)

---

*Fin de la Investigación de Auditoría con NIA y CAATs*
