/**
 * MatchingTable Component
 * Tabla de matches de conciliación bancaria con 3 capas
 * 
 * Características:
 * - Muestra matches de Exact, Fuzzy y LLM
 * - Acciones de confirmar/rechazar
 * - Indicadores de confianza
 * - Badges de tipo de match
 * 
 * @see https://www.radix-ui.com/themes/docs/components/table
 * @see https://www.radix-ui.com/themes/docs/components/badge
 */

import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Brain,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { MatchResult } from '@/store/reconciliationStore';
import { useConfirmMatch, useRejectMatch } from '@/hooks/useReconciliation';

export interface MatchingTableProps {
  matches: MatchResult[];
  isLoading?: boolean;
  onMatchSelect?: (match: MatchResult) => void;
}

export const MatchingTable: React.FC<MatchingTableProps> = ({
  matches,
  isLoading = false,
  onMatchSelect,
}) => {
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);

  const confirmMatchMutation = useConfirmMatch();
  const rejectMatchMutation = useRejectMatch();

  // Manejar confirmación de match
  const handleConfirm = React.useCallback(
    (matchId: number) => {
      confirmMatchMutation.mutate({ match_id: matchId });
      setSelectedMatchId(null);
    },
    [confirmMatchMutation]
  );

  // Manejar rechazo de match
  const handleReject = React.useCallback(
    (matchId: number) => {
      const reason = prompt('Razón del rechazo (opcional):');
      if (reason !== null) {
        rejectMatchMutation.mutate({ match_id: matchId, reason: reason || 'Sin especificar' });
        setSelectedMatchId(null);
      }
    },
    [rejectMatchMutation]
  );

  // Obtener badge según tipo de match
  const getMatchTypeBadge = (matchType: MatchResult['match_type'], confidence: number) => {
    switch (matchType) {
      case 'exact':
        return (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Exacto
          </Badge>
        );
      case 'fuzzy':
        return (
          <Badge variant="secondary" className="bg-blue-500 hover:bg-blue-600">
            <Search className="h-3 w-3 mr-1" />
            Fuzzy {confidence >= 0.85 ? '(Alto)' : '(Medio)'}
          </Badge>
        );
      case 'llm_confirmed':
        return (
          <Badge variant="default" className="bg-purple-500 hover:bg-purple-600">
            <Brain className="h-3 w-3 mr-1" />
            LLM Confirmado
          </Badge>
        );
      case 'llm_review':
        return (
          <Badge variant="outline" className="bg-yellow-500 hover:bg-yellow-600">
            <AlertCircle className="h-3 w-3 mr-1" />
            LLM Revisión
          </Badge>
        );
      default:
        return null;
    }
  };

  // Obtener color de confianza
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600 bg-green-50';
    if (confidence >= 0.75) return 'text-blue-600 bg-blue-50';
    if (confidence >= 0.5) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  // Formatear monto
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: es });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Cargando matches...</p>
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <Search className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No hay matches para mostrar</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="border rounded-lg">
        <Table>
          <TableCaption>
            {matches.length} matches encontrados
          </TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Tipo</TableHead>
              <TableHead className="w-[100px]">Confianza</TableHead>
              <TableHead className="w-[150px]">Fecha Banco</TableHead>
              <TableHead className="w-[300px]">Concepto Banco</TableHead>
              <TableHead className="w-[120px]">Monto Banco</TableHead>
              <TableHead className="w-[150px]">Fecha CFDI</TableHead>
              <TableHead className="w-[300px]">Descripción CFDI</TableHead>
              <TableHead className="w-[120px]">Monto CFDI</TableHead>
              <TableHead className="w-[80px]">Estado</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {matches.map((match) => (
              <TableRow
                key={match.match_id}
                className={`
                  cursor-pointer transition-colors
                  ${selectedMatchId === match.match_id ? 'bg-muted' : 'hover:bg-muted/50'}
                  ${match.estado === 'confirmed' ? 'bg-green-50/50' : ''}
                  ${match.estado === 'rejected' ? 'bg-red-50/50' : ''}
                `}
                onClick={() => onMatchSelect?.(match)}
              >
                {/* Tipo de match */}
                <TableCell>
                  {getMatchTypeBadge(match.match_type, match.confidence_score)}
                </TableCell>

                {/* Confianza */}
                <TableCell>
                  <div
                    className={`
                      inline-flex items-center px-2 py-1 rounded-md text-xs font-medium
                      ${getConfidenceColor(match.confidence_score)}
                    `}
                  >
                    {(match.confidence_score * 100).toFixed(0)}%
                  </div>
                </TableCell>

                {/* Fecha Banco */}
                <TableCell className="text-sm">
                  {formatDate(match.bank_fecha)}
                </TableCell>

                {/* Concepto Banco */}
                <TableCell className="text-sm max-w-[300px] truncate" title={match.bank_concepto}>
                  {match.bank_concepto}
                </TableCell>

                {/* Monto Banco */}
                <TableCell className="text-sm font-medium">
                  {formatAmount(match.bank_monto)}
                </TableCell>

                {/* Fecha CFDI */}
                <TableCell className="text-sm">
                  {match.cfdi_fecha ? formatDate(match.cfdi_fecha) : '-'}
                </TableCell>

                {/* Descripción CFDI */}
                <TableCell className="text-sm max-w-[300px] truncate" title={match.cfdi_descripcion || ''}>
                  {match.cfdi_descripcion || '-'}
                </TableCell>

                {/* Monto CFDI */}
                <TableCell className="text-sm font-medium">
                  {match.cfdi_monto ? formatAmount(match.cfdi_monto) : '-'}
                </TableCell>

                {/* Estado */}
                <TableCell>
                  {match.estado === 'confirmed' && (
                    <Tooltip>
                      <TooltipTrigger>
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </TooltipTrigger>
                      <TooltipContent>Confirmado</TooltipContent>
                    </Tooltip>
                  )}
                  {match.estado === 'rejected' && (
                    <Tooltip>
                      <TooltipTrigger>
                        <XCircle className="h-5 w-5 text-red-600" />
                      </TooltipTrigger>
                      <TooltipContent>Rechazado</TooltipContent>
                    </Tooltip>
                  )}
                  {match.estado === 'pending' && (
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                      </TooltipTrigger>
                      <TooltipContent>Pendiente</TooltipContent>
                    </Tooltip>
                  )}
                </TableCell>

                {/* Acciones */}
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setSelectedMatchId(match.match_id)}
                        disabled={match.estado !== 'pending'}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleConfirm(match.match_id)}
                        disabled={match.estado !== 'pending'}
                      >
                        <ThumbsUp className="h-4 w-4 mr-2 text-green-600" />
                        Confirmar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleReject(match.match_id)}
                        disabled={match.estado !== 'pending'}
                        className="text-red-600"
                      >
                        <ThumbsDown className="h-4 w-4 mr-2" />
                        Rechazar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
};

export default MatchingTable;
