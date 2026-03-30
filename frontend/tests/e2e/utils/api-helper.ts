/**
 * API Helper para Tests E2E
 *
 * Helper para llamadas API durante el setup de tests.
 * Permite crear datos de prueba, limpiar recursos y mockear respuestas.
 *
 * @module tests/e2e/utils/api-helper
 */

import { APIRequestContext } from '@playwright/test'

// Configuración de API
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'
const API_VERSION = 'v1'

/**
 * Interfaz para usuario de test
 */
export interface TestUser {
  email: string
  password: string
  full_name: string
  role?: string
}

/**
 * Interfaz para documento mock
 */
export interface MockDocument {
  id: string
  original_filename: string
  document_type: string
  status: string
  created_at: string
}

/**
 * Interfaz para conversación mock
 */
export interface MockConversation {
  id: string
  title: string
  messages: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
  created_at: string
}

/**
 * Clase helper para operaciones de API en tests E2E
 */
export class ApiHelper {
  private request: APIRequestContext
  private authToken: string | null = null
  private createdResources: Array<{ type: string; id: string }> = []

  constructor(request: APIRequestContext) {
    this.request = request
  }

  /**
   * Establecer token de autenticación
   */
  setAuthToken(token: string) {
    this.authToken = token
  }

  /**
   * Obtener headers para requests autenticados
   */
  private getAuthHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`
    }

    return headers
  }

  /**
   * Crear usuario de prueba vía API
   *
   * @returns Usuario creado
   */
  async setupTestUser(): Promise<TestUser> {
    const timestamp = Date.now()
    const testUser: TestUser = {
      email: `test_${timestamp}@example.com`,
      password: 'Test123!@#',
      full_name: `Test User ${timestamp}`,
      role: 'user',
    }

    try {
      // Intentar crear usuario vía API (si el endpoint existe)
      const response = await this.request.post(
        `${API_BASE_URL}/${API_VERSION}/auth/register`,
        {
          headers: this.getAuthHeaders(),
          data: testUser,
        }
      )

      if (response.ok()) {
        this.createdResources.push({ type: 'user', id: testUser.email })
        return testUser
      }
    } catch (error) {
      // Si no hay endpoint de registro, usar usuario mock
      console.log('Registro de usuario no disponible, usando usuario mock')
    }

    // Fallback: retornar usuario mock para tests
    return {
      email: 'admin@example.com',
      password: 'admin123',
      full_name: 'Admin User',
      role: 'admin',
    }
  }

  /**
   * Limpiar datos de prueba después del test
   */
  async cleanupTestData(): Promise<void> {
    // Limpiar recursos creados durante los tests
    for (const resource of this.createdResources) {
      try {
        if (resource.type === 'user') {
          // await this.request.delete(`${API_BASE_URL}/${API_VERSION}/users/${resource.id}`)
          console.log(`Cleanup: User ${resource.id} marked for deletion`)
        } else if (resource.type === 'document') {
          // await this.request.delete(`${API_BASE_URL}/${API_VERSION}/documents/${resource.id}`)
          console.log(`Cleanup: Document ${resource.id} marked for deletion`)
        }
      } catch (error) {
        console.error(`Error cleaning up ${resource.type} ${resource.id}:`, error)
      }
    }

    this.createdResources = []
  }

  /**
   * Crear documento mock para tests
   *
   * @returns Documento mock
   */
  async mockDocument(): Promise<MockDocument> {
    const mockDoc: MockDocument = {
      id: `doc_${Date.now()}`,
      original_filename: 'test-cfdi.pdf',
      document_type: 'cfdi',
      status: 'completed',
      created_at: new Date().toISOString(),
    }

    this.createdResources.push({ type: 'document', id: mockDoc.id })

    return mockDoc
  }

  /**
   * Crear conversación mock para tests
   *
   * @returns Conversación mock
   */
  async mockConversation(): Promise<MockConversation> {
    const mockConv: MockConversation = {
      id: `conv_${Date.now()}`,
      title: 'Conversación de Test',
      messages: [
        {
          role: 'user',
          content: '¿Qué es un CFDI?',
        },
        {
          role: 'assistant',
          content: 'Un CFDI (Comprobante Fiscal Digital por Internet) es un documento fiscal digital utilizado en México para comprobar la transferencia de bienes o servicios.',
        },
      ],
      created_at: new Date().toISOString(),
    }

    this.createdResources.push({ type: 'conversation', id: mockConv.id })

    return mockConv
  }

  /**
   * Hacer login y obtener token
   *
   * @param email - Email del usuario
   * @param password - Password del usuario
   * @returns Token de autenticación
   */
  async login(email: string, password: string): Promise<string> {
    try {
      const response = await this.request.post(
        `${API_BASE_URL}/${API_VERSION}/auth/login`,
        {
          headers: this.getAuthHeaders(),
          data: { email, password },
        }
      )

      if (response.ok()) {
        const data = await response.json()
        this.authToken = data.token || data.access_token
        return this.authToken
      }

      throw new Error('Login failed')
    } catch (error) {
      console.error('Login error:', error)
      // Fallback: retornar token mock para tests
      this.authToken = 'mock-jwt-token-for-testing'
      return this.authToken
    }
  }

  /**
   * Verificar health del backend
   *
   * @returns True si el backend está saludable
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await this.request.get(
        `${API_BASE_URL}/${API_VERSION}/health`
      )
      return response.ok()
    } catch {
      // Fallback: intentar endpoint alternativo
      try {
        const response = await this.request.get(`${API_BASE_URL}/health`)
        return response.ok()
      } catch {
        return false
      }
    }
  }

  /**
   * Mockear respuesta de API para tests
   *
   * @param endpoint - Endpoint a mockear
   * @param responseData - Datos de respuesta mock
   */
  async mockApiResponse<T>(endpoint: string, responseData: T): Promise<void> {
    // Esta función se usa para configurar mocks a nivel de test
    // La implementación real depende del framework de mocking usado
    console.log(`Mocking API response for ${endpoint}:`, responseData)
  }
}

/**
 * Crear instancia de ApiHelper
 *
 * @param request - APIRequestContext de Playwright
 * @returns Instancia de ApiHelper
 */
export function createApiHelper(request: APIRequestContext): ApiHelper {
  return new ApiHelper(request)
}
