import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Chat from './Chat'

// Mock del store con factory function
const mockUseChatStore = vi.fn()
vi.mock('@/store/chat.store', () => ({
  useChatStore: (...args: any[]) => mockUseChatStore(...args),
}))

describe('Chat', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock del hook
    mockUseChatStore.mockImplementation(() => ({
      conversations: [
        { id: '1', title: 'Consulta Fiscal', messages: [], created_at: new Date().toISOString() },
      ],
      currentConversation: null,
      messages: [
        {
          id: '1',
          conversation_id: '1',
          role: 'user',
          content: '¿Qué es un CFDI?',
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          conversation_id: '1',
          role: 'assistant',
          content: 'Un CFDI es un Comprobante Fiscal Digital por Internet.',
          created_at: new Date().toISOString(),
        },
      ],
      isLoading: false,
      isSending: false,
      error: null,
      fetchHistory: vi.fn(),
      fetchConversation: vi.fn(),
      sendMessage: vi.fn(),
      deleteConversation: vi.fn(),
      clearError: vi.fn(),
    }))
  })

  it('renderiza correctamente', () => {
    render(<Chat />)
    expect(screen.getByText(/agente fiscal/i)).toBeInTheDocument()
  })

  it('muestra la lista de mensajes', () => {
    render(<Chat />)
    
    expect(screen.getByText(/¿qué es un cfdi\?/i)).toBeInTheDocument()
    expect(screen.getByText(/un cfdi es un comprobante fiscal digital por internet/i)).toBeInTheDocument()
  })
})
