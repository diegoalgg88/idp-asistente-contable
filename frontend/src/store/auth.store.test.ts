import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useAuthStore } from './auth.store'

// Mock de authService
vi.mock('@/services/api', () => ({
  authService: {
    login: vi.fn(),
    logout: vi.fn(),
    getToken: vi.fn(),
    setToken: vi.fn(),
    getCurrentUser: vi.fn(),
  },
}))

describe('auth.store', () => {
  beforeEach(() => {
    // Resetear el store antes de cada test
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })
  })

  it('inicializa con estado no autenticado', () => {
    const state = useAuthStore.getState()
    
    expect(state.user).toBeNull()
    expect(state.isAuthenticated).toBe(false)
    expect(state.isLoading).toBe(false)
    expect(state.error).toBeNull()
  })

  it('actualiza el estado de autenticación', () => {
    const mockUser = { 
      id: 1, 
      email: 'test@example.com', 
      full_name: 'Test User',
      is_active: true,
      created_at: new Date().toISOString()
    }

    useAuthStore.setState({
      user: mockUser,
      isAuthenticated: true,
    })

    const state = useAuthStore.getState()
    expect(state.user).toEqual(mockUser)
    expect(state.isAuthenticated).toBe(true)
  })

  it('limpia el error con clearError', () => {
    useAuthStore.setState({ error: 'Test error' })
    
    const { clearError } = useAuthStore.getState()
    clearError()
    
    const state = useAuthStore.getState()
    expect(state.error).toBeNull()
  })
})
