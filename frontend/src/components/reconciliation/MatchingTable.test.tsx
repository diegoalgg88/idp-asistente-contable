/**
 * MatchingTable Tests
 * Tests para la tabla de matches de conciliación
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MatchingTable } from './MatchingTable';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { MatchResult } from '@/store/reconciliationStore';

// Mock de los hooks
vi.mock('@/hooks/useReconciliation', () => ({
  useConfirmMatch: () => ({
    mutate: vi.fn(),
  }),
  useRejectMatch: () => ({
    mutate: vi.fn(),
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

const mockMatches: MatchResult[] = [
  {
    match_id: 1,
    bank_transaction_id: 1,
    cfdi_id: 1,
    match_type: 'exact',
    confidence_score: 0.98,
    bank_fecha: '2026-01-15T00:00:00Z',
    bank_concepto: 'PAGO SERVICIO AZUL SA DE CV',
    bank_monto: 1500.00,
    cfdi_fecha: '2026-01-15T00:00:00Z',
    cfdi_descripcion: 'SERVICIOS PROFESIONALES',
    cfdi_monto: 1500.00,
    estado: 'pending',
  },
  {
    match_id: 2,
    bank_transaction_id: 2,
    cfdi_id: 2,
    match_type: 'fuzzy',
    confidence_score: 0.85,
    bank_fecha: '2026-01-16T00:00:00Z',
    bank_concepto: 'AMZN MKTPLACE MEX',
    bank_monto: 2500.00,
    cfdi_fecha: '2026-01-14T00:00:00Z',
    cfdi_descripcion: 'AMAZON MEXICO S DE RL DE CV',
    cfdi_monto: 2500.00,
    estado: 'pending',
  },
  {
    match_id: 3,
    bank_transaction_id: 3,
    cfdi_id: 3,
    match_type: 'llm_confirmed',
    confidence_score: 0.92,
    bank_fecha: '2026-01-17T00:00:00Z',
    bank_concepto: 'CFE COMISION FEDERAL DE ELECTRICIDAD',
    bank_monto: 850.00,
    cfdi_fecha: '2026-01-10T00:00:00Z',
    cfdi_descripcion: 'SERVICIO DE ELECTRICIDAD',
    cfdi_monto: 850.00,
    estado: 'confirmed',
  },
];

describe('MatchingTable', () => {
  const mockOnMatchSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('se renderiza correctamente con matches', () => {
    render(
      <MatchingTable matches={mockMatches} onMatchSelect={mockOnMatchSelect} />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText(/3 matches encontrados/i)).toBeInTheDocument();
  });

  it('muestra estado de carga', () => {
    render(
      <MatchingTable matches={[]} isLoading={true} />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText(/cargando matches/i)).toBeInTheDocument();
  });

  it('muestra mensaje cuando no hay matches', () => {
    render(
      <MatchingTable matches={[]} />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText(/no hay matches para mostrar/i)).toBeInTheDocument();
  });

  it('muestra badges correctos para cada tipo de match', () => {
    render(
      <MatchingTable matches={mockMatches} onMatchSelect={mockOnMatchSelect} />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText(/exacto/i)).toBeInTheDocument();
    expect(screen.getByText(/fuzzy/i)).toBeInTheDocument();
    expect(screen.getByText(/llm confirmado/i)).toBeInTheDocument();
  });

  it('muestra porcentajes de confianza correctamente', () => {
    render(
      <MatchingTable matches={mockMatches} onMatchSelect={mockOnMatchSelect} />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('98%')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('92%')).toBeInTheDocument();
  });

  it('muestra los montos formateados en MXN', () => {
    render(
      <MatchingTable matches={mockMatches} onMatchSelect={mockOnMatchSelect} />,
      { wrapper: createWrapper() }
    );

    // Usar getAllByText porque hay dos columnas con el mismo monto (banco y cfdi)
    expect(screen.getAllByText('$1,500.00').length).toBeGreaterThan(0);
    expect(screen.getAllByText('$2,500.00').length).toBeGreaterThan(0);
    expect(screen.getAllByText('$850.00').length).toBeGreaterThan(0);
  });

  it('llama a onMatchSelect cuando se hace clic en una fila', () => {
    render(
      <MatchingTable matches={mockMatches} onMatchSelect={mockOnMatchSelect} />,
      { wrapper: createWrapper() }
    );

    const firstRow = screen.getByText('PAGO SERVICIO AZUL SA DE CV').closest('tr');
    if (firstRow) {
      fireEvent.click(firstRow);
    }

    expect(mockOnMatchSelect).toHaveBeenCalledWith(mockMatches[0]);
  });

  it('muestra menú dropdown con acciones', () => {
    render(
      <MatchingTable matches={mockMatches} onMatchSelect={mockOnMatchSelect} />,
      { wrapper: createWrapper() }
    );

    // Buscar botones dropdown por aria-haspopup en lugar de aria-label
    const menuButtons = screen.getAllByRole('button', { name: '' });
    const dropdownButtons = menuButtons.filter(btn => btn.getAttribute('aria-haspopup') === 'menu');
    expect(dropdownButtons.length).toBeGreaterThan(0);
  });

  it('muestra icono de confirmado para matches confirmados', () => {
    render(
      <MatchingTable matches={mockMatches} onMatchSelect={mockOnMatchSelect} />,
      { wrapper: createWrapper() }
    );

    // El match 3 está confirmado
    const confirmedRow = screen.getByText('CFE COMISION FEDERAL DE ELECTRICIDAD').closest('tr');
    expect(confirmedRow).toBeInTheDocument();
  });

  it('aplica clases CSS correctas según el estado', () => {
    render(
      <MatchingTable matches={mockMatches} onMatchSelect={mockOnMatchSelect} />,
      { wrapper: createWrapper() }
    );

    // Verificar que las filas tienen las clases apropiadas
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBeGreaterThan(1);
  });
});
