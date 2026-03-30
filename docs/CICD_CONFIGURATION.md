# CI/CD Configuration Guide

## 📋 Overview

Este proyecto cuenta con una configuración completa de CI/CD utilizando GitHub Actions para automatizar tests, builds y deployments.

## 🗂️ Archivos Configurados

### Workflows (`.github/workflows/`)

| Workflow | Archivo | Propósito |
|----------|---------|-----------|
| **CI** | `ci.yml` | Continuous Integration - Lint, type-check, tests, build |
| **CD** | `cd.yml` | Continuous Deployment - Staging y Production |
| **E2E PR** | `e2e-pr.yml` | E2E Tests en Pull Requests |
| **Release** | `release.yml` | Creación automática de releases con assets |

### Templates (`.github/`)

| Archivo | Propósito |
|---------|-----------|
| `ISSUE_TEMPLATE/bug_report.md` | Plantilla para reporte de bugs |
| `ISSUE_TEMPLATE/feature_request.md` | Plantilla para solicitud de features |
| `PULL_REQUEST_TEMPLATE.md` | Checklist y guía para PRs |
| `CODEOWNERS` | Define dueños de código por directorio |
| `environment-configuration.md` | Configuración de entornos en GitHub |

### Docker

| Archivo | Propósito |
|---------|-----------|
| `docker-compose.ci.yml` | Configuración de servicios para CI |

### Frontend Scripts (`frontend/package.json`)

| Script | Propósito |
|--------|-----------|
| `build:ci` | Build con reporte para CI |
| `lint:ci` | Linting con output JUnit |
| `type-check:ci` | Type checking para CI |
| `test:ci` | Tests con cobertura y reporte JUnit |
| `test:e2e:ci` | E2E tests con reporter GitHub |

---

## 🔄 Flujos de Trabajo

### CI Pipeline (`ci.yml`)

**Triggers:**
- Push a `main` o `develop`
- Pull Request a `main` o `develop`

**Jobs:**

```
┌─────────────────────┐
│  Lint & Type Check  │
│  - Frontend lint    │
│  - Frontend tsc     │
│  - Backend flake8   │
│  - Backend mypy     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│     Unit Tests      │
│  - Frontend vitest  │
│  - Backend pytest   │
│  - Coverage report  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│     E2E Tests       │
│  - Playwright       │
│  - Report upload    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│       Build         │
│  - Frontend build   │
│  - Artifact upload  │
└─────────────────────┘
```

### CD Pipeline (`cd.yml`)

**Triggers:**
- Push de tag semver (`v1.0.0`)
- Workflow dispatch manual

**Flujo:**

```
┌─────────────────────┐
│  Deploy to Staging  │
│  - Build Docker     │
│  - Push a registry  │
│  - Deploy staging   │
└──────────┬──────────┘
           │
           ▼ (manual approval)
┌─────────────────────┐
│ Deploy to Production│
│  - Environment: prod│
│  - Required reviews │
│  - Deploy production│
└─────────────────────┘
```

### E2E en PRs (`e2e-pr.yml`)

**Triggers:**
- PR abierto, sincronizado o reabierto

**Flujo:**

```
┌──────────────────────┐
│  Start Services      │
│  - Docker Compose    │
│  - DB + Backend      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Health Check        │
│  - Wait for backend  │
│  - Max 30 attempts   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Run E2E Tests       │
│  - Playwright        │
│  - Chromium only     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Comment PR          │
│  - Test results      │
│  - Link to report    │
└──────────────────────┘
```

### Release Automático (`release.yml`)

**Triggers:**
- Push de tag semver (`v*.*.*`)

**Flujo:**

```
┌─────────────────────┐
│  Create Release     │
│  - Generate changelog│
│  - Create on GitHub │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Build & Upload     │
│  - Frontend dist.zip│
│  - Backend .whl     │
│  - Upload assets    │
└─────────────────────┘
```

---

## 🚀 Configuración Inicial

### Paso 1: Configurar Entornos en GitHub

1. Ve a `Settings` > `Environments` > `New environment`
2. Crea `staging` y `production`
3. Agrega variables y secrets (ver `.github/environment-configuration.md`)

### Paso 2: Configurar Secrets del Repositorio

```bash
# En Settings > Secrets and variables > Actions

# NVIDIA NIM API
NVIDIA_API_KEY=nvapi-xxx

# Docker Registry (si usas Docker Hub)
DOCKER_USERNAME=tu-usuario
DOCKER_PASSWORD=tu-password

# Sentry (opcional)
SENTRY_ORG=tu-org
SENTRY_PROJECT=tu-proyecto
```

### Paso 3: Actualizar CODEOWNERS

Edita `.github/CODEOWNERS` para agregar los usuarios correctos:

```
* @diegogzz
/frontend/ @frontend-team
/backend/ @backend-team
```

### Paso 4: Configurar Branch Protection

