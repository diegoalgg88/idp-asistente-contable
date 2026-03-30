import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'
import { authService } from '@/services/api'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
  setUser: (user: User | null) => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authService.login(email, password)
          authService.setToken(response.access_token)
          
          const user = await authService.getCurrentUser()
          set({
            user,
            token: response.access_token,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Error al iniciar sesión'
          set({ error: message, isLoading: false })
          throw error
        }
      },

      logout: () => {
        authService.logout()
        set({ user: null, token: null, isAuthenticated: false })
      },

      checkAuth: async () => {
        const token = authService.getToken()
        if (!token) {
          set({ isAuthenticated: false, user: null })
          return
        }

        try {
          const user = await authService.getCurrentUser()
          set({ user, isAuthenticated: true })
        } catch {
          authService.logout()
          set({ isAuthenticated: false, user: null })
        }
      },

      setUser: (user) => set({ user }),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
