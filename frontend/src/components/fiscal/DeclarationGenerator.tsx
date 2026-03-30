import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Layers, Download, Search, CheckCircle2 } from "lucide-react"

export function DeclarationGenerator() {
  const forms = [
    { id: "DM-1", name: "ISR Personas Físicas", status: "LISTO", items: 12 },
    { id: "DM-2", name: "IVA Trasladado/Retenciones", status: "LISTO", items: 8 },
    { id: "DIOT", name: "Operaciones con Terceros", status: "PENDIENTE", items: 45 }
  ]

  return (
    <Card className="glass-card border-border/40 h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-black uppercase tracking-tight">Declaraciones SAT</CardTitle>
            <CardDescription className="text-[10px] font-medium text-muted-foreground mt-1">Generación de archivos para carga masiva</CardDescription>
          </div>
          <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
            <Layers className="w-4 h-4 text-orange-500" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-4">
        <div className="space-y-3">
          {forms.map((form) => (
            <div key={form.id} className="p-4 rounded-xl border border-border/30 bg-background/40 hover:bg-background/60 transition-colors flex items-center justify-between group">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-foreground">{form.id}</span>
                  <Badge variant="outline" className={`text-[8px] font-black border-none ${form.status === 'LISTO' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                    {form.status}
                  </Badge>
                </div>
                <p className="text-[10px] text-muted-foreground font-medium">{form.name}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="text-right mr-3 hidden md:block">
                  <p className="text-[10px] font-black text-foreground">{form.items}</p>
                  <p className="text-[8px] uppercase font-bold text-muted-foreground">Campos</p>
                </div>
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                  <Download className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-5 rounded-2xl bg-primary/10 border border-primary/20 relative overflow-hidden">
          <div className="relative z-10 flex items-start gap-4">
            <div className="p-2 rounded-lg bg-primary text-primary-foreground">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-foreground leading-tight">Robot SAT Playwright</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                Listo para automatizar la presentación de declaraciones en el portal oficial sin intervención manual.
              </p>
              <Button className="mt-4 w-full bg-foreground text-background font-black uppercase text-[10px] tracking-widest h-9 border-none hover:bg-foreground/90 py-0">
                Lanzar Bot de Envío
              </Button>
            </div>
          </div>
          <div className="absolute bottom-[-20%] right-[-10%] opacity-10">
             <Layers className="w-32 h-32 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
