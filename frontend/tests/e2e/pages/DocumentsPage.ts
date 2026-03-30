/**
 * DocumentsPage Object
 * 
 * Page Object para la página de Documentos del IDP Asistente Contable.
 * Contiene selectores y métodos para upload, visualización y gestión de documentos.
 */

import { Page, Locator, expect } from '@playwright/test'

export class DocumentsPage {
  readonly page: Page

  // Encabezados
  readonly heading: Locator
  readonly subheading: Locator

  // Upload area
  readonly uploadArea: Locator
  readonly fileInput: Locator
  readonly uploadButton: Locator
  readonly selectedFileContainer: Locator
  readonly uploadProgress: Locator

  // Tabla de documentos
  readonly documentsTable: Locator
  readonly documentsList: Locator
  readonly documentRows: Locator
  readonly emptyState: Locator

  // Filtros y búsqueda
  readonly searchInput: Locator
  readonly exportButton: Locator
  readonly nuevaSincroniaButton: Locator

  // Vistas laterales (sidebar views)
  readonly todosViewButton: Locator
  readonly emitidasViewButton: Locator
  readonly recibidasViewButton: Locator
  readonly nominasViewButton: Locator

  // Acciones por documento
  readonly viewButton: Locator
  readonly deleteButton: Locator

  // Vista de detalle de documento
  readonly documentDetailPanel: Locator
  readonly pdfViewer: Locator
  readonly analysisTab: Locator
  readonly workflowTab: Locator
  readonly confidenceScore: Locator
  readonly extractedDataJson: Locator

  // Estados de documento
  readonly statusBadge: Locator
  readonly pendingStatus: Locator
  readonly processingStatus: Locator
  readonly completedStatus: Locator
  readonly errorStatus: Locator

  constructor(page: Page) {
    this.page = page

    // Encabezados (basado en Documents.tsx)
    this.heading = page.getByRole('heading', { name: /explorador|documentos|emitidas|recibidas|nóminas/i })
    this.subheading = page.getByText(/repositorio maestro|idp core/i)

    // Upload area
    this.uploadArea = page.getByText(/soltar cfdi|explorar|drop|upload/i).first()
    this.fileInput = page.locator('input[type="file"]')
    this.uploadButton = page.getByRole('button', { name: /subir|upload/i })
    this.selectedFileContainer = page.getByText(/ready_for_upload|selected/i)
    this.uploadProgress = page.getByRole('progressbar')

    // Tabla de documentos
    this.documentsTable = page.getByRole('table')
    this.documentsList = page.locator('tbody')
    this.documentRows = page.locator('tbody tr')
    this.emptyState = page.getByText(/no se encontraron documentos|no documents/i)

    // Filtros y búsqueda
    this.searchInput = page.getByPlaceholder(/buscar|search/i)
    this.exportButton = page.getByRole('button', { name: /exportar|export|xls/i })
    this.nuevaSincroniaButton = page.getByRole('button', { name: /nueva sincronía|nueva sincronizacion/i })

    // Vistas laterales
    this.todosViewButton = page.getByRole('button', { name: /todos/i })
    this.emitidasViewButton = page.getByRole('button', { name: /emitidas/i })
    this.recibidasViewButton = page.getByRole('button', { name: /recibidas/i })
    this.nominasViewButton = page.getByRole('button', { name: /nóminas|nominas/i })

    // Acciones por documento
    this.viewButton = page.getByRole('button', { name: /view|ver|eye/i })
    this.deleteButton = page.getByRole('button', { name: /delete|eliminar|trash/i })

    // Vista de detalle
    this.documentDetailPanel = page.getByRole('region', { name: /análisis|analysis|documento/i })
    this.pdfViewer = page.getByText(/visor de pdf|previsualización/i)
    this.analysisTab = page.getByRole('tab', { name: /análisis|analysis/i })
    this.workflowTab = page.getByRole('tab', { name: /workflow/i })
    this.confidenceScore = page.getByText(/confianza|confidence|score/i)
    this.extractedDataJson = page.locator('pre').filter({ hasText: /document|issuer|recipient|total/i })

    // Estados de documento
    this.statusBadge = page.locator('[class*="status"], [class*="badge"]').filter({ hasText: /pendiente|procesando|completado|error/i })
    this.pendingStatus = page.getByText(/pendiente|pending/i)
    this.processingStatus = page.getByText(/procesando|processing/i)
    this.completedStatus = page.getByText(/completado|completed/i)
    this.errorStatus = page.getByText(/error/i)
  }

  /**
   * Navegar a la página de documentos
   */
  async goto() {
    await this.page.goto('/documents')
  }

  /**
   * Verificar que la página de documentos es visible
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
   * Subir un documento
   */
  async uploadDocument(filePath: string) {
    // Click en el upload area para abrir file picker
    await this.uploadArea.click()
    
    // Seleccionar archivo
    await this.fileInput.setInputFiles(filePath)
    
    // Esperar que el archivo esté seleccionado
    await this.selectedFileContainer.waitFor({ state: 'visible', timeout: 5000 })
    
    // Click en upload
    await this.uploadButton.click()
  }

