import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import type {
  TokenResponse,
  User,
  Document,
  DocumentUploadResponse,
  BatchProcessResponse,
  Conversation,
  ChatMessageRequest,
  ChatMessageResponse,
  FeedbackRequest,
  ProcessingStats,
  ApiError,
} from '@/types'

// Environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10)

// Token storage keys
const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

// Token management
export const tokenStorage = {
  getAccessToken: (): string | null => localStorage.getItem(ACCESS_TOKEN_KEY),
  setAccessToken: (token: string) => localStorage.setItem(ACCESS_TOKEN_KEY, token),
  removeAccessToken: () => localStorage.removeItem(ACCESS_TOKEN_KEY),
  
  getRefreshToken: (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token: string) => localStorage.setItem(REFRESH_TOKEN_KEY, token),
  removeRefreshToken: () => localStorage.removeItem(REFRESH_TOKEN_KEY),
  
  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },
}

// Create axios instance
export const api: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_TIMEOUT,
})

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getAccessToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling and token refresh
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        try {
          const token = await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return await api(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = tokenStorage.getRefreshToken()

      if (refreshToken) {
        try {
          // Try to refresh token
          const response = await axios.post<TokenResponse>(
            `${API_BASE_URL}/v1/auth/refresh`,
            { refresh_token: refreshToken },
            { headers: { 'Content-Type': 'application/json' } }
          )

          const { access_token, refresh_token } = response.data
          tokenStorage.setAccessToken(access_token)
          tokenStorage.setRefreshToken(refresh_token)

          processQueue(null, access_token)

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`
          }

          return api(originalRequest)
        } catch (refreshError) {
          processQueue(refreshError as AxiosError, null)
          // Refresh failed, logout user
          tokenStorage.clear()
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      } else {
        // No refresh token, logout user
        tokenStorage.clear()
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    }

    // Handle other errors
    return Promise.reject(error)
  }
)

// Auth Service
export const authService = {
  /**
   * Login con email y password
   * POST /v1/auth/token
   */
  async login(email: string, password: string): Promise<TokenResponse> {
    const formData = new URLSearchParams()
    formData.append('username', email)
    formData.append('password', password)

    const response = await api.post<TokenResponse>('/auth/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    // Guardar tokens
    if (response.data.access_token) {
      tokenStorage.setAccessToken(response.data.access_token)
    }
    if (response.data.refresh_token) {
      tokenStorage.setRefreshToken(response.data.refresh_token)
    }

    return response.data
  },

  /**
   * Obtener usuario actual
   * GET /v1/auth/me
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me')
    return response.data
  },

  /**
   * Logout - limpiar tokens
   */
  logout() {
    tokenStorage.clear()
  },

  /**
   * Set access token manualmente
   */
  setToken(token: string) {
    tokenStorage.setAccessToken(token)
  },

  /**
   * Get access token
   */
  getToken(): string | null {
    return tokenStorage.getAccessToken()
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!tokenStorage.getAccessToken()
  },
}

// IDP Service
export const idpService = {
  /**
   * Procesar documento individual
   * POST /v1/idp/process
   */
  async processDocument(file: File, documentType?: string): Promise<DocumentUploadResponse> {
    const formData = new FormData()
    formData.append('file', file)
    if (documentType) {
      formData.append('document_type', documentType)
    }

    const response = await api.post<DocumentUploadResponse>('/idp/process', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60s para procesamiento de documentos
    })
    return response.data
  },

  /**
   * Procesamiento batch de documentos
   * POST /v1/idp/batch-process
   */
  async batchProcess(files: File[], documentType?: string, maxWorkers?: number): Promise<BatchProcessResponse> {
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))
    
    if (documentType) {
      formData.append('document_type', documentType)
    }
    if (maxWorkers) {
      formData.append('max_workers', maxWorkers.toString())
    }

    const response = await api.post<BatchProcessResponse>('/idp/batch-process', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 120000, // 120s para batch processing
    })
    return response.data
  },

  /**
   * Obtener estado de documento
   * GET /v1/idp/{document_id}
   */
  async getDocument(id: string): Promise<Document> {
    const response = await api.get<Document>(`/idp/${id}`)
    return response.data
  },

  /**
   * Eliminar documento
   * DELETE /v1/idp/{document_id}
   */
  async deleteDocument(id: string): Promise<void> {
    await api.delete(`/idp/${id}`)
  },

  /**
   * Obtener estadísticas de procesamiento
   * GET /v1/idp/stats
   */
  async getStats(): Promise<ProcessingStats> {
    const response = await api.get<ProcessingStats>('/idp/stats')
    return response.data
  },
  async exportDocuments(): Promise<void> {
    const response = await api.get('/idp/export/xlsx', {
      responseType: 'blob',
    })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'reporte_documentos.xlsx')
    document.body.appendChild(link)
    link.click()
    link.remove()
  },
}

// Chat Service
export const chatService = {
  /**
   * Enviar mensaje y obtener respuesta
   * POST /v1/chat/message
   */
  async sendMessage(
    content: string, 
    conversationId?: string, 
    model?: string, 
    contextItems?: string[]
  ): Promise<ChatMessageResponse> {
    const request = { 
      message: content, 
      conversation_id: conversationId,
      model,
      context_items: contextItems 
    }
    const response = await api.post<ChatMessageResponse>('/chat/message', request)
    return response.data
  },

  /**
   * Obtener sugerencias de contexto (@)
   * GET /v1/chat/context-items
   */
  async getContextItems(): Promise<{ items: { id: string, name: string, type: string }[] }> {
    const response = await api.get('/chat/context-items')
    return response.data
  },

  /**
   * Enviar mensaje con streaming SSE
   * POST /v1/chat/message/stream
   */
  async *streamMessage(content: string, conversationId?: string): AsyncGenerator<string, void, unknown> {
    const token = tokenStorage.getAccessToken()
    if (!token) {
      throw new Error('No authentication token available')
    }

    const response = await fetch(`${API_BASE_URL}/v1/chat/message/stream`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message: content, 
        conversation_id: conversationId,
        stream: true,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Streaming failed' }))
      throw new Error(error.detail || 'Streaming failed')
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('ReadableStream not supported')
    }

    const decoder = new TextDecoder()

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        // Parsear SSE: "data: {...}\n\n"
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim()
            if (data === '[DONE]') {
              return
            }
            if (data.startsWith('[ERROR]')) {
              throw new Error(data.slice(9).trim())
            }
            yield data
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  },

  /**
   * Obtener conversación completa
   * GET /v1/chat/conversation/{id}
   */
  async getConversation(id: string): Promise<Conversation> {
    const response = await api.get<Conversation>(`/chat/conversation/${id}`)
    return response.data
  },

  /**
   * Eliminar conversación
   * DELETE /v1/chat/conversation/{id}
   */
  async deleteConversation(id: string): Promise<void> {
    await api.delete(`/chat/conversation/${id}`)
  },

  /**
   * Listar conversaciones del usuario
   * GET /v1/chat/conversations
   */
  async getHistory(): Promise<Conversation[]> {
    const response = await api.get<Conversation[]>('/chat/conversations')
    return response.data
  },

  /**
   * Enviar feedback sobre mensaje
   * POST /v1/chat/feedback
   */
  async sendFeedback(messageId: string, rating: 'positive' | 'negative', comment?: string): Promise<void> {
    const request: FeedbackRequest = { message_id: messageId, rating, comment }
    await api.post('/chat/feedback', request)
  },
}

// Workspace Service
export const workspaceService = {
  async getDashboard(): Promise<any> {
    const response = await api.get('/workspace/dashboard-full')
    return response.data
  },
  async getCalendar(): Promise<any[]> {
    const response = await api.get('/workspace/calendar')
    return response.data
  },
  async createCalendarEvent(event: { title: string; date: string; type: string; priority: string; description?: string }): Promise<any> {
    const response = await api.post('/workspace/calendar', event)
    return response.data
  },
  async updateCalendarEvent(eventId: number, event: { title?: string; date?: string; status?: string; priority?: string }): Promise<any> {
    const response = await api.put(`/workspace/calendar/${eventId}`, event)
    return response.data
  },
  async deleteCalendarEvent(eventId: number): Promise<void> {
    await api.delete(`/workspace/calendar/${eventId}`)
  },
  async getWorkflows(): Promise<any[]> {
    const response = await api.get('/workspace/workflows')
    return response.data
  },
  async executeWorkflow(workflowId: number): Promise<any> {
    const response = await api.post(`/workspace/workflows/${workflowId}/execute`)
    return response.data
  },
  async getMetrics(): Promise<any> {
    const response = await api.get('/workspace/metrics')
    return response.data
  },
  async getForecast(): Promise<any> {
    const response = await api.get('/workspace/forecast')
    return response.data
  },
  async getKpiTrends(): Promise<any[]> {
    const response = await api.get('/workspace/kpi-trends')
    return response.data
  },
}

// Clients Service
export const clientsService = {
  async list(status?: string, type?: string): Promise<any[]> {
    const params = new URLSearchParams()
    if (status) params.append('status', status)
    if (type) params.append('type', type)
    const response = await api.get(`/clients?${params.toString()}`)
    return response.data
  },
  async get(id: string): Promise<any> {
    const response = await api.get(`/clients/${id}`)
    return response.data
  },
  async create(data: any): Promise<any> {
    const response = await api.post('/clients', data)
    return response.data
  },
  async update(id: string, data: any): Promise<any> {
    const response = await api.put(`/clients/${id}`, data)
    return response.data
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/clients/${id}`)
  },
  async getExpediente(id: string): Promise<any> {
    const response = await api.get(`/clients/${id}/expediente`)
    return response.data
  },
}

// Fiscal Service
export const fiscalService = {
  async getDeadlines(): Promise<any[]> {
    const response = await api.get('/fiscal/deadlines')
    return response.data
  },
  async getDeductions(): Promise<any[]> {
    const response = await api.get('/fiscal/deductions')
    return response.data
  },
  async getAnnualReport(year?: number): Promise<any> {
    const response = await api.get(`/fiscal/annual-report${year ? `?year=${year}` : ''}`)
    return response.data
  },
  async getComplianceOpinion(rfc: string): Promise<any> {
    const response = await api.get(`/fiscal/compliance-opinion?rfc=${rfc}`)
    return response.data
  },
  async exportWorkingPaper(rfc: string, year: number = 2026): Promise<void> {
    const response = await api.get(`/fiscal/export-working-paper?rfc=${rfc}&year=${year}`, {
      responseType: 'blob',
    })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `papel_trabajo_${rfc}_${year}.xlsx`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  },
  async syncSAT(rfc: string, start_date: string, end_date: string): Promise<any> {
    const response = await api.post('/fiscal/sync-sat', { rfc, start_date, end_date })
    return response.data
  },
  async getCoeficiente(): Promise<any> {
    const response = await api.get('/fiscal/coeficiente')
    return response.data
  },
}

// Payroll Service
export const payrollService = {
  async getSummary(): Promise<any> {
    const response = await api.get('/payroll/summary')
    return response.data
  },
  async getEmployees(): Promise<any[]> {
    const response = await api.get('/payroll/employees')
    return response.data
  },
  async disperse(): Promise<any> {
    const response = await api.post('/payroll/disperse')
    return response.data
  },
  async getSpecialCalcs(): Promise<any[]> {
    const response = await api.get('/payroll/special-calcs')
    return response.data
  },
  async getSua(): Promise<any> {
    const response = await api.get('/payroll/sua')
    return response.data
  },
}

// Finance Service
export const financeService = {
  async getSummary(): Promise<any> {
    const response = await api.get('/finance/summary')
    return response.data
  },
  async getStatements(): Promise<any[]> {
    const response = await api.get('/finance/statements')
    return response.data
  },
  async getBankAccounts(): Promise<any[]> {
    const response = await api.get('/finance/bank-accounts')
    return response.data
  },
  async reconcile(bankId?: string): Promise<any> {
    const response = await api.post(`/finance/reconcile${bankId ? `?bank_id=${bankId}` : ''}`)
    return response.data
  },
  async getCashFlow(): Promise<any> {
    const response = await api.get('/finance/cash-flow')
    return response.data
  },
  async getChartData(): Promise<any[]> {
    const response = await api.get('/finance/chart-data')
    return response.data
  },
}

// Expenses Service
export const expensesService = {
  async getCategories(): Promise<any[]> {
    const response = await api.get('/expenses/categories')
    return response.data
  },
  async getPending(): Promise<any[]> {
    const response = await api.get('/expenses/pending')
    return response.data
  },
  async classify(): Promise<any> {
    const response = await api.post('/expenses/classify')
    return response.data
  },
  async getBudget(): Promise<any> {
    const response = await api.get('/expenses/budget')
    return response.data
  },
}

// Users Service
export const usersService = {
  async getMe(): Promise<any> {
    const response = await api.get('/users/me')
    return response.data
  },
  async updateMe(data: any): Promise<any> {
    const response = await api.put('/users/me', data)
    return response.data
  },
  async getSettings(): Promise<any> {
    const response = await api.get('/users/me/settings')
    return response.data
  },
  async updateSettings(data: any): Promise<any> {
    const response = await api.put('/users/me/settings', data)
    return response.data
  },
  async getFiscalProfiles(): Promise<any[]> {
    const response = await api.get('/users/me/fiscal-profiles')
    return response.data
  },
  async getSubscription(): Promise<any> {
    const response = await api.get('/users/me/subscription')
    return response.data
  },
}

// Error handling utilities
export class ApiErrorHelper {
  static isApiError(error: unknown): error is AxiosError<ApiError> {
    return axios.isAxiosError(error)
  }

  static getErrorMessage(error: unknown): string {
    if (this.isApiError(error)) {
      const apiError = error.response?.data
      if (apiError?.detail) {
        // Handle union type: string | Array<{ loc: string[]; msg: string; type: string }>
        if (typeof apiError.detail === 'string') {
          return apiError.detail
        }
        // If detail is an array, extract messages
        if (Array.isArray(apiError.detail)) {
          return apiError.detail.map(item => item.msg).join(', ')
        }
      }
      return error.message || 'Error de conexión'
    }
    return error instanceof Error ? error.message : 'Error desconocido'
  }

  static isAuthError(error: unknown): boolean {
    return this.isApiError(error) && error.response?.status === 401
  }

  static isNetworkError(error: unknown): boolean {
    return this.isApiError(error) && !error.response
  }

  static shouldRetry(error: unknown): boolean {
    if (!this.isApiError(error)) return false
    const status = error.response?.status
    // Retry on 5xx server errors or network errors
    return !status || status >= 500
  }
}

export default api
