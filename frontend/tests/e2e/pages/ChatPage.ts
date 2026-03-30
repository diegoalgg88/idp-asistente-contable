/**
 * ChatPage Object
 * 
 * Page Object para la interfaz de Chat del IDP Asistente Contable.
 * Contiene selectores y métodos para interactuar con el agente fiscal AI.
 */

import { Page, Locator, expect } from '@playwright/test'

export class ChatPage {
  readonly page: Page

  // Contenedor principal del chat
  readonly chatContainer: Locator
  readonly chatHeader: Locator

  // Input y botón de envío
  readonly messageInput: Locator
  readonly sendButton: Locator

  // Lista de mensajes
  readonly messagesList: Locator
  readonly userMessages: Locator
  readonly assistantMessages: Locator

  // Estado del chat
  readonly emptyState: Locator
  readonly typingIndicator: Locator
  readonly workflowIndicator: Locator

  // Conversaciones
  readonly conversationsDropdown: Locator
  readonly conversationItems: Locator
  readonly deleteConversationButton: Locator

  // Botones de acción
  readonly closeChatButton: Locator
  readonly moreOptionsButton: Locator

  // Sugerencias de mensajes (cuando está vacío)
  readonly suggestionButtons: Locator

  constructor(page: Page) {
    this.page = page

    // Contenedor principal (basado en Chat.tsx)
    this.chatContainer = page.getByRole('region', { name: /chat|agente|asistente/i })
    this.chatHeader = page.getByText(/agente fiscal|ai ready/i)

    // Input y botón de envío
    this.messageInput = page.getByPlaceholder(/mensaje|pregunta|escribe/i)
    this.sendButton = page.getByRole('button', { name: /enviar|send/i }).or(
      page.locator('button').has(page.getByRole('img', { name: /send|enviar/i }))
    )

    // Lista de mensajes
    this.messagesList = page.locator('[role="log"], [data-testid="messages"], .messages-list')
    this.userMessages = page.locator('[data-role="user"], .message-user')
    this.assistantMessages = page.locator('[data-role="assistant"], .message-assistant')

    // Estado del chat
    this.emptyState = page.getByText(/asistente inteligente|pregunta sobre/i)
    this.typingIndicator = page.locator('.typing-indicator, .animate-bounce')
    this.workflowIndicator = page.getByText(/analizando|extrayendo|validando/i)

    // Conversaciones
    this.conversationsDropdown = page.getByRole('button', { name: /more|opciones|conversaciones/i })
    this.conversationItems = page.getByRole('menuitem', { name: /sin título|conversation/i })
    this.deleteConversationButton = page.getByRole('button', { name: /delete|eliminar|trash/i })

    // Botones de acción
    this.closeChatButton = page.getByRole('button', { name: /close|cerrar|x/i }).last()
    this.moreOptionsButton = page.getByRole('button', { name: /more|vertical|options/i })

    // Sugerencias de mensajes
    this.suggestionButtons = page.getByRole('button', { name: /qué es|deducir|analizar/i })
  }

  /**
   * Abrir el chat (si está cerrado)
   */
  async open() {
    // Click en el botón del agente en el activity bar
    const agentButton = this.page.getByRole('button', { name: /agente|asistente|bot/i })
    await agentButton.click()
  }

  /**
   * Cerrar el chat
   */
  async close() {
    await this.closeChatButton.click()
  }

  /**
   * Verificar que el chat es visible
   */
  async isVisible(): Promise<boolean> {
    try {
      await this.chatContainer.or(this.chatHeader).waitFor({ state: 'visible', timeout: 3000 })
      return true
    } catch {
      return false
    }
  }

  /**
   * Enviar un mensaje
   */
  async sendMessage(message: string) {
    // Esperar que el input esté visible
    await this.messageInput.waitFor({ state: 'visible', timeout: 5000 })
    
    // Llenar el input
    await this.messageInput.fill(message)
    
    // Click en enviar
    await this.sendButton.click()
  }

