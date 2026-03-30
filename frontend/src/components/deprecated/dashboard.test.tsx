import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Dashboard from './Dashboard'

// Mock de los stores
const mockUseIDPStore = vi.fn()
const mockUseModulesStore = vi.fn()

vi.mock('@/store/idp.store', () => ({
  useIDPStore: (...args: any[]) => mockUseIDPStore(...args),
}))

vi.mock('@/store/modules.store', () => ({
  useModulesStore: (...args: any[]) => mockUseModulesStore(...args),
}))

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock de los hooks
    mockUseIDPStore.mockImplementation(() => ({
      stats: {
        total_documents: 150,
        processed_documents: 142,
        average_confidence: 94.5,
        processing_time_avg: 2.3,
      },
      fetchStats: vi.fn(),
    }))
    
    mockUseModulesStore.mockImplementation(() => ({
      workspace: {
        dashboard: { fiscal_score: 9.8 },
        calendar: [],
        metrics: {
          extraction_accuracy: 98.1,
          average_latency_ms: 3200,
          model: 'llama-3.3-70b-instruct',
        },
      },
      fetchWorkspace: vi.fn(),
    }))
  })

  it('renderiza correctamente', () => {
    render(<Dashboard />)
    expect(screen.getByText(/panel de control/i)).toBeInTheDocument()
  })

  it('muestra las tarjetas de estadísticas', () => {
    render(<Dashboard />)
    
    expect(screen.getByText(/total procesado/i)).toBeInTheDocument()
    expect(screen.getByText(/150/)).toBeInTheDocument()
    expect(screen.getByText(/completados/i)).toBeInTheDocument()
    expect(screen.getByText(/142/)).toBeInTheDocument()
    expect(screen.getByText(/confianza promedio/i)).toBeInTheDocument()
    expect(screen.getByText(/94.5%/i)).toBeInTheDocument()
  })
})
