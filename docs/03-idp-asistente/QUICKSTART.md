# Quick Start Guide - IDP Asistente Contable

## Inicio Rápido del Sistema

### Prerrequisitos

- Docker Desktop instalado
- Node.js 18+ instalado
- NVIDIA API Key (https://build.nvidia.com/)

---

## 1. Iniciar Backend con Docker

```bash
# Navegar al directorio del proyecto
cd idp-asistente-contable

# Configurar variables de entorno
cp backend/.env.example backend/.env
# Editar backend/.env y agregar tu NVIDIA_API_KEY

# Iniciar todos los servicios (backend, database, chromadb)
docker compose --profile dev up -d

# Ver logs del backend
docker compose logs -f backend
```

**Espera a que veas:**
```
✓ Database initialized
✓ Default admin user created: admin@example.com / admin123
✓ Directories created
✓ Settings validated
Starting IDP Asistente Contable v2.0.0
```

---

## 2. Iniciar Frontend (Desarrollo)

```bash
# Navegar al frontend
cd idp-asistente-contable/frontend

# Instalar dependencias (primera vez)
npm install

# Iniciar servidor de desarrollo
npm run dev
```

**Espera a que veas:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## 3. Acceder a la Aplicación

### Frontend
- **URL:** http://localhost:5173
- **Login:** admin@example.com / admin123

### Backend API
- **Swagger Docs:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **Health Check:** http://localhost:8000/health

---

## 4. Testear Integración

```bash
# Ejecutar script de testing
cd idp-asistente-contable/backend
python test_integracion.py
```

**Output esperado:**
```
✓ Health check
✓ Auth token (OAuth2)
✓ Refresh token
✓ Protected endpoints
✓ IDP stats
✓ Chat history

Todos los tests de integración completados exitosamente!
```

---

## Comandos Útiles

### Docker

```bash
# Ver estado de servicios
docker compose ps

# Ver logs
docker compose logs -f backend
docker compose logs -f db

# Reiniciar backend
docker compose restart backend

# Detener todo
docker compose down

# Limpiar volúmenes (resetear DB)
docker compose down -v
```

### Backend (Desarrollo Local)

```bash
cd backend

# Crear entorno virtual
python -m venv .venv
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt

# Iniciar servidor
uvicorn app.main:app --reload --port 8000
```

### Frontend (Desarrollo Local)

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar desarrollo
npm run dev

# Build de producción
npm run build

# Preview de producción
npm run preview
```

---

## Solución de Problemas

### Backend no inicia

```bash
# Ver logs detallados
docker compose logs backend

# Verificar que PostgreSQL está corriendo
docker compose logs db

# Recrear contenedores
docker compose down
docker compose up -d --force-recreate
```

### Frontend no conecta al backend

```bash
# Verificar .env del frontend
cat frontend/.env
# Debe tener: VITE_BACKEND_URL=http://localhost:8000

# Verificar CORS en backend
# backend/.env debe tener:
# BACKEND_CORS_ORIGINS=["http://localhost:5173"]
```

### Error de autenticación

```bash
# Resetear usuario admin
# 1. Detener backend
docker compose stop backend

# 2. Eliminar volumen de DB
docker compose down -v

# 3. Reiniciar
docker compose --profile dev up -d
```

### Puerto 8000 ya está en uso

```bash
# Matar proceso en Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# O cambiar puerto en docker-compose.yml
ports:
  - "8001:8000"  # Usar 8001 en lugar de 8000
```

---

## Estructura del Proyecto

```
idp-asistente-contable/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── api/         # Endpoints (auth, idp, chat)
│   │   ├── core/        # Config, security
│   │   ├── db/          # Database models
│   │   └── services/    # NVIDIA NIM, LangGraph
│   ├── test_integracion.py
│   └── README_FASE5.md
│
├── frontend/            # React + Vite frontend
│   ├── src/
│   │   ├── services/   # API services (auth, idp, chat)
│   │   ├── components/ # UI components
│   │   └── types/      # TypeScript types
│   └── .env
│
├── docker-compose.yml   # Docker orchestration
├── FASE7_COMPLETADA.md  # Resumen de integración
└── INTEGRACION_FASE7.md # Documentación completa
```

---

## Flujo de Trabajo Típico

### 1. Iniciar sesión de desarrollo

```bash
# Terminal 1 - Backend
cd idp-asistente-contable
docker compose --profile dev up -d
docker compose logs -f backend

# Terminal 2 - Frontend
cd idp-asistente-contable/frontend
npm run dev
```

### 2. Hacer cambios en el código

- **Backend:** Hot reload automático con `--reload`
- **Frontend:** Vite HMR (Hot Module Replacement)

### 3. Testear cambios

```bash
# Backend - Test endpoint
curl http://localhost:8000/health

# Frontend - Abrir navegador
http://localhost:5173
```

### 4. Detener sesión

```bash
# Detener Docker
docker compose down

# O mantener volúmenes
docker compose stop
```

---

## Recursos Adicionales

### Documentación

- [Fase 5 - Backend](backend/README_FASE5.md)
- [Fase 7 - Integración](INTEGRACION_FASE7.md)
- [Resumen Ejecutivo](FASE7_COMPLETADA.md)

### APIs

- **Backend Swagger:** http://localhost:8000/docs
- **NVIDIA NIM Docs:** https://docs.nvidia.com/nim/

### Endpoints Principales

```bash
# Auth
POST /v1/auth/token          # Login
POST /v1/auth/refresh        # Refresh token
GET  /v1/auth/me             # Current user

# IDP
POST /v1/idp/process         # Procesar documento
GET  /v1/idp/{id}            # Estado documento
DELETE /v1/idp/{id}          # Eliminar documento

# Chat
POST /v1/chat/message        # Enviar mensaje
POST /v1/chat/message/stream # Streaming SSE
GET  /v1/chat/conversations  # Listar conversaciones
```

---

## Soporte

Para issues o preguntas:

1. Revisar logs: `docker compose logs -f`
2. Verificar health: `curl http://localhost:8000/health`
3. Testear integración: `python backend/test_integracion.py`

---

*Quick Start Guide - IDP Asistente Contable*  
*Última actualización: 2026-03-10*
