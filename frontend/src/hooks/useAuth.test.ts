import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useAuth } from './useAuth'

// Mock del store con factory function
const mockUseAuthStore = vi.fn()
vi.mock('@/store/auth.store', () => ({
  useAuthStore: (...args: any[]) => mockUseAuthStore(...args),
}))

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock inicial del estado
    mockUseAuthStore.mockImplementation(() => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      token: null,
      login: vi.fn(),
      logout: vi.fn(),
      checkAuth: vi.fn(),
      setUser: vi.fn(),
      clearError: vi.fn(),
    }))
  })

  it('inicializa con estado de autenticación', () => {
    const { result } = renderHook(() => useAuth())
    
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('proporciona funciones de login y logout', () => {
    const { result } = renderHook(() => useAuth())
    
    expect(result.current.login).toBeDefined()
    expect(result.current.logout).toBeDefined()
    expect(typeof result.current.login).toBe('function')
    expect(typeof result.current.logout).toBe('function')
  })
})
