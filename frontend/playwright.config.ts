import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright E2E Test Configuration
 *
 * IDP Asistente Contable - Tests End-to-End
 *
 * Comandos útiles:
 * - npm run test:e2e           # Ejecutar todos los tests
 * - npm run test:e2e -- --ui   # Ejecutar con UI
 * - npm run test:e2e:report    # Ver reporte HTML
 * - npm run test:e2e:headed    # Ejecutar con navegador visible
 * - npm run test:e2e:debug     # Ejecutar en modo debug
 */
export default defineConfig({
  // Directorio de tests
  testDir: './tests/e2e',

  // Timeout por defecto para tests (30 segundos)
  timeout: 30 * 1000,

  // Timeout para expect()
  expect: {
    timeout: 5000,
  },

  // Ejecutar tests en paralelo
  fullyParallel: true,

  // Prevenir tests solo en CI
  forbidOnly: !!process.env.CI,

  // Reintentos en CI (2) y local (0)
  retries: process.env.CI ? 2 : 0,

  // Workers: 1 en CI, auto en local
  workers: process.env.CI ? 1 : undefined,

  // Reporters
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list', { printSteps: true }],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['junit', { outputFile: 'playwright-report/junit-results.xml' }],
  ],

  // Configuración global
  use: {
    // URL base del frontend (dev: 5173, prod: 3000)
    baseURL: process.env.BASE_URL || 'http://localhost:5173',

    // Capturar trace en retries
    trace: 'on-first-retry',

    // Capturar screenshot solo en fallos
    screenshot: 'only-on-failure',

    // Capturar video en fallos
    video: 'retain-on-failure',

    // Viewport por defecto
    viewport: { width: 1920, height: 1080 },

    // Action timeout
    actionTimeout: 10000,

    // Navegación timeout
    navigationTimeout: 30000,

    // User agent
    userAgent: 'IDP-Asistente-Contable-E2E-Test/1.0',

    // Locale y timezone
    locale: 'es-MX',
    timezoneId: 'America/Mexico_City',

    // Permissions
    permissions: ['clipboard-read', 'clipboard-write'],

    // Color scheme
    colorScheme: 'dark',

    // Ignorar HTTPS errors en desarrollo
    ignoreHTTPSErrors: true,

    // Headless mode
    headless: process.env.HEADED ? false : true,
  },

  // Proyectos de navegadores
  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Forzar modo dark
        colorScheme: 'dark',
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        colorScheme: 'dark',
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        colorScheme: 'dark',
      },
    },

    // Navegadores móviles para testing responsive
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
      },
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 13'],
      },
    },

    // Tablets
    {
      name: 'iPad',
      use: {
        ...devices['iPad Pro'],
      },
    },
  ],

  // Servidor web para tests con servidor local
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    stdout: 'pipe',
    stderr: 'pipe',
  },

  // Output directories
  outputDir: 'playwright-results',
  snapshotPathTemplate: '{testDir}/__snapshots__/{testFilePath}/{arg}{ext}',

  // Global setup/teardown
  globalSetup: './tests/e2e/global-setup',
})
