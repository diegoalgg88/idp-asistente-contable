/**
 * Workflow Toast Notifications
 * Hook para mostrar notificaciones toast de eventos de workflows
 */

import { useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'

interface WorkflowProgressData {
  type: 'progress_update' | 'init' | 'error'
  workflow_id: number
  workflow_name?: string
  progress: number
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  step_message?: string
  message?: string
  error?: string
}

export function useWorkflowToasts() {
  const { toast } = useToast()

  const showProgressToast = (data: WorkflowProgressData) => {
    // Solo mostrar toasts para eventos importantes
    if (data.status === 'completed') {
      toast({
        title: '✅ Workflow Completado',
        description: data.message || `${data.workflow_name || 'Workflow'} completado exitosamente`,
        variant: 'default',
        duration: 5000,
      })
    } else if (data.status === 'failed') {
      toast({
        title: '❌ Workflow Fallido',
        description: data.error || 'Ocurrió un error en la ejecución del workflow',
        variant: 'destructive',
        duration: 8000,
      })
    } else if (data.status === 'running' && data.progress === 0) {
      toast({
        title: '🔄 Workflow Iniciado',
        description: data.step_message || `${data.workflow_name || 'Workflow'} en ejecución...`,
        variant: 'default',
        duration: 3000,
      })
    }
  }

  return {
    showProgressToast,
  }
}
