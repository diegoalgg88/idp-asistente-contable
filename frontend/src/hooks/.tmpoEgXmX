import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-client';

export interface DashboardKPIs {
  total_documents: number;
  processed_documents: number;
  pending_documents: number;
  average_confidence: number;
  total_clients: number;
  active_clients: number;
  monthly_revenue: number;
  pending_declarations: number;
  fiscal_score: number;
}

export const useGetDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => apiRequest<DashboardKPIs>('/workspace/dashboard'),
  });
};
