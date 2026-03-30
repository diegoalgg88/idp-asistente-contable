# GitHub Environments Configuration

Este documento describe la configuración requerida para los entornos de GitHub Actions.

## Entornos Requeridos

### 1. Staging

**Configuración en GitHub:**
1. Ve a `Settings` > `Environments` > `New environment`
2. Nombre: `staging`
3. Configura las siguientes opciones:

**Variables de Entorno (Environment Variables):**
```bash
DEPLOY_URL=https://staging.idp-app.example.com
DATABASE_URL=postgresql://user:pass@staging-db.example.com:5432/idp_staging
REGISTRY_URL=ghcr.io
IMAGE_NAME=diegogzz/idp-asistente-contable
```

**Secrets Requeridos:**
```bash
DOCKER_USERNAME          # Usuario del registry Docker
DOCKER_PASSWORD          # Password/token del registry
DEPLOY_TOKEN             # Token para deploy (kubectl, SSH, etc.)
DATABASE_PASSWORD        # Contraseña de la base de datos
```

**Protection Rules (Opcional):**
- ✅ Required reviewers: Agrega a los miembros del equipo que deben aprobar
- ⏱️ Wait timer: 0 minutos (deploy inmediato)

---

### 2. Production

**Configuración en GitHub:**
1. Ve a `Settings` > `Environments` > `New environment`
2. Nombre: `production`
3. Configura las siguientes opciones:

**Variables de Entorno (Environment Variables):**
```bash
DEPLOY_URL=https://idp-app.example.com
DATABASE_URL=postgresql://user:pass@prod-db.example.com:5432/idp_prod
REGISTRY_URL=ghcr.io
IMAGE_NAME=diegogzz/idp-asistente-contable
```

**Secrets Requeridos:**
```bash
DOCKER_USERNAME          # Usuario del registry Docker
DOCKER_PASSWORD          # Password/token del registry
DEPLOY_TOKEN             # Token para deploy (kubectl, SSH, etc.)
DATABASE_PASSWORD        # Contraseña de la base de datos
SENTRY_DSN               # DSN para monitoreo de errores
MONITORING_API_KEY       # API key para monitoreo
```

**Protection Rules (Requerido):**
- ✅ Required reviewers: Agrega a los maintainers/owners
- ⏱️ Wait timer: 5 minutos (tiempo para cancelar si hay problemas)
- ✅ Deployment branches: `main` únicamente

---

## Configurar Secrets del Repositorio

Adicional a los secrets por entorno, configura estos secrets a nivel repositorio:

**En `Settings` > `Secrets and variables` > `Actions` > `New repository secret`:**

```bash
# GitHub Container Registry
GITHUB_TOKEN             # Automático, no es necesario crearlo

# NVIDIA NIM API
NVIDIA_API_KEY           # Tu API key de NVIDIA NIM

# Sentry (monitoreo)
SENTRY_ORG              # Tu organización en Sentry
SENTRY_PROJECT          # Nombre del proyecto en Sentry

# Codecov (cobertura de tests)
CODECOV_TOKEN           # Token de Codecov (opcional)
```

---

## Pasos de Configuración

### Paso 1: Crear Ambientes

1. Ve a `https://github.com/{org}/{repo}/settings/environments`
2. Click en `New environment`
3. Crea `staging` primero
4. Crea `production` después

### Paso 2: Configurar Staging

1. Agrega variables de entorno
2. Agrega secrets
3. Configura reviewers (opcional)
4. Guarda cambios

### Paso 3: Configurar Production

1. Agrega variables de entorno
2. Agrega secrets
3. **Configura required reviewers** (importante)
4. Configura wait timer (recomendado 5 min)
5. Restringe deployment branches a `main`
6. Guarda cambios

### Paso 4: Verificar Configuración

Ejecuta el workflow manual para verificar:

```bash
# En GitHub UI:
# Actions > CD > Run workflow > Select: staging
```

---

## Troubleshooting

### Error: "Environment not found"

**Causa:** El ambiente no está configurado en GitHub.

**Solución:**
1. Verifica que el ambiente existe en `Settings > Environments`
2. Asegúrate de que el nombre coincide exactamente (case-sensitive)

### Error: "Secret not found"

**Causa:** El secret no está configurado o tiene nombre incorrecto.

**Solución:**
1. Verifica el nombre del secret (case-sensitive)
2. Asegúrate de que está en el scope correcto (repo vs environment)

### Error: "Deployment blocked by required reviewers"

**Causa:** El ambiente requiere aprobación antes de deploy.

**Solución:**
1. Un reviewer debe aprobar en la UI de GitHub
2. Ve a `Actions` > workflow > `Review deployments`
3. Selecciona los ambientes y click en `Approve and deploy`

---

## Referencias

- [GitHub Environments Documentation](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Deployment Protection Rules](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment#deployment-protection-rules)
