import { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Landmark,
    FileText,
    PieChart,
    ArrowDownToLine,
    TrendingUp,
    Calendar,
    ArrowRight,
    Search,
    Download,
    BarChart3
} from "lucide-react"
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts'
import { toast } from 'sonner'
import { useModulesStore } from '@/store/modules.store'

export default function Finance() {
    const { activeView } = useOutletContext<{ activeView: string }>()
    const { finance, fetchFinance, reconcileBank, loading } = useModulesStore()

    useEffect(() => {
        fetchFinance()
    }, [fetchFinance])

    if (loading.finance && !finance) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-sm text-muted-foreground animate-pulse">Cargando finanzas...</div>
            </div>
        )
    }

    const summary = finance?.summary
    const statements = finance?.statements || []
    const bankAccounts = finance?.bankAccounts || []

    const renderContent = () => {
        switch (activeView) {
            case 'balance':
            case 'resultados':
                return (
                    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700">
                        <div className="flex justify-between items-center text-foreground">
                            <h3 className="text-xl font-black uppercase italic tracking-tighter opacity-80">{activeView === 'balance' ? 'Balance General Consolidado' : 'Estado de Resultados Operativo'}</h3>
                            <div className="flex gap-3">
                                <Button size="sm" variant="outline" className="glass-card border-border/50 text-[9px] font-black uppercase tracking-widest h-9 px-6 hover:bg-muted/50 transition-all rounded-full"><Download className="h-4 w-4 mr-2 opacity-40" /> Exportar PDF</Button>
                                <Button size="sm" variant="outline" className="glass-card border-border/50 text-[9px] font-black uppercase tracking-widest h-9 px-6 hover:bg-muted/50 transition-all rounded-full"><FileText className="h-4 w-4 mr-2 opacity-40" /> Auditoría Detalle</Button>
                            </div>
                        </div>
                        <Card className="glass-card border-border/40 premium-shadow rounded-3xl overflow-hidden group">
                            <div className="p-10 space-y-10">
                                <div className="space-y-4">
                                    <div className="flex justify-between text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40 border-b border-border/30 pb-3 italic"><span>Concepto Contable</span><span>Importe Neto</span></div>
                                    <div className="flex justify-between items-center text-sm py-4 border-b border-border/20 group/item hover:bg-primary/5 px-2 rounded-xl transition-all">
                                        <span className="font-bold text-foreground/80">Activo Circulante</span>
                                        <span className="text-lg font-black text-foreground italic tracking-tighter">$1,450,200.00</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm py-4 border-b border-border/20 group/item hover:bg-primary/5 px-2 rounded-xl transition-all">
                                        <span className="font-bold text-foreground/80">Pasivo Corto Plazo</span>
                                        <span className="text-lg font-black text-foreground italic tracking-tighter">$840,000.00</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm py-6 bg-primary/5 px-4 rounded-2xl border border-primary/20">
                                        <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">Capital Contable • Patrimonio</span>
                                        <span className="text-2xl font-black text-primary italic tracking-tighter shadow-glow-primary">$610,200.00</span>
                                    </div>
                                </div>
                                <div className="bg-muted/20 p-6 rounded-2xl border border-white/5 flex items-center gap-5 relative overflow-hidden">
                                    <TrendingUp className="h-6 w-6 text-primary flex-shrink-0" />
                                    <p className="text-[11px] font-bold text-muted-foreground leading-relaxed italic uppercase tracking-tight">
                                        "El margen de operación ha incrementado un <span className="text-primary">4.2%</span> comparado con el trimestre anterior. La liquidez proyectada se mantiene estable."
                                    </p>
                                    <div className="absolute top-0 right-0 p-4 opacity-[0.02]">
                                        <BarChart3 className="h-16 w-16" />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                )
            case 'flujo':
                return (
                    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700">
                        <h3 className="text-xl font-black text-foreground uppercase tracking-tighter italic opacity-80">Flujo de Efectivo Real-Time</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            <Card className="glass-card border-border/40 premium-shadow md:col-span-2 rounded-3xl p-8 overflow-hidden group">
                                <div className="h-[350px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={finance?.chartData || []}>
                                            <defs>
                                                <linearGradient id="colorEntradas" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.2} />
                                            <XAxis 
                                                dataKey="name" 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{fontSize: 10, fontWeight: 700, fill: 'hsl(var(--muted-foreground))'}} 
                                                dy={10}
                                            />
                                            <YAxis 
                                                hide 
                                            />
                                            <Tooltip 
                                                contentStyle={{ 
                                                    backgroundColor: 'hsl(var(--background))', 
                                                    border: '1px solid hsl(var(--border)/0.5)', 
                                                    borderRadius: '16px',
                                                    fontSize: '10px',
                                                    fontWeight: '900',
                                                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                                                }}
                                                cursor={{fill: 'hsl(var(--primary)/0.05)'}}
                                            />
                                            <Bar dataKey="entradas" fill="url(#colorEntradas)" radius={[6, 6, 0, 0]} barSize={20} />
                                            <Bar dataKey="salidas" fill="hsl(var(--muted-foreground)/0.2)" radius={[6, 6, 0, 0]} barSize={20} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-6 flex justify-center gap-8 border-t border-border/30 pt-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-primary" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Entradas Brutas</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Egresos Operativos</span>
                                    </div>
                                </div>
                            </Card>
                            <Card className="glass-card border-border/40 premium-shadow rounded-3xl p-8 space-y-8 flex flex-col justify-center">
                                <h4 className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40 border-b border-border/30 pb-3">Resumen de Liquidez Semanal</h4>
                                <div className="space-y-5">
                                    <div className="flex justify-between items-center group/line">
                                        <span className="text-[11px] font-bold text-muted-foreground group-hover/line:text-green-500 transition-colors">Entradas</span>
                                        <span className="text-lg font-black text-green-500 italic tracking-tighter">+$45,000.00</span>
                                    </div>
                                    <div className="flex justify-between items-center group/line">
                                        <span className="text-[11px] font-bold text-muted-foreground group-hover/line:text-red-500 transition-colors">Salidas</span>
                                        <span className="text-lg font-black text-red-500 italic tracking-tighter">-$28,400.00</span>
                                    </div>
                                    <div className="pt-6 border-t border-border/30 flex justify-between items-center">
                                        <span className="text-xs font-black text-foreground uppercase tracking-widest">Saldo Neto</span>
                                        <span className="text-2xl font-black text-primary italic tracking-tighter shadow-glow-primary">+$16,600.00</span>
                                    </div>
                                </div>
                                <Button className="w-full bg-muted/20 hover:bg-primary hover:text-primary-foreground text-[9px] font-black uppercase tracking-widest h-10 rounded-xl transition-all border border-white/5">
                                    Ver Proyección 30D
                                </Button>
                            </Card>
                        </div>
                    </div>
                )
            default: // bancos
                return (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { title: "Margen Bruto", value: summary?.margen_bruto || '-', icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/5" },
                                { title: "EBITDA", value: summary?.ebitda || '-', icon: PieChart, color: "text-green-500", bg: "bg-green-500/5" },
                                { title: "Liquidez", value: summary?.liquidez || '-', icon: Landmark, color: "text-yellow-500", bg: "bg-yellow-500/5" },
                                { title: "Saldos Bancos", value: summary?.saldos_bancos || '-', icon: Calendar, color: "text-primary", bg: "bg-primary/5" },
                            ].map((stat, i) => (
                                <Card key={i} className="glass-card border-border/40 premium-shadow rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all duration-500">
                                    <CardContent className="p-6 relative">
                                        <div className="flex justify-between items-start mb-6">
                                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40 italic">{stat.title}</p>
                                            <div className={`p-2 rounded-xl ${stat.bg} ${stat.color} transition-all group-hover:scale-110`}>
                                                <stat.icon className="h-4 w-4" />
                                            </div>
                                        </div>
                                        <p className="text-2xl font-black text-foreground italic tracking-tighter transition-colors group-hover:text-primary">{stat.value}</p>
                                        <div className="mt-2 h-1 w-12 bg-muted/30 rounded-full overflow-hidden">
                                            <div className={`h-full w-0 group-hover:w-full transition-all duration-1000 ${stat.color.replace('text', 'bg')}`} />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <Card className="glass-card border-border/40 premium-shadow rounded-3xl overflow-hidden group">
                                <CardHeader className="bg-muted/30 border-b border-border/30 py-5 px-8">
                                    <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60">Estados Financieros Maestro</CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 space-y-4">
                                    {statements.map((doc: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-muted/20 border border-white/5 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 group/item cursor-pointer">
                                            <div className="flex items-center gap-5">
                                                <div className="p-3 rounded-xl bg-background/50 border border-border/40 group-hover/item:text-primary transition-colors">
                                                    <FileText className="h-6 w-6 opacity-40 group-hover/item:opacity-100" />
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-sm font-black text-foreground uppercase tracking-tight group-hover/item:text-primary transition-colors">{doc.name}</span>
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40 italic">Emisión Certificada: {doc.last_updated}</p>
                                                </div>
                                            </div>
                                            <div className="p-2 rounded-full bg-muted/30 opacity-0 group-hover/item:opacity-100 transition-all group-hover/item:translate-x-1">
                                                <ArrowRight className="h-4 w-4 text-primary" />
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card className="glass-card border-border/40 premium-shadow rounded-3xl overflow-hidden group">
                                <CardHeader className="bg-muted/30 border-b border-border/30 py-5 px-8">
                                    <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60">Integración Bancaria (API)</CardTitle>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <div className="space-y-6">
                                        {bankAccounts.map((bank: any, i: number) => (
                                            <div key={bank.id} className={`flex items-center gap-6 p-6 rounded-3xl border transition-all duration-500 group/bank ${i === 0 ? 'border-primary/30 bg-primary/5' : 'border-white/5 bg-muted/20 opacity-60 hover:opacity-100 hover:bg-muted/30'}`}>
                                                <div className={`p-4 rounded-2xl ${i === 0 ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110' : 'bg-muted/40 text-muted-foreground'}`}>
                                                    <Landmark className="h-6 w-6" />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <p className={`text-sm font-black uppercase tracking-tight ${i === 0 ? 'text-foreground' : 'text-muted-foreground'}`}>{bank.bank}</p>
                                                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-tighter opacity-60 italic">Cuenta: {bank.account_mask} <span className="mx-2 opacity-20">|</span> Saldo: ${bank.balance?.toLocaleString()}</p>
                                                </div>
                                                <Button size="sm" variant={i === 0 ? "outline" : "ghost"} className={`rounded-xl text-[9px] font-black uppercase tracking-widest h-9 px-5 ${i === 0 ? 'border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground' : 'text-muted-foreground hover:bg-muted/50'}`}>
                                                    {bank.status === 'Synced' && i > 0 ? 'Synced' : <><ArrowDownToLine className="h-4 w-4 mr-2" /> Importar</>}
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
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
                        Finanzas <span className="text-primary tracking-normal not-italic lowercase font-serif font-light opacity-60 px-2">&</span> Activos
                    </h2>
                    <p className="text-[9px] font-black text-muted-foreground tracking-[0.3em] uppercase flex items-center gap-2">
                        <PieChart className="h-3.3 w-3 text-primary" />
                        <span>INTELIGENCIA DE NEGOCIOS AVANZADA</span>
                        <span className="h-3 w-px bg-border/50 mx-1" />
                        <span>MASTER LEDGER V2</span>
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button onClick={() => {
                        toast.promise(reconcileBank(), {
                            loading: 'Conciliando cuentas bancarias...',
                            success: 'Conciliación completada con éxito',
                            error: 'Error al conciliar cuentas'
                        })
                    }} variant="outline" className="glass-card border-border/50 text-[9px] font-black uppercase tracking-wider h-10 px-8 hover:bg-muted/50 transition-all rounded-full group">
                        <Landmark className="h-4 w-4 mr-3 opacity-40 group-hover:opacity-100 transition-opacity" /> Conciliación Bancaria
                    </Button>
                    <Button className="bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 text-[9px] font-black uppercase tracking-widest h-10 px-10 rounded-full transition-all group overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        <FileText className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform" /> Generar Reporte Maestro
                    </Button>
                </div>
            </div>

            {renderContent()}
        </div>
    )
}
