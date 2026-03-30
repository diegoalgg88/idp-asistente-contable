/**
 * DocumentsPage Object
 *
 * Page Object para la página de Documentos del IDP Asistente Contable.
 * Contiene selectores y métodos para interactuar con la gestión de documentos.
 *
 * @module tests/e2e/page-objects/DocumentsPage
 */

import { Page, Locator, expect } from '@playwright/test'

export class DocumentsPage {
  readonly page: Page

  // Elementos principales con data-testid
  readonly documentsPane: Locator
  readonly uploadButton: Locator
  readonly fileInput: Locator
  readonly documentList: Locator
  readonly documentTable: Locator

  // Filtros y búsqueda
  readonly searchInput: Locator
  readonly filterDropdown: Locator
  readonly typeFilter: Locator
  readonly statusFilter: Locator
  readonly dateFilter: Locator

  // Tabs de documentos
  readonly todosTab: Locator
  readonly emitidasTab: Locator
  readonly recibidasTab: Locator
  readonly nominasTab: Locator

  // Elementos de documento individual
  readonly documentRow: Locator
  readonly documentName: Locator
  readonly documentStatus: Locator
  readonly documentDate: Locator
  readonly documentAmount: Locator
  readonly documentActions: Locator

  // Estados de documentos
  readonly emptyState: Locator
  readonly loadingState: Locator
  readonly errorState: Locator

  // Botones de acción
  readonly deleteButton: Locator
  readonly viewButton: Locator
  readonly downloadButton: Locator
  readonly exportButton: Locator
  readonly refreshButton: Locator

  // Upload drag & drop zone
  readonly dropZone: Locator
  readonly uploadProgress: Locator

  // Detalles de documento
  readonly documentDetails: Locator
  readonly documentPreview: Locator
  readonly extractedData: Locator
  readonly confidenceScore: Locator
  readonly workflowPanel: Locator

  constructor(page: Page) {
    this.page = page

    // Elementos principales con data-testid
    this.documentsPane = page.getByTestId('documents-pane')
    this.uploadButton = page.getByTestId('upload-button')
    this.fileInput = page.getByTestId('file-input')
    this.documentList = page.getByTestId('document-list')
    this.documentTable = page.getByTestId('document-table')

    // Filtros y búsqueda
    this.searchInput = page.getByPlaceholder(/buscar documentos|search documents/i)
    this.filterDropdown = page.getByRole('button', { name: /filtrar|filter/i })
    this.typeFilter = page.getByRole('menuitem', { name: /tipo|type/i })
    this.statusFilter = page.getByRole('menuitem', { name: /estatus|status/i })
    this.dateFilter = page.getByRole('menuitem', { name: /fecha|date/i })

    // Tabs de documentos
    this.todosTab = page.getByRole('tab', { name: /todos|all/i })
    this.emitidasTab = page.getByRole('tab', { name: /emitidas|issued/i })
    this.recibidasTab = page.getByRole('tab', { name: /recibidas|received/i })
    this.nominasTab = page.getByRole('tab', { name: /nóminas|payroll/i })

    // Elementos de documento individual
    this.documentRow = page.locator('[data-testid="document-row"]')
    this.documentName = page.locator('[data-testid="document-name"]')
    this.documentStatus = page.locator('[data-testid="document-status"]')
    this.documentDate = page.locator('[data-testid="document-date"]')
    this.documentAmount = page.locator('[data-testid="document-amount"]')
    this.documentActions = page.locator('[data-testid="document-actions"]')

    // Estados
    this.emptyState = page.getByText(/no hay documentos|no documents|sin documentos/i)
    this.loadingState = page.getByTestId('loading-state')
    this.errorState = page.getByText(/error al cargar|error loading/i)

    // Botones de acción
    this.deleteButton = page.getByRole('button', { name: /eliminar|delete/i })
    this.viewButton = page.getByRole('button', { name: /ver|view/i })
    this.downloadButton = page.getByRole('button', { name: /descargar|download/i })
    this.exportButton = page.getByRole('button', { name: /exportar|export/i })
    this.refreshButton = page.getByRole('button', { name: /actualizar|refresh/i })

    // Upload
    this.dropZone = page.getByTestId('drop-zone')
    this.uploadProgress = page.getByTestId('upload-progress')

    // Detalles
    this.documentDetails = page.getByTestId('document-details')
    this.documentPreview = page.getByTestId('document-preview')
    this.extractedData = page.getByTestId('extracted-data')
    this.confidenceScore = page.getByTestId('confidence-score')
    this.workflowPanel = page.getByTestId('workflow-panel')
  }

  /**
   * Navegar a la página de documentos
   */
  async goto() {
    await this.page.goto('/documents')
  }

  /**
   * Verificar que la página de documentos es visible
   *
   * @param timeout - Timeout en ms
   */
  async isVisible(timeout = 5000): Promise<boolean> {
    try {
      await this.documentsPane.waitFor({ state: 'visible', timeout })
      return true
    } catch {
      return false
    }
  }

