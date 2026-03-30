'use client';

import React from 'react';
import { useGetFiscalStatus } from '@/hooks/use-finance';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function Header() {
  const { data, isLoading } = useGetFiscalStatus();

  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">
            IDP
          </div>
          <h1 className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hidden md:block">
            Asistente Contable
          </h1>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 cursor-help border rounded-full px-3 py-1 bg-muted/30">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Estatus SAT</span>
                {isLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                ) : data?.compliance_opinion === 'positive' ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 h-5 px-2 text-[10px]">
                    <ShieldCheck className="h-3 w-3 mr-1" /> Positivo
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="h-5 px-2 text-[10px]">
                    <AlertCircle className="h-3 w-3 mr-1" /> Pendiente
                  </Badge>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{data?.compliance_opinion === 'positive' ? 'Tu cumplimiento fiscal está al día.' : 'Tienes tareas fiscales pendientes.'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
}
