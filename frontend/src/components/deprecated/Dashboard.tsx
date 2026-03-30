// @ts-nocheck
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  CheckCircle2,
  Clock,
  TrendingUp,
  Activity,
  ArrowUpRight
} from "lucide-react"
import { Button } from '@/components/ui/button'
import { useIDP } from '@/hooks/useIDP'
import { useModulesStore } from '@/store/modules.store'

// Importación de Componentes Predictivos (Fase 10)
import { TaxHealthScore } from './dashboard/TaxHealthScore'
import { TaxForecastChart } from './dashboard/TaxForecastChart'
import { CashFlowChart } from './dashboard/CashFlowChart'
import { BudgetVarianceChart } from './dashboard/BudgetVarianceChart'
import { RiskAlerts } from './dashboard/RiskAlerts'

export default function Dashboard() {
  const { stats, fetchStats } = useIDP()
  const { workspace, fetchWorkspace } = useModulesStore()
  const [isLoadingPredictive, setIsLoadingPredictive] = useState(true)

  useEffect(() => {
    fetchStats()
    fetchWorkspace()
    
    // Simulating loading state for predictive APIs
    const timer = setTimeout(() => {
      setIsLoadingPredictive(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [fetchStats, fetchWorkspace])

  const metrics = workspace?.metrics

  // Mocked Predictive Data until backend endpoints are hit via SWR/React Query
  const mockTaxForecastData = [
    { date: '2026-04', yhat: 125000, lower: 110000, upper: 140000, real: 121000 },
    { date: '2026-05', yhat: 132000, lower: 115000, upper: 152000, real: 130000 },
    { date: '2026-06', yhat: 118000, lower: 105000, upper: 135000 },
    { date: '2026-07', yhat: 145000, lower: 130000, upper: 165000 },
    { date: '2026-08', yhat: 138000, lower: 122000, upper: 158000 }
  ]

  const mockCashFlowData = [
    { month: 'Mar(Act)', inflows: 580000, outflows: 420000, balance: 160000 },
    { month: 'Apr', inflows: 620000, outflows: 450000, balance: 330000 },
    { month: 'May', inflows: 540000, outflows: 410000, balance: 460000 },
    { month: 'Jun', inflows: 480000, outflows: 490000, balance: 450000 }
  ]

  const mockVarianceData = [
    { account: 'Nómina', real: 320000, budget: 350000, status: 'under_budget' as const },
    { account: 'Sistemas', real: 85000, budget: 80000, status: 'over_budget' as const },
    { account: 'Oficina', real: 42000, budget: 45000, status: 'under_budget' as const },
    { account: 'Marketing', real: 150000, budget: 110000, status: 'over_budget' as const }
  ]

  const mockAlerts: any[] = [
    {
      id: "risk-1",
      risk_type: "EFO_DETECTED",
      severity: "CRITICAL",
      message: "PROVEEDORES Y SERVICIOS APEX SA DE CV detectado en operaciones (RFC: APE190403K9A). Su estatus es 'Definitivo' en el padrón 69-B del SAT.",
      date: "2026-03-09T10:00:00Z",
      amount_at_risk: 1250000.00
    },
    {
      id: "risk-2",
      risk_type: "ROUND_AMOUNT_INTANGIBLE_SERVICE",
      severity: "WARNING",
      message: "Operación por exactamente $600,000.00 en concepto 'Honorarios de Asesoría Integral'. Poca materialidad registrada.",
      date: "2026-03-10T14:30:00Z",
      amount_at_risk: 600000.00
    }
  ]

  const kpis = [
    {
      title: "Docs Procesados",
      value: stats?.total || "5,412",
      desc: "Histórico general",
      icon: FileText,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "Extracción Exitosa",
      value: "98.5%",
      desc: "Confianza OCR / LLaMA",
      icon: CheckCircle2,
      color: "text-green-500",
      bg: "bg-green-500/10"
    },
    {
      title: "Sincronizado al ERP",
      value: "+12.4k",
      desc: "Últimos 30 días",
      icon: TrendingUp,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    {
      title: "Latencia Modelos",
      value: `${((stats?.total || 0) / 100).toFixed(1)}s`,
      desc: "Tiempo de Respuesta IA",
      icon: Clock,
      color: "text-orange-500",
      bg: "bg-orange-500/10"
    }
  ]

  return (
    <div className="p-8 space-y-8 h-full overflow-y-auto bg-background/50 text-foreground animate-in fade-in slide-in-from-bottom-4 duration-700 relative custom-scrollbar">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-border/50 relative">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-foreground tracking-tight uppercase italic bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent" data-testid="dashboard-title">
            Predictive Dashboard
          </h1>
          <p className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase flex items-center gap-2">
            <Activity className="w-3 h-3" /> IDP Neural Hub | Fase 10 Live Operations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-primary/10 text-primary border-primary/20 font-bold uppercase tracking-wider text-[9px] px-3 py-1.5 mr-4">
            AI Engine: {metrics?.model?.split('/').pop() || 'LLaMA-3.3-70B'}
          </Badge>
          <Button variant="outline" className="glass-card border-border/50 text-foreground text-xs h-9 px-4 hover:bg-accent/50 transition-all font-bold tracking-wide">
            Recalcular Forecast
          </Button>
          <Button className="bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 h-9 px-6 font-bold uppercase tracking-wider text-xs transition-all">
            Reporte Financiero
          </Button>
        </div>
      </div>

      {/* Tarjetas KPI Superiores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((card, i) => (
          <Card key={i} className="glass-card border-border/40 hover:border-primary/50 hover:bg-card/80 transition-all duration-500 group overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-24 h-24 ${card.bg} rounded-full blur-[40px] opacity-30 translate-x-12 translate-y-[-12px] group-hover:scale-110 transition-transform`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative">
              <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.1em]">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-xl border border-${card.color.split('-')[1]}-500/20 ${card.bg} backdrop-blur-sm group-hover:scale-110 transition-transform`}>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-black text-foreground tracking-tight group-hover:translate-x-1 transition-transform">
                {card.value}
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[10px] text-muted-foreground font-medium">{card.desc}</span>
                <div className="h-px flex-1 bg-border/20" />
                <ArrowUpRight className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Grid Predictivo Central */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Columna Izquierda Larga (Gráficas) */}
        <div className="lg:col-span-8 space-y-8">
          <TaxForecastChart data={mockTaxForecastData} isLoading={isLoadingPredictive} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CashFlowChart data={mockCashFlowData} isLoading={isLoadingPredictive} />
            <BudgetVarianceChart data={mockVarianceData} isLoading={isLoadingPredictive} />
          </div>
        </div>

        {/* Columna Derecha (Scores y Alertas) */}
        <div className="lg:col-span-4 space-y-8">
          <div className="h-[280px]">
            <TaxHealthScore 
              score={72.4} 
              status="warning" 
              details={[
                "Desviación presupuestal del 36% en área de Marketing.",
                "Se detectó 1 proveedor de riesgo en lista 69-B."
              ]} 
              isLoading={isLoadingPredictive} 
            />
          </div>
          <div className="h-[400px]">
            <RiskAlerts alerts={mockAlerts} isLoading={isLoadingPredictive} />
          </div>
        </div>

      </div>
    </div>
  )
}
