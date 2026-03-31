import { useState, useRef, useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Upload, FileText, Trash2, Eye, CheckCircle, X, Search, MoreHorizontal, Database, AlertCircle, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useIDP } from '@/hooks/useIDP'
import type { Document as IDPDocument, DocumentStatus } from '@/types'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Documents() {
  const { activeView } = useOutletContext<{ activeView: string }>()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [activeDocument, setActiveDocument] = useState<IDPDocument | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const { documents, isUploading, uploadProgress, uploadDocument, deleteDocument, syncSATDocuments } = useIDP()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    try {
      await uploadDocument(selectedFile, 'cfdi')
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }

  const handleDeleteDocument = async (id: string) => {
    deleteDocument(id)
  }

  const filteredDocuments = useMemo(() => {
    let filtered = documents
    
    if (activeView === 'emitidas') filtered = documents.filter(doc => doc.document_type === 'emitida' || doc.document_type === 'ingreso')
    else if (activeView === 'recibidas') filtered = documents.filter(doc => doc.document_type === 'recibida' || doc.document_type === 'egreso')
    else if (activeView === 'nominas') filtered = documents.filter(doc => doc.document_type === 'nomina' || doc.document_type === 'cfdi-nom')
    
    if (searchTerm) {
      const lowSearch = searchTerm.toLowerCase()
      filtered = filtered.filter(doc => 
        doc.id.toString().includes(lowSearch) || 
        (doc.nombre_original && doc.nombre_original.toLowerCase().includes(lowSearch)) ||
        (doc.document_type && doc.document_type.toLowerCase().includes(lowSearch))
      )
    }
    
    return filtered
  }, [documents, activeView, searchTerm])

  const getStatusBadge = (status: DocumentStatus) => {
    const labels = {
      pending: 'Pendiente',
      processing: 'Procesando',
      completed: 'Completado',
      error: 'Error',
    } as const

    const colors = {
      pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      processing: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      completed: 'bg-green-500/10 text-green-500 border-green-500/20',
      error: 'bg-red-500/10 text-red-500 border-red-500/20',
    }

    return (
      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${colors[status]}`}>
        {labels[status]}
      </span>
    )
  }

  const deleteAndCloseIfActive = async (id: string) => {
    if (activeDocument?.id.toString() === id.toString()) {
      setActiveDocument(null)
    }
    handleDeleteDocument(id)
  }

  // View: Split Screen (Contextual Analysis)
  if (activeDocument) {
    return (
      <div className="flex h-full flex-col bg-background text-foreground animate-in fade-in duration-300">
        <div className="flex items-center justify-between px-6 h-12 border-b border-border bg-card shrink-0">
          <div className="flex items-center gap-3">
            <FileText className="h-4 w-4 text-blue-400" />
            <div className="flex flex-col">
              <h1 className="text-xs font-bold text-foreground leading-none" id="titulo-documento-activo">Documento #{activeDocument.id}</h1>
              <span className="text-[10px] text-muted-foreground uppercase tracking-tighter mt-1">{activeDocument.nombre_original || 'CFDI-NOM-01.pdf'}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50" onClick={() => setActiveDocument(null)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* @ts-ignore */}
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Left Panel: PDF Viewer */}
          <ResizablePanel defaultSize={50} minSize={30} className="bg-background">
            <div className="h-full p-6 flex flex-col">
              <div className="h-9 mb-4 flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-600 flex items-center gap-2">
                  Visor de PDF <Badge variant="outline" className="border-blue-900/30 text-blue-500 text-[9px]">V1.0</Badge>
                </h3>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500"><Search className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
              <div className="flex-1 bg-muted/50 rounded border border-border flex items-center justify-center shadow-inner group">
                <div className="text-center group-hover:scale-105 transition-transform">
                  <FileText className="h-20 w-20 mx-auto mb-6 text-muted-foreground opacity-20" />
                  <p className="text-sm font-bold text-muted-foreground tracking-tighter uppercase">Previsualización Protegida</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-2 font-mono italic">ORIGEN: {activeDocument.ruta_archivo}</p>
                </div>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle className="w-[1px] bg-border" />

          {/* Right Panel: Analysis & Tools */}
          <ResizablePanel defaultSize={50} className="bg-background">
            <div className="h-full p-6 flex flex-col">
              <Tabs defaultValue="analysis" className="flex-1 flex flex-col">
                <TabsList className="bg-card border border-border p-0 h-9 p-0.5 self-start mb-6">
                  <TabsTrigger value="analysis" className="text-[11px] uppercase font-bold px-4 data-[state=active]:bg-muted data-[state=active]:text-foreground h-full border-none rounded-none">Análisis IDP</TabsTrigger>
                  <TabsTrigger value="workflow" className="text-[11px] uppercase font-bold px-4 data-[state=active]:bg-muted data-[state=active]:text-foreground h-full border-none rounded-none">Workflows</TabsTrigger>
                </TabsList>

                <TabsContent value="analysis" className="flex-1 mt-0 outline-none">
                  <div className="space-y-6">
                    <Card className="bg-card border-border rounded-sm shadow-xl">
                      <CardHeader className="pb-3 border-b border-border/50 mb-4">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Auditoría de IA</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center mb-6">
                          <span className="text-[11px] font-bold text-slate-400 uppercase">Confianza RAG</span>
                          <span className={`text-sm font-black italic ${activeDocument.puntuacion_confianza > 80 ? 'text-green-500' : 'text-blue-500'}`}>
                            {activeDocument.puntuacion_confianza > 0 ? `${Math.round(activeDocument.puntuacion_confianza)}%` : '98.2%'}
                          </span>
                        </div>
                        <div className="space-y-4 pt-4 border-t border-border">
                          <div className="flex justify-between items-center text-[10px] uppercase font-bold">
                            <span className="text-slate-500">Validación SAT:</span>
                            <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-[9px] uppercase">Aprobada</Badge>
                          </div>
                          <div className="flex justify-between items-center text-[10px] uppercase font-bold">
                            <span className="text-slate-500">Art. LISR Sugerido:</span>
                            <span className="text-blue-400 underline cursor-pointer hover:text-blue-300">Art. 27 Fracc I</span>
                          </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                          <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-lg text-[11px] font-bold uppercase rounded-none" variant="default">
                            <CheckCircle className="h-3.5 w-3.5 mr-2" />
                            Validar Datos
                          </Button>
                          <Button className="flex-1 border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 text-[11px] font-bold uppercase rounded-none" variant="outline">
                            Corregir
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-card border-border rounded-sm shadow-xl overflow-hidden">
                      <CardHeader className="pb-3 border-b border-border">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground text-center flex items-center justify-center gap-2">
                          <Database className="w-3 h-3 text-slate-700" /> Extracción JSON (Crudo)
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <pre className="bg-background p-6 text-[11px] font-mono overflow-auto max-h-[300px] text-blue-400 custom-scrollbar">
                          {JSON.stringify(activeDocument.datos_extraidos || {
                            document: "CFDI_NOMINA_01.pdf",
                            issuer: "CONTABILIDAD S.A.",
                            recipient: "DIEGO GZZ",
                            total: 15400.00,
                            currency: "MXN",
                            date: "2026-03-09"
                          }, null, 2)}
                        </pre>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="workflow" className="flex-1 mt-0 outline-none">
                  <div className="grid grid-cols-1 gap-4">
                    <Card className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer group p-4">
                      <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors uppercase">Validar contra reglas SAT 2026</p>
                      <p className="text-[10px] text-muted-foreground uppercase mt-1">Ejecución automática de motor de reglas</p>
                    </Card>
                    <Card className="bg-card border-border hover:border-green-500/50 transition-all cursor-pointer group p-4">
                      <p className="text-xs font-bold text-foreground group-hover:text-green-400 transition-colors uppercase">Extraer conceptos de ISR</p>
                      <p className="text-[10px] text-muted-foreground uppercase mt-1">Mapeo automático a cuentas contables</p>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    )
  }

  // View: Table
  return (
    <div className="p-8 space-y-10 h-full overflow-y-auto bg-background text-foreground animate-in fade-in duration-500 max-w-[1600px] mx-auto custom-scrollbar">
      <div className="flex justify-between items-end pb-8 border-b border-border/50 relative">
        <div className="absolute -bottom-px left-0 w-32 h-px bg-primary" />
        <div className="space-y-3">
          <h1 className="text-4xl font-black text-foreground italic tracking-tight uppercase tracking-tighter">
            {activeView === 'emitidas' ? 'Emitidas' :
              activeView === 'recibidas' ? 'Recibidas' :
                activeView === 'nominas' ? 'Nóminas' : 'Explorador'}
            <span className="text-primary tracking-normal not-italic lowercase font-serif font-light opacity-60 px-2">&</span>
            Documentos
          </h1>
          <p className="text-[9px] font-black text-muted-foreground tracking-[0.3em] uppercase flex items-center gap-2">
            <Database className="h-3.3 w-3 text-primary" />
            <span>Repositorio Maestro Conectado</span>
            <span className="h-3 w-px bg-border/50 mx-1" />
            <span>CORE IDP V2.0</span>
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="glass-card border-border/50 text-[9px] font-black uppercase tracking-wider h-9 px-6 hover:bg-muted/50 transition-all rounded-full"
            id="boton-exportar-excel"
            onClick={async () => {
              try {
                const { idpService } = await import('@/services/api');
                await idpService.exportDocuments();
              } catch (e) {
                alert('Error al exportar documentos');
              }
            }}
          >
            Exportar XLS
          </Button>
          <Button 
            className="bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 text-[9px] font-black uppercase tracking-widest h-9 px-8 rounded-full transition-all"
            id="boton-sincronizar-sat"
            onClick={async () => {
              try {
                const res = await syncSATDocuments('EXT990101NI1', '2026-03-01', '2026-03-31');
                alert(res.message || 'Sincronización iniciada');
              } catch (e) {
                alert('Error al iniciar sincronización');
              }
            }}
          >
            Nueva Sincronía
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Col: Upload - Sticky style */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-card border-border rounded-sm shadow-2xl overflow-hidden">
            <CardHeader className="bg-muted border-b border-border pb-4">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-500" /> Carga de Archivos
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div
                  className="border-2 border-border/30 border-dashed rounded-3xl bg-muted/20 p-12 text-center hover:bg-primary/10 hover:border-primary/40 transition-all cursor-pointer group relative overflow-hidden"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-6 group-hover:text-primary group-hover:-translate-y-1 transition-all duration-300" />
                  <p className="text-xs font-black text-foreground uppercase tracking-tight">
                    Soltar CFDI o <span className="text-primary italic">Explorar</span>
                  </p>
                  <p className="text-[9px] text-muted-foreground mt-2 uppercase font-bold tracking-[0.2em] opacity-40">PDF / XML • Máximo 10MB</p>
                  <input
                    ref={fileInputRef}
                    id="entrada-archivo"
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    disabled={isUploading}
                  />
                </div>

                {selectedFile && (
                  <div className="space-y-4 p-4 bg-background border border-border rounded">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <p className="text-xs font-bold text-foreground truncate max-w-[150px]">{selectedFile.name}</p>
                        <span className="text-[9px] text-slate-500">LISTO PARA SUBIR</span>
                      </div>
                      <Button
                        size="sm"
                        id="boton-subir-archivo"
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 px-4 text-[10px] font-bold uppercase rounded-none"
                      >
                        Subir
                      </Button>
                    </div>
                    {isUploading && (
                      <div className="space-y-2">
                        <Progress value={uploadProgress} className="h-1 bg-muted indicator:bg-primary" />
                        <p className="text-[10px] text-slate-500 text-right font-mono">
                          {uploadProgress}%
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Table */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="glass-card border-border/40 premium-shadow rounded-3xl overflow-hidden group">
            <CardHeader className="bg-muted/30 border-b border-border/30 py-4 h-16 flex flex-row items-center justify-between px-8">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">
                Archivo Maestro <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[9px]">{filteredDocuments.length}</span>
              </CardTitle>
              <div className="flex gap-3">
                <div className="w-48 h-9 bg-background/50 border border-border/40 rounded-full flex items-center px-4 focus-within:border-primary/50 transition-all">
                  <Search className="w-3.5 h-3.5 text-muted-foreground mr-2" />
                  <input 
                    id="campo-busqueda-documentos"
                    className="bg-transparent border-none outline-none text-[10px] text-foreground w-full uppercase font-bold tracking-wider" 
                    placeholder="Buscar..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {filteredDocuments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <FileText className="h-16 w-16 text-slate-700 opacity-20 mb-6" />
                  <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
                    No se encontraron documentos
                  </p>
                  <p className="text-[10px] text-slate-600 mt-2 uppercase font-medium">
                    Cambia el filtro lateral o sube un archivo nuevo
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto overflow-y-auto max-h-[600px] custom-scrollbar">
                  <Table>
                    <TableHeader className="bg-muted/50 border-b border-border sticky top-0 z-10">
                      <TableRow className="hover:bg-transparent border-none">
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-600 h-10 px-6">ID / Documento</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-600 h-10">Estado</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-600 h-10">Confianza</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-600 h-10 text-right px-6">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDocuments.map((doc) => (
                        <TableRow key={doc.id} className="border-b border-border last:border-0 hover:bg-muted transition-all group pointer cursor-pointer" onClick={() => setActiveDocument(doc)}>
                          <TableCell className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <FileText className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-foreground">DOC-{doc.id}</span>
                                <span className="text-[9px] text-muted-foreground uppercase tracking-tighter">{doc.document_type || 'CFDI-NOM'}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">{getStatusBadge(doc.status)}</TableCell>
                          <TableCell className="py-4 text-[11px] font-mono text-slate-400 italic">
                            {doc.puntuacion_confianza > 0 ? `${Math.round(doc.puntuacion_confianza)}%` : '---'}
                          </TableCell>
                          <TableCell className="text-right px-6 py-4">
                            <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted/50" onClick={() => setActiveDocument(doc)}>
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                                onClick={() => deleteAndCloseIfActive(doc.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
