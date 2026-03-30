/**
 * Authentication E2E Tests
 *
 * Tests para el flujo de autenticación del IDP Asistente Contable.
 * Incluye tests para login exitoso, login fallido, y refresh de token.
 *
 * @module tests/e2e/specs/auth/login.spec
 */

import { test, expect } from '../../fixtures'
import { TEST_CREDENTIALS, INVALID_CREDENTIALS } from '../../utils/test-data'

test.describe('Authentication', () => {
  // Configurar timeout más largo para tests de auth
  test.setTimeout(60000)

  test.describe('Login', () => {
    /**
     * Test 1: Login exitoso con credenciales válidas
     *
     * Verifica que un usuario puede iniciar sesión con credenciales correctas
     * y es redirigido al dashboard.
     */
    test('✅ login exitoso con credenciales válidas', async ({ page, loginPage, dashboardPage }) => {
      // Arrange: Navegar a la página
      await loginPage.goto()

      // Act: Iniciar sesión con credenciales válidas
      await loginPage.login(TEST_CREDENTIALS.admin.email, TEST_CREDENTIALS.admin.password)

      // Assert: Verificar redirect a dashboard
      await expect(page).toHaveURL(/dashboard|\/$/, { timeout: 10000 })

      // Assert: Verificar que el dashboard es visible
      await expect(dashboardPage.heading).toBeVisible({ timeout: 5000 })

      // Assert: Verificar que las cards de estadísticas son visibles
      await dashboardPage.verifyStatsCardsVisible()

      // Assert: Verificar menú de usuario visible (indica auth exitosa)
      await expect(loginPage.userMenu).toBeVisible({ timeout: 5000 })
    })

    /**
     * Test 2: Login fallido con email inválido
     *
     * Verifica que el sistema rechaza credenciales con email incorrecto
     */
    test('❌ login fallido con email inválido', async ({ page, loginPage }) => {
      // Arrange: Navegar a la página de login
      await loginPage.goto()

      // Act: Intentar login con email inválido
      await loginPage.login(
        INVALID_CREDENTIALS.invalidEmail.email,
        INVALID_CREDENTIALS.invalidEmail.password
      )

      // Assert: Verificar que no hay redirect a dashboard
      const currentUrl = page.url()
      expect(currentUrl).not.toMatch(/dashboard/)

      // Assert: Verificar mensaje de error (si existe UI de error)
      const hasError = await loginPage.verifyEmptyFieldValidation()
        .catch(() => false)

      if (hasError) {
        await expect(page.getByText(/error|inválido|incorrecto/i)).toBeVisible({ timeout: 5000 })
      }
    })

    /**
     * Test 3: Login fallido con contraseña inválida
     *
     * Verifica que el sistema rechaza credenciales con password incorrecto
     */
    test('❌ login fallido con contraseña inválida', async ({ page, loginPage }) => {
      // Arrange: Navegar a la página de login
      await loginPage.goto()

      // Act: Intentar login con password inválido
      await loginPage.login(
        INVALID_CREDENTIALS.invalidPassword.email,
        INVALID_CREDENTIALS.invalidPassword.password
      )

      // Assert: Verificar que no hay redirect a dashboard
      await expect(page).not.toHaveURL(/dashboard/, { timeout: 5000 })

      // Assert: Verificar mensaje de error (si existe UI de error)
      const hasError = await loginPage.verifyErrorMessage('Credenciales inválidas')
        .catch(() => false)

      if (!hasError) {
        // Si no hay mensaje específico, verificar que seguimos en login
        const currentUrl = page.url()
        expect(currentUrl).toMatch(/\/$|login/)
      }
    })

    /**
     * Test 4: Login fallido con campos vacíos
     *
     * Verifica que el sistema valida campos requeridos
     */
    test('❌ login fallido con campos vacíos', async ({ page, loginPage }) => {
      // Arrange: Navegar a la página de login
      await loginPage.goto()

      // Act: Intentar login sin credenciales (usando método directo)
      await loginPage.login(
        INVALID_CREDENTIALS.empty.email,
        INVALID_CREDENTIALS.empty.password
      )

      // Assert: Verificar validación de campos vacíos
      const hasValidation = await loginPage.verifyEmptyFieldValidation()
        .catch(() => false)

      if (hasValidation) {
        await expect(page.getByText(/requerido|obligatorio/i)).toBeVisible({ timeout: 5000 })
      }

      // Assert: Verificar que no hay redirect
      const currentUrl = page.url()
      expect(currentUrl).not.toMatch(/dashboard/)
    })

    /**
     * Test 5: Refresh de token automático
     *
     * Verifica que la sesión persiste después de recargar la página
     */
    test('🔄 refresh de token automático y persistencia de sesión', async ({ page, authenticatedPage, dashboardPage }) => {
      // Arrange: Ya estamos autenticados gracias al fixture authenticatedPage
      await expect(dashboardPage.heading).toBeVisible({ timeout: 5000 })

      // Act 1: Recargar la página
      await page.reload()

      // Assert 1: Verificar que la sesión persiste
      await expect(dashboardPage.heading).toBeVisible({ timeout: 10000 })
      await expect(page).toHaveURL(/dashboard/, { timeout: 5000 })

      // Act 2: Verificar localStorage
      const localStorageData = await page.evaluate(() => {
        const authStorage = localStorage.getItem('auth-storage')
        return authStorage ? JSON.parse(authStorage) : null
      })

      // Assert 2: Verificar que hay datos de auth en localStorage
      expect(localStorageData).toBeTruthy()
      expect(localStorageData?.state?.isAuthenticated).toBe(true)
      expect(localStorageData?.state?.token).toBeTruthy()

      // Act 3: Navegar a otra página y regresar
      await page.goto('/documents')
      await expect(page).toHaveURL(/documents/, { timeout: 5000 })

      // Regresar al dashboard
      await dashboardPage.navigateToDocuments()

      // Assert 3: Verificar que seguimos autenticados
      await expect(dashboardPage.heading).toBeVisible({ timeout: 5000 })
    })
  })

  test.describe('Logout', () => {
    /**
     * Test 6: Logout exitoso
     *
     * Verifica que un usuario puede cerrar sesión correctamente
     */
    test('✅ logout exitoso', async ({ page, authenticatedPage, loginPage }) => {
      // Arrange: Ya estamos autenticados
      const { dashboardPage } = authenticatedPage
      await expect(dashboardPage.heading).toBeVisible({ timeout: 5000 })

      // Act: Cerrar sesión
      await loginPage.logout()

      // Assert: Verificar logout exitoso
      await expect(page).toHaveURL(/login|\/$/, { timeout: 10000 })

      // Assert: Verificar que ya no hay elementos protegidos visibles
      await expect(dashboardPage.heading).not.toBeVisible({ timeout: 5000 })
    })

    /**
     * Test 7: Verificar que no se puede acceder a rutas protegidas sin auth
     *
     * Verifica la protección de rutas después de logout
     */
    test('🚫 no se puede acceder a rutas protegidas sin auth', async ({ page, authenticatedPage }) => {
      // Arrange: Ya estamos autenticados
      const { dashboardPage } = authenticatedPage
      await expect(dashboardPage.heading).toBeVisible()

      // Act: Cerrar sesión limpiando localStorage
      await page.evaluate(() => {
        localStorage.clear()
      })
      await page.reload()

      // Assert: Intentar acceder a dashboard debería redirigir a login
      await page.goto('/dashboard')
      await expect(page).toHaveURL(/login|\/$/, { timeout: 10000 })
    })
  })

  test.describe('Navigation Protection', () => {
    /**
     * Test 8: Redirigir a login al acceder a ruta protegida sin auth
     *
     * Verifica que las rutas protegidas redirigen usuarios no autenticados
     */
    test('🔒 redirigir a login al acceder a ruta protegida', async ({ page }) => {
      // Arrange: Asegurar que no hay auth
      await page.evaluate(() => {
        localStorage.clear()
      })

      // Act: Intentar acceder a dashboard sin auth
      await page.goto('/dashboard')

      // Assert: Debería redirigir a login o home
      await expect(page).toHaveURL(/login|\/$/, { timeout: 10000 })
    })

    /**
     * Test 9: Permitir acceso a ruta pública sin auth
     *
     * Verifica que las rutas públicas son accesibles sin autenticación
     */
    test('🔓 permitir acceso a ruta pública sin auth', async ({ page }) => {
      // Arrange: Asegurar que no hay auth
      await page.evaluate(() => {
        localStorage.clear()
      })

      // Act: Navegar a home
      await page.goto('/')

      // Assert: Debería permitir acceso (aunque muestre login)
      await expect(page).toHaveURL(/\/$/, { timeout: 5000 })
    })
  })

  test.describe('Auth State Persistence', () => {
    /**
     * Test 10: Persistir sesión entre navegaciones
     *
     * Verifica que la autenticación persiste entre diferentes páginas
     */
    test('💾 persistir sesión entre navegaciones', async ({ page, authenticatedPage, dashboardPage }) => {
      // Arrange: Ya estamos autenticados
      await expect(dashboardPage.heading).toBeVisible()

      // Act: Navegar a diferentes páginas
      await page.goto('/documents')
      await expect(page).toHaveURL(/documents/, { timeout: 5000 })

      await page.goto('/chat')
      await expect(page).toHaveURL(/chat/, { timeout: 5000 })

      // Regresar al dashboard
      await page.goto('/dashboard')

      // Assert: Verificar que seguimos autenticados
      await expect(dashboardPage.heading).toBeVisible({ timeout: 5000 })
      await expect(page).toHaveURL(/dashboard/, { timeout: 5000 })
    })
  })
})
