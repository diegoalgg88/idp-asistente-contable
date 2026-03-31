import { useRef, memo, useMemo } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { cn } from '@/lib/utils'
import type { Message } from '@/types'

interface VirtualizedChatHistoryProps {
  messages: Message[]
  isLoading?: boolean
}

const ChatMessageRow = memo(({ message }: { message: Message }) => {
  const formattedTime = useMemo(() => {
    return new Date(message.created_at).toLocaleTimeString('es-MX', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }, [message.created_at])

  return (
    <div className={cn('flex flex-col gap-2', message.role === 'user' ? 'items-end' : 'items-start')}>
      <div className="flex items-center gap-2 px-1">
        <span className="text-[10px] font-bold uppercase text-slate-500">
          {message.role === 'user' ? 'Tú' : 'Asistente'}
        </span>
      </div>
      <div className={cn(
        'rounded px-3 py-2 text-xs leading-relaxed max-w-[95%] border',
        message.role === 'user'
          ? 'bg-muted border-border text-foreground font-medium'
          : 'bg-background border-border text-foreground'
      )}>
        <div className="whitespace-pre-wrap">{message.content}</div>
        <div className="mt-2 text-[9px] opacity-40">
          {formattedTime}
        </div>
      </div>
    </div>
  )
})

ChatMessageRow.displayName = 'ChatMessageRow'

export function VirtualizedChatHistory({ messages, isLoading }: VirtualizedChatHistoryProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: messages.length + (isLoading ? 1 : 0),
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // Altura estimada por mensaje en pixels
    overscan: 3, // Renderizar 3 mensajes adicionales arriba/abajo
  })

  // Auto-scroll al final cuando hay nuevos mensajes
  const virtualItems = virtualizer.getVirtualItems()
  const lastMessage = virtualItems[virtualItems.length - 1]

  return (
    <div 
      ref={parentRef} 
      className="flex-1 overflow-auto"
      style={{ height: '100%' }}
    >
      <div 
        style={{ 
          height: `${virtualizer.getTotalSize()}px`, 
          width: '100%', 
          position: 'relative' 
        }}
      >
        <div className="p-4 space-y-6">
          {virtualItems.map((virtualItem) => {
            if (virtualItem.index === messages.length && isLoading) {
              // Indicador de carga
              return (
                <div
                  key={virtualItem.key}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  <div className="flex flex-col gap-2 items-start">
                    <span className="text-[10px] font-bold uppercase text-slate-500 px-1">Asistente</span>
                    <div className="bg-background border border-border rounded px-3 py-2">
                      <div className="flex space-x-1.5 pt-1">
                        <div className="w-1 h-1 bg-slate-600 rounded-full animate-bounce" />
                        <div className="w-1 h-1 bg-slate-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1 h-1 bg-slate-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                </div>
              )
            }

            return (
              <div
                key={virtualItem.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <ChatMessageRow message={messages[virtualItem.index]} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
