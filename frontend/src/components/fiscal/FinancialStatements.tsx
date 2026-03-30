import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Printer, Share2, TrendingUp, Landmark } from "lucide-react"

export function FinancialStatements() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
               <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
               <h2 className="text-xl font-black uppercase italic tracking-tighter">Reportes Financieros NIF</h2>
               <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Consolidación de Balanza de Comprobación v2026.1</p>
            </div>
         </div>
         <div className="flex gap-2">
            <Button variant="outline" className="h-9 px-4 text-[10px] font-black uppercase tracking-widest border-border/40"><Printer className="w-4 h-4 mr-2" /> Imprimir</Button>
            <Button className="h-9 px-6 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20"><FileText className="w-4 h-4 mr-2" /> Exportar PDF</Button>
         </div>
      </div>

      <Tabs defaultValue="balance" className="w-full">
        <TabsList className="bg-muted/50 border border-border/20 p-1 rounded-xl mb-6">
          <TabsTrigger value="balance" className="text-[10px] uppercase font-black px-6 tracking-widest">Balance General</TabsTrigger>
          <TabsTrigger value="results" className="text-[10px] uppercase font-black px-6 tracking-widest">Estado de Resultados</TabsTrigger>
          <TabsTrigger value="cashflow" className="text-[10px] uppercase font-black px-6 tracking-widest">Flujo de Efectivo</TabsTrigger>
        </TabsList>

        <TabsContent value="balance">
          <Card className="glass-card border-border/40 overflow-hidden">
            <CardHeader className="bg-primary/5 pb-6 border-b border-border/20">
              <div className="flex items-center gap-3">
                 <Landmark className="w-6 h-6 text-primary opacity-40" />
                 <div>
                    <CardTitle className="text-sm font-black uppercase tracking-tight">Estado de Situación Financiera (NIF B-6)</CardTitle>
                    <CardDescription className="text-[10px] font-medium text-muted-foreground mt-0.5">Periodo: Marzo 2026 | Valores en MXN</CardDescription>
                 </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/20">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-[10px] font-black uppercase tracking-widest pl-8">Cuenta Contable</TableHead>
                    <TableHead className="text-right text-[10px] font-black uppercase tracking-widest pr-8">Saldo Final</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="bg-primary/5 hover:bg-primary/10"><TableCell colSpan={2} className="text-[9px] font-black uppercase text-primary border-none pl-8">Activo Circulante</TableCell></TableRow>
                  <TableRow><TableCell className="pl-12 text-xs font-medium">Bancos y Efectivo</TableCell><TableCell className="text-right pr-8 font-mono font-bold">$450,200.50</TableCell></TableRow>
                  <TableRow><TableCell className="pl-12 text-xs font-medium">Cuentas por Cobrar</TableCell><TableCell className="text-right pr-8 font-mono font-bold">$320,000.00</TableCell></TableRow>
                  <TableRow className="bg-primary/5 hover:bg-primary/10"><TableCell colSpan={2} className="text-[9px] font-black uppercase text-primary border-none pl-8">Pasivo Corto Plazo</TableCell></TableRow>
                  <TableRow><TableCell className="pl-12 text-xs font-medium">Proveedores Nacionales</TableCell><TableCell className="text-right pr-8 font-mono font-bold text-red-400">$(210,000.00)</TableCell></TableRow>
                  <TableRow><TableCell className="pl-12 text-xs font-medium">Impuestos por Pagar (SAT)</TableCell><TableCell className="text-right pr-8 font-mono font-bold text-red-400">$(85,450.00)</TableCell></TableRow>
                </TableBody>
              </Table>
              <div className="p-8 bg-muted/10 flex justify-between items-center border-t border-border/20">
                 <div className="flex gap-4">
                    <Badge variant="outline" className="text-[9px] font-black uppercase border-green-500/30 text-green-500">Balance Cuadrado</Badge>
                    <span className="text-[10px] text-muted-foreground font-medium italic">Activo = Pasivo + Capital</span>
                 </div>
                 <h3 className="text-xl font-black text-foreground">Utilidad del Ejercicio: <span className="text-green-500">$654,000.00</span></h3>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Others simplified for mock */}
        <TabsContent value="results">
           <div className="p-20 text-center opacity-20 border-2 border-dashed border-border/40 rounded-2xl">
              <TrendingUp className="w-12 h-12 mx-auto mb-4" />
              <p className="text-xs uppercase font-black">Estado de Resultados (NIF B-3) se cargará con la Balanza</p>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
