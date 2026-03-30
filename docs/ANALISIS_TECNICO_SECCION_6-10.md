# 📊 Análisis Técnico Exhaustivo - Sección 6-10
## IDP-App - Asistente Contable con IA para México

**Fecha:** 10 de marzo de 2026  
**Versión:** 1.0  
**Complemento de:** `ANALISIS_TECNICO_EXHAUSTIVO.md`

---

## 6. Especificación de UI/UX Detallada

### 6.1 Dashboard de Conciliación Bancaria

#### Wireframe ASCII

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  CONCILIACIÓN BANCARIA                                                      [Ayuda] [X] │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  🏦 Cuenta: [BBVA Bancomer ▼]  Periodo: [01/03/2026 - 31/03/2026]  [📅 Cambiar]        │
│                                                                                         │
│  ┌───────────────────────────────────────────────────────────────────────────────────┐ │
│  │ 📤 SUBIR ESTADO DE CUENTA                                                         │ │
│  │                                                                                   │ │
│  │  ┌─────────────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                                                                               │ │ │
│  │  │          📥 Arrastra tu estado de cuenta aquí                                 │ │ │
│  │  │                  o haz clic para explorar                                     │ │ │
│  │  │                                                                               │ │ │
│  │  │           Formatos: PDF, CSV, XLSX (Máx. 10 MB)                              │ │ │
│  │  │                                                                               │ │ │
│  │  └─────────────────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                                   │ │
│  │  [📊 Ver estados de cuenta anteriores]                                            │ │
│  └───────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                         │
│  ┌───────────────────────────────────────────────────────────────────────────────────┐ │
│  │ 📊 RESUMEN DE CONCILIACIÓN                                                        │ │
│  │                                                                                   │ │
│  │  Total transacciones: 127  │  Matcheadas: 108 (85.0%)  │  Pendientes: 19         │ │
│  │                                                                                   │ │
│  │  ████████████████████████████████████████░░░░░░░░░░░░░░░░░░░░░░  85%              │ │
│  │                                                                                   │ │
│  │  [✅ Exactas: 85]  [🔍 Fuzzy: 18]  [🤖 LLM: 5]  [⚠️ Por revisar: 19]             │ │
│  └───────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                         │
│  ┌───────────────────────────────────────────────────────────────────────────────────┐ │
│  │ 🔍 FILTROS  [Tipo: Todos ▼]  [Confianza: Todas ▼]  [Proveedor: Todos ▼]  [🔍]    │ │
│  ├───────────────────────────────────────────────────────────────────────────────────┤ │
│  │                                                                                   │ │
│  │  ┌──┬──────────────┬─────────────────────────┬──────────────────┬────────┬───────┐│ │
│  │  │☐ │ Fecha        │ Descripción Banco       │ Documento Match  │ Conf.  │ Acc.  ││ │
│  │  ├──┼──────────────┼─────────────────────────┼──────────────────┼────────┼───────┤│ │
│  │  │☐ │ 2026-03-01   │ AMAZON MKTPLACE MEX     │ FAC-001234       │  95% ✅│ ✅ ❌ ││ │
│  │  │  │              │                         │ Amazon México    │ Exact  │       ││ │
│  │  │  │              │                         │ $1,250.00 MXN    │        │       ││ │
│  │  ├──┼──────────────┼─────────────────────────┼──────────────────┼────────┼───────┤│ │
│  │  │☐ │ 2026-03-02   │ PAGO SERVICIOS CFE      │ FAC-001235       │  88% 🔍│ ✅ ❌ ││ │
│  │  │  │              │                         │ CFE              │ Fuzzy  │       ││ │
│  │  │  │              │                         │ $850.50 MXN      │        │       ││ │
│  │  ├──┼──────────────┼─────────────────────────┼──────────────────┼────────┼───────┤│ │
│  │  │☐ │ 2026-03-03   │ TRANSFERENCIA SPEI      │ FAC-001236       │  82% 🤖│ ✅ ❌ ││ │
│  │  │  │              │                         │ Honorarios       │ LLM    │       ││ │
│  │  │  │              │                         │ $15,000.00 MXN   │        │       ││ │
│  │  ├──┼──────────────┼─────────────────────────┼──────────────────┼────────┼───────┤│ │
│  │  │☐ │ 2026-03-04   │ COMISION BANCARIA       │ -                │  0% ⚠️ │ 🔍   ││ │
│  │  │  │              │                         │ Sin factura      │ -      │       ││ │
│  │  │  │              │                         │ $150.00 MXN      │        │       ││ │
│  │  └──┴──────────────┴─────────────────────────┴──────────────────┴────────┴───────┘│ │
│  │                                                                                   │ │
│  │  Mostrando 1-5 de 127 transacciones  [< Ant] [1] [2] [3] [4] [5] [Sig >]         │ │
│  │                                                                                   │ │
│  └───────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                         │
│  ┌───────────────────────────────────────────────────────────────────────────────────┐ │
│  │ ⚠️ ALERTAS DE FALTANTES                                                           │ │
│  │                                                                                   │ │
│  │  📄 Facturas sin pago: 12  │  💰 Pagos sin factura: 7                            │ │
│  │                                                                                   │ │
│  │  [Ver facturas sin pago >]  [Ver pagos sin factura >]                            │ │
│  └───────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                         │
│  [💾 Guardar borrador]  [📤 Exportar reporte]  [✅ Cerrar conciliación]                │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Componentes Shadcn/UI

