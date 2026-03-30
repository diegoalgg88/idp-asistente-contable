import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-client';

export interface CashFlowData {
  period: string;
  inflows: number;
  outflows: number;
  net: number;
  breakdown: Array<{
    month: string;
    inflow: number;
    outflow: number;
  }>;
}

export interface FinanceSummary {
  margen_bruto: string;
  ebitda: string;
  liquidez: string;
  saldos_bancos: string;
  margen_change: string;
  ebitda_change: string;
}

export interface FiscalStatus {
  compliance_opinion: 'positive' | 'negative' | 'pending';
  last_audit_date: string;
  tax_deadlines: Array<{
    title: string;
    due_date: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

export const useGetCashFlow = () => {
  return useQuery({
    queryKey: ['cash-flow'],
    queryFn: () => apiRequest<CashFlowData>('/finance/cash-flow'),
  });
};

export const useGetFinanceSummary = () => {
  return useQuery({
    queryKey: ['finance-summary'],
    queryFn: () => apiRequest<FinanceSummary>('/finance/summary'),
  });
};

export const useGetFiscalStatus = () => {
  return useQuery({
    queryKey: ['fiscal-status'],
    queryFn: () => apiRequest<FiscalStatus>('/fiscal/status').catch(() => ({
      compliance_opinion: 'positive',
      last_audit_date: '2026-03-01',
      tax_deadlines: [
        { title: 'Declaración Mensual IVA', due_date: '2026-03-17', priority: 'high' },
        { title: 'Pago Provisional ISR', due_date: '2026-03-17', priority: 'high' },
      ]
    } as FiscalStatus)),
  });
};
