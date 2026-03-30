import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileCheck, ShieldCheck, Download, Mail, Share2, Award } from "lucide-react"

export function AuditReportGenerator() {
  const isGenerating = false
  
  return (
    <Card className="glass-card border-primary/30 bg-primary/5 overflow-hidden">
      <CardHeader className="text-center pb-8 border-b border-primary/20 bg-primary/5">
         <div className="w-16 h-16 bg-primary text-primary-foreground rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-primary/40">
            <ShieldCheck className="w-8 h-8" />
         </div>
         <CardTitle className="text-2xl font-black uppercase italic tracking-tighter">Dictamen de Inteligencia Contable</CardTitle>
         <CardDescription className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/70">Certificación de Salud Fiscal v2026.1</CardDescription>
      </CardHeader>
      
      <CardContent className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
             <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <span>Integridad de Datos</span>
                <span>98.5%</span>
             </div>
             <Progress value={98.5} className="h-2 bg-primary/10" />
             <p className="text-[10px] text-muted-foreground font-medium leading-relaxed italic">
                * El reporte analiza 3,450 CFDI, 850 Pólizas y 12 Estados de Cuenta del periodo actual.
             </p>
          </div>
          <div className="space-y-4">
             <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <span>Cumplimiento SAT/IMSS</span>
                <span className="text-green-500">OPTIMAL</span>
             </div>
             <Progress value={100} className="h-2 bg-green-500/20" />
             <p className="text-[10px] text-muted-foreground font-medium leading-relaxed italic">
                * Verificación cruzada con la lista 69-B del SAT (EFOs/EDOs) completada con éxito.
             </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-background/60 border border-primary/10 relative">
           <div className="flex items-center gap-4 mb-4">
              <Award className="w-5 h-5 text-primary" />
              <h4 className="text-xs font-black uppercase tracking-widest text-foreground">Sello Digital de Auditoría</h4>
           </div>
           <div className="font-mono text-[9px] text-muted-foreground break-all opacity-60">
              AUDIT-SIGN-2026-69AFB-9021-4EF1-A2B3-C4D5E6F7A8B9-SHA256:77890BCDEF1234567890ABCDEF...
           </div>
           <div className="absolute bottom-4 right-4 opacity-10">
              <ShieldCheck className="w-16 h-16 text-primary" />
           </div>
        </div>
      </CardContent>

      <CardFooter className="p-8 bg-primary/10 flex flex-col md:flex-row gap-4">
         <Button className="flex-1 h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-primary/30">
            <Download className="w-4 h-4 mr-3" /> Descargar Reporte Maestro (PDF)
         </Button>
         <div className="flex gap-2">
            <Button variant="outline" size="icon" className="h-14 w-14 border-primary/20 text-primary hover:bg-primary/5">
               <Mail className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" className="h-14 w-14 border-primary/20 text-primary hover:bg-primary/5">
               <Share2 className="w-5 h-5" />
            </Button>
         </div>
      </CardFooter>
    </Card>
  )
}