```typescript
// frontend/src/components/reconciliation/ReconciliationDashboard.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { FileUpload } from '@/components/ui/file-upload'; // shadcn extended
import { MatchStatus, MatchType } from '@/services/reconciliation.service';

// Estados de la UI
type UIState = 'loading' | 'success' | 'error' | 'empty' | 'processing';

// Componente principal
export function ReconciliationDashboard() {
  const [uiState, setUiState] = useState<UIState>('empty');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [period, setPeriod] = useState({ start: '', end: '' });
  const [matches, setMatches] = useState<Match[]>([]);
  const [filters, setFilters] = useState({
    type: 'all',
    confidence: 'all',
    provider: 'all',
  });

  // Calcular estadísticas
  const stats = useMemo(() => {
    const total = matches.length;
    const matched = matches.filter(m => m.match_status === 'confirmed').length;
    const rate = total > 0 ? matched / total : 0;
    
    const byType = {
      exact: matches.filter(m => m.match_type === 'exact').length,
      fuzzy: matches.filter(m => m.match_type === 'fuzzy').length,
      llm: matches.filter(m => m.match_type === 'llm_validated').length,
      pending: matches.filter(m => m.match_status === 'pending').length,
    };
    
    return { total, matched, rate, byType };
  }, [matches]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Conciliación Bancaria</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <HelpCircle className="w-4 h-4 mr-2" />
            Ayuda
          </Button>
        </div>
      </div>

      {/* Selector de cuenta y periodo */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cuenta Bancaria</label>
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Seleccionar cuenta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bbva">BBVA Bancomer</SelectItem>
                  <SelectItem value="banamex">Banamex</SelectItem>
                  <SelectItem value="santander">Santander</SelectItem>
                  <SelectItem value="scotiabank">Scotiabank</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Periodo</label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[150px]">
                      {period.start || 'Fecha inicial'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      value={new Date(period.start)}
                      onChange={(date) => setPeriod({ ...period, start: date.toISOString() })}
                    />
                  </PopoverContent>
                </Popover>
                
                <span className="text-2xl">-</span>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[150px]">
                      {period.end || 'Fecha final'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      value={new Date(period.end)}
                      onChange={(date) => setPeriod({ ...period, end: date.toISOString() })}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <Button onClick={handleLoadStatements}>
              Cargar Estado de Cuenta
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload de estado de cuenta */}
      {uiState === 'empty' && (
        <Card>
          <CardHeader>
            <CardTitle>📤 Subir Estado de Cuenta</CardTitle>
          </CardHeader>
          <CardContent>
            <FileUpload
              accept={{
                'application/pdf': ['.pdf'],
                'text/csv': ['.csv'],
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
                'application/vnd.ms-excel': ['.xls'],
              }}
              maxSize={10 * 1024 * 1024} // 10 MB
              onUpload={handleUpload}
            >
              <div className="text-center py-12">
                <UploadCloud className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium">
                  Arrastra tu estado de cuenta aquí
                </p>
                <p className="text-sm text-muted-foreground">
                  o haz clic para explorar
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Formatos: PDF, CSV, XLSX (Máx. 10 MB)
                </p>
              </div>
            </FileUpload>
            
            <Button variant="link" onClick={handleViewPrevious}>
              📊 Ver estados de cuenta anteriores
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Resumen de conciliación */}
      {uiState === 'success' && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>📊 Resumen de Conciliación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total transacciones</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Matcheadas</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.matched} ({(stats.rate * 100).toFixed(1)}%)
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pendientes</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {stats.total - stats.matched}
                  </p>
                </div>
              </div>
              
              <Progress value={stats.rate * 100} className="mt-4" />
              
              <div className="flex gap-2 mt-4">
                <Badge variant="secondary">✅ Exactas: {stats.byType.exact}</Badge>
                <Badge variant="secondary">🔍 Fuzzy: {stats.byType.fuzzy}</Badge>
                <Badge variant="secondary">🤖 LLM: {stats.byType.llm}</Badge>
                <Badge variant="destructive">⚠️ Por revisar: {stats.byType.pending}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Tabla de matches */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>🔍 Matches Sugeridos</CardTitle>
                <div className="flex gap-2">
                  <Select value={filters.type} onValueChange={(v) => setFilters({ ...filters, type: v })}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="exact">Exactos</SelectItem>
                      <SelectItem value="fuzzy">Fuzzy</SelectItem>
                      <SelectItem value="llm">LLM</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filters.confidence} onValueChange={(v) => setFilters({ ...filters, confidence: v })}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Confianza" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="high">&gt;90%</SelectItem>
                      <SelectItem value="medium">70-90%</SelectItem>
                      <SelectItem value="low">&lt;70%</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Input
                    placeholder="Buscar proveedor..."
                    className="w-[200px]"
                    onChange={(e) => setFilters({ ...filters, provider: e.target.value })}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Descripción Banco</TableHead>
                    <TableHead>Documento Match</TableHead>
                    <TableHead>Confianza</TableHead>
                    <TableHead className="w-[100px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMatches.map((match) => (
                    <TableRow key={match.id}>
                      <TableCell>
                        <Checkbox
                          checked={match.match_status === 'confirmed'}
                          onCheckedChange={() => handleConfirmMatch(match.id)}
                        />
                      </TableCell>
                      <TableCell>
                        {formatDate(match.bank_transaction.transaction_date)}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {match.bank_transaction.description}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{match.document.nombre_documento}</p>
                          <p className="text-sm text-muted-foreground">
                            {match.document.proveedor}
                          </p>
                          <p className="text-sm font-mono">
                            ${formatMoney(match.document.total_amount)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getConfidenceIcon(match.match_type)}
                          <span className={getConfidenceColor(match.confidence_score)}>
                            {(match.confidence_score * 100).toFixed(0)}%
                          </span>
                          <Badge variant={getMatchTypeBadge(match.match_type)}>
                            {getMatchTypeLabel(match.match_type)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleConfirmMatch(match.id)}
                          >
                            <Check className="w-4 h-4 text-green-600" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRejectMatch(match.id)}
                          >
                            <X className="w-4 h-4 text-red-600" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewDocument(match.document_id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {/* Paginación */}
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-muted-foreground">
                  Mostrando 1-{Math.min(5, filteredMatches.length)} de {filteredMatches.length} transacciones
                </p>
                <Pagination>
                  <PaginationPrevious href="#" />
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                  </PaginationContent>
                  <PaginationNext href="#" />
                </Pagination>
              </div>
            </CardContent>
          </Card>

          {/* Alertas de faltantes */}
          <Card>
            <CardHeader>
              <CardTitle>⚠️ Alertas de Faltantes</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="invoices">
                <TabsList>
                  <TabsTrigger value="invoices">
                    📄 Facturas sin pago ({missingInvoices.length})
                  </TabsTrigger>
                  <TabsTrigger value="payments">
                    💰 Pagos sin factura ({unmatchedPayments.length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="invoices">
                  {missingInvoices.length === 0 ? (
                    <Alert>
                      <CheckCircle className="w-4 h-4" />
                      <AlertTitle>Todo en orden</AlertTitle>
                      <AlertDescription>
                        No hay facturas sin pago detectadas.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <ul className="space-y-2">
                      {missingInvoices.map((invoice) => (
                        <li key={invoice.id} className="flex justify-between items-center p-2 border rounded">
                          <div>
                            <p className="font-medium">{invoice.nombre_documento}</p>
                            <p className="text-sm text-muted-foreground">
                              {invoice.proveedor} - ${formatMoney(invoice.total_amount)}
                            </p>
                          </div>
                          <Button size="sm" onClick={() => handleAssociateInvoice(invoice.id)}>
                            Asociar manualmente
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </TabsContent>
                
                <TabsContent value="payments">
                  {unmatchedPayments.length === 0 ? (
                    <Alert>
                      <CheckCircle className="w-4 h-4" />
                      <AlertTitle>Todo en orden</AlertTitle>
                      <AlertDescription>
                        No hay pagos sin factura detectados.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <ul className="space-y-2">
                      {unmatchedPayments.map((payment) => (
                        <li key={payment.id} className="flex justify-between items-center p-2 border rounded">
                          <div>
                            <p className="font-medium">{payment.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(payment.transaction_date)} - ${formatMoney(payment.amount)}
                            </p>
                          </div>
                          <Button size="sm" onClick={() => handleRequestInvoice(payment.id)}>
                            Solicitar factura
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Acciones finales */}
          <div className="flex justify-end gap-2">
            <Button variant="outline">
              💾 Guardar borrador
            </Button>
            <Button variant="outline">
              📤 Exportar reporte
            </Button>
            <Button
              disabled={stats.rate < 0.9}
              onClick={handleCloseConciliation}
            >
              ✅ Cerrar conciliación
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
```

