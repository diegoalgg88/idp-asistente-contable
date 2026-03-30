import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AlertCircle, AlertTriangle, Info, ArrowUpRight, ShieldAlert } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface RiskAlert {
  id: string
  risk_type: string
  severity: 'CRITICAL' | 'WARNING' | 'INFO'
  message: string
  transaction_id?: string
  date: string
  amount_at_risk?: number
}

interface RiskAlertsProps {
  alerts: RiskAlert[]
  isLoading?: boolean
}

export function RiskAlerts({ alerts, isLoading = false }: RiskAlertsProps) {
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const getSeverityConfig = (severity: string) => {
    switch(severity) {
      case 'CRITICAL':
        return {
          icon: AlertCircle,
          color: 'text-red-500',
          bg: 'bg-red-500/10',
          border: 'border-red-500/20'
        }
      case 'WARNING':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-500',
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/20'
        }
      default:
        return {
          icon: Info,
          color: 'text-blue-500',
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/20'
        }
    }
  }

  return (
    <Card className="glass-card border-border/40 h-full flex flex-col">
      <CardHeader className="flex-none">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-foreground">Detección de Riesgos EFO</CardTitle>
            <CardDescription className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
              Monitoreo del Art. 69-B SAT
            </CardDescription>
          </div>
          <div className="p-2 bg-red-500/10 rounded-xl border border-red-500/20">
            <ShieldAlert className="w-4 h-4 text-red-500" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-muted/20 h-20 rounded-xl" />
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-green-500/5 rounded-xl border border-green-500/20">
            <ShieldAlert className="w-8 h-8 text-green-500 mb-3 opacity-50" />
            <span className="text-sm font-bold text-green-500 uppercase tracking-wide">Padrón Seguro</span>
            <span className="text-xs text-muted-foreground mt-1">No hay proveedores en listas negras del SAT.</span>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {alerts.map((alert) => {
              const cfg = getSeverityConfig(alert.severity)
              const Icon = cfg.icon
              
              return (
                <div 
                  key={alert.id}
                  className={`p-4 rounded-xl border ${cfg.border} ${cfg.bg} flex gap-4 group hover:bg-background/40 transition-colors cursor-pointer relative overflow-hidden`}
                >
                  <div className={`p-2 rounded-lg bg-background/50 h-fit ${cfg.border} border`}>
                    <Icon className={`w-4 h-4 ${cfg.color}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <Badge className={`${cfg.bg} ${cfg.color} border-none text-[9px] uppercase font-black px-2 py-0.5`}>
                        {alert.risk_type}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground font-medium">{new Date(alert.date).toLocaleDateString()}</span>
                    </div>
                    
                    <p className="text-xs font-semibold text-foreground line-clamp-2 leading-tight">
                      {alert.message}
                    </p>
                    
                    {alert.amount_at_risk && (
                      <p className={`text-[11px] font-black mt-2 ${cfg.color} italic`}>
                        Monto en riesgo: {formatCurrency(alert.amount_at_risk)}
                      </p>
                    )}
                  </div>
                  
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className={`w-4 h-4 ${cfg.color}`} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
