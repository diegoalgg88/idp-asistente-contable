/**
 * DashboardPage Object
 * 
 * Page Object para la página del Dashboard del IDP Asistente Contable.
 * Contiene selectores y métodos para interactuar con el dashboard principal.
 */

import { Page, Locator, expect } from '@playwright/test'

export class DashboardPage {
  readonly page: Page

  // Encabezados principales
  readonly heading: Locator
  readonly subheading: Locator

  // Cards de estadísticas
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

  // Status bar
  readonly statusBar: Locator
  readonly conexionStatus: Locator
  readonly sincronizacionStatus: Locator

  constructor(page: Page) {
    this.page = page

    // Encabezados
    this.heading = page.getByRole('heading', { name: /panel de control|dashboard/i })
    this.subheading = page.getByText(/idp intelligence hub|real-time analytics/i)

    // Cards de estadísticas (basado en Dashboard.tsx)
    this.totalProcesadoCard = page.getByText(/total procesado/i).locator('..')
    this.completadosCard = page.getByText(/completados/i).locator('..')
    this.confianzaPromedioCard = page.getByText(/confianza promedio|precisión/i).locator('..')
    this.tiempoPromedioCard = page.getByText(/tiempo promedio/i).locator('..')

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

    // Status bar
    this.statusBar = page.getByRole('contentinfo')
    this.conexionStatus = page.getByText(/conectado|connected/i)
    this.sincronizacionStatus = page.getByText(/sincronización|sync/i)
  }

  /**
   * Navegar al dashboard
   */
  async goto() {
    await this.page.goto('/dashboard')
  }

  /**
   * Verificar que el dashboard es visible
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
   */
  async verifyStatsCardsVisible() {
    await expect(this.totalProcesadoCard).toBeVisible({ timeout: 5000 })
    await expect(this.completadosCard).toBeVisible({ timeout: 5000 })
    await expect(this.confianzaPromedioCard).toBeVisible({ timeout: 5000 })
    await expect(this.tiempoPromedioCard).toBeVisible({ timeout: 5000 })
  }

  /**
   * Obtener valores de las estadísticas
   */
  async getStatsValues() {
    return {
      totalProcesado: await this.totalProcesadoCard.textContent(),
      completados: await this.completadosCard.textContent(),
      confianzaPromedio: await this.confianzaPromedioCard.textContent(),
      tiempoPromedio: await this.tiempoPromedioCard.textContent(),
    }
  }

  /**
   * Verificar panel de rendimiento
   */
  async verifyRendimientoPanel() {
    await expect(this.rendimientoPanel).toBeVisible({ timeout: 5000 })
  }

  /**
   * Verificar estatus fiscal
   */
  async verifyEstatusFiscal() {
    await expect(this.estatusFiscalPanel).toBeVisible({ timeout: 5000 })
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
   * Verificar status bar
   */
  async verifyStatusBar() {
    await expect(this.statusBar).toBeVisible({ timeout: 3000 })
    await expect(this.conexionStatus).toBeVisible({ timeout: 3000 })
  }

  /**
   * Verificar datos del dashboard después de login
   */
  async verifyDashboardData() {
    // Verificar heading principal
    await expect(this.heading).toBeVisible({ timeout: 5000 })
    
    // Verificar cards de estadísticas
    await this.verifyStatsCardsVisible()
    
    // Verificar panel de rendimiento
    await this.verifyRendimientoPanel()
    
    // Verificar status bar
    await this.verifyStatusBar()
  }

  /**
   * Verificar documentos recientes (si existen)
   */
  async verifyDocumentosRecientes() {
    // Buscar indicadores de documentos en el dashboard
    const documentosSection = this.page.getByText(/documentos|recent|últimos/i)
    await expect(documentosSection).toBeVisible({ timeout: 5000 })
  }
}
