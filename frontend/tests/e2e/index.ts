/**
 * E2E Tests - Índice Principal
 *
 * Este archivo re-exporta todos los módulos E2E para facilitar las importaciones.
 *
 * @module tests/e2e
 */

// Fixtures principales
export * from './fixtures'

// Page Objects
export { LoginPage } from './page-objects/LoginPage'
export { DashboardPage } from './page-objects/DashboardPage'
export { ChatPage } from './page-objects/ChatPage'
export { DocumentsPage } from './page-objects/DocumentsPage'

// Utils
export * from './utils/api-helper'
export * from './utils/test-data'

// Global setup
export { default as globalSetup } from './global-setup'
export { globalTeardown } from './global-setup'
