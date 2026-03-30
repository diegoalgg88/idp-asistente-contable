# Sentry - Guía de Configuración de Alertas

## Configuración Recomendada para el Proyecto

### 1. Alertas de Errores Críticos

**Crear en Sentry:** Issues → Create Alert

#### Alerta: Errores de Producción
```yaml
Nombre: "🚨 Errores Críticos - Producción"
Condición: 
  - Issue priority: High o Critical
  - Environment: production
Acción:
  - Email al equipo de desarrollo
  - Notificación en Slack (si está integrado)
Umbral:
  - Cuando ocurra 1 error nuevo
Ventana de tiempo: 5 minutos
```

#### Alerta: Tasa de Errores Elevada
```yaml
Nombre: "⚠️ Tasa de Errores Elevada"
Condición:
  - Event count > 10
  - Environment: production
Acción:
  - Email al equipo
Umbral:
  - 10+ errores en 10 minutos
```

### 2. Alertas de Performance

**Crear en Sentry:** Performance → Create Alert

#### Alerta: LCP Lento
```yaml
Nombre: "🐌 LCP Lento (>4s)"
Condición:
  - Transaction duration > 4000ms
  - Measurement: lcp > 4000
Acción:
  - Email al equipo frontend
Umbral:
  - 5+ transacciones lentas en 30 minutos
```

#### Alerta: Tasa de Error de API
```yaml
Nombre: "🔌 Error Rate de API > 5%"
Condición:
  - HTTP status code: 5xx
  - Event type: error
Acción:
  - Email al equipo backend
Umbral:
  - >5% de requests con error en 10 minutos
```

### 3. Alertas de Session Replay

**Crear en Sentry:** Replays → Create Alert

#### Alerta: Rage Clicks
```yaml
Nombre: "😤 Rage Clicks Detectados"
Condición:
  - Replay: rage_click > 3
Acción:
  - Email a UX/UI team
Umbral:
  - Cuando ocurra en sesión de producción
```

#### Alerta: Errores con Replay
```yaml
Nombre: "🎬 Error Grabado en Replay"
Condición:
  - Issue type: error
  - Has replay: true
Acción:
  - Email al equipo de desarrollo
Umbral:
  - Cuando ocurra 1 error con replay
```

---

## Cómo Configurar Alertas

### Paso a Paso

1. **Inicia sesión en Sentry**
   - Ve a: https://sentry.io
   - Organización: `dg-development`
   - Proyecto: `idp-asistente-contable-frontend`

2. **Crear Alerta de Issues**
   ```
   Issues → Click en "Create Alert" button
   → Selecciona condición (ej: "Issue priority")
   → Configura acción (email, Slack, etc.)
   → Guarda la alerta
   ```

3. **Crear Alerta de Performance**
   ```
   Performance → Click en "Create Alert" button
   → Selecciona métrica (duration, lcp, fcp, etc.)
   → Configura umbral
   → Agrega acción de notificación
   → Guarda la alerta
   ```

4. **Crear Alerta de Replays**
   ```
   Replays → Click en "Create Alert" button
   → Selecciona condición de replay
   → Configura notificación
   → Guarda
   ```

---

## Integración con Slack (Opcional)

### Configurar Slack Integration

1. **En Sentry:**
   ```
   Settings → Integrations → Slack
   → Click "Install"
   → Autoriza la app de Sentry en Slack
   ```

2. **Selecciona el canal:**
   ```
   Canal recomendado: #alerts-frontend o #dev-alerts
   ```

3. **Configura notificaciones por alerta:**
   ```
   En cada alerta → Actions → Add action
   → Send a notification via Slack
   → Selecciona el canal
   ```

---

## Ajuste de Sampling para Producción

### Configuración Actual (`src/instrument.ts`)

```typescript
// Tracing - 100% en dev, 10% en prod
tracesSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,

// Session Replay
replaysSessionSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,
replaysOnErrorSampleRate: 1.0,
```

