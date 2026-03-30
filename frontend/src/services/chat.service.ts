/**
 * Chat Service
 * 
 * Servicio de chat conversacional con el asistente contable.
 * Este archivo re-exporta las funciones del servicio api.ts para mejor organización.
 * 
 * @module services/chat.service
 */

export { chatService, ApiErrorHelper } from './api'
export type { 
  Conversation, 
  ChatMessageRequest, 
  ChatMessageResponse, 
  FeedbackRequest,
  Message,
  MessageRole 
} from '@/types'
