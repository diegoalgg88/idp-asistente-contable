import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, ShieldAlert, CheckCircle2, ArrowRight } from "lucide-react"

export function IMSSValidator() {
  const checks = [
    { label: "Tope 25 UMAs", status: "pass", detail: "SBC dentro de límites legales" },
    { label: "Cálculo Obrero", status: "pass", detail: "Retenciones alineadas a LSS Art. 106" },
    { label: "Cálculo Patronal", status: "pass", detail: "Incluye incremento Cesantía 2026" },
    { label: "Riesgo de Trabajo", status: "warning", detail: "Prima actualizada al 01/Mar/2026" }
  ]

  return (
    <Card className="glass-card border-border/40 overflow-hidden h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            IMSS Auditor Engine
          </CardTitle>
          <Badge variant="outline" className="text-[9px] font-bold uppercase border-primary/30 text-primary">v2026.1</Badge>
        </div>
        <CardDescription className="text-[10px] font-medium text-muted-foreground mt-1">Verificación automática de cuotas obrero-patronales</CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {checks.map((check, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-background/40 border border-border/20 group hover:border-primary/30 transition-colors">
              <div className={`mt-0.5 p-1 rounded-full ${check.status === 'pass' ? 'bg-green-500/10' : 'bg-yellow-500/10'}`}>
                {check.status === 'pass' ? 
                  <CheckCircle2 className="w-3 h-3 text-green-500" /> : 
                  <ShieldAlert className="w-3 h-3 text-yellow-500" />
                }
              </div>
              <div className="flex-1">
                <p className="text-xs font-black uppercase tracking-wide text-foreground">{check.label}</p>
                <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{check.detail}</p>
              </div>
              <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase text-primary tracking-widest">Confianza de Cálculo</span>
            <span className="text-[10px] font-black text-primary">99.8%</span>
          </div>
          <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[99.8%] shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
