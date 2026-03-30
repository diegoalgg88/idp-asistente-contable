# Scripts de utilidad para Docker

## Build y ejecución del frontend

### Producción (Nginx - Puerto 3000)
```bash
# Build de la imagen
docker build -t idp-frontend:latest ./frontend

# Ejecutar contenedor
docker run -d -p 3000:80 --name idp-frontend idp-frontend:latest

# Ver logs
docker logs -f idp-frontend

# Detener contenedor
docker stop idp-frontend && docker rm idp-frontend
```

### Desarrollo (Vite - Puerto 5173)
```bash
# Build de la imagen dev
docker build -f frontend/Dockerfile.dev -t idp-frontend:dev ./frontend

# Ejecutar contenedor
docker run -d -p 5173:5173 --name idp-frontend-dev idp-frontend:dev

# Ver logs
docker logs -f idp-frontend-dev

# Detener contenedor
docker stop idp-frontend-dev && docker rm idp-frontend-dev
```

## Docker Compose

### Producción
```bash
# Iniciar todos los servicios (incluyendo frontend production)
docker compose --profile prod up -d

# Ver logs
docker compose logs -f frontend

# Detener
docker compose --profile prod down
```

### Desarrollo
```bash
# Iniciar todos los servicios (incluyendo frontend dev)
docker compose --profile dev up -d

# Ver logs
docker compose logs -f frontend-dev

# Detener
docker compose --profile dev down
```

## Verificación

### Probar acceso al frontend
```bash
# Producción
curl http://localhost:3000/health

# Desarrollo
curl http://localhost:5173/
```

### Abrir en navegador
```bash
# Producción
start http://localhost:3000

# Desarrollo
start http://localhost:5173
```

## Troubleshooting

### Limpiar caché de Docker
```bash
docker builder prune -a
docker system prune -a
```

### Rebuild sin caché
```bash
docker build --no-cache -t idp-frontend:latest ./frontend
```

### Verificar imagen
```bash
docker images | grep idp-frontend
docker inspect idp-frontend:latest
```
