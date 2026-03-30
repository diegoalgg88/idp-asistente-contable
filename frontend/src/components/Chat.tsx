import { useState, useRef, useEffect, forwardRef, useCallback } from 'react'
import { Send, Bot, Trash2, Activity, X, FileText, Database, MessageSquare, Sparkles, Zap, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useChatStore } from '@/store/chat.store'
import { idpService } from '@/services/api'
import { ConversationHistory } from './chat/conversation-history'

interface ChatProps {
  isEmbedded?: boolean
  onClose?: () => void
}

interface MCPTool {
  name: string
  description: string
  enabled: boolean
}

const models = [
  { id: 'llama-3.3-70b', name: 'Llama 3.3 70B (Instruct)', icon: '🟢', status: 'Active' },
  { id: 'llama-3.2-90b', name: 'Llama 3.2 90B (Vision)', icon: '👁️', status: 'Vision' },
  { id: 'nemoretriever', name: 'Nemo Retriever OCR', icon: '🔍', status: 'Tool' },
]

const mcpTools: MCPTool[] = [
  { name: 'RAG Legal', description: 'Búsqueda en legislación fiscal', enabled: true },
  { name: 'CFDI Validator', description: 'Validación de comprobantes', enabled: true },
  { name: 'SAT 69-B', description: 'Lista negra EFOs', enabled: true },
  { name: 'IMSS Calculator', description: 'Cálculo de cuotas', enabled: false },
  { name: 'ISR Calculator', description: 'Cálculo de impuestos', enabled: true },
]

