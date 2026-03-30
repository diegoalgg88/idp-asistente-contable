# Investigación Técnica: Asesoría Fiscal Inteligente

**Fecha:** 10 de marzo de 2026
**Versión:** 1.0
**Módulo:** Asesoría Fiscal con IA
**Prioridad:** 🟡 ALTA
**Gap ID:** Gap #7
**Owner:** Por definir

---

## 1. Descripción del Módulo

### 1.1 Propósito
El módulo de Asesoría Fiscal Inteligente proporciona consultas especializadas sobre deducibilidad de impuestos, regímenes fiscales (RESICO), precios de transferencia y opinión de cumplimiento SAT mediante un sistema RAG (Retrieval-Augmented Generation) entrenado en legislación fiscal mexicana actualizada (LISR, LIVA, CFF, RMF 2026). Este módulo está diseñado para contadores, despachos fiscales y departamentos financieros de empresas que buscan reducir el tiempo de investigación fiscal de 1-2 horas/consulta a 10-15 minutos/consulta, logrando un ahorro del 85-90%.

### 1.2 Actividades del Contador que Automatiza
| Actividad | Frecuencia | Tiempo Actual | Tiempo Esperado | Ahorro |
|-----------|------------|---------------|-----------------|--------|
| Investigación de deducibilidad | Variable | 30-60 min/consulta | 5-10 min/consulta | 85% |
| Consulta de obligaciones RESICO | Variable | 20-40 min/consulta | 3-5 min/consulta | 87% |
| Análisis de precios de transferencia | Trimestral | 2-4 horas/caso | 15-20 min/caso | 90% |
| Verificación de opinión cumplimiento | Mensual | 15-30 min/verificación | 2-3 min/verificación | 90% |
| Interpretación de criterios SAT | Variable | 45-90 min/consulta | 5-10 min/consulta | 88% |

### 1.3 Dolor Principal que Resuelve
Los contadores y asesores fiscales dedican 1-2 horas por consulta a investigar manualmente en leyes, reglamentos, criterios normativos del SAT y jurisprudencia para responder preguntas específicas de clientes sobre deducibilidad, regímenes fiscales y obligaciones. Esta investigación manual genera:
- Respuestas genéricas que no aplican al caso específico del cliente
- Riesgo de proporcionar asesoría desactualizada por cambios legislativos
- Pérdida de competitividad vs. despachos con herramientas de investigación avanzada
- Estrés por plazos cortos de respuesta a clientes exigentes

### 1.4 ROI Esperado
| Concepto | Valor |
|----------|-------|
| Tiempo liberado por consulta | 50 minutos promedio |
| Valor de hora de asesor fiscal | $1,200 MXN |
| Ahorro por consulta | $1,000 MXN |
| Consultas anuales promedio (despacho mediano) | 500 |
| **ROI anual** | **$500,000 MXN (200%)** |

---

## 2. Estado del Arte en México (2026)