#### Estados de la UI

| Estado | Descripción | Componentes Visibles | Acciones Disponibles |
|--------|-------------|---------------------|---------------------|
| **empty** | Sin estado de cuenta cargado | Upload zone, selector de cuenta | Subir archivo, ver anteriores |
| **loading** | Procesando archivo | Progress bar, spinner | Cancelar procesamiento |
| **processing** | Ejecutando matching engine | Progress bar por etapa | Ninguna (wait only) |
| **success** | Matching completado | Tabla de matches, resumen, alertas | Confirmar, rechazar, filtrar, cerrar |
| **error** | Error en procesamiento | Mensaje de error, retry button | Reintentar, contactar soporte |

#### Accesibilidad (WCAG 2.1 AA)

- ✅ Navegación con teclado (Tab, Enter, Esc)
- ✅ Atajos de teclado: `Enter` = confirmar match, `Esc` = cancelar, `Ctrl+Enter` = cerrar conciliación
- ✅ ARIA labels en todos los botones e inputs
- ✅ Contraste de color mínimo 4.5:1 para texto
- ✅ Focus visible en todos los elementos interactivos
- ✅ Screen reader announcements para actualizaciones dinámicas
- ✅ Error messages asociados a inputs con `aria-describedby`

#### Responsive Design

| Breakpoint | Ancho | Layout |
|------------|-------|--------|
| **sm** | ≥640px | 1 columna, tabla con scroll horizontal |
| **md** | ≥768px | 2 columnas para filtros |
| **lg** | ≥1024px | 3 columnas para stats |
| **xl** | ≥1280px | Layout completo, tabla sin scroll |

---

### 6.2 Dashboard Predictivo (Tax Health Score)

#### Wireframe ASCII

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  DASHBOARD PREDICTIVO                                                       [📅 Marzo 2026] │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  ┌───────────────────────────────────────────────────────────────────────────────────┐ │
│  │ 🌡️ SALUD FISCAL DE TU EMPRESA                                                    │ │
│  │                                                                                   │ │
│  │     ┌─────────────────┐                                                           │ │
│  │     │                 │                                                           │ │
│  │     │      🟢 85      │                                                           │ │
│  │     │    EXCELENTE    │                                                           │ │
│  │     │                 │                                                           │ │
│  │     └─────────────────┘                                                           │ │
│  │                                                                                   │ │
│  │  Factores positivos:                 Factores de atención:                        │ │
│  │  ✅ Opinión de cumplimiento positiva   ⚠️ 2 proveedores en lista 69-B             │ │
│  │  ✅ Sin discrepancia fiscal           ⚠️ IVA por pagar 15% arriba del promedio    │ │
│  │  ✅ Contabilidad al corriente         ℹ️  Margen de utilidad estable              │ │
│  │                                                                                   │ │
│  │  [📊 Ver detalle de factores]                                                     │ │
│  └───────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                         │
│  ┌───────────────────────────────────────┐ ┌─────────────────────────────────────────┐ │
│  │ 📈 PROYECCIÓN DE IMPUESTOS            │ │ 💰 FLUJO DE CAJA PROYECTADO             │ │
│  │                                       │ │                                         │ │
│  │  IVA a Pagar (Próximos 3 meses):      │ │  Saldo proyectado a 6 meses:            │ │
│  │                                       │ │                                         │ │
│  │  Abril: $45,000 ─┐                    │ │  Abril:  $120,000 ████████████░░░░░░   │ │
│  │  Mayo:   $52,000 ─┤                   │ │  Mayo:   $135,000 █████████████░░░░░   │ │
│  │  Junio:  $48,000 ─┘                   │ │  Junio:  $142,000 ██████████████░░░░   │ │
│  │                                       │ │  Julio:  $158,000 ████████████████░░   │ │
│  │  ┌──────────────────────────────┐     │ │  Ago:    $165,000 ████████████████░░   │ │
│  │  │▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░│     │ │  Sep:    $178,000 ██████████████████░   │ │
│  │  │▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░│     │ │                                         │ │
│  │  │▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░│     │ │  [📊 Ver proyección completa]           │ │
│  │  │▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░│     │ │                                         │ │
│  │  └──────────────────────────────┘     │ │                                         │ │
│  │  Estimado  Mínimo  Máximo             │ │                                         │ │
│  │                                       │ │                                         │ │
│  │  ⚠️ Considera reservar $48,333/mes    │ │                                         │ │
│  │     para impuestos                    │ │                                         │ │
│  └───────────────────────────────────────┘ └─────────────────────────────────────────┘ │
│                                                                                         │
│  ┌───────────────────────────────────────────────────────────────────────────────────┐ │
│  │ ⚠️ ALERTAS FISCALES                                                               │ │
│  │                                                                                   │ │
│  │  🔴 CRÍTICO (2):                                                                  │ │
│  │  • Proveedor "Distribuidora XYZ" (RFC: DXY123456) aparece en lista 69-B           │ │
│  │    [📧 Notificar a cliente] [✅ Ya notificado]                                    │ │
│  │  • Declaración de IVA marzo vence en 7 días (17 de abril)                         │ │
│  │    [📅 Recordar] [✅ Ya programado]                                               │ │
│  │                                                                                   │ │
│  │  🟡 ATENCIÓN (3):                                                                 │ │
│  │  • IVA por pagar 15% arriba del promedio histórico                                │ │
│  │  • 3 facturas de egreso sin pago detectado (>30 días)                             │ │
│  │  • Margen de utilidad abajo del 10% (recomendado: 15-20%)                         │ │
│  │                                                                                   │ │
│  │  [📋 Ver todas las alertas (5)]                                                   │ │
│  └───────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Componente TaxHealthScore

