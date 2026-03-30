import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Landmark, Scale, FileText, ChevronRight } from "lucide-react"

export function TaxCalculator() {
  const [income, setIncome] = useState<number>(45000)
  const [regime, setRegime] = useState<string>("RESICO_PF")

  // Mock Tax Logic
  const isrRate = regime === "RESICO_PF" ? 0.015 : 0.23
  const isrAmount = income * isrRate
  const ivaAmount = income * 0.16
  const totalTax = isrAmount + ivaAmount

  return (
    <Card className="glass-card border-border/40 overflow-hidden">
      <CardHeader className="bg-purple-500/5 border-b border-border/40">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-black uppercase italic tracking-tight">Tax Engine 2026</CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-purple-400">Determinación de Impuestos Federales</CardDescription>
          </div>
          <Scale className="w-8 h-8 text-purple-500 opacity-20" />
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Régimen Fiscal</Label>
            <Select value={regime} onValueChange={setRegime}>
              <SelectTrigger className="bg-background/50 border-border/40 font-bold text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RESICO_PF" className="text-xs font-medium">RESICO Persona Física</SelectItem>
                <SelectItem value="PFAE" className="text-xs font-medium">Actividad Empresarial (PFAE)</SelectItem>
                <SelectItem value="PM_GENERAL" className="text-xs font-medium">Persona Moral Régimen General</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Ingresos del Periodo (MXN)</Label>
            <Input 
              type="number" 
              value={income} 
              onChange={(e) => setIncome(Number(e.target.value))}
              className="bg-background/50 border-border/40 font-mono font-black"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ISR Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Landmark className="w-12 h-12" />
            </div>
            <p className="text-[10px] font-black uppercase text-purple-400 mb-1">ISR Causado</p>
            <h2 className="text-3xl font-black text-foreground mb-4">${isrAmount.toLocaleString()}</h2>
            <div className="flex items-center gap-2">
                <Badge className="bg-purple-500/20 text-purple-400 border-none text-[9px] uppercase font-black">
                  Tasa: {(isrRate * 100).toFixed(1)}%
                </Badge>
                <span className="text-[10px] text-muted-foreground italic font-medium">Basado en Anexo 8 RMF</span>
            </div>
          </div>

          {/* IVA Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <FileText className="w-12 h-12" />
            </div>
            <p className="text-[10px] font-black uppercase text-blue-400 mb-1">IVA por Pagar</p>
            <h2 className="text-3xl font-black text-foreground mb-4">${ivaAmount.toLocaleString()}</h2>
            <div className="flex items-center gap-2">
                <Badge className="bg-blue-500/20 text-blue-400 border-none text-[9px] uppercase font-black">
                  Tasa: 16%
                </Badge>
                <span className="text-[10px] text-muted-foreground italic font-medium">IVA Trasladado Neto</span>
            </div>
          </div>
        </div>

        <div className="bg-muted/30 p-4 rounded-xl border border-border/40 flex items-center justify-between group cursor-pointer hover:bg-muted/50 transition-all">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-background/80 border border-border/40">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-foreground">Generar Papeles de Trabajo</p>
              <p className="text-[10px] text-muted-foreground">Exportar desglose Excel / PDF para auditoría</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-2">
          <div>
            <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Carga Tributaria Total</p>
            <h3 className="text-2xl font-black text-red-500 tracking-tight">${totalTax.toLocaleString()}</h3>
          </div>
          <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase text-xs tracking-widest px-10 h-12">
            Proceder a Declaración
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