  /**
   * Subir documento y esperar procesamiento
   */
  async uploadDocumentAndWait(filePath: string, timeout = 60000) {
    await this.uploadDocument(filePath)
    
    // Esperar progreso de upload
    await this.uploadProgress.waitFor({ state: 'visible', timeout: 10000 })
    
    // Esperar que el progreso desaparezca (upload completado)
    await this.uploadProgress.waitFor({ state: 'hidden', timeout })
    
    // Verificar que el documento aparece en la lista
    await expect(this.documentRows.first()).toBeVisible({ timeout })
  }

  /**
   * Verificar estado vacío (sin documentos)
   */
  async verifyEmptyState() {
    await expect(this.emptyState).toBeVisible({ timeout: 5000 })
  }

  /**
   * Verificar que hay documentos en la lista
   */
  async verifyHasDocuments() {
    await expect(this.documentRows.first()).toBeVisible({ timeout: 5000 })
  }

  /**
   * Obtener número de documentos
   */
  async getDocumentsCount(): Promise<number> {
    const rows = await this.documentRows.count()
    return rows
  }

  /**
   * Filtrar por tipo de documento
   */
  async filterByType(type: 'todos' | 'emitidas' | 'recibidas' | 'nominas') {
    switch (type) {
      case 'todos':
        await this.todosViewButton.click()
        break
      case 'emitidas':
        await this.emitidasViewButton.click()
        break
      case 'recibidas':
        await this.recibidasViewButton.click()
        break
      case 'nominas':
        await this.nominasViewButton.click()
        break
    }
  }

  /**
   * Buscar documento por nombre
   */
  async searchDocument(fileName: string) {
    await this.searchInput.fill(fileName)
  }

  /**
   * Ver documento (abrir detalle)
   */
  async viewDocument(index: number = 0) {
    const viewButtons = this.page.getByRole('button', { name: /view|ver|eye/i })
    await viewButtons.nth(index).click()
  }

  /**
   * Ver documento por fila
   */
  async viewDocumentByRow(rowSelector: string) {
    const row = this.page.locator(rowSelector)
    await row.getByRole('button', { name: /view|ver|eye/i }).click()
  }

  /**
   * Eliminar documento
   */
  async deleteDocument(index: number = 0) {
    const deleteButtons = this.page.getByRole('button', { name: /delete|eliminar|trash/i })
    await deleteButtons.nth(index).click()
  }

  /**
   * Eliminar documento por fila
   */
  async deleteDocumentByRow(rowSelector: string) {
    const row = this.page.locator(rowSelector)
    await row.getByRole('button', { name: /delete|eliminar|trash/i }).click()
  }

  /**
   * Verificar vista de detalle de documento
   */
  async verifyDocumentDetail() {
    await expect(this.documentDetailPanel).toBeVisible({ timeout: 5000 })
    await expect(this.pdfViewer).toBeVisible({ timeout: 5000 })
  }

  /**
   * Verificar score de confianza
   */
  async verifyConfidenceScore(expectedMin: number = 0) {
    const scoreText = await this.confidenceScore.textContent()
    const score = parseFloat(scoreText?.replace('%', '') || '0')
    expect(score).toBeGreaterThanOrEqual(expectedMin)
  }

  /**
   * Verificar datos extraídos (JSON)
   */
  async verifyExtractedData() {
    await expect(this.extractedDataJson).toBeVisible({ timeout: 5000 })
  }

  /**
   * Cambiar a tab de análisis
   */
  async switchToAnalysisTab() {
    await this.analysisTab.click()
  }

  /**
   * Cambiar a tab de workflow
   */
  async switchToWorkflowTab() {
    await this.workflowTab.click()
  }

  /**
   * Cerrar vista de detalle
   */
  async closeDocumentDetail() {
    const closeButton = this.page.getByRole('button', { name: /close|cerrar|x/i }).first()
    await closeButton.click()
  }

  /**
   * Exportar documentos
   */
  async exportDocuments() {
    await this.exportButton.click()
  }

  /**
   * Verificar estado de documento en la tabla
   */
  async verifyDocumentStatus(index: number, status: 'pending' | 'processing' | 'completed' | 'error') {
    const row = this.documentRows.nth(index)
    
    switch (status) {
      case 'pending':
        await expect(row.locator('text=pendiente').or(row.locator('text=pending'))).toBeVisible({ timeout: 5000 })
        break
      case 'processing':
        await expect(row.locator('text=procesando').or(row.locator('text=processing'))).toBeVisible({ timeout: 5000 })
        break
      case 'completed':
        await expect(row.locator('text=completado').or(row.locator('text=completed'))).toBeVisible({ timeout: 5000 })
        break
      case 'error':
        await expect(row.locator('text=error')).toBeVisible({ timeout: 5000 })
        break
    }
  }

  /**
   * Verificar documentos recientes visibles
   */
  async verifyDocumentosRecientes() {
    await expect(this.documentsTable).toBeVisible({ timeout: 5000 })
    await expect(this.documentRows.first()).toBeVisible({ timeout: 5000 })
  }
}
