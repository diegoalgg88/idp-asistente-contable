/**
 * Classification Hooks
 * Custom hooks para operaciones de clasificación contable con React Query
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { ClassificationSuggestion, ClassificationStats, Account } from '@/store/classificationStore';

// ============================================================================
// TYPES
// ============================================================================

interface DocumentSuggestionsParams {
  document_ids: number[];
}

interface SubmitFeedbackParams {
  document_id: number;
  suggested_account: string;
  corrected_account: string;
  feedback_type: 'correct' | 'incorrect' | 'partial';
}

interface ManualClassificationParams {
  document_id: number;
  account_code: string;
  account_name?: string;
}

interface GetAccountsParams {
  category?: string;
}

// ============================================================================
// GET DOCUMENT SUGGESTIONS
// ============================================================================

export const useDocumentSuggestions = (documentIds: number[]) => {
  return useQuery<ClassificationSuggestion[], Error>({
    queryKey: ['classification-suggestions', documentIds],
    queryFn: async () => {
      if (!documentIds || documentIds.length === 0) {
        return [];
      }

      const queryParams = documentIds
        .map((id) => `document_ids=${id}`)
        .join('&');

      const response = await api.post<ClassificationSuggestion[]>(
        `/v1/classification/suggest?${queryParams}`
      );
      return response.data;
    },
    enabled: documentIds.length > 0,
  });
};

// ============================================================================
// SUBMIT FEEDBACK
// ============================================================================

export const useSubmitFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, SubmitFeedbackParams>({
    mutationFn: async (params) => {
      const formData = new FormData();
      formData.append('document_id', params.document_id.toString());
      formData.append('suggested_account', params.suggested_account);
      formData.append('corrected_account', params.corrected_account);
      formData.append('feedback_type', params.feedback_type);

      await api.post('/v1/classification/feedback', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['classification-suggestions'] });
      queryClient.invalidateQueries({ queryKey: ['classification-stats'] });
    },
  });
};

// ============================================================================
// MANUAL CLASSIFICATION
// ============================================================================

export const useManualClassification = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, ManualClassificationParams>({
    mutationFn: async (params) => {
      await api.put(`/v1/classification/documents/${params.document_id}/classify`, {
        account_code: params.account_code,
        account_name: params.account_name,
      });
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['classification-suggestions'] });
      queryClient.invalidateQueries({ queryKey: ['classification-stats'] });
    },
  });
};

// ============================================================================
// GET CLASSIFICATION STATS
// ============================================================================

export const useClassificationStats = () => {
  return useQuery<ClassificationStats, Error>({
    queryKey: ['classification-stats'],
    queryFn: async () => {
      const response = await api.get<ClassificationStats>('/v1/classification/accuracy');
      return response.data;
    },
    refetchInterval: 60000, // Refrescar cada minuto
  });
};

// ============================================================================
// GET AVAILABLE ACCOUNTS
// ============================================================================

export const useAvailableAccounts = (category?: string) => {
  return useQuery<Account[], Error>({
    queryKey: ['classification-accounts', category],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (category) queryParams.append('category', category);

      const response = await api.get<Account[]>(
        `/v1/classification/accounts?${queryParams.toString()}`
      );
      return response.data;
    },
  });
};

// ============================================================================
// BATCH CLASSIFY
// ============================================================================

interface BatchClassifyParams {
  document_ids: number[];
  auto_apply?: boolean;
}

interface BatchClassifyResponse {
  total_documents: number;
  classified: number;
  auto_applied: number;
  results: Array<{
    document_id: number;
    suggested_account: string;
    account_name: string;
    confidence_score: number;
    top_3: Array<{
      rank: number;
      account_code: string;
      account_name: string;
      confidence: number;
    }>;
    auto_applied: boolean;
  }>;
}

export const useBatchClassify = () => {
  const queryClient = useQueryClient();

  return useMutation<BatchClassifyResponse, Error, BatchClassifyParams>({
    mutationFn: async (params) => {
      const queryParams = new URLSearchParams();
      params.document_ids.forEach((id) => queryParams.append('document_ids', id.toString()));
      if (params.auto_apply) queryParams.append('auto_apply', 'true');

      const response = await api.post<BatchClassifyResponse>(
        `/v1/classification/batch/classify?${queryParams.toString()}`
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['classification-suggestions'] });
      queryClient.invalidateQueries({ queryKey: ['classification-stats'] });
    },
  });
};

export default {
  useDocumentSuggestions,
  useSubmitFeedback,
  useManualClassification,
  useClassificationStats,
  useAvailableAccounts,
  useBatchClassify,
};
