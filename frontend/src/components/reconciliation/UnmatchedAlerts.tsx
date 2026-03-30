/**
 * UnmatchedAlerts Component
 * Alertas de transacciones no conciliadas y faltantes
 * 
 * Características:
 * - Muestra transacciones sin match
 * - Alertas de facturas sin pago
 * - Alertas de pagos sin factura
 * - Sugerencias de acción
 * 
 * @see https://www.radix-ui.com/themes/docs/components/callout
 * @see https://www.radix-ui.com/themes/docs/components/alert
 */

import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  AlertTriangle,
  FileX2,
  Receipt,
  Clock,
  Search,
  ArrowRight,
  CheckCircle2,
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { BankTransaction } from '@/store/reconciliationStore';

export interface UnmatchedAlertsProps {
  unmatchedTransactions: BankTransaction[];
  isLoading?: boolean;
  onTransactionSelect?: (transaction: BankTransaction) => void;
  onSearchCFDI?: (concepto: string, monto: number) => void;
}

export interface UnmatchedTransaction extends BankTransaction {
  alertType: 'invoice_without_payment' | 'payment_without_invoice' | 'suspicious';
  daysOld: number;
  suggestedAction: string;
}

export const UnmatchedAlerts: React.FC<UnmatchedAlertsProps> = ({
  unmatchedTransactions,
  isLoading = false,
  onTransactionSelect,
  onSearchCFDI,
}) => {
  // Clasificar transacciones no conciliadas
  const classifiedTransactions = React.useMemo<UnmatchedTransaction[]>(() => {
    return unmatchedTransactions.map((tx) => {
      // Calcular días de antigüedad
      const daysOld = Math.floor(
        (Date.now() - new Date(tx.fecha).getTime()) / (1000 * 60 * 60 * 24)
      );

      // Determinar tipo de alerta
      let alertType: UnmatchedTransaction['alertType'];
      let suggestedAction: string;

      if (tx.tipo === 'abono') {
        // Pago sin factura
        alertType = 'payment_without_invoice';
        suggestedAction = 'Buscar factura correspondiente o clasificar como ingreso diverso';
      } else if (tx.tipo === 'cargo') {
        // Factura sin pago
        alertType = 'invoice_without_payment';
        suggestedAction = 'Verificar si ya se pagó o solicitar factura';
      } else {
        // Sospechoso
        alertType = 'suspicious';
        suggestedAction = 'Revisar manualmente y conciliar';
      }

      return {
        ...tx,
        alertType,
        daysOld,
        suggestedAction,
      };
    });
  }, [unmatchedTransactions]);

  // Agrupar por tipo de alerta
  const groupedTransactions = React.useMemo(() => {
    const groups = {
      invoice_without_payment: [] as UnmatchedTransaction[],
      payment_without_invoice: [] as UnmatchedTransaction[],
      suspicious: [] as UnmatchedTransaction[],
    };

    classifiedTransactions.forEach((tx) => {
      groups[tx.alertType].push(tx);
    });

    return groups;
  }, [classifiedTransactions]);

  // Calcular totales
  const totals = React.useMemo(() => {
    const totalIngresos = groupedTransactions.payment_without_invoice.reduce(
      (sum, tx) => sum + tx.monto,
      0
    );
    const totalEgresos = groupedTransactions.invoice_without_payment.reduce(
      (sum, tx) => sum + tx.monto,
      0
    );

    return {
      totalIngresos,
      totalEgresos,
      totalFaltantes: classifiedTransactions.length,
    };
  }, [groupedTransactions, classifiedTransactions]);

  // Formatear monto
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: es });
    } catch {
      return dateString;
    }
  };

  // Obtener icono por tipo de alerta
  const getAlertIcon = (alertType: UnmatchedTransaction['alertType']) => {
    switch (alertType) {
      case 'invoice_without_payment':
        return <FileX2 className="h-5 w-5 text-yellow-600" />;
      case 'payment_without_invoice':
        return <Receipt className="h-5 w-5 text-blue-600" />;
      case 'suspicious':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
    }
  };

  // Obtener color de badge por tipo
  const getBadgeVariant = (alertType: UnmatchedTransaction['alertType']) => {
    switch (alertType) {
      case 'invoice_without_payment':
        return 'secondary' as const;
      case 'payment_without_invoice':
        return 'outline' as const;
      case 'suspicious':
        return 'destructive' as const;
    }
  };

  // Obtener título por tipo
  const getAlertTitle = (alertType: UnmatchedTransaction['alertType']) => {
    switch (alertType) {
      case 'invoice_without_payment':
        return 'Factura Sin Pago';
      case 'payment_without_invoice':
        return 'Pago Sin Factura';
      case 'suspicious':
        return 'Transacción Sospechosa';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Cargando alertas...</p>
        </div>
      </div>
    );
  }

  if (unmatchedTransactions.length === 0) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle2 className="h-5 w-5 text-green-600" />
        <AlertTitle className="text-green-800">¡Todo conciliado!</AlertTitle>
        <AlertDescription className="text-green-700">
          No hay transacciones pendientes de conciliación.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Facturas Sin Pago</CardDescription>
            <CardTitle className="text-2xl">
              {groupedTransactions.invoice_without_payment.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Total: {formatAmount(totals.totalEgresos)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pagos Sin Factura</CardDescription>
            <CardTitle className="text-2xl">
              {groupedTransactions.payment_without_invoice.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Total: {formatAmount(totals.totalIngresos)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Faltantes</CardDescription>
            <CardTitle className="text-2xl">{totals.totalFaltantes}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Requieren atención
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas por tipo */}
      {Object.entries(groupedTransactions).map(([alertType, transactions]) => {
        if (transactions.length === 0) return null;

        return (
          <Card key={alertType}>
            <CardHeader>
              <div className="flex items-center gap-2">
                {getAlertIcon(alertType as UnmatchedTransaction['alertType'])}
                <CardTitle>{getAlertTitle(alertType as UnmatchedTransaction['alertType'])}</CardTitle>
                <Badge variant={getBadgeVariant(alertType as UnmatchedTransaction['alertType'])}>
                  {transactions.length}
                </Badge>
              </div>
              <CardDescription>
                Transacciones sin conciliar que requieren atención
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => onTransactionSelect?.(tx)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{tx.concepto}</p>
                            {tx.daysOld > 30 && (
                              <Badge variant="destructive" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                {tx.daysOld} días
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{formatDate(tx.fecha)}</span>
                            <span className="font-medium">{formatAmount(tx.monto)}</span>
                            {tx.proveedor && (
                              <span>{tx.proveedor}</span>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="flex items-center justify-between w-full">
                <p className="text-sm text-muted-foreground">
                  {transactions[0].suggestedAction}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const firstTx = transactions[0];
                    onSearchCFDI?.(firstTx.concepto, firstTx.monto);
                  }}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Buscar CFDI
                </Button>
              </div>
            </CardFooter>
          </Card>
        );
      })}

      {/* Alerta general */}
      <Alert>
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle>Transacciones no conciliadas</AlertTitle>
        <AlertDescription>
          Estas transacciones no coincidieron con ningún CFDI. Revisa manualmente o espera a que
          lleguen las facturas faltantes.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default UnmatchedAlerts;
