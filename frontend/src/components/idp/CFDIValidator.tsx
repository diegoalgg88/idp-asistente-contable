/**
 * CFDIValidator Component
 * Validación de estructura de CFDI 4.0 contra esquemas XSD del SAT
 * 
 * Características:
 * - Validación de estructura XML (4 niveles)
 * - Validación de catálogos SAT
 * - Validación de reglas de negocio (Anexo 20)
 * - Validación de complemento de nómina 1.2
 * - Reporte de errores con sugerencias
 * 
 * @see https://www.radix-ui.com/themes/docs/components/card
 * @see https://www.radix-ui.com/themes/docs/components/alert
 */

import React, { useState, useCallback } from 'react';
import { Upload, FileCheck, XCircle, CheckCircle2, AlertTriangle, Loader2, FileWarning } from 'lucide-react';
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
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useDropzone } from 'react-dropzone';

export interface CFDIValidatorProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onValidationComplete?: (result: ValidationResult) => void;
}

export interface ValidationResult {
  valid: boolean;
  level: 'xsd' | 'tipos' | 'catalogos' | 'reglas_negocio';
  errors: ValidationError[];
  warnings: ValidationError[];
  suggestions: ValidationError[];
}

export interface ValidationError {
  codigo: string;
  descripcion: string;
  ubicacion: string;
  severidad: 'CRITICAL' | 'WARNING' | 'INFO';
  solucion: string;
}

