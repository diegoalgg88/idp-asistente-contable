import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-client';

export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
  metadata?: {
    sources?: Array<{
      filename: string;
      page?: number;
      snippet?: string;
    }>;
  };
}

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

export const useGetConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => apiRequest<Conversation[]>('/chat/conversations'),
  });
};

export const useGetMessages = (conversationId: string) => {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => apiRequest<ChatMessage[]>(`/chat/conversations/${conversationId}/messages`),
    enabled: !!conversationId,
  });
};

export const useSendMessage = (conversationId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) =>
      apiRequest<ChatMessage>('/chat/message', {
        method: 'POST',
        body: JSON.stringify({
          content,
          conversation_id: conversationId,
        }),
      }),
    onSuccess: (newMessage) => {
      if (conversationId) {
        queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      }
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};
