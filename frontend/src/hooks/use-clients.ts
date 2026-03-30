import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-client';
import { Client, CreateClientRequest, UpdateClientRequest } from '@/types/client';

export const clientKeys = {
  all: ['clients'] as const,
  lists: () => [...clientKeys.all, 'list'] as const,
  list: (filters: string) => [...clientKeys.lists(), { filters }] as const,
  details: () => [...clientKeys.all, 'detail'] as const,
  detail: (id: string) => [...clientKeys.details(), id] as const,
};

export const useGetClients = (filters: string = '') => {
  return useQuery({
    queryKey: clientKeys.list(filters),
    queryFn: () => apiRequest<Client[]>(`/clients${filters ? `?${filters}` : ''}`),
  });
};

export const useGetClient = (id: string) => {
  return useQuery({
    queryKey: clientKeys.detail(id),
    queryFn: () => apiRequest<Client>(`/clients/${id}`),
    enabled: !!id,
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateClientRequest) =>
      apiRequest<Client>('/clients', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
    },
  });
};

export const useUpdateClient = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateClientRequest) =>
      apiRequest<Client>(`/clients/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(id) });
    },
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiRequest<void>(`/clients/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
    },
  });
};