```typescript
// frontend/src/components/dashboard/TaxHealthScore.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Gauge, GaugeValue } from '@/components/ui/gauge'; // shadcn extended

interface TaxHealthScoreProps {
  score: number;
  factors: {
    positive: Array<{ name: string; description: string }>;
    attention: Array<{ name: string; description: string; severity: 'low' | 'medium' | 'high' }>;
  };
  onDetailClick: () => void;
}

export function TaxHealthScore({ score, factors, onDetailClick }: TaxHealthScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'EXCELENTE';
    if (score >= 60) return 'BUENO';
    if (score >= 40) return 'REGULAR';
    return 'CRÍTICO';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return '🟢';
    if (score >= 60) return '🟡';
    if (score >= 40) return '🟠';
    return '🔴';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>🌡️ Salud Fiscal de Tu Empresa</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-8">
          {/* Gauge del score */}
          <div className="flex flex-col items-center justify-center">
            <Gauge
              value={score}
              min={0}
              max={100}
              className="w-48 h-48"
            >
              <GaugeValue
                value={score}
                className={getScoreColor(score)}
              />
            </Gauge>
            <div className="text-center mt-4">
              <p className="text-4xl font-bold {getScoreColor(score)}">
                {getScoreIcon(score)} {score}
              </p>
              <p className="text-sm text-muted-foreground font-medium">
                {getScoreLabel(score)}
              </p>
            </div>
          </div>

          {/* Factores */}
          <div className="flex-1 space-y-4">
            <div>
              <h4 className="font-semibold mb-2 text-green-700">Factores positivos:</h4>
              <ul className="space-y-2">
                {factors.positive.map((factor, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="text-left">
                          <span className="font-medium">{factor.name}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{factor.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-orange-700">Factores de atención:</h4>
              <ul className="space-y-2">
                {factors.attention.map((factor, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    {factor.severity === 'high' ? (
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    ) : factor.severity === 'medium' ? (
                      <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                    ) : (
                      <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    )}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="text-left">
                          <span className="font-medium">{factor.name}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{factor.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </li>
                ))}
              </ul>
            </div>

            <Button variant="link" onClick={onDetailClick} className="p-0">
              📊 Ver detalle de factores →
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## 7. Matriz de Riesgos Técnica

| ID | Riesgo | Categoría | Probabilidad | Impacto | Score (P×I) | Mitigación | Owner | Trigger |
|----|--------|-----------|--------------|---------|-------------|------------|-------|---------|
| **R01** | API del SAT no disponible o cambia endpoints | Integración | 60% | Alto | 24 | - Fallback a validación local<br>- Monitoreo de cambios en portal SAT<br>- Múltiples métodos de consulta | Backend Lead | >3 fallos consecutivos |
| **R02** | Lista 69-B no se actualiza semanalmente | Datos | 40% | Alto | 16 | - Download automático con retry<br>- Alerta si no hay actualización en 14 días<br>- Fuente alternativa (boletines SAT) | Backend Dev | Alerta de desactualización |
| **R03** | NVIDIA NIM rate limit (40 RPM) excedido | Infraestructura | 50% | Alto | 20 | - Rate limiting en API<br>- Cola de requests<br>- Caching agresivo de respuestas<br>- Upgrade a Enterprise si necesario | DevOps | >30 RPM sostenidos |
| **R04** | GPU RTX 4090 sin disponibilidad o falla | Hardware | 30% | Alto | 12 | - Stock de repuesto<br>- Plan B con cloud GPU (H100)<br>- Fallback a CPU (lento pero funcional) | DevOps | Temperatura >85°C o errores |
| **R05** | Modelo de clasificación con precisión <80% | ML | 35% | Medio | 10.5 | - Más datos de entrenamiento<br>- Fine-tuning de modelo<br>- Fallback a reglas heurísticas | ML Engineer | Precisión <80% en validación |
| **R06** | Falsos positivos en lista 69-B (>10%) | ML/Datos | 25% | Alto | 10 | - Validación cruzada con múltiples fuentes<br>- Threshold ajustable<br>- Revisión humana para casos dudosos | ML Engineer | >10% de falsos positivos |
| **R07** | ChromaDB corruption o pérdida de datos | Datos | 15% | Crítico | 6 | - Backup diario en S3<br>- Replicación en tiempo real<br>- Plan de restore probado | DevOps | Error de escritura/lectura |
| **R08** | Multi-tenant isolation failure (data leak) | Seguridad | 10% | Crítico | 4 | - Row Level Security en PostgreSQL<br>- Namespacing estricto en ChromaDB<br>- Penetration testing | Security Lead | Cualquier incidente de seguridad |
| **R09** | LLM alucinaciones en respuestas legales | IA | 30% | Alto | 9 | - RAG con citas obligatorias<br>- Reranker para precisión<br>- Feedback de usuarios para detectar errores | ML Engineer | >5 reportes de usuarios |
| **R10** | OCR con precisión <90% en tickets deteriorados | IA | 40% | Medio | 8 | - Pre-procesamiento de imagen<br>- Múltiples passes de OCR<br>- Validación humana para baja confianza | Backend Dev | CER >10% en tests |
| **R11** | Conciliación con match rate <70% | ML | 35% | Alto | 10.5 | - Ajuste de thresholds<br>- Más datos históricos<br>- Reglas personalizadas por cliente | ML Engineer | Match rate <70% por 2 semanas |
| **R12** | Scraping SAT bloquea IPs | Integración | 70% | Alto | 21 | - Rotación de proxies<br>- User agents realistas<br>- Delays aleatorios<br>- Fallback a descarga manual | Backend Lead | HTTP 403 o CAPTCHA |
| **R13** | PAC de timbrado con downtime | Integración | 40% | Alto | 16 | - Múltiples proveedores PAC<br>- Retry con backoff exponencial<br>- Cola de timbrado pendiente | Backend Dev | Timeout o error de PAC |
| **R14** | Cálculos IMSS incorrectos | Negocio | 25% | Crítico | 10 | - Validación con contador certificado<br>- Tests exhaustivos con casos reales<br>- Seguro de E&O (Errors & Omissions) | Contador Certificado | Cualquier discrepancia en cálculos |
| **R15** | Performance degradation con 100+ usuarios concurrentes | Performance | 50% | Alto | 20 | - Load testing previo<br>- Auto-scaling horizontal<br>- Caching en Redis<br>- Query optimization | DevOps | Latencia p95 >2s |
| **R16** | Costos cloud >50% del presupuesto | Financiero | 40% | Medio | 8 | - Monitoring de costos en tiempo real<br>- Alertas de budget<br>- Optimización de queries<br>- Spot instances | FinOps | Gasto >80% del budget mensual |
| **R17** | Cambios en normativa fiscal (LISR, LIVA, CFF) | Normativo | 80% | Alto | 32 | - Watcher DOF automatizado<br>- Actualización trimestral de RAG<br>- Asesoría fiscal externa | Contador Certificado | Publicación en DOF |
| **R18** | Usuarios no adoptan funcionalidades de IA | Producto | 30% | Medio | 6 | - Onboarding guiado<br>- Tutoriales en video<br>- Casos de éxito documentados<br>- Soporte proactivo | Product Owner | <50% de adopción en 30 días |
| **R19** | NPS <30 en beta testers | Producto | 35% | Alto | 10.5 | - Feedback continuo<br>- Iteraciones rápidas<br>- Priorización de bugs críticos | Product Owner | NPS <30 en primera encuesta |
| **R20** | Competidor lanza feature similar antes | Mercado | 50% | Medio | 10 | - Time-to-market acelerado<br>- Diferenciación en UX<br>- Enfoque en nicho específico | Product Owner | Anuncio de competidor |

### Matriz de Calor de Riesgos

```
IMPACTO
  ▲
  │
C │     R07    R08   R14
r │     R01    R03   R12
í │     R02    R13   R15
t │     R06    R09   R17
i │     R05    R11   R19
c │     R04    R10   R16
o │     R18    R20
  │
  └──────────────────────────────► PROBABILIDAD
    Baja     Media     Alta
