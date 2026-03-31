/**
 * DocumentClassifier Component
 * Clasificación contable automática de documentos con sugerencias de cuentas
 * 
 * Características:
 * - Muestra sugerencias de cuentas contables
 * - Niveles de confianza
 * - Top 3 sugerencias
 * - Feedback de corrección
 * - Clasificación manual
 * 
 * @see https://www.radix-ui.com/themes/docs/components/select
 * @see https://www.radix-ui.com/themes/docs/components/radio-cards
 */

import React, { useState } from 'react';
import { Brain, CheckCircle2, XCircle, ThumbsUp, ThumbsDown, Edit2, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/text-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useClassificationStore, ClassificationSuggestion } from '@/store/classificationStore';
import {
  useDocumentSuggestions,
  useSubmitFeedback,
  useManualClassification,
} from '@/hooks/useClassification';

export interface DocumentClassifierProps {
  documentIds: number[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClassificationComplete?: () => void;
}

export const DocumentClassifier: React.FC<DocumentClassifierProps> = ({
  documentIds,
  open = false,
  onOpenChange,
  onClassificationComplete,
}) => {
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [manualDialogOpen, setManualDialogOpen] = useState(false);
  const [feedbackReason, setFeedbackReason] = useState('');

  const {
    data: suggestions,
    isLoading,
    error,
  } = useDocumentSuggestions(documentIds);

  const submitFeedbackMutation = useSubmitFeedback();
  const manualClassificationMutation = useManualClassification();

  // Manejar aceptación de sugerencia
  const handleAcceptSuggestion = React.useCallback(
    (suggestion: ClassificationSuggestion) => {
      setSelectedSuggestion(suggestion.document_id);
      
      // Aquí iría la llamada a API para guardar clasificación
      // Por ahora solo mostramos feedback
      setFeedbackDialogOpen(true);
    },
    []
  );

  // Manejar rechazo de sugerencia
  const handleRejectSuggestion = React.useCallback(
    (suggestion: ClassificationSuggestion) => {
      submitFeedbackMutation.mutate({
        document_id: suggestion.document_id,
        suggested_account: suggestion.suggested_account,
        corrected_account: '',
        feedback_type: 'incorrect',
      });
    },
    [submitFeedbackMutation]
  );

  // Manejar envío de feedback
  const handleSubmitFeedback = React.useCallback(() => {
    if (!selectedSuggestion) return;

    const suggestion = suggestions?.find((s) => s.document_id === selectedSuggestion);
    if (!suggestion) return;

    submitFeedbackMutation.mutate(
      {
        document_id: suggestion.document_id,
        suggested_account: suggestion.suggested_account,
        corrected_account: '',
        feedback_type: feedbackReason ? 'partial' : 'correct',
      },
      {
        onSuccess: () => {
          setFeedbackDialogOpen(false);
          setFeedbackReason('');
          onClassificationComplete?.();
        },
      }
    );
  }, [selectedSuggestion, suggestions, feedbackReason, submitFeedbackMutation, onClassificationComplete]);

  // Manejar clasificación manual
  const handleManualClassification = React.useCallback(
    (documentId: number, accountCode: string) => {
      manualClassificationMutation.mutate(
        {
          document_id: documentId,
          account_code: accountCode,
        },
        {
          onSuccess: () => {
            setManualDialogOpen(false);
            onClassificationComplete?.();
          },
        }
      );
    },
    [manualClassificationMutation, onClassificationComplete]
  );

  // Obtener color de confianza
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.75) return 'text-blue-600';
    if (confidence >= 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Formatear monto
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Clasificación Contable</CardTitle>
          <CardDescription>Generando sugerencias de cuentas contables...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center space-y-2">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-sm text-muted-foreground">
              Analizando documentos con IA...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-5 w-5" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Error al generar sugerencias: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!suggestions || suggestions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Clasificación Contable</CardTitle>
          <CardDescription>No hay documentos para clasificar</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center space-y-2">
            <Brain className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No hay sugerencias disponibles
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Encabezado */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">Clasificación Contable Automática</h3>
              <p className="text-sm text-muted-foreground">
                Sugerencias basadas en ML con {suggestions.length} documentos
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setManualDialogOpen(true)}>
            <Edit2 className="h-4 w-4 mr-2" />
            Clasificación Manual
          </Button>
        </div>

        {/* Lista de sugerencias */}
        <div className="grid grid-cols-1 gap-4">
          {suggestions.map((suggestion) => (
            <Card
              key={suggestion.document_id}
              className={`
                transition-colors
                ${selectedSuggestion === suggestion.document_id ? 'border-primary bg-muted' : ''}
              `}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-base">{suggestion.document_concept}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <span>{formatAmount(suggestion.document_amount)}</span>
                      <Badge variant="outline">Doc #{suggestion.document_id}</Badge>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge
                          variant="secondary"
                          className={getConfidenceColor(suggestion.puntuacion_confianza)}
                        >
                          <Brain className="h-3 w-3 mr-1" />
                          {(suggestion.puntuacion_confianza * 100).toFixed(0)}%
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        Confianza de la sugerencia
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Sugerencia principal */}
                <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Sugerencia Principal</p>
                      <p className="text-sm font-semibold">
                        {suggestion.suggested_account} - {suggestion.account_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleRejectSuggestion(suggestion)}
                      >
                        <ThumbsDown className="h-4 w-4 text-red-600" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAcceptSuggestion(suggestion)}
                      >
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        Aceptar
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Top 3 sugerencias */}
                {suggestion.top_3_suggestions.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs text-muted-foreground font-medium">
                      Otras sugerencias:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {suggestion.top_3_suggestions.map((alt, index) => (
                        <div
                          key={index}
                          className="p-2 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                          onClick={() => {
                            // Seleccionar alternativa
                            setSelectedSuggestion(suggestion.document_id);
                          }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              #{index + 1}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {(alt.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                          <p className="text-sm font-medium">{alt.account_code}</p>
                          <p className="text-xs text-muted-foreground">{alt.account_name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dialog de feedback */}
        <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Clasificación</DialogTitle>
              <DialogDescription>
                ¿La sugerencia es correcta? Tu feedback ayuda a mejorar el modelo.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>¿Por qué aceptas esta sugerencia?</Label>
                <Textarea
                  placeholder="Opcional: Describe por qué la sugerencia es correcta..."
                  value={feedbackReason}
                  onChange={(e) => setFeedbackReason(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setFeedbackDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmitFeedback}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Confirmar Clasificación
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog de clasificación manual */}
        <Dialog open={manualDialogOpen} onOpenChange={setManualDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Clasificación Manual</DialogTitle>
              <DialogDescription>
                Selecciona una cuenta contable del catálogo NIF B-3
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="account-select">Cuenta Contable</Label>
                <Select>
                  <SelectTrigger id="account-select" className="mt-2">
                    <SelectValue placeholder="Seleccionar cuenta..." />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Aquí irían las cuentas del catálogo */}
                    <SelectItem value="601-01-001">601-01-001 - Sueldos y Salarios</SelectItem>
                    <SelectItem value="601-02-001">601-02-001 - Seguridad Social</SelectItem>
                    <SelectItem value="601-03-001">601-03-001 - Arrendamientos</SelectItem>
                    <SelectItem value="601-04-001">601-04-001 - Servicios Públicos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setManualDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={() => handleManualClassification(documentIds[0], '601-01-001')}
                disabled={manualClassificationMutation.isPending}
              >
                {manualClassificationMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Clasificar
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default DocumentClassifier;
