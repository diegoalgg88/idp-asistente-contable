import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useChat as useChatOriginal } from './useChat'

/**
 * Hook para obtener historial de chat con caching
 * staleTime: 5 minutos
 * gcTime: 10 minutos
 */
export function useChatHistory(userId?: string) {
  const { fetchHistory } = useChatOriginal()

  return useQuery({
    queryKey: ['chatHistory', userId],
    queryFn: async () => {
      if (!userId) return []
      await fetchHistory()
      // Retornar historial desde el store de Zustand
      // Nota: Esto requiere que useChat exponga el estado
      return []
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    enabled: !!userId,
  })
}

/**
 * Hook para obtener una conversación específica
 */
export function useConversation(conversationId?: string) {
  return useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      if (!conversationId) return null
      // Fetch de conversación específica
      return null
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!conversationId,
  })
}

/**
 * Hook para enviar mensaje
 */
export function useSendMessage() {
  const queryClient = useQueryClient()
  const { sendMessage } = useChatOriginal()

  return useMutation({
    mutationFn: ({ conversationId, content }: { conversationId: string; content: string }) =>
      sendMessage(content),
    onSuccess: () => {
      // Invalidar caché de historial para refetch
      queryClient.invalidateQueries({ queryKey: ['chatHistory'] })
      queryClient.invalidateQueries({ queryKey: ['conversation'] })
    },
  })
}

/**
 * Hook para eliminar conversación
 */
export function useDeleteConversation() {
  const queryClient = useQueryClient()
  const { deleteConversation } = useChatOriginal()

  return useMutation({
    mutationFn: (conversationId: string) => deleteConversation(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatHistory'] })
    },
  })
}