```

---

## 8. KPIs Técnicos Detallados

### 8.1 KPIs de Módulo IDP

| KPI | Fórmula | Línea Base | Objetivo Mes 6 | Objetivo Mes 12 | Frecuencia | Dashboard |
|-----|---------|------------|----------------|-----------------|------------|-----------|
| **Precisión de OCR (CER)** | `(caracteres_erróneos / total_caracteres) × 100` | <1% | <0.5% | <0.3% | Por documento | `backend/metrics/ocr` |
| **Tiempo de procesamiento** | `avg(tiempo_procesamiento_por_documento)` | 5s | 3s | 2s | Por lote | `backend/metrics/processing-time` |
| **Tasa de extracción exitosa** | `(docs_extraídos / docs_procesados) × 100` | 90% | 95% | 98% | Diario | `dashboard/idp` |
| **Precisión de clasificación** | `(clasificaciones_correctas / total) × 100` | 75% | 85% | 92% | Semanal | `dashboard/idp` |
| **Documentos procesados/día** | `count(documentos_procesados)` | 500 | 2,000 | 10,000 | Diario | `dashboard/usage` |

### 8.2 KPIs de Módulo Conciliación

| KPI | Fórmula | Línea Base | Objetivo Mes 6 | Objetivo Mes 12 | Frecuencia | Dashboard |
|-----|---------|------------|----------------|-----------------|------------|-----------|
| **Match rate automático** | `(matches_automaticos / total_transacciones) × 100` | 0% | 70% | 85% | Por conciliación | `dashboard/reconciliation` |
| **Precisión de matching** | `(matches_correctos / matches_confirmados) × 100` | N/A | 90% | 95% | Semanal | `dashboard/reconciliation` |
| **Falsos positivos** | `(matches_incorrectos / matches_confirmados) × 100` | N/A | <5% | <2% | Semanal | `dashboard/reconciliation` |
| **Tiempo de conciliación** | `avg(tiempo_usuario_por_conciliacion)` | 120 min | 30 min | 15 min | Por cliente | `dashboard/efficiency` |
| **Facturas sin pago detectadas** | `count(facturas_sin_pago)` | N/A | 100% detección | 100% detección | Diario | `dashboard/alerts` |

### 8.3 KPIs de Módulo RAG

| KPI | Fórmula | Línea Base | Objetivo Mes 6 | Objetivo Mes 12 | Frecuencia | Dashboard |
|-----|---------|------------|----------------|-----------------|------------|-----------|
| **RAGAS Faithfulness** | Score de fidelidad (0-1) | 0.85 | 0.90 | 0.95 | Semanal | `backend/metrics/ragas` |
| **RAGAS Answer Relevancy** | Score de relevancia (0-1) | 0.85 | 0.90 | 0.95 | Semanal | `backend/metrics/ragas` |
| **Context Recall** | `(fragmentos_relevantes_recuperados / total_relevantes) × 100` | 80% | 90% | 95% | Semanal | `backend/metrics/ragas` |
| **Tiempo de respuesta (TTFT)** | `avg(tiempo_al_primer_token)` | 1.5s | 1.0s | 0.8s | Por consulta | `dashboard/performance` |
| **Consultas/día** | `count(consultas_rag)` | 100 | 500 | 2,000 | Diario | `dashboard/usage` |

### 8.4 KPIs de Módulo Predictivo

| KPI | Fórmula | Línea Base | Objetivo Mes 6 | Objetivo Mes 12 | Frecuencia | Dashboard |
|-----|---------|------------|----------------|-----------------|------------|-----------|
| **Error de forecasting (IVA)** | `abs(proyeccion - real) / real × 100` | N/A | <10% | <8% | Mensual | `dashboard/forecast` |
| **Error de forecasting (ISR)** | `abs(proyeccion - real) / real × 100` | N/A | <15% | <10% | Mensual | `dashboard/forecast` |
| **Precisión de detección EFO** | `(efo_detectados_correctamente / total_efo) × 100` | N/A | 95% | 99% | Semanal | `dashboard/alerts` |
| **Tiempo de alerta temprana** | `avg(dias_antes_vencimiento)` | N/A | 7 días | 14 días | Por alerta | `dashboard/alerts` |
| **Tax Health Score promedio** | `avg(score_todos_clientes)` | N/A | 75 | 80 | Mensual | `dashboard/health` |

### 8.5 KPIs de Plataforma

| KPI | Fórmula | Línea Base | Objetivo Mes 6 | Objetivo Mes 12 | Frecuencia | Dashboard |
|-----|---------|------------|----------------|-----------------|------------|-----------|
| **Uptime** | `(tiempo_activo / tiempo_total) × 100` | N/A | 99% | 99.5% | Diario | `grafana/uptime` |
| **Latencia API (p95)** | `percentil_95(latencia_requests)` | 500ms | 400ms | 300ms | Hora | `grafana/performance` |
| **Error rate** | `(requests_con_error / total_requests) × 100` | <2% | <1% | <0.5% | Hora | `grafana/errors` |
| **NVIDIA NIM RPM** | `avg(requests_por_minuto)` | N/A | <30 | <35 | Hora | `grafana/nim-usage` |
| **Costo por documento** | `costo_total_infra / documentos_procesados` | $0.10 | $0.05 | $0.03 | Mensual | `grafana/costs` |
| **Usuarios activos (DAU/MAU)** | `count(usuarios_activos)` | 0 | 100 / 300 | 500 / 1,500 | Diario | `dashboard/users` |
| **Tasa de retención** | `(usuarios_activos_mes_n / usuarios_mes_n-1) × 100` | N/A | 85% | 90% | Mensual | `dashboard/users` |
| **NPS** | `%promotores - %detractores` | N/A | 40 | 60 | Mensual | `dashboard/nps` |

---

## 9. Estrategia de Testing

### 9.1 Tests Unitarios

**Cobertura mínima requerida:** 80%

**Funciones críticas a testear:**

```python
# backend/tests/unit/

# IDP
test_idp/test_ocr_extraction.py        # Extracción de campos CFDI
test_idp/test_cfdi_classifier.py       # Clasificación contable
test_idp/test_sat_validator.py         # Validación UUID SAT
test_idp/test_efo_checker.py           # Check lista 69-B

# Conciliación
test_reconciliation/test_bank_parser.py      # Parser de estados de cuenta
test_reconciliation/test_exact_matching.py   # Match exacto (monto + fecha)
test_reconciliation/test_fuzzy_matching.py   # Fuzzy matching (Levenshtein)
test_reconciliation/test_llm_validation.py   # Validación semántica con LLM
test_reconciliation/test_anomaly_detector.py # Detección de faltantes

# Predictivo
test_predictive/test_tax_forecaster.py # Forecasting de impuestos
test_predictive/test_health_score.py   # Cálculo de Tax Health Score
test_predictive/test_efo_detection.py  # Detección de proveedores EFO