### 2.1 Tecnologías Disponibles
| Tecnología | Proveedor | Estado | Costo | Documentación |
|------------|-----------|--------|-------|---------------|
| **RAG Legal con ChromaDB** | Open Source | ✅ Activa | Gratis | [URL](https://www.trychroma.com/) |
| **NVIDIA NIM Reranker** | NVIDIA | ✅ Activa | $0.04/1K tokens | [URL](https://build.nvidia.com/) |
| **LLM para respuestas** | NVIDIA (Llama-3.1-405B) | ✅ Activa | $0.04/1K tokens | [URL](https://build.nvidia.com/) |
| **SAT API (no oficial)** | Terceros | ⚠️ Limitada | Variable | Sin docs oficiales |
| **e.firma validación** | SAT | ✅ Activa | Gratis | [URL](https://www.sat.gob.mx/) |

### 2.2 Proveedores de APIs/Servicios
| Proveedor | API/Servicio | Sandbox | Autenticación | Límites |
|-----------|--------------|---------|---------------|---------|
| **SAT** | Consulta RFC, Opinión Cumplimiento | ❌ No | e.firma | 100 req/día |
| **NVIDIA NIM** | LLM Inference + Reranker | ✅ Sí | Bearer Token | 1M tokens/min |
| **Prodecon** | Consultas tributarias | ❌ No | Público | Sin límite |

### 2.3 Regulación Aplicable (SAT, NIF, etc.)
| Norma/Regulación | Artículo | Vigencia | Impacto en Módulo |
|------------------|----------|----------|-------------------|
| **LISR** | Art. 27-32 (Deducciones) | 2026 | Define requisitos de deducibilidad de gastos |
| **LISR** | Art. 113-E a 113-J (RESICO) | 2026 | Establece régimen simplificado de confianza |
| **LIVA** | Art. 1, 2, 5, 14 | 2026 | Regula IVA tasa general 16% y fronteriza 8% |
| **CFF** | Art. 32-CFF (Opinión Cumplimiento) | 2026 | Establece requisitos de opinión positiva/negativa |
| **CFF** | Art. 69, 69-B, 69-B Bis | 2026 | Lista de contribuyentes con operaciones simuladas |
| **RMF 2026** | Anexo 2, 4, 5, 29 | 2026 | Resolución Miscelánea Fiscal con reglas operativas |
| **LISR** | Art. 179-183 (Precios de Transferencia) | 2026 | Regula operaciones con partes relacionadas |

**Fuente:** SAT - Ley del Impuesto Sobre la Renta 2026, [URL](https://www.sat.gob.mx/consultas/legislacion)

### 2.4 Casos de Éxito Documentados
| Empresa | Caso | Resultado | Lección Aprendida |
|---------|------|-----------|-------------------|
| **BBVA México** | RAG Legal para consultas fiscales internas | 78% reducción en tiempo de investigación | La base de conocimiento debe actualizarse semanalmente |
| **Deloitte México** | Asistente IA para deducibilidad de gastos | 85% de consultas resueltas sin intervención humana | El reranking mejora precisión de respuestas en 40% |
| **Grupo Salinas** | Chatbot fiscal para empleados | 92% satisfacción en consultas de nómina y deducciones | La capacitación de usuarios es crítica para adopción |

**Fuente:** Expansión - IA en servicios financieros 2025, [URL](https://expansion.mx/tecnologia/2025/11/15/ia-servicios-financieros-mexico)

### 2.5 Tendencias de Mercado
- **RAG especializado en fiscal**: Bases vectoriales con legislación actualizada diariamente
- **Validación automática de CFDI**: Verificación en tiempo real de requisitos de deducibilidad
- **Alertas de cambios legislativos**: Notificaciones automáticas cuando se modifican artículos relevantes
- **Integración con portal SAT**: Consulta directa de opinión de cumplimiento y listas 69-B
- **Asesoría proactiva**: El sistema sugiere optimizaciones fiscales basadas en perfil del contribuyente

---

## 3. Implementación Técnica

### 3.1 Arquitectura Recomendada

```
┌─────────────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Chat Fiscal │  │ Validador   │  │ Dashboard   │              │
│  │ (UI Chat)   │  │ CFDI/Deducc.│  │ Consultas   │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    CAPA RAG (Retrieval-Augmented Generation)     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Embedding   │  │ ChromaDB    │  │ NVIDIA NIM  │              │
│  │ Documents   │  │ (Vector DB) │  │ Reranker    │              │
│  │ LISR,LIVA   │  │ 50K+ frags  │  │ Top-5       │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Query       │  │ Context     │  │ LLM         │              │
│  │ Processor   │  │ Builder     │  │ Generator   │              │
│  │ (NLP)       │  │ (Top-5)     │  │ (Respuesta) │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    CAPA DE INTEGRACIÓN SAT                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Consulta    │  │ Opinión     │  │ Lista       │              │
│  │ RFC         │  │ Cumplimiento│  │ 69-B        │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    CAPA DE DATOS                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ LISR 2026   │  │ LIVA 2026   │  │ CFF 2026    │              │
│  │ (250 arts)  │  │ (80 arts)   │  │ (100 arts)  │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ RMF 2026    │  │ Criterios   │  │ Jurisprud.  │              │
│  │ (Anexos)    │  │ SAT         │  │ TFJA        │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Algoritmos Específicos

#### Algoritmo 1: RAG para Consultas Fiscales

```python
from typing import List, Dict, Any
from dataclasses import dataclass
import hashlib

@dataclass
class DocumentoFiscal:
    """
    Representa un fragmento de legislación fiscal para RAG.
    """
    id: str
    ley: str  # 'LISR', 'LIVA', 'CFF', 'RMF'
    articulo: str
    fraccion: str
    contenido: str
    vigencia: str
    tags: List[str]


class RAGFiscal:
    """
    Sistema RAG (Retrieval-Augmented Generation) para consultas fiscales.
    
    Implementa recuperación de documentos fiscales relevantes y generación
    de respuestas con LLM especializado en legislación mexicana.
    """
    
    def __init__(self, chroma_collection, llm_client, reranker_client):
        """
        Inicializa el sistema RAG.
        
        Args:
            chroma_collection: Colección ChromaDB con documentos fiscales
            llm_client: Cliente para LLM (NVIDIA NIM)
            reranker_client: Cliente para reranking (NVIDIA NIM Reranker)
        """
        self.chroma = chroma_collection
        self.llm = llm_client
        self.reranker = reranker_client
    
    def procesar_query(self, query: str) -> str:
        """
        Procesa una consulta fiscal y genera respuesta.
        
        Flujo RAG:
        1. Embedding del query
        2. Búsqueda vectorial (top-20)
        3. Reranking (top-5)
        4. Construcción de contexto
        5. Generación de respuesta con LLM
        
        Args:
            query: Pregunta del usuario
            
        Returns:
            str: Respuesta generada con citas de artículos
        """
        # Paso 1: Búsqueda vectorial inicial (top-20)
        resultados_iniciales = self.chroma.query(
            query_texts=[query],
            n_results=20,
            include=['documents', 'metadatas']
        )
        
        # Paso 2: Reranking con NVIDIA NIM
        documentos = [doc for doc in resultados_iniciales['documents'][0]]
        resultados_rerank = self.reranker.rerank(
            query=query,
            documents=documentos,
            top_n=5
        )
        
        # Paso 3: Construir contexto con documentos rankeados
        contexto = self._construir_contexto(resultados_rerank)
        
        # Paso 4: Generar respuesta con LLM
        prompt = self._construir_prompt(query, contexto)
        respuesta = self.llm.generate(prompt)
        
        return respuesta
    
    def _construir_contexto(self, documentos_rankeados: List[Dict]) -> str:
        """
        Construye contexto con documentos fiscales relevantes.
        
        Args:
            documentos_rankeados: Documentos después de reranking
            
        Returns:
            str: Contexto formateado con artículos fiscales
        """
        contexto_parts = []
        
        for i, doc in enumerate(documentos_rankeados, 1):
            metadata = doc.get('metadata', {})
            contexto_parts.append(
                f"[{i}] {metadata.get('ley', 'Desconocida')} "
                f"Art. {metadata.get('articulo', 'N/A')} "
                f"{metadata.get('fraccion', '')}\n"
                f"Contenido: {doc.get('text', '')}\n"
                f"Vigencia: {metadata.get('vigencia', 'N/A')}\n"
            )
        
        return "\n".join(contexto_parts)
    
    def _construir_prompt(self, query: str, contexto: str) -> str:
        """
        Construye prompt para LLM con contexto fiscal.
        
        Args:
            query: Pregunta original del usuario
            contexto: Documentos fiscales relevantes
            
        Returns:
            str: Prompt completo para LLM
        """
        prompt = f"""Eres un asesor fiscal experto en legislación mexicana. 
Responde la siguiente pregunta basándote ÚNICAMENTE en los documentos fiscales proporcionados.

**Instrucciones:**
1. Cita los artículos específicos que respaldan tu respuesta
2. Si la información no está en los documentos, indica "No hay información suficiente en la legislación consultada"
3. Proporciona la respuesta en español claro y preciso
4. Incluye referencias completas (ley, artículo, fracción)

**Contexto Fiscal:**
{contexto}

**Pregunta del usuario:**
{query}

**Respuesta:**
"""
        return prompt
    
    def validar_deducibilidad(self, 
                             tipo_gasto: str,
                             monto: float,
                             cfdi_disponible: bool,
                             medio_pago: str) -> Dict[str, Any]:
        """
        Valida si un gasto es deducible según LISR Art. 27-32.
        
        Args:
            tipo_gasto: Tipo de gasto (médico, colegiatura, etc.)
            monto: Monto del gasto
            cfdi_disponible: Si cuenta con CFDI válido
            medio_pago: Medio de pago (efectivo, tarjeta, transferencia)
            
        Returns:
            Dict: Resultado de validación con artículos aplicables
        """
        resultado = {
            'es_deducible': True,
            'articulos_aplicables': [],
            'requisitos_cumplidos': [],
            'requisitos_faltantes': [],
            'observaciones': []
        }
        
        # Requisito 1: CFDI (LISR Art. 27, fracción I)
        if cfdi_disponible:
            resultado['requisitos_cumplidos'].append('CFDI válido disponible')
            resultado['articulos_aplicables'].append('LISR Art. 27-I')
        else:
            resultado['requisitos_faltantes'].append('CFDI válido')
            resultado['es_deducible'] = False
            resultado['observaciones'].append(
                'Sin CFDI no es deducible (LISR Art. 27-I)'
            )
        
        # Requisito 2: Medio de pago (LISR Art. 27, fracción III)
        medios_validos = ['tarjeta', 'transferencia', 'cheque nominativo']
        if medio_pago.lower() in medios_validos:
            resultado['requisitos_cumplidos'].append(f'Medio de pago válido: {medio_pago}')
            resultado['articulos_aplicables'].append('LISR Art. 27-III')
        else:
            resultado['requisitos_faltantes'].append('Medio de pago válido (no efectivo)')
            resultado['es_deducible'] = False
            resultado['observaciones'].append(
                'Pagos en efectivo > $2,000 MXN no son deducibles (LISR Art. 27-III)'
            )
        
        # Requisito 3: Tipo de gasto (LISR Art. 28)
        gastos_no_deducibles = [
            'regalos', 'atención a clientes', 'multas', 
            'gastos personales', 'combustible (sin nexo con actividad)'
        ]
        
        if tipo_gasto.lower() in gastos_no_deducibles:
            resultado['es_deducible'] = False
            resultado['observaciones'].append(
                f'El gasto "{tipo_gasto}" está expresamente prohibido (LISR Art. 28)'
            )
            resultado['articulos_aplicables'].append('LISR Art. 28')
        
        # Límites específicos por tipo de gasto
        limites_deducibilidad = {
            'colegiaturas': {'limite': '5 UMA anual por nivel', 'art': 'LISR Art. 151-II'},
            'gastos_medicos': {'limite': '15% ingresos o 5 UMA', 'art': 'LISR Art. 151-I'},
            'intereses_hipotecarios': {'limite': '750,000 UDIS crédito', 'art': 'LISR Art. 151-IV'},
            'donativos': {'limite': '7% ingresos acumulables', 'art': 'LISR Art. 151-III'}
        }
        
        if tipo_gasto.lower() in limites_deducibilidad:
            limite_info = limites_deducibilidad[tipo_gasto.lower()]
            resultado['observaciones'].append(
                f"Límite: {limite_info['limite']} ({limite_info['art']})"
            )
        
        return resultado


# Ejemplo de uso
if __name__ == "__main__":
    # Validación de deducibilidad
    validador = RAGFiscal(chroma_collection=None, llm_client=None, reranker_client=None)
    
    resultado = validador.validar_deducibilidad(
        tipo_gasto='gastos médicos',
        monto=15000,
        cfdi_disponible=True,
        medio_pago='tarjeta'
    )
    
    print(f"¿Es deducible? {resultado['es_deducible']}")
    print(f"Requisitos cumplidos: {resultado['requisitos_cumplidos']}")
    print(f"Observaciones: {resultado['observaciones']}")
```

#### Algoritmo 2: Verificación de Opinión de Cumplimiento SAT

```python
from typing import Dict, Any
from dataclasses import dataclass
from datetime import datetime
import requests


@dataclass
class OpinionCumplimiento:
    """
    Verifica opinión de cumplimiento según CFF Art. 32-CFF.
    
    La opinión de cumplimiento es un documento emitido por el SAT
    que indica si un contribuyente está al corriente en sus obligaciones.
    """
    rfc: str
    tipo_persona: str  # 'fisica', 'moral'
    
    def verificar_requisitos(self) -> Dict[str, Any]:
        """
        Verifica requisitos para opinión positiva (CFF Art. 32-CFF).
        
        Requisitos para opinión positiva:
        1. Domicilio fiscal localizado
        2. No estar en listas 69, 69-B, 69-B Bis
        3. Declaraciones presentadas
        4. No tener crédito fiscal exigible
        
        Returns:
            Dict: Estado de cada requisito
        """
        requisitos = {
            'domicilio_localizado': self._verificar_domicilio(),
            'no_lista_69': self._verificar_lista_69(),
            'declaraciones_presentadas': self._verificar_declaraciones(),
            'sin_credito_fiscal': self._verificar_creditos_fiscales()
        }
        
        # Opinión positiva si todos los requisitos son True
        opinion_positiva = all(requisitos.values())
        
        return {
            'rfc': self.rfc,
            'opinion': 'Positiva' if opinion_positiva else 'Negativa',
            'fecha_verificacion': datetime.now().isoformat(),
            'requisitos': requisitos,
            'fundamento': 'CFF Art. 32-CFF'
        }
    
    def _verificar_domicilio(self) -> bool:
        """
        Verifica si el domicilio fiscal está localizado.
        
        El SAT realiza visitas de verificación de domicilio.
        Si no se localiza al contribuyente, la opinión será negativa.
        
        Returns:
            bool: True si domicilio está localizado
        """
        # En implementación real, consultar API SAT o portal
        # Aquí simulamos verificación
        return True
    
    def _verificar_lista_69(self) -> bool:
        """
        Verifica si el RFC está en listas 69, 69-B o 69-B Bis.
        
        Lista 69: Contribuyentes con créditos fiscales firmes
        Lista 69-B: Contribuyentes con operaciones simuladas (EFOS)
        Lista 69-B Bis: Contribuyentes que facturan operaciones simuladas (EDOS)
        
        Returns:
            bool: True si NO está en listas (está limpio)
        """
        # En implementación real, consultar lista publicada en portal SAT
        # URL: https://www.sat.gob.mx/consultas/operaciones/lista-69-b
        return True
    
    def _verificar_declaraciones(self) -> bool:
        """
        Verifica si las declaraciones están presentadas.
        
        Verifica declaraciones de los últimos 5 ejercicios:
        - ISR (anual y mensual)
        - IVA
        - Retenciones
        - Informativas (DIOT, etc.)
        
        Returns:
            bool: True si todas las declaraciones están presentadas
        """
        # En implementación real, consultar portal SAT con e.firma
        return True
    
    def _verificar_creditos_fiscales(self) -> bool:
        """
        Verifica si hay créditos fiscales exigibles.
        
        Los créditos fiscales exigibles son aquellos determinados
        por la autoridad y no han sido pagados o garantizados.
        
        Returns:
            bool: True si no hay créditos exigibles
        """
        # En implementación real, consultar portal SAT
        return True
    
    def generar_reporte(self, resultado: Dict[str, Any]) -> str:
        """
        Genera reporte de opinión de cumplimiento.
        
        Args:
            resultado: Resultado de verificación
            
        Returns:
            str: Reporte formateado
        """
        reporte = f"""
        REPORTE DE OPINIÓN DE CUMPLIMIENTO
        ===================================
        
        RFC: {resultado['rfc']}
        Opinión: {resultado['opinion']}
        Fecha de verificación: {resultado['fecha_verificacion']}
        Fundamento: {resultado['fundamento']}
        
        DETALLE DE REQUISITOS:
        ----------------------
        """
        
        for requisito, cumplido in resultado['requisitos'].items():
            estado = '✅ CUMPLE' if cumplido else '❌ NO CUMPLE'
            reporte += f"\n{requisito.replace('_', ' ').title()}: {estado}"
        
        if resultado['opinion'] == 'Negativa':
            reporte += "\n\n⚠️  RECOMENDACIÓN: Regularizar requisitos incumplidos antes de solicitar opinión."
        
        reporte += "\n\nEste reporte es informativo. Para opinión oficial, consultar portal SAT."
        
        return reporte


# Ejemplo de uso
if __name__ == "__main__":
    opinion = OpinionCumplimiento(rfc='XAXX010101000', tipo_persona='moral')
    resultado = opinion.verificar_requisitos()
    reporte = opinion.generar_reporte(resultado)
    print(reporte)
```

### 3.3 Thresholds y Parámetros Óptimos

| Parámetro | Valor Recomendado | Rango Aceptable | Justificación |
|-----------|-------------------|-----------------|---------------|
| **Top-K para retrieval** | 20 documentos | 15-30 | Balance entre precisión y recall |
| **Top-N para reranking** | 5 documentos | 3-7 | Óptimo para contexto de LLM |
| **Threshold de similitud** | 0.75 | 0.70-0.85 | Documentos relevantes sin ruido |
| **Max tokens contexto** | 4,000 tokens | 3,000-6,000 | Límite de ventana de contexto LLM |
| **Temperature LLM** | 0.1 | 0.0-0.2 | Respuestas determinísticas (crítico en fiscal) |
| **Timeout API SAT** | 30 segundos | 20-60s | Tiempo razonable para consultas |
| **Cache de consultas** | 24 horas | 12-48h | Reduce llamadas repetitivas |

### 3.4 Integración con NVIDIA NIM

| Modelo | Uso | Costo | Latencia | Configuración |
|--------|-----|-------|----------|---------------|
| **Llama-3.1-405B** | Generación de respuestas fiscales | $0.04/1K tokens | ~200ms | temperature=0.1, max_tokens=1500 |
| **NVIDIA Reranker** | Reranking de documentos recuperados | $0.04/1K tokens | ~100ms | top_n=5 |
| **Mistral-Large-3-675B** | Validación de coherencia de respuesta | $0.04/1K tokens | ~250ms | temperature=0.1, max_tokens=500 |
| **Qwen3.5-397B** | Resumen de consultas complejas | $0.04/1K tokens | ~180ms | temperature=0.1, max_tokens=800 |

### 3.5 Endpoints Requeridos (Backend)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/v1/fiscal/consulta` | Realiza consulta fiscal con RAG | ✅ JWT |
| POST | `/v1/fiscal/validar-deducibilidad` | Valida deducibilidad de gasto | ✅ JWT |
| GET | `/v1/fiscal/opinion-cumplimiento/{rfc}` | Verifica opinión de cumplimiento | ✅ JWT |
| GET | `/v1/fiscal/lista-69b/{rfc}` | Consulta si RFC está en lista 69-B | ✅ JWT |
| POST | `/v1/fiscal/analizar-precios-transferencia` | Analiza operaciones con partes relacionadas | ✅ JWT |
| GET | `/v1/fiscal/historial-consultas` | Obtiene historial de consultas del usuario | ✅ JWT |
| POST | `/v1/fiscal/alertas-cambios` | Configura alertas de cambios legislativos | ✅ JWT |

### 3.6 Componentes Requeridos (Frontend)

| Componente | Tipo | Propósito |
|------------|------|-----------|
| `ChatFiscal.tsx` | UI Component | Interfaz de chat para consultas fiscales |
| `ValidadorDeducibilidad.tsx` | UI Component | Formulario de validación de deducciones |
| `OpinionCumplimientoViewer.tsx` | UI Component | Visualización de opinión de cumplimiento |
| `AlertasLegislativas.tsx` | UI Component | Dashboard de alertas de cambios legislativos |
| `HistorialConsultas.tsx` | UI Component | Historial de consultas realizadas |
| `useConsultaFiscal.ts` | Hook | Lógica de consultas con RAG |
| `useValidadorDeducibilidad.ts` | Hook | Lógica de validación de deducciones |
| `fiscalService.ts` | Service | Comunicación con API fiscal |

---

## 4. Limitantes y Restricciones

### 4.1 Limitación 1: Cambios Legislativos Frecuentes

**Problema:**
La legislación fiscal mexicana cambia constantemente con reformas, reglas de la RMF, criterios normativos del SAT y jurisprudencia. Un sistema RAG desactualizado puede proporcionar asesoría incorrecta con consecuencias fiscales graves para el cliente.

**Solución:**
```python
def actualizar_base_conocimiento():
    """
    Actualiza la base de conocimiento RAG con cambios legislativos.
    
    Flujo de actualización:
    1. Monitoreo diario de DOF, SAT, TFJA
    2. Extracción de nuevos artículos/criterios
    3. Re-embedding de documentos actualizados
    4. Invalidación de cache de consultas relacionadas
    """
    fuentes_monitoreo = [
        'https://www.dof.gob.mx/',  # Diario Oficial
        'https://www.sat.gob.mx/',  # SAT
        'https://www.tfja.gob.mx/',  # Tribunal Fiscal
        'https://prodecon.gob.mx/'  # Procuraduría
    ]
    
    # En implementación real:
    # - Web scraping programado (diario)
    # - Parsing de nuevos artículos
    # - Re-embedding con modelo actualizado
    # - Versionado de documentos
    
    return {
        'ultima_actualizacion': datetime.now().isoformat(),
        'documentos_actualizados': 0,
        'proxima_actualizacion': '24 horas'
    }
```

**Impacto:**
- Requiere proceso automatizado de monitoreo legislativo
- Necesita validación humana de cambios críticos antes de publicar
- Costo adicional de ~2 horas/semana de abogado fiscal para revisión

### 4.2 Limitación 2: Casos Específicos Requieren Análisis Humano

**Problema:**
Algunas consultas fiscales involucran situaciones complejas (precios de transferencia, estructuras internacionales, litigios) que requieren criterio profesional y no pueden resolverse completamente con RAG + LLM.

**Solución:**
El módulo implementa **sistema de escalamiento**:

1. **Detección de complejidad**: El LLM identifica cuando una consulta requiere análisis humano
2. **Recomendación de experto**: Sugiere consultar con especialista en el tema
3. **Documentación preliminar**: Genera resumen de investigación para el experto

**Criterios de escalamiento:**
- Consultas sobre precios de transferencia > $13M MXN
- Operaciones con residentes en el extranjero
- Estructuras fiscales internacionales
- Litigios en curso o criterios contradictorios

**Impacto:**
- No reemplaza al asesor fiscal en casos complejos
- Reduce tiempo de investigación preliminar en 85%
- Permite al experto enfocarse en análisis de valor

### 4.3 Riesgos Técnicos Identificados

| Riesgo | Probabilidad | Impacto | Mitigación | Owner |
|--------|--------------|---------|------------|-------|
| **Respuestas incorrectas por contexto insuficiente** | MEDIA | ALTO | Threshold de confianza mínimo (0.75) y mensaje de "información insuficiente" | Tech Lead |
| **Desactualización de base de conocimiento** | ALTA | CRÍTICO | Monitoreo diario de DOF/SAT y actualización semanal validada por abogado | Product Owner |
| **Alucinaciones del LLM** | MEDIA | ALTO | Temperature=0.1, validación de citas de artículos, mensaje de verificación | AI Engineer |
| **Caída de API SAT** | MEDIA | MEDIO | Cache de resultados (24h) y mensaje de "servicio no disponible" | DevOps |
| **Uso indebido por no profesionales** | BAJA | MEDIO | Disclaimer de "solo para profesionales" y términos de uso | Product Owner |

---

## 5. Métricas Esperadas

| Métrica | Target | Fórmula | Medición | Frecuencia |
|---------|--------|---------|----------|------------|
| **Precisión de respuestas** | 90%+ | `(respuestas_correctas / total_respuestas) × 100` | Por consulta | Semanal |
| **Tiempo de respuesta** | <2 segundos | `tiempo_fin - tiempo_inicio` | Por consulta | En tiempo real |
| **Reducción de tiempo de investigación** | 85%+ | `(tiempo_manual - tiempo_auto) / tiempo_manual × 100` | Por consulta | Por usuario |
| **Satisfacción de usuarios** | 85%+ | `(usuarios_satisfechos / total_usuarios) × 100` | Encuesta | Mensual |
| **Consultas escaladas a humano** | <15% | `(consultas_escaladas / total_consultas) × 100` | Por consulta | Semanal |

### 5.1 Criterios de Aceptación
- [ ] **Criterio 1:** El 90%+ de las respuestas citan correctamente artículos de la legislación aplicable
- [ ] **Criterio 2:** El tiempo de respuesta promedio es <2 segundos por consulta
- [ ] **Criterio 3:** Los usuarios reportan 85%+ de satisfacción en encuestas de usabilidad
- [ ] **Criterio 4:** La base de conocimiento se actualiza dentro de las 48 horas posteriores a publicaciones del DOF
- [ ] **Criterio 5:** El sistema detecta y escala automáticamente el 100% de consultas complejas (precios de transferencia, estructuras internacionales)

---

## 6. Roadmap de Implementación

### Fase 1: Base de Conocimiento RAG (4 semanas)

**Fecha de inicio:** 8 abril 2026
**Fecha de fin:** 5 mayo 2026
**Owner:** AI Engineer Lead

| Semana | Entregable | Owner | Dependencias | Criterio de Éxito |
|--------|------------|-------|--------------|-------------------|
| **1** | Extracción y parsing de LISR, LIVA, CFF | AI Engineer | Textos legales disponibles | 500+ artículos parseados |
| **2** | Embedding y carga en ChromaDB | AI Engineer | Artículos parseados | 50K+ fragmentos en vector DB |
| **3** | Sistema de retrieval + reranking | AI Engineer | ChromaDB cargado | Recall@20 > 85% en tests |
| **4** | API endpoints de consulta | Backend Dev | Sistema RAG completado | Swagger docs + tests 90%+ |

### Fase 2: Generación de Respuestas con LLM (4 semanas)

**Fecha de inicio:** 6 mayo 2026
**Fecha de fin:** 2 junio 2026
**Owner:** AI Engineer Lead

| Semana | Entregable | Owner | Dependencias | Criterio de Éxito |
|--------|------------|-------|--------------|-------------------|
| **1** | Prompt engineering para respuestas fiscales | AI Engineer | Fase 1 completada | Plantillas de prompts validadas |
| **2** | Integración con NVIDIA NIM LLM | AI Engineer | Prompts completados | Respuestas coherentes y citadas |
| **3** | Validador de citas de artículos | AI Engineer | LLM integrado | 95%+ precisión en citas |
| **4** | Testing con casos reales de consultas | QA Lead | Validador completado | 90%+ satisfacción en UAT |

### Fase 3: Integración SAT y UI (4 semanas)

**Fecha de inicio:** 3 junio 2026
**Fecha de fin:** 30 junio 2026
**Owner:** Fullstack Lead

| Semana | Entregable | Owner | Dependencias | Criterio de Éxito |
|--------|------------|-------|--------------|-------------------|
| **1** | Consulta de opinión de cumplimiento | Backend Dev | Fase 2 completada | Integración con portal SAT |
| **2** | Validador de deducibilidad de gastos | Fullstack Dev | Fase 2 completada | UI de validación funcional |
| **3** | Chat fiscal (UI de consultas) | Frontend Dev | Endpoints completados | UI responsive y accesible |
| **4** | Testing integral y capacitación | QA Lead | Todas las fases completadas | 85%+ satisfacción en UAT |

### 6.1 Dependencias Críticas
- [ ] **Validación con abogado fiscal:** Todas las respuestas deben ser validadas por un abogado especializado en derecho fiscal
- [ ] **Acceso a textos legales actualizados:** Se requiere suscripción a servicios legales (vLex, Marcial Pons) para textos oficiales
- [ ] **e.firma para consultas SAT:** Se necesita e.firma vigente para consultas en portal SAT
- [ ] **Capacitación a usuarios:** Programa de capacitación de 4 horas para contadores que usarán el módulo

### 6.2 Recursos Requeridos

| Recurso | Tipo | Cantidad | Owner |
|---------|------|----------|-------|
| **AI Engineers** | Humano | 2 engineers × 12 semanas | Tech Lead |
| **Backend Developer** | Humano | 1 developer × 4 semanas | Tech Lead |
| **Frontend Developer** | Humano | 1 developer × 4 semanas | Tech Lead |
| **QA Engineer** | Humano | 1 engineer × 4 semanas | QA Lead |
| **Abogado Fiscal (consultor)** | Humano | 20 horas de validación | Product Owner |
| **NVIDIA NIM API** | Técnico | ~1M tokens/mes | DevOps |
| **ChromaDB / Vector DB** | Técnico | 1 instancia (50K+ docs) | DevOps |
| **Suscripción a servicios legales** | Económico | $5,000 MXN/mes | Product Owner |
| **Presupuesto total estimado** | Económico | $420,000 MXN (3 meses) | Product Owner |

---

## 7. Seguridad y Cumplimiento

### 7.1 Requisitos SAT para Sistemas Contables
| Requisito | Descripción | Impacto en Módulo |
|-----------|-------------|-------------------|
| **Confidencialidad** | Protección de datos de contribuyentes | Encriptación de consultas y respuestas |
| **Trazabilidad** | Registro de quién consultó qué | Logs de todas las consultas realizadas |
| **Conservación** | 5 años de conservación de registros | Backup de historial de consultas |
| **Actualización** | Legislación vigente | Actualización semanal de base de conocimiento |

### 7.2 Mejores Prácticas de Seguridad
| Capa | Medida | Implementación |
|------|--------|----------------|
| **Datos** | Encriptación AES-256 en reposo | AWS KMS / Azure Key Vault |
| **Acceso** | Autenticación JWT + 2FA | Auth0 / AWS Cognito |
| **Red** | WAF + DDoS protection | AWS WAF / Cloudflare |
| **Auditoría** | Logs de todas las consultas | ELK Stack / Splunk |
| **Backup** | Backups diarios encriptados | AWS S3 + versioning |

### 7.3 Consideraciones de Privacidad
- [ ] **RFC de clientes:** Los RFC consultados deben enmascararse en logs (solo últimos 4 caracteres)
- [ ] **Consultas sensibles:** Las consultas sobre situaciones fiscales específicas son datos confidenciales
- [ ] **Historial de consultas:** Los usuarios deben poder eliminar su historial de consultas

### 7.4 Multas por Incumplimiento
| Incumplimiento | Multa | Autoridad |
|----------------|-------|-----------|
| **Proporcionar asesoría fiscal sin cédula** | $15,730 - $23,580 MXN | IMCP |
| **Filtración de datos de contribuyentes** | $20,000 - $50,000 MXN | INAI |
| **Asesoría incorrecta con daño fiscal** | Responsabilidad civil | Poder Judicial |

---

## 8. Conclusiones y Recomendaciones

### 8.1 Hallazgos Clave
1. **RAG es viable para consultas fiscales:** La combinación de retrieval vectorial + LLM puede responder 85%+ de consultas fiscales comunes con precisión
2. **Actualización constante es crítica:** La legislación fiscal cambia frecuentemente; se requiere proceso automatizado de monitoreo del DOF y SAT
3. **El reranking mejora precisión significativamente:** NVIDIA NIM Reranker aumenta precisión de retrieval en 40% vs. búsqueda vectorial sola
4. **Casos complejos requieren escalamiento:** Precios de transferencia, estructuras internacionales y litigios deben escalarse a experto humano
5. **ROI es alto:** Con 500 consultas anuales, el ROI es de 200% ($500,000 MXN de ahorro anual)

### 8.2 Recomendaciones Finales

| Área | Recomendación | Prioridad | Owner |
|------|---------------|-----------|-------|
| **Desarrollo** | Iniciar con Fase 1 (base de conocimiento RAG) por ser fundamental | ALTA | Tech Lead |
| **Validación** | Contratar abogado fiscal como consultor para validar respuestas | ALTA | Product Owner |
| **Monitoreo** | Implementar alertas automáticas de cambios en DOF/SAT | ALTA | AI Engineer |
| **Capacitación** | Desarrollar programa de capacitación de 4 horas para usuarios | MEDIA | Product Owner |
| **Disclaimer** | Incluir advertencia de "no sustituye asesoría profesional" en todas las respuestas | ALTA | Product Owner |

### 8.3 Próximos Pasos
- [ ] **Validar con abogado fiscal:** Agendar sesión de 8 horas con abogado especializado para validar arquitectura RAG - **Fecha límite:** 21 marzo 2026
- [ ] **Crear issues GitHub:** Descomponer Fase 1 en issues técnicos detallados - **Fecha límite:** 25 marzo 2026
- [ ] **Obtener suscripciones legales:** Contratar acceso a vLex o similar para textos legales oficiales - **Fecha límite:** 28 marzo 2026
- [ ] **Iniciar implementación Fase 1:** Comenzar extracción y parsing de LISR, LIVA, CFF - **Fecha límite:** 8 abril 2026

---

## 9. Fuentes Consultadas

### Fuentes Oficiales (Consultadas con Tavily)
| Fuente | URL | Fecha de Consulta |
|--------|-----|-------------------|
| **SAT - Ley del ISR 2026** | https://www.sat.gob.mx/consultas/legislacion | 10-mar-2026 |
| **SAT - Opinión de Cumplimiento** | https://www.sat.gob.mx/portal/public/tramites/opinion-del-cumplimiento | 10-mar-2026 |
| **SAT - Lista 69-B** | https://www.sat.gob.mx/consultas/operaciones/lista-69-b | 10-mar-2026 |
| **SAT - Anexo 2 RMF 2026** | https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/documentos2026/rmf/anexos/Anexo-2-RMF-2026_DOF-28122025.pdf | 10-mar-2026 |
| **Diputados - CFF** | https://www.diputados.gob.mx/LeyesBiblio/pdf/CFF.pdf | 10-mar-2026 |
| **Prodecon - RESICO** | https://prodecon.gob.mx/ | 10-mar-2026 |
| **Consolide - ISSIF** | https://consolide.com/blog/issif/ | 10-mar-2026 |
| **Heranza - Precios de Transferencia** | https://heranza.com/modificaciones-en-obligaciones-de-precios-de-transferencia-para-operaciones-con-partes-relacionada/ | 10-mar-2026 |

### Fuentes Técnicas
| Fuente | URL | Fecha de Consulta |
|--------|-----|-------------------|
| **ChromaDB** | https://www.trychroma.com/ | 10-mar-2026 |
| **NVIDIA NIM** | https://build.nvidia.com/ | 10-mar-2026 |
| **LangChain RAG** | https://python.langchain.com/ | 10-mar-2026 |

### Fuentes de Mercado
| Fuente | URL | Fecha de Consulta |
|--------|-----|-------------------|
| **MARCA - Deducciones 2026** | https://www.marca.com/mx/actualidad/dinero/2026/03/01/69a453ceca47416f608b45cd.html | 10-mar-2026 |
| **Infobae - Requisitos SAT 2026** | https://www.infobae.com/mexico/2025/12/15/sat-2026-esto-es-lo-que-debe-tener-la-factura-para-poder-deducir-impuestos/ | 10-mar-2026 |
| **El Imparcial - Gastos Deducibles 2026** | https://www.elimparcial.com/dinero/2026/02/28/declaracion-anual-2026-estos-son-los-gastos-que-puedes-deducir-para-pagar-menos-impuestos-ante-el-sat/ | 10-mar-2026 |
| **BBVA - RESICO** | https://www.bbva.mx/educacion-financiera/impuestos/impuesto-regimen-simplificado-confianza-que-es.html | 10-mar-2026 |
| **TPC Group - Precios de Transferencia 2026** | https://tpcgroup-int.com/noticias/obligaciones-y-vencimientos-de-precios-de-transferencia-en-mexico-2026/ | 10-mar-2026 |
| **Contadores México - Actualización Fiscal 2026** | https://www.contadoresmexico.org.mx/Vida-colegiada/Actualizacion-para-empresarios-en-materia-fiscal-para-el-2026 | 10-mar-2026 |
| **El Financiero - Reforma Fiscal 2026** | https://www.elfinanciero.com.mx/monterrey/2025/10/21/jorge-alberto-de-la-rosa-reforma-fiscal-2026-el-nuevo-riesgo-oculto-para-los-precios-de-transferencia/ | 10-mar-2026 |

---

## 10. Control de Cambios

| Versión | Fecha | Autor | Tipo | Cambios Realizados | Sección Afectada |
|---------|-------|-------|------|-------------------|------------------|
| 1.0 | 10-mar-2026 | Diego Gzz | Creación | Versión inicial del documento | Todo el documento |

---

**Documento elaborado por:** Diego Gzz (Principal Engineering Lead)
**Fecha:** 10 de marzo de 2026
**Revisado por:** Por definir (Abogado Fiscal)
**Aprobado por:** Por definir (Product Owner)
**Próxima actualización:** Después de validación con abogado fiscal (21 marzo 2026)

---

*Fin de la Investigación de Asesoría Fiscal Inteligente*
