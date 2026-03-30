/**
 * Tests E2E para Conciliación (Matching)
 *
 * Valida la funcionalidad de conciliación de transacciones bancarias
 * con documentos fiscales usando API mocking.
 *
 * @module tests/e2e/specs/reconciliation/matching
 */

import { test, expect } from '../../fixtures/test-fixtures'

test.describe('Conciliación (Matching)', () => {
  // Datos mock para las pruebas
  const mockMatches = [
    {
      id: '1',
      transaction: { description: 'AMAZON MX', amount: 1250.00, date: '2026-03-01' },
      document: { name: 'FAC-001', folio: 'A123', amount: 1250.00, rfc: 'AMAZON01' },
      match_type: 'exact',
      confidence: 0.95,
      status: 'pending',
    },
    {
      id: '2',
      transaction: { description: 'WALMART', amount: 5420.50, date: '2026-03-02' },
      document: { name: 'FAC-002', folio: 'B456', amount: 5420.50, rfc: 'WALMART01' },
      match_type: 'exact',
      confidence: 0.98,
      status: 'pending',
    },
    {
      id: '3',
      transaction: { description: 'RESTAURANTE EL RINCON', amount: 850.00, date: '2026-03-03' },
      document: { name: 'FAC-003', folio: 'C789', amount: 850.00, rfc: 'RINCON01' },
      match_type: 'fuzzy',
      confidence: 0.85,
      status: 'pending',
    },
    {
      id: '4',
      transaction: { description: 'SERVICIOS PROFESIONALES SA', amount: 12500.00, date: '2026-03-04' },
      document: { name: 'FAC-004', folio: 'D012', amount: 12500.00, rfc: 'SERPROF01' },
      match_type: 'llm',
      confidence: 0.72,
      status: 'pending',
    },
  ]

  test.beforeEach(async ({ page, authenticatedPage }) => {
    // Configurar mocks de API para todos los tests
    await page.route('**/api/v1/reconciliation/matches', async route => {
      await route.fulfill({
        status: 200,
        json: {
          matches: mockMatches,
          total: mockMatches.length,
          summary: {
            exact: 2,
            fuzzy: 1,
            llm: 1,
            pending: 4,
            confirmed: 0,
            rejected: 0,
          },
        },
      })
    })

    // Mock para confirmar match
    await page.route('**/api/v1/reconciliation/matches/*/confirm', async route => {
      await route.fulfill({
        status: 200,
        json: {
          success: true,
          message: 'Match confirmado exitosamente',
        },
      })
    })

    // Mock para rechazar match
    await page.route('**/api/v1/reconciliation/matches/*/reject', async route => {
      await route.fulfill({
        status: 200,
        json: {
          success: true,
          message: 'Match rechazado exitosamente',
        },
      })
    })

    // Mock para exportar reporte
    await page.route('**/api/v1/reconciliation/export', async route => {
      await route.fulfill({
        status: 200,
        json: {
          success: true,
          downloadUrl: '/downloads/reconciliation-report.pdf',
        },
      })
    })

    // Navegar a página de conciliación
    await page.goto('/reconciliation')
    await expect(page.getByText(/conciliación|reconciliation|matches/i)).toBeVisible({ timeout: 10000 })
  })

  test('1. Upload de estado de cuenta (mock)', async ({ page }) => {
    test.info().annotations.push({
      type: 'feature',
      description: 'Validar upload de estado de cuenta bancario',
    })

    // Arrange: Mock para upload de estado de cuenta
    await page.route('**/api/v1/reconciliation/upload-statement', async route => {
      await route.fulfill({
        status: 200,
        json: {
          success: true,
          statement: {
            id: 'stmt-123',
            name: 'estado-cuenta-feb-2026.pdf',
            bank: 'BBVA',
            period: '2026-02',
            transactionCount: 150,
          },
        },
      })
    })

    // Act: Click en upload button
    const uploadButton = page.getByRole('button', { name: /subir estado de cuenta|upload statement/i })
    await expect(uploadButton).toBeVisible({ timeout: 5000 })
    await uploadButton.click()

    // Simular selección de archivo
    const fileInput = page.locator('input[type="file"]').first()
    await fileInput.setInputFiles('test-statement.pdf')

    // Assert: Verificar mensaje de éxito
    const successMessage = page.getByText(/estado de cuenta subido|statement uploaded|exitosamente|successfully/i)
    await expect(successMessage).toBeVisible({ timeout: 5000 })
  })

  test('2. Visualización de matches sugeridos (mock)', async ({ page }) => {
    test.info().annotations.push({
      type: 'feature',
      description: 'Validar visualización de matches sugeridos por el sistema',
    })

    // Assert: Verificar que se muestran los matches
    const matchList = page.getByTestId('matches-list')
    await expect(matchList).toBeVisible({ timeout: 10000 })

    // Assert: Verificar que hay 4 matches
    const matchItems = page.locator('[data-testid="match-item"]')
    await expect(matchItems).toHaveCount(4)

    // Assert: Verificar datos del primer match
    const firstMatch = matchItems.first()
    await expect(firstMatch).toContainText('AMAZON MX')
    await expect(firstMatch).toContainText('1,250.00')
    await expect(firstMatch).toContainText('FAC-001')

    // Assert: Verificar badge de tipo de match
    const exactBadge = page.getByText(/exact|exacto/i).first()
    await expect(exactBadge).toBeVisible()
  })

  test('3. Confirmar match individual', async ({ page }) => {
    test.info().annotations.push({
      type: 'feature',
      description: 'Validar confirmación de match individual',
    })

    // Arrange: Esperar a que carguen los matches
    const matchItems = page.locator('[data-testid="match-item"]')
    await expect(matchItems).toHaveCount(4)

    // Act: Click en confirmar primer match
    const confirmButton = matchItems.first().getByRole('button', { name: /confirmar|confirm/i })
    await confirmButton.click()

    // Assert: Verificar mensaje de éxito
    const successMessage = page.getByText(/confirmado|confirmed|exitosamente|successfully/i)
    await expect(successMessage).toBeVisible({ timeout: 5000 })

    // Assert: Verificar que el match cambió de estado
    const statusBadge = matchItems.first().getByTestId('status-badge')
    await expect(statusBadge).toContainText(/confirmado|confirmed/i)
  })

  test('4. Rechazar match individual', async ({ page }) => {
    test.info().annotations.push({
      type: 'feature',
      description: 'Validar rechazo de match individual',
    })

    // Arrange: Esperar a que carguen los matches
    const matchItems = page.locator('[data-testid="match-item"]')
    await expect(matchItems).toHaveCount(4)

    // Act: Click en rechazar segundo match
    const rejectButton = matchItems.nth(1).getByRole('button', { name: /rechazar|reject/i })
    await rejectButton.click()

    // Assert: Verificar mensaje de éxito
    const successMessage = page.getByText(/rechazado|rejected|exitosamente|successfully/i)
    await expect(successMessage).toBeVisible({ timeout: 5000 })

    // Assert: Verificar que el match cambió de estado
    const statusBadge = matchItems.nth(1).getByTestId('status-badge')
    await expect(statusBadge).toContainText(/rechazado|rejected/i)
  })

  test('5. Filtrar matches por tipo (exact/fuzzy/llm)', async ({ page }) => {
    test.info().annotations.push({
      type: 'feature',
      description: 'Validar filtrado de matches por tipo',
    })

    // Arrange: Verificar que hay filtro de tipos
    const filterDropdown = page.getByRole('button', { name: /filtrar por tipo|filter by type/i })
    await expect(filterDropdown).toBeVisible({ timeout: 5000 })

    // Act: Filtrar por exact matches
    await filterDropdown.click()
    const exactOption = page.getByRole('menuitem', { name: /exact|exactos/i })
    await exactOption.click()

    // Assert: Verificar que solo se muestran exact matches (2 en nuestro mock)
    const matchItems = page.locator('[data-testid="match-item"]')
    await expect(async () => {
      const count = await matchItems.count()
      expect(count).toBe(2) // mockMatches tiene 2 exact
    }).toPass({ timeout: 5000 })

    // Act: Cambiar filtro a fuzzy
    await filterDropdown.click()
    const fuzzyOption = page.getByRole('menuitem', { name: /fuzzy|difuso/i })
    await fuzzyOption.click()

    // Assert: Verificar que solo se muestra 1 fuzzy match
    await expect(async () => {
      const count = await matchItems.count()
      expect(count).toBe(1)
    }).toPass({ timeout: 5000 })

    // Act: Cambiar filtro a llm
    await filterDropdown.click()
    const llmOption = page.getByRole('menuitem', { name: /llm|ai|inteligencia/i })
    await llmOption.click()

    // Assert: Verificar que solo se muestra 1 llm match
    await expect(async () => {
      const count = await matchItems.count()
      expect(count).toBe(1)
    }).toPass({ timeout: 5000 })
  })

  test('6. Exportar reporte de conciliación', async ({ page }) => {
    test.info().annotations.push({
      type: 'feature',
      description: 'Validar exportación de reporte de conciliación',
    })

    // Arrange: Verificar botón de exportar
    const exportButton = page.getByRole('button', { name: /exportar|export|reporte|report/i })
    await expect(exportButton).toBeVisible({ timeout: 5000 })

    // Act: Click en exportar
    await exportButton.click()

    // Assert: Verificar mensaje de éxito
    const successMessage = page.getByText(/exportando|exporting|generando|generating/i)
    await expect(successMessage).toBeVisible({ timeout: 5000 })

    // Assert: Verificar que se completó la exportación
    const downloadComplete = page.getByText(/descarga completa|download complete|listo|ready/i)
    await expect(downloadComplete).toBeVisible({ timeout: 10000 })

    // Assert: Verificar que se descargó el archivo
    const downloadEvent = await page.waitForEvent('download', { timeout: 10000 }).catch(() => null)
    if (downloadEvent) {
      expect(downloadEvent.suggestedFilename()).toContain('reconciliation')
    }
  })
})
