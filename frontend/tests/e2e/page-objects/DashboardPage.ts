/**
 * DashboardPage Object
 *
 * Page Object para la página del Dashboard del IDP Asistente Contable.
 * Contiene selectores y métodos para interactuar con el dashboard principal.
 *
 * @module tests/e2e/page-objects/DashboardPage
 */

import { Page, Locator, expect } from '@playwright/test'

export class DashboardPage {
  readonly page: Page

  // Encabezados principales
  readonly heading: Locator
  readonly subheading: Locator

  // Cards de estadísticas con data-testid
  readonly totalProcesadoCard: Locator
  readonly completadosCard: Locator
  readonly confianzaPromedioCard: Locator
  readonly tiempoPromedioCard: Locator

  // Elementos del dashboard
  readonly rendimientoPanel: Locator
  readonly estatusFiscalPanel: Locator
  readonly aiInsightCard: Locator

  // Botones de acción
  readonly exportarButton: Locator
  readonly nuevaTareaButton: Locator

  // Activity bar navigation
  readonly dashboardActivityButton: Locator
  readonly documentsActivityButton: Locator
  readonly clientsActivityButton: Locator
  readonly fiscalActivityButton: Locator
  readonly payrollActivityButton: Locator
  readonly financeActivityButton: Locator
  readonly expensesActivityButton: Locator
  readonly settingsActivityButton: Locator

  // Status bar
  readonly statusBar: Locator
  readonly conexionStatus: Locator
  readonly sincronizacionStatus: Locator

  // Elementos adicionales
  readonly statsCards: Locator
  readonly documentosRecientes: Locator
  readonly metricasIA: Locator

  constructor(page: Page) {
    this.page = page

    // Encabezados con data-testid
    this.heading = page.getByTestId('dashboard-title')
    this.subheading = page.getByText(/idp intelligence hub|real-time analytics/i)

    // Cards de estadísticas con data-testid
    this.totalProcesadoCard = page.getByTestId('stat-total-procesado')
    this.completadosCard = page.getByTestId('stat-completados')
    this.confianzaPromedioCard = page.getByTestId('stat-confianza')
    this.tiempoPromedioCard = page.getByTestId('stat-tiempo')

    // Paneles principales
    this.rendimientoPanel = page.getByText(/rendimiento automático|performance/i).locator('..')
    this.estatusFiscalPanel = page.getByText(/estatus fiscal|fiscal score/i).locator('..')
    this.aiInsightCard = page.getByText(/ai insight|optimización|deducibilidad/i).locator('..')

    // Botones de acción
    this.exportarButton = page.getByRole('button', { name: /exportar/i })
    this.nuevaTareaButton = page.getByRole('button', { name: /nueva tarea/i })

    // Activity bar navigation (íconos laterales)
    this.dashboardActivityButton = page.getByRole('button', { name: /dashboard/i }).first()
    this.documentsActivityButton = page.getByRole('button', { name: /documentos/i })
    this.clientsActivityButton = page.getByRole('button', { name: /clientes/i })
    this.fiscalActivityButton = page.getByRole('button', { name: /fiscal/i })
    this.payrollActivityButton = page.getByRole('button', { name: /nómina|nomina/i })
    this.financeActivityButton = page.getByRole('button', { name: /finanzas|finance/i })
    this.expensesActivityButton = page.getByRole('button', { name: /gastos|expenses/i })
    this.settingsActivityButton = page.getByRole('button', { name: /configuración|settings/i })

    // Status bar
    this.statusBar = page.getByRole('contentinfo')
    this.conexionStatus = page.getByText(/conectado|connected/i)
    this.sincronizacionStatus = page.getByText(/sincronización|sync|al día/i)

    // Elementos adicionales
    this.statsCards = page.getByTestId('stats-cards')
    this.documentosRecientes = page.getByText(/documentos recientes|últimos documentos/i)
    this.metricasIA = page.getByText(/métricas ia|metricas ia/i)
  }

  /**
   * Navegar al dashboard
   */
  async goto() {
    await this.page.goto('/dashboard')
  }

  /**
   * Verificar que el dashboard es visible
   *
   * @returns true si el dashboard es visible
   */
  async isVisible(): Promise<boolean> {
    try {
      await this.heading.waitFor({ state: 'visible', timeout: 5000 })
      return true
    } catch {
      return false
    }
  }

  /**
   * Verificar que las cards de estadísticas son visibles
   *
   * @param timeout - Timeout en ms
   */
  async verifyStatsCardsVisible(timeout = 5000) {
    await expect(this.totalProcesadoCard).toBeVisible({ timeout })
    await expect(this.completadosCard).toBeVisible({ timeout })
    await expect(this.confianzaPromedioCard).toBeVisible({ timeout })
    await expect(this.tiempoPromedioCard).toBeVisible({ timeout })
  }

