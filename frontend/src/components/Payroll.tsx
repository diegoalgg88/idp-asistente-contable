import { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Users,
    Receipt,
    Landmark,
    TrendingUp,
    AlertTriangle,
    Play,
    UserPlus,
    FileSpreadsheet,
    Clock,
    Shield
} from "lucide-react"
import { useModulesStore } from '@/store/modules.store'

export default function Payroll() {
    const { activeView } = useOutletContext<{ activeView: string }>()
    const { payroll, fetchPayroll, dispersePayroll, loading } = useModulesStore()

    useEffect(() => {
        fetchPayroll()
    }, [fetchPayroll])

    if (loading.payroll && !payroll) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-sm text-muted-foreground animate-pulse">Cargando nómina...</div>
            </div>
        )
    }

    const summary = payroll?.summary
    const employees = payroll?.employees || []
    const specialCalcs = payroll?.specialCalcs || []
    const sua = payroll?.sua

    const renderContent = () => {
        switch (activeView) {
            case 'ptu':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in slide-in-from-bottom-4 duration-700">
                        <Card className="glass-card border-border/40 premium-shadow rounded-3xl overflow-hidden group">
                            <CardHeader className="bg-muted/30 border-b border-border/30 py-6 px-8">
                                <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60">Proyección PTU 2026</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="p-8 bg-primary/5 border border-primary/20 rounded-3xl relative overflow-hidden group/opt">
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover/opt:scale-110 transition-transform">
                                        <TrendingUp className="h-24 w-24" />
                                    </div>
                                    <div className="relative z-10 space-y-2">
                                        <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Monto Estimado de Reparto</p>
                                        <p className="text-4xl font-black text-foreground italic tracking-tighter">${summary?.proyeccion_ptu?.toLocaleString() || '0'}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40">Criterios Legales de Reparto</p>
                                    <div className="flex justify-between p-4 rounded-xl bg-muted/20 border border-white/5 items-center">
                                        <span className="text-[11px] font-bold text-foreground/80 lowercase italic font-serif opacity-60">Días Trabajados (50%)</span>
                                        <span className="text-xs font-black text-foreground">$145,100</span>
                                    </div>
                                    <div className="flex justify-between p-4 rounded-xl bg-muted/20 border border-white/5 items-center">
                                        <span className="text-[11px] font-bold text-foreground/80 lowercase italic font-serif opacity-60">Salario Devengado (50%)</span>
                                        <span className="text-xs font-black text-foreground">$145,100</span>
                                    </div>
                                </div>
                                <Button className="w-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 text-[10px] font-black uppercase tracking-widest h-11 rounded-xl transition-all">
                                    Generar Proyecto de Reparto
                                </Button>
                            </CardContent>
                        </Card>
                        <div className="glass-card border-border/40 p-8 rounded-3xl space-y-6 relative overflow-hidden flex flex-col justify-center">
                            <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 w-fit">
                                <Shield className="h-8 w-8 text-yellow-500" />
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-xs font-black text-foreground uppercase tracking-widest">Marco Legal PTU • México</h4>
                                <p className="text-sm font-bold text-muted-foreground leading-relaxed italic opacity-80">"El reparto de utilidades debe efectuarse dentro de los 60 días posteriores a la presentación de la declaración anual. Para personas morales, la fecha límite es el 30 de mayo."</p>
                                <p className="text-[11px] text-muted-foreground leading-relaxed uppercase tracking-tight font-medium">Este sistema calcula la PTU basado en la Utilidad Fiscal reportada en el módulo Fiscal con auditoría cruzada de CFDI de Nómina.</p>
                            </div>
                            <div className="absolute top-0 right-0 p-12 opacity-[0.02] -rotate-12 translate-x-4">
                                <Shield className="h-48 w-48" />
                            </div>
                        </div>
                    </div>
                )
            case 'incidencias':
                return (
                    <Card className="glass-card border-border/40 premium-shadow rounded-3xl overflow-hidden animate-in slide-in-from-bottom-4 duration-700">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-border/30 py-5 px-8 bg-muted/30">
                            <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60">Control de Incidencias Operativas</CardTitle>
                            <Button size="sm" variant="outline" className="glass-card border-border/50 text-[9px] font-black uppercase tracking-widest h-8 px-4 rounded-full transition-all hover:bg-muted/50">Añadir Registro</Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-border/30">
                                {employees.slice(0, 3).map((emp: any) => (
                                    <div key={emp.id} className="flex items-center justify-between p-6 bg-background/20 group hover:bg-primary/5 transition-all duration-300">
                                        <div className="flex items-center gap-5">
                                            <div className="p-3 bg-muted/30 rounded-2xl group-hover:bg-primary/10 transition-colors">
                                                <Clock className="h-5 w-5 text-yellow-500 group-hover:scale-110 transition-transform" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">{emp.name}</p>
                                                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-tighter opacity-60 mt-0.5">Reporte de Ausentismo / Incapacidad Sistematizada</p>
                                            </div>
                                        </div>
                                        <Badge className="bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                                            Pendiente Validar
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )
            case 'sua':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center text-foreground">
                            <h3 className="text-xl font-bold">SUA / IMSS Portal</h3>
                            <Badge className="bg-green-700 text-white font-bold">Sincronizado</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-card border-border">
                                <CardHeader><CardTitle className="text-sm font-bold uppercase text-muted-foreground tracking-widest">Liquidación del Mes</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-muted-foreground">Cuotas IMSS</span>
                                        <span className="text-foreground font-mono">$12,450.00</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-muted-foreground">Retención INFONAVIT</span>
                                        <span className="text-foreground font-mono">$5,100.00</span>
                                    </div>
                                    <div className="pt-2 border-t border-border flex justify-between items-center">
                                        <span className="text-xs font-bold text-foreground">TOTAL A PAGAR</span>
                                        <span className="text-lg font-black text-orange-500">${sua?.total_pago?.toLocaleString() || '17,550'}</span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Button id="boton-importar-sua" className="h-full border border-dashed border-border bg-transparent hover:bg-muted/50 text-muted-foreground flex flex-col gap-2 transition-all">
                                <FileSpreadsheet className="h-6 w-6" />
                                <span className="text-[10px] font-bold uppercase">Importar archivo .SUA</span>
                            </Button>
                        </div>
                    </div>
                )
            default: // periodo
                return (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <Card className="glass-card border-border/40 premium-shadow rounded-3xl overflow-hidden group">
                                <CardHeader className="pb-2 px-6 pt-5"><CardTitle className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40">Costo Total del Periodo</CardTitle></CardHeader>
                                <CardContent className="px-6 pb-6">
                                    <p className="text-2xl font-black text-foreground italic tracking-tighter">${summary?.cost_total?.toLocaleString() || '0'}</p>
                                    <span className="text-[10px] font-black text-green-500 uppercase flex items-center gap-1 mt-1">
                                        <TrendingUp className="h-3 w-3" /> {summary?.change_vs_prev} VS ANTERIOR
                                    </span>
                                </CardContent>
                            </Card>
                            <Card className="glass-card border-border/40 premium-shadow rounded-3xl overflow-hidden group">
                                <CardHeader className="pb-2 px-6 pt-5"><CardTitle className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40">Retenciones ISR</CardTitle></CardHeader>
                                <CardContent className="px-6 pb-6">
                                    <p className="text-2xl font-black text-primary italic tracking-tighter">${summary?.retenciones_isr?.toLocaleString() || '0'}</p>
                                    <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest mt-1">Listo para Decl.</span>
                                </CardContent>
                            </Card>
                            <Card className="glass-card border-border/40 premium-shadow rounded-3xl overflow-hidden group">
                                <CardHeader className="pb-2 px-6 pt-5"><CardTitle className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40">Cuotas IMSS/INF</CardTitle></CardHeader>
                                <CardContent className="px-6 pb-6">
                                    <p className="text-2xl font-black text-orange-400 italic tracking-tighter">${summary?.cuotas_imss?.toLocaleString() || '0'}</p>
                                    <span className="text-[10px] font-black text-orange-500/60 uppercase tracking-widest mt-1">Expira en 5d</span>
                                </CardContent>
                            </Card>
                            <Card className="bg-primary/10 border-primary/20 premium-shadow rounded-3xl overflow-hidden group">
                                <CardHeader className="pb-2 px-6 pt-5"><CardTitle className="text-[9px] font-black text-primary uppercase tracking-widest">Proyección PTU 2026</CardTitle></CardHeader>
                                <CardContent className="px-6 pb-6 flex items-center justify-between">
                                    <p className="text-2xl font-black text-foreground italic tracking-tighter">${summary?.proyeccion_ptu?.toLocaleString() || '0'}</p>
                                    <TrendingUp className="h-5 w-5 text-primary opacity-40" />
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            <div className="lg:col-span-2 space-y-6">
                                <Card className="glass-card border-border/40 premium-shadow rounded-3xl overflow-hidden group">
                                    <CardHeader className="bg-muted/30 border-b border-border/30 py-5 px-8 flex flex-row justify-between items-center">
                                        <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60">Personal • Colaboradores Activos</CardTitle>
                                        <div className="flex gap-2">
                                            <div className="w-40 h-8 bg-background/50 border border-border/40 rounded-full flex items-center px-4">
                                                <Users className="w-3.5 h-3.5 text-muted-foreground/40" />
                                                <input id="campo-busqueda-empleados" className="bg-transparent border-none outline-none text-[9px] font-black uppercase tracking-widest text-foreground px-2 w-full" placeholder="Buscar..." />
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="divide-y divide-border/30">
                                            {employees.map((emp: any) => (
                                                <div key={emp.id} className="flex items-center justify-between p-5 hover:bg-primary/5 transition-all duration-300 group/row cursor-pointer">
                                                    <div className="flex items-center gap-5">
                                                        <div className="h-11 w-11 rounded-2xl bg-muted/40 flex items-center justify-center text-[11px] font-black text-foreground uppercase border border-border/40 transition-all group-hover/row:bg-primary group-hover/row:text-primary-foreground group-hover/row:scale-105 group-hover/row:rotate-3">
                                                            {emp.name.split(' ').map((n: string) => n[0]).join('')}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-foreground uppercase tracking-tight group-hover/row:text-primary transition-colors">{emp.name}</p>
                                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40 mt-0.5">{emp.type} <span className="mx-1">•</span> {emp.department}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right space-y-1">
                                                        <p className="text-xs font-black text-foreground italic tracking-tighter">{emp.salary}</p>
                                                        <Badge className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border-none ${emp.status === 'Pagado' ? 'bg-green-500/5 text-green-500' : 'bg-yellow-500/5 text-yellow-500'}`}>
                                                            {emp.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                    <div className="p-5 bg-muted/20 border-t border-border/30 flex justify-center">
                                        <Button id="boton-registrar-empleado" variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 hover:text-primary hover:bg-transparent transition-all"><UserPlus className="h-4 w-4 mr-3 opacity-40" /> Registrar nuevo integrante</Button>
                                    </div>
                                </Card>
                            </div>

                            <div className="space-y-6">
                                <Card className="glass-card border-border/40 premium-shadow rounded-3xl overflow-hidden">
                                    <CardHeader className="bg-muted/30 border-b border-border/30 py-5 px-6">
                                        <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60">Operaciones Especiales</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-4">
                                        {specialCalcs.map((calc: any, i: number) => (
                                            <Button key={i} variant="outline" className="w-full justify-between items-center border-border/40 glass-card hover:bg-primary/5 hover:border-primary/40 h-auto py-4 px-5 group/btn rounded-2xl transition-all">
                                                <div className="text-left space-y-1">
                                                    <p className="text-[11px] font-black uppercase tracking-tight text-foreground transition-colors group-hover/btn:text-primary">{calc.name}</p>
                                                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter opacity-[0.4]">{calc.status} <span className="mx-1">•</span> {calc.date}</p>
                                                </div>
                                                <div className={`p-2 rounded-xl transition-all group-hover/btn:scale-110 ${calc.status === 'PENDIENTE' ? 'bg-orange-500/10 text-orange-500' : 'bg-muted/30 text-muted-foreground'}`}>
                                                    {calc.status === 'PENDIENTE' ? (
                                                        <AlertTriangle className="h-4 w-4 animate-pulse" />
                                                    ) : (
                                                        <Receipt className="h-4 w-4" />
                                                    )}
                                                </div>
                                            </Button>
                                        ))}
                                    </CardContent>
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
                        Nómina <span className="text-primary tracking-normal not-italic lowercase font-serif font-light opacity-60 px-2">&</span> Capital
                    </h2>
                    <p className="text-[9px] font-black text-muted-foreground tracking-[0.3em] uppercase flex items-center gap-2">
                        <Users className="h-3.3 w-3 text-primary" />
                        <span>GESTIÓN ESTRATÉGICA DE TALENTO</span>
                        <span className="h-3 w-px bg-border/50 mx-1" />
                        <span>SAT CFDI V4.0</span>
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" id="boton-listas-asistencia" className="glass-card border-border/50 text-[9px] font-black uppercase tracking-wider h-10 px-8 hover:bg-muted/50 transition-all rounded-full group">
                        <FileSpreadsheet className="h-3.5 w-3.5 mr-2 opacity-40 group-hover:opacity-100 transition-opacity" /> Listas de Asistencia
                    </Button>
                    <Button id="boton-dispersar-periodo" onClick={() => dispersePayroll()} className="bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 text-[9px] font-black uppercase tracking-widest h-10 px-10 rounded-full transition-all group overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        <Play className="h-3.5 w-3.5 mr-3 group-hover:scale-110 transition-transform" /> Dispersar periodo
                    </Button>
                </div>
            </div>

            {renderContent()}
        </div>
    )
}
