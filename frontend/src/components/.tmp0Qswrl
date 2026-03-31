import React, { forwardRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, FileText, Users, Calculator, Receipt, PieChart, Target, Command } from 'lucide-react'

const modules = [
    { icon: LayoutDashboard, label: 'Dashboard', desc: 'KPIs y Métricas', href: '/dashboard' },
    { icon: FileText, label: 'Documentos', desc: 'Repositorio CFDI', href: '/documents' },
    { icon: Users, label: 'Clientes', desc: 'Administración', href: '/clients' },
    { icon: Calculator, label: 'Fiscal', desc: 'Cumplimiento', href: '/fiscal' },
]

const EmptyPane = forwardRef<HTMLDivElement, {}>((_props, ref) => {
    const navigate = useNavigate()

    return (
        <div ref={ref} className="h-full w-full bg-background flex flex-col items-center justify-center text-muted-foreground gap-12 animate-slow-fade relative overflow-hidden">
            {/* Decorative background elements - nofetch (decorativo) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />

            {/* LCP Critical Section */}
            <div className="flex flex-col items-center gap-6 relative z-10">
                <div className="w-24 h-24 rounded-[2rem] bg-card/60 backdrop-blur-xl flex items-center justify-center border border-white/10 shadow-glow group hover:scale-105 transition-transform duration-500">
                    <Command className="h-12 w-12 text-primary opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-center space-y-2">
                    {/* LCP Element - Título principal */}
                    <h1 
                        id="lcp-title"
                        className="text-3xl font-black text-foreground tracking-tighter uppercase italic"
                        {...({ fetchpriority: 'high' } as any)}
                    >
                        IDP<span className="text-primary tracking-normal not-italic">.</span>Workbench
                    </h1>
                    <p className="text-[10px] font-black tracking-[0.4em] text-muted-foreground uppercase opacity-60">
                        Intelligent Data Processing Hub
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl relative z-10">
                {modules.map((item, i) => (
                    <div
                        key={i}
                        onClick={() => navigate(item.href)}
                        className="p-6 rounded-3xl border border-white/5 bg-card/40 backdrop-blur-md flex flex-col items-center text-center gap-4 hover:bg-primary/5 hover:border-primary/20 hover:-translate-y-2 transition-all cursor-pointer group premium-shadow"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <item.icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="space-y-1">
                            <div className="text-xs font-black text-foreground uppercase tracking-tight">{item.label}</div>
                            <div className="text-[9px] text-muted-foreground uppercase font-black tracking-widest opacity-40 group-hover:opacity-80 transition-opacity">
                                {item.desc.split(' ')[0]}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col items-center gap-4 mt-8 text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em] relative z-10">
                <p className="opacity-40">Quick Commands</p>
                <div className="flex items-center gap-8">
                    <span className="flex items-center gap-3">
                        <span className="px-2 py-1 rounded bg-muted/50 border border-white/5 text-foreground">Ctrl + P</span>
                        <span>Search</span>
                    </span>
                    <span className="flex items-center gap-3">
                        <span className="px-2 py-1 rounded bg-muted/50 border border-white/5 text-foreground">Alt + A</span>
                        <span>Agent Loop</span>
                    </span>
                </div>
            </div>
        </div>
    )
})

EmptyPane.displayName = 'EmptyPane'
export default EmptyPane
