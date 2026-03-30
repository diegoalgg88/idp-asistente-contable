/**
 * Tests E2E para Chat Conversacional
 *
 * Valida la funcionalidad completa del chat con el asistente AI,
 * incluyendo envío de mensajes, streaming, historial y gestión de conversaciones.
 *
 * @module tests/e2e/specs/chat/conversation
 */

import { test, expect } from '../../fixtures/test-fixtures'
import { ChatPage } from '../../page-objects/ChatPage'

test.describe('Chat Conversacional', () => {
  let chatPage: ChatPage

  test.beforeEach(async ({ authenticatedPage }) => {
    chatPage = authenticatedPage.chatPage
    
    // Abrir el chat si no está visible
    await chatPage.open()
    await expect(chatPage.chatPane).toBeVisible({ timeout: 10000 })
  })

  test.afterEach(async ({ page }) => {
    // Limpiar conversaciones creadas durante el test
  })

  test.describe('Envío y Recepción de Mensajes', () => {
    test('1. Enviar mensaje y recibir respuesta', async ({ page }) => {
      test.info().annotations.push({
        type: 'feature',
        description: 'Validar envío de mensaje y recepción de respuesta del asistente',
      })

      // Arrange: Verificar estado inicial del chat
      await expect(chatPage.emptyState).toBeVisible({ timeout: 5000 })

      // Act: Enviar mensaje
      const testMessage = '¿Qué es un CFDI?'
      await chatPage.sendMessage(testMessage)

      // Assert: Verificar que el mensaje del usuario aparece
      const userMessage = page.locator('[data-testid="user-message"]').last()
      await expect(userMessage).toBeVisible({ timeout: 5000 })
      await expect(userMessage).toContainText(testMessage)

      // Assert: Esperar y verificar respuesta del asistente
      await chatPage.waitForResponse(30000)
      
      const assistantMessage = await chatPage.getLastAssistantMessage()
      expect(assistantMessage).toBeTruthy()
      expect(assistantMessage.length).toBeGreaterThan(0)
    })

    test('2. Streaming de respuesta (token por token)', async ({ page }) => {
      test.info().annotations.push({
        type: 'feature',
        description: 'Validar streaming de respuesta del asistente',
      })

      // Act: Enviar mensaje
      await chatPage.sendMessage('¿Cuáles son los requisitos del SAT para 2026?')

      // Assert: Verificar indicador de carga
      await expect(chatPage.loadingIndicator).toBeVisible({ timeout: 5000 })

      // Assert: Verificar streaming
      await chatPage.verifyStreamingResponse(30000)

      // Assert: Verificar que la respuesta completa aparece
      const assistantMessage = await chatPage.getLastAssistantMessage()
      expect(assistantMessage).toBeTruthy()
      
      // Verificar que no hay indicador de carga después de completar
      await expect(chatPage.loadingIndicator).not.toBeVisible({ timeout: 5000 })
    })
  })

  test.describe('Historial y Persistencia', () => {
    test('3. Historial de chat persiste después de refresh', async ({ page }) => {
      test.info().annotations.push({
        type: 'feature',
        description: 'Validar persistencia del historial de chat después de recargar',
      })

      // Arrange: Enviar mensaje
      const testMessage = 'Mensaje de prueba para persistencia'
      await chatPage.sendMessage(testMessage)
      await chatPage.waitForResponse(30000)

      // Act: Recargar página
      await page.reload()

      // Esperar a que cargue la aplicación
      await expect(chatPage.chatPane).toBeVisible({ timeout: 10000 })

      // Assert: Verificar que los mensajes persisten
      const messages = await chatPage.getAllMessages()
      expect(messages.length).toBeGreaterThan(0)
      
      // Verificar que el mensaje enviado está en el historial
      const userMessages = messages.filter(m => m.role === 'user')
      expect(userMessages.some(m => m.content.includes(testMessage))).toBeTruthy()
    })

    test('4. Crear nueva conversación', async ({ page }) => {
      test.info().annotations.push({
        type: 'feature',
        description: 'Validar creación de nueva conversación',
      })

      // Arrange: Tener una conversación existente
      await chatPage.sendMessage('Primera conversación')
      await chatPage.waitForResponse(30000)

      const initialCount = await chatPage.getConversationCount()

      // Act: Crear nueva conversación
      await chatPage.newConversation()

      // Assert: Verificar que el chat está vacío
      await expect(chatPage.emptyState).toBeVisible({ timeout: 5000 })

      // Assert: Verificar que aumentó el contador de conversaciones
      await expect(async () => {
        const currentCount = await chatPage.getConversationCount()
        expect(currentCount).toBeGreaterThan(initialCount)
      }).toPass({ timeout: 5000 })
    })
  })

  test.describe('Gestión de Conversaciones', () => {
    test('5. Cambiar entre conversaciones', async ({ page }) => {
      test.info().annotations.push({
        type: 'feature',
        description: 'Validar cambio entre conversaciones del historial',
      })

      // Arrange: Crear dos conversaciones
      await chatPage.sendMessage('Conversación 1')
      await chatPage.waitForResponse(30000)
      
      await chatPage.newConversation()
      
      await chatPage.sendMessage('Conversación 2')
      await chatPage.waitForResponse(30000)

      // Verificar que hay 2 conversaciones
      const count = await chatPage.getConversationCount()
      expect(count).toBeGreaterThanOrEqual(2)

      // Act: Cambiar a la primera conversación
      await chatPage.selectConversation(0)

      // Assert: Verificar que se muestra la primera conversación
      const messages = await chatPage.getAllMessages()
      const userMessages = messages.filter(m => m.role === 'user')
      expect(userMessages.some(m => m.content.includes('Conversación 1'))).toBeTruthy()
    })

    test('6. Eliminar conversación', async ({ page }) => {
      test.info().annotations.push({
        type: 'feature',
        description: 'Validar eliminación de conversación',
      })

      // Arrange: Crear conversación
      await chatPage.sendMessage('Conversación para eliminar')
      await chatPage.waitForResponse(30000)

      const initialCount = await chatPage.getConversationCount()
      expect(initialCount).toBeGreaterThan(0)

      // Act: Eliminar conversación
      await chatPage.deleteConversation(0)

      // Confirmar eliminación si hay diálogo
      const confirmButton = page.getByRole('button', { name: /confirmar|sí|yes|eliminar|delete/i })
      if (await confirmButton.isVisible().catch(() => false)) {
        await confirmButton.click()
      }

      // Assert: Verificar que la conversación fue eliminada
      await expect(async () => {
        const currentCount = await chatPage.getConversationCount()
        expect(currentCount).toBeLessThan(initialCount)
      }).toPass({ timeout: 5000 })
    })
  })

  test.describe('Manejo de Errores', () => {
    test('7. Manejo de error de red (reintentar)', async ({ page }) => {
      test.info().annotations.push({
        type: 'resilience',
        description: 'Validar manejo de error de red y funcionalidad de re-intento',
      })

      // Arrange: Configurar mock para fallar
      let attemptCount = 0
      
      await page.route('**/api/v1/chat/messages', async route => {
        attemptCount++
        
        if (attemptCount === 1) {
          // Primer intento falla con error de red
          await route.abort('connectionfailed')
        } else {
          // Segundo intento tiene éxito
          await route.fulfill({
            status: 200,
            json: {
              message: {
                id: 'msg-123',
                role: 'assistant',
                content: 'Respuesta después del re-intento',
              },
            },
          })
        }
      })

      // Act: Enviar mensaje (fallará)
      await chatPage.sendMessage('Mensaje de prueba')

      // Assert: Verificar mensaje de error
      const errorMessage = page.getByText(/error de conexión|network error|reintentar|retry/i)
      await expect(errorMessage).toBeVisible({ timeout: 10000 })

      // Act: Click en reintentar
      const retryButton = page.getByRole('button', { name: /reintentar|retry/i })
      if (await retryButton.isVisible().catch(() => false)) {
        await retryButton.click()
      }

      // Assert: Verificar que el segundo intento tuvo éxito
      await chatPage.waitForResponse(30000)
      const assistantMessage = await chatPage.getLastAssistantMessage()
      expect(assistantMessage).toContain('Respuesta después del re-intento')
    })

    test('8. Mensaje de error cuando backend no responde', async ({ page }) => {
      test.info().annotations.push({
        type: 'error-handling',
        description: 'Validar mensaje de error cuando el backend no responde',
      })

      // Arrange: Configurar mock para error 500
      await page.route('**/api/v1/chat/messages', async route => {
        await route.fulfill({
          status: 500,
          json: {
            error: 'Internal server error',
            message: 'El servicio no está disponible temporalmente',
          },
        })
      })

      // Act: Enviar mensaje
      await chatPage.sendMessage('Mensaje que fallará')

      // Assert: Esperar mensaje de error
      const errorMessage = page.getByText(/error|no está disponible|unavailable|server error/i)
      await expect(errorMessage).toBeVisible({ timeout: 10000 })

      // Assert: Verificar que el input está habilitado para re-intento
      await expect(chatPage.chatInput).toBeEnabled()
    })
  })
})
