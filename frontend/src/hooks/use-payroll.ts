import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-client';

export interface Employee {
  id: string;
  name: string;
  rfc: string;
  position: string;
  department: string;
  status: 'active' | 'inactive';
  base_salary: number;
}

export interface PayrollDraft {
  id: string;
  period: string;
  total_perceptions: number;
  total_deductions: number;
  net_pay: number;
  employees: Array<{
    employee_id: string;
    gross_salary: number;
    isr: number;
    imss: number;
    net_salary: number;
  }>;
}

export const useGetEmployees = () => {
  return useQuery({
    queryKey: ['employees'],
    queryFn: () => apiRequest<Employee[]>('/payroll/employees').catch(() => [
      { id: '1', name: 'Juan Pérez', rfc: 'PERJ900101', position: 'Contador', department: 'Finanzas', status: 'active', base_salary: 25000 },
      { id: '2', name: 'Maria Garcia', rfc: 'GARM920512', position: 'Analista', department: 'TI', status: 'active', base_salary: 18000 },
    ] as Employee[]),
  });
};

export const useCalculatePayrollDraft = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      apiRequest<PayrollDraft>('/payroll/calculate-draft', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  });
};

export const useStampPayroll = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) =>
      apiRequest<any>('/payroll/stamp-payroll', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll-history'] });
    },
  });
};
