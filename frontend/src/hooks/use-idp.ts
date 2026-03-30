import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-client';

export interface DocumentStatus {
  document_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  document_type: string;
  created_at: string;
  updated_at: string;
  extracted_data?: any;
  confidence_score?: number;
  error_message?: string;
}

export const useUploadDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, type }: { file: File; type: string }) => {
      const formData = new FormData();
      formData.append('file', file);
      return apiRequest<any>(`/idp/process?document_type=${type}`, {
        method: 'POST',
        body: formData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
};

export const useGetDocuments = () => {
  return useQuery({
    queryKey: ['documents'],
    queryFn: () => apiRequest<DocumentStatus[]>('/idp/list'), // Assuming a list endpoint exists or mapping from dashboard
  });
};

export const useGetDocumentStatus = (id: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ['document', id],
    queryFn: () => apiRequest<DocumentStatus>(`/idp/${id}`),
    enabled: !!id && enabled,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return (status === 'pending' || status === 'processing') ? 3000 : false;
    },
  });
};
