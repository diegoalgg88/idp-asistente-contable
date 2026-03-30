'use client';

import React from 'react';
import { useGetFiscalStatus } from '@/hooks/use-finance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertTriangle, Calendar, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function ComplianceCard() {
  const { data, isLoading } = useGetFiscalStatus();

  if (isLoading) return <Skeleton className="h-[200px] w-full" />;

  const isPositive = data?.compliance_opinion === 'positive';

  return (
    <Card className="overflow-hidden border-2 transition-all hover:shadow-md">
      <CardHeader className={`${isPositive ? 'bg-green-50/50' : 'bg-amber-50/50'} border-b`}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Opinión de Cumplimiento</CardTitle>
          <Badge variant={isPositive ? 'default' : 'outline'} className={isPositive ? 'bg-green-500 hover:bg-green-600' : 'text-amber-600 border-amber-200'}>
            {isPositive ? 'Positiva' : 'Pendiente'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${isPositive ? 'bg-green-100' : 'bg-amber-100'}`}>
            {isPositive ? (
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">SAT Estatus</p>
            <p className="text-lg font-bold">Sin créditos fiscales pendientes</p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
            <Calendar className="h-3 w-3" /> PRÓXIMOS VENCIMIENTOS
          </p>
          {data?.tax_deadlines.map((deadline, i) => (
            <div key={i} className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/50">
              <span className="font-medium truncate mr-2">{deadline.title}</span>
              <span className={`text-xs px-2 py-0.5 rounded ${
                deadline.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {deadline.due_date}
              </span>
            </div>
          ))}
        </div>
        
        <Button variant="ghost" className="w-full mt-2 text-xs h-8 group" size="sm">
          Ver reporte completo <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardContent>
    </Card>
  );
}
