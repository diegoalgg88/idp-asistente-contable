'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-destructive/5 rounded-2xl border border-destructive/20 m-4">
          <div className="bg-destructive/10 p-4 rounded-full mb-4">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
          <h2 className="text-xl font-bold mb-2">¡Algo salió mal!</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Ocurrió un error inesperado en este módulo. Hemos notificado al equipo técnico.
          </p>
          <Button 
            onClick={() => this.setState({ hasError: false })}
            variant="default"
            className="gap-2"
          >
            <RefreshCcw className="h-4 w-4" /> Reintentar Cargar
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
