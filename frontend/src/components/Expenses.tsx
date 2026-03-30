import { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
    ScanSearch,
    Tags,
    FileBarChart,
    Layers,
    CheckCircle,
    ChevronRight,
    TrendingDown,
    ShieldAlert,
    PieChart
} from "lucide-react"
import { useModulesStore } from '@/store/modules.store'

export default function Expenses() {
    const { activeView } = useOutletContext<{ activeView: string }>()
    const { expenses, fetchExpenses, classifyExpenses, loading } = useModulesStore()

    useEffect(() => {
        fetchExpenses()
    }, [fetchExpenses])

    if (loading.expenses && !expenses) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-sm text-muted-foreground animate-pulse">Cargando gastos...</div>
            </div>
        )
    }

    const categories = expenses?.categories || []
    const pending = expenses?.pending || []
    const budget = expenses?.budget

    const renderContent = () => {
        switch (activeView) {
            case 'deducibles':
            case 'no-deducibles':
                return (
                    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700">
                        <div className="flex justify-between items-end">
                            <h3 className="text-xl font-black uppercase italic tracking-tighter opacity-80">
                                {activeView === 'deducibles' ? 'Portafolio de Gastos Deducibles (LISR)' : 'Expediente de Gastos No Deducibles'}
                            </h3>
                            <Badge className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border-none ${activeView === 'deducibles' ? 'bg-green-500/10 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'bg-red-500/10 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]'}`}>
                                {activeView === 'deducibles' ? 'Validado Core' : 'Revisión Requerida'}
                            </Badge>
                        </div>
                        <Card className="glass-card border-border/40 premium-shadow rounded-3xl overflow-hidden group">
                            <CardHeader className="border-b border-border/30 bg-muted/30 py-5 px-8">
                                <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40 italic">Expediente de Comprobantes CFDI V4.0</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-border/20">
                                    {pending.slice(0, 5).map((item: any) => (
                                        <div key={item.id} className="p-6 flex justify-between items-center bg-background/20 group/row hover:bg-primary/5 transition-all duration-300">
                                            <div className="flex items-center gap-5">
                                                <div className={`p-3 rounded-2xl transition-all group-hover/row:scale-110 ${activeView === 'deducibles' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                    {activeView === 'deducibles' ? <CheckCircle className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-foreground uppercase tracking-tight group-hover/row:text-primary transition-colors">{item.vendor} <span className="text-muted-foreground/30 font-light mx-2">•</span> {item.concept}</p>
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40 mt-0.5">{item.date}</p>
                                                </div>
                                            </div>
                                            <span className="text-lg font-black text-foreground italic tracking-tighter shadow-sm group-hover/row:translate-x-[-4px] transition-transform">{item.total}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )
            case 'presupuesto':
                return (
                    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700">
                        <h3 className="text-xl font-black text-foreground uppercase tracking-tighter italic opacity-80">Arquitectura de Presupuesto Mensual</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <Card className="glass-card border-border/40 premium-shadow rounded-3xl overflow-hidden flex flex-col items-center justify-center p-12 h-80 border-dashed border-2 group hover:border-primary/50 transition-all duration-700 cursor-crosshair">
                                <div className="flex flex-col items-center gap-6 text-muted-foreground/20 group-hover:text-primary/40 transition-colors">
                                    <div className="p-8 rounded-full bg-muted/20 group-hover:scale-110 transition-transform duration-700">
                                        <PieChart className="h-20 w-20 opacity-20 group-hover:opacity-100" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em]">Map de Distribución • IA Engine</p>
                                </div>
                            </Card>
                            <Card className="glass-card border-border/40 premium-shadow rounded-3xl p-10 flex flex-col justify-center">
                                <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40 border-b border-border/30 pb-4 italic">Optimización por Segmento</h4>
                                <div className="space-y-8 mt-6">
                                    {categories.map((cat: any, i: number) => (
                                        <div key={i} className="space-y-3 group/prog">
                                            <div className="flex justify-between items-end">
                                                <span className="text-[11px] font-black text-foreground/80 uppercase tracking-tight group-hover/prog:text-primary transition-colors">{cat.name}</span>
                                                <span className="text-xs font-black text-foreground italic tracking-tighter opacity-60">{cat.amount}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden border border-white/5 relative">
                                                <div className="h-full bg-primary/20 absolute inset-0 w-full" />
                                                <div className="h-full bg-primary transition-all duration-[1500ms] shadow-[0_0_10px_rgba(var(--primary),0.3)] relative z-10" style={{ width: `${cat.progress}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                )
            default: // clasificacion
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {categories.map((cat: any, i: number) => {
                                const borderColors = ['border-blue-500/30', 'border-green-500/30', 'border-red-500/30', 'border-yellow-500/30']
                                const textColors = ['text-blue-500', 'text-green-500', 'text-red-500', 'text-yellow-500']
                                return (
                                    <Card key={i} className={`glass-card ${borderColors[i % 4]} premium-shadow rounded-3xl overflow-hidden group hover:scale-[1.05] transition-all duration-500`}>
                                        <CardContent className="p-8 relative">
                                            <div className="flex justify-between items-start mb-6">
                                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40 italic">{cat.name}</p>
                                                <div className={`p-2 rounded-xl bg-muted/20 ${textColors[i % 4]} transition-all group-hover:scale-110`}>
                                                    <Tags className="h-4 w-4" />
                                                </div>
                                            </div>
                                            <p className="text-2xl font-black text-foreground italic tracking-tighter transition-colors group-hover:text-primary mb-6">{cat.amount}</p>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-[9px] font-black text-muted-foreground uppercase opacity-40 tracking-widest">
                                                    <span>Utilización</span>
                                                    <span>{cat.progress}%</span>
                                                </div>
                                                <div className="h-1 bg-muted/30 rounded-full overflow-hidden">
                                                    <div className={`h-full transition-all duration-1000 ${textColors[i % 4].replace('text', 'bg')}`} style={{ width: `${cat.progress}%` }} />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            <div className="lg:col-span-2">
                                <Card className="glass-card border-border/40 premium-shadow rounded-3xl overflow-hidden group">
                                    <CardHeader className="bg-muted/30 border-b border-border/30 py-5 px-8 flex flex-row items-center justify-between">
                                        <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60 flex items-center gap-3">
                                            <Layers className="h-4 w-4 text-primary" /> Clasificaciones Pendientes
                                        </CardTitle>
                                        <Badge className="bg-orange-500/10 text-orange-500 text-[9px] font-black px-4 py-1 rounded-full border border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.15)] uppercase tracking-widest">{pending.length} por auditar</Badge>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="divide-y divide-border/20">
                                            {pending.map((item: any) => (
                                                <div key={item.id} className="flex items-center justify-between p-6 hover:bg-primary/5 transition-all duration-300 group/row cursor-pointer">
                                                    <div className="flex items-center gap-5">
                                                        <div className="h-12 w-12 bg-muted/40 flex items-center justify-center rounded-2xl border border-border/40 transition-all group-hover/row:scale-110 group-hover/row:bg-primary/10">
                                                            <FileBarChart className="h-6 w-6 text-muted-foreground/40 group-hover/row:text-primary transition-colors" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[13px] font-black text-foreground uppercase tracking-tight group-hover/row:text-primary transition-colors">{item.vendor}</p>
                                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40 mt-1">{item.concept} <span className="mx-2 opacity-20">|</span> {item.date}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-8 text-right">
                                                        <div className="space-y-1">
                                                            <p className="text-[15px] font-black text-foreground italic tracking-tighter">{item.total}</p>
                                                            <div className="flex items-center gap-2 justify-end">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                                                <span className="text-[9px] text-blue-500 font-black uppercase tracking-widest opacity-60">{item.category}</span>
                                                            </div>
                                                        </div>
                                                        <ChevronRight className="h-5 w-5 text-muted-foreground/20 group-hover/row:text-primary group-hover/row:translate-x-1 transition-all" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="space-y-6">
                                <Card className="glass-card border-l-4 border-primary premium-shadow rounded-3xl overflow-hidden relative">
                                    <CardHeader className="pb-4 px-8 pt-8">
                                        <CardTitle className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">IA de Deducibilidad • Activa</CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-8 pb-8 space-y-8">
                                        <p className="text-[13px] font-bold text-muted-foreground leading-relaxed italic opacity-80">
                                            "El motor ha identificado que el <span className="text-primary font-black">{budget?.utilization || 0}%</span> del presupuesto ha sido utilizado. {budget?.remaining ? `Disponibilidad residual: $${budget.remaining.toLocaleString()} MNX.` : 'Análisis en curso.'}"
                                        </p>
                                        <div className="p-6 bg-muted/30 rounded-2xl border border-white/5 flex items-start gap-5 group hover:bg-primary/5 transition-all duration-500">
                                            <div className="p-2 rounded-lg bg-green-500/10 text-green-500 mt-1">
                                                <CheckCircle className="h-5 w-5" />
                                            </div>
                                            <p className="text-[11px] font-bold text-muted-foreground leading-relaxed uppercase tracking-tight">
                                                Se han <span className="text-foreground font-black">auto-mapeado 142 facturas</span> mediante análisis heurístico de CFDI.
                                            </p>
                                        </div>
                                        <Button className="w-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 text-[10px] font-black uppercase tracking-widest h-11 rounded-xl transition-all group overflow-hidden relative">
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                            Generar Auditoría de Gastos
                                        </Button>
                                    </CardContent>
                                    <div className="absolute -bottom-8 -right-8 opacity-[0.03] -rotate-12">
                                        <ScanSearch className="h-40 w-40" />
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                )
        }
    }

    return (
        <div className="p-8 space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 max-w-[1600px] mx-auto custom-scrollbar">
            <div className="flex justify-between items-end pb-8 border-b border-border/50 relative">
                <div className="absolute -bottom-px left-0 w-32 h-px bg-primary" />
                <div className="space-y-3">
                    <h2 className="text-4xl font-black text-foreground italic tracking-tight uppercase tracking-tighter">
                        Gastos <span className="text-primary tracking-normal not-italic lowercase font-serif font-light opacity-60 px-2">&</span> Egreso
                    </h2>
                    <p className="text-[9px] font-black text-muted-foreground tracking-[0.3em] uppercase flex items-center gap-2">
                        <ScanSearch className="h-3.3 w-3 text-primary" />
                        <span>CLASIFICACIÓN INTELIGENTE DE EGRESOS</span>
                        <span className="h-3 w-px bg-border/50 mx-1" />
                        <span>SAT CFDI ANALYTICS V2</span>
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button onClick={() => classifyExpenses()} variant="outline" className="glass-card border-border/50 text-[9px] font-black uppercase tracking-wider h-10 px-8 hover:bg-muted/50 transition-all rounded-full group">
                        <ScanSearch className="h-4 w-4 mr-3 opacity-40 group-hover:opacity-100 transition-opacity" /> Re-escanear Bóveda
                    </Button>
                    <Button className="bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 text-[9px] font-black uppercase tracking-widest h-10 px-10 rounded-full transition-all group overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        <Tags className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform" /> Gestionar Taxonomía
                    </Button>
                </div>
            </div>

            {renderContent()}
        </div>
    )
}
