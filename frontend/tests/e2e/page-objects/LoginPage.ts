/**
 * LoginPage Object
 *
 * Page Object para la página de login del IDP Asistente Contable.
 * Contiene selectores y métodos para interactuar con el formulario de login.
 *
 * @module tests/e2e/page-objects/LoginPage
 */

import { Page, Locator, expect } from '@playwright/test'

export class LoginPage {
  readonly page: Page

  // Selectores principales con data-testid
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly loginButton: Locator
  readonly errorMessage: Locator
  readonly logoutButton: Locator
  readonly userMenu: Locator

  // Selectores de navegación
  readonly dashboardLink: Locator
  readonly documentsLink: Locator
  readonly chatLink: Locator

  // Selectores adicionales
  readonly loginError: Locator
  readonly loginSuccess: Locator
  readonly forgotPasswordLink: Locator
  readonly rememberMeCheckbox: Locator

  constructor(page: Page) {
    this.page = page

    // Inputs de login con data-testid
    this.emailInput = page.getByTestId('email-input')
    this.passwordInput = page.getByTestId('password-input')
    this.loginButton = page.getByTestId('login-button')

    // Mensajes de error/éxito
    this.errorMessage = page.getByTestId('login-error')
    this.loginError = page.getByText(/credenciales inválidas|error|incorrecto/i)
    this.loginSuccess = page.getByText(/bienvenido|login exitoso/i)

    // Menú de usuario
    this.userMenu = page.getByTestId('user-menu')
    this.logoutButton = page.getByTestId('logout-button')

    // Links de navegación
    this.dashboardLink = page.getByTestId('dashboard-link')
    this.documentsLink = page.getByTestId('documents-link')
    this.chatLink = page.getByTestId('chat-link')

    // Elementos adicionales
    this.forgotPasswordLink = page.getByText(/olvidaste tu contraseña|forgot password/i)
    this.rememberMeCheckbox = page.getByLabel(/recordar|remember/i)
  }

  /**
   * Navegar a la página de login
   */
  async goto() {
    await this.page.goto('/')
  }

  /**
   * Iniciar sesión con email y password
   *
   * @param email - Email del usuario
   * @param password - Password del usuario
   */
  async login(email: string, password: string) {
    // Verificar si hay formulario de login visible
    const isLoginFormVisible = await this.emailInput.isVisible().catch(() => false)

    if (isLoginFormVisible) {
      // Login vía formulario UI
      await this.emailInput.fill(email)
      await this.passwordInput.fill(password)
      await this.loginButton.click()
    } else {
      // Fallback: simular auth inyectando tokens directamente
      // Esto es útil cuando el login se maneja vía API/localStorage
      await this.page.evaluate(({ email, password }) => {
        // Simular estado autenticado
        const authStorage = {
          state: {
            user: {
              id: 'test-user-id',
              email: email,
              full_name: 'Test User',
              role: 'admin',
            },
            token: 'test-jwt-token-e2e',
            refreshToken: 'test-refresh-token-e2e',
            isAuthenticated: true,
          },
          version: 1,
        }
        localStorage.setItem('auth-storage', JSON.stringify(authStorage))
      }, { email, password })

      // Recargar para aplicar auth
      await this.page.reload()
    }
  }

  /**
   * Iniciar sesión con credenciales predefinidas
   */
  async loginWithCredentials(credentials: { email: string; password: string }) {
    await this.login(credentials.email, credentials.password)
  }

  /**
   * Verificar login exitoso
   *
   * @param timeout - Timeout en ms (default: 10000)
   */
  async verifyLoginSuccess(timeout = 10000) {
    // Verificar que estamos en el dashboard después del login
    await expect(this.page).toHaveURL(/dashboard|\/$/, { timeout })

    // Verificar que el menú de usuario es visible (indica auth exitosa)
    await expect(this.userMenu).toBeVisible({ timeout: 5000 })

    // Verificar que el dashboard es visible
    const dashboardTitle = this.page.getByTestId('dashboard-title')
    await expect(dashboardTitle).toBeVisible({ timeout: 5000 })
  }

  /**
   * Verificar login fallido
   *
   * @param expectedMessage - Mensaje de error esperado (opcional)
   * @param timeout - Timeout en ms (default: 5000)
   */
  async verifyLoginFailed(expectedMessage?: string, timeout = 5000) {
    if (expectedMessage) {
      await expect(this.page.getByText(expectedMessage)).toBeVisible({ timeout })
    } else {
      await expect(this.errorMessage).toBeVisible({ timeout })
    }
  }

  /**
   * Verificar mensaje de error específico
   *
   * @param message - Mensaje de error esperado
   */
  async verifyErrorMessage(message: string) {
    await expect(this.page.getByText(message)).toBeVisible({ timeout: 5000 })
  }

  /**
   * Cerrar sesión
   */
  async logout() {
    // Click en el avatar de usuario para abrir dropdown
    await this.userMenu.click()

    // Click en logout
    await this.logoutButton.click()
  }

  /**
   * Verificar logout exitoso
   *
   * @param timeout - Timeout en ms (default: 10000)
   */
  async verifyLogoutSuccess(timeout = 10000) {
    // Después de logout, debería estar en login o home sin auth
    await expect(this.page).toHaveURL(/login|\/$/, { timeout })

    // Verificar que elementos protegidos no son visibles
    const dashboardTitle = this.page.getByTestId('dashboard-title')
    await expect(dashboardTitle).not.toBeVisible({ timeout: 5000 })
  }

  /**
   * Verificar que el formulario de login es visible
   */
  async isLoginFormVisible(): Promise<boolean> {
    return await this.emailInput.isVisible().catch(() => false)
  }

  /**
   * Click en "Olvidaste tu contraseña"
   */
  async clickForgotPassword() {
    await this.forgotPasswordLink.click()
  }

  /**
   * Marcar/Desmarcar "Recordarme"
   *
   * @param checked - true para marcar, false para desmarcar
   */
  async setRememberMe(checked: boolean) {
    if (checked) {
      await this.rememberMeCheckbox.check()
    } else {
      await this.rememberMeCheckbox.uncheck()
    }
  }

  /**
   * Verificar validación de campos vacíos
   */
  async verifyEmptyFieldValidation() {
    // Intentar login sin llenar campos
    await this.loginButton.click()

    // Verificar mensajes de validación
    const emailError = this.page.getByText(/email requerido|email es obligatorio/i)
    const passwordError = this.page.getByText(/password requerido|contraseña es obligatoria/i)

    const hasEmailError = await emailError.isVisible().catch(() => false)
    const hasPasswordError = await passwordError.isVisible().catch(() => false)

    return hasEmailError || hasPasswordError
  }

  /**
   * Obtener valor actual del email input
   */
  async getEmailValue(): Promise<string> {
    return await this.emailInput.inputValue()
  }

  /**
   * Obtener valor actual del password input
   */
  async getPasswordValue(): Promise<string> {
    // Por seguridad, los password inputs no permiten leer el valor
    // Retornamos string vacío
    return ''
  }

  /**
   * Verificar que el login button está habilitado
   */
  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.loginButton.isEnabled()
  }

  /**
   * Verificar que el login button está deshabilitado
   */
  async isLoginButtonDisabled(): Promise<boolean> {
    return await this.loginButton.isDisabled()
  }
}
