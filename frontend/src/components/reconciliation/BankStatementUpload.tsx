/**
 * BankStatementUpload Component
 * Componente para subir estados de cuenta bancarios
 * 
 * Características:
 * - Drag and drop de archivos CSV/XLSX
 * - Detección automática de banco
 * - Barra de progreso de carga
 * - Validación de tipo y tamaño de archivo
 * 
 * @see https://www.radix-ui.com/themes/docs/components/dialog
 * @see https://www.radix-ui.com/themes/docs/components/progress
 */

import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useReconciliationStore } from '@/store/reconciliationStore';
import { useUploadBankStatement } from '@/hooks/useReconciliation';

export interface BankStatementUploadProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onUploadComplete?: (batchId: number) => void;
}

export const BankStatementUpload: React.FC<BankStatementUploadProps> = ({
  open = false,
  onOpenChange,
  onUploadComplete,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const { mutate: uploadBankStatement, isPending, isSuccess, error: uploadError } =
    useUploadBankStatement();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manejar upload completo
  React.useEffect(() => {
    if (isSuccess && onUploadComplete) {
      setTimeout(() => {
        onUploadComplete(Date.now()); // TODO: Reemplazar con batchId real
        onOpenChange?.(false);
        setFiles([]);
        setUploadProgress(0);
      }, 1000);
    }
  }, [isSuccess, onUploadComplete, onOpenChange]);

  // Manejar error de upload
  React.useEffect(() => {
    if (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : 'Error al subir archivo'
      );
    }
  }, [uploadError]);

  // Validar archivo
  const validateFile = useCallback((file: File): string | null => {
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    const allowedExtensions = ['.csv', '.xlsx', '.xls'];

    // Validar extensión
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      return `Extensión no permitida: ${extension}. Use CSV, XLSX o XLS`;
    }

    // Validar tipo MIME
    if (!allowedTypes.includes(file.type) && file.type !== '') {
      return `Tipo de archivo no permitido: ${file.type || 'desconocido'}`;
    }

    // Validar tamaño (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return `Archivo muy grande: ${(file.size / 1024 / 1024).toFixed(2)}MB. Máximo 50MB`;
    }

    return null;
  }, []);

  // Manejar drop de archivos
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError(null);

      // Procesar archivos rechazados
      if (rejectedFiles.length > 0) {
        const rejectionReason = rejectedFiles[0].errors[0]?.message;
        setError(rejectionReason || 'Archivo no válido');
        return;
      }

      // Validar cada archivo aceptado
      const validationErrors: string[] = [];
      const validFiles: File[] = [];

      acceptedFiles.forEach((file) => {
        const validationError = validateFile(file);
        if (validationError) {
          validationErrors.push(validationError);
        } else {
          validFiles.push(file);
        }
      });

      if (validationErrors.length > 0) {
        setError(validationErrors.join('. '));
        return;
      }

      setFiles(validFiles);
    },
    [validateFile]
  );

  // Configurar dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxFiles: 1,
    multiple: false,
  });

  // Manejar selección de archivo desde input
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (selectedFiles && selectedFiles.length > 0) {
        onDrop(Array.from(selectedFiles), []);
      }
    },
    [onDrop]
  );

  // Manejar upload
  const handleUpload = useCallback(() => {
    if (files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append('file', file);

    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress((p) => Math.min(p + 10, 90));
    }, 500);

    uploadBankStatement(formData, {
      onSuccess: () => {
        clearInterval(interval);
        setUploadProgress(100);
      },
      onError: () => {
        clearInterval(interval);
        setUploadProgress(0);
      }
    });
  }, [files, uploadBankStatement]);

  // Limpiar archivo seleccionado
  const handleClearFile = useCallback(() => {
    setFiles([]);
    setUploadProgress(0);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  // Renderizar icono según tipo de archivo
  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    if (extension === 'csv') return <FileSpreadsheet className="h-8 w-8 text-green-500" />;
    if (extension === 'xlsx') return <FileSpreadsheet className="h-8 w-8 text-blue-500" />;
    if (extension === 'xls') return <FileSpreadsheet className="h-8 w-8 text-yellow-500" />;
    return <FileSpreadsheet className="h-8 w-8 text-gray-500" />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Subir Estado de Cuenta Bancario</DialogTitle>
          <DialogDescription>
            Arrastra y suelta tu estado de cuenta o haz clic para seleccionar. Soportamos CSV,
            XLSX y XLS.
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
              ${isPending ? 'pointer-events-none opacity-50' : ''}
            `}
          >
            <input {...getInputProps()} ref={fileInputRef} onChange={handleFileSelect} />

            {isDragActive ? (
              <div className="space-y-2">
                <Upload className="h-12 w-12 mx-auto text-primary animate-bounce" />
                <p className="text-sm text-primary font-medium">Suelta el archivo aquí...</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Arrastra y suelta tu estado de cuenta aquí, o{' '}
                  <span className="text-primary font-medium">haz clic para explorar</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Formatos soportados: CSV, XLSX, XLS (Max 50MB)
                </p>
              </div>
            )}
          </div>

          {/* Archivo seleccionado */}
          {files.length > 0 && (
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getFileIcon(files[0].name)}
                  <div>
                    <p className="text-sm font-medium">{files[0].name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(files[0].size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                {!isPending && (
                  <Button variant="ghost" size="icon" onClick={handleClearFile}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Barra de progreso */}
              {uploadProgress > 0 && (
                <div className="space-y-1">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-right">
                    {uploadProgress.toFixed(0)}%
                  </p>
                </div>
              )}

              {/* Estado de procesamiento */}
              {isPending && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Procesando estado de cuenta...
                </div>
              )}

              {isSuccess && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  ¡Estado de cuenta subido exitosamente!
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Información de bancos soportados */}
          <div className="text-xs text-muted-foreground space-y-2">
            <p className="font-medium">Bancos soportados (15+):</p>
            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary" className="text-xs">
                BBVA
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Santander
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Banorte
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Citibanamex
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Scotiabank
              </Badge>
              <Badge variant="secondary" className="text-xs">
                HSBC
              </Badge>
              <Badge variant="secondary" className="text-xs">
                +9 más
              </Badge>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange?.(false)} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={handleUpload} disabled={files.length === 0 || isPending}>
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Subir Estado de Cuenta
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BankStatementUpload;
