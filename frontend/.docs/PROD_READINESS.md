# 🏗️ PROD_READINESS.md

## 📁 Estructura Final del Proyecto
```text
frontend/
├── src/
│   ├── app/                # App Router (Pages, Layouts, API)
│   │   ├── api/            # Backend Proxy & Health Routes
│   │   ├── dashboard/      # Módulos Principales
│   │   └── layout.tsx      # Root Layout (Providers & Boundaries)
│   ├── components/         # UI & Feature Components
│   │   ├── layout/         # Header, Sidebar, Breadcrumbs
│   │   └── ui/             # Shadcn Primitives
│   ├── hooks/              # TanStack Query & Logic
│   ├── lib/                # Utilities (Sanitize, API Client, Invoice)
│   ├── validators/         # Zod Schemas
│   └── types/              # TypeScript Interfaces
├── public/                # Static Assets
└── package.json           # Dependencies & Scripts
```

## 🔐 Variables de Entorno (Mapping)

| Variable | Local | Producción (Vercel) | Descripción |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | `https://api.idpcontable.com` | URL del Backend |
| `NEXT_PUBLIC_SENTRY_DSN` | `(empty)` | `https://...` | Error Tracking |
| `NEXT_PUBLIC_APP_ENV` | `development` | `production` | Entorno de Ejecución |

## 🚀 Instrucciones de Build
Para generar el bundle de producción optimizado:

1. **Limpiar cache**:
   ```bash
   rm -rf .next
   ```
2. **Instalar dependencias**:
   ```bash
   npm install
   ```
3. **Producción Build**:
   ```bash
   npm run build
   ```
4. **Validación**:
   ```bash
   npm run start
   ```

## ⚡ Performance optimization
- **Dynamic Imports**: Implementados en componentes de Recharts y Generación Documental.
- **StaleTime**: Configurado globalmente a 5 minutos para reducir carga de red.
- **Image Opt**: Uso de `next/image` para todos los componentes visuales persistentes.
