/**
 * IDP Service
 * 
 * Servicio de procesamiento inteligente de documentos (IDP).
 * Este archivo re-exporta las funciones del servicio api.ts para mejor organización.
 * 
 * @module services/idp.service
 */

export { idpService, ApiErrorHelper } from './api'
export type { 
  Document, 
  DocumentUploadResponse, 
  BatchProcessResponse, 
  DocumentStatus,
  ExtractionData,
  ProcessingStats 
} from '@/types'
