import * as Sentry from "@sentry/react";
import React from "react";
import {
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes,
} from "react-router-dom";

const isProd = import.meta.env.MODE === 'production';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || 'development',
  release: import.meta.env.VITE_APP_VERSION || 'dev',
  sendDefaultPii: true,

  integrations: [
    // React Router v6 integration para tracking de navegación
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect: React.useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Tracing - 100% en dev, 10% en prod
  tracesSampleRate: isProd ? 0.1 : 1.0,
  tracePropagationTargets: [
    "localhost",
    /^https:\/\/api\./,
  ],

  // Session Replay
  replaysSessionSampleRate: isProd ? 0.1 : 1.0,
  replaysOnErrorSampleRate: 1.0,

  // Logging
  enableLogs: true,

  // Debug en desarrollo
  debug: !isProd,
});
