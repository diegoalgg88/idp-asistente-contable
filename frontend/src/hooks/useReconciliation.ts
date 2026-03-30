/**
 * Reconciliation Hooks
 * Custom hooks para operaciones de conciliación bancaria con React Query
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import type {
  BankStatement,
  ReconciliationBatch,
  MatchResult,
  ReconciliationStats,
} from '@/store/reconciliationStore';

// ============================================================================
// TYPES
// ============================================================================

interface UploadBankStatementParams {
  file: File;
  banco?: string;
}

interface UploadBankStatementResponse {
  batch_id: number;
  bank_statement_id: number;
  bank_name: string;
  bank_code: string;
  total_transactions: number;
  status: string;
  message: string;
}

interface GetMatchesParams {
  batch_id: number;
  match_type?: 'exact' | 'fuzzy' | 'llm_confirmed' | 'llm_review';
  estado?: 'pending' | 'confirmed' | 'rejected';
  confidence_min?: number;
  limit?: number;
}

interface ConfirmMatchParams {
  match_id: number;
}

interface RejectMatchParams {
  match_id: number;
  reason: string;
}

// ============================================================================
// UPLOAD BANK STATEMENT
// ============================================================================

export const useUploadBankStatement = () => {
  const queryClient = useQueryClient();

  return useMutation<UploadBankStatementResponse, Error, FormData>({
    mutationFn: async (formData: FormData) => {
      const response = await api.post<UploadBankStatementResponse>(
        '/v1/reconciliation/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['bank-statements'] });
      queryClient.invalidateQueries({ queryKey: ['reconciliation-batches'] });
    },
  });
};

// ============================================================================
// GET BATCH STATUS
// ============================================================================

export const useBatchStatus = (batchId: number | null) => {
  return useQuery<ReconciliationBatch, Error>({
    queryKey: ['reconciliation-batch', batchId],
    queryFn: async () => {
      if (!batchId) throw new Error('Batch ID requerido');

      const response = await api.get<ReconciliationBatch>(
        `/v1/reconciliation/batches/${batchId}`
      );
      return response.data;
    },
    enabled: !!batchId,
    refetchInterval: (query) => {
      // Refrescar cada 2 segundos si está procesando
      const batch = query.state.data;
      if (batch?.status === 'pending' || batch?.status === 'processing') {
        return 2000;
      }
      return false;
    },
  });
};

// ============================================================================
// GET MATCHES
// ============================================================================

export const useMatches = (params: GetMatchesParams) => {
  return useQuery<MatchResult[], Error>({
    queryKey: ['reconciliation-matches', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      if (params.batch_id) queryParams.append('batch_id', params.batch_id.toString());
      if (params.match_type) queryParams.append('match_type', params.match_type);
      if (params.estado) queryParams.append('estado', params.estado);
      if (params.confidence_min)
        queryParams.append('confidence_min', params.confidence_min.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());

      const response = await api.get<MatchResult[]>(
        `/v1/reconciliation/matches?${queryParams.toString()}`
      );
      return response.data;
    },
    enabled: !!params.batch_id,
  });
};

// ============================================================================
// CONFIRM MATCH
// ============================================================================

export const useConfirmMatch = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, ConfirmMatchParams>({
    mutationFn: async ({ match_id }) => {
      await api.post(`/v1/reconciliation/matches/${match_id}/confirm`);
    },
    onSuccess: () => {
      // Invalidar queries de matches
      queryClient.invalidateQueries({ queryKey: ['reconciliation-matches'] });
      queryClient.invalidateQueries({ queryKey: ['reconciliation-stats'] });
    },
  });
};

// ============================================================================
// REJECT MATCH
// ============================================================================

export const useRejectMatch = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, RejectMatchParams>({
    mutationFn: async ({ match_id, reason }) => {
      const formData = new FormData();
      formData.append('reason', reason);

      await api.post(`/v1/reconciliation/matches/${match_id}/reject`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    },
    onSuccess: () => {
      // Invalidar queries de matches
      queryClient.invalidateQueries({ queryKey: ['reconciliation-matches'] });
      queryClient.invalidateQueries({ queryKey: ['reconciliation-stats'] });
    },
  });
};

// ============================================================================
// GET RECONCILIATION STATS
// ============================================================================

export const useReconciliationStats = () => {
  return useQuery<ReconciliationStats, Error>({
    queryKey: ['reconciliation-stats'],
    queryFn: async () => {
      const response = await api.get<ReconciliationStats>('/v1/reconciliation/stats');
      return response.data;
    },
    refetchInterval: 30000, // Refrescar cada 30 segundos
  });
};

// ============================================================================
// GET BANK STATEMENTS (Lista)
// ============================================================================

export const useBankStatements = () => {
  return useQuery<BankStatement[], Error>({
    queryKey: ['bank-statements'],
    queryFn: async () => {
      // TODO: Implementar endpoint GET /v1/reconciliation/statements cuando exista
      // Por ahora retornamos array vacío
      return [];
    },
  });
};

export default {
  useUploadBankStatement,
  useBatchStatus,
  useMatches,
  useConfirmMatch,
  useRejectMatch,
  useReconciliationStats,
  useBankStatements,
};
