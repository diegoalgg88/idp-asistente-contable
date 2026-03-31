import { create } from 'zustand'
import type { Document, ProcessingStats, DocumentStatus } from '@/types'
import { idpService } from '@/services/api'

interface IDPState {
  documents: Document[]
  currentDocument: Document | null
  stats: ProcessingStats | null
  isUploading: boolean
  uploadProgress: number
  isLoading: boolean
  error: string | null

  // Actions
  uploadDocument: (file: File, documentType?: string) => Promise<void>
  batchUpload: (files: File[]) => Promise<void>
  fetchDocument: (id: string) => Promise<void>
  fetchDocumentResult: (id: string) => Promise<void>
  fetchStats: () => Promise<void>
  setCurrentDocument: (document: Document | null) => void
  deleteDocument: (id: string) => void
  clearError: () => void
}

export const useIDPStore = create<IDPState>((set) => ({
  // Initial state
  documents: [],
  currentDocument: null,
  stats: null,
  isUploading: false,
  uploadProgress: 0,
  isLoading: false,
  error: null,

  // Actions
  uploadDocument: async (file: File, documentType?: string) => {
    set({ isUploading: true, uploadProgress: 0, error: null })
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        set((state) => ({
          uploadProgress: Math.min(state.uploadProgress + 10, 90),
        }))
      }, 200)

      const response = await idpService.processDocument(file, documentType)

      clearInterval(progressInterval)
      set({
        isUploading: false,
        uploadProgress: 100,
        currentDocument: {
          id: response.document_id,
          user_id: 0,
          tenant_id: '',
          nombre_original: '',
          file_url: '',
          document_type: documentType || 'unknown',
          ruta_archivo: '',
          datos_extraidos: {} as any,
          puntuacion_confianza: 0,
          status: 'PROCESSING' as DocumentStatus,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as unknown as Document,
      })

      // Reset progress after delay
      setTimeout(() => set({ uploadProgress: 0 }), 2000)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al subir documento'
      set({ error: message, isUploading: false, uploadProgress: 0 })
      throw error
    }
  },

  batchUpload: async (files: File[]) => {
    set({ isUploading: true, uploadProgress: 0, error: null })
    try {
      const response = await idpService.batchProcess(files)

      const newDocuments: Document[] = (response.documents || []).map((doc) => ({
        id: doc.id,
        user_id: 0,
        nombre_original: '',
        file_url: '',
        tenant_id: '',
        document_type: 'unknown',
        ruta_archivo: '',
        datos_extraidos: {} as any,
        puntuacion_confianza: 0,
        status: doc.status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as unknown as Document))

      set((state) => ({
        documents: [...state.documents, ...newDocuments],
        isUploading: false,
        uploadProgress: 100,
      }))

      setTimeout(() => set({ uploadProgress: 0 }), 2000)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al subir documentos'
      set({ error: message, isUploading: false, uploadProgress: 0 })
      throw error
    }
  },

  fetchDocument: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const document = await idpService.getDocument(id)
      set({ currentDocument: document, isLoading: false })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al cargar documento'
      set({ error: message, isLoading: false })
    }
  },

  fetchDocumentResult: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const document = await idpService.getDocument(id)
      set({ currentDocument: document, isLoading: false })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al cargar resultado'
      set({ error: message, isLoading: false })
    }
  },

  fetchStats: async () => {
    try {
      const stats = await idpService.getStats()
      set({ stats })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  },

  setCurrentDocument: (document) => set({ currentDocument: document }),

  deleteDocument: (id: string) => {
    set((state) => ({
      documents: state.documents.filter((doc) => doc.id !== id),
      currentDocument: state.currentDocument?.id === id ? null : state.currentDocument,
    }))
  },

  clearError: () => set({ error: null }),
}))