# Nómina
test_payroll/test_perceptions.py       # Cálculo de percepciones
test_payroll/test_deductions.py        # Cálculo de deducciones
test_payroll/test_imss_quotas.py       # Cálculo de cuotas IMSS
test_payroll/test_infonavit.py         # Cálculo de INFONAVIT
test_payroll/test_isr_withholding.py   # Retención de ISR

# RAG
test_rag/test_law_ingestor.py          # Ingesta de leyes
test_rag/test_chunking.py              # Estrategia de chunking
test_rag/test_retriever.py             # Recuperación de fragmentos
test_rag/test_reranker.py              # Reranking de resultados
```

**Ejemplo de test unitario:**

```python
# backend/tests/unit/test_reconciliation/test_exact_matching.py

import pytest
from datetime import datetime, timedelta
from app.services.reconciliation.matching_engine import MatchingEngine
from app.models.bank_transaction import BankTransaction
from app.models.document import Document

class TestExactMatching:
    
    @pytest.fixture
    def engine(self, db_session):
        return MatchingEngine(db_session)
    
    @pytest.fixture
    def sample_transaction(self):
        return BankTransaction(
            id="tx-123",
            transaction_date=datetime(2026, 3, 15),
            description="AMAZON MKTPLACE MEX",
            amount=1250.00,
            transaction_type="debit"
        )
    
    @pytest.fixture
    def sample_document(self):
        return Document(
            id="doc-456",
            tenant_id="tenant-789",
            status="processed",
            total_amount=1250.00,
            extraction_json={
                "fecha": "2026-03-15",
                "rfc_emisor": "AMZ123456XYZ",
                "concepto": "Compra de productos"
            }
        )
    
    def test_exact_match_monto_fecha(self, engine, sample_transaction, sample_document, db_session):
        """Test de match exacto por monto y fecha."""
        # Insertar documento en DB
        db_session.add(sample_document)
        db_session.commit()
        
        # Ejecutar matching
        matches = engine._exact_match(sample_transaction, "tenant-789")
        
        # Validar resultados
        assert len(matches) == 1
        assert matches[0].id == sample_document.id
        assert matches[0].total_amount == sample_transaction.amount
    
    def test_exact_match_fecha_tolerance(self, engine, sample_transaction, db_session):
        """Test de tolerancia de fecha (+/- 3 días)."""
        # Crear documentos con fechas dentro y fuera de tolerancia
        doc_within = Document(
            id="doc-1",
            tenant_id="tenant-789",
            status="processed",
            total_amount=1250.00,
            extraction_json={"fecha": "2026-03-13"}  # 2 días antes
        )
        
        doc_outside = Document(
            id="doc-2",
            tenant_id="tenant-789",
            status="processed",
            total_amount=1250.00,
            extraction_json={"fecha": "2026-03-10"}  # 5 días antes
        )
        
        db_session.add_all([doc_within, doc_outside])
        db_session.commit()
        
        matches = engine._exact_match(sample_transaction, "tenant-789")
        
        assert len(matches) == 1
        assert matches[0].id == doc_within.id
    
    def test_no_match_monto_diferente(self, engine, sample_transaction, db_session):
        """Test de no match cuando el monto es diferente."""
        doc = Document(
            id="doc-999",
            tenant_id="tenant-789",
            status="processed",
            total_amount=1500.00,  # Monto diferente
            extraction_json={"fecha": "2026-03-15"}
        )
        
        db_session.add(doc)
        db_session.commit()
        
        matches = engine._exact_match(sample_transaction, "tenant-789")
        
        assert len(matches) == 0
```

### 9.2 Tests de Integración

**Flujos end-to-end críticos:**

```typescript
// frontend/tests/e2e/reconciliation.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Conciliación Bancaria', () => {
  
  test('debe procesar estado de cuenta y mostrar matches', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('[name="email"]', 'contador@test.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Navegar a conciliación
    await page.click('text=Conciliación');
    
    // Subir estado de cuenta
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('tests/fixtures/bank_statement.pdf');
    
    // Esperar procesamiento
    await expect(page.locator('[data-testid="progress-bar"]')).toBeVisible();
    await expect(page.locator('[data-testid="progress-bar"]')).toHaveAttribute('aria-valuenow', '100');
    
    // Validar resumen
    await expect(page.locator('[data-testid="match-rate"]')).toContainText('85%');
    await expect(page.locator('[data-testid="total-matches"]')).toContainText('108');
    
    // Validar tabla de matches
    const matchesTable = page.locator('[data-testid="matches-table"]');
    await expect(matchesTable).toBeVisible();
    
    const rows = matchesTable.locator('tbody tr');
    await expect(rows).toHaveCount(5); // Primera página
    
    // Confirmar match
    await rows.first().locator('[data-testid="confirm-match"]').click();
    await expect(rows.first()).toHaveClass(/confirmed/);
    
    // Cerrar conciliación
    await page.click('text=Cerrar conciliación');
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  });
  
  test('debe detectar facturas sin pago', async ({ page }) => {
    // ... test implementation
  });
  
  test('debe detectar pagos sin factura', async ({ page }) => {
    // ... test implementation
  });
  
  test('debe manejar errores de parsing', async ({ page }) => {
    // ... test implementation
  });
});
```

**Mocks requeridos:**

```python
# backend/tests/conftest.py

import pytest
from unittest.mock import Mock, patch
from app.services.nvidia_nim import call_nvidia_nim_chat, call_nvidia_nim_ocr

@pytest.fixture
def mock_nvidia_nim():
    """Mock para llamadas a NVIDIA NIM."""
    with patch('app.services.nvidia_nim.call_nvidia_nim_chat') as mock_chat, \
         patch('app.services.nvidia_nim.call_nvidia_nim_ocr') as mock_ocr:
        
        # Mock de respuesta de chat
        mock_chat.return_value = """
        {
          "match": true,
          "confidence": 0.92,
          "reasoning": "La descripción bancaria 'AMAZON MKTPLACE' corresponde al emisor del CFDI",
          "match_type": "fuzzy"
        }
        """
        
        # Mock de respuesta de OCR
        mock_ocr.return_value = {
            "metadata": {"confidence_score": 0.95},
            "documento": {
              "tipo": "CFDI_INGRESO_40",
              "uuid": "12345678-1234-1234-1234-123456789012",
              "rfc_emisor": "AMZ123456XYZ",
              "total": 1250.00
            }
        }
        
        yield mock_chat, mock_ocr

@pytest.fixture
def mock_sat_api():
    """Mock para API del SAT."""
    with patch('app.services.sat_validator.check_uuid') as mock_check:
        mock_check.return_value = {
            "status": "vigente",
            "fecha": "2026-03-15",
            "monto": 1250.00
        }
        yield mock_check

@pytest.fixture
def mock_lista_69b():
    """Mock para lista 69-B."""
    with patch('app.services.efo_checker.check_rfc') as mock_check:
        # RFC no está en lista
        mock_check.return_value = {"in_list": False, "status": "clean"}
        yield mock_check
