import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useChatStore } from './chat.store'

// Mock de chatService
vi.mock('@/services/api', () => ({
  chatService: {
    getHistory: vi.fn(),
    getConversation: vi.fn(),
    sendMessage: vi.fn(),
    deleteConversation: vi.fn(),
  },
}))

describe('chat.store', () => {
  beforeEach(() => {
    // Resetear el store antes de cada test
    useChatStore.setState({
      conversations: [],
      currentConversation: null,
      messages: [],
      isLoading: false,
      isSending: false,
      error: null,
    })
  })

  it('inicializa con estado vacío', () => {
    const state = useChatStore.getState()
    
    expect(state.conversations).toEqual([])
    expect(state.messages).toEqual([])
    expect(state.currentConversation).toBeNull()
    expect(state.isLoading).toBe(false)
  })

  it('agrega mensajes al estado', () => {
    const mockMessage = {
      id: '1',
      conversation_id: 'conv-1',
      role: 'user' as const,
      content: 'Test message',
      created_at: new Date().toISOString(),
    }
    
    useChatStore.setState((state) => ({
      messages: [...state.messages, mockMessage],
    }))
    
    const state = useChatStore.getState()
    expect(state.messages).toHaveLength(1)
    expect(state.messages[0]).toEqual(mockMessage)
  })

  it('limpia mensajes con clearMessages', () => {
    useChatStore.setState({
      messages: [
        {
          id: '1',
          conversation_id: 'conv-1',
          role: 'user' as const,
          content: 'Test',
          created_at: new Date().toISOString(),
        },
      ],
    })
    
    const { clearMessages } = useChatStore.getState()
    clearMessages()
    
    const state = useChatStore.getState()
    expect(state.messages).toEqual([])
  })

  it('actualiza la conversación actual', () => {
    const mockConversation = {
      id: 'conv-1',
      user_id: 'user-1',
      title: 'Test Conversation',
      messages: [],
      message_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { setCurrentConversation } = useChatStore.getState()
    setCurrentConversation(mockConversation)

    const state = useChatStore.getState()
    expect(state.currentConversation).toEqual(mockConversation)
  })
})
