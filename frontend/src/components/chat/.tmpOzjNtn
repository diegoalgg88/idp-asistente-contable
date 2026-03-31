import { useState, useCallback, useEffect, useRef } from 'react'
import { Trash2, MessageSquare, Search, X, Calendar, Clock, Keyboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useChatStore } from '@/store/chat.store'
import { toast } from 'sonner'

interface ConversationHistoryProps {
  onSelectConversation?: (id: string) => void
}

export function ConversationHistory({ onSelectConversation }: ConversationHistoryProps) {
  const { conversations, fetchHistory, deleteConversation, selectedConversation, setSelectedConversation } = useChatStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isBulkDelete, setIsBulkDelete] = useState(false)
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
      
      // Delete key to delete selected conversation
      if (e.key === 'Delete' && selectedConversation) {
        e.preventDefault()
        setConversationToDelete(selectedConversation)
        setIsBulkDelete(false)
        setDeleteDialogOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedConversation])

  // Filter conversations by search term AND valid ID
  const filteredConversations = conversations.filter(conv => {
    // Filter out conversations without valid ID
    if (!conv.id) {
      console.warn('Conversation without ID detected:', conv)
      return false
    }
    return (conv.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  })

  // Get valid conversations count for badge
  const validConversationsCount = conversations.filter(c => c.id && c.id !== 'undefined').length

  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Hoy'
    if (diffDays === 1) return 'Ayer'
    if (diffDays < 7) return `Hace ${diffDays} días`
    return date.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })
  }

  // Handle delete conversation click
  const handleDeleteClick = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (!id) {
      console.error('Attempted to delete conversation with undefined ID')
      toast.error('ID de conversación inválido')
      return
    }
    setConversationToDelete(id)
    setIsBulkDelete(false)
    setDeleteDialogOpen(true)
  }, [])

  // Handle bulk delete
  const handleBulkDeleteClick = useCallback(() => {
    setIsBulkDelete(true)
    setConversationToDelete(null)
    setDeleteDialogOpen(true)
  }, [])

  const confirmDelete = useCallback(async () => {
    try {
      if (isBulkDelete) {
        // Delete all conversations - VALIDAR QUE TENGAN ID
        setIsDeleting(true)
        const validConversations = conversations.filter(conv => conv.id)
        
        if (validConversations.length === 0) {
          toast.error('No hay conversaciones válidas para eliminar')
          setDeleteDialogOpen(false)
          return
        }
        
        const deletePromises = validConversations.map(conv => deleteConversation(conv.id))
        await Promise.all(deletePromises)
        toast.success(`Se eliminaron ${validConversations.length} conversaciones`)
      } else if (conversationToDelete) {
        // Delete single conversation
        setIsDeleting(true)
        await deleteConversation(conversationToDelete)
        toast.success('Conversación eliminada')
      }
      setDeleteDialogOpen(false)
      setConversationToDelete(null)
    } catch (error) {
      console.error('Error deleting conversation:', error)
      toast.error(isBulkDelete ? 'Error al eliminar conversaciones' : 'Error al eliminar conversación')
    } finally {
      setIsDeleting(false)
    }
  }, [conversationToDelete, isBulkDelete, conversations, deleteConversation])

  const handleSelectConversation = useCallback((id: string) => {
    setSelectedConversation(id)
    onSelectConversation?.(id)
  }, [setSelectedConversation, onSelectConversation])

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted/50 relative"
          >
            <MessageSquare className="h-4 w-4" />
            {validConversationsCount > 0 && (
              <Badge 
                variant="secondary" 
                className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-[8px] bg-primary text-primary-foreground"
              >
                {validConversationsCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 bg-card border-border p-0" sideOffset={5}>
          {/* Header */}
          <div className="p-3 border-b border-border bg-muted/30">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <MessageSquare className="h-3 w-3" />
                Historial de Chat
              </h3>
              <Badge variant="outline" className="text-[9px] h-5 gap-1">
                <Keyboard className="h-2.5 w-2.5" />
                {validConversationsCount} {validConversationsCount === 1 ? 'conv' : 'convs'}
              </Badge>
            </div>
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                placeholder="Buscar conversaciones... (Ctrl+K)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 pl-7 text-xs bg-background border-border/50 focus:border-primary/50"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 hover:bg-transparent"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Conversation List */}
          <ScrollArea className="h-[300px]">
            {filteredConversations.length === 0 && validConversationsCount === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">
                  {searchTerm ? 'No se encontraron conversaciones' : 'Sin conversaciones aún'}
                </p>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <Search className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">
                  No hay resultados para "{searchTerm}"
                </p>
              </div>
            ) : (
              <div className="py-2">
                {filteredConversations.map((conv) => (
                  <DropdownMenuItem
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`
                      flex flex-col items-start gap-1 px-3 py-2.5 m-1 rounded-md cursor-pointer
                      transition-all duration-200
                      ${selectedConversation === conv.id 
                        ? 'bg-primary/10 border border-primary/30' 
                        : 'hover:bg-muted/50 border border-transparent'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <MessageSquare className={`h-3.5 w-3.5 shrink-0 ${selectedConversation === conv.id ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className={`text-xs truncate font-medium ${selectedConversation === conv.id ? 'text-primary' : 'text-foreground'}`}>
                          {conv.title || 'Sin título'}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 transition-all"
                        onClick={(e) => handleDeleteClick(e, conv.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-3 pl-5">
                      <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                        <Calendar className="h-2.5 w-2.5" />
                        <span>{formatDate(conv.created_at)}</span>
                      </div>
                      {conv.updated_at !== conv.created_at && (
                        <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                          <Clock className="h-2.5 w-2.5" />
                          <span>Actualizado</span>
                        </div>
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Footer Actions */}
          {validConversationsCount > 0 && (
            <>
              <div className="p-2 border-t border-border bg-muted/20">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-7 text-[9px] border-destructive/50 text-destructive hover:bg-destructive/10"
                  onClick={handleBulkDeleteClick}
                  disabled={validConversationsCount === 0}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Eliminar todas ({validConversationsCount})
                </Button>
              </div>
              {/* Keyboard Shortcuts Hint */}
              <div className="px-3 py-2 border-t border-border bg-muted/10">
                <div className="flex items-center justify-between text-[8px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-background border border-border rounded text-[7px]">Ctrl+K</kbd>
                    Buscar
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-background border border-border rounded text-[7px]">Supr</kbd>
                    Eliminar
                  </span>
                </div>
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              {isBulkDelete 
                ? `Eliminar ${conversations.length} Conversaciones` 
                : 'Eliminar Conversación'}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-2">
              {isBulkDelete
                ? `Esta acción no se puede deshacer. Se eliminarán permanentemente las ${conversations.length} conversaciones y todos sus mensajes.`
                : 'Esta acción no se puede deshacer. Se eliminará permanentemente esta conversación y todos sus mensajes.'
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setConversationToDelete(null)
              }}
              className="text-xs"
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="text-xs"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <span className="animate-spin mr-1">⏳</span>
                  {isBulkDelete ? 'Eliminando...' : 'Eliminando...'}
                </>
              ) : (
                <>
                  <Trash2 className="h-3 w-3 mr-1" />
                  {isBulkDelete ? 'Eliminar Todas' : 'Eliminar'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
