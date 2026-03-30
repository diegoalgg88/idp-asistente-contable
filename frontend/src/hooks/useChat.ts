import { useCallback, useEffect } from 'react'
import { useChatStore } from '@/store/chat.store'

export function useChat(conversationId?: string) {
  const {
    conversations,
    currentConversation,
    messages,
    isLoading,
    isSending,
    isConnected,
    error,
    fetchHistory,
    fetchConversation,
    sendMessage,
    deleteConversation,
    clearError,
  } = useChatStore()

  useEffect(() => {
    if (conversationId) {
      fetchConversation(conversationId)
    }
  }, [conversationId, fetchConversation])

  const handleSendMessage = useCallback(async (content: string) => {
    await sendMessage(content, conversationId)
  }, [sendMessage, conversationId])

  const handleDeleteConversation = useCallback(async (id: string) => {
    await deleteConversation(id)
  }, [deleteConversation])

  return {
    conversations,
    currentConversation,
    messages,
    isLoading,
    isSending,
    isConnected,
    error,
    sendMessage: handleSendMessage,
    deleteConversation: handleDeleteConversation,
    fetchHistory,
    fetchConversation,
    clearError,
  }
}
