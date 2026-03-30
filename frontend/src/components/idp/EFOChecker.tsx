/**
 * EFOChecker Component
 * Verificación de RFC en lista 69-B del SAT (Empresas Facturadoras de Operaciones)
 * 
 * Características:
 * - Búsqueda de RFC en lista 69-B
 * - Validación masiva de múltiples RFC
 * - Alertas de riesgo fiscal
 * - Historial de validaciones
 * - Export de resultados
 * 
 * @see https://www.radix-ui.com/themes/docs/components/table
 * @see https://www.radix-ui.com/themes/docs/components/badge
 */

import React, { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Upload,
  Download,
  Trash2,
  Loader2,
  FileWarning,
  ShieldAlert,
  History,
} from 'lucide-react';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/text-area';

export interface EFOCheckerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  rfcInicial?: string;
}

export interface EFOResult {
  rfc: string;
  nombre: string | null;
  situacion: 'no_localizado' | 'operaciones_inexistentes' | 'empresa_facturadora' | 'sentencia_favorable';
  fecha_publicacion: string | null;
  fecha_presuncion: string | null;
  riesgo: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  en_lista_69b: boolean;
}

export const EFOChecker: React.FC<EFOCheckerProps> = ({
  open = false,
  onOpenChange,
  rfcInicial = '',
}) => {
  const [rfcInput, setRfcInput] = useState(rfcInicial);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<EFOResult[]>([]);
  const [searchHistory, setSearchHistory] = useState<Array<{
    rfc: string;
    fecha: string;
    resultado: 'positivo' | 'negativo';
  }>>([]);

  // Validar formato de RFC
  const validateRFC = useCallback((rfc: string): boolean => {
    // RFC persona moral: 3 letras + 6 dígitos + 3 caracteres
    const rpmPattern = /^[A-Z&Ñ]{3}\d{6}[A-Z0-9]{3}$/;
    // RFC persona física: 4 letras + 6 dígitos + 3 caracteres
    const rpfPattern = /^[A-Z&Ñ]{4}\d{6}[A-Z0-9]{3}$/;
    
    const rfcClean = rfc.toUpperCase().replace(/[^A-Z0-9&Ñ]/g, '');
    return rpmPattern.test(rfcClean) || rpfPattern.test(rfcClean);
  }, []);

  // Buscar RFC en lista 69-B
  const handleSearch = useCallback(async () => {
    const rfc = rfcInput.toUpperCase().replace(/[^A-Z0-9&Ñ]/g, '');
    
    if (!validateRFC(rfc)) {
      alert('RFC inválido. Verifica el formato.');
      return;
    }

    setIsSearching(true);

    try {
      // TODO: Llamar a API de validación 69-B
      // const response = await api.get<EFOResult>(`/v1/cfdi/efo-check?rfc=${rfc}`);
      // const result = response.data;

      // Simulación de búsqueda (eliminar cuando se implemente la API)
      const result = simulateSearch(rfc);

      setSearchResults([result]);
      
      // Agregar al historial
      setSearchHistory((prev) => [
        ...prev,
        {
          rfc,
          fecha: new Date().toISOString(),
          resultado: result.en_lista_69b ? 'positivo' : 'negativo',
        },
      ]);

    } catch (error) {
      console.error('Error buscando RFC:', error);
      alert('Error al buscar RFC. Intente nuevamente.');
    } finally {
      setIsSearching(false);
    }
  }, [rfcInput, validateRFC]);

  // Simulación de búsqueda (eliminar cuando se implemente la API)
  const simulateSearch = (rfc: string): EFOResult => {
    // Simular RFC en lista 69-B (para testing)
    const rfcEnLista = ['XAXX800101XXX', 'EMP850101ABC', 'TST900101XXX'];
    const enLista = rfcEnLista.includes(rfc);

    return {
      rfc,
      nombre: `Empresa ${rfc} SA de CV`,
      situacion: enLista ? 'operaciones_inexistentes' : undefined as any,
      fecha_publicacion: enLista ? '2026-01-15' : undefined as any,
      fecha_presuncion: enLista ? '2025-12-01' : undefined as any,
      riesgo: enLista ? 'CRITICAL' : 'LOW',
      en_lista_69b: enLista,
    };
  };

  // Limpiar búsqueda
  const handleClear = useCallback(() => {
    setRfcInput('');
    setSearchResults([]);
  }, []);

  // Exportar resultados
  const handleExport = useCallback(() => {
    if (searchResults.length === 0) return;

    const csvContent = [
      ['RFC', 'Nombre', 'Situación', 'Riesgo', 'En Lista 69-B', 'Fecha Publicación'],
      ...searchResults.map((r) => [
        r.rfc,
        r.nombre || '',
        r.situacion || '',
        r.riesgo,
        r.en_lista_69b ? 'SÍ' : 'NO',
        r.fecha_publicacion || '',
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `efo-check-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [searchResults]);

  // Obtener color de riesgo
  const getRiskColor = (riesgo: EFOResult['riesgo']) => {
    switch (riesgo) {
      case 'CRITICAL':
        return 'bg-red-500 text-white';
      case 'HIGH':
        return 'bg-orange-500 text-white';
      case 'MEDIUM':
        return 'bg-yellow-500 text-white';
      case 'LOW':
        return 'bg-green-500 text-white';
    }
  };

  // Obtener icono de riesgo
  const getRiskIcon = (riesgo: EFOResult['riesgo']) => {
    switch (riesgo) {
      case 'CRITICAL':
        return <ShieldAlert className="h-4 w-4" />;
      case 'HIGH':
        return <AlertTriangle className="h-4 w-4" />;
      case 'MEDIUM':
        return <FileWarning className="h-4 w-4" />;
      case 'LOW':
        return <CheckCircle2 className="h-4 w-4" />;
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: es });
    } catch {
      return dateString;
    }
  };

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className="h-6 w-6 text-primary" />
              Verificador de Lista 69-B (EFOs)
            </DialogTitle>
            <DialogDescription>
              Verifica si un RFC está en la lista de Empresas Facturadoras de Operaciones del SAT
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Búsqueda de RFC */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Buscar RFC</CardTitle>
                <CardDescription>
                  Ingresa el RFC a verificar en la lista 69-B del SAT
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-3">
                      <Label htmlFor="rfc-input">RFC</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="rfc-input"
                          placeholder="XAXX800101XXX"
                          value={rfcInput}
                          onChange={(e) => setRfcInput(e.target.value.toUpperCase())}
                          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                          className="uppercase"
                        />
                        <Button onClick={handleSearch} disabled={isSearching || !rfcInput}>
                          {isSearching ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Search className="h-4 w-4" />
                          )}
                        </Button>
                        <Button variant="outline" onClick={handleClear} disabled={isSearching}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        onClick={handleExport}
                        disabled={searchResults.length === 0}
                        className="w-full"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                      </Button>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <p className="font-medium">Formato de RFC:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Persona Moral: 3 letras + 6 dígitos + 3 caracteres (ej: EMP850101ABC)</li>
                      <li>Persona Física: 4 letras + 6 dígitos + 3 caracteres (ej: PE PJ800101XXX)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resultados */}
            {searchResults.length > 0 && (
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {searchResults.map((result, index) => (
                    <Card
                      key={index}
                      className={
                        result.en_lista_69b
                          ? 'border-red-200 bg-red-50'
                          : 'border-green-200 bg-green-50'
                      }
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {result.en_lista_69b ? (
                              <XCircle className="h-6 w-6 text-red-600" />
                            ) : (
                              <CheckCircle2 className="h-6 w-6 text-green-600" />
                            )}
                            <div>
                              <CardTitle className="text-base">{result.rfc}</CardTitle>
                              <CardDescription>{result.nombre}</CardDescription>
                            </div>
                          </div>
                          <Badge className={getRiskColor(result.riesgo)}>
                            {getRiskIcon(result.riesgo)}
                            <span className="ml-1">{result.riesgo}</span>
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {result.en_lista_69b ? (
                          <Alert variant="destructive">
                            <AlertTriangle className="h-5 w-5" />
                            <AlertTitle>⚠️ RFC en Lista 69-B</AlertTitle>
                            <AlertDescription>
                              Este RFC está en la lista de Empresas Facturadoras de Operaciones
                              del SAT. No deduzcas operaciones con este proveedor.
                            </AlertDescription>
                          </Alert>
                        ) : (
                          <Alert className="bg-green-50 border-green-200">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <AlertTitle className="text-green-800">
                              ✅ RFC Limpio
                            </AlertTitle>
                            <AlertDescription className="text-green-700">
                              Este RFC NO está en la lista 69-B del SAT
                            </AlertDescription>
                          </Alert>
                        )}

                        {result.en_lista_69b && (
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Situación:
                              </p>
                              <p className="text-sm font-medium">
                                {result.situacion === 'operaciones_inexistentes'
                                  ? 'Operaciones Inexistentes'
                                  : result.situacion}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Fecha de Publicación:
                              </p>
                              <p className="text-sm font-medium">
                                {formatDate(result.fecha_publicacion)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Fecha de Presunción:
                              </p>
                              <p className="text-sm font-medium">
                                {formatDate(result.fecha_presuncion)}
                              </p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}

            {/* Historial */}
            {searchHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Historial de Búsquedas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>RFC</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Resultado</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {searchHistory.slice(-5).reverse().map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.rfc}</TableCell>
                          <TableCell>
                            {format(new Date(item.fecha), 'dd/MM/yyyy HH:mm')}
                          </TableCell>
                          <TableCell>
                            {item.resultado === 'positivo' ? (
                              <Badge variant="destructive">
                                <XCircle className="h-3 w-3 mr-1" />
                                En Lista
                              </Badge>
                            ) : (
                              <Badge variant="default" className="bg-green-500">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Limpio
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setRfcInput(item.rfc)}
                            >
                              <Search className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* Información importante */}
            <Alert>
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle>Importante</AlertTitle>
              <AlertDescription>
                Las operaciones con proveedores en la lista 69-B no son deducibles.
                El SAT puede rechazar declaraciones y aplicar multas de hasta $58,000 MXN
                por operación con EFOs.
              </AlertDescription>
            </Alert>

            {/* Niveles de riesgo */}
            <div className="text-xs text-muted-foreground space-y-2">
              <p className="font-medium">Niveles de riesgo:</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-500 text-white">
                    <ShieldAlert className="h-3 w-3" />
                  </Badge>
                  <span>CRITICAL: En lista 69-B definitivo</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-orange-500 text-white">
                    <AlertTriangle className="h-3 w-3" />
                  </Badge>
                  <span>HIGH: Presunto 69-B</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-yellow-500 text-white">
                    <FileWarning className="h-3 w-3" />
                  </Badge>
                  <span>MEDIUM: Sentencia favorable</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500 text-white">
                    <CheckCircle2 className="h-3 w-3" />
                  </Badge>
                  <span>LOW: No encontrado en lista</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange?.(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default EFOChecker;
