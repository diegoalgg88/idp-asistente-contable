import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle2, Circle, Clock, GitBranch } from "lucide-react"

export function WorkflowProgress() {
  const steps = [
    { name: "Carga de Datos", desc: "Sincronización de CFDI y Nómina", status: "completed" },
    { name: "Motor de Cálculo", desc: "Ejecución de IMSSCalculator / TaxCalculator", status: "completed" },
    { name: "Validación Experta", desc: "Aprobación del Contador (Human-in-the-loop)", status: "active" },
    { name: "Timbrado / Envío", desc: "Conexión con PAC y Portal SAT", status: "pending" }
  ]

  return (
    <Card className="glass-card border-border/40 h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <GitBranch className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <CardTitle className="text-sm font-black uppercase tracking-tight">LangGraph Pipeline</CardTitle>
            <CardDescription className="text-[10px] font-medium text-muted-foreground mt-0.5">Estado de orquestación de tareas complejas</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative">
        {/* Vertical Line */}
        <div className="absolute left-[2.25rem] top-4 bottom-8 w-[2px] bg-border/20 -z-0" />
        
        <div className="space-y-6 relative z-10">
          {steps.map((step, i) => (
            <div key={i} className={`flex gap-5 group items-start ${step.status === 'pending' ? 'opacity-40' : 'opacity-100'}`}>
              <div className={`mt-1 p-2 rounded-full border-2 transition-all duration-500 ${
                step.status === 'completed' ? 'bg-green-500 border-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 
                step.status === 'active' ? 'bg-background border-primary text-primary animate-pulse' : 
                'bg-background border-border/30 text-muted-foreground'
              }`}>
                {step.status === 'completed' ? <CheckCircle2 className="w-3.5 h-3.5" /> : 
                 step.status === 'active' ? <Clock className="w-3.5 h-3.5" /> :
                 <Circle className="w-3.5 h-3.5" />
                }
              </div>
              
              <div className="flex-1 space-y-1">
                <h4 className={`text-xs font-black uppercase tracking-wide group-hover:translate-x-1 transition-transform ${
                     step.status === 'active' ? 'text-primary' : 'text-foreground'
                }`}>
                  {step.name}
                </h4>
                <p className="text-[10px] font-medium text-muted-foreground italic leading-tight">{step.desc}</p>
              </div>
              
              {step.status === 'active' && (
                <div className="animate-pulse flex items-center gap-1.5 bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                   <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
                   <span className="text-[8px] font-black text-primary uppercase">Procesando</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
