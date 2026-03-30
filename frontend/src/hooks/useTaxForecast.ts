import { useQuery } from '@tanstack/react-query'

interface TaxForecast {
  estimatedTax: number
  effectiveRate: number
  deductions: number
  taxableIncome: number
  period: string
  confidence: number
}

/**
 * Hook para obtener proyección de impuestos con caching
 * staleTime: 10 minutos (los datos fiscales cambian menos frecuentemente)
 * gcTime: 30 minutos
 */
export function useTaxForecast(tenantId: string, period?: string) {
  return useQuery({
    queryKey: ['taxForecast', tenantId, period],
    queryFn: async (): Promise<TaxForecast> => {
      // TODO: Implementar llamada a API de proyección fiscal
      // Simulación para demostración
      return {
        estimatedTax: 15400.00,
        effectiveRate: 23.5,
        deductions: 45000.00,
        taxableIncome: 65500.00,
        period: period || '2026-03',
        confidence: 0.89,
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
    retry: 2,
    enabled: !!tenantId,
  })
}

/**
 * Hook para obtener proyección anual de ISR
 */
export function useAnnualTaxProjection(tenantId: string, year?: number) {
  return useQuery({
    queryKey: ['annualTaxProjection', tenantId, year],
    queryFn: async () => {
      // TODO: Implementar llamada a API de proyección anual
      const currentYear = year || new Date().getFullYear()
      return {
        year: currentYear,
        estimatedAnnualTax: 184800.00,
        monthlyAverage: 15400.00,
        effectiveAnnualRate: 23.5,
        totalDeductions: 540000.00,
        totalIncome: 786000.00,
      }
    },
    staleTime: 30 * 60 * 1000, // 30 minutos
    gcTime: 60 * 60 * 1000, // 60 minutos
    enabled: !!tenantId,
  })
}
