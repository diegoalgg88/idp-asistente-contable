import { create } from 'zustand'
import type { Conversation, Message } from '@/types'
import { chatService } from '@/services/api'

interface ChatState {
  conversations: Conversation[]
  currentConversation: Conversation | null
  selectedConversation: string | null
  messages: Message[]
  isLoading: boolean
  isSending: boolean
  isConnected?: boolean
  selectedModel: { id: string, name: string }
  contextItems: string[]
  error: string | null

  // Actions
  fetchHistory: () => Promise<void>
  fetchConversation: (id: string) => Promise<void>
  sendMessage: (content: string, conversationId?: string) => Promise<void>
  deleteConversation: (id: string) => Promise<void>
  setCurrentConversation: (conversation: Conversation | null) => void
  setSelectedConversation: (id: string | null) => void
  setSelectedModel: (model: { id: string, name: string }) => void
  addContextItem: (item: string) => void
  removeContextItem: (item: string) => void
  clearMessages: () => void
  clearError: () => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial state
  conversations: [],
  currentConversation: null,
  selectedConversation: null,
  messages: [],
  isLoading: false,
  isSending: false,
  isConnected: undefined,
  selectedModel: { id: 'llama-3.3-70b', name: 'Llama 3.3 70B (Instruct)' },
  contextItems: [],
  error: null,

  // Actions
  setSelectedConversation: (id) => set({ selectedConversation: id }),
  setSelectedModel: (model) => set({ selectedModel: model }),
  addContextItem: (item) => set((state) => ({
    contextItems: state.contextItems.includes(item) ? state.contextItems : [...state.contextItems, item]
  })),
  removeContextItem: (item) => set((state) => ({
    contextItems: state.contextItems.filter((i) => i !== item)
  })),
  fetchHistory: async () => {
    set({ isLoading: true, error: null })
    try {
      const conversations = await chatService.getHistory()
      console.log('Conversations loaded:', conversations)
      
      // Validate all conversations have IDs
      const invalidConvs = conversations.filter(c => !c.id || c.id === 'undefined')
      if (invalidConvs.length > 0) {
        console.error('Conversations without valid ID:', invalidConvs)
      }
      
      set({ conversations, isLoading: false, isConnected: true })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al cargar historial'
      // Si el error es de tipo fetch/network, podemos asumir desconexión
      const isNetworkError = message.toLowerCase().includes('fetch') || message.toLowerCase().includes('network')
      set({ error: message, isLoading: false, isConnected: isNetworkError ? false : true })
    }
  },

  fetchConversation: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const conversation = await chatService.getConversation(id)
      set({ currentConversation: conversation, messages: conversation.messages, isLoading: false, selectedConversation: id })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al cargar conversación'
      set({ error: message, isLoading: false })
    }
  },

  sendMessage: async (content: string, conversationId?: string) => {
    const { selectedModel, contextItems } = useChatStore.getState()
    set({ isSending: true, error: null })
    try {
      const response = await chatService.sendMessage(
        content, 
        conversationId, 
        selectedModel.id, 
        contextItems
      )
      
      // Add user message optimistically
      const userMessage: Message = {
        id: Date.now().toString(),
        conversation_id: response.conversation_id,
        role: 'user',
        content,
        created_at: new Date().toISOString(),
      }

      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        conversation_id: response.conversation_id,
        role: 'assistant',
        content: response.message.content,
        created_at: new Date().toISOString(),
      }

      set((state) => ({
        messages: [...state.messages, userMessage, assistantMessage],
        isSending: false,
        contextItems: [], // Clear context after sending
        currentConversation: state.currentConversation
          ? {
              ...state.currentConversation,
              id: response.conversation_id,
              messages: [...state.currentConversation.messages, userMessage, assistantMessage],
            }
          : null,
      }))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al enviar mensaje'
      set({ error: message, isSending: false })
      throw error
    }
  },

  deleteConversation: async (id: string) => {
    // Validate ID before making API call
    if (!id || id === 'undefined' || id === 'null') {
      console.error('Attempted to delete conversation with invalid ID:', id)
      throw new Error('ID de conversación inválido')
    }
    
    try {
      await chatService.deleteConversation(id)
      set((state) => ({
        conversations: state.conversations.filter((c) => c.id !== id),
        currentConversation: state.currentConversation?.id === id ? null : state.currentConversation,
        messages: state.currentConversation?.id === id ? [] : state.messages,
        selectedConversation: state.selectedConversation === id ? null : state.selectedConversation,
      }))
    } catch (error) {
      console.error('Error deleting conversation:', error)
      throw error // Re-throw to handle in component
    }
  },

  setCurrentConversation: (conversation) => set({ currentConversation: conversation }),

  clearMessages: () => set({ messages: [] }),

  clearError: () => set({ error: null }),
}))
