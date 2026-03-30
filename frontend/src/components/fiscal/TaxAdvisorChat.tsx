import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Send, Bot, User, Bookmark, ExternalLink } from "lucide-react"

export function TaxAdvisorChat() {
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hola, soy tu asesor fiscal experto. ¿En qué puedo ayudarte hoy con respecto a la normativa 2026?' }
  ])

  const handleSend = () => {
    if (!query) return
    const newMessages = [...messages, { role: 'user', text: query }]
    setMessages(newMessages)
    setQuery('')
    
    // Simulate RAG Response
    setTimeout(() => {
        setMessages([...newMessages, { 
            role: 'assistant', 
            text: 'Analizando las investigaciones técnicas (06-calculo-isr-iva.md)... Basado en el SAT 2026, el régimen RESICO para Personas Físicas mantiene su tasa preferencial hasta el tope de 3.5 MDP. ¿Deseas ver el desglose del cálculo?' 
        }])
    }, 1000)
  }

  return (
    <Card className="glass-card border-border/40 h-[600px] flex flex-col overflow-hidden">
      <CardHeader className="bg-primary/5 border-b border-border/20 py-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="p-2 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                  <Sparkles className="w-4 h-4" />
               </div>
               <div>
                  <CardTitle className="text-sm font-black uppercase tracking-tight">Technical Tax Advisor</CardTitle>
                  <p className="text-[10px] font-bold text-primary/70 uppercase tracking-widest">Powered by RAG Engine v2.0</p>
               </div>
            </div>
            <div className="flex gap-1">
               <Badge variant="outline" className="text-[8px] font-black uppercase border-primary/30">NIF 2026</Badge>
               <Badge variant="outline" className="text-[8px] font-black uppercase border-primary/30">LISR v12</Badge>
            </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full p-6">
          <div className="space-y-6">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                 <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${
                    m.role === 'assistant' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-muted border-border/40'
                 }`}>
                    {m.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                 </div>
                 <div className={`max-w-[80%] p-4 rounded-2xl text-xs font-medium leading-relaxed ${
                    m.role === 'assistant' ? 'bg-background/80 border border-border/20' : 'bg-primary text-primary-foreground'
                 }`}>
                    {m.text}
                 </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="p-4 bg-muted/30 border-t border-border/20">
         <div className="relative w-full">
            <Input 
               placeholder="Escribe tu duda fiscal aquí..." 
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSend()}
               className="bg-background/80 border-border/40 pr-24 h-12 font-medium"
            />
            <div className="absolute right-2 top-1.5 flex gap-1">
               <Button size="icon" variant="ghost" className="h-9 w-9 text-muted-foreground"><Bookmark className="w-4 h-4" /></Button>
               <Button size="icon" className="h-9 w-9 shadow-lg shadow-primary/20" onClick={handleSend}><Send className="w-4 h-4" /></Button>
            </div>
         </div>
      </CardFooter>
      
      <div className="px-6 py-3 bg-primary/5 border-t border-border/10 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-60">Fuentes Técnicas:</span>
            <Badge variant="ghost" className="text-[8px] font-black uppercase text-primary/60 flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
               06-calculo-isr-iva.md <ExternalLink className="w-2.5 h-2.5" />
            </Badge>
         </div>
         <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest italic">Validación: 98% Confidence</span>
      </div>
    </Card>
  )
}
