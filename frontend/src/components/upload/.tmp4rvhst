'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useUploadDocument } from '@/hooks/use-idp';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, X, File, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const uploadMutation = useUploadDocument();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    multiple: false,
  });

  const handleUpload = () => {
    if (!file) return;
    uploadMutation.mutate({ file, type: 'factura' }, {
      onSuccess: () => {
        setFile(null);
        toast.success('Documento subido y en proceso');
      },
      onError: (err) => {
        toast.error('Error al subir: ' + err.message);
      }
    });
  };

  return (
    <div className="space-y-4 w-full">
      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/20 hover:border-primary/50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <p className="text-sm font-medium">
            {isDragActive ? 'Suelta el archivo aquí' : 'Arrastra un PDF o imagen aquí'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Máximo 10MB (PDF, PNG, JPG)
          </p>
        </div>
      ) : (
        <div className="border rounded-xl p-4 flex items-center justify-between bg-card shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-2 rounded-lg">
              <File className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setFile(null)}
                disabled={uploadMutation.isPending}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button 
                onClick={handleUpload} 
                disabled={uploadMutation.isPending}
            >
              {uploadMutation.isPending ? 'Subiendo...' : 'Procesar'}
            </Button>
          </div>
        </div>
      )}
      
      {uploadMutation.isPending && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Subiendo documento...</span>
            <span>En cola</span>
          </div>
          <Progress value={45} className="h-1" />
        </div>
      )}
    </div>
  );
}
