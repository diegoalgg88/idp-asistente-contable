import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Search,
    UserPlus,
    Building2,
    UserCircle,
    MoreVertical,
    ShieldCheck,
    Mail,
    Phone,
    FileCheck,
    AlertCircle,
    CheckCircle2,
    Users,
    X
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useModulesStore } from '@/store/modules.store'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function Clients() {
    const { activeView } = useOutletContext<{ activeView: string }>()
    const { clients, fetchClients, loading, createClient } = useModulesStore()
    const [searchTerm, setSearchTerm] = useState('')
    const [isRegisterOpen, setIsRegisterOpen] = useState(false)
    const [newClient, setNewClient] = useState({
        name: '',
        rfc: '',
        type: 'Moral',
        email: '',
        phone: '',
        status: 'Prospecto'
    })

    useEffect(() => {
        fetchClients()
    }, [fetchClients])

    const filteredClients = clients.filter(client => {
        const matchesType = 
            activeView === 'morales' ? client.type === 'Moral' :
            activeView === 'fisicas' ? client.type === 'Física' :
            activeView === 'prospectos' ? client.status === 'Prospecto' : true;
        
        const matchesSearch = 
            client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.rfc.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesType && matchesSearch;
    })

    if (activeView === 'expedientes') {
        return (
            <div className="p-8 space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 max-w-[1600px] mx-auto custom-scrollbar">
                <div className="flex justify-between items-end pb-8 border-b border-border/50 relative">
                    <div className="absolute -bottom-px left-0 w-32 h-px bg-primary" />
                    <div className="space-y-3">
                        <h2 className="text-4xl font-black text-foreground italic tracking-tight uppercase tracking-tighter">
                            Expedientes <span className="text-primary tracking-normal not-italic lowercase font-serif font-light opacity-60 px-2">&</span> KYC
                        </h2>
                        <p className="text-[9px] font-black text-muted-foreground tracking-[0.3em] uppercase flex items-center gap-2">
                            <ShieldCheck className="h-3.3 w-3 text-primary" />
                            <span>CUMPLIMIENTO LEGAL ACTIVO</span>
                            <span className="h-3 w-px bg-border/50 mx-1" />
                            <span>V-SECURE 1.2</span>
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {clients.slice(0, 4).map((client: any) => (
                        <Card key={client.id} className="glass-card border-border/40 premium-shadow group hover:border-primary/40 transition-all duration-500 overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:scale-110 transition-transform">
                                <FileCheck className="h-24 w-24" />
                            </div>
                            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/30 mb-6">
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-colors">
                                        <FileCheck className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-sm font-black text-foreground uppercase tracking-tight">{client.name}</CardTitle>
                                        <span className="text-[10px] text-muted-foreground font-black tracking-[0.1em] opacity-60 uppercase">{client.rfc}</span>
                                    </div>
                                </div>
                                <Badge variant="outline" className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${client.kyc_status === 'Completo' ? 'bg-green-500/5 border-green-500/20 text-green-500' : 'bg-yellow-500/5 border-yellow-500/20 text-yellow-500'}`}>
                                    {client.kyc_status}
                                </Badge>
                            </CardHeader>
                            <CardContent className="space-y-6 relative z-10">
                                <div className="space-y-3">
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40">Verificación Documental</p>
                                    {[
                                        { label: 'Constancia de Situación Fiscal', ok: true },
                                        { label: 'Opinión de Cumplimiento (32D)', ok: true },
                                        { label: 'Acta Constitutiva / Identificación', ok: client.kyc_status === 'Completo' },
                                        { label: 'Comprobante de Domicilio', ok: true }
                                    ].map((doc, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-white/5 group/item hover:bg-white/5 transition-colors">
                                            <span className="text-[11px] font-bold text-foreground/80">{doc.label}</span>
                                            <div className="flex items-center gap-2">
                                                {doc.label.includes('32D') && (
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-5 w-5 hover:text-primary"
                                                        onClick={async () => {
                                                            toast.promise(
                                                                async () => {
                                                                    const { fiscalService } = await import('@/services/api');
                                                                    return await fiscalService.getComplianceOpinion(client.rfc);
                                                                },
                                                                {
                                                                    loading: 'Scrapeando Opinión SAT...',
                                                                    success: (data: any) => `Opinión obtenida: ${data.status}`,
                                                                    error: 'Error en el Scraper'
                                                                }
                                                            );
                                                        }}
                                                    >
                                                        <Search className="h-3 w-3" />
                                                    </Button>
                                                )}
                                                {doc.ok ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4 text-yellow-500" />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button className="w-full glass-card border-border/50 text-[10px] font-black uppercase tracking-widest h-10 hover:bg-primary/10 hover:text-primary transition-all rounded-xl mt-4">
                                    Ver Expediente Completo
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="p-8 space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 max-w-[1600px] mx-auto custom-scrollbar">
            <div className="flex flex-col md:flex-row justify-between items-end pb-8 border-b border-border/50 relative gap-8">
                <div className="absolute -bottom-px left-0 w-32 h-px bg-primary" />
                <div className="space-y-3">
                    <h2 className="text-4xl font-black text-foreground italic tracking-tight uppercase tracking-tighter">
                        {activeView === 'morales' ? 'MOLARES' :
                            activeView === 'fisicas' ? 'FÍSICAS' :
                                activeView === 'prospectos' ? 'PROSPECTOS' : 'CARTERA'}
                        <span className="text-primary tracking-normal not-italic lowercase font-serif font-light opacity-60 px-2">&</span>
                        CLIENTES
                    </h2>
                    <p className="text-[9px] font-black text-muted-foreground tracking-[0.3em] uppercase flex items-center gap-2">
                        <Users className="h-3.3 w-3 text-primary" />
                        <span>SISTEMA DE ADMINISTRACIÓN CENTRAL</span>
                        <span className="h-3 w-px bg-border/50 mx-1" />
                        <span>ENTITIES HUB</span>
                    </p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:min-w-[300px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-40" />
                        <Input
                            placeholder="BUSCAR RFC, NOMBRE..."
                            className="bg-muted/20 border-border/40 pl-12 h-10 rounded-full text-[10px] font-black uppercase tracking-widest focus:ring-primary focus:border-primary/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 text-[9px] font-black uppercase tracking-widest h-10 px-8 rounded-full transition-all shrink-0">
                                <UserPlus className="w-4 h-4 mr-2" />
                                Registrar
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-card border-border/40 premium-shadow max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-black italic uppercase tracking-tight">Nuevo <span className="text-primary tracking-normal not-italic lowercase font-serif font-light opacity-60 px-1">&</span> Cliente</DialogTitle>
                                <DialogDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">Complete los datos de la entidad fiscal</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-6 py-4">
                                <div className="space-y-2">
                                    <Label className="text-[9px] font-black uppercase tracking-widest opacity-40">Nombre o Razón Social</Label>
                                    <Input 
                                        value={newClient.name}
                                        onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                                        className="bg-muted/20 border-border/40 rounded-xl"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[9px] font-black uppercase tracking-widest opacity-40">RFC</Label>
                                        <Input 
                                            value={newClient.rfc}
                                            onChange={(e) => setNewClient({...newClient, rfc: e.target.value})}
                                            className="bg-muted/20 border-border/40 rounded-xl uppercase"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[9px] font-black uppercase tracking-widest opacity-40">Tipo</Label>
                                        <select 
                                            value={newClient.type}
                                            onChange={(e) => setNewClient({...newClient, type: e.target.value})}
                                            className="w-full bg-muted/20 border border-border/40 rounded-xl h-10 px-3 text-sm"
                                        >
                                            <option value="Moral">Moral</option>
                                            <option value="Física">Física</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[9px] font-black uppercase tracking-widest opacity-40">Email de Contacto</Label>
                                    <Input 
                                        type="email"
                                        value={newClient.email}
                                        onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                                        className="bg-muted/20 border-border/40 rounded-xl"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button 
                                    onClick={async () => {
                                        try {
                                            await createClient(newClient);
                                            toast.success("Cliente registrado con éxito");
                                            setIsRegisterOpen(false);
                                        } catch(e) {
                                            toast.error("Error al registrar cliente");
                                        }
                                    }}
                                    className="w-full bg-primary text-[10px] font-black uppercase tracking-widest h-12 rounded-xl"
                                >
                                    Confirmar Registro
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {loading.clients ? (
                <div className="flex items-center justify-center py-40">
                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.5em] animate-pulse">Sincronizando Entidades...</div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredClients.map((client: any) => (
                        <Card key={client.id} className="glass-card border-border/40 premium-shadow relative overflow-hidden group hover:border-primary/40 transition-all duration-500 p-1">
                            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/30 mb-6 p-5">
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className={`h-10 w-10 rounded-2xl flex items-center justify-center border transition-colors ${client.type === "Moral" ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 group-hover:bg-blue-500/20' : 'bg-green-500/10 border-green-500/20 text-green-400 group-hover:bg-green-500/20'}`}>
                                        {client.type === "Moral" ? <Building2 className="h-5 w-5" /> : <UserCircle className="h-5 w-5" />}
                                    </div>
                                    <div>
                                        <CardTitle className="text-sm font-black text-foreground uppercase tracking-tight truncate max-w-[140px] group-hover:text-primary transition-colors">{client.name}</CardTitle>
                                        <span className="text-[10px] text-muted-foreground font-black tracking-[0.1em] opacity-60 uppercase">{client.rfc}</span>
                                    </div>
                                </div>
                                <MoreVertical className="h-4 w-4 text-muted-foreground cursor-pointer opacity-40 hover:opacity-100" />
                            </CardHeader>
                            <CardContent className="space-y-6 p-5 pt-0 relative z-10">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest opacity-40">Status</p>
                                        <Badge className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${client.status === "Activo" ? "bg-green-500/5 text-green-500 border-none" : client.status === "Prospecto" ? "bg-blue-500/5 text-blue-400 border-none" : "bg-red-500/5 text-red-500 border-none"}`}>
                                            {client.status}
                                        </Badge>
                                    </div>
                                    <div className="space-y-1.5">
                                        <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest opacity-40">KYC Verify</p>
                                        <Badge variant="outline" className="border-border/60 text-muted-foreground text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full">{client.kyc_status}</Badge>
                                    </div>
                                </div>
                                <div className="space-y-3 pt-3">
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-white/5 group/item hover:bg-white/5 transition-colors">
                                        <Mail className="h-3.5 w-3.5 text-primary opacity-60" />
                                        <span className="text-[10px] font-bold text-muted-foreground truncate uppercase">{client.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-white/5 group/item hover:bg-white/5 transition-colors">
                                        <Phone className="h-3.5 w-3.5 text-primary opacity-60" />
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">{client.phone}</span>
                                    </div>
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <Button variant="outline" className="flex-1 glass-card border-border/50 text-[9px] font-black uppercase tracking-[0.1em] h-10 rounded-xl hover:bg-muted/50">Expediente</Button>
                                    <Button className="flex-1 bg-primary text-primary-foreground shadow-lg shadow-primary/10 hover:shadow-primary/30 text-[9px] font-black uppercase tracking-widest h-10 rounded-xl transition-all">
                                        <ShieldCheck className="h-3.5 w-3.5 mr-2" /> Auditar
                                    </Button>
                                </div>
                            </CardContent>
                            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                        </Card>
                    ))}
                    {filteredClients.length === 0 && (
                        <div className="col-span-full py-40 text-center border-2 border-dashed border-border/30 rounded-3xl">
                            <Users className="h-20 w-20 text-muted-foreground opacity-[0.05] mx-auto mb-6" />
                            <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.4em] opacity-40">Database Empty / Filters Mismatch</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
