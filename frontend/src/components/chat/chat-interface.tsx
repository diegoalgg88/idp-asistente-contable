'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSendMessage, useGetMessages, ChatMessage } from '@/hooks/use-chat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, FileText, X } from 'lucide-react';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router-dom';
import { sanitizeInput } from '@/lib/security';

export function ChatInterface({ conversationId }: { conversationId?: string }) {
  const [searchParams] = useSearchParams();
  const docId = searchParams.get('doc_id');
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { data: history } = useGetMessages(conversationId || '');
  const sendMessage = useSendMessage(conversationId);

  // Local state to show messages immediately
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (history) {
      setLocalMessages(history);
    }
  }, [history]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [localMessages, sendMessage.isPending]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    setLocalMessages((prev) => [...prev, userMsg]);
    
    sendMessage.mutate(input, {
      onSuccess: (assistantMsg) => {
        setLocalMessages((prev) => [...prev, assistantMsg]);
        setInput('');
        toast.success('Mensaje respondido');
      },
      onError: (err) => {
        toast.error('Error al enviar mensaje: ' + err.message);
      }
    });
    setInput('');
  };

  return (
    <Card className="flex flex-col h-[600px] w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center justify-between gap-2 w-full">
          <div className="flex items-center gap-2">
            Asistente Contable IA
            {sendMessage.isPending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </div>
          {docId && (
            <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-600 border-blue-200 py-0 px-2 flex gap-1 items-center">
              <FileText className="h-3 w-3" /> Contexto: ID-{docId}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full p-4" ref={scrollRef}>
          <div className="space-y-4">
            {localMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{msg.role === 'user' ? 'YO' : 'AI'}</AvatarFallback>
                    {msg.role === 'assistant' && <AvatarImage src="/bot-avatar.png" />}
                  </Avatar>
                  <div className={`space-y-2`}>
                    <div className={`rounded-2xl p-3 text-sm ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted border shadow-sm'
                    }`}>
                      {msg.content}
                    </div>
                    
                    {msg.metadata?.sources && msg.metadata.sources.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {msg.metadata.sources.map((src, j) => (
                          <div key={j} className="flex items-center gap-1 text-[10px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full border">
                            <FileText className="h-3 w-3" />
                            {src.filename}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {sendMessage.isPending && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[80%]">
                  <Avatar className="h-8 w-8 animate-pulse">
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="bg-muted border rounded-2xl p-4 flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-foreground/30 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-foreground/30 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-foreground/30 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t bg-muted/20">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex w-full items-center space-x-2"
        >
          <Input
            placeholder="Escribe tu duda contable..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={sendMessage.isPending}
            className="flex-1 bg-background"
          />
          <Button type="submit" size="icon" disabled={!input.trim() || sendMessage.isPending}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
