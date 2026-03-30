# Sentry React Implementation Guide

## Descripción

Esta guía documenta la implementación correcta de Sentry en el proyecto IDP Asistente Contable siguiendo las mejores prácticas oficiales del [Sentry React SDK](https://docs.sentry.io/platforms/javascript/guides/react/).

## Versión de React

**React 18.2.0** - Se utiliza `Sentry.ErrorBoundary` para el manejo de errores.

> **Nota:** Para React 19+, se recomienda usar los handlers `onUncaughtError`, `onCaughtError`, y `onRecoverableError` directamente en `createRoot()`.

## Estructura de Archivos

```
frontend/
├── src/
│   ├── instrument.ts          # Inicialización de Sentry (DEBE importarse primero)
│   ├── main.tsx               # Entry point con ErrorBoundary
│   ├── components/
│   │   └── SentryTest.tsx     # Componente de prueba (solo desarrollo)
│   └── lib/
│       └── sentry.ts          # [ELIMINADO] Implementación obsoleta
├── vite.config.ts             # Configuración con Sentry Vite Plugin
└── .env.example               # Variables de entorno de ejemplo
```

## Configuración Paso a Paso

### 1. Instalación

```bash
cd frontend
npm install @sentry/react @sentry/vite-plugin --save-dev
```

### 2. Inicialización (`src/instrument.ts`)

El archivo `instrument.ts` contiene la configuración oficial de Sentry:

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE || 'development',
  release: import.meta.env.VITE_APP_VERSION || 'dev',
  sendDefaultPii: true,
  
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  
  // Tracing - 100% en dev, 10% en prod
  tracesSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,
  tracePropagationTargets: [
    "localhost",
    /^https:\/\/api\./,
  ],
  
  // Session Replay
  replaysSessionSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,
  replaysOnErrorSampleRate: 1.0,
  
  // Logging
  enableLogs: true,
  
  // Debug en desarrollo
  debug: import.meta.env.MODE !== 'production',
});
```

### 3. Entry Point (`src/main.tsx`)

**IMPORTANTE:** `instrument.ts` debe ser la **primera importación**:

```typescript
// Importación DEBE ir primero
import "./instrument";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import App from './App';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={...}>
      <App />
    </Sentry.ErrorBoundary>
  </StrictMode>
);
```

### 4. Error Boundary para React 18

```typescript
<Sentry.ErrorBoundary
  fallback={({ error, componentStack, resetError }) => (
    <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
        <h3 className="text-xl font-bold text-red-800 mb-2">
          Ha ocurrido un error
        </h3>
        <pre className="text-sm text-red-600 whitespace-pre-wrap mb-4 bg-red-50 p-4 rounded">
          {error.toString()}
        </pre>
        <details className="text-xs text-gray-600">
          <summary className="cursor-pointer hover:text-gray-800">
            Ver stack trace
          </summary>
          <pre className="mt-2 whitespace-pre-wrap">{componentStack}</pre>
        </details>
        <button
          onClick={() => resetError()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  )}
  showDialog
>
  <App />
</Sentry.ErrorBoundary>
```

### 5. Error Boundary para React 19+

Si actualizas a React 19 o superior, usa este patrón:

```typescript
import { reactErrorHandler } from "@sentry/react";

createRoot(document.getElementById("root")!, {
  onUncaughtError: reactErrorHandler(),
  onCaughtError: reactErrorHandler(),
  onRecoverableError: reactErrorHandler(),
}).render(<App />);
```

### 6. Source Maps con Vite

Configuración en `vite.config.ts`:

```typescript
import { sentryVitePlugin } from "@sentry/vite-plugin";

export default defineConfig({
  build: {
    sourcemap: "hidden", // Source maps generados pero no referenciados en HTML
  },
  plugins: [
    react(),
    sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
});
```

### 7. Variables de Entorno

`.env.example`:

```bash
# Sentry DSN - Obtener de Sentry.io
VITE_SENTRY_DSN=https://your-dsn@sentry.io/your-project-id

# Environment
VITE_SENTRY_ENVIRONMENT=development

# App version
VITE_APP_VERSION=1.0.0

# Source Maps Upload (NO COMMITTEAR VALORES REALES)
# SENTRY_ORG=your-org-slug
# SENTRY_PROJECT=your-project-slug
# SENTRY_AUTH_TOKEN=sntrys_...
```

## Configuración en Sentry.io

### 1. Crear Proyecto

1. Ve a [sentry.io](https://sentry.io)
2. Create Project → **React**
3. Copia el DSN generado

### 2. Configurar Source Maps

Para subir source maps manualmente:

```bash
# Build del proyecto
npm run build

# Subir source maps
npx sentry-cli sourcemaps upload ./dist
```

### 3. Configurar Releases

```bash
# Crear release
npx sentry-cli releases new 1.0.0

# Subir source maps del release
npx sentry-cli releases files 1.0.0 upload-sourcemaps ./dist

# Finalizar release
npx sentry-cli releases finalize 1.0.0
```

## Testing

### Componente de Prueba

El componente `SentryTest.tsx` permite verificar la configuración:

```typescript
import { SentryTest } from "@/components/SentryTest";

// Usar solo en desarrollo
{import.meta.env.DEV && <SentryTest />}
```

### Pruebas Manuales

1. **Test Error (Throw):** Lanza un error no controlado
2. **Test Message:** Envía un mensaje informativo
3. **Test Exception:** Captura una excepción manualmente

### Verificación

1. Abre la aplicación en desarrollo
2. Haz clic en los botones de prueba
3. Verifica en Sentry.io → Issues que los errores aparezcan

## Troubleshooting

### Error: "Sentry is not defined"

**Causa:** `instrument.ts` no se importa primero en `main.tsx`.

**Solución:**
```typescript
// ✅ CORRECTO - Primera importación
import "./instrument";
import React from "react";
```

### Error: "DSN not configured"

**Causa:** Variable `VITE_SENTRY_DSN` no está definida.

**Solución:**
1. Copia `.env.example` a `.env`
2. Reemplaza el DSN con tu valor real de Sentry.io

### Source Maps no se suben

**Causa:** Variables de entorno faltantes.

**Solución:**
```bash
# Verificar variables
echo $SENTRY_ORG
echo $SENTRY_PROJECT
echo $SENTRY_AUTH_TOKEN

# Configurar en .env.local o exportar
export SENTRY_ORG=your-org
export SENTRY_PROJECT=your-project
export SENTRY_AUTH_TOKEN=sntrys_...
```

### Errores no aparecen en Sentry

**Causas posibles:**

1. **Modo desarrollo:** Los errores se loguean pero no se envían (comportamiento intencional)
2. **Ad blockers:** Algunos bloquean Sentry
3. **Sample rate:** En producción solo 10% se envía

**Solución:**
```typescript
// Forzar envío en desarrollo (SOLO PARA TESTING)
Sentry.init({
  beforeSend: (event) => event, // Enviar todos los errores
});
```

## Mejores Prácticas

### 1. No commitear credenciales

```bash
# .env.example - Valores de ejemplo
VITE_SENTRY_DSN=https://your-dsn@sentry.io/your-project-id

# .env.local - Valores reales (gitignore)
VITE_SENTRY_DSN=https://real-dsn@sentry.io/real-project-id
```

### 2. Sample Rates por ambiente

```typescript
tracesSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,
replaysSessionSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,
```

### 3. PII Handling

```typescript
// Habilitar solo si es necesario
sendDefaultPii: true,

// O usar beforeSend para filtrar
beforeSend: (event) => {
  // Remover información sensible
  delete event.request?.cookies;
  return event;
}
```

### 4. Contexto Adicional

```typescript
// Agregar contexto de usuario
Sentry.setUser({
  id: userId,
  email: userEmail,
});

// Agregar tags
Sentry.setTag('feature', 'chat');

// Agregar contexto custom
Sentry.setContext('workspace', {
  id: workspaceId,
  name: workspaceName,
});
```

## Referencias

- [Sentry React SDK Documentation](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Sentry Vite Plugin](https://docs.sentry.io/platforms/javascript/sourcemaps/uploading/vite/)
- [Error Boundary en React 18](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Error Handling en React 19](https://react.dev/reference/react-dom/client/createRoot#onuncaughterror)

## Historial de Cambios

| Fecha | Versión | Cambio |
|-------|---------|--------|
| 2026-03-10 | 1.0.0 | Implementación inicial siguiendo documentación oficial |
| | | - Eliminada implementación obsoleta `lib/sentry.ts` | |
| | | - Eliminada implementación obsoleta `ErrorBoundary.tsx` | |
| | | - Creado `instrument.ts` como primera importación | |
| | | - Configurado `Sentry.ErrorBoundary` para React 18 | |
| | | - Integrado source maps con Vite | |
