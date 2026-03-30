/**
 * Reconciliation Store
 * Zustand store para gestión de estado de conciliación bancaria
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface BankStatement {
  id: number;
  user_id: number;
  banco: string;
  cuenta: string | null;
  fecha_inicio: string;
  fecha_fin: string;
  saldo_inicial: number;
  saldo_final: number;
  archivo_path: string;
  archivo_nombre: string | null;
  archivo_size: number | null;
  estado: 'pending' | 'processing' | 'completed' | 'failed';
  total_transacciones: number;
  total_matches: number;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface BankTransaction {
  id: number;
  bank_statement_id: number;
  fecha: string;
  concepto: string;
  monto: number;
  tipo: 'abono' | 'cargo';
  referencia?: string;
  proveedor?: string;
  estado: 'pending' | 'matched' | 'ignored';
  created_at: string;
  updated_at: string;
}

export interface ReconciliationBatch {
  batch_id: number;
  bank_statement_id: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  total_transactions: number;
  total_matches_exact: number;
  total_matches_fuzzy: number;
  total_matches_llm: number;
  total_unmatched: number;
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
}

export interface MatchResult {
  match_id: number;
  bank_transaction_id: number;
  cfdi_id: number;
  match_type: 'exact' | 'fuzzy' | 'llm_confirmed' | 'llm_review';
  confidence_score: number;
  bank_fecha: string;
  bank_concepto: string;
  bank_monto: number;
  cfdi_fecha: string | null;
  cfdi_descripcion: string | null;
  cfdi_monto: number | null;
  estado: 'pending' | 'confirmed' | 'rejected';
  llm_reason?: string | null;
  llm_flags?: string[] | null;
}

export interface ReconciliationStats {
  total_batches: number;
  total_transactions: number;
  total_matches: number;
  match_rate: number;
  exact_matches: number;
  fuzzy_matches: number;
  llm_matches: number;
  human_review_matches: number;
  unmatched_transactions: number;
}

interface ReconciliationState {
  // Estado de carga
  isLoading: boolean;
  error: string | null;

  // Estados de cuenta
  bankStatements: BankStatement[];
  selectedBankStatement: BankStatement | null;

  // Lotes de conciliación
  batches: ReconciliationBatch[];
  currentBatch: ReconciliationBatch | null;

  // Matches
  matches: MatchResult[];
  filteredMatches: MatchResult[];

  // Estadísticas
  stats: ReconciliationStats | null;

  // Filtros
  filters: {
    matchType?: 'exact' | 'fuzzy' | 'llm_confirmed' | 'llm_review';
    estado?: 'pending' | 'confirmed' | 'rejected';
    confidenceMin?: number;
    searchQuery?: string;
  };

  // Acciones
  setBankStatements: (statements: BankStatement[]) => void;
  setSelectedBankStatement: (statement: BankStatement | null) => void;
  addBankStatement: (statement: BankStatement) => void;

  setBatches: (batches: ReconciliationBatch[]) => void;
  setCurrentBatch: (batch: ReconciliationBatch | null) => void;
  updateBatch: (batchId: number, updates: Partial<ReconciliationBatch>) => void;

  setMatches: (matches: MatchResult[]) => void;
  setFilteredMatches: (matches: MatchResult[]) => void;
  applyFilters: () => void;

  setStats: (stats: ReconciliationStats | null) => void;

  setFilters: (filters: Partial<ReconciliationState['filters']>) => void;
  clearFilters: () => void;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Acciones de match
  confirmMatch: (matchId: number) => void;
  rejectMatch: (matchId: number, reason: string) => void;
}

export const useReconciliationStore = create<ReconciliationState>()(
  devtools(
    persist(
      (set, get) => ({
        // Estado inicial
        isLoading: false,
        error: null,
        bankStatements: [],
        selectedBankStatement: null,
        batches: [],
        currentBatch: null,
        matches: [],
        filteredMatches: [],
        stats: null,
        filters: {},

        // Acciones de estados de cuenta
        setBankStatements: (statements) => set({ bankStatements: statements }),

        setSelectedBankStatement: (statement) => set({ selectedBankStatement: statement }),

        addBankStatement: (statement) =>
          set((state) => ({
            bankStatements: [...state.bankStatements, statement],
          })),

        // Acciones de lotes
        setBatches: (batches) => set({ batches }),

        setCurrentBatch: (batch) => set({ currentBatch: batch }),

        updateBatch: (batchId, updates) =>
          set((state) => ({
            batches: state.batches.map((batch) =>
              batch.batch_id === batchId ? { ...batch, ...updates } : batch
            ),
            currentBatch:
              state.currentBatch?.batch_id === batchId
                ? { ...state.currentBatch, ...updates }
                : state.currentBatch,
          })),

        // Acciones de matches
        setMatches: (matches) => set({ matches, filteredMatches: matches }),

        setFilteredMatches: (matches) => set({ filteredMatches: matches }),

        applyFilters: () => {
          const { matches, filters } = get();
          let filtered = [...matches];

          // Filtrar por tipo de match
          if (filters.matchType) {
            filtered = filtered.filter((match) => match.match_type === filters.matchType);
          }

          // Filtrar por estado
          if (filters.estado) {
            filtered = filtered.filter((match) => match.estado === filters.estado);
          }

          // Filtrar por confianza mínima
          if (filters.confidenceMin !== undefined) {
            filtered = filtered.filter(
              (match) => match.confidence_score >= (filters.confidenceMin || 0)
            );
          }

          // Filtrar por búsqueda
          if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            filtered = filtered.filter(
              (match) =>
                match.bank_concepto.toLowerCase().includes(query) ||
                (match.cfdi_descripcion &&
                  match.cfdi_descripcion.toLowerCase().includes(query))
            );
          }

          set({ filteredMatches: filtered });
        },

        // Acciones de estadísticas
        setStats: (stats) => set({ stats }),

        // Acciones de filtros
        setFilters: (filters) =>
          set((state) => ({
            filters: { ...state.filters, ...filters },
          })),

        clearFilters: () => set({ filters: {}, filteredMatches: get().matches }),

        // Acciones de estado
        setLoading: (loading) => set({ isLoading: loading }),

        setError: (error) => set({ error }),

        // Acciones de match
        confirmMatch: (matchId) =>
          set((state) => ({
            matches: state.matches.map((match) =>
              match.match_id === matchId ? { ...match, estado: 'confirmed' } : match
            ),
            filteredMatches: state.filteredMatches.map((match) =>
              match.match_id === matchId ? { ...match, estado: 'confirmed' } : match
            ),
          })),

        rejectMatch: (matchId, reason) =>
          set((state) => ({
            matches: state.matches.map((match) =>
              match.match_id === matchId
                ? { ...match, estado: 'rejected', llm_reason: reason }
                : match
            ),
            filteredMatches: state.filteredMatches.map((match) =>
              match.match_id === matchId
                ? { ...match, estado: 'rejected', llm_reason: reason }
                : match
            ),
          })),
      }),
      {
        name: 'reconciliation-storage',
        partialize: (state) => ({
          filters: state.filters,
          bankStatements: state.bankStatements,
        }),
      }
    ),
    { name: 'ReconciliationStore' }
  )
);

export default useReconciliationStore;