  /**
   * Subir un documento
   *
   * @param filePath - Ruta del archivo a subir
   * @param timeout - Timeout en ms
   */
  async uploadDocument(filePath: string, timeout = 60000) {
    // Click en upload button
    await this.uploadButton.click()

    // Esperar input de archivo
    const fileInput = this.page.locator('input[type="file"]').first()
    await fileInput.waitFor({ state: 'visible', timeout: 5000 })

    // Subir archivo
    await fileInput.setInputFiles(filePath)

    // Esperar que el upload comience
    if (await this.uploadProgress.isVisible().catch(() => false)) {
      await this.uploadProgress.waitFor({ state: 'hidden', timeout })
    }
  }

  /**
   * Subir múltiples documentos simultáneamente
   *
   * @param filePaths - Array de rutas de archivos a subir
   * @param timeout - Timeout en ms
   */
  async uploadMultipleDocuments(filePaths: string[], timeout = 120000) {
    // Click en upload button
    await this.uploadButton.click()

    // Esperar input de archivo
    const fileInput = this.page.locator('input[type="file"]').first()
    await fileInput.waitFor({ state: 'visible', timeout: 5000 })

    // Subir múltiples archivos
    await fileInput.setInputFiles(filePaths)

    // Esperar que todos los uploads completen
    if (await this.uploadProgress.isVisible().catch(() => false)) {
      await this.uploadProgress.waitFor({ state: 'hidden', timeout })
    }

    // Esperar a que los documentos aparezcan en la lista
    await expect(async () => {
      const count = await this.getDocumentCount()
      expect(count).toBeGreaterThanOrEqual(filePaths.length)
    }).toPass({ timeout })
  }

  /**
   * Subir documento usando drag & drop
   *
   * @param filePath - Ruta del archivo
   */
  async uploadDocumentDragDrop(filePath: string) {
    const dropZone = await this.dropZone.isVisible().catch(() => false)

    if (dropZone) {
      // Simular drag & drop
      await this.dropZone.setInputFiles(filePath)
    } else {
      // Fallback: upload normal
      await this.uploadDocument(filePath)
    }
  }

  /**
   * Verificar que hay documentos en la lista
   *
   * @param timeout - Timeout en ms
   * @returns true si hay documentos
   */
  async hasDocuments(timeout = 5000): Promise<boolean> {
    const count = await this.documentRow.count()
    return count > 0
  }

  /**
   * Obtener número de documentos
   *
   * @returns Número de documentos
   */
  async getDocumentCount(): Promise<number> {
    return await this.documentRow.count()
  }

  /**
   * Buscar documento por nombre
   *
   * @param fileName - Nombre del archivo
   * @returns Locator del documento
   */
  async findDocumentByName(fileName: string): Promise<Locator> {
    return this.page.locator(`[data-testid="document-name"]:has-text("${fileName}")`)
  }

  /**
   * Filtrar documentos por tipo
   *
   * @param type - Tipo de documento (todos, emitidas, recibidas, nominas)
   */
  async filterByType(type: string) {
    if (type === 'emitidas') {
      await this.emitidasTab.click()
    } else if (type === 'recibidas') {
      await this.recibidasTab.click()
    } else if (type === 'nominas') {
      await this.nominasTab.click()
    } else {
      await this.todosTab.click()
    }
  }

  /**
   * Filtrar documentos por estado
   *
   * @param status - Estado (pending, processing, completed, error)
   */
  async filterByStatus(status: string) {
    await this.statusFilter.click()
    const statusOption = this.page.getByRole('menuitem', { name: new RegExp(status, 'i') })
    await statusOption.click()
  }

  /**
   * Buscar documentos
   *
   * @param query - Término de búsqueda
   */
  async searchDocuments(query: string) {
    await this.searchInput.fill(query)
  }

  /**
   * Ver documento
   *
   * @param documentIndex - Índice del documento (0-based)
   */
  async viewDocument(documentIndex = 0) {
    const viewBtn = this.documentRow.nth(documentIndex).locator('[data-testid="view-button"]').or(
      this.documentRow.nth(documentIndex).getByRole('button', { name: /ver|view/i })
    )
    await viewBtn.click()
  }

  /**
   * Eliminar documento
   *
   * @param documentIndex - Índice del documento (0-based)
   */
  async deleteDocument(documentIndex = 0) {
    const deleteBtn = this.documentRow.nth(documentIndex).locator('[data-testid="delete-button"]').or(
      this.documentRow.nth(documentIndex).getByRole('button', { name: /eliminar|delete/i })
    )
    await deleteBtn.click()

    // Confirmar eliminación si hay diálogo
    const confirmButton = this.page.getByRole('button', { name: /confirmar|sí|yes/i })
    if (await confirmButton.isVisible().catch(() => false)) {
      await confirmButton.click()
    }
  }

  /**
   * Descargar documento
   *
   * @param documentIndex - Índice del documento (0-based)
   */
  async downloadDocument(documentIndex = 0) {
    const downloadBtn = this.documentRow.nth(documentIndex).locator('[data-testid="download-button"]').or(
      this.documentRow.nth(documentIndex).getByRole('button', { name: /descargar|download/i })
    )
    await downloadBtn.click()
  }

