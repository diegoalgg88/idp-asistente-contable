import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Cell } from "recharts"
import { Target } from "lucide-react"

interface VarianceData {
  account: string
  real: number
  budget: number
  status: 'on_track' | 'over_budget' | 'under_budget'
}

interface BudgetVarianceChartProps {
  data: VarianceData[]
  isLoading?: boolean
}

export function BudgetVarianceChart({ data, isLoading = false }: BudgetVarianceChartProps) {

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
      const real = payload.find((p: any) => p.dataKey === 'real')
      const budget = payload.find((p: any) => p.dataKey === 'budget')
      
      const realVal = real?.value || 0
      const budgetVal = budget?.value || 0
      const diff = realVal - budgetVal
      const percent = budgetVal ? (diff / budgetVal) * 100 : 0
      
      let statusColor = 'text-green-500' // Under budget
      if (diff > 0) statusColor = 'text-red-500' // Over budget
      else if (diff === 0) statusColor = 'text-muted-foreground'

      return (
        <div className="bg-background/95 backdrop-blur-md border border-border/50 p-4 rounded-xl shadow-xl">
          <p className="text-[10px] uppercase font-bold text-foreground mb-3">{label}</p>
          
          <div className="flex items-center justify-between gap-6 mb-2">
            <span className="text-xs font-semibold text-muted-foreground">Ejecutado</span>
            <span className="text-xs font-black text-foreground">{formatCurrency(realVal)}</span>
          </div>
          <div className="flex items-center justify-between gap-6 mb-3 pb-2 border-b border-border/50">
            <span className="text-xs font-semibold text-muted-foreground">Presupuestado</span>
            <span className="text-xs font-black text-muted-foreground">{formatCurrency(budgetVal)}</span>
          </div>
          
          <div className="flex items-center justify-between gap-6">
            <span className="text-xs font-bold uppercase">Variación</span>
            <span className={`text-xs font-black ${statusColor}`}>
              {diff > 0 ? '+' : ''}{formatCurrency(diff)} ({diff > 0 ? '+' : ''}{percent.toFixed(1)}%)
            </span>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="glass-card border-border/40 overflow-hidden h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-foreground">Control Presupuestal</CardTitle>
            <CardDescription className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
              Gasto Real vs Asignado
            </CardDescription>
          </div>
          <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20">
            <Target className="w-4 h-4 text-purple-500" />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-[280px]">
            <div className="w-8 h-8 rounded-full border-t-2 border-purple-500 animate-spin" />
          </div>
        ) : (
          <div className="h-[280px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }} barGap={0}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--muted-foreground)/0.1)" />
                <XAxis 
                  type="number" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(val) => `$${val/1000}k`}
                />
                <YAxis 
                  dataKey="account" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'hsl(var(--foreground))', fontWeight: 600 }}
                  width={100}
                />
                <Tooltip cursor={{ fill: 'hsl(var(--muted)/0.3)' }} content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                
                <Bar 
                  dataKey="budget" 
                  name="Presupuesto" 
                  fill="hsl(var(--muted))" 
                  barSize={8}
                  radius={[0, 4, 4, 0]}
                />
                <Bar 
                  dataKey="real" 
                  name="Ejecutado Gasto Real" 
                  barSize={8}
                  radius={[0, 4, 4, 0]}
                >
                  {data.map((entry, index) => {
                    let color = "#3b82f6" // Default (on_track)
                    if (entry.status === 'over_budget') color = "#ef4444" // Over budget
                    else if (entry.status === 'under_budget') color = "#10b981" // Under budget
                    return <Cell key={`cell-${index}`} fill={color} />
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
