import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot, Cpu, Zap, Radio } from "lucide-react"

interface Agent {
    id: string
    name: string
    status: 'IDLE' | 'WORKING' | 'AWAITING_HUMAN'
    model: string
}

export function AgentStatus() {
  const agents: Agent[] = [
    { id: "agt-1", name: "Payroll Architect", status: "WORKING", model: "LLaMA-3.3-70B" },
    { id: "agt-2", name: "Fiscal Auditor", status: "AWAITING_HUMAN", model: "GPT-4o" },
    { id: "agt-3", name: "SAT Bot", status: "IDLE", model: "Playwright-Llama" }
  ]

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'WORKING': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'AWAITING_HUMAN': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      default: return 'bg-muted/20 text-muted-foreground border-border/30'
    }
  }

  return (
    <Card className="glass-card border-border/40 overflow-hidden h-full">
      <CardHeader className="pb-2 bg-primary/5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <Bot className="w-4 h-4 text-primary" />
            Active Neural Agents
          </CardTitle>
          <div className="flex gap-1">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse delay-75" />
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse delay-150" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {agents.map((agent) => (
          <div key={agent.id} className="relative group p-4 rounded-xl bg-background/40 border border-border/10 hover:border-primary/20 transition-all">
            <div className="flex items-center justify-between mb-3">
               <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-background/60 border border-border/20 group-hover:bg-primary/5 transition-colors">
                     <Cpu className="w-4 h-3 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-foreground">{agent.name}</h4>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{agent.model}</span>
                  </div>
               </div>
               <Badge className={`${getStatusColor(agent.status)} text-[9px] font-black border uppercase px-2 py-0.5`}>
                 {agent.status.replace('_', ' ')}
               </Badge>
            </div>
            
            {agent.status === 'WORKING' && (
              <div className="flex items-center gap-2 mt-2">
                 <Zap className="w-3 h-3 text-yellow-500 animate-bounce" />
                 <div className="h-1 flex-1 bg-muted/20 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[65%] animate-[pulse_2s_infinite]" />
                 </div>
                 <span className="text-[9px] font-bold text-primary italic">65%</span>
              </div>
            )}
            
            {agent.status === 'IDLE' && (
              <div className="flex items-center gap-2 mt-2">
                 <Radio className="w-3 h-3 text-muted-foreground opacity-30" />
                 <span className="text-[9px] font-bold text-muted-foreground italic uppercase">Standby...</span>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
