# Configuración Docker del Frontend - COMPLETADA

## 📋 Resumen

La configuración Docker del frontend React + Vite + TypeScript ha sido completada exitosamente.

## 📁 Archivos Creados/Actualizados

### 1. `frontend/Dockerfile` (Producción)
- **Multi-stage build**: Node.js para build + Nginx para producción
- **Build optimizado**: `npm ci` para instalación reproducible
- **Health check**: Endpoint `/health` para monitoreo
- **Puerto**: 80 (expuesto como 3000 en host)

### 2. `frontend/Dockerfile.dev` (Desarrollo)
- **Vite dev server**: Hot reload habilitado
- **Volúmenes**: Código montado para desarrollo
- **Puerto**: 5173

### 3. `frontend/nginx.conf`
- **SPA routing**: `try_files` para React Router
- **API proxy**: `/api` → `backend:8000`
- **Compresión Gzip**: Optimización de assets
- **Headers de seguridad**: X-Frame-Options, X-Content-Type-Options, etc.
- **Cacheo de estáticos**: 1 año para JS, CSS, imágenes
- **Health endpoint**: `/health` para monitoreo

### 4. `docker-compose.yml` (Actualizado)
- **5 servicios configurados**:
  1. `db` - PostgreSQL 15
  2. `chromadb` - Vector store
  3. `backend` - FastAPI
  4. `frontend-dev` - Vite (perfil: dev)
  5. `frontend` - Nginx (perfil: prod)

### 5. Scripts de Utilidad (Windows)
| Script | Propósito |
|--------|-----------|
| `docker-build-frontend.bat` | Build y deploy en producción |
| `docker-build-frontend-dev.bat` | Build y deploy en desarrollo |
| `docker-stop-frontend.bat` | Detener y eliminar contenedores |

### 6. `DOCKER_COMMANDS.md`
- Guía completa de comandos Docker
- Troubleshooting y verificación

## 🚀 Comandos de Ejecución

### Producción (Nginx - Puerto 3000)

```bash
# Opción 1: Usar script batch
docker-build-frontend.bat

# Opción 2: Comandos manuales
cd frontend
docker build -t idp-frontend:latest .
docker run -d -p 3000:80 --name idp-frontend idp-frontend:latest

# Opción 3: Docker Compose
docker compose --profile prod up -d
```

### Desarrollo (Vite - Puerto 5173)

```bash
# Opción 1: Usar script batch
docker-build-frontend-dev.bat

# Opción 2: Comandos manuales
cd frontend
docker build -f Dockerfile.dev -t idp-frontend:dev .
docker run -d -p 5173:5173 --name idp-frontend-dev idp-frontend:dev

# Opción 3: Docker Compose
docker compose --profile dev up -d
```

## ✅ Verificación

### 1. Health Check
```bash
# Producción
curl http://localhost:3000/health
# Respuesta: "healthy"

# Desarrollo
curl http://localhost:5173/
# Respuesta: HTML del frontend
```

### 2. Navegador
- **Producción**: http://localhost:3000
- **Desarrollo**: http://localhost:5173

### 3. Logs
```bash
# Producción
docker logs -f idp-frontend

# Desarrollo
docker logs -f idp-frontend-dev
```

## 🔧 Configuración de Nginx

### Features Implementadas

| Feature | Configuración |
|---------|--------------|
| **SPA Routing** | `try_files $uri $uri/ /index.html` |
| **API Proxy** | `/api` → `http://backend:8000` |
| **Gzip** | JS, CSS, JSON, XML, texto |
| **Security Headers** | X-Frame-Options, X-Content-Type-Options, XSS Protection |
| **Cache Estáticos** | 1 año (inmutable) |
| **Health Check** | `/health` endpoint |

### Proxy de API

El nginx.conf configura el proxy de API para que las peticiones del frontend al backend funcionen correctamente:

```nginx
location /api {
    proxy_pass http://backend:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

**En el frontend:**
```typescript
// Las peticiones a /api/* se proxyan automáticamente al backend
axios.get('/api/sat/expressiones')  // → http://backend:8000/api/sat/expressiones
```

## 📊 Arquitectura Docker

```
┌─────────────────────────────────────────────────────┐
│                    Docker Network                    │
│                     idp-network                      │
│                                                      │
│  ┌──────────────┐    ┌──────────────┐               │
│  │   frontend   │───▶│   backend    │               │
│  │  (nginx:80)  │    │ (fastapi:8k) │               │
│  │  host:3000   │    │  host:8000   │               │
│  └──────────────┘    └──────┬───────┘               │
│                             │                        │
│              ┌──────────────┴──────────────┐        │
│              │              │              │        │
│         ┌────▼────┐   ┌────▼────┐   ┌─────▼────┐  │
│         │   db    │   │ chroma  │   │   data   │  │
│         │ (5432)  │   │  (8000) │   │ volumes  │  │
│         └─────────┘   └─────────┘   └──────────┘  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## 🔍 Troubleshooting

### Docker no reconocido
```bash
# Verificar instalación
docker --version

# Si no está en PATH, agregar:
# C:\Program Files\Docker\Docker\resources\bin
```

### Puerto ya en uso
```bash
# Ver qué usa el puerto
netstat -ano | findstr :3000

# Detener contenedor existente
docker stop idp-frontend && docker rm idp-frontend
```

### Build falla
```bash
# Limpiar caché
docker builder prune -a

# Rebuild sin caché
docker build --no-cache -t idp-frontend:latest .
```

### Frontend no conecta al backend
1. Verificar que backend esté corriendo: `docker ps | grep backend`
2. Verificar logs del backend: `docker logs idp-backend`
3. Verificar red Docker: `docker network inspect idp-network`

## 📝 Próximos Pasos

1. **Tests del frontend**: Configurar Vitest + Testing Library
2. **CI/CD Pipeline**: GitHub Actions para build y deploy automático
3. **Variables de entorno**: Configurar `.env.production` para diferentes ambientes
4. **HTTPS**: Configurar SSL con Let's Encrypt en producción

## 📚 Referencias

- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Nginx para React SPA](https://mherman.org/blog/dockerizing-a-react-app/)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
