/**
 * Classification Store
 * Zustand store para gestión de estado de clasificación contable
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface ClassificationSuggestion {
  document_id: number;
  document_concept: string;
  document_amount: number;
  suggested_account: string;
  account_name: string;
  puntuacion_confianza: number;
  top_3_suggestions: Array<{
    rank: number;
    account_code: string;
    account_name: string;
    confidence: number;
  }>;
}

export interface ClassificationFeedback {
  document_id: number;
  suggested_account: string;
  corrected_account: string;
  feedback_type: 'correct' | 'incorrect' | 'partial';
  timestamp: string;
}

export interface ClassificationStats {
  total_classified: number;
  correct_classifications: number;
  accuracy_rate: number;
  avg_puntuacion_confianza: number;
  last_30_days_accuracy: number;
  feedback_count: number;
}

interface ClassificationState {
  // Estado de carga
  isLoading: boolean;
  error: string | null;

  // Sugerencias
  suggestions: ClassificationSuggestion[];
  selectedSuggestion: ClassificationSuggestion | null;

  // Feedback
  feedback: ClassificationFeedback[];

  // Estadísticas
  stats: ClassificationStats | null;

  // Cuentas disponibles
  availableAccounts: Account[];

  // Acciones
  setSuggestions: (suggestions: ClassificationSuggestion[]) => void;
  setSelectedSuggestion: (suggestion: ClassificationSuggestion | null) => void;
  addSuggestion: (suggestion: ClassificationSuggestion) => void;

  setFeedback: (feedback: ClassificationFeedback[]) => void;
  addFeedback: (feedback: ClassificationFeedback) => void;

  setStats: (stats: ClassificationStats | null) => void;

  setAvailableAccounts: (accounts: Account[]) => void;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Acciones de clasificación
  acceptSuggestion: (documentId: number, account: string) => void;
  rejectSuggestion: (documentId: number) => void;
}

export interface Account {
  code: string;
  name: string;
  category: string;
  parent_code: string | null;
}

export const useClassificationStore = create<ClassificationState>()(
  devtools(
    persist(
      (set) => ({
        // Estado inicial
        isLoading: false,
        error: null,
        suggestions: [],
        selectedSuggestion: null,
        feedback: [],
        stats: null,
        availableAccounts: [],

        // Acciones de sugerencias
        setSuggestions: (suggestions) => set({ suggestions }),

        setSelectedSuggestion: (suggestion) => set({ selectedSuggestion: suggestion }),

        addSuggestion: (suggestion) =>
          set((state) => ({
            suggestions: [...state.suggestions, suggestion],
          })),

        // Acciones de feedback
        setFeedback: (feedback) => set({ feedback }),

        addFeedback: (feedback) =>
          set((state) => ({
            feedback: [...state.feedback, feedback],
          })),

        // Acciones de estadísticas
        setStats: (stats) => set({ stats }),

        // Acciones de cuentas
        setAvailableAccounts: (accounts) => set({ availableAccounts: accounts }),

        // Acciones de estado
        setLoading: (loading) => set({ isLoading: loading }),

        setError: (error) => set({ error }),

        // Acciones de clasificación
        acceptSuggestion: (documentId, account) =>
          set((state) => ({
            suggestions: state.suggestions.map((s) =>
              s.document_id === documentId
                ? { ...s, suggested_account: account, puntuacion_confianza: 1.0 }
                : s
            ),
          })),

        rejectSuggestion: (documentId) =>
          set((state) => ({
            suggestions: state.suggestions.filter((s) => s.document_id !== documentId),
          })),
      }),
      {
        name: 'classification-storage',
        partialize: (state) => ({
          feedback: state.feedback,
          availableAccounts: state.availableAccounts,
        }),
      }
    ),
    { name: 'ClassificationStore' }
  )
);

export default useClassificationStore;