```

### 9.3 Tests de IA

**Métricas de calidad:**

| Métrica | Herramienta | Threshold | Frecuencia |
|---------|-------------|-----------|------------|
| **RAGAS Faithfulness** | RAGAS | >0.90 | Semanal |
| **RAGAS Answer Relevancy** | RAGAS | >0.90 | Semanal |
| **RAGAS Context Recall** | RAGAS | >0.85 | Semanal |
| **RAGAS Context Precision** | RAGAS | >0.85 | Semanal |
| **Character Error Rate (OCR)** | Custom | <1% | Por lote |
| **F1-Score (Clasificación)** | Scikit-learn | >0.85 | Semanal |
| **Precision/Recall (Matching)** | Scikit-learn | >0.90 / >0.85 | Semanal |

**Dataset de validación:**

```python
# backend/tests/ai/validation_dataset.py

# Golden Dataset para OCR (200 CFDI reales)
OCR_GOLDEN_DATASET = [
    {
        "pdf_path": "tests/data/cfdi/001.pdf",
        "xml_path": "tests/data/cfdi/001.xml",
        "expected_fields": {
            "uuid": "12345678-1234-1234-1234-123456789012",
            "rfc_emisor": "AMZ123456XYZ",
            "rfc_receptor": "RECP123456AAA",
            "total": 1250.00,
            "fecha": "2026-03-15"
        }
    },
    # ... 199 más
]

# Dataset para RAG (100 consultas legales con respuestas esperadas)
RAG_GOLDEN_DATASET = [
    {
        "query": "¿Cuáles son los requisitos para deducir gastos de viaje?",
        "expected_articles": ["LISR Art. 28", "LISR Art. 27 Fracc. I"],
        "expected_answer_keywords": ["comprobantes", "estrictamente indispensable", "viaje"]
    },
    # ... 99 más
]

# Dataset para Matching (500 transacciones con matches confirmados)
MATCHING_GOLDEN_DATASET = [
    {
        "transaction": {
            "description": "AMAZON MKTPLACE MEX",
            "amount": 1250.00,
            "date": "2026-03-15"
        },
        "expected_document_id": "doc-123",
        "expected_match_type": "fuzzy",
        "expected_confidence": 0.88
    },
    # ... 499 más
]
```

### 9.4 Tests de Carga

**Escenarios de concurrencia:**

```python
# backend/tests/load/test_concurrency.py

from locust import HttpUser, task, between
import random

class IDPUser(HttpUser):
    """Usuario simulado para IDP."""
    wait_time = between(1, 3)
    
    @task(3)
    def upload_document(self):
        """Upload de documento (OCR)."""
        files = {'file': open('tests/fixtures/cfdi.pdf', 'rb')}
        self.client.post('/v1/idp/upload', files=files)
    
    @task(2)
    def chat_query(self):
        """Consulta de chat (RAG)."""
        queries = [
            "¿Qué es deducible para gastos de viaje?",
            "¿Cómo calculo el IVA del mes?",
            "¿Cuáles son mis gastos del mes?"
        ]
        self.client.post('/v1/chat/stream', json={"query": random.choice(queries)})
    
    @task(1)
    def get_dashboard(self):
        """Carga de dashboard."""
        self.client.get('/v1/workspace/dashboard')

class ReconciliationUser(HttpUser):
    """Usuario simulado para conciliación."""
    wait_time = between(5, 10)
    
    @task(1)
    def upload_bank_statement(self):
        """Upload de estado de cuenta."""
        files = {'file': open('tests/fixtures/bank_statement.pdf', 'rb')}
        self.client.post('/v1/reconciliation/upload-bank-statement', files=files)

