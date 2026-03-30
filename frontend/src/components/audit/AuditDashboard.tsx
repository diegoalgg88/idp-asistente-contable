import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ShieldCheck, AlertTriangle, Info, FileSearch, Filter, Download } from "lucide-react"

export function AuditDashboard() {
  const auditScore = 88.5
  const findings = [
    { id: "AUD-01", type: "CRITICAL", title: "CFDI sin Póliza", detail: "14 facturas vigentes no rastreadas en el Libro Diario.", impact: "$145,200.00" },
    { id: "AUD-02", type: "WARNING", title: "Duplicidad de Póliza", detail: "Posible doble registro en Pólizas de Egresos E-102/105.", impact: "$12,500.00" },
    { id: "AUD-03", type: "INFO", title: "Patrón Benford", detail: "Desviación mínima en dígitos significativos de gastos de viaje.", impact: "Low Risk" }
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Integrity Score */}
        <Card className="glass-card border-primary/20 bg-primary/5 col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-primary">Audit Integrity Score</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="relative mb-4">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/20" />
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364.4} strokeDashoffset={364.4 * (1 - auditScore / 100)} className="text-primary transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-foreground">{auditScore}%</span>
                <span className="text-[8px] font-bold text-muted-foreground uppercase">NIA Compliant</span>
              </div>
            </div>
            <p className="text-[10px] text-center text-muted-foreground font-medium px-4">
                Salud fiscal dentro del umbral de confianza. Se requiere revisión de 2 puntos críticos.
            </p>
          </CardContent>
        </Card>

        {/* Stats Summary */}
        <Card className="glass-card border-border/40 col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest">Resumen de Auditoría</CardTitle>
            <Button variant="outline" size="sm" className="h-7 text-[9px] font-black uppercase tracking-widest">Nueva Auditoría</Button>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full py-6">
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
                <AlertTriangle className="w-5 h-5 text-red-500 mx-auto mb-2" />
                <h3 className="text-2xl font-black text-red-500">02</h3>
                <p className="text-[9px] font-bold uppercase text-red-500/70">Críticos</p>
            </div>
            <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-center">
                <ShieldCheck className="w-5 h-5 text-yellow-500 mx-auto mb-2" />
                <h3 className="text-2xl font-black text-yellow-500">05</h3>
                <p className="text-[9px] font-bold uppercase text-yellow-500/70">Advertencias</p>
            </div>
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center">
                <Info className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                <h3 className="text-2xl font-black text-blue-500">12</h3>
                <p className="text-[9px] font-bold uppercase text-blue-500/70">Lecciones</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Findings List */}
      <Card className="glass-card border-border/40">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-black uppercase tracking-tight">Hallazgos de Auditoría (NIA 2026)</CardTitle>
              <CardDescription className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-1">Detección de irregularidades en tiempo real</CardDescription>
            </div>
            <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8"><Filter className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="w-4 h-4" /></Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {findings.map((f) => (
            <div key={f.id} className="group p-4 rounded-xl border border-border/20 bg-background/40 hover:bg-background/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`mt-1 p-2 rounded-lg ${
                    f.type === 'CRITICAL' ? 'bg-red-500/10 text-red-500' : 
                    f.type === 'WARNING' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-blue-500/10 text-blue-500'
                }`}>
                    <FileSearch className="w-4 h-4" />
                </div>
                <div>
                   <div className="flex items-center gap-2 mb-1">
                      <span className="text-[8px] font-black tracking-widest text-muted-foreground">{f.id}</span>
                      <h4 className="text-xs font-black uppercase text-foreground">{f.title}</h4>
                   </div>
                   <p className="text-[10px] text-muted-foreground font-medium leading-tight max-w-md">{f.detail}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 justify-between md:justify-end">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-foreground">{f.impact}</p>
                    <p className="text-[8px] uppercase font-bold text-muted-foreground">Monto Expuesto</p>
                  </div>
                  <Button variant="outline" className="h-8 text-[9px] font-black uppercase tracking-widest border-border/40 hover:bg-primary/5">Resolver</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