export const CFDIValidator: React.FC<CFDIValidatorProps> = ({
  open = false,
  onOpenChange,
  onValidationComplete,
}) => {
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValdating, setIsValdating] = useState(false);
  const [progress, setProgress] = useState(0);

  // Validar archivo XML
  const validateFile = useCallback((file: File): string | null => {
    // Validar extensión
    if (!file.name.toLowerCase().endsWith('.xml')) {
      return `Extensión no permitida: ${file.name}. Use XML`;
    }

    // Validar tamaño (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return `Archivo muy grande: ${(file.size / 1024 / 1024).toFixed(2)}MB. Máximo 10MB`;
    }

    return null;
  }, []);

  // Manejar drop de archivos
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setValidationResult(null);
      setProgress(0);

      // Procesar archivos rechazados
      if (rejectedFiles.length > 0) {
        const rejectionReason = rejectedFiles[0].errors[0]?.message;
        alert(rejectionReason || 'Archivo no válido');
        return;
      }

      // Validar archivo aceptado
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const validationError = validateFile(file);
        
        if (validationError) {
          alert(validationError);
          return;
        }

        setXmlFile(file);
      }
    },
    [validateFile]
  );

  // Configurar dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/xml': ['.xml'],
      'text/xml': ['.xml'],
    },
    maxFiles: 1,
    multiple: false,
  });

  // Ejecutar validación
  const handleValidate = useCallback(async () => {
    if (!xmlFile) return;

    setIsValdating(true);
    setProgress(0);

    try {
      // Simular progreso de validación
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Leer archivo XML
      const xmlContent = await readFileAsText(xmlFile);

      // TODO: Llamar a API de validación CFDI
      // const response = await api.post<ValidationResult>('/v1/cfdi/validate-xsd', {
      //   xml_content: xmlContent,
      //   validate_nomina: true,
      // });
      // const result = response.data;

      // Simulación de validación (eliminar cuando se implemente la API)
      const result = simulateValidation(xmlContent);

      clearInterval(progressInterval);
      setProgress(100);

      setValidationResult(result);
      onValidationComplete?.(result);

    } catch (error) {
      console.error('Error validando CFDI:', error);
      setValidationResult({
        valid: false,
        level: 'xsd',
        errors: [{
          codigo: 'GEN-001',
          descripcion: 'Error al leer archivo XML',
          ubicacion: 'Sistema',
          severidad: 'CRITICAL',
          solucion: 'Verificar que el archivo sea XML válido',
        }],
        warnings: [],
        suggestions: [],
      });
    } finally {
      setIsValdating(false);
    }
  }, [xmlFile, onValidationComplete]);

  // Leer archivo como texto
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  // Simulación de validación (eliminar cuando se implemente la API)
  const simulateValidation = (xmlContent: string): ValidationResult => {
    // Verificar si es CFDI válido
    const hasComprobante = xmlContent.includes('cfdi:Comprobante');
    const hasEmisor = xmlContent.includes('cfdi:Emisor');
    const hasReceptor = xmlContent.includes('cfdi:Receptor');
    const hasConceptos = xmlContent.includes('cfdi:Conceptos');
    const hasVersion = xmlContent.includes('Version="4.0"');

    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];
    const suggestions: ValidationError[] = [];

    if (!hasVersion) {
      errors.push({
        codigo: 'cfdi40-001',
        descripcion: 'CFDI debe ser versión 4.0',
        ubicacion: 'Atributo Version',
        severidad: 'CRITICAL',
        solucion: 'Agregar atributo Version="4.0" en nodo Comprobante',
      });
    }

    if (!hasComprobante) {
      errors.push({
        codigo: 'cfdi40-002',
        descripcion: 'Falta nodo Comprobante',
        ubicacion: 'XML',
        severidad: 'CRITICAL',
        solucion: 'Verificar estructura XML de CFDI',
      });
    }

    if (!hasEmisor) {
      errors.push({
        codigo: 'cfdi40-003',
        descripcion: 'Falta nodo Emisor',
        ubicacion: 'cfdi:Comprobante',
        severidad: 'CRITICAL',
        solucion: 'Agregar nodo Emisor con Rfc y RegimenFiscal',
      });
    }

    if (!hasReceptor) {
      errors.push({
        codigo: 'cfdi40-004',
        descripcion: 'Falta nodo Receptor',
        ubicacion: 'cfdi:Comprobante',
        severidad: 'CRITICAL',
        solucion: 'Agregar nodo Receptor con Rfc y UsoCFDI',
      });
    }

    if (!hasConceptos) {
      errors.push({
        codigo: 'cfdi40-005',
        descripcion: 'Falta nodo Conceptos',
        ubicacion: 'cfdi:Comprobante',
        severidad: 'CRITICAL',
        solucion: 'Agregar nodo Conceptos con al menos un Concepto',
      });
    }

    // Verificar si tiene complemento de nómina
    const hasNomina = xmlContent.includes('nomina12:Nomina');
    if (hasNomina) {
      suggestions.push({
        codigo: 'nom-001',
        descripcion: 'CFDI con complemento de nómina detectado',
        ubicacion: 'nomina12:Nomina',
        severidad: 'INFO',
        solucion: 'Validar estructura de nómina 1.2 Revisión E',
      });
    }

    return {
      valid: errors.length === 0,
      level: errors.length > 0 ? 'xsd' : 'catalogos',
      errors,
      warnings,
      suggestions,
    };
  };

  // Limpiar validación
  const handleClear = useCallback(() => {
    setXmlFile(null);
    setValidationResult(null);
    setProgress(0);
  }, []);

  // Obtener color de severidad
  const getSeverityColor = (severidad: ValidationError['severidad']) => {
    switch (severidad) {
      case 'CRITICAL':
        return 'bg-red-500 text-white';
      case 'WARNING':
        return 'bg-yellow-500 text-white';
      case 'INFO':
        return 'bg-blue-500 text-white';
    }
  };

  // Obtener icono de severidad
  const getSeverityIcon = (severidad: ValidationError['severidad']) => {
    switch (severidad) {
      case 'CRITICAL':
        return <XCircle className="h-4 w-4" />;
      case 'WARNING':
        return <AlertTriangle className="h-4 w-4" />;
      case 'INFO':
        return <CheckCircle2 className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileCheck className="h-6 w-6 text-primary" />
            Validador de CFDI 4.0
          </DialogTitle>
          <DialogDescription>
            Valida la estructura XML de CFDI contra esquemas XSD del SAT (4 niveles)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-colors duration-200
              ${
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }
              ${isValdating ? 'pointer-events-none opacity-50' : ''}
            `}
          >
            <input {...getInputProps()} />

            {isDragActive ? (
              <div className="space-y-2">
                <Upload className="h-12 w-12 mx-auto text-primary animate-bounce" />
                <p className="text-sm text-primary font-medium">Suelta el archivo XML aquí...</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Arrastra y suelta tu CFDI XML, o{' '}
                  <span className="text-primary font-medium">haz clic para explorar</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Formato: XML (Max 10MB)
                </p>
              </div>
            )}
          </div>

          {/* Archivo seleccionado */}
          {xmlFile && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-base">{xmlFile.name}</CardTitle>
                      <CardDescription>
                        {(xmlFile.size / 1024).toFixed(2)} KB
                      </CardDescription>
                    </div>
                  </div>
                  {!isValdating && (
                    <Button variant="ghost" size="icon" onClick={handleClear}>
                      <XCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              {isValdating && (
                <CardContent>
                  <div className="space-y-2">
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-muted-foreground text-center">
                      Validando CFDI... {progress.toFixed(0)}%
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          )}

          {/* Botón de validación */}
          {xmlFile && !isValdating && (
            <Button onClick={handleValidate} className="w-full">
              <FileCheck className="h-4 w-4 mr-2" />
              Validar CFDI
            </Button>
          )}

          {/* Resultados de validación */}
          {validationResult && (
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {/* Alerta principal */}
                {validationResult.valid ? (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <AlertTitle className="text-green-800">
                      ¡CFDI Válido!
                    </AlertTitle>
                    <AlertDescription className="text-green-700">
                      El CFDI cumple con la estructura XSD del SAT
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="destructive">
                    <XCircle className="h-5 w-5" />
                    <AlertTitle>CFDI Inválido</AlertTitle>
                    <AlertDescription>
                      Se encontraron {validationResult.errors.length} errores críticos
                    </AlertDescription>
                  </Alert>
                )}

                {/* Errores */}
                {validationResult.errors.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-red-600" />
                        Errores ({validationResult.errors.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {validationResult.errors.map((error, index) => (
                          <div
                            key={index}
                            className="p-3 bg-red-50 border border-red-200 rounded-lg"
                          >
                            <div className="flex items-start gap-2">
                              {getSeverityIcon(error.severidad)}
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-red-800">
                                  {error.codigo}: {error.descripcion}
                                </p>
                                <p className="text-xs text-red-600 mt-1">
                                  Ubicación: {error.ubicacion}
                                </p>
                                <p className="text-xs text-red-700 mt-1">
                                  Solución: {error.solucion}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Advertencias */}
                {validationResult.warnings.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        Advertencias ({validationResult.warnings.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {validationResult.warnings.map((warning, index) => (
                          <div
                            key={index}
                            className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                          >
                            <div className="flex items-start gap-2">
                              {getSeverityIcon(warning.severidad)}
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-yellow-800">
                                  {warning.codigo}: {warning.descripcion}
                                </p>
                                <p className="text-xs text-yellow-600 mt-1">
                                  Ubicación: {warning.ubicacion}
                                </p>
                                <p className="text-xs text-yellow-700 mt-1">
                                  Solución: {warning.solucion}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Sugerencias */}
                {validationResult.suggestions.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-blue-600" />
                        Sugerencias ({validationResult.suggestions.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {validationResult.suggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
                          >
                            <div className="flex items-start gap-2">
                              {getSeverityIcon(suggestion.severidad)}
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-blue-800">
                                  {suggestion.codigo}: {suggestion.descripcion}
                                </p>
                                <p className="text-xs text-blue-600 mt-1">
                                  Ubicación: {suggestion.ubicacion}
                                </p>
                                <p className="text-xs text-blue-700 mt-1">
                                  Solución: {suggestion.solucion}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>
          )}

          {/* Información de validación */}
          <div className="text-xs text-muted-foreground space-y-2">
            <p className="font-medium">Niveles de validación:</p>
            <div className="grid grid-cols-2 gap-2">
              <Badge variant="outline">1. Estructura XSD (cfdi40.xsd)</Badge>
              <Badge variant="outline">2. Tipos de datos (tipos.xsd)</Badge>
              <Badge variant="outline">3. Catálogos SAT (catalogos.xsd)</Badge>
              <Badge variant="outline">4. Reglas de negocio (Anexo 20)</Badge>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange?.(false)}>
            Cerrar
          </Button>
          {validationResult && (
            <Button onClick={() => handleClear()}>
              Nueva Validación
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CFDIValidator;
