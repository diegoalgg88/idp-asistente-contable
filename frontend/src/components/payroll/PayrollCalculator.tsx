import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calculator, Wallet, Receipt, Percent } from "lucide-react"

export function PayrollCalculator() {
  const [sbc, setSbc] = useState<number>(350.50)
  const [days, setDays] = useState<number>(15)
  const [overtime, setOvertime] = useState<number>(0)
  
  // Mock calculation logic matching backend
  const sueldo = sbc * days
  const hxMonto = overtime * (sbc / 8 * 2) // Simplified double
  const totalPerceptions = sueldo + hxMonto
  const imssObrero = totalPerceptions * 0.02375 // Simplified rate
  const isrRetenido = totalPerceptions * 0.08 // Simplified
  const totalDeductions = imssObrero + isrRetenido
  const netPay = totalPerceptions - totalDeductions

  return (
    <Card className="glass-card border-border/40 overflow-hidden">
      <CardHeader className="bg-primary/5 border-b border-border/40">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-black uppercase italic tracking-tight">Calculadora LFT</CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Procesamiento de Nómina Ordinaria</CardDescription>
          </div>
          <Calculator className="w-8 h-8 text-primary opacity-20" />
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground">SBC Diario (MXN)</Label>
            <Input 
              type="number" 
              value={sbc} 
              onChange={(e) => setSbc(Number(e.target.value))}
              className="bg-background/50 border-border/40 font-mono font-bold"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Días Trabajados</Label>
            <Input 
              type="number" 
              value={days} 
              onChange={(e) => setDays(Number(e.target.value))}
              className="bg-background/50 border-border/40 font-mono font-bold"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Horas Extras</Label>
            <Input 
              type="number" 
              value={overtime} 
              onChange={(e) => setOvertime(Number(e.target.value))}
              className="bg-background/50 border-border/40 font-mono font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Percepciones */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-4 h-4 text-green-500" />
              <h3 className="text-sm font-black uppercase text-foreground">Percepciones</h3>
            </div>
            <div className="space-y-3 bg-green-500/5 p-4 rounded-xl border border-green-500/10">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Sueldo Ordinario</span>
                <span className="font-mono font-bold">${sueldo.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Horas Extras (Dobles)</span>
                <span className="font-mono font-bold">${hxMonto.toLocaleString()}</span>
              </div>
              <Separator className="bg-green-500/20" />
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase text-green-600">Total Percepciones</span>
                <span className="text-sm font-black text-green-600">${totalPerceptions.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Deducciones */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Receipt className="w-4 h-4 text-red-500" />
              <h3 className="text-sm font-black uppercase text-foreground">Deducciones</h3>
            </div>
            <div className="space-y-3 bg-red-500/5 p-4 rounded-xl border border-red-500/10">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">IMSS (Cuota Obrera)</span>
                <span className="font-mono font-bold text-red-400">-${imssObrero.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">ISR Retenido</span>
                <span className="font-mono font-bold text-red-400">-${isrRetenido.toLocaleString()}</span>
              </div>
              <Separator className="bg-red-500/20" />
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase text-red-600">Total Deducciones</span>
                <span className="text-sm font-black text-red-600">-${totalDeductions.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest mb-1">Pago Neto Estimado</p>
            <h2 className="text-4xl font-black text-primary tracking-tighter">${netPay.toLocaleString()}</h2>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="h-12 px-6 font-bold uppercase text-xs tracking-widest">Descargar PDF</Button>
            <Button className="h-12 px-8 font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/20">Autorizar Dispersión</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
