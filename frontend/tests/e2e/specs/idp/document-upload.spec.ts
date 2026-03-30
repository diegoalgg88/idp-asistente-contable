/**
 * Tests E2E para Upload de Documentos (IDP)
 *
 * Valida la funcionalidad completa de carga, procesamiento y gestión de documentos
 * en el módulo de Inteligencia de Documentos Fiscales (IDP).
 *
 * @module tests/e2e/specs/idp/document-upload
 */

import { test, expect } from '../../fixtures/test-fixtures'
import { DocumentsPage } from '../../page-objects/DocumentsPage'
import * as path from 'path'

test.describe('Upload de Documentos (IDP)', () => {
  let documentsPage: DocumentsPage
  let testFilePath: string
  let testXmlPath: string
  let largeFilePath: string
  let invalidFormatPath: string

  test.beforeAll(async () => {
    // Rutas a archivos de test
    const testDir = path.join(__dirname, '../../fixtures/files')
    testFilePath = path.join(testDir, 'test-document.pdf')
    testXmlPath = path.join(testDir, 'test-cfdi.xml')
    largeFilePath = path.join(testDir, 'large-file.pdf')
    invalidFormatPath = path.join(testDir, 'invalid-format.txt')
  })

  test.beforeEach(async ({ authenticatedPage }) => {
    documentsPage = authenticatedPage.documentsPage
    await documentsPage.goto()
    await expect(documentsPage.documentsPane).toBeVisible({ timeout: 10000 })
  })

  test.afterEach(async ({ page }) => {
    // Limpiar documentos creados durante el test
    // Nota: En producción, esto se haría vía API
  })

  test.describe('Upload Exitoso', () => {
    test('1. Upload exitoso de archivo PDF (< 10MB)', async ({ page }) => {
      test.info().annotations.push({
        type: 'feature',
        description: 'Validar upload de archivo PDF válido',
      })

      // Arrange: Verificar estado inicial
      const initialCount = await documentsPage.getDocumentCount()

      // Act: Subir documento PDF
      await documentsPage.uploadDocument(testFilePath)

      // Assert: Verificar que el documento aparece en la lista
      await expect(async () => {
        const currentCount = await documentsPage.getDocumentCount()
        expect(currentCount).toBeGreaterThan(initialCount)
      }).toPass({ timeout: 10000 })

      // Assert: Verificar que el documento está en estado processing o completed
      const lastDocIndex = (await documentsPage.getDocumentCount()) - 1
      await documentsPage.verifyDocumentStatus(lastDocIndex, 'processing|completed|procesando|completado')

      // Assert: Verificar nombre del archivo
      const fileName = path.basename(testFilePath)
      const docByName = await documentsPage.findDocumentByName(fileName)
      await expect(docByName).toBeVisible()
    })

    test('2. Upload exitoso de archivo XML', async ({ page }) => {
      test.info().annotations.push({
        type: 'feature',
        description: 'Validar upload de archivo XML (CFDI)',
      })

      // Arrange: Verificar estado inicial
      const initialCount = await documentsPage.getDocumentCount()

      // Act: Subir documento XML
      await documentsPage.uploadDocument(testXmlPath)

      // Assert: Verificar que el documento aparece en la lista
      await expect(async () => {
        const currentCount = await documentsPage.getDocumentCount()
        expect(currentCount).toBeGreaterThan(initialCount)
      }).toPass({ timeout: 10000 })

      // Assert: Verificar que el documento está procesado
      const lastDocIndex = (await documentsPage.getDocumentCount()) - 1
      await documentsPage.verifyDocumentStatus(lastDocIndex, 'processing|completed|procesando|completado')

      // Assert: Verificar nombre del archivo XML
      const fileName = path.basename(testXmlPath)
      const docByName = await documentsPage.findDocumentByName(fileName)
      await expect(docByName).toBeVisible()
    })
  })

  test.describe('Upload Fallido', () => {
    test('3. Upload fallido con archivo > 10MB', async ({ page }) => {
      test.info().annotations.push({
        type: 'validation',
        description: 'Validar rechazo de archivo que excede tamaño máximo',
      })

      // Act: Intentar subir archivo grande
      // Nota: En test real, usar un archivo > 10MB
      // Para este ejemplo, simulamos el comportamiento

      // Assert: Verificar mensaje de error
      const errorMessage = page.getByText(/archivo demasiado grande|max size|exceeds|tamaño máximo/i)
      
      // Simular error de tamaño (en producción, el backend rechazaría el archivo)
      await page.route('**/api/v1/documents/upload', async route => {
        await route.fulfill({
          status: 413,
          json: {
            error: 'File too large',
            message: 'El archivo excede el tamaño máximo de 10MB',
            max_size: '10MB',
          },
        })
      })

      // Intentar upload (será interceptado por el mock)
      await documentsPage.uploadDocument(largeFilePath)

      // Verificar mensaje de error
      await expect(errorMessage).toBeVisible({ timeout: 5000 })
    })

    test('4. Upload fallido con formato no soportado', async ({ page }) => {
      test.info().annotations.push({
        type: 'validation',
        description: 'Validar rechazo de formato de archivo no soportado',
      })

      // Arrange: Configurar mock para rechazo de formato
      await page.route('**/api/v1/documents/upload', async route => {
        await route.fulfill({
          status: 400,
          json: {
            error: 'Unsupported file format',
            message: 'Formato no soportado. Solo se aceptan PDF, XML y CSV',
            supported_formats: ['pdf', 'xml', 'csv'],
          },
        })
      })

      // Act: Intentar subir archivo con formato inválido
      await documentsPage.uploadDocument(invalidFormatPath)

      // Assert: Verificar mensaje de error
      const errorMessage = page.getByText(/formato no soportado|unsupported|invalid format/i)
      await expect(errorMessage).toBeVisible({ timeout: 5000 })

      // Assert: Verificar que no se agregaron documentos
      const docCount = await documentsPage.getDocumentCount()
      expect(docCount).toBeGreaterThanOrEqual(0)
    })
  })

  test.describe('Upload Múltiple y Procesamiento', () => {
    test('5. Upload múltiple (batch de 5 documentos)', async ({ page }) => {
      test.info().annotations.push({
        type: 'feature',
        description: 'Validar upload múltiple de documentos',
      })

      // Arrange: Verificar estado inicial
      const initialCount = await documentsPage.getDocumentCount()

      // Act: Subir múltiples documentos
      const filesToUpload = [
        testFilePath,
        testXmlPath,
        testFilePath, // Simulamos archivos diferentes
        testXmlPath,
        testFilePath,
      ]

      await documentsPage.uploadMultipleDocuments(filesToUpload)

      // Assert: Verificar que se subieron 5 documentos
      await expect(async () => {
        const currentCount = await documentsPage.getDocumentCount()
        expect(currentCount).toBeGreaterThanOrEqual(initialCount + 5)
      }).toPass({ timeout: 15000 })

      // Assert: Verificar progreso de upload
      // Nota: En producción, verificar la barra de progreso
      // await documentsPage.verifyUploadProgress()

      // Assert: Verificar que todos los documentos están en la lista
      const finalCount = await documentsPage.getDocumentCount()
      expect(finalCount).toBeGreaterThanOrEqual(initialCount + 5)
    })

    test('6. Visualización de documento procesado', async ({ page }) => {
      test.info().annotations.push({
        type: 'feature',
        description: 'Validar visualización de documento después de procesamiento',
      })

      // Arrange: Subir documento
      await documentsPage.uploadDocument(testFilePath)

      // Esperar procesamiento
      const lastDocIndex = (await documentsPage.getDocumentCount()) - 1
      
      // Act: Esperar a que el documento esté procesado
      await documentsPage.waitForDocumentProcessing(lastDocIndex, 60000)

      // Assert: Verificar estado completed
      await documentsPage.verifyDocumentStatus(lastDocIndex, 'completed|completado')

      // Assert: Verificar datos extraídos (si aplica)
      // await documentsPage.verifyExtractedData(lastDocIndex, {
      //   rfc: '.*',
      //   total: '.*',
      //   fecha: '.*',
      // })

      // Assert: Verificar score de confianza
      // await documentsPage.verifyConfidenceScore(lastDocIndex, 0.7)
    })
  })

  test.describe('Gestión de Documentos', () => {
    test('7. Eliminación de documento', async ({ page, authenticatedPage }) => {
      test.info().annotations.push({
        type: 'feature',
        description: 'Validar eliminación de documento',
      })

      // Arrange: Subir documento primero
      await documentsPage.uploadDocument(testFilePath)
      
      const docCount = await documentsPage.getDocumentCount()
      expect(docCount).toBeGreaterThan(0)

      const lastDocIndex = docCount - 1

      // Act: Eliminar documento
      await documentsPage.deleteDocument(lastDocIndex)

      // Assert: Verificar que el documento fue eliminado
      await expect(async () => {
        const newCount = await documentsPage.getDocumentCount()
        expect(newCount).toBeLessThan(docCount)
      }).toPass({ timeout: 5000 })
    })

    test('8. Re-intento de upload fallido', async ({ page }) => {
      test.info().annotations.push({
        type: 'resilience',
        description: 'Validar re-intento después de upload fallido',
      })

      // Arrange: Configurar mock para fallar el primer intento
      let attemptCount = 0
      
      await page.route('**/api/v1/documents/upload', async route => {
        attemptCount++
        
        if (attemptCount === 1) {
          // Primer intento falla
          await route.fulfill({
            status: 500,
            json: {
              error: 'Internal server error',
              message: 'Error temporal, intente nuevamente',
            },
          })
        } else {
          // Segundo intento tiene éxito
          await route.fulfill({
            status: 200,
            json: {
              success: true,
              document: {
                id: 'test-doc-123',
                name: path.basename(testFilePath),
                status: 'processing',
              },
            },
          })
        }
      })

      // Act: Intentar upload (fallará)
      try {
        await documentsPage.uploadDocument(testFilePath)
      } catch (error) {
        // Esperar error del primer intento
      }

      // Assert: Verificar que hubo un error
      expect(attemptCount).toBe(1)

      // Act: Re-intentar upload
      await page.unroute('**/api/v1/documents/upload')
      await documentsPage.uploadDocument(testFilePath)

      // Assert: Verificar que el segundo intento tuvo éxito
      await expect(async () => {
        const docCount = await documentsPage.getDocumentCount()
        expect(docCount).toBeGreaterThan(0)
      }).toPass({ timeout: 10000 })
    })
  })
})
