import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, AlertTriangle, Info } from "lucide-react"

interface TaxHealthScoreProps {
  score?: number;
  status?: 'healthy' | 'warning' | 'critical';
  details?: string[];
  isLoading?: boolean;
}

export function TaxHealthScore({ score = 95, status = 'healthy', details = [], isLoading = false }: TaxHealthScoreProps) {
  
  const getStatusConfig = () => {
    switch(status) {
      case 'healthy':
        return {
          color: 'text-green-500',
          stroke: 'stroke-green-500',
          bg: 'bg-green-500/10',
          icon: CheckCircle2,
          pulse: 'shadow-[0_0_8px_rgba(34,197,94,0.5)]',
          label: 'Saludable'
        }
      case 'warning':
        return {
          color: 'text-yellow-500',
          stroke: 'stroke-yellow-500',
          bg: 'bg-yellow-500/10',
          icon: AlertTriangle,
          pulse: 'shadow-[0_0_8px_rgba(234,179,8,0.5)]',
          label: 'Precaución'
        }
      case 'critical':
        return {
          color: 'text-red-500',
          stroke: 'stroke-red-500',
          bg: 'bg-red-500/10',
          icon: AlertCircle,
          pulse: 'shadow-[0_0_8px_rgba(239,68,68,0.5)]',
          label: 'Crítico'
        }
      default:
        return {
          color: 'text-muted-foreground',
          stroke: 'stroke-muted',
          bg: 'bg-muted/10',
          icon: Info,
          pulse: '',
          label: 'Desconocido'
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon
  
  // Math para stroke-dashoffset (semicírculo o círculo)
  const radius = 34
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <Card className="glass-card border-border/40 overflow-hidden group h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-bold text-foreground flex items-center justify-between">
          Tax Health Score
          {!isLoading && (
            <div className={`w-2 h-2 rounded-full ${config.bg.replace('/10', '')} animate-pulse ${config.pulse}`} />
          )}
        </CardTitle>
        <CardDescription className="text-[10px] uppercase tracking-wider">
          Auditoría de Cumplimiento SAT
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-6">
              <div className="relative">
                <svg className="w-24 h-24 -rotate-90">
                  <circle cx="48" cy="48" r={radius} className="stroke-muted/20 fill-none" strokeWidth="8" />
                  <circle
                    cx="48" cy="48" r={radius}
                    className={`${config.stroke} fill-none transition-all duration-1000 ease-out`} 
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className={`text-2xl font-black italic ${config.color}`}>{score.toFixed(1)}</span>
                </div>
              </div>
              <div>
                <p className={`text-lg font-black uppercase italic leading-none ${config.color}`}>
                  {config.label}
                </p>
                <p className="text-[10px] text-muted-foreground font-bold mt-1">
                  0 Días de Atraso
                </p>
              </div>
            </div>

            {details.length > 0 && (
              <div className="space-y-2 mt-4">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Factores de Descuento</p>
                {details.map((detail, idx) => (
                  <div key={idx} className={`p-3 rounded-xl border flex items-center gap-3 text-xs ${config.bg} border-${config.color.split('-')[1]}-500/20`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                    <span className="font-medium text-foreground">{detail}</span>
                  </div>
                ))}
              </div>
            )}
            
            {details.length === 0 && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-xs font-medium text-green-500">Sin anomalías detectadas en operaciones EFO o presupuestos.</span>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
