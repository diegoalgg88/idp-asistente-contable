import { useQuery } from '@tanstack/react-query'

interface HealthScore {
  overall: number
  compliance: number
  documentation: number
  fiscal: number
  accounting: number
  status: 'excellent' | 'good' | 'warning' | 'critical'
  recommendations: string[]
  lastUpdated: string
}

/**
 * Hook para obtener Tax Health Score con caching
 * staleTime: 5 minutos
 * gcTime: 15 minutos
 */
export function useHealthScore(tenantId: string) {
  return useQuery({
    queryKey: ['healthScore', tenantId],
    queryFn: async (): Promise<HealthScore> => {
      // TODO: Implementar llamada a API de health score
      // Simulación para demostración
      return {
        overall: 85,
        compliance: 90,
        documentation: 88,
        fiscal: 82,
        accounting: 80,
        status: 'good',
        recommendations: [
          'Actualizar CFDI de nómina pendientes',
          'Revisar deducciones personales del ejercicio',
          'Completar documentación de IVA acreditable',
        ],
        lastUpdated: new Date().toISOString(),
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
    retry: 2,
    enabled: !!tenantId,
  })
}

/**
 * Hook para obtener métricas de cumplimiento
 */
export function useComplianceMetrics(tenantId: string) {
  return useQuery({
    queryKey: ['complianceMetrics', tenantId],
    queryFn: async () => {
      return {
        cfdiCompliance: 95,
        taxCompliance: 88,
        accountingCompliance: 92,
        pendingDocuments: 3,
        upcomingDeadlines: [
          { concept: 'Declaración mensual IVA', date: '2026-03-17' },
          { concept: 'Declaración mensual ISR', date: '2026-03-17' },
        ],
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    enabled: !!tenantId,
  })
}