### Recomendaciones por Tráfico

| Tráfico Mensual | tracesSampleRate | replaysSessionSampleRate | Costo Estimado |
|-----------------|------------------|--------------------------|----------------|
| < 10k sesiones | 0.5 (50%) | 0.3 (30%) | $26/mes |
| 10k-50k sesiones | 0.2 (20%) | 0.1 (10%) | $26/mes |
| 50k-100k sesiones | 0.1 (10%) | 0.05 (5%) | $26/mes |
| > 100k sesiones | 0.05 (5%) | 0.02 (2%) | $26/mes + overage |

**Nota:** Sentry Team plan incluye 10k errores/mes + 50k transacciones/mes

### Ajustar Sampling Dinámico

Para muestreo inteligente basado en tipo de transacción:

```typescript
tracesSampler: (samplingContext) => {
  // Rate base
  let rate = 0.1; // 10% default
  
  // Muestreo completo para rutas críticas
  if (samplingContext.location?.pathname?.includes('/dashboard')) {
    rate = 0.5;
  }
  
  // Muestreo reducido para rutas estáticas
  if (samplingContext.location?.pathname?.includes('/settings')) {
    rate = 0.05;
  }
  
  // Muestreo completo para errores
  if (samplingContext.attributes?.['sentry.sampled'] === false) {
    return 0;
  }
  
  return rate;
},
```

---

## Monitoreo del Backend

### ¿Configurar Sentry en el backend?

Si quieres monitorear el backend (actualmente en `http://localhost:8000`), sigue estos pasos:

#### Opción A: Backend en Python (FastAPI/Flask/Django)

```bash
# Instalar SDK
pip install sentry-sdk[fastapi]  # o [flask] o [django]
```

```python
# main.py o app.py
import sentry_sdk

sentry_sdk.init(
    dsn="https://1dfa0654de01be53784b27bf36ec7b51@o4510725289476096.ingest.us.sentry.io/4511020049891328",
    traces_sample_rate=0.1,
    send_default_pii=True,
    environment="production",
)
```

#### Opción B: Backend en Node.js (Express/NestJS)

```bash
# Instalar SDK
npm install @sentry/node
```

```javascript
// app.js o main.ts
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "https://1dfa0654de01be53784b27bf36ec7b51@o4510725289476096.ingest.us.sentry.io/4511020049891328",
  tracesSampleRate: 0.1,
  sendDefaultPii: true,
  environment: "production",
});
```

#### Beneficios de Monitorear el Backend

- ✅ Trazas distribuidas (frontend → backend)
- ✅ Errores de API vinculados a errores de frontend
- ✅ Performance de endpoints
- ✅ Queries de base de datos lentas
- ✅ Integración con IA Agents (si usas LangChain, OpenAI, etc.)

---

## Verificación de Alertas

### Test de Alertas

1. **Trigger una alerta de prueba:**
   ```javascript
   // En la consola del navegador (dev tools)
   import("@sentry/react").then(Sentry => {
     Sentry.captureMessage("ALERTA DE PRUEBA - Ignorar", "warning");
   });
   ```

2. **Verifica notificaciones:**
   - Email recibido (1-2 minutos)
   - Mensaje en Slack (inmediato)

3. **Limpia el evento de prueba:**
   - Ve a Issues
   - Busca "ALERTA DE PRUEBA"
   - Click en "Resolve" o "Ignore"

---

## Recursos Adicionales

- [Documentación oficial de Alertas](https://docs.sentry.io/product/alerts/)
- [Tipos de Alertas](https://docs.sentry.io/product/alerts/alert-types/)
- [Alert Rules API](https://docs.sentry.io/api/alerts/)
- [Webhooks para Alertas](https://docs.sentry.io/product/integrations/notification/)

---

**Última actualización:** 2026-03-10
**Proyecto:** IDP Asistente Contable - Frontend