  /**
   * Obtener valores de las estadísticas
   *
   * @returns Objeto con los valores de las estadísticas
   */
  async getStatsValues(): Promise<Record<string, string>> {
    return {
      totalProcesado: await this.totalProcesadoCard.textContent() || '',
      completados: await this.completadosCard.textContent() || '',
      confianzaPromedio: await this.confianzaPromedioCard.textContent() || '',
      tiempoPromedio: await this.tiempoPromedioCard.textContent() || '',
    }
  }

  /**
   * Verificar panel de rendimiento
   *
   * @param timeout - Timeout en ms
   */
  async verifyRendimientoPanel(timeout = 5000) {
    await expect(this.rendimientoPanel).toBeVisible({ timeout })
  }

  /**
   * Verificar estatus fiscal
   *
   * @param timeout - Timeout en ms
   */
  async verifyEstatusFiscal(timeout = 5000) {
    await expect(this.estatusFiscalPanel).toBeVisible({ timeout })
  }

  /**
   * Verificar AI Insight card
   *
   * @param timeout - Timeout en ms
   */
  async verifyAiInsightCard(timeout = 5000) {
    await expect(this.aiInsightCard).toBeVisible({ timeout })
  }

  /**
   * Click en exportar reporte
   */
  async clickExportar() {
    await this.exportarButton.click()
  }

  /**
   * Click en nueva tarea
   */
  async clickNuevaTarea() {
    await this.nuevaTareaButton.click()
  }

  /**
   * Navegar a documentos desde el activity bar
   */
  async navigateToDocuments() {
    await this.documentsActivityButton.click()
  }

  /**
   * Navegar a fiscal desde el activity bar
   */
  async navigateToFiscal() {
    await this.fiscalActivityButton.click()
  }

  /**
   * Navegar a clientes desde el activity bar
   */
  async navigateToClients() {
    await this.clientsActivityButton.click()
  }

  /**
   * Navegar a nómina desde el activity bar
   */
  async navigateToPayroll() {
    await this.payrollActivityButton.click()
  }

  /**
   * Navegar a finanzas desde el activity bar
   */
  async navigateToFinance() {
    await this.financeActivityButton.click()
  }

  /**
   * Navegar a gastos desde el activity bar
   */
  async navigateToExpenses() {
    await this.expensesActivityButton.click()
  }

  /**
   * Verificar status bar
   *
   * @param timeout - Timeout en ms
   */
  async verifyStatusBar(timeout = 3000) {
    await expect(this.statusBar).toBeVisible({ timeout })
    await expect(this.conexionStatus).toBeVisible({ timeout })
  }

  /**
   * Verificar datos del dashboard después de login
   *
   * @param timeout - Timeout en ms
   */
  async verifyDashboardData(timeout = 5000) {
    // Verificar heading principal
    await expect(this.heading).toBeVisible({ timeout })

    // Verificar cards de estadísticas
    await this.verifyStatsCardsVisible(timeout)

    // Verificar panel de rendimiento
    await this.verifyRendimientoPanel(timeout)

    // Verificar status bar
    await this.verifyStatusBar(timeout)
  }

  /**
   * Verificar documentos recientes (si existen)
   *
   * @param timeout - Timeout en ms
   */
  async verifyDocumentosRecientes(timeout = 5000) {
    const isVisible = await this.documentosRecientes.isVisible().catch(() => false)
    if (isVisible) {
      await expect(this.documentosRecientes).toBeVisible({ timeout })
    }
  }

  /**
   * Verificar métricas de IA
   *
   * @param timeout - Timeout en ms
   */
  async verifyMetricasIA(timeout = 5000) {
    const isVisible = await this.metricasIA.isVisible().catch(() => false)
    if (isVisible) {
      await expect(this.metricasIA).toBeVisible({ timeout })
    }
  }

  /**
   * Obtener score fiscal
   *
   * @returns Score fiscal como string
   */
  async getFiscalScore(): Promise<string> {
    const scoreElement = this.page.getByText(/^\d+\.\d+$/).first()
    return await scoreElement.textContent() || 'N/A'
  }

  /**
   * Verificar que hay advertencias fiscales
   *
   * @returns true si hay advertencias
   */
  async hasFiscalWarnings(): Promise<boolean> {
    const warnings = this.page.getByText(/advertencia|aviso|alerta/i)
    return await warnings.isVisible().catch(() => false)
  }

  /**
   * Esperar a que el dashboard cargue completamente
   *
   * @param timeout - Timeout en ms
   */
  async waitForDashboardLoad(timeout = 10000) {
    await this.heading.waitFor({ state: 'visible', timeout })
    await this.verifyStatsCardsVisible(timeout)
  }
}
