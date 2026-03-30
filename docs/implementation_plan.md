# Phase 11: Dashboard Predictivo

## Goal
Add **predictive forecasting** to the existing Workspace and Finance dashboards. Replace hardcoded chart data with real data from the database, and add projection endpoints for tax forecasts, cash flow predictions, and KPI trends.

> [!IMPORTANT]
> **No Prophet dependency** — will use lightweight `numpy` polynomial regression + moving averages (already installed) to avoid heavy C++ build deps on Windows. If user wants Prophet later, it can be added as an optional dependency.

## Proposed Changes

### Backend — Prediction Service

#### [NEW] [forecast_service.py](file:///c:/Users/DiegoGzz/Documents/Programas/My-Projects/CPP_APP/IDP-App/idp-asistente-contable/backend/app/services/fiscal/forecast_service.py)

New forecasting service with 3 prediction engines:

1. **`CashFlowForecaster`** — Projects income/expenses for next 3–6 months
   - Input: historical document totals (ingresos/egresos) from DB
   - Method: 3-month weighted moving average + trend extrapolation
   - Output: monthly projections with confidence intervals

2. **`TaxForecaster`** — ISR/IVA monthly projections
   - Input: `TaxCalculator` results for past months
   - Method: linear regression on taxable income trend
   - Output: estimated ISR/IVA to pay per month

3. **`KPIForecaster`** — Processing volume and accuracy trends
   - Input: document processing stats (counts, confidence scores)
   - Method: simple moving average
   - Output: projected processing volume, estimated confidence

---

### Backend — API Endpoints

#### [MODIFY] [workspace.py](file:///c:/Users/DiegoGzz/Documents/Programas/My-Projects/CPP_APP/IDP-App/idp-asistente-contable/backend/app/api/workspace.py)

Add **2 new endpoints**:

- `GET /v1/workspace/forecast` — Returns cash flow + tax projections (6 months)
- `GET /v1/workspace/kpi-trends` — Returns monthly KPI trend data (last 6 + next 3 projected)

#### [MODIFY] [finance.py](file:///c:/Users/DiegoGzz/Documents/Programas/My-Projects/CPP_APP/IDP-App/idp-asistente-contable/backend/app/api/finance.py)

Enhance existing endpoints:

- `GET /v1/finance/chart-data` — Replace hardcoded array with real DB query + projected months marked with `projected: true`
- `GET /v1/finance/cash-flow` — New endpoint returning 12-month cash flow history + 6-month projections

---

### Frontend — Dashboard Views

#### [MODIFY] [Workspace.tsx](file:///c:/Users/DiegoGzz/Documents/Programas/My-Projects/CPP_APP/IDP-App/idp-asistente-contable/frontend/src/components/Workspace.tsx)

Add **new view** `predicciones` (accessible from sidebar):

- **Cash Flow Projection Chart** — Area chart with dashed line for projected months
- **Tax Forecast Cards** — ISR/IVA projections for next 3 months
- **KPI Trend Sparklines** — Mini charts showing processing volume trend

#### [MODIFY] [Finance.tsx](file:///c:/Users/DiegoGzz/Documents/Programas/My-Projects/CPP_APP/IDP-App/idp-asistente-contable/frontend/src/components/Finance.tsx)

- Replace hardcoded chart data with API call to `/v1/finance/chart-data`
- Add visual indicator for projected months (dashed bars, lighter opacity)
- Add `flujo-caja` view with 12+6 month area chart

#### [MODIFY] [api.ts](file:///c:/Users/DiegoGzz/Documents/Programas/My-Projects/CPP_APP/IDP-App/idp-asistente-contable/frontend/src/services/api.ts)

Add forecast API methods:
- `workspaceService.getForecast()` → `GET /v1/workspace/forecast`
- `workspaceService.getKpiTrends()` → `GET /v1/workspace/kpi-trends`
- `financeService.getCashFlow()` → `GET /v1/finance/cash-flow`

#### [MODIFY] [modules.store.ts](file:///c:/Users/DiegoGzz/Documents/Programas/My-Projects/CPP_APP/IDP-App/idp-asistente-contable/frontend/src/store/modules.store.ts)

Add forecast state + fetch actions.

---

## Verification Plan

### Automated Tests
```bash
pytest backend/tests/test_forecast_service.py -v
```
- Test moving average with known data series
- Test trend extrapolation returns expected projection count
- Test edge case: empty history returns zero projections

### Manual Verification
- Start backend + frontend dev servers
- Navigate to Workspace → Predicciones view
- Verify charts render with projected data
- Verify Finance charts show real+projected data
