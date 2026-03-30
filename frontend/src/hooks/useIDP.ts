import { useCallback, useEffect } from 'react'
import { useIDPStore } from '@/store/idp.store'

export function useIDP() {
  const {
    documents,
    currentDocument,
    stats,
    isUploading,
    uploadProgress,
    isLoading,
    error,
    uploadDocument,
    batchUpload,
    fetchDocument,
    fetchDocumentResult,
    fetchStats,
    setCurrentDocument,
    deleteDocument,
    clearError,
  } = useIDPStore()

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const handleUploadDocument = useCallback(async (file: File, documentType?: string) => {
    await uploadDocument(file, documentType)
  }, [uploadDocument])

  const handleBatchUpload = useCallback(async (files: File[]) => {
    await batchUpload(files)
  }, [batchUpload])

  const handleFetchDocument = useCallback(async (id: string) => {
    await fetchDocument(id)
  }, [fetchDocument])

  const handleFetchDocumentResult = useCallback(async (id: string) => {
    await fetchDocumentResult(id)
  }, [fetchDocumentResult])

  const syncSATDocuments = useCallback(async (rfc: string, startDate: string, endDate: string) => {
    const { fiscalService } = await import('@/services/api')
    return await fiscalService.syncSAT(rfc, startDate, endDate)
  }, [])

  return {
    documents,
    currentDocument,
    stats,
    isUploading,
    uploadProgress,
    isLoading,
    error,
    uploadDocument: handleUploadDocument,
    batchUpload: handleBatchUpload,
    fetchDocument: handleFetchDocument,
    fetchDocumentResult: handleFetchDocumentResult,
    syncSATDocuments,
    fetchStats,
    setCurrentDocument,
    deleteDocument,
    clearError,
  }
}
