# Data Directory

Este directorio contiene la **persistencia de datos** del backend para la aplicación IDP Asistente Contable.

## 📁 Estructura

```
data/
├── chroma_data/         # Vector Store (ChromaDB) - RAG embeddings
│   └── .gitkeep
└── pg_data/             # PostgreSQL Database - Modelos relacionales
    └── .gitkeep
```

## 🔗 Relación con el Backend

### ChromaDB (`chroma_data/`)

| Componente | Ubicación | Propósito |
|------------|-----------|-----------|
| **Vector Store** | `backend/app/services/rag_service.py` | Almacenamiento de embeddings para RAG |
| **Embeddings** | NVIDIA nv-embedqa-e5-v5 (1024 dimensiones) | Vectorización de documentos contables |
| **Colecciones** | `rag_collections` | Documentos por usuario/temática |

**Flujo:**
```
API RAG (/v1/rag/*)
    ↓
RAGService (backend/app/services/rag_service.py)
    ↓
ChromaDB Client
    ↓
data/chroma_data/  (persistencia de vectores)
```

### PostgreSQL (`pg_data/`)

| Modelo | Tabla | Ubicación |
|--------|-------|-----------|
| **User** | `users` | `backend/app/models/user.py` |
| **Document** | `documents` | `backend/app/models/document.py` |
| **Conversation** | `conversations` | `backend/app/models/conversation.py` |
| **Message** | `messages` | `backend/app/models/message.py` |

**Flujo:**
```
API Endpoints (/v1/*)
    ↓
SQLAlchemy Models (backend/app/models/)
    ↓
AsyncSession (asyncpg)
    ↓
PostgreSQL Server
    ↓
data/pg_data/  (persistencia de datos relacionales)
```

## 🐳 Docker Volumes

El `docker-compose.yml` monta estos volúmenes para persistencia:

```yaml
services:
  postgres:
    image: postgres:15-alpine
    volumes:
      - ./data/pg_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: idp_contable
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}

  chromadb:
    image: chromadb/chroma:latest
    volumes:
      - ./data/chroma_data:/chroma/chroma
    ports:
      - "8001:8000"
```

### ⚠️ Importante

- **No eliminar** estos directorios - contienen datos de producción
- Los archivos `.gitkeep` aseguran que Git trackee los directorios vacíos
- Los datos reales se generan al ejecutar la aplicación por primera vez

## 💾 Backup y Restore

### Backup Completo

```bash
# Crear backup comprimido
tar -czf data-backup-$(date +%Y%m%d).tar.gz data/

# Backup selectivo (solo PostgreSQL)
docker exec idp-postgres pg_dump -U postgres idp_contable > pg_backup.sql

# Backup selectivo (solo ChromaDB)
tar -czf chroma-backup.tar.gz data/chroma_data/
```

### Restore

```bash
# Restaurar backup completo
tar -xzf data-backup-YYYYMMDD.tar.gz

# Restaurar PostgreSQL
cat pg_backup.sql | docker exec -i idp-postgres psql -U postgres idp_contable

# Restaurar ChromaDB
tar -xzf chroma-backup.tar.gz
```

## 🧹 Limpieza de Datos (Desarrollo)

```bash
# ⚠️ ADVERTENCIA: Esto elimina TODOS los datos

# Reset PostgreSQL
docker-compose down -v
rm -rf data/pg_data/*

# Reset ChromaDB
rm -rf data/chroma_data/*

# Re-inicializar
docker-compose up -d postgres chromadb
```

## 📊 Estadísticas de Almacenamiento

| Tipo de Dato | Tamaño Estimado | Crecimiento |
|--------------|-----------------|-------------|
| **PostgreSQL** | ~10-50 MB inicial | ~5 MB/usuario/mes |
| **ChromaDB** | ~100-500 MB inicial | ~50 MB/usuario/mes |

**Monitoreo:**
```bash
# Tamaño PostgreSQL
du -sh data/pg_data/

# Tamaño ChromaDB
du -sh data/chroma_data/
```

## 🔒 Seguridad

- ✅ Los archivos de datos están en `.gitignore` (no se commitean)
- ✅ Solo el usuario de Docker tiene acceso de escritura
- ✅ Los backups deben cifrarse si contienen datos de usuarios
- ✅ No compartir backups con datos sensibles

## 📝 Archivos de Configuración Relacionados

| Archivo | Propósito |
|---------|-----------|
| `backend/.env` | Credenciales de database |
| `backend/app/core/config.py` | Configuración de conexión DB |
| `backend/app/db/session.py` | SQLAlchemy async session |
| `docker-compose.yml` | Volumes y servicios de datos |

## 🆘 Troubleshooting

### Problema: ChromaDB no inicia
```bash
# Verificar permisos
ls -la data/chroma_data/

# Resetear (desarrollo solo)
rm -rf data/chroma_data/*
docker-compose restart chromadb
```

### Problema: PostgreSQL corrupto
```bash
# Ver logs
docker logs idp-postgres

# Re-inicializar (pierde datos)
docker-compose down -v
rm -rf data/pg_data/*
docker-compose up -d postgres
```

### Problema: Disco lleno
```bash
# Verificar tamaño
du -sh data/

# Limpiar colecciones ChromaDB viejas
curl -X DELETE http://localhost:8001/api/v1/collections/{nombre}

# Vacuum PostgreSQL
docker exec idp-postgres psql -U postgres -c "VACUUM FULL;"
```

---

**Documentación relacionada:**
- Backend: `backend/docs/BACKEND_KNOWLEDGE_MAP.md`
- API Endpoints: `http://localhost:8000/docs` (Swagger UI)
- Docker: `docker-compose.yml`
