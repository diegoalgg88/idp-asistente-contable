'use client';

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCalculatePayrollDraft, useStampPayroll } from '@/hooks/use-payroll';
import { Loader2, CheckCircle2, ChevronRight, Calculator, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export function DispersePaymentDialog() {
  const [step, setStep] = useState<'draft' | 'review' | 'success'>('draft');
  const [open, setOpen] = useState(false);
  
  const calculate = useCalculatePayrollDraft();
  const stamp = useStampPayroll();

  const handleCalculate = () => {
    calculate.mutate({ period: '2026-03' }, {
      onSuccess: () => setStep('review'),
      onError: (err) => toast.error('Error al calcular nómina: ' + err.message)
    });
  };

  const handleConfirm = () => {
    stamp.mutate({ batch_id: calculate.data?.id, human_approved: true }, {
      onSuccess: () => {
        setStep('success');
        toast.success('Nómina timbrada y dispersada exitosamente');
      },
      onError: (err) => toast.error('Error al timbrar: ' + err.message)
    });
  };

  const reset = () => {
    setOpen(false);
    setTimeout(() => setStep('draft'), 300);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Calculator className="h-4 w-4" /> Dispersar Nómina
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {step === 'draft' && 'Cálculo de Nómina'}
            {step === 'review' && 'Revisión de Dispersión'}
            {step === 'success' && 'Dispersión Completada'}
          </DialogTitle>
        </DialogHeader>

        <div className="py-6">
          {step === 'draft' && (
            <div className="space-y-4 text-center">
              <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto">
                <Calculator className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Preparar periodo Marzo 2026</h3>
                <p className="text-sm text-muted-foreground">
                  Se calcularán sueldos, retenciones de ISR e IMSS para toda la plantilla.
                </p>
              </div>
            </div>
          )}

          {step === 'review' && calculate.data && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Total Percepciones</p>
                  <p className="text-lg font-bold text-green-600">
                    ${calculate.data.total_perceptions.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 border rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Total Deducciones</p>
                  <p className="text-lg font-bold text-red-600">
                    ${calculate.data.total_deductions.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="p-4 border-2 border-primary/20 rounded-xl bg-primary/5 text-center">
                <p className="text-sm text-muted-foreground">Monto Neto a Dispersar</p>
                <p className="text-3xl font-black text-primary">
                  ${calculate.data.net_pay.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                <ShieldCheck className="h-4 w-4" />
                Esta acción es irreversible y generará los timbrados CFDI ante el SAT.
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="space-y-4 text-center">
              <div className="bg-green-100 p-4 rounded-full w-fit mx-auto">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">¡Proceso Exitoso!</h3>
                <p className="text-sm text-muted-foreground">
                  La nómina ha sido timbrada y los pagos han sido enviados a los empleados.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {step === 'draft' && (
            <Button onClick={handleCalculate} className="w-full" disabled={calculate.isPending}>
              {calculate.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Calcular Borrador'}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          {step === 'review' && (
            <div className="flex gap-2 w-full">
              <Button variant="outline" onClick={() => setStep('draft')} className="flex-1">
                Atrás
              </Button>
              <Button onClick={handleConfirm} className="flex-1" disabled={stamp.isPending}>
                {stamp.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Confirmar y Timbrar'}
              </Button>
            </div>
          )}
          {step === 'success' && (
            <Button onClick={reset} className="w-full">
              Cerrar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
