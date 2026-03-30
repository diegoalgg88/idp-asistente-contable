export type MessageRole = 'user' | 'assistant' | 'system'

export interface Message {
  id: string
  conversation_id: string
  role: MessageRole
  content: string
  created_at: string
  metadata?: Record<string, any>
}

export interface Conversation {
  id: string
  title: string
  message_count: number
  messages: Message[]
  created_at: string
  updated_at: string
}

export interface ChatMessageRequest {
  message: string
  conversation_id?: string
  context?: Record<string, any>
  stream?: boolean
}

export interface ChatMessageResponse {
  conversation_id: string
  message: {
    role: string
    content: string
  }
  sources?: string[]
  confidence: number
  metadata?: Record<string, any>
}

export interface FeedbackRequest {
  message_id: string
  rating: 'positive' | 'negative'
  comment?: string
}
