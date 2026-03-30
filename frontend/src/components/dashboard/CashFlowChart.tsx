import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ComposedChart, Line } from "recharts"
import { Activity } from "lucide-react"

interface CashFlowData {
  month: string
  inflows: number     // Entradas ponderadas
  outflows: number    // Salidas (Cuentas por pagar)
  balance: number     // Saldo proyectado a fin de mes
}

interface CashFlowChartProps {
  data: CashFlowData[]
  isLoading?: boolean
}

export function CashFlowChart({ data, isLoading = false }: CashFlowChartProps) {
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-md border border-border/50 p-4 rounded-xl shadow-xl">
          <p className="text-[10px] uppercase font-bold text-muted-foreground mb-3">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-6 mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill || entry.stroke }} />
                <span className="text-xs font-semibold text-muted-foreground">
                  {entry.name}
                </span>
              </div>
              <span className="text-xs font-black text-foreground">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card className="glass-card border-border/40 overflow-hidden h-full group">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-foreground">Flujo de Efectivo (90 Días)</CardTitle>
            <CardDescription className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
              Probabilidad de Cobro Ponderada
            </CardDescription>
          </div>
          <div className="p-2 bg-green-500/10 rounded-xl border border-green-500/20 group-hover:bg-green-500/20 transition-colors">
            <Activity className="w-4 h-4 text-green-500" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-[280px]">
            <div className="w-8 h-8 rounded-full border-t-2 border-green-500 animate-spin" />
          </div>
        ) : (
          <div className="h-[280px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.1)" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(val) => `$${(val/1000)}k`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted)/0.3)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                
                {/* Entradas (Cobranza Proyectada Ajustada) */}
                <Bar 
                  dataKey="inflows" 
                  name="Entradas Ponderadas" 
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]} 
                  barSize={20}
                />
                
                {/* Salidas (Pagos Proyectados) */}
                <Bar 
                  dataKey="outflows" 
                  name="Salidas Programadas" 
                  fill="#ef4444" 
                  radius={[4, 4, 0, 0]} 
                  barSize={20} 
                  fillOpacity={0.8}
                />

                {/* Línea de Saldo Proyectado */}
                <Line 
                  type="monotone" 
                  dataKey="balance" 
                  name="Saldo Predictivo" 
                  stroke="#eab308" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#eab308', strokeWidth: 2, stroke: 'hsl(var(--background))' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
