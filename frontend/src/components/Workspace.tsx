import { useState, useEffect, useCallback } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import { useModulesStore } from '@/store/modules.store'
import { workspaceService } from '@/services/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    LayoutDashboard,
    Calendar,
    Zap,
    ChevronRight,
    ArrowUpRight,
    TrendingUp,
    ShieldCheck,
    FileText,
    BarChart3,
    Clock,
    CheckCircle2,
    AlertCircle,
    DollarSign,
    Activity,
    BrainCircuit,
    Trash2
} from "lucide-react"

export default function Workspace() {
    const { activeView } = useOutletContext<{ activeView: string }>()
    const { workspace, fetchWorkspace, loading } = useModulesStore()
    const navigate = useNavigate()
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [workflowConnections, setWorkflowConnections] = useState<Map<number, WebSocket>>(new Map())

    useEffect(() => {
        fetchWorkspace()
    }, [fetchWorkspace])

    // Cleanup WebSocket connections on unmount
    useEffect(() => {
        return () => {
            workflowConnections.forEach((ws) => {
                ws.close()
            })
        }
    }, [workflowConnections])

    const connectToWorkflow = useCallback((workflowId: number) => {
        if (workflowConnections.has(workflowId)) return

        const wsUrl = `ws://localhost:8000/ws/workflows/${workflowId}`
        const ws = new WebSocket(wsUrl)
        let reconnectAttempts = 0
        const maxReconnectAttempts = 5
        const reconnectDelay = 2000 // 2 seconds

        const connect = () => {
            ws.onopen = () => {
                console.log(`Connected to workflow ${workflowId}`)
                reconnectAttempts = 0 // Reset on successful connection
                ws.send(JSON.stringify({ type: 'subscribe' }))
            }

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data)
                console.log(`Workflow ${workflowId} update:`, data)
                
                // Refresh workspace data when workflow completes
                if (data.type === 'progress_update' || data.type === 'init') {
                    fetchWorkspace()
                }
                
                // Handle completion
                if (data.type === 'progress_update' && data.status === 'completed') {
                    // Could trigger toast notification here
                    console.log('Workflow completed!', data)
                }
            }

            ws.onerror = (error) => {
                console.error(`WebSocket error for workflow ${workflowId}:`, error)
            }

            ws.onclose = () => {
                console.log(`Disconnected from workflow ${workflowId}`)
                
                // Auto-reconnect with exponential backoff
                if (reconnectAttempts < maxReconnectAttempts) {
                    reconnectAttempts++
                    const delay = reconnectDelay * Math.pow(2, reconnectAttempts - 1)
                    console.log(`Attempting reconnect ${reconnectAttempts}/${maxReconnectAttempts} in ${delay}ms`)
                    
                    setTimeout(() => {
                        if (!workflowConnections.has(workflowId)) {
                            connect()
                        }
                    }, delay)
                } else {
                    console.log(`Max reconnect attempts reached for workflow ${workflowId}`)
                }
                
                setWorkflowConnections((prev) => {
                    const next = new Map(prev)
                    next.delete(workflowId)
                    return next
                })
            }
        }

        connect()
        setWorkflowConnections((prev) => new Map(prev).set(workflowId, ws))
    }, [workflowConnections, fetchWorkspace])

    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true)
        try {
            await fetchWorkspace()
        } finally {
            setTimeout(() => setIsRefreshing(false), 500)
        }
    }, [fetchWorkspace])

    const handleConfigure = useCallback(() => {
        navigate('/settings')
    }, [navigate])

    // Loading skeleton optimizado para LCP
    if (loading.workspace && !workspace) {
        return (
            <div className="h-full flex items-center justify-center bg-background">
                <div className="text-center space-y-4">
                    <h1 
                        id="lcp-dashboard-title"
                        className="text-4xl font-black text-foreground italic tracking-tight uppercase animate-pulse"
                        {...({ fetchpriority: 'high' } as any)}
                    >
                        Cargando Dashboard...
                    </h1>
                    <div className="text-muted-foreground animate-pulse text-sm uppercase tracking-widest font-bold">Conectando con IDP Engine</div>
                </div>
            </div>
        )
    }

    const dashboard = workspace?.dashboard
    const calendar = workspace?.calendar || []
    const metrics = workspace?.metrics
    const forecast = workspace?.forecast
    const kpiTrends = workspace?.kpiTrends || []

    const renderContent = () => {
        switch (activeView) {
            case 'predicciones':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                <BrainCircuit className="h-5 w-5 text-purple-500" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">Predicciones y Proyecciones</h3>
                        </div>
                        
                        {/* Cash Flow Projection */}
                        <Card className="glass-card border-border/40">
                            <CardHeader>
                                <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                    Proyección de Flujo de Efectivo (6 meses)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {forecast?.cashflow_projections?.slice(0, 3).map((proj: any, idx: number) => (
                                        <div key={proj.month} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${proj.is_projected ? 'bg-purple-500' : 'bg-green-500'}`} />
                                                <span className="text-sm font-bold text-foreground">{proj.month}</span>
                                            </div>
                                            <div className="flex gap-4 text-sm">
                                                <span className="text-green-500 font-bold">+${proj.income.toLocaleString()}</span>
                                                <span className="text-red-500 font-bold">-${proj.expenses.toLocaleString()}</span>
                                                <span className="text-blue-500 font-bold">${proj.net_cashflow.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tax Forecast Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {forecast?.tax_forecasts?.slice(0, 3).map((tax: any) => (
                                <Card key={tax.month} className="glass-card border-border/40 hover:border-yellow-500/50 transition-all">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{tax.month}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-[9px] text-muted-foreground uppercase">ISR</span>
                                                <span className="text-sm font-bold text-yellow-500">${tax.isr_estimated.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-[9px] text-muted-foreground uppercase">IVA</span>
                                                <span className="text-sm font-bold text-blue-500">${tax.iva_estimated.toLocaleString()}</span>
                                            </div>
                                            <div className="text-[8px] text-muted-foreground text-center">
                                                {tax.confidence === 'high' ? '✓ Alta confianza' : '⚠ Confianza media'}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* KPI Trends */}
                        <Card className="glass-card border-border/40">
                            <CardHeader>
                                <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-blue-500" />
                                    Tendencia de Procesamiento
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-end gap-2 h-32">
                                    {kpiTrends.slice(-6).map((trend: any) => (
                                        <div key={trend.month} className="flex-1 flex flex-col items-center gap-1">
                                            <div 
                                                className={`w-full rounded-t ${trend.is_projected ? 'bg-purple-500/50' : 'bg-blue-500'}`} 
                                                style={{ height: `${Math.min(trend.documents_processed * 2, 100)}%` }}
                                            />
                                            <span className="text-[8px] text-muted-foreground uppercase">{trend.month.slice(-2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 flex justify-center gap-4 text-[9px]">
                                    <span className="flex items-center gap-1 text-muted-foreground">
                                        <div className="w-2 h-2 rounded-full bg-blue-500" /> Real
                                    </span>
                                    <span className="flex items-center gap-1 text-muted-foreground">
                                        <div className="w-2 h-2 rounded-full bg-purple-500/50" /> Proyectado
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Status & Recommendation */}
                        {forecast?.status && (
                            <Card className={`glass-card border-border/40 ${
                                forecast.status === 'healthy' ? 'border-green-500/30 bg-green-500/5' :
                                forecast.status === 'warning' ? 'border-yellow-500/30 bg-yellow-500/5' :
                                'border-red-500/30 bg-red-500/5'
                            }`}>
                                <CardContent className="py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${
                                            forecast.status === 'healthy' ? 'bg-green-500' :
                                            forecast.status === 'warning' ? 'bg-yellow-500' :
                                            'bg-red-500'
                                        }`} />
                                        <p className="text-sm font-bold text-foreground">
                                            {forecast.status === 'healthy' ? 'Salud Fiscal: Óptima' :
                                             forecast.status === 'warning' ? 'Salud Fiscal: Precaución' :
                                             'Salud Fiscal: Crítica'}
                                        </p>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">{forecast.recommendation}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )
            case 'impuestos':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                                <TrendingUp className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">Impuestos Mensuales</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {['IVA', 'ISR Retenciones', 'ISR Propio', 'IEPS'].map((tax) => (
                                <Card key={tax} className="glass-card border-border/40 hover:border-primary/50 transition-all duration-300 group overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:scale-110 transition-transform">
                                        <Zap className="h-20 w-20" />
                                    </div>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                        <CardTitle className="text-xs font-bold uppercase tracking-widest">{tax}</CardTitle>
                                        <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary text-[9px]">Marzo 2026</Badge>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-3xl font-black text-foreground italic tracking-tighter">$0.00</p>
                                                <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mt-1">Pendiente de calcular</p>
                                            </div>
                                            <Button size="sm" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 h-8 px-4 text-[9px] font-bold uppercase rounded-full">Calcular</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )
            case 'reportes-cfdi':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                <FileText className="h-5 w-5 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">Reportes CFDI</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="glass-card border-border/40 hover:border-primary/50 transition-all duration-300 group">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Emitidos (Ingreso)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-4xl font-black text-foreground italic group-hover:translate-x-1 transition-transform">124</p>
                                    <p className="text-[10px] text-green-500 font-bold uppercase mt-2 flex items-center gap-1.5">
                                        <ShieldCheck className="w-3 h-3" /> Sincronizado SAT
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="glass-card border-border/40 hover:border-yellow-500/50 transition-all duration-300 group">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Recibidos (Gasto)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-4xl font-black text-foreground italic group-hover:translate-x-1 transition-transform">85</p>
                                    <p className="text-[10px] text-yellow-500 font-bold uppercase mt-2 flex items-center gap-1.5">
                                        <AlertCircle className="w-3 h-3" /> 2 pendientes
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="glass-card border-border/40 hover:border-blue-400/50 transition-all duration-300 group">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Nómina</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-4xl font-black text-foreground italic group-hover:translate-x-1 transition-transform">12</p>
                                    <p className="text-[10px] text-blue-400 font-bold uppercase mt-2 flex items-center gap-1.5">
                                        <CheckCircle2 className="w-3 h-3" /> Timbrado Correcto
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )
            case 'calendario':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-foreground font-italic">Calendario Fiscal Completo</h3>
                            <div className="flex gap-2">
                                <Button variant="outline" className="border-border text-muted-foreground text-xs h-8">
                                    Descargar ICS
                                </Button>
                                <Button variant="default" className="text-xs h-8">
                                    + Nuevo Evento
                                </Button>
                            </div>
                        </div>
                        <Card className="bg-card border-border overflow-hidden">
                            <div className="divide-y divide-border">
                                {calendar.map((event: any) => (
                                    <div key={event.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors group">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className={`w-2 h-2 rounded-full ${event.priority === 'alta' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                                            <div>
                                                <p className="text-sm font-bold text-foreground">{event.title}</p>
                                                <p className="text-xs text-muted-foreground">{event.date} • {event.type}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge variant="outline" className="text-[10px] uppercase border-border text-muted-foreground">
                                                {event.status}
                                            </Badge>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-blue-500 hover:bg-blue-500/10"
                                                    onClick={() => {
                                                        const newStatus = event.status === 'pendiente' ? 'completado' : 'pendiente'
                                                        useModulesStore.getState().updateCalendarEvent(parseInt(event.id), { status: newStatus })
                                                    }}
                                                >
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-red-500 hover:bg-red-500/10"
                                                    onClick={() => {
                                                        if (confirm(`¿Eliminar evento "${event.title}"?`)) {
                                                            useModulesStore.getState().deleteCalendarEvent(parseInt(event.id))
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                )
            case 'metricas-ia':
                return (
                    <div className="space-y-8">
                        <h3 className="text-xl font-bold text-foreground font-italic">Análisis de Desempeño IA</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card className="bg-card border-border">
                                <CardHeader>
                                    <CardTitle className="text-sm font-bold text-foreground">Precisión de Extracción</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-end gap-2">
                                        <span className="text-4xl font-black text-foreground italic">{metrics?.extraction_accuracy || '98.1'}%</span>
                                        <span className="text-xs text-green-500 font-bold mb-1">+0.4% p/mes</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>Mapeo Conceptuall</span>
                                            <span>99.2%</span>
                                        </div>
                                        <Progress value={99.2} className="h-1 bg-muted" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>Detección de RFC</span>
                                            <span>100%</span>
                                        </div>
                                        <Progress value={100} className="h-1 bg-muted" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-card border-border">
                                <CardHeader>
                                    <CardTitle className="text-sm font-bold text-foreground">Latencia de Procesamiento</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-end gap-2">
                                        <span className="text-4xl font-black text-foreground italic">{metrics?.average_latency_ms || 3200}ms</span>
                                        <Clock className="h-5 w-5 text-blue-400 mb-2" />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Promedio basado en los últimos 500 documentos procesados por el modelo {metrics?.model || 'meta/llama-3.3-70b'}.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )
            default: // general
                return (
                    <>
                        {/* Main Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-bottom-4 duration-700">
                            <Card className="glass-card border-border/40 premium-shadow relative overflow-hidden group hover:border-primary/40 transition-all duration-500">
                                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-700">
                                    <TrendingUp className="h-16 w-16 text-green-500" />
                                </div>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Saldo Conciliado</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-black text-foreground italic tracking-tighter group-hover:translate-x-1 transition-transform">
                                        ${dashboard?.monthly_revenue?.toLocaleString() || '145,200'}
                                    </p>
                                    <div className="flex items-center gap-1.5 mt-2">
                                        <TrendingUp className="w-3 h-3 text-green-500" />
                                        <span className="text-[9px] text-green-500 font-black uppercase tracking-tighter">+12.4% vs Mes Ant</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="glass-card border-border/40 premium-shadow relative overflow-hidden group hover:border-primary/40 transition-all duration-500 text-glow">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Documentos</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-black text-foreground italic tracking-tighter group-hover:translate-x-1 transition-transform">{dashboard?.processed_documents || '0'}</p>
                                    <p className="text-[9px] text-muted-foreground uppercase tracking-tighter font-bold mt-2 opacity-70">
                                        {dashboard?.pending_documents || '0'} Pendientes
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="glass-card border-border/40 premium-shadow relative overflow-hidden group hover:border-primary/40 transition-all duration-500">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Precisión Extracción</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-black text-blue-500 italic tracking-tighter group-hover:translate-x-1 transition-transform">{metrics?.extraction_accuracy || '98.1'}%</p>
                                    <div className="h-1 w-full bg-muted mt-4 rounded-full overflow-hidden">
                                        <div className="bg-blue-500 h-full" style={{ width: `${metrics?.extraction_accuracy || 98}%` }} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="glass-card border-border/40 premium-shadow relative overflow-hidden group hover:border-primary/40 transition-all duration-500 bg-gradient-to-br from-primary/5 to-transparent">
                                <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:rotate-12 transition-transform duration-700">
                                    <Zap className="h-12 w-12 text-yellow-500" />
                                </div>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">IDP Score</CardTitle>
                                </CardHeader>
                                <CardContent className="flex items-center justify-between">
                                    <div>
                                        <p className="text-3xl font-black text-green-500 italic tracking-tighter">{dashboard?.fiscal_score || '10.0'}/10</p>
                                        <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest opacity-70 mt-1 block">Full Compliance</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Calendar Section */}
                            <div className="lg:col-span-2 space-y-6">
                                <Card className="bg-card border-border rounded-sm overflow-hidden border-l-2 border-l-primary">
                                    <CardHeader className="bg-muted/50 border-b border-border py-3 px-6 flex flex-row items-center justify-between">
                                        <CardTitle className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                            <Calendar className="h-4 w-4" /> Calendario Fiscal & Tareas
                                        </CardTitle>
                                        <Badge variant="outline" className="border-blue-900/50 text-blue-400 text-[10px]">Marzo 2026</Badge>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="divide-y divide-border">
                                            {calendar.slice(0, 5).map((event: any) => (
                                                <div key={event.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors cursor-pointer group">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`h-1.5 w-1.5 rounded-full ${event.priority === 'alta' ? 'bg-red-500' : 'bg-primary'} shadow-[0_0_8px_rgba(255,0,0,0.5)]`} />
                                                        <div>
                                                            <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{event.title}</p>
                                                            <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">{event.type.replace('_', ' ')} | {event.date}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <Badge variant="outline" className={`text-[8px] uppercase font-bold ${event.status === 'pendiente' ? 'border-yellow-500/50 text-yellow-500' : 'border-blue-500/50 text-blue-400'}`}>
                                                            {event.status.replace('_', ' ')}
                                                        </Badge>
                                                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Automation Panel */}
                            <div className="space-y-6">
                                <Card className="bg-card border-border rounded-sm shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-600" />
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Workflows en Progreso</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {workspace?.dashboard?.workflows?.slice(0, 3).map((wf: any, idx: number) => (
                                            <div 
                                                key={wf.id} 
                                                className="p-4 bg-background border border-border hover:border-primary/50 transition-all cursor-pointer group"
                                                onClick={() => {
                                                    const id = parseInt(wf.id)
                                                    connectToWorkflow(id)
                                                    workspaceService.executeWorkflow(id)
                                                }}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="text-xs font-bold text-foreground uppercase italic tracking-tighter">{wf.name}</h4>
                                                    <ArrowUpRight className="h-3 w-3 text-muted-foreground group-hover:text-foreground" />
                                                </div>
                                                <p className="text-[10px] text-muted-foreground leading-tight">{wf.description}</p>
                                                <div className="mt-3 flex items-center gap-2">
                                                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full transition-all duration-500 ${
                                                                wf.status === 'completed' ? 'bg-green-500' :
                                                                wf.status === 'running' ? 'bg-blue-500 animate-pulse' :
                                                                'bg-yellow-500'
                                                            }`}
                                                            style={{ width: `${wf.progress}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-[8px] font-bold text-muted-foreground w-8 text-right">{wf.progress}%</span>
                                                </div>
                                                <div className="mt-2 flex gap-1">
                                                    <Badge className={`${
                                                        wf.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                                                        wf.status === 'running' ? 'bg-blue-500/10 text-blue-400' :
                                                        'bg-yellow-500/10 text-yellow-400'
                                                    } text-[7px] font-bold uppercase`}>
                                                        {wf.status === 'running' ? '⏳ Ejecutando' : wf.status}
                                                    </Badge>
                                                    <Badge className="bg-purple-500/10 text-purple-400 text-[7px] font-bold uppercase">
                                                        {wf.steps_completed}/{wf.steps_total} pasos
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                        {(!workspace?.dashboard?.workflows || workspace.dashboard.workflows.length === 0) && (
                                            <div className="text-center py-8">
                                                <p className="text-[9px] text-muted-foreground">No hay workflows activos</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Quick Launch Card */}
                                <Card 
                                    className="bg-primary border-primary text-primary-foreground rounded-sm shadow-xl hover:bg-primary/90 transition-all cursor-pointer"
                                    onClick={() => {
                                        // Create new audit workflow
                                        console.log('Starting AI Audit...')
                                    }}
                                >
                                    <CardContent className="p-6 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest opacity-80">Iniciar Auditoría IA</p>
                                            <p className="text-[10px] font-bold opacity-60">ESCANEANDO NUEVOS CFDI...</p>
                                        </div>
                                        <LayoutDashboard className="h-8 w-8 opacity-20" />
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </>
                )
        }
    }

    return (
        <div className="p-8 space-y-10 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
            {/* Header Section - LCP Critical */}
            <div className="flex justify-between items-end pb-8 border-b border-border/50 relative">
                <div className="absolute -bottom-px left-0 w-32 h-px bg-primary" />
                <div className="space-y-3">
                    <h1
                        id="lcp-dashboard-main-title"
                        className="text-4xl font-black text-foreground italic tracking-tight uppercase"
                        {...({ fetchpriority: 'high' } as any)}
                    >
                        Workbench <span className="text-primary tracking-normal not-italic lowercase font-serif font-light opacity-60 px-2">&</span> Panel
                    </h1>
                    <p className="text-[9px] font-black text-muted-foreground tracking-[0.3em] uppercase flex items-center gap-2">
                        <ShieldCheck className="h-3 w-3 text-primary" />
                        <span>IDP ENGINE ACTIVE</span>
                        <span className="h-3 w-px bg-border/50 mx-1" />
                        <span>MODEL: {metrics?.model?.split('/').pop() || 'llama-3.3-70b'}</span>
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button 
                        variant="outline" 
                        className="glass-card border-border/50 text-[9px] font-black uppercase tracking-wider h-9 px-6 hover:bg-muted/50 transition-all rounded-full"
                        onClick={handleConfigure}
                    >
                        Configurar
                    </Button>
                    <Button 
                        className="bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 text-[9px] font-black uppercase tracking-widest h-9 px-8 rounded-full transition-all"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                    >
                        {isRefreshing ? (
                            <>
                                <Activity className="h-3 w-3 mr-1 animate-spin" />
                                Actualizando...
                            </>
                        ) : (
                            'Refrescar'
                        )}
                    </Button>
                </div>
            </div>

            {renderContent()}
        </div>
    )
}