  /**
   * Verificar estado de documento
   *
   * @param documentIndex - Índice del documento
   * @param expectedStatus - Estado esperado
   * @param timeout - Timeout en ms
   */
  async verifyDocumentStatus(documentIndex: number, expectedStatus: string, timeout = 5000) {
    const statusElement = this.documentRow.nth(documentIndex).locator('[data-testid="document-status"]').or(
      this.documentRow.nth(documentIndex).getByText(new RegExp(expectedStatus, 'i'))
    )
    await expect(statusElement).toBeVisible({ timeout })
  }

  /**
   * Esperar a que un documento esté procesado
   *
   * @param documentIndex - Índice del documento
   * @param timeout - Timeout en ms
   */
  async waitForDocumentProcessing(documentIndex = 0, timeout = 120000) {
    const statusElement = this.documentRow.nth(documentIndex).locator('[data-testid="document-status"]')

    // Esperar que el estado cambie de processing a completed
    await expect(statusElement).not.toContainText(/processing|procesando/i, { timeout })
    await expect(statusElement).toContainText(/completed|completado/i, { timeout })
  }

  /**
   * Verificar datos extraídos de un documento
   *
   * @param documentIndex - Índice del documento
   * @param expectedData - Datos esperados
   */
  async verifyExtractedData(documentIndex: number, expectedData: Record<string, string>) {
    await this.viewDocument(documentIndex)

    // Esperar panel de detalles
    await this.documentDetails.waitFor({ state: 'visible', timeout: 5000 })

    // Verificar datos extraídos
    for (const [key, value] of Object.entries(expectedData)) {
      const dataElement = this.page.getByTestId(`extracted-${key}`)
      await expect(dataElement).toContainText(value)
    }
  }

  /**
   * Verificar score de confianza
   *
   * @param documentIndex - Índice del documento
   * @param minScore - Score mínimo esperado
   */
  async verifyConfidenceScore(documentIndex: number, minScore: number) {
    const scoreElement = this.documentRow.nth(documentIndex).locator('[data-testid="confidence-score"]')
    const scoreText = await scoreElement.textContent()
    const score = parseFloat(scoreText || '0')
    expect(score).toBeGreaterThanOrEqual(minScore)
  }

  /**
   * Exportar documentos
   */
  async exportDocuments() {
    await this.exportButton.click()
  }

  /**
   * Actualizar lista de documentos
   */
  async refreshDocuments() {
    await this.refreshButton.click()
  }

  /**
   * Verificar estado vacío
   *
   * @param timeout - Timeout en ms
   */
  async isEmptyState(timeout = 5000): Promise<boolean> {
    return await this.emptyState.isVisible({ timeout })
  }

  /**
   * Verificar que hay error al cargar
   *
   * @param timeout - Timeout en ms
   */
  async hasError(timeout = 5000): Promise<boolean> {
    return await this.errorState.isVisible({ timeout })
  }

  /**
   * Verificar progreso de upload
   *
   * @param timeout - Timeout en ms
   */
  async verifyUploadProgress(timeout = 30000) {
    await this.uploadProgress.waitFor({ state: 'visible', timeout })
    await this.uploadProgress.waitFor({ state: 'hidden', timeout })
  }

  /**
   * Obtener documentos con estado específico
   *
   * @param status - Estado a filtrar
   * @returns Número de documentos con ese estado
   */
  async getDocumentsByStatus(status: string): Promise<number> {
    const statusElements = this.page.locator(`[data-testid="document-status"]:has-text("${status}")`)
    return await statusElements.count()
  }

  /**
   * Esperar a que un documento esté procesado
   *
   * @param documentId - ID del documento
   * @param timeout - Timeout en ms
   */
  async waitForProcessing(documentId: string, timeout = 120000) {
    const statusElement = this.page.locator(`[data-testid="document-status"][data-document-id="${documentId}"]`)
    
    // Esperar que el estado cambie de processing a completed
    await expect(statusElement).not.toContainText(/processing|procesando/i, { timeout })
    await expect(statusElement).toContainText(/completed|completado/i, { timeout })
  }

  /**
   * Eliminar documento por ID
   *
   * @param documentId - ID del documento a eliminar
   */
  async deleteDocumentById(documentId: string) {
    const deleteBtn = this.page.locator(`[data-testid="delete-button"][data-document-id="${documentId}"]`)
    await deleteBtn.click()

    // Confirmar eliminación si hay diálogo
    const confirmButton = this.page.getByRole('button', { name: /confirmar|sí|yes/i })
    if (await confirmButton.isVisible().catch(() => false)) {
      await confirmButton.click()
    }
  }

  /**
   * Obtener estado de un documento
   *
   * @param documentId - ID del documento
   * @returns Estado del documento
   */
  async getDocumentStatus(documentId: string): Promise<string> {
    const statusElement = this.page.locator(`[data-testid="document-status"][data-document-id="${documentId}"]`)
    return await statusElement.textContent() || ''
  }
}
