import { useRef, memo } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { FileText, Eye, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Document as IDPDocument, DocumentStatus } from '@/types'

interface VirtualizedDocumentListProps {
  documents: IDPDocument[]
  onDocumentClick: (doc: IDPDocument) => void
  onDocumentDelete: (id: string) => void
  getStatusBadge: (status: DocumentStatus) => React.ReactNode
}

const DocumentRow = memo(({ 
  doc, 
  onDocumentClick, 
  onDocumentDelete,
  getStatusBadge 
}: { 
  doc: IDPDocument
  onDocumentClick: (doc: IDPDocument) => void
  onDocumentDelete: (id: string) => void
  getStatusBadge: (status: DocumentStatus) => React.ReactNode
}) => {
  return (
    <tr 
      className="border-b border-border last:border-0 hover:bg-muted transition-all group pointer cursor-pointer" 
      onClick={() => onDocumentClick(doc)}
    >
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
        {doc.confidence_score > 0 ? `${Math.round(doc.confidence_score)}%` : '---'}
      </TableCell>
      <TableCell className="text-right px-6 py-4">
        <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted/50" 
            onClick={() => onDocumentClick(doc)}
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
            onClick={() => onDocumentDelete(doc.id.toString())}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </TableCell>
    </tr>
  )
})

DocumentRow.displayName = 'DocumentRow'

// Componente TableCell para consistencia
const TableCell = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <td className={className}>{children}</td>
)

export function VirtualizedDocumentList({
  documents,
  onDocumentClick,
  onDocumentDelete,
  getStatusBadge,
}: VirtualizedDocumentListProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: documents.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64, // Altura estimada por fila en pixels
    overscan: 5, // Renderizar 5 filas adicionales arriba/abajo
  })

  return (
    <div 
      ref={parentRef} 
      className="overflow-x-auto overflow-y-auto max-h-[600px] custom-scrollbar"
    >
      <div 
        style={{ 
          height: `${virtualizer.getTotalSize()}px`, 
          width: '100%', 
          position: 'relative' 
        }}
      >
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border sticky top-0 z-10">
            <tr className="hover:bg-transparent border-none">
              <th className="text-[10px] font-black uppercase tracking-widest text-slate-600 h-10 px-6 text-left">ID / Documento</th>
              <th className="text-[10px] font-black uppercase tracking-widest text-slate-600 h-10 text-left">Estado</th>
              <th className="text-[10px] font-black uppercase tracking-widest text-slate-600 h-10 text-left">Confianza</th>
              <th className="text-[10px] font-black uppercase tracking-widest text-slate-600 h-10 text-right px-6">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {virtualizer.getVirtualItems().map((virtualItem) => (
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
                <DocumentRow
                  doc={documents[virtualItem.index]}
                  onDocumentClick={onDocumentClick}
                  onDocumentDelete={onDocumentDelete}
                  getStatusBadge={getStatusBadge}
                />
              </div>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
