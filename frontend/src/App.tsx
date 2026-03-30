import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import LoadingSpinner from '@components/LoadingSpinner'
import { AuthProvider } from '@/contexts/auth-context'
import { Toaster } from '@/components/ui/toaster'

// Eager loading - Componentes críticos para FCP/LCP
import Layout from '@components/Layout'
import EmptyPane from '@components/EmptyPane'

// Lazy loading - Rutas no críticas (se cargan bajo demanda)
const Workspace = lazy(() => import('@components/Workspace'))
const Chat = lazy(() => import('@components/Chat'))
const Documents = lazy(() => import('@components/Documents'))
const Fiscal = lazy(() => import('@components/Fiscal'))
const Expenses = lazy(() => import('@components/Expenses'))
const Settings = lazy(() => import('@components/Settings'))
const Clients = lazy(() => import('@components/Clients'))
const Payroll = lazy(() => import('@components/Payroll'))
const Finance = lazy(() => import('@components/Finance'))
const Reconciliation = lazy(() => import('@components/finance/reconciliation-view'))
const LoginPage = lazy(() => import('./app/login/page'))

// Loading fallback optimizado para navegación
const RouteFallback = () => (
  <div className="h-full w-full flex items-center justify-center bg-background">
    <LoadingSpinner className="h-full" size="lg" />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Login - Full page, outside Layout */}
          <Route
            path="/login"
            element={
              <Suspense fallback={<RouteFallback />}>
                <LoginPage />
              </Suspense>
            }
          />

          <Route path="/" element={<Layout />}>
            {/* Ruta inicial - Eager loading (crítico para LCP) */}
            <Route index element={<EmptyPane />} />

            {/* Dashboard - Suspense wrapper para lazy load */}
            <Route
              path="dashboard"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <Workspace />
                </Suspense>
              }
            />

            {/* Rutas secundarias - Todas con lazy loading */}
            <Route
              path="chat"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <Chat />
                </Suspense>
              }
            />
            <Route
              path="documents"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <Documents />
                </Suspense>
              }
            />
            <Route
              path="fiscal"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <Fiscal />
                </Suspense>
              }
            />
            <Route
              path="expenses"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <Expenses />
                </Suspense>
              }
            />
            <Route
              path="settings"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <Settings />
                </Suspense>
              }
            />
            <Route
              path="clients"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <Clients />
                </Suspense>
              }
            />
            <Route
              path="payroll"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <Payroll />
                </Suspense>
              }
            />
            <Route
              path="finance"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <Finance />
                </Suspense>
              }
            />
            <Route
              path="reconciliation"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <Reconciliation />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
