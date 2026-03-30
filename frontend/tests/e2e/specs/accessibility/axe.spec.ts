/**
 * Tests E2E para Accesibilidad (axe-core)
 *
 * Valida que la aplicación cumpla con los estándares de accesibilidad WCAG 2.1
 * usando axe-core para detectar violaciones de accesibilidad.
 *
 * @module tests/e2e/specs/accessibility/axe
 */

import { test, expect } from '../../fixtures/test-fixtures'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accesibilidad (axe-core)', () => {
  test('1. Login sin violaciones de accesibilidad', async ({ page }) => {
    test.info().annotations.push({
      type: 'accessibility',
      description: 'Validar que la página de login cumple con WCAG 2.1',
    })

    // Act: Navegar a login
    await page.goto('/login')

    // Esperar a que la página cargue completamente
    await expect(page.getByTestId('login-form')).toBeVisible({ timeout: 10000 })

    // Act: Ejecutar axe-core
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()

    // Assert: No debe haber violaciones
    expect(accessibilityScanResults.violations).toEqual([])

    // Reportar resultados adicionales
    const violationCount = accessibilityScanResults.violations.length
    const incompleteCount = accessibilityScanResults.incomplete.length
    const passesCount = accessibilityScanResults.passes.length

    console.log(`Login - Violaciones: ${violationCount}, Incompletos: ${incompleteCount}, Pases: ${passesCount}`)
  })

  test('2. Dashboard sin violaciones de accesibilidad', async ({ authenticatedPage, page }) => {
    test.info().annotations.push({
      type: 'accessibility',
      description: 'Validar que el dashboard cumple con WCAG 2.1',
    })

    const dashboardPage = authenticatedPage.dashboardPage
    await dashboardPage.goto()

    // Esperar a que el dashboard cargue completamente
    await expect(dashboardPage.heading).toBeVisible({ timeout: 10000 })
    await dashboardPage.verifyStatsCardsVisible(10000)

    // Act: Ejecutar axe-core
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .exclude('[data-testid="chart"]') // Excluir gráficas complejas
      .analyze()

    // Assert: No debe haber violaciones críticas o serias
    const criticalViolations = accessibilityScanResults.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    )
    
    expect(criticalViolations).toEqual([])

    // Reportar resultados
    console.log(`Dashboard - Violaciones totales: ${accessibilityScanResults.violations.length}`)
    
    // Imprimir detalles de violaciones si las hay (para debugging)
    if (accessibilityScanResults.violations.length > 0) {
      accessibilityScanResults.violations.forEach(v => {
        console.log(`- ${v.id}: ${v.description} (Impact: ${v.impact})`)
      })
    }
  })

  test('3. Chat sin violaciones de accesibilidad', async ({ authenticatedPage, page }) => {
    test.info().annotations.push({
      type: 'accessibility',
      description: 'Validar que el chat cumple con WCAG 2.1',
    })

    const chatPage = authenticatedPage.chatPage
    await chatPage.open()

    // Esperar a que el chat cargue completamente
    await expect(chatPage.chatPane).toBeVisible({ timeout: 10000 })

    // Act: Enviar mensaje para cargar contenido dinámico
    await chatPage.sendMessage('Hola')
    await chatPage.waitForResponse(30000)

    // Act: Ejecutar axe-core
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .include('[data-testid="chat-pane"]')
      .analyze()

    // Assert: No debe haber violaciones críticas o serias
    const criticalViolations = accessibilityScanResults.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    )
    
    expect(criticalViolations).toEqual([])

    // Assert específico: Verificar que el input tiene label
    const inputHasLabel = await page.evaluate(() => {
      const input = document.querySelector('[data-testid="chat-input"]') as HTMLInputElement
      if (!input) return false
      
      // Verificar aria-label o label asociado
      return input.hasAttribute('aria-label') || 
             input.hasAttribute('aria-labelledby') ||
             document.querySelector(`label[for="${input.id}"]`) !== null
    })
    
    expect(inputHasLabel).toBeTruthy()
  })

  test('4. Documentos sin violaciones de accesibilidad', async ({ authenticatedPage, page }) => {
    test.info().annotations.push({
      type: 'accessibility',
      description: 'Validar que la página de documentos cumple con WCAG 2.1',
    })

    const documentsPage = authenticatedPage.documentsPage
    await documentsPage.goto()

    // Esperar a que la página cargue completamente
    await expect(documentsPage.documentsPane).toBeVisible({ timeout: 10000 })

    // Act: Ejecutar axe-core
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .exclude('[data-testid="document-preview"]') // Excluir preview complejo
      .analyze()

    // Assert: No debe haber violaciones críticas o serias
    const criticalViolations = accessibilityScanResults.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    )
    
    expect(criticalViolations).toEqual([])

    // Assert específico: Verificar que la tabla tiene estructura accesible
    const tableIsAccessible = await page.evaluate(() => {
      const table = document.querySelector('[data-testid="document-table"]') as HTMLTableElement
      if (!table) return true // Si no hay tabla, no hay violación
      
      // Verificar que tiene caption o aria-label
      return table.hasAttribute('aria-label') || 
             table.hasAttribute('role') ||
             table.querySelector('caption') !== null
    })
    
    expect(tableIsAccessible).toBeTruthy()
  })

  test('5. Navegación con teclado funcional', async ({ authenticatedPage, page }) => {
    test.info().annotations.push({
      type: 'accessibility',
      description: 'Validar que la navegación con teclado es funcional',
    })

    const dashboardPage = authenticatedPage.dashboardPage
    await dashboardPage.goto()

    // Esperar a que la página cargue
    await expect(dashboardPage.heading).toBeVisible({ timeout: 10000 })

    // Act: Navegar con Tab y verificar focus visible
    await page.keyboard.press('Tab')
    
    // Assert: Verificar que hay un elemento enfocado
    const focusedElement = await page.evaluate(() => document.activeElement)
    expect(focusedElement).toBeTruthy()

    // Assert: Verificar que el elemento enfocado tiene estilo de focus visible
    const hasVisibleFocus = await page.evaluate(() => {
      const active = document.activeElement as HTMLElement
      if (!active) return false
      
      const style = window.getComputedStyle(active)
      const outline = style.outline
      const boxShadow = style.boxShadow
      
      // Verificar si hay outline o boxShadow (indicadores de focus)
      return outline !== 'none' || boxShadow !== 'none'
    })
    
    expect(hasVisibleFocus).toBeTruthy()

    // Act: Navegar por elementos principales
    const elementsToTab = [
      dashboardPage.heading,
      dashboardPage.exportarButton,
      dashboardPage.nuevaTareaButton,
    ]

    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('Tab')
      
      // Verificar que el elemento enfocado es interactuable
      const isFocusable = await page.evaluate(() => {
        const active = document.activeElement as HTMLElement
        if (!active) return false
        
        const tagName = active.tagName.toLowerCase()
        const role = active.getAttribute('role')
        
        // Elementos comúnmente focusable
        const focusableTags = ['button', 'a', 'input', 'select', 'textarea', 'summary']
        const focusableRoles = ['button', 'link', 'tab', 'menuitem']
        
        return focusableTags.includes(tagName) || (role && focusableRoles.includes(role))
      })
      
      expect(isFocusable).toBeTruthy()
    }

    // Act: Verificar navegación con Shift+Tab (hacia atrás)
    await page.keyboard.press('Shift+Tab')
    
    // Assert: Verificar que el focus se movió hacia atrás
    const previousFocusedElement = await page.evaluate(() => document.activeElement)
    expect(previousFocusedElement).toBeTruthy()

    // Act: Verificar navegación con Enter en botón
    await page.keyboard.press('Enter')
    
    // Assert: Verificar que se activó algún elemento (puede haber navegación o acción)
    // Nota: Esto es una verificación básica, en producción se verificaría la acción específica

    // Act: Verificar navegación con flechas en elementos con role
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowUp')
    
    // Assert: Verificar que la página no colapsó
    await expect(dashboardPage.heading).toBeVisible({ timeout: 5000 })

    // Act: Verificar acceso rápido con tecla (si existe)
    // Por ejemplo, '/' para buscar
    await page.keyboard.press('/')
    
    // Verificar que no hay error en la página
    const hasError = await page.locator('text=Error').isVisible().catch(() => false)
    expect(hasError).toBeFalsy()
  })

  test('6. Skip links y landmarks ARIA (test adicional)', async ({ page }) => {
    test.info().annotations.push({
      type: 'accessibility',
      description: 'Validar skip links y landmarks ARIA',
    })

    // Act: Navegar a login
    await page.goto('/login')

    // Assert: Verificar skip link (si existe)
    const skipLink = page.locator('a[href="#main-content"], a[href="#content"], [class*="skip"]')
    const hasSkipLink = await skipLink.isVisible().catch(() => false)
    
    if (hasSkipLink) {
      await expect(skipLink).toBeVisible()
      
      // Act: Click en skip link
      await skipLink.click()
      
      // Assert: Verificar que el foco se movió al contenido principal
      const mainContent = page.locator('#main-content, #content, main')
      await expect(mainContent.first()).toBeFocused()
    }

    // Assert: Verificar landmarks ARIA
    const hasMainLandmark = await page.locator('main, [role="main"]').isVisible().catch(() => false)
    const hasNavLandmark = await page.locator('nav, [role="navigation"]').isVisible().catch(() => false)
    
    // Al menos debería haber un landmark principal
    expect(hasMainLandmark || hasNavLandmark).toBeTruthy()
  })
})
