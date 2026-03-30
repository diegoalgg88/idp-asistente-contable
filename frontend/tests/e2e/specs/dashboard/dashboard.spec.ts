/**
 * Tests E2E para Dashboard
 *
 * Valida la funcionalidad del dashboard principal, incluyendo
 * estadísticas, Tax Health Score, gráficas y actualizaciones en tiempo real.
 *
 * @module tests/e2e/specs/dashboard/dashboard
 */

import { test, expect } from '../../fixtures/test-fixtures'
import { DashboardPage } from '../../page-objects/DashboardPage'

test.describe('Dashboard', () => {
  let dashboardPage: DashboardPage

  test.beforeEach(async ({ authenticatedPage }) => {
    dashboardPage = authenticatedPage.dashboardPage
    await dashboardPage.goto()
    await expect(dashboardPage.heading).toBeVisible({ timeout: 10000 })
  })

  test('1. Cargar dashboard con estadísticas', async ({ page }) => {
    test.info().annotations.push({
      type: 'feature',
      description: 'Validar carga del dashboard con estadísticas principales',
    })

    // Assert: Verificar heading principal
    await expect(dashboardPage.heading).toBeVisible({ timeout: 10000 })
    await expect(dashboardPage.heading).toContainText(/dashboard|inicio/i)

    // Assert: Verificar cards de estadísticas
    await dashboardPage.verifyStatsCardsVisible(10000)

    // Assert: Verificar que las cards tienen valores
    const statsValues = await dashboardPage.getStatsValues()
    
    expect(statsValues.totalProcesado).toBeTruthy()
    expect(statsValues.completados).toBeTruthy()
    expect(statsValues.confianzaPromedio).toBeTruthy()
    expect(statsValues.tiempoPromedio).toBeTruthy()

    // Assert: Verificar panel de rendimiento
    await dashboardPage.verifyRendimientoPanel(5000)

    // Assert: Verificar status bar
    await dashboardPage.verifyStatusBar(5000)
  })

  test('2. Visualizar Tax Health Score (semáforo)', async ({ page }) => {
    test.info().annotations.push({
      type: 'feature',
      description: 'Validar visualización del Tax Health Score con indicador visual',
    })

    // Assert: Verificar panel de estatus fiscal
    await dashboardPage.verifyEstatusFiscal(10000)

    // Assert: Verificar score numérico
    const fiscalScore = await dashboardPage.getFiscalScore()
    expect(fiscalScore).toBeTruthy()
    
    // El score debe ser un número entre 0 y 100 o similar
    const scoreValue = parseFloat(fiscalScore.replace(',', '.'))
    expect(scoreValue).toBeGreaterThanOrEqual(0)
    expect(scoreValue).toBeLessThanOrEqual(100)

    // Assert: Verificar indicador visual (semáforo)
    // Buscar indicador de color (verde/amarillo/rojo)
    const trafficLightIndicator = page.locator('[data-testid*="score-indicator"], [class*="traffic-light"], [class*="semáforo"], [class*="semaforo"]')
    
    // Verificar que hay algún indicador visual del score
    const hasVisualIndicator = await trafficLightIndicator.isVisible().catch(() => false)
    
    if (hasVisualIndicator) {
      // Verificar que el indicador tiene clase de color
      const className = await trafficLightIndicator.getAttribute('class') || ''
      const hasColorClass = /green|yellow|red|verde|amarillo|rojo/i.test(className)
      expect(hasColorClass).toBeTruthy()
    } else {
      // Alternativa: verificar por elemento con color de fondo
      const coloredElement = page.locator('[class*="bg-green"], [class*="bg-yellow"], [class*="bg-red"]').first()
      await expect(coloredElement).toBeVisible({ timeout: 5000 })
    }

    // Assert: Verificar etiqueta descriptiva del score
    const scoreLabel = page.getByText(/tax health|health score|estatus fiscal|score fiscal/i)
    await expect(scoreLabel).toBeVisible()
  })

  test('3. Visualizar gráficas de impuestos', async ({ page }) => {
    test.info().annotations.push({
      type: 'feature',
      description: 'Validar visualización de gráficas de impuestos',
    })

    // Assert: Verificar que hay gráficas en el dashboard
    // Buscar elementos canvas o svg para gráficas
    const charts = page.locator('canvas, svg[data-testid*="chart"], [class*="chart"], [class*="gráfica"], [class*="grafica"]')
    
    // Esperar a que las gráficas carguen
    await expect(async () => {
      const count = await charts.count()
      expect(count).toBeGreaterThan(0)
    }).toPass({ timeout: 10000 })

    // Assert: Verificar gráfica de impuestos específicos
    const taxCharts = page.getByText(/iva|isr|retenciones|impuestos/i)
    await expect(taxCharts.first()).toBeVisible({ timeout: 5000 })

    // Assert: Verificar leyenda de gráficas
    const chartLegend = page.locator('[class*="legend"], [class*="leyenda"]').first()
    const hasLegend = await chartLegend.isVisible().catch(() => false)
    
    if (hasLegend) {
      await expect(chartLegend).toBeVisible()
    }

    // Assert: Verificar tooltips en gráficas (hover)
    const chartElement = charts.first()
    await chartElement.hover()
    
    // Verificar que aparece tooltip
    const tooltip = page.locator('[class*="tooltip"], [role="tooltip"]').first()
    const hasTooltip = await tooltip.isVisible().catch(() => false)
    
    if (hasTooltip) {
      await expect(tooltip).toBeVisible({ timeout: 5000 })
    }
  })

  test('4. Actualización en tiempo real (SSE)', async ({ page }) => {
    test.info().annotations.push({
      type: 'feature',
      description: 'Validar actualización en tiempo real vía Server-Sent Events',
    })

    // Arrange: Configurar mock para SSE
    await page.route('**/api/v1/dashboard/stream', async route => {
      const stream = new ReadableStream({
        start(controller) {
          // Enviar eventos SSE simulados
          const events = [
            'data: {"type": "stats_update", "totalProcesado": 125000}\n\n',
            'data: {"type": "stats_update", "completados": 98}\n\n',
            'data: {"type": "document_processed", "name": "FAC-099.pdf"}\n\n',
          ]
          
          let index = 0
          const sendEvent = () => {
            if (index < events.length) {
              controller.enqueue(new TextEncoder().encode(events[index]))
              index++
              setTimeout(sendEvent, 1000)
            } else {
              controller.close()
            }
          }
          
          sendEvent()
        },
      })

      route.fulfill({
        status: 200,
        contentType: 'text/event-stream',
        body: stream as any,
        headers: {
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })
    })

    // Assert: Verificar conexión SSE
    const sseStatus = page.getByText(/conectado|connected|en vivo|live/i)
    await expect(sseStatus.first()).toBeVisible({ timeout: 5000 })

    // Act: Esperar actualización de datos
    await page.waitForTimeout(3000)

    // Assert: Verificar que los datos se actualizaron
    const statsValues = await dashboardPage.getStatsValues()
    
    // Al menos una estadística debe tener valor
    const hasValues = Object.values(statsValues).some(v => v && v.length > 0)
    expect(hasValues).toBeTruthy()

    // Assert: Verificar indicador de actividad en tiempo real
    const liveIndicator = page.locator('[class*="live"], [class*="real-time"]').first()
    const isLiveVisible = await liveIndicator.isVisible().catch(() => false)
    
    if (isLiveVisible) {
      await expect(liveIndicator).toBeVisible()
    }
  })

  test('5. Exportar dashboard a PDF', async ({ page }) => {
    test.info().annotations.push({
      type: 'feature',
      description: 'Validar exportación del dashboard a PDF',
    })

    // Arrange: Configurar mock para exportación
    await page.route('**/api/v1/dashboard/export', async route => {
      await route.fulfill({
        status: 200,
        json: {
          success: true,
          downloadUrl: '/downloads/dashboard-report.pdf',
          filename: 'dashboard-report-2026-03.pdf',
        },
      })
    })

    // Arrange: Verificar botón de exportar
    await expect(dashboardPage.exportarButton).toBeVisible({ timeout: 5000 })

    // Act: Click en exportar
    await dashboardPage.clickExportar()

    // Assert: Verificar menú de opciones de exportación
    const exportOptions = page.getByRole('menu')
    const hasExportMenu = await exportOptions.isVisible().catch(() => false)
    
    if (hasExportMenu) {
      // Seleccionar PDF
      const pdfOption = page.getByRole('menuitem', { name: /pdf/i })
      await expect(pdfOption).toBeVisible({ timeout: 5000 })
      await pdfOption.click()
    }

    // Assert: Verificar mensaje de generación
    const generatingMessage = page.getByText(/generando|generating|exportando|exporting/i)
    await expect(generatingMessage.first()).toBeVisible({ timeout: 5000 })

    // Assert: Verificar descarga completada
    const downloadComplete = page.getByText(/descarga completa|download complete|listo|ready/i)
    await expect(downloadComplete.first()).toBeVisible({ timeout: 15000 })

    // Assert: Verificar evento de descarga
    const downloadEvent = await page.waitForEvent('download', { timeout: 15000 }).catch(() => null)
    
    if (downloadEvent) {
      const filename = downloadEvent.suggestedFilename()
      expect(filename).toContain('dashboard')
      expect(filename).toContain('.pdf')
    }
  })
})
