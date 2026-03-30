import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, Area, ComposedChart } from "recharts"
import { TrendingUp } from "lucide-react"

interface ForecastData {
  date: string
  yhat: number      // Predicted
  lower: number     // Lower bound
  upper: number     // Upper bound
  real?: number     // Historical real data (if applicable)
}

interface TaxForecastChartProps {
  data: ForecastData[]
  isLoading?: boolean
}

export function TaxForecastChart({ data, isLoading = false }: TaxForecastChartProps) {
  
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
          <p className="text-[10px] uppercase font-bold text-muted-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.stroke }} />
              <span className="text-xs font-semibold text-foreground">
                {entry.name}: {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card className="glass-card border-border/40 overflow-hidden h-full">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/50 via-primary/50 to-blue-500/50" />
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-foreground">Forecast de Impuestos (Prophet)</CardTitle>
            <CardDescription className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
              Proyección IA de carga tributaria (IVA/ISR)
            </CardDescription>
          </div>
          <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-[280px]">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <span className="ml-4 text-xs font-bold text-primary uppercase animate-pulse">Running Neural Engine...</span>
          </div>
        ) : (
          <div className="h-[280px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.1)" />
                <XAxis 
                  dataKey="date" 
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
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                
                {/* Intervalo de Confianza */}
                <Area 
                  type="monotone" 
                  dataKey="upper" 
                  stroke="none" 
                  fill="url(#colorArea)" 
                  name="Intervalo"
                  activeDot={false}
                />
                <Area 
                  type="monotone" 
                  dataKey="lower" 
                  stroke="none" 
                  fill="#00000000" 
                  activeDot={false}
                  legendType="none"
                />

                {/* Línea Principal del Forecast */}
                <Line 
                  type="monotone" 
                  dataKey="yhat" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  name="Monto Proyectado"
                  dot={{ r: 4, strokeWidth: 2, fill: "hsl(var(--background))" }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: "#3b82f6" }}
                />

                {/* Histórico Real (si hay data) */}
                <Line 
                  type="monotone" 
                  dataKey="real" 
                  stroke="hsl(var(--foreground))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Cargos Reales"
                  dot={{ r: 3, fill: "hsl(var(--foreground))" }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
