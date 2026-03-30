import { useCallback } from 'react'
import { useAuthStore } from '@/store/auth.store'

export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    checkAuth,
    clearError,
  } = useAuthStore()

  const handleLogin = useCallback(async (email: string, password: string) => {
    await login(email, password)
  }, [login])

  const handleLogout = useCallback(() => {
    logout()
  }, [logout])

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    logout: handleLogout,
    checkAuth,
    clearError,
  }
}