# Escenarios:
# 1. Carga normal: 20 usuarios concurrentes (10 min)
# 2. Carga pico: 50 usuarios concurrentes (5 min)
# 3. Stress test: 100 usuarios concurrentes (hasta fallo)
# 4. Endurance test: 20 usuarios concurrentes (1 hora)
```

**Límites de throughput:**

| Endpoint | Throughput Mínimo | Throughput Objetivo | Latencia Máx (p95) |
|----------|-------------------|---------------------|-------------------|
| `POST /v1/idp/upload` | 10 req/s | 20 req/s | 5s |
| `POST /v1/chat/stream` | 20 req/s | 40 req/s | 1s (TTFT) |
| `POST /v1/reconciliation/upload` | 5 req/s | 10 req/s | 30s |
| `GET /v1/analytics/health-score` | 30 req/s | 60 req/s | 500ms |
| `POST /v1/agents/payroll/calculate` | 2 req/s | 5 req/s | 10s |

---

## 10. Checklist de Producción

### 10.1 Seguridad (OWASP Top 10)

- [ ] **A01: Broken Access Control**
  - [ ] Row Level Security implementado en PostgreSQL
  - [ ] Namespacing de ChromaDB por tenant
  - [ ] Validación de tenant_id en todos los endpoints
  - [ ] Tests de aislamiento multi-tenant passing

- [ ] **A02: Cryptographic Failures**
  - [ ] HTTPS forzado en producción
  - [ ] TLS 1.3 configurado
  - [ ] Contraseñas hasheadas con bcrypt (cost=12)
  - [ ] JWT con RS256, refresh tokens rotativos
  - [ ] Secrets en Vault/Keytar, no en .env

- [ ] **A03: Injection**
  - [ ] Queries parametrizadas (SQLAlchemy)
  - [ ] Input validation con Pydantic
  - [ ] Sanitización de inputs de usuario
  - [ ] No concatenación de strings en queries

- [ ] **A04: Insecure Design**
  - [ ] Rate limiting implementado (40 RPM para NIM)
  - [ ] Circuit breaker para servicios externos
  - [ ] Timeout configurado en todas las llamadas
  - [ ] Bulkheads para aislar fallos

- [ ] **A05: Security Misconfiguration**
  - [ ] Headers de seguridad (CSP, HSTS, X-Frame-Options)
  - [ ] CORS configurado correctamente
  - [ ] Error messages genéricas (no stack traces)
  - [ ] Directorios y backups no accesibles públicamente

- [ ] **A06: Vulnerable Components**
  - [ ] `npm audit` y `pip-audit` sin críticas
  - [ ] Dependencias actualizadas (últimos 30 días)
  - [ ] SBOM (Software Bill of Materials) generado

- [ ] **A07: Auth Failures**
  - [ ] MFA opcional habilitado
  - [ ] Password policy (mín 12 chars, complejidad)
  - [ ] Account lockout tras 5 intentos fallidos
  - [ ] Session timeout (30 min inactividad)

- [ ] **A08: Data Integrity**
  - [ ] Backup diario en S3 con versioning
  - [ ] Restore probado exitosamente
  - [ ] Checksums para archivos críticos
  - [ ] Audit log de operaciones sensibles

- [ ] **A09: Logging Failures**
  - [ ] Logs estructurados (JSON)
  - [ ] No PII en logs
  - [ ] Alertas configuradas para eventos críticos
  - [ ] Retención de logs (90 días)

- [ ] **A10: SSRF**
  - [ ] Allowlist de URLs para fetching externo
  - [ ] No user input en URLs de servicios internos
  - [ ] Network segmentation (VPC, subnets)

### 10.2 Performance (Lighthouse)

- [ ] **Performance Score >90**
  - [ ] First Contentful Paint <1.5s
  - [ ] Largest Contentful Paint <2.5s
  - [ ] Time to Interactive <3.5s
  - [ ] Total Blocking Time <200ms
  - [ ] Cumulative Layout Shift <0.1

- [ ] **Optimizaciones implementadas**
  - [ ] Lazy loading de componentes
  - [ ] Code splitting por ruta
  - [ ] Imágenes optimizadas (WebP, lazy)
  - [ ] Caching de assets (Cache-Control)
  - [ ] Compresión Gzip/Brotli
  - [ ] CDN para assets estáticos

- [ ] **Backend performance**
  - [ ] Índices en PostgreSQL para queries frecuentes
  - [ ] Query optimization (EXPLAIN ANALYZE)
  - [ ] Redis caching para consultas repetidas
  - [ ] Connection pooling configurado

### 10.3 Documentación

- [ ] **Documentación de API**
  - [ ] OpenAPI/Swagger actualizado
  - [ ] Ejemplos de requests/responses
  - [ ] Códigos de error documentados
  - [ ] Rate limits especificados

- [ ] **Documentación de usuario**
  - [ ] Guía de inicio rápido
  - [ ] Tutoriales por funcionalidad
  - [ ] Videos tutoriales (3-5 min cada uno)
  - [ ] FAQ con preguntas comunes
  - [ ] Guía de solución de problemas

- [ ] **Documentación técnica**
  - [ ] README.md actualizado
  - [ ] Arquitectura del sistema
  - [ ] Guía de deployment
  - [ ] Runbook de incidentes
  - [ ] Post-mortem template

### 10.4 Monitoreo

- [ ] **Application Monitoring (Sentry)**
  - [ ] SDK instalado en backend y frontend
  - [ ] Sourcemaps subidos
  - [ ] Alertas configuradas (email, Slack)
  - [ ] Release tracking habilitado

- [ ] **Infrastructure Monitoring (Prometheus + Grafana)**
  - [ ] Métricas de CPU, RAM, disco
  - [ ] Métricas de PostgreSQL (connections, queries)
  - [ ] Métricas de ChromaDB (collections, queries)
  - [ ] Métricas de NVIDIA NIM (RPM, latency, errors)
  - [ ] Dashboards configurados

- [ ] **Business Metrics**
  - [ ] Dashboard de usuarios activos
  - [ ] Dashboard de documentos procesados
  - [ ] Dashboard de conciliaciones
  - [ ] Dashboard de ingresos (si aplica)

- [ ] **Alerting**
  - [ ] Alertas de uptime (>99%)
  - [ ] Alertas de latencia (p95 >2s)
  - [ ] Alertas de error rate (>2%)
  - [ ] Alertas de costo (>80% del budget)
  - [ ] On-call rotation configurado

### 10.5 Backup/DR

- [ ] **PostgreSQL**
  - [ ] Backup diario automatizado (pg_dump)
  - [ ] Retención: 30 días
  - [ ] Restore probado exitosamente
  - [ ] Point-in-time recovery habilitado

- [ ] **ChromaDB**
  - [ ] Backup diario de collections
  - [ ] Export a S3 con versioning
  - [ ] Restore probado exitosamente

- [ ] **Documentos (S3)**
  - [ ] Versioning habilitado
  - [ ] Lifecycle policies configuradas
  - [ ] Cross-region replication (opcional)

- [ ] **Disaster Recovery Plan**
  - [ ] RTO (Recovery Time Objective) <4h
  - [ ] RPO (Recovery Point Objective) <24h
  - [ ] Runbook de DR documentado
  - [ ] Simulacro de DR realizado

### 10.6 CI/CD (GitHub Actions)

- [ ] **Pipeline de CI**
  - [ ] Lint (black, flake8, eslint, prettier)
  - [ ] Tests unitarios en cada PR
  - [ ] Tests de integración en staging
  - [ ] Build de Docker images
  - [ ] Security scan (trivy, npm audit)

- [ ] **Pipeline de CD**
  - [ ] Deploy automático a staging en merge a develop
  - [ ] Deploy manual a producción (approval requerido)
  - [ ] Rollback automático si health check falla
  - [ ] Database migrations automatizadas

- [ ] **Quality Gates**
  - [ ] Cobertura de tests >80%
  - [ ] Sin vulnerabilities críticas
  - [ ] Lighthouse score >90
  - [ ] Aprobación de code review (2 approvers)

### 10.7 Compliance

- [ ] **Privacidad de datos**
  - [ ] Aviso de privacidad visible
  - [ ] Consentimiento explícito para procesamiento
  - [ ] Derecho de acceso, rectificación, cancelación
  - [ ] Data retention policy (2 años)
  - [ ] DPO (Data Protection Officer) asignado

- [ ] **Términos de servicio**
  - [ ] Términos y condiciones visibles
  - [ ] SLA definido (99.5% uptime)
  - [ ] Limitación de responsabilidad clara
  - [ ] Política de reembolsos

- [ ] **Seguridad de datos fiscales**
  - [ ] Encriptación en reposo (AES-256)
  - [ ] Encriptación en tránsito (TLS 1.3)
  - [ ] Access logs de datos sensibles
  - [ ] Seguro de E&O (Errors & Omissions)

---

## 📝 Conclusión

Este análisis técnico exhaustivo proporciona un plan detallado y ejecutable para las **Fases 8-12** del IDP-App. Los documentos generados son:

1. **`ANALISIS_TECNICO_EXHAUSTIVO.md`** - Secciones 1-3 (Matriz de Trazabilidad, Gap Analysis, Especificación de Conciliación)
2. **`ANALISIS_TECNICO_SECCION_4-5.md`** - Secciones 4-5 (Arquitectura de IA, Plan de Fases)
3. **`ANALISIS_TECNICO_SECCION_6-10.md`** - Secciones 6-10 (UI/UX, Riesgos, KPIs, Testing, Checklist)

**Total:** ~2,500+ líneas de especificación técnica lista para implementación.

**Próximos pasos recomendados:**

1. **Revisión con equipo técnico** (1-2 días)
2. **Priorización de backlog** (1 día)
3. **Kickoff de Fase 8** (inmediato)
4. **Revisión semanal de progreso** (cada viernes)

**Documentos complementarios sugeridos:**

- `ROADMAP_FASES_8-12.md` - Cronograma visual con hitos
- `BACKLOG_PRIORIZADO.md` - User stories con story points
- `ARQUITECTURA_DETALLADA.md` - Diagramas Mermaid de cada módulo

---

**Fin del Análisis Técnico Exhaustivo**
