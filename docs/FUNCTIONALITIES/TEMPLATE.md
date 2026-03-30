# 📋 Plantilla Maestra de Documentación de Funcionalidades

## Propósito

Esta plantilla estandariza la documentación de **todas las funcionalidades** de la aplicación IDP Asistente Contable, separando claramente:
- **Backend**: Endpoints, servicios, modelos, lógica de negocio
- **Frontend**: Componentes, hooks, servicios, stores, UI

---

## Estructura de la Plantilla

```markdown
# [Nombre de la Funcionalidad] - IDP Asistente Contable

## Overview
[Descripción breve de 2-3 oraciones sobre qué hace esta funcionalidad]

## Arquitectura

[Diagrama ASCII mostrando el flujo completo frontend → backend → servicios → DB/APIs externas]

## Backend

### API Endpoints (`app/api/[nombre].py`)

**Endpoints disponibles:**

#### `POST /v1/[modulo]/[accion]`
[Descripción del endpoint]

```bash
curl -X POST http://localhost:8000/v1/[modulo]/[accion] \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{...}'
```

**Request Model:**
```python
class [Nombre]Request(BaseModel):
    """[Descripción]"""
    [campo]: [tipo] = Field(..., description="...")
```

**Response Model:**
```python
class [Nombre]Response(BaseModel):
    """[Descripción]"""
    [campo]: [tipo]
```

### Service Layer (`app/services/[nombre].py`)

**Propósito:** [Descripción del propósito del servicio]

**Características principales:**
- [Característica 1]
- [Característica 2]
- [Característica 3]

**Uso:**
```python
from app.services.[nombre] import get_[nombre]_service

service = get_[nombre]_service()
result = service.[metodo](parametros)
```

### Modelos de Datos (`app/db/models.py`)

**[Nombre del Modelo]:**
```python
class [Modelo](Base):
    """[Descripción]"""
    __tablename__ = "[tabla]"
    
    id = Column(Integer, primary_key=True)
    [campo] = Column([tipo])
```

## Frontend

### Componentes (`frontend/src/components/[Nombre].tsx`)

**[Componente Principal]:**

**Propósito:** [Descripción del propósito del componente]

**Props:**
```typescript
interface [Componente]Props {
  [prop]: [tipo]
}
```

**Estado:**
```typescript
const [state, setState] = useState<[tipo]>(initialValue)
```

**Uso:**
```tsx
<[Componente] [props]={values} />
```

### Hooks (`frontend/src/hooks/use[Nombre].ts`)

**Propósito:** [Descripción del hook]

**Retorna:**
```typescript
{
  [valor]: [tipo],
  [funcion]: (params) => returnType
}
```

**Uso:**
```typescript
import { use[Nombre] } from '@hooks/use[Nombre]'

const { valor, funcion } = use[Nombre]()
```

### Servicios (`frontend/src/services/[nombre].service.ts`)

**Propósito:** [Comunicación con API backend]

**Métodos:**
```typescript
async function [metodo](params): Promise<Response> {
  return api.post('/v1/[modulo]/[accion]', params)
}
```

### Store (`frontend/src/store/[nombre].store.ts`)

**Propósito:** [Gestión de estado global con Zustand]

**Estado:**
```typescript
interface [Nombre]Store {
  [state]: [tipo]
  actions: {
    [accion]: () => void
  }
}
```

**Uso:**
```typescript
import { use[Nombre]Store } from '@store/[nombre].store'

const { state, actions } = use[Nombre]Store()
```

## Integración Backend ↔ Frontend

### Flujo de Datos

```
[Componente Frontend] 
  → [Hook] 
  → [Service] 
  → API Endpoint 
  → [Service Backend] 
  → [DB/API Externa] 
  → Response 
  → [Store Update] 
  → [UI Update]
