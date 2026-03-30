'use client';

import React from 'react';
import { useGetDocuments } from '@/hooks/use-idp';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileUploader } from '@/components/upload/file-uploader';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle, CheckCircle2, Clock, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DocumentsPage() {
  const { data: documents, isLoading } = useGetDocuments();
  const router = useRouter();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'processing': return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Documentos</h1>
        <p className="text-muted-foreground">Sube tus facturas y deja que la IA se encargue de la extracción.</p>
      </div>

      <Card className="border-2 border-primary/10 shadow-lg">
        <CardHeader>
          <CardTitle>Subir Nuevo Documento</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUploader />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estado de Procesamiento</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Documento</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Confianza</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents?.map((doc) => (
                  <TableRow key={doc.document_id}>
                    <TableCell className="font-medium">ID-{doc.document_id}</TableCell>
                    <TableCell>{doc.document_type}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(doc.status)}
                        <span className="capitalize">{doc.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {doc.confidence_score ? `${(doc.confidence_score * 100).toFixed(1)}%` : '-'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        disabled={doc.status !== 'completed'}
                        onClick={() => router.push(`/dashboard/chat?doc_id=${doc.document_id}`)}
                        className="gap-2"
                      >
                        <MessageSquare className="h-4 w-4" /> Consultar IA
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {!documents?.length && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No hay documentos procesados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
