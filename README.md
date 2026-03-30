# IDP Asistente Contable

[![CI](https://github.com/diegogzz/idp-asistente-contable/actions/workflows/ci.yml/badge.svg)](https://github.com/diegogzz/idp-asistente-contable/actions/workflows/ci.yml)
[![CD](https://github.com/diegogzz/idp-asistente-contable/actions/workflows/cd.yml/badge.svg)](https://github.com/diegogzz/idp-asistente-contable/actions/workflows/cd.yml)
[![E2E Tests](https://github.com/diegogzz/idp-asistente-contable/actions/workflows/e2e-pr.yml/badge.svg)](https://github.com/diegogzz/idp-asistente-contable/actions/workflows/e2e-pr.yml)
[![Release](https://github.com/diegogzz/idp-asistente-contable/actions/workflows/release.yml/badge.svg)](https://github.com/diegogzz/idp-asistente-contable/actions/workflows/release.yml)

**Fase 8 Completada** (marzo 2026): Testing E2E, Performance y CI/CD ✅

Asistente contable inteligente basado en **IDP (Intelligent Document Processing)** potenciado por **NVIDIA NIM** y **LangGraph**.

## 📊 Estado del Proyecto

| Fase | Estado | Progreso | Fecha |
|------|--------|----------|-------|
| Fase 1-4 | ✅ Completado | 100% | Ene 2026 |
| Fase 5 | ✅ Completado | 100% | Ene 2026 |
| Fase 6 | ✅ Completado | 100% | Feb 2026 |
| Fase 7 | ✅ Completado | 100% | Feb 2026 |
| **Fase 8** | ✅ **Completado** | **95%** | **Mar 2026** |
| Fase 9 | ⏳ Pendiente | 0% | Mar-May 2026 |

## 🏗️ Arquitectura

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Backend        │────▶│   NVIDIA NIM    │
│   React + Vite  │     │   FastAPI        │     │   LLM + Embed   │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                              │
                              ▼
                        ┌──────────────────┐
                        │   PostgreSQL     │
                        │   (Datos)        │
                        └──────────────────┘
                              │
                              ▼
                        ┌──────────────────┐
                        │   ChromaDB       │
                        │   (Vectores)     │
                        └──────────────────┘
```

## 🚀 Quick Start

### 1. Clonar y configurar

```bash
cd idp-asistente-contable

# Copiar variables de entorno
cp .env.example .env

# Editar .env y agregar tu NVIDIA_API_KEY
```

### 2. Obtener NVIDIA API Key

1. Visita [NVIDIA NIM](https://build.nvidia.com/)
2. Regístrate o inicia sesión
3. Genera tu API key
4. Agrega a `.env`: `NVIDIA_API_KEY=nvapi-xxx`

### 3. Iniciar con Docker

```bash
# Construir y levantar contenedores
docker-compose up --build

# O en segundo plano
docker-compose up -d --build
```

### 4. Acceder a la aplicación

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 📁 Estructura del Proyecto

```
idp-asistente-contable/
├── backend/                 # FastAPI Backend
│   ├── app/
│   │   ├── main.py          # Entry point
│   │   ├── api/             # Endpoints REST
│   │   ├── core/            # Configuración
│   │   ├── services/        # NVIDIA NIM, LangGraph
│   │   └── db/              # Modelos SQLAlchemy
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/                # React Frontend
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── services/        # API client
│   │   ├── store/           # Zustand state
│   │   └── types/           # TypeScript types
│   ├── Dockerfile
│   └── package.json
├── data/                    # Volúmenes persistentes
│   ├── pg_data/             # PostgreSQL data
│   └── chroma_data/         # ChromaDB data
├── docker-compose.yml       # Orquestación
└── .env                     # Variables de entorno
```

## 🔧 Desarrollo

### Backend (FastAPI)

```bash
cd backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Iniciar servidor de desarrollo
uvicorn app.main:app --reload --port 8000
```

### Frontend (React + Vite)

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## 🧪 Testing

### Backend

```bash
cd backend
pytest
pytest --cov=app
```

### Frontend - Unit Tests

```bash
cd frontend
npm run test
npm run test:coverage
```

### Frontend - E2E Tests (Fase 8)

```bash
cd frontend

# Ejecutar todos los tests E2E
npm run test:e2e

# Con UI interactiva
npm run test:e2e:ui

# Con navegador visible
npm run test:e2e:headed

# Solo Chromium
npm run test:e2e:chromium

# Ver reporte HTML
npm run test:e2e:report
```

**Cobertura E2E:**
- 47 tests implementados
- 6 navegadores soportados (Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari, iPad)
- 7 suites de tests (Auth, IDP Upload, Chat, Conciliación, Dashboard, Responsividad, Accesibilidad)

## 📚 Características

### IDP (Intelligent Document Processing)

- ✅ Procesamiento de facturas
- ✅ Procesamiento de recibos
- ✅ Estados de cuenta
- ✅ Formularios fiscales
- ✅ Extracción de datos con confidence scores

### Chat Inteligente

- ✅ Agentes basados en LangGraph
- ✅ RAG con ChromaDB
- ✅ Contexto conversacional
- ✅ Fuentes y referencias

### NVIDIA NIM Integration

- ✅ LLM: Llama3-70B-Instruct
- ✅ Embeddings: NV-EmbedQA-E5-V5
- ✅ Streaming responses
- ✅ Batch processing

### 🆕 Fase 8 - Testing & CI/CD (Marzo 2026)

- ✅ **47 Tests E2E** con Playwright (6 navegadores)
- ✅ **CI/CD Automatizado** (4 workflows GitHub Actions)
- ✅ **Error Tracking** con Sentry (frontend + backend)
- ✅ **PWA** con offline support
- ✅ **Performance Optimized** (206KB gzip, code splitting)
- ✅ **React Query** caching (4 hooks)
- ✅ **Virtualización** de listas largas

## 🔐 Seguridad

- Autenticación JWT
- Hash de contraseñas con bcrypt
- CORS configurado
- Variables de entorno seguras

## 📖 Documentación

### General
- [Plan del Proyecto](../plan/)
- [API Documentation](http://localhost:8000/docs)
- [NVIDIA NIM Docs](https://docs.nvidia.com/nim/)

### Fases Completadas
- [Fase 5 Completada](docs/02-fases/FASE5_COMPLETADA.md)
- [Fase 6 Completada](docs/02-fases/FASE6_COMPLETADA.md)
- [Fase 7 Completada](docs/02-fases/FASE7_COMPLETADA.md)
- [**Fase 8 Completada**](docs/02-fases/FASE_8_COMPLETADA.md) 🆕

### Documentación de Fase 8
- [Reporte Ejecutivo](docs/02-fases/FASE_8_COMPLETADA.md)
- [Validación Detallada](docs/02-fases/FASE_8_VALIDACION.md)
- [Lecciones Aprendidas](docs/02-fases/FASE_8_LECCIONES_APRENDIDAS.md)
- [Plan de Transición a Fase 9](docs/02-fases/FASE_9_TRANSICION.md)
- [CI/CD Configuration](docs/CICD_CONFIGURATION.md)
- [Performance Optimization](frontend/PERFORMANCE_OPTIMIZATION_REPORT.md)
- [E2E Tests README](frontend/tests/e2e/README.md)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Pull Request

## 📄 Licencia

MIT License - ver archivo LICENSE para detalles.

## 👥 Equipo

Desarrollado con ❤️ usando NVIDIA NIM y LangGraph