**Para `main`:**
1. `Settings` > `Branches` > `Add branch protection rule`
2. Pattern: `main`
3. Enable:
   - ✅ Require pull request reviews
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - ✅ Include administrators

**Status checks requeridos:**
- `lint-and-type-check`
- `unit-tests`
- `e2e-tests`
- `build`

---

## 📊 Badges para README

Los siguientes badges se agregaron al `README.md`:

```markdown
![CI](https://github.com/diegogzz/idp-asistente-contable/actions/workflows/ci.yml/badge.svg)
![CD](https://github.com/diegogzz/idp-asistente-contable/actions/workflows/cd.yml/badge.svg)
![E2E Tests](https://github.com/diegogzz/idp-asistente-contable/actions/workflows/e2e-pr.yml/badge.svg)
![Release](https://github.com/diegogzz/idp-asistente-contable/actions/workflows/release.yml/badge.svg)
```

---

## 🧪 Comandos de CI en Frontend

### Local Testing

```bash
# Lint
npm run lint

# Type check
npm run type-check

# Unit tests
npm run test:ci

# E2E tests
npm run test:e2e:ci

# Build
npm run build:ci
```

### Outputs

| Comando | Output | Ubicación |
|---------|--------|-----------|
| `lint:ci` | JUnit XML | `eslint-report.xml` |
| `test:ci` | JUnit XML + Coverage | `test-results.xml`, `coverage/` |
| `test:e2e:ci` | GitHub reporter | `playwright-report/` |
| `build:ci` | Build report | Console output |

---

## 🔍 Monitoreo de Pipelines

### Ver Status de Workflows

```bash
# GitHub UI
https://github.com/{org}/{repo}/actions

# GitHub CLI
gh run list
gh run view <run-id>
gh run watch <run-id>
```

### Download Artifacts

```bash
# GitHub CLI
gh run download <run-id> --name frontend-dist
gh run download <run-id> --name playwright-report
```

### Re-run Jobs

```bash
# GitHub CLI
gh run rerun <run-id>
gh run rerun <run-id> --job <job-id>
```

---

## 🛠️ Troubleshooting

### CI Fallida - Lint Errors

```bash
# Local
npm run lint
npm run lint:ci

# Fix automático
npm run lint -- --fix
```

### CI Fallida - Type Errors

```bash
# Local
npm run type-check
npm run type-check:ci

# Ver errores detallados
npx tsc --noEmit --pretty
```

### CI Fallida - Tests

```bash
# Local
npm run test:ci
npm run test:coverage

# Ver reporte
npm run test:e2e:report
```

### E2E Fallida en PR

1. Revisa el comentario del bot en el PR
2. Descarga el artifact `playwright-report`
3. Abre `index.html` localmente
4. Ejuta tests en modo debug: `npm run test:e2e:debug`

### CD Fallida - Deploy

1. Verifica logs del workflow
2. Checa que los secrets estén configurados
3. Verifica que el ambiente existe en GitHub
4. Revisa approval requirements

---

## 📈 Métricas y Reportes

### Cobertura de Tests

Los reportes de cobertura se generan en:
- Backend: `backend/coverage.xml`
- Frontend: `frontend/coverage/`

**Integración con Codecov (opcional):**

```yaml
# Agregar al final de ci.yml
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v4
  with:
    token: ${{ secrets.CODECOV_TOKEN }}
    files: backend/coverage.xml,frontend/coverage/coverage-final.json
```

### Playwright Reports

Los reports de E2E se suben como artifacts y están disponibles por 30 días.

**Ver reporte:**
1. Ve al workflow run en GitHub Actions
2. Download artifact `playwright-report`
3. Extrae y abre `index.html`

---

## 🔐 Seguridad

### Secrets

- ✅ Nunca commits secrets al repositorio
- ✅ Usa GitHub Secrets para credenciales
- ✅ Usa `.env.example` como plantilla sin valores reales

### Branch Protection

- ✅ Requiere PR reviews
- ✅ Requiere status checks passing
- ✅ Bloquea force pushes

### Code Owners

- ✅ Revisores automáticos por directorio
- ✅ Bloquea merge sin approval de owners

---

## 📚 Referencias

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Environments](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
- [Playwright GitHub Action](https://github.com/microsoft/playwright-github-action)
- [Docker Build Push Action](https://github.com/docker/build-push-action)

---

## ✅ Checklist de Verificación

- [ ] Workflows creados en `.github/workflows/`
- [ ] Templates de issues creados
- [ ] PR template creado
- [ ] CODEOWNERS configurado
- [ ] docker-compose.ci.yml creado
- [ ] Scripts de CI en package.json
- [ ] Badges en README.md
- [ ] Entornos configurados en GitHub
- [ ] Secrets configurados
- [ ] Branch protection rules activadas
- [ ] Primer workflow ejecutado exitosamente
