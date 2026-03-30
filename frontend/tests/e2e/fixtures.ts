/**
 * Fixtures E2E - Archivo Principal
 *
 * Este archivo re-exporta los fixtures desde el módulo principal.
 * Usar este archivo para imports compatibles con tests existentes.
 *
 * @module tests/e2e/fixtures
 */

// Re-exportar todo desde test-fixtures.ts
export * from './fixtures/test-fixtures'

// Importar para compatibilidad con tests existentes
import { test, expect } from './fixtures/test-fixtures'

// Exportar por defecto para compatibilidad
export { test, expect }

// Exportar page objects para compatibilidad
export { LoginPage } from './page-objects/LoginPage'
export { DashboardPage } from './page-objects/DashboardPage'
export { ChatPage } from './page-objects/ChatPage'
export { DocumentsPage } from './page-objects/DocumentsPage'

// Exportar utils para compatibilidad
export * from './utils/test-data'