const Chat = forwardRef<HTMLDivElement, ChatProps>(({ isEmbedded = true, onClose }, ref) => {
  const [input, setInput] = useState('')
  const [showTools, setShowTools] = useState(false)
  const [tools, setTools] = useState<MCPTool[]>(mcpTools)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeWorkflow, setActiveWorkflow] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const {
    messages,
    isSending,
    sendMessage,
    conversations,
    fetchHistory,
    deleteConversation,
    isConnected,
    selectedModel,
    setSelectedModel,
    contextItems,
    addContextItem,
    removeContextItem
  } = useChatStore()

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Auto-focus textarea
  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isSending) return

    try {
      if (input.toLowerCase().includes('declaración')) {
        setActiveWorkflow('Analizando RFC y periodos fiscales')
        setTimeout(() => setActiveWorkflow('Extrayendo CFDI vinculados'), 2000)
        setTimeout(() => setActiveWorkflow('Validando contra reglas del SAT'), 4000)
        setTimeout(() => setActiveWorkflow(null), 6000)
      }
      await sendMessage(input)
      setInput('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }, [input, isSending, sendMessage])

  const handleDeleteConversation = useCallback(async (conversationId: string) => {
    try {
      await deleteConversation(conversationId)
    } catch (error) {
      console.error('Error deleting conversation:', error)
    }
  }, [deleteConversation])

  const handleModelSelect = useCallback((model: typeof models[0]) => {
    setSelectedModel(model)
  }, [])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }, [])

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }, [handleSubmit])

  const handleFileClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const response = await idpService.processDocument(file)
        addContextItem(response.document_id)
      } catch (error) {
        console.error('Error uploading file:', error)
      }
    }
  }, [addContextItem])

  const handleContextClick = useCallback((item: string) => {
    addContextItem(item)
    if (!input.includes(`@${item}`)) {
      setInput(prev => `${prev} @${item} `)
    }
  }, [input, addContextItem])

  const toggleTool = useCallback((toolName: string) => {
    setTools(prev => prev.map(t => 
      t.name === toolName ? { ...t, enabled: !t.enabled } : t
    ))
  }, [])

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div ref={ref} className="flex flex-col h-full bg-card text-foreground select-text">
      {/* Header */}
      <div className="h-9 px-4 border-b border-border flex items-center justify-between shrink-0 bg-muted/20">
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">Agente Fiscal</span>
          {isConnected !== undefined && (
            <Badge variant="outline" className={`h-4 px-1 text-[9px] uppercase border-none ${isConnected ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>
              <div className={`w-1.5 h-1.5 rounded-full mr-1 ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              {isConnected ? 'Conectado' : 'Desconectado'}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1">
          <ConversationHistory />
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-muted/50"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area - Professional Chat Layout */}
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 opacity-60">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-tight">Bienvenido al Agente Fiscal</h3>
            <p className="text-[10px] text-muted-foreground max-w-[200px] leading-relaxed">
              Puedo ayudarte con cualquier consulta sobre contabilidad y fiscalidad mexicana.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 max-w-sm">
            {['¿Cuál es mi saldo mensual?', 'Analizar @Ultimo_Doc', 'Calcular PTU 2026'].map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                className="text-[9px] h-7 px-3 rounded-full border-border/50 hover:bg-primary/5 hover:text-primary transition-all"
                onClick={() => setInput(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={msg.id || idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start gap-2 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user' 
                    ? 'bg-primary/20 border border-primary/30' 
                    : 'bg-blue-500/20 border border-blue-500/30'
                }`}>
                  {msg.role === 'user' ? (
                    <span className="text-xs font-bold text-primary">TÚ</span>
                  ) : (
                    <Bot className="w-4 h-4 text-blue-400" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`group relative rounded-2xl px-4 py-2.5 ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                    : 'bg-muted border border-border rounded-bl-sm'
                }`}>
                  {/* Sender Name */}
                  <div className={`text-[9px] font-bold uppercase tracking-wider mb-1 ${
                    msg.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {msg.role === 'user' ? 'Tú' : 'Asistente'}
                  </div>

                  {/* Message Content */}
                  <div className="text-xs leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </div>

                  {/* Timestamp */}
                  <div className={`text-[8px] mt-1.5 ${
                    msg.role === 'user' ? 'text-primary-foreground/50' : 'text-muted-foreground'
                  }`}>
                    {formatTime(msg.created_at)}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Workflow Indicator */}
          {activeWorkflow && (
            <div className="mx-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500 animate-pulse shrink-0" />
              <span className="text-xs text-blue-400">{activeWorkflow}</span>
            </div>
          )}
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-card space-y-2">
        {/* Model & Tools Bar */}
        <div className="flex items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-6 px-2 text-[9px] text-muted-foreground hover:text-foreground hover:bg-muted/50 flex items-center gap-1.5 rounded-none border border-border bg-background">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                {selectedModel.name}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top" className="w-56 bg-card border-border text-foreground">
              <p className="px-2 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">AI Provider / Model</p>
              {models.map((model) => (
                <DropdownMenuItem
                  key={model.id}
                  onClick={() => setSelectedModel(model)}
                  className="flex items-center justify-between text-xs hover:bg-[#37373d] focus:bg-[#37373d] cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    {model.icon && <span className="text-[10px]">{model.icon}</span>}
                    <span>{model.name}</span>
                  </div>
                  {model.status && <Badge variant="secondary" className="text-[8px] h-3 px-1 bg-slate-700 text-slate-300">{model.status}</Badge>}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Tool Calling Toggle Button */}
          <DropdownMenu open={showTools} onOpenChange={setShowTools}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className={`h-6 px-2 text-[9px] border-blue-900/30 flex items-center gap-1.5 ${
                  tools.some(t => t.enabled) 
                    ? 'text-blue-400 bg-blue-500/10 hover:bg-blue-500/20' 
                    : 'text-slate-500 hover:text-slate-400'
                }`}
              >
                <Wrench className={`h-3 w-3 ${tools.some(t => t.enabled) ? 'animate-pulse' : ''}`} />
                <span className="uppercase font-black">Tools: {tools.filter(t => t.enabled).length}/{tools.length}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top" className="w-64 bg-card border-border text-foreground p-0">
              <div className="p-2 border-b border-border bg-muted/20">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3" />
                  MCP Tools Disponibles
                </p>
              </div>
              <div className="max-h-[200px] overflow-y-auto">
                {tools.map((tool) => (
                  <DropdownMenuItem
                    key={tool.name}
                    onClick={(e) => {
                      e.preventDefault()
                      toggleTool(tool.name)
                    }}
                    className="flex items-center justify-between px-3 py-2 hover:bg-[#37373d] cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">{tool.name}</p>
                      <p className="text-[8px] text-muted-foreground truncate">{tool.description}</p>
                    </div>
                    <div className={`w-8 h-4 rounded-full relative transition-colors ${
                      tool.enabled ? 'bg-blue-500' : 'bg-slate-600'
                    }`}>
                      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
                        tool.enabled ? 'right-0.5' : 'left-0.5'
                      }`} />
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <div className="p-2 bg-muted/20">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full h-6 text-[8px]"
                  onClick={() => setTools(tools.map(t => ({ ...t, enabled: true })))}
                >
                  <Zap className="h-3 w-3 mr-1" />
                  Activar todas
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Context Items */}
        {contextItems.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {contextItems.map((item, idx) => (
              <Badge 
                key={idx} 
                variant="secondary" 
                className="h-5 text-[8px] bg-blue-500/10 text-blue-400 border-blue-500/20 flex items-center gap-1"
              >
                @{item}
                <X className="h-2 w-2 cursor-pointer hover:text-white" onClick={() => removeContextItem(item)} />
              </Badge>
            ))}
          </div>
        )}

        {/* Text Input */}
        <form onSubmit={handleSubmit} className="flex flex-col bg-background border border-border focus-within:border-primary transition-all overflow-hidden rounded-sm">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            placeholder="Escribe un comando o usa @ para referenciar documentos..."
            disabled={isSending}
            rows={2}
            className="w-full bg-transparent border-none focus:ring-0 text-xs p-3 placeholder:text-slate-500 transition-all text-foreground resize-none scroll-auto"
            onKeyDown={handleInputKeyDown}
          />

          <div className="h-9 px-2 flex items-center justify-between bg-muted/20 border-t border-border">
            <div className="flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-white hover:bg-white/5">
                    <div className="h-4 w-4 rounded-full border border-slate-600 flex items-center justify-center text-sm font-bold leading-none">+</div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" side="top" className="w-48 bg-card border-border text-foreground py-1 shadow-2xl">
                  <DropdownMenuItem onClick={handleFileClick} className="flex items-center gap-3 py-2 px-3 hover:bg-white/5 cursor-pointer">
                    <FileText className="h-3.5 w-3.5" /> <span className="text-[10px] uppercase font-bold">Adjuntar CFDI</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleContextClick('Ultima_Factura')} className="flex items-center gap-3 py-2 px-3 hover:bg-white/5 cursor-pointer">
                    <span className="text-[11px] font-bold opacity-60 w-3.5 text-center">@</span>
                    <span className="text-[10px] uppercase font-bold">Referencia Contexto</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-blue-400" onClick={() => setInput(p => p + ' @')}>
                <span className="text-sm font-black italic">@</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <p className="text-[9px] text-slate-600 uppercase font-bold">Shift+Enter para nueva línea</p>
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                className="h-7 px-3 flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-30 disabled:grayscale transition-all rounded-none text-[9px] font-black uppercase"
              >
                <Send className="h-3 w-3" /> {isSending ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-2 flex items-center justify-center gap-3 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-default">
          <span className="text-[8px] font-black text-slate-500 uppercase flex items-center gap-1">
            <Database className="h-2 w-2" /> Knowledge base V2.1
          </span>
          <span className="text-[8px] font-black text-slate-500 uppercase flex items-center gap-1">
            <Bot className="h-2 w-2" /> Agentic-Loop
          </span>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept=".xml,.pdf"
      />
    </div>
  )
})

Chat.displayName = 'Chat'
export default Chat
