import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Documents from './Documents'

// Mock del store con factory function
const mockUseIDPStore = vi.fn()
vi.mock('@/store/idp.store', () => ({
  useIDPStore: (...args: any[]) => mockUseIDPStore(...args),
}))

// Mock simple para el contexto de Outlet
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...(actual as any),
    useOutletContext: () => ({ activeView: 'all' }),
  }
})

describe('Documents', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock del hook
    mockUseIDPStore.mockImplementation(() => ({
      documents: [
        {
          id: '1',
          tenant_id: 'tenant-1',
          document_type: 'cfdi',
          file_path: '/documents/test.pdf',
          original_filename: 'test.pdf',
          extracted_data: null,
          confidence_score: 95,
          status: 'completed',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      currentDocument: null,
      stats: null,
      isUploading: false,
      uploadProgress: 0,
      isLoading: false,
      error: null,
      uploadDocument: vi.fn(),
      batchUpload: vi.fn(),
      fetchDocument: vi.fn(),
      fetchDocumentResult: vi.fn(),
      fetchStats: vi.fn(),
      setCurrentDocument: vi.fn(),
      deleteDocument: vi.fn(),
      clearError: vi.fn(),
    }))
  })

  it('renderiza correctamente', () => {
    render(
      <MemoryRouter>
        <Documents />
      </MemoryRouter>
    )
    expect(screen.getByText(/explorador/i)).toBeInTheDocument()
  })

  it('muestra el botón de upload', () => {
    render(
      <MemoryRouter>
        <Documents />
      </MemoryRouter>
    )
    
    expect(screen.getByText(/carga de archivos/i)).toBeInTheDocument()
    expect(screen.getByText(/soltar cfdi o/i)).toBeInTheDocument()
  })
})
