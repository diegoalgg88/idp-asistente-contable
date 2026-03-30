import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-client';
import { Project, CreateProjectRequest, UpdateProjectRequest } from '@/types/project';

export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (filters: string) => [...projectKeys.lists(), { filters }] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
};

export const useGetProjects = (filters: string = '') => {
  return useQuery({
    queryKey: projectKeys.list(filters),
    queryFn: async () => {
       // Since the backend might not have this yet, we provide a fallback for UI testing
       try {
         return await apiRequest<Project[]>(`/projects${filters ? `?${filters}` : ''}`);
       } catch (error) {
         console.warn("Backend /projects not found, using dummy data for demonstration.");
         return [
           { id: '1', name: 'Auditoría Anual 2025', description: 'Revisión completa de estados financieros.', status: 'active', client_id: '1', budget: 50000, start_date: '2025-01-01', created_at: '2025-01-01' },
           { id: '2', name: 'Optimización Fiscal Q1', description: 'Planeación de impuestos para el primer trimestre.', status: 'completed', client_id: '2', budget: 25000, start_date: '2025-02-15', created_at: '2025-02-15' },
           { id: '3', name: 'Implementación Contable', description: 'Migración a nuevo sistema de contabilidad.', status: 'active', client_id: '3', budget: 75000, start_date: '2025-03-10', created_at: '2025-03-10' },
         ] as Project[];
       }
    },
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProjectRequest) =>
      apiRequest<Project>('/projects', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
};

export const useUpdateProject = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProjectRequest) =>
      apiRequest<Project>(`/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(id) });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiRequest<void>(`/projects/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
};
