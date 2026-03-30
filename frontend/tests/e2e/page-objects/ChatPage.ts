/**
 * ChatPage Object
 *
 * Page Object para el Chat/Asistente AI del IDP Asistente Contable.
 * Contiene selectores y métodos para interactuar con el chat.
 *
 * @module tests/e2e/page-objects/ChatPage
 */

import { Page, Locator, expect } from '@playwright/test'

export class ChatPage {
  readonly page: Page

  // Elementos principales del chat con data-testid
  readonly chatPane: Locator
  readonly chatInput: Locator
  readonly sendButton: Locator
  readonly messagesList: Locator
  readonly conversationList: Locator

  // Mensajes
  readonly userMessages: Locator
  readonly assistantMessages: Locator
  readonly lastMessage: Locator

  // Estados del chat
  readonly emptyState: Locator
  readonly loadingIndicator: Locator
  readonly typingIndicator: Locator

  // Botones de acción
  readonly newConversationButton: Locator
  readonly deleteConversationButton: Locator
  readonly clearChatButton: Locator
  readonly toggleChatButton: Locator
  readonly closeChatButton: Locator

  // Sugerencias y mensajes rápidos
  readonly quickSuggestions: Locator
  readonly suggestionButtons: Locator

  // Historial de conversaciones
  readonly conversationHistory: Locator
  readonly conversationItems: Locator

  // Modelo y configuración
  readonly modelSelector: Locator
  readonly modelOptions: Locator

  // Citas y referencias
  readonly citations: Locator
  readonly citationBadges: Locator

  constructor(page: Page) {
    this.page = page

    // Elementos principales con data-testid
    this.chatPane = page.getByTestId('chat-pane')
    this.chatInput = page.getByTestId('chat-input')
    this.sendButton = page.getByTestId('send-message')
    this.messagesList = page.getByTestId('messages-list')
    this.conversationList = page.getByTestId('conversation-list')

    // Mensajes
    this.userMessages = page.locator('[data-testid="user-message"]')
    this.assistantMessages = page.locator('[data-testid="assistant-message"]')
    this.lastMessage = page.locator('[data-testid="message"]').last()

    // Estados del chat
    this.emptyState = page.getByText(/inicia una conversación|start a conversation/i)
    this.loadingIndicator = page.getByTestId('loading-indicator')
    this.typingIndicator = page.getByText(/escribiendo|typing/i)

    // Botones de acción
    this.newConversationButton = page.getByRole('button', { name: /nueva conversación|new conversation/i })
    this.deleteConversationButton = page.getByRole('button', { name: /eliminar|delete/i })
    this.clearChatButton = page.getByRole('button', { name: /limpiar|clear/i })
    this.toggleChatButton = page.getByRole('button', { name: /chat|agente|asistente/i }).first()
    this.closeChatButton = page.getByRole('button', { name: /cerrar|close/i }).or(page.getByLabel(/close/i))

    // Sugerencias
    this.quickSuggestions = page.getByText(/sugerencias|suggestions/i)
    this.suggestionButtons = page.getByRole('button', { name: /qué es|cómo|cuándo/i })

    // Historial
    this.conversationHistory = page.getByTestId('conversation-history')
    this.conversationItems = page.locator('[data-testid="conversation-item"]')

    // Modelo
    this.modelSelector = page.getByRole('button', { name: /modelo|model|gemini|claude/i })
    this.modelOptions = page.getByRole('menu')

    // Citas
    this.citations = page.locator('[data-testid="citation"]')
    this.citationBadges = page.locator('span').filter({ hasText: /^\[\d+\]$/ })
  }

  /**
   * Abrir el chat
   */
  async open() {
    const isVisible = await this.chatPane.isVisible().catch(() => false)
    if (!isVisible) {
      await this.toggleChatButton.click()
      await this.chatPane.waitFor({ state: 'visible', timeout: 5000 })
    }
  }

  /**
   * Cerrar el chat
   */
  async close() {
    const isVisible = await this.chatPane.isVisible().catch(() => false)
    if (isVisible) {
      await this.closeChatButton.click()
      await this.chatPane.waitFor({ state: 'hidden', timeout: 5000 })
    }
  }

  /**
   * Enviar un mensaje
   *
   * @param message - Mensaje a enviar
   */
  async sendMessage(message: string) {
    await this.chatInput.fill(message)
    await this.sendButton.click()
  }

  /**
   * Enviar mensaje y esperar respuesta
   *
   * @param message - Mensaje a enviar
   * @param timeout - Timeout en ms
   */
  async sendMessageAndWaitForResponse(message: string, timeout = 30000) {
    await this.sendMessage(message)

    // Esperar indicador de carga
    const isLoadingVisible = await this.loadingIndicator.isVisible().catch(() => false)
    if (isLoadingVisible) {
      await this.loadingIndicator.waitFor({ state: 'hidden', timeout })
    }

    // Esperar respuesta del asistente
    await this.assistantMessages.last().waitFor({ state: 'visible', timeout })
  }

  /**
   * Verificar que hay mensajes en el chat
   *
   * @param timeout - Timeout en ms
   */
  async hasMessages(timeout = 5000): Promise<boolean> {
    const count = await this.assistantMessages.count()
    return count > 0
  }

  /**
   * Verificar que el chat está vacío
   *
   * @param timeout - Timeout en ms
   */
  async isEmpty(timeout = 5000): Promise<boolean> {
    return await this.emptyState.isVisible({ timeout })
  }

