import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  // User state
  user: {
    id: number | null
    email: string | null
    full_name: string | null
  } | null

  // UI state
  sidebarOpen: boolean
  theme: 'light' | 'dark'

  // Actions
  setUser: (user: AppState['user']) => void
  logout: () => void
  toggleSidebar: () => void
  setTheme: (theme: AppState['theme']) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      sidebarOpen: true,
      theme: 'light',

      // Actions
      setUser: (user) => set({ user }),

      logout: () => set({ user: null }),

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'idp-storage',
      partialize: (state) => ({
        user: state.user,
        theme: state.theme,
      }),
    }
  )
)

// Re-export specialized stores
export { useAuthStore } from './auth.store'
export { useChatStore } from './chat.store'
export { useIDPStore } from './idp.store'
export { useModulesStore } from './modules.store'
