import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useIDP } from './useIDP'
import type { Document } from '@/types'

/**
 * Hook para obtener documentos con caching
 * staleTime: 5 minutos (los datos se consideran frescos por 5 min)
 * gcTime: 10 minutos (los datos se mantienen en cache por 10 min)
 */
export function useDocuments(tenantId?: string) {
  const { documents, fetchDocument } = useIDP()

  return useQuery({
    queryKey: ['documents', tenantId],
    queryFn: async () => {
      if (!tenantId) return []
      await fetchDocument(tenantId)
      return documents
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    enabled: !!tenantId,
  })
}

/**
 * Hook para subir documento con optimistic updates
 */
export function useUploadDocument() {
  const queryClient = useQueryClient()
  const { uploadDocument } = useIDP()

  return useMutation({
    mutationFn: ({ file, documentType, tenantId }: { file: File; documentType: string; tenantId: string }) =>
      uploadDocument(file, documentType),
    onSuccess: () => {
      // Invalidar caché de documentos para refetch
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })
}

/**
 * Hook para eliminar documento con optimistic updates
 */
export function useDeleteDocument() {
  const queryClient = useQueryClient()
  const { deleteDocument } = useIDP()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await deleteDocument(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })
}

/**
 * Hook para obtener estadísticas de documentos
 */
export function useDocumentStats() {
  const { stats, fetchStats } = useIDP()

  return useQuery({
    queryKey: ['documentStats'],
    queryFn: async () => {
      await fetchStats()
      return stats
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
  })
}
