'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRightLeft, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Search,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'pending' | 'matched' | 'review';
  match_id?: string;
  score?: number;
}

export function ReconciliationView() {
  const [isClassifying, setIsClassifying] = useState(false);

  // Mock data for split view
  const bankTransactions: Transaction[] = [
    { id: '1', date: '2026-03-10', description: 'TRANSFERENCIA SPEI RECIBIDA', amount: 15200.50, status: 'pending' },
    { id: '2', date: '2026-03-09', description: 'COMISION POR MEMBRESIA', amount: -350.00, status: 'matched', match_id: 'CFDI-99', score: 0.98 },
    { id: '3', date: '2026-03-08', description: 'PAGO DE PROVEEDOR CLOUD', amount: -4200.00, status: 'review', score: 0.75 },
  ];

  const internalRecords = [
    { id: 'CFDI-101', date: '2026-03-10', description: 'Factura Ingreso - Cliente A', amount: 15200.50 },
    { id: 'CFDI-102', date: '2026-03-08', description: 'Factura Egreso - AWS Cloud', amount: -4150.00 },
  ];

  const handleAIClassify = () => {
    setIsClassifying(true);
    setTimeout(() => {
      setIsClassifying(false);
      toast.success('Clasificación IA completada', {
        description: 'Se encontraron 12 matches con confianza > 90%',
      });
    }, 2000);
  };

  return (
    <div className="flex flex-col h-[700px] border rounded-xl overflow-hidden shadow-2xl bg-background">
      <div className="p-4 border-b flex items-center justify-between bg-muted/20">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5 text-primary" />
          <h2 className="font-bold text-lg">Conciliación Bancaria Inteligente</h2>
        </div>
        <Button 
          onClick={handleAIClassify} 
          disabled={isClassifying}
          className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          {isClassifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Clasificar con IA
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden divide-x">
        {/* Left Pane: Bank Transactions */}
        <div className="flex-1 flex flex-col min-w-0 bg-muted/5">
          <div className="p-4 border-b bg-card">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              ESTADO DE CUENTA <Badge variant="outline" className="text-[10px]">BANORTE</Badge>
            </h3>
          </div>
          <ScrollArea className="flex-1 p-2">
            <div className="space-y-2">
              {bankTransactions.map((tx) => (
                <Card key={tx.id} className={`cursor-pointer transition-all hover:ring-2 hover:ring-primary/20 ${tx.status === 'matched' ? 'opacity-70 grayscale-[0.5]' : ''}`}>
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] text-muted-foreground font-mono">{tx.date}</span>
                      <span className={`font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                      </span>
                    </div>
                    <p className="text-sm font-medium line-clamp-1 truncate uppercase">{tx.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      {tx.status === 'matched' ? (
                        <div className="flex items-center gap-1 text-green-600 text-[10px] font-bold">
                          <CheckCircle2 className="h-3 w-3" /> MATCHED
                        </div>
                      ) : tx.status === 'review' ? (
                        <div className="flex items-center gap-1 text-amber-600 text-[10px] font-bold">
                          <Search className="h-3 w-3" /> SUGERENCIA ({Math.round(tx.score! * 100)}%)
                        </div>
                      ) : (
                        <div className="text-[10px] text-muted-foreground italic">Sin conciliar</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Right Pane: Internal Records */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="p-4 border-b bg-card">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              REGISTROS INTERNOS <Badge variant="secondary" className="text-[10px]">CFDI</Badge>
            </h3>
          </div>
          <ScrollArea className="flex-1 p-2">
            <div className="space-y-2">
              {internalRecords.map((record) => (
                <Card key={record.id} className="border-dashed hover:border-solid hover:bg-muted/50 cursor-pointer transition-colors group">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start mb-1 text-[10px] text-muted-foreground">
                      <span>{record.id}</span>
                      <span>{record.date}</span>
                    </div>
                    <p className="text-sm font-medium group-hover:text-primary transition-colors">{record.description}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-bold text-xs">{record.amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</span>
                      <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

function Loader2({ className }: { className?: string }) {
  return <Loader2Icon className={`animate-spin ${className}`} />;
}

import { Loader2 as Loader2Icon } from 'lucide-react';

export default ReconciliationView;
