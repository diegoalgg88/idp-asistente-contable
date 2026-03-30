/**
 * MatchFilters Component
 * Filtros para tabla de matches de conciliación
 * 
 * Características:
 * - Filtro por tipo de match (Exact, Fuzzy, LLM)
 * - Filtro por estado (Pending, Confirmed, Rejected)
 * - Filtro por confianza mínima
 * - Búsqueda por texto
 * 
 * @see https://www.radix-ui.com/themes/docs/components/select
 * @see https://www.radix-ui.com/themes/docs/components/text-field
 */

import React, { useState, useCallback } from 'react';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useReconciliationStore } from '@/store/reconciliationStore';

export interface MatchFiltersProps {
  onFiltersChange?: (filters: MatchFilterState) => void;
}

export interface MatchFilterState {
  matchType?: 'exact' | 'fuzzy' | 'llm_confirmed' | 'llm_review' | 'all';
  estado?: 'pending' | 'confirmed' | 'rejected' | 'all';
  confidenceMin?: number;
  searchQuery?: string;
}

export const MatchFilters: React.FC<MatchFiltersProps> = ({ onFiltersChange }) => {
  const { filters, setFilters, clearFilters, applyFilters } = useReconciliationStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [localSearch, setLocalSearch] = useState(filters.searchQuery || '');

  // Manejar cambio de tipo de match
  const handleMatchTypeChange = useCallback(
    (value: string) => {
      const matchType = value === 'all' ? undefined : value as any;
      const newFilters = { ...filters, matchType };
      setFilters(newFilters);
      applyFilters();
      onFiltersChange?.(newFilters);
    },
    [filters, setFilters, applyFilters, onFiltersChange]
  );

  // Manejar cambio de estado
  const handleEstadoChange = useCallback(
    (value: string) => {
      const estado = value === 'all' ? undefined : value as any;
      const newFilters = { ...filters, estado };
      setFilters(newFilters);
      applyFilters();
      onFiltersChange?.(newFilters);
    },
    [filters, setFilters, applyFilters, onFiltersChange]
  );

  // Manejar cambio de confianza mínima
  const handleConfidenceMinChange = useCallback(
    (value: string) => {
      const confidenceMin = value === 'all' ? undefined : parseFloat(value);
      const newFilters = { ...filters, confidenceMin };
      setFilters(newFilters);
      applyFilters();
      onFiltersChange?.(newFilters);
    },
    [filters, setFilters, applyFilters, onFiltersChange]
  );

  // Manejar búsqueda
  const handleSearch = useCallback(() => {
    const newFilters = { ...filters, searchQuery: localSearch || undefined };
    setFilters(newFilters);
    applyFilters();
    onFiltersChange?.(newFilters);
  }, [filters, localSearch, setFilters, applyFilters, onFiltersChange]);

  // Manejar Enter en búsqueda
  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    },
    [handleSearch]
  );

  // Limpiar filtros
  const handleClearFilters = useCallback(() => {
    clearFilters();
    setLocalSearch('');
    onFiltersChange?.({});
  }, [clearFilters, onFiltersChange]);

  // Contar filtros activos
  const activeFiltersCount = React.useMemo(() => {
    let count = 0;
    if (filters.matchType) count++;
    if (filters.estado) count++;
    if (filters.confidenceMin !== undefined) count++;
    if (filters.searchQuery) count++;
    return count;
  }, [filters]);

  return (
    <div className="space-y-4">
      {/* Barra principal de filtros */}
      <div className="flex items-center gap-4">
        {/* Búsqueda */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por concepto o descripción..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="pl-10"
          />
          {localSearch && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
              onClick={() => {
                setLocalSearch('');
                handleSearch();
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Toggle de filtros avanzados */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filtros
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </CollapsibleTrigger>
        </Collapsible>

        {/* Limpiar filtros */}
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            <X className="h-4 w-4 mr-2" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Filtros avanzados */}
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/20">
            {/* Filtro por tipo de match */}
            <div className="space-y-2">
              <Label htmlFor="match-type">Tipo de Match</Label>
              <Select
                value={filters.matchType || 'all'}
                onValueChange={handleMatchTypeChange}
              >
                <SelectTrigger id="match-type">
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <Separator />
                  <SelectItem value="exact">✅ Exacto</SelectItem>
                  <SelectItem value="fuzzy">🔍 Fuzzy</SelectItem>
                  <SelectItem value="llm_confirmed">🤖 LLM Confirmado</SelectItem>
                  <SelectItem value="llm_review">⚠️ LLM Revisión</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por estado */}
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={filters.estado || 'all'}
                onValueChange={handleEstadoChange}
              >
                <SelectTrigger id="estado">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <Separator />
                  <SelectItem value="pending">⏳ Pendiente</SelectItem>
                  <SelectItem value="confirmed">✅ Confirmado</SelectItem>
                  <SelectItem value="rejected">❌ Rechazado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por confianza mínima */}
            <div className="space-y-2">
              <Label htmlFor="confidence">Confianza Mínima</Label>
              <Select
                value={filters.confidenceMin?.toString() || 'all'}
                onValueChange={handleConfidenceMinChange}
              >
                <SelectTrigger id="confidence">
                  <SelectValue placeholder="Cualquier confianza" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Cualquier confianza</SelectItem>
                  <Separator />
                  <SelectItem value="0.9">90%+ (Muy Alta)</SelectItem>
                  <SelectItem value="0.75">75%+ (Alta)</SelectItem>
                  <SelectItem value="0.5">50%+ (Media)</SelectItem>
                  <SelectItem value="0.25">25%+ (Baja)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filtros activos */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2 mt-4">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filtros activos:</span>
              <div className="flex flex-wrap gap-2">
                {filters.matchType && (
                  <Badge variant="secondary">
                    Tipo: {filters.matchType}
                  </Badge>
                )}
                {filters.estado && (
                  <Badge variant="secondary">
                    Estado: {filters.estado}
                  </Badge>
                )}
                {filters.confidenceMin !== undefined && (
                  <Badge variant="secondary">
                    Confianza: {(filters.confidenceMin * 100).toFixed(0)}%+
                  </Badge>
                )}
                {filters.searchQuery && (
                  <Badge variant="secondary">
                    Búsqueda: &quot;{filters.searchQuery}&quot;
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default MatchFilters;