  /**
   * Obtener el último mensaje del asistente
   *
   * @returns Contenido del mensaje
   */
  async getLastAssistantMessage(): Promise<string> {
    const message = this.assistantMessages.last()
    return await message.textContent() || ''
  }

  /**
   * Obtener todos los mensajes del chat
   *
   * @returns Array de mensajes con rol y contenido
   */
  async getAllMessages(): Promise<Array<{ role: 'user' | 'assistant'; content: string }>> {
    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = []

    const userMsgs = await this.userMessages.allTextContents()
    const assistantMsgs = await this.assistantMessages.allTextContents()

    // Nota: Esto asume que los mensajes están en orden
    // En una implementación real, se debería obtener el orden del DOM
    for (const content of userMsgs) {
      messages.push({ role: 'user', content })
    }
    for (const content of assistantMsgs) {
      messages.push({ role: 'assistant', content })
    }

    return messages
  }

  /**
   * Esperar respuesta del asistente
   *
   * @param timeout - Timeout en ms
   */
  async waitForResponse(timeout = 30000) {
    // Esperar que el indicador de carga desaparezca
    const isLoadingVisible = await this.loadingIndicator.isVisible().catch(() => false)
    if (isLoadingVisible) {
      await this.loadingIndicator.waitFor({ state: 'hidden', timeout })
    }

    // Esperar mensaje del asistente
    await this.assistantMessages.last().waitFor({ state: 'visible', timeout })
  }

  /**
   * Click en una sugerencia de mensaje rápido
   *
   * @param suggestionText - Texto de la sugerencia
   */
  async clickSuggestion(suggestionText: string) {
    const suggestion = this.page.getByRole('button', { name: new RegExp(suggestionText, 'i') })
    await suggestion.click()
  }

  /**
   * Obtener sugerencias disponibles
   *
   * @returns Array de textos de sugerencias
   */
  async getSuggestions(): Promise<string[]> {
    return await this.suggestionButtons.allTextContents()
  }

  /**
   * Crear nueva conversación
   */
  async newConversation() {
    await this.newConversationButton.click()
  }

  /**
   * Eliminar conversación
   *
   * @param conversationIndex - Índice de la conversación (0-based)
   */
  async deleteConversation(conversationIndex = 0) {
    const conversationItem = this.conversationItems.nth(conversationIndex)
    const deleteButton = conversationItem.getByRole('button', { name: /eliminar|delete/i })
    await deleteButton.click()
  }

  /**
   * Seleccionar conversación del historial
   *
   * @param conversationIndex - Índice de la conversación (0-based)
   */
  async selectConversation(conversationIndex = 0) {
    const conversationItem = this.conversationItems.nth(conversationIndex)
    await conversationItem.click()
  }

  /**
   * Obtener número de conversaciones en el historial
   *
   * @returns Número de conversaciones
   */
  async getConversationCount(): Promise<number> {
    return await this.conversationItems.count()
  }

  /**
   * Seleccionar modelo de AI
   *
   * @param modelName - Nombre del modelo
   */
  async selectModel(modelName: string) {
    await this.modelSelector.click()
    const modelOption = this.page.getByRole('menuitem', { name: new RegExp(modelName, 'i') })
    await modelOption.click()
  }

  /**
   * Verificar que hay citas/referencias en el mensaje
   *
   * @returns true si hay citas
   */
  async hasCitations(): Promise<boolean> {
    const count = await this.citationBadges.count()
    return count > 0
  }

  /**
   * Obtener número de citas en el último mensaje
   *
   * @returns Número de citas
   */
  async getCitationCount(): Promise<number> {
    return await this.citationBadges.count()
  }

  /**
   * Verificar que el chat está cargando
   *
   * @returns true si está cargando
   */
  async isLoading(): Promise<boolean> {
    return await this.loadingIndicator.isVisible().catch(() => false)
  }

  /**
   * Verificar que el input de chat está habilitado
   *
   * @returns true si está habilitado
   */
  async isInputEnabled(): Promise<boolean> {
    return await this.chatInput.isEnabled()
  }

  /**
   * Limpiar el chat
   */
  async clearChat() {
    await this.clearChatButton.click()
  }

  /**
   * Verificar streaming de respuesta
   *
   * @param timeout - Timeout en ms
   */
  async verifyStreamingResponse(timeout = 10000) {
    // Esperar que comience el streaming
    await this.loadingIndicator.waitFor({ state: 'hidden', timeout })

    // Verificar que hay mensaje del asistente
    await expect(this.assistantMessages.last()).toBeVisible({ timeout })
  }

  /**
   * Obtener respuesta en streaming (contenido parcial)
   *
   * @param timeout - Timeout en ms
   * @returns Contenido parcial de la respuesta
   */
  async getStreamingResponse(timeout = 10000): Promise<string> {
    // Esperar que el streaming comience
    await this.loadingIndicator.waitFor({ state: 'hidden', timeout })
    
    // Obtener contenido parcial del mensaje
    const message = this.assistantMessages.last()
    return await message.textContent() || ''
  }

  /**
   * Cambiar entre conversaciones
   *
   * @param index - Índice de la conversación (0-based)
   */
  async switchConversation(index: number) {
    const conversationItem = this.conversationItems.nth(index)
    await conversationItem.click()
    
    // Esperar que la conversación cargue
    await expect(this.messagesList).toBeVisible({ timeout: 5000 })
  }
}
