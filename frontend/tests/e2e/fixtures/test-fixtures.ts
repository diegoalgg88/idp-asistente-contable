/**
 * Fixtures Compartidas para Tests E2E
 *
 * Fixtures globales y helpers para tests del IDP Asistente Contable.
 * Incluye fixtures para autenticación, page objects y utilidades.
 *
 * @module tests/e2e/fixtures/test-fixtures
 */

import { test as base, expect } from '@playwright/test'
import { LoginPage } from '../page-objects/LoginPage'
import { DashboardPage } from '../page-objects/DashboardPage'
import { ChatPage } from '../page-objects/ChatPage'
import { DocumentsPage } from '../page-objects/DocumentsPage'
import { ApiHelper } from '../utils/api-helper'
import { TEST_CREDENTIALS, generateRandomEmail, generateRandomPassword } from '../utils/test-data'

// Credenciales de test (exportadas para compatibilidad)
export { TEST_CREDENTIALS }

/**
 * Interfaz para usuario de test
 */
export interface TestUser {
  email: string
  password: string
  fullName: string
  role?: string
}

/**
 * Tipos de fixtures extendidos
 */
type Fixtures = {
  // Page objects
  loginPage: LoginPage
  dashboardPage: DashboardPage
  chatPage: ChatPage
  documentsPage: DocumentsPage

  // Fixture para tests que requieren autenticación
  authenticatedPage: {
    loginPage: LoginPage
    dashboardPage: DashboardPage
    chatPage: ChatPage
    documentsPage: DocumentsPage
  }

  // API helper para setup de datos
  apiHelper: ApiHelper

  // Helpers
  createTestUser: () => Promise<TestUser>
  cleanupTestUsers: () => Promise<void>
}

/**
 * Test fixture extendido con page objects y helpers
 *
 * Uso:
 * ```typescript
 * import { test, expect } from '../fixtures/test-fixtures'
 *
 * test('mi test', async ({ loginPage, dashboardPage }) => {
 *   // ...
 * })
 * ```
 */
export const test = base.extend<Fixtures>({
  // LoginPage fixture
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page)
    await use(loginPage)
  },

  // DashboardPage fixture
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page)
    await use(dashboardPage)
  },

  // ChatPage fixture
  chatPage: async ({ page }, use) => {
    const chatPage = new ChatPage(page)
    await use(chatPage)
  },

  // DocumentsPage fixture
  documentsPage: async ({ page }, use) => {
    const documentsPage = new DocumentsPage(page)
    await use(documentsPage)
  },

  // API helper fixture
  apiHelper: async ({ request }, use) => {
    const apiHelper = new ApiHelper(request)
    await use(apiHelper)
  },

  // Authenticated page fixture - login automático
  authenticatedPage: async ({ page, loginPage, dashboardPage, chatPage, documentsPage }, use) => {
    // Ir a login y autenticar
    await loginPage.goto()
    await loginPage.login(TEST_CREDENTIALS.admin.email, TEST_CREDENTIALS.admin.password)

    // Esperar redirect a dashboard
    await expect(page).toHaveURL(/\/dashboard|\/$/, { timeout: 10000 })

    // Verificar que el login fue exitoso
    await expect(dashboardPage.heading).toBeVisible({ timeout: 5000 })

    await use({
      loginPage,
      dashboardPage,
      chatPage,
      documentsPage,
    })
  },

  // Helper para crear usuario de test
  createTestUser: async ({ apiHelper }, use) => {
    const createTestUser = async (): Promise<TestUser> => {
      const user = await apiHelper.setupTestUser()
      return {
        email: user.email,
        password: user.password,
        fullName: user.full_name,
        role: user.role,
      }
    }
    await use(createTestUser)
  },

  // Helper para limpiar usuarios de test
  cleanupTestUsers: async ({ apiHelper }, use) => {
    const cleanupTestUsers = async () => {
      await apiHelper.cleanupTestData()
    }
    await use(cleanupTestUsers)
  },
})

// Re-exportar expect
export { expect }

/**
 * Generar email aleatorio para tests
 *
 * @returns Email único
 */
export function generateRandomEmailFixture(): string {
  const randomId = Math.random().toString(36).substring(2, 10)
  const timestamp = Date.now().toString(36)
  return `test_${timestamp}_${randomId}@example.com`
}

/**
 * Generar password aleatorio para tests
 *
 * @returns Password seguro
 */
export function generateRandomPasswordFixture(): string {
  const random = Math.random().toString(36).substring(2, 8)
  return `Test${random}!@#`
}

/**
 * Esperar a que un elemento sea visible
 *
 * @param page - Página de Playwright
 * @param selector - Selector CSS
 * @param timeout - Timeout en ms
 * @returns true si es visible, false si no
 */
export async function waitForElementToBeVisible(
  page: Parameters<typeof base>[0],
  selector: string,
  timeout = 5000
): Promise<boolean> {
  try {
    await page.waitForSelector(selector, { state: 'visible', timeout })
    return true
  } catch {
    return false
  }
}

/**
 * Capturar screenshot con timestamp
 *
 * @param page - Página de Playwright
 * @param name - Nombre del screenshot
 * @returns Nombre del archivo
 */
export async function captureScreenshot(
  page: Parameters<typeof base>[0],
  name: string
): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const filename = `${timestamp}-${name}.png`
  await page.screenshot({ path: `playwright-screenshots/${filename}` })
  return filename
}

/**
 * Esperar un tiempo determinado (usar solo cuando sea necesario)
 *
 * @param ms - Milisegundos a esperar
 */
export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Verificar si el backend está disponible
 *
 * @param baseURL - URL base del backend
 * @returns true si está disponible
 */
export async function checkBackendHealth(baseURL = 'http://localhost:3000'): Promise<boolean> {
  try {
    const response = await fetch(`${baseURL}/health`)
    return response.ok
  } catch {
    return false
  }
}