```

## Casos de Uso

### 1. [Caso de Uso Principal]

**Backend:**
```python
# Código Python de ejemplo
```

**Frontend:**
```typescript
// Código TypeScript/TSX de ejemplo
```

### 2. [Caso de Uso Secundario]

**Backend:**
```python
# Código Python de ejemplo
```

**Frontend:**
```typescript
// Código TypeScript/TSX de ejemplo
```

## Setup y Configuración

### Backend

```bash
# Pasos para configurar el backend
1. ...
2. ...
```

### Frontend

```bash
# Pasos para configurar el frontend
1. ...
2. ...
```

## Variables de Entorno

### Backend (`.env`)

```bash
# [Nombre de la funcionalidad]
[VARIABLE]=[valor]
```

### Frontend (`.env`)

```bash
# [Nombre de la funcionalidad]
VITE_[VARIABLE]=[valor]
```

## Troubleshooting

### Error: [Nombre del Error]

**Síntomas:**
- [Síntoma 1]
- [Síntoma 2]

**Solución:**
```bash
# Comandos o pasos para resolver
```

### Error: [Otro Error]

**Síntomas:**
- [Síntoma 1]

**Solución:**
```bash
# Pasos
```

## Métricas y Performance

| Métrica | Objetivo | Actual |
|---------|----------|--------|
| [Métrica 1] | <[valor] | [valor] |
| [Métrica 2] | >[valor] | [valor] |

## Mejores Prácticas

### Backend

```python
# ✅ BUENO
[código de ejemplo bueno]

# ❌ MALO
[código de ejemplo malo]
```

### Frontend

```typescript
// ✅ BUENO
[código de ejemplo bueno]

// ❌ MALO
[código de ejemplo malo]
```

## Futuras Mejoras

- [ ] [Mejora 1]
- [ ] [Mejora 2]
- [ ] [Mejora 3]

## Referencias

- [Enlace a documentación relevante 1]
- [Enlace a documentación relevante 2]
```

---

## Funcionalidades a Documentar

### Backend

1. **IDP (Intelligent Document Processing)** - `docs/FUNCTIONALITIES/IDP_BACKEND.md`
2. **Agent (Tool Calling / ReAct Loop)** - `docs/FUNCTIONALITIES/AGENT_BACKEND.md`
3. **Chat (Conversacional con Streaming)** - `docs/FUNCTIONALITIES/CHAT_BACKEND.md`
4. **Auth (OAuth2 JWT)** - `docs/FUNCTIONALITIES/AUTH_BACKEND.md`
5. **Clients (CRUD + KYC)** - `docs/FUNCTIONALITIES/CLIENTS_BACKEND.md`
6. **Fiscal (Deadlines, Deducciones, SAT)** - `docs/FUNCTIONALITIES/FISCAL_BACKEND.md`
7. **Payroll (Nómina)** - `docs/FUNCTIONALITIES/PAYROLL_BACKEND.md`
8. **Finance (Estados Financieros, Bancos)** - `docs/FUNCTIONALITIES/FINANCE_BACKEND.md`
9. **Expenses (Gastos + Clasificación IA)** - `docs/FUNCTIONALITIES/EXPENSES_BACKEND.md`
10. **Workspace (Dashboard Principal)** - `docs/FUNCTIONALITIES/WORKSPACE_BACKEND.md`

### Frontend

1. **Workspace (Dashboard Principal)** - `docs/FUNCTIONALITIES/WORKSPACE_FRONTEND.md`
2. **Chat (Conversacional con Streaming)** - `docs/FUNCTIONALITIES/CHAT_FRONTEND.md`
3. **Documents (IDP UI)** - `docs/FUNCTIONALITIES/DOCUMENTS_FRONTEND.md`
4. **Clients (CRUD + KYC UI)** - `docs/FUNCTIONALITIES/CLIENTS_FRONTEND.md`
5. **Fiscal (UI Fiscal)** - `docs/FUNCTIONALITIES/FISCAL_FRONTEND.md`
6. **Payroll (UI Nómina)** - `docs/FUNCTIONALITIES/PAYROLL_FRONTEND.md`
7. **Finance (UI Estados Financieros)** - `docs/FUNCTIONALITIES/FINANCE_FRONTEND.md`
8. **Expenses (UI Gastos)** - `docs/FUNCTIONALITIES/EXPENSES_FRONTEND.md`
9. **Settings (Configuración)** - `docs/FUNCTIONALITIES/SETTINGS_FRONTEND.md`
10. **Layout (Sidebar + Navegación)** - `docs/FUNCTIONALITIES/LAYOUT_FRONTEND.md`

---

## Instrucciones de Uso

1. **Copiar esta plantilla** como base para cada funcionalidad
2. **Completar cada sección** con información específica de la funcionalidad
3. **Incluir diagramas ASCII** claros para la arquitectura
4. **Proporcionar ejemplos de código** tanto de backend como de frontend
5. **Documentar todos los endpoints** con curl examples
6. **Incluir troubleshooting** común
7. **Mantener actualizado** cuando se agreguen features

---

*Plantilla creada: 2026-03-10*  
*Versión: 1.0.0*  
*Basada en: docs/FUNCTIONALITIES/RAG_SYSTEM.md*
