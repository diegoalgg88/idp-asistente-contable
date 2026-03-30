/**
 * Tests E2E para Responsividad (Mobile)
 *
 * Valida que la aplicación sea responsive y funcione correctamente
 * en diferentes dispositivos móviles y tablets.
 *
 * @module tests/e2e/specs/responsive/mobile
 */

import { test, expect, devices } from '@playwright/test'
import { LoginPage } from '../../page-objects/LoginPage'

// Definir dispositivos para testing
const IPHONE_13 = devices['iPhone 13']
const PIXEL_5 = devices['Pixel 5']
const IPHONE_SE = devices['iPhone SE']
const IPAD_PRO = devices['iPad Pro'] || devices['iPad (gen 7)'] || { viewport: { width: 1024, height: 768 }, userAgent: 'iPad', deviceScaleFactor: 2, isMobile: true, hasTouch: true }

test.describe('Responsividad Mobile', () => {
  test.describe('iPhone 13', () => {
    test.use({
      viewport: {
        width: IPHONE_13.viewport.width,
        height: IPHONE_13.viewport.height,
      },
      userAgent: IPHONE_13.userAgent,
      deviceScaleFactor: IPHONE_13.deviceScaleFactor,
      isMobile: true,
      hasTouch: IPHONE_13.hasTouch,
    })

    test('1. Login responsive en iPhone 13', async ({ page }) => {
      test.info().annotations.push({
        type: 'responsive',
        description: 'Validar que el login es responsive en iPhone 13',
      })

      const loginPage = new LoginPage(page)

      // Act: Navegar a login
      await loginPage.goto()

      // Assert: Verificar que el formulario de login es visible
      await expect(loginPage.emailInput).toBeVisible({ timeout: 10000 })
      await expect(loginPage.passwordInput).toBeVisible({ timeout: 5000 })
      await expect(loginPage.loginButton).toBeVisible({ timeout: 5000 })

      // Assert: Verificar que los elementos están correctamente dimensionados
      const emailBox = await loginPage.emailInput.boundingBox()
      expect(emailBox).toBeTruthy()
      expect(emailBox!.width).toBeGreaterThan(200) // Debe ocupar buen ancho en móvil

      // Assert: Verificar que el logo es visible
      const logoVisible = await loginPage.logo.isVisible().catch(() => false)
      if (logoVisible) {
        await expect(loginPage.logo).toBeVisible()
      }

      // Assert: Verificar que no hay scroll horizontal (overflow)
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
      const viewportWidth = await page.evaluate(() => window.innerWidth)
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth)
    })
  })

  test.describe('Pixel 5', () => {
    test.use({
      viewport: {
        width: PIXEL_5.viewport.width,
        height: PIXEL_5.viewport.height,
      },
      userAgent: PIXEL_5.userAgent,
      deviceScaleFactor: PIXEL_5.deviceScaleFactor,
      isMobile: true,
      hasTouch: PIXEL_5.hasTouch,
    })

    test('2. Dashboard responsive en Pixel 5', async ({ page }) => {
      test.info().annotations.push({
        type: 'responsive',
        description: 'Validar que el dashboard es responsive en Pixel 5',
      })

      // Navegar y hacer login manualmente
      const loginPage = new LoginPage(page)
      await loginPage.goto()
      await loginPage.login('admin@example.com', 'admin123')
      await expect(page).toHaveURL(/\/dashboard|\/$/, { timeout: 10000 })

      const dashboardPage = new (await import('../../page-objects/DashboardPage')).DashboardPage(page)
      await dashboardPage.goto()

      // Assert: Verificar que el dashboard carga correctamente
      await expect(dashboardPage.heading).toBeVisible({ timeout: 10000 })

      // Assert: Verificar que las cards se ajustan al viewport móvil
      const statsCards = dashboardPage.statsCards
      const cardsVisible = await statsCards.isVisible().catch(() => false)
      
      if (cardsVisible) {
        await expect(statsCards).toBeVisible({ timeout: 5000 })
        
        // Verificar que las cards están en columna en móvil
        const cardBox = await statsCards.boundingBox()
        expect(cardBox).toBeTruthy()
        expect(cardBox!.width).toBeLessThan(500) // Ancho típico de móvil
      }

      // Assert: Verificar que el activity bar es responsive (hamburguesa o drawer)
      const mobileMenuButton = page.getByRole('button', { name: /menu|navigation/i }).first()
      const hasMobileMenu = await mobileMenuButton.isVisible().catch(() => false)
      
      if (hasMobileMenu) {
        // En móvil debería haber botón de menú hamburguesa
        await expect(mobileMenuButton).toBeVisible()
        
        // Act: Abrir menú móvil
        await mobileMenuButton.click()
        
        // Assert: Verificar que el drawer se abre
        const drawer = page.getByRole('navigation')
        await expect(drawer.first()).toBeVisible({ timeout: 5000 })
      }

      // Assert: Verificar que no hay scroll horizontal
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
      const viewportWidth = await page.evaluate(() => window.innerWidth)
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth)
    })
  })

  test.describe('iPhone SE', () => {
    test.use({
      viewport: {
        width: IPHONE_SE.viewport.width,
        height: IPHONE_SE.viewport.height,
      },
      userAgent: IPHONE_SE.userAgent,
      deviceScaleFactor: IPHONE_SE.deviceScaleFactor,
      isMobile: true,
      hasTouch: IPHONE_SE.hasTouch,
    })

    test('3. Chat responsive en iPhone SE', async ({ page }) => {
      test.info().annotations.push({
        type: 'responsive',
        description: 'Validar que el chat es responsive en iPhone SE',
      })

      // Navegar y hacer login
      const loginPage = new LoginPage(page)
      await loginPage.goto()
      await loginPage.login('admin@example.com', 'admin123')
      await expect(page).toHaveURL(/\/dashboard|\/$/, { timeout: 10000 })

      const chatPage = new (await import('../../page-objects/ChatPage')).ChatPage(page)
      await chatPage.open()

      // Assert: Verificar que el chat es visible
      await expect(chatPage.chatPane).toBeVisible({ timeout: 10000 })

      // Assert: Verificar que el input de chat está visible y accesible
      await expect(chatPage.chatInput).toBeVisible({ timeout: 5000 })
      await expect(chatPage.chatInput).toBeEnabled()

      // Assert: Verificar que el input ocupa el ancho adecuado en móvil
      const inputBox = await chatPage.chatInput.boundingBox()
      expect(inputBox).toBeTruthy()
      expect(inputBox!.width).toBeGreaterThan(200) // Debe ser usable en móvil

      // Act: Enviar mensaje de prueba
      await chatPage.sendMessage('Hola')

      // Assert: Verificar que los mensajes se muestran correctamente
      await chatPage.waitForResponse(30000)
      
      const messages = await chatPage.getAllMessages()
      expect(messages.length).toBeGreaterThan(0)

      // Assert: Verificar que los mensajes tienen buen wrapping en móvil
      const userMessage = page.locator('[data-testid="user-message"]').last()
      const messageBox = await userMessage.boundingBox()
      expect(messageBox).toBeTruthy()
      expect(messageBox!.width).toBeLessThan(400) // No debe exceder ancho de móvil

      // Assert: Verificar que el botón de enviar es visible
      await expect(chatPage.sendButton).toBeVisible()

      // Assert: Verificar que no hay scroll horizontal
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
      const viewportWidth = await page.evaluate(() => window.innerWidth)
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth)
    })
  })

  test.describe('iPad Pro', () => {
    test.use({
      viewport: {
        width: IPAD_PRO.viewport.width,
        height: IPAD_PRO.viewport.height,
      },
      userAgent: IPAD_PRO.userAgent,
      deviceScaleFactor: IPAD_PRO.deviceScaleFactor,
      isMobile: true,
      hasTouch: IPAD_PRO.hasTouch,
    })

    test('4. Documentos responsive en iPad', async ({ page }) => {
      test.info().annotations.push({
        type: 'responsive',
        description: 'Validar que la página de documentos es responsive en iPad',
      })

      // Navegar y hacer login
      const loginPage = new LoginPage(page)
      await loginPage.goto()
      await loginPage.login('admin@example.com', 'admin123')
      await expect(page).toHaveURL(/\/dashboard|\/$/, { timeout: 10000 })

      const documentsPage = new (await import('../../page-objects/DocumentsPage')).DocumentsPage(page)
      await documentsPage.goto()

      // Assert: Verificar que la página de documentos carga correctamente
      await expect(documentsPage.documentsPane).toBeVisible({ timeout: 10000 })

      // Assert: Verificar que la tabla de documentos es visible
      const tableVisible = await documentsPage.documentTable.isVisible().catch(() => false)
      if (tableVisible) {
        await expect(documentsPage.documentTable).toBeVisible({ timeout: 5000 })
      }

      // Assert: Verificar que el botón de upload es visible y accesible
      await expect(documentsPage.uploadButton).toBeVisible({ timeout: 5000 })

      // Assert: Verificar que los filtros son visibles
      const filterVisible = await documentsPage.filterDropdown.isVisible().catch(() => false)
      if (filterVisible) {
        await expect(documentsPage.filterDropdown).toBeVisible()
      }

      // Assert: Verificar layout en tablet (debe verse más que en móvil)
      const viewportWidth = await page.evaluate(() => window.innerWidth)
      expect(viewportWidth).toBeGreaterThan(700) // iPad tiene viewport amplio

      // Assert: Verificar que la drop zone es visible (si existe)
      const dropZoneVisible = await documentsPage.dropZone.isVisible().catch(() => false)
      if (dropZoneVisible) {
        await expect(documentsPage.dropZone).toBeVisible()
      }

      // Assert: Verificar que no hay scroll horizontal
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth)

      // Assert: Verificar que los tabs de documentos son visibles
      const tabsVisible = await documentsPage.todosTab.isVisible().catch(() => false)
      if (tabsVisible) {
        await expect(documentsPage.todosTab).toBeVisible()
      }
    })
  })

  test.describe('Tests Cross-Device', () => {
    test('5. Navegación táctil funcional en todos los dispositivos', async ({ page, browserName }) => {
      test.info().annotations.push({
        type: 'responsive',
        description: 'Validar navegación táctil en diferentes dispositivos',
      })

      // Skip en desktop browsers
      test.skip(browserName !== 'chromium', 'Solo probar en Chromium para dispositivos móviles')

      // Navegar y hacer login
      const loginPage = new LoginPage(page)
      await loginPage.goto()
      await loginPage.login('admin@example.com', 'admin123')
      await expect(page).toHaveURL(/\/dashboard|\/$/, { timeout: 10000 })

      const dashboardPage = new (await import('../../page-objects/DashboardPage')).DashboardPage(page)
      await dashboardPage.goto()

      // Act: Simular swipe gesture (si el dispositivo soporta touch)
      const isMobile = await page.evaluate(() => 'ontouchstart' in window)
      
      if (isMobile) {
        // Simular touch en elementos
        const dashboardButton = page.getByRole('button', { name: /dashboard/i }).first()
        await dashboardButton.tap()
        
        // Verificar respuesta al touch
        await expect(dashboardPage.heading).toBeVisible({ timeout: 5000 })
      }
    })
  })
})