  /**
   * Enviar mensaje y esperar respuesta
   */
  async sendMessageAndWaitForResponse(message: string, timeout = 30000) {
    await this.sendMessage(message)
    
    // Esperar indicador de typing
    await this.typingIndicator.waitFor({ state: 'visible', timeout: 5000 })
    
    // Esperar que el typing desaparezca (respuesta completada)
    await this.typingIndicator.waitFor({ state: 'hidden', timeout })
    
    // Verificar que hay mensaje del asistente
    await expect(this.assistantMessages.first()).toBeVisible({ timeout: 5000 })
  }

  /**
   * Verificar estado vacío del chat
   */
  async verifyEmptyState() {
    await expect(this.emptyState).toBeVisible({ timeout: 5000 })
  }

  /**
   * Verificar sugerencias de mensajes
   */
  async verifySuggestions() {
    await expect(this.suggestionButtons.first()).toBeVisible({ timeout: 3000 })
  }

  /**
   * Verificar que se está procesando un workflow
   */
  async verifyWorkflowProcessing() {
    await expect(this.workflowIndicator).toBeVisible({ timeout: 5000 })
  }

  /**
   * Esperar a que el workflow termine
   */
  async waitForWorkflowComplete(timeout = 10000) {
    await this.workflowIndicator.waitFor({ state: 'hidden', timeout })
  }

  /**
   * Abrir dropdown de conversaciones
   */
  async openConversationsDropdown() {
    await this.conversationsDropdown.click()
  }

  /**
   * Seleccionar una conversación
   */
  async selectConversation(conversationName: string) {
    await this.openConversationsDropdown()
    await this.page.getByRole('menuitem', { name: conversationName }).click()
  }

  /**
   * Eliminar una conversación
   */
  async deleteConversation(conversationName: string) {
    await this.openConversationsDropdown()
    
    // Encontrar el botón de eliminar para la conversación específica
    const conversationItem = this.page.locator('[role="menuitem"]').filter({
      hasText: conversationName
    })
    const deleteButton = conversationItem.getByRole('button', { name: /delete|eliminar|trash/i })
    await deleteButton.click()
  }

  /**
   * Verificar que hay mensajes en el chat
   */
  async verifyHasMessages() {
    await expect(this.messagesList).toBeVisible({ timeout: 3000 })
    await expect(this.assistantMessages.first()).toBeVisible({ timeout: 3000 })
  }

  /**
   * Verificar que el mensaje del usuario está visible
   */
  async verifyUserMessage(message: string) {
    await expect(
      this.page.locator('.message-user').filter({ hasText: message }).or(
        this.page.getByText(message).filter({ visible: true }).first()
      )
    ).toBeVisible({ timeout: 5000 })
  }

  /**
   * Verificar que la respuesta del asistente contiene texto específico
   */
  async verifyAssistantResponseContains(text: string, timeout = 10000) {
    await expect(
      this.assistantMessages.filter({ hasText: text }).or(
        this.page.getByText(text).filter({ visible: true }).last()
      )
    ).toBeVisible({ timeout })
  }

  /**
   * Crear nueva conversación (enviando un mensaje nuevo)
   */
  async createNewConversation(firstMessage: string) {
    await this.sendMessage(firstMessage)
    await this.waitForResponse()
  }

  /**
   * Esperar respuesta del asistente
   */
  async waitForResponse(timeout = 30000) {
    // Esperar typing indicator
    try {
      await this.typingIndicator.waitFor({ state: 'visible', timeout: 5000 })
      await this.typingIndicator.waitFor({ state: 'hidden', timeout })
    } catch {
      // Si no hay typing indicator, esperar directamente el mensaje
      await expect(this.assistantMessages.first()).toBeVisible({ timeout })
    }
  }

  /**
   * Verificar que el chat está funcionando correctamente
   */
  async verifyChatFunctional() {
    // Verificar estado inicial
    await this.verifyEmptyState()
    
    // Verificar sugerencias
    await this.verifySuggestions()
  }
}
