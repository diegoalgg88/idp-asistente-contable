// Importación DEBE ir primero - Inicialización de Sentry
import "./instrument";

import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from '@/components/ui/tooltip'
import * as Sentry from "@sentry/react";
import App from './App'
import './index.css'

// Loading component para fallback inicial
const LoadingFallback = () => (
  <div className="loading-splash">
    <div className="loading-splash__content">
      <div className="loading-splash__logo">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h1 className="loading-splash__title">IDP<span className="text-primary">.</span>Workbench</h1>
      <p className="loading-splash__subtitle">Intelligent Data Processing Hub</p>
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// Renderizado inmediato con fallback crítico
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Sentry.ErrorBoundary
      fallback={({ error, componentStack, resetError }) => (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <h3 className="text-xl font-bold text-red-800 mb-2">
              Ha ocurrido un error
            </h3>
            <pre className="text-sm text-red-600 whitespace-pre-wrap mb-4 bg-red-50 p-4 rounded">
              {error instanceof Error ? error.message : String(error)}
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
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <App />
        </TooltipProvider>
      </QueryClientProvider>
    </Sentry.ErrorBoundary>
  </StrictMode>
);

// Web Vitals - Carga diferida para no bloquear main thread
const registerWebVitals = async () => {
  try {
    const { onCLS, onFCP, onLCP, onTTFB, onINP } = await import('web-vitals');
    const sendWebVitalsToSentry = (metric: { id: string; name: string; value: number; rating: string; delta: number; navigationType: string }) => {
      Sentry.addBreadcrumb({
        category: 'web-vitals',
        data: metric,
        level: 'info',
      });

      Sentry.startSpan({
        name: `web-vitals-${metric.name}`,
        op: 'web-vitals',
      }, () => {
        Sentry.setMeasurement('value', metric.value, 'millisecond');
        Sentry.setMeasurement('rating', metric.rating === 'good' ? 1 : metric.rating === 'needs-improvement' ? 2 : 3, 'none');
      });
    };

    onCLS(sendWebVitalsToSentry);
    onFCP(sendWebVitalsToSentry);
    onLCP(sendWebVitalsToSentry);
    onTTFB(sendWebVitalsToSentry);
    onINP(sendWebVitalsToSentry);
  } catch (error) {
    console.error('Failed to load web-vitals', error);
  }
};

// Registrar Web Vitals después de que el contenido crítico haya cargado
if ('requestIdleCallback' in window) {
  window.requestIdleCallback(() => registerWebVitals(), { timeout: 5000 });
} else {
  setTimeout(registerWebVitals, 3000);
}

// Service Worker para PWA - Carga diferida
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      // console.log('[SW] Service Worker registrado con éxito:', registration.scope)
    } catch (error) {
      // console.log('[SW] Error al registrar Service Worker:', error)
    }
  });
}
