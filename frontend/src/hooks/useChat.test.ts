import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useChat } from './useChat'

// Mock del store con factory function
const mockUseChatStore = vi.fn()
vi.mock('@/store/chat.store', () => ({
  useChatStore: (...args: any[]) => mockUseChatStore(...args),
}))

describe('useChat', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock inicial del estado
    mockUseChatStore.mockImplementation(() => ({
      conversations: [],
      currentConversation: null,
      messages: [],
      isLoading: false,
      isSending: false,
      error: null,
      fetchHistory: vi.fn(),
      fetchConversation: vi.fn(),
      sendMessage: vi.fn(),
      deleteConversation: vi.fn(),
      setCurrentConversation: vi.fn(),
      clearMessages: vi.fn(),
      clearError: vi.fn(),
    }))
  })

  it('inicializa con estado de chat vacío', () => {
    const { result } = renderHook(() => useChat())
    
    expect(result.current.conversations).toEqual([])
    expect(result.current.messages).toEqual([])
    expect(result.current.currentConversation).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  it('proporciona funciones de envío y eliminación de mensajes', () => {
    const { result } = renderHook(() => useChat())
    
    expect(result.current.sendMessage).toBeDefined()
    expect(result.current.deleteConversation).toBeDefined()
    expect(typeof result.current.sendMessage).toBe('function')
    expect(typeof result.current.deleteConversation).toBe('function')
  })
})
