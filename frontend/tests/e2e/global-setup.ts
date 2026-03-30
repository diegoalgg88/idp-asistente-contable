/**
 * Global Setup para Tests E2E
 *
 * Configuración global que se ejecuta antes de todos los tests.
 * - Verifica que el backend esté disponible
 * - Crea usuario de prueba por defecto
 * - Configura el entorno de testing
 *
 * @module tests/e2e/global-setup
 */

import { FullConfig } from '@playwright/test'
import { ApiHelper } from './utils/api-helper'
import { TEST_CREDENTIALS } from './utils/test-data'

/**
 * Setup global ejecutado antes de todos los tests
 *
 * @param config - Configuración completa de Playwright
 */
export default async function globalSetup(config: FullConfig) {
  console.log('🚀 Iniciando Global Setup para E2E Tests...')

  const { baseURL } = config.projects[0].use
  console.log(`📡 Base URL: ${baseURL}`)

  // Crear API request context para setup
  const { request } = await import('@playwright/test')
  const apiContext = await request.newContext()
  const apiHelper = new ApiHelper(apiContext)

  try {
    // 1. Verificar health del backend
    console.log('🏥 Verificando health del backend...')
    const isHealthy = await apiHelper.checkHealth()

    if (isHealthy) {
      console.log('✅ Backend está saludable')
    } else {
      console.warn('⚠️ Backend no disponible - los tests usarán mocks')
    }

    // 2. Crear usuario de prueba por defecto
    console.log('👤 Creando usuario de prueba por defecto...')
    try {
      const testUser = await apiHelper.setupTestUser()
      console.log(`✅ Usuario creado: ${testUser.email}`)

      // Guardar credenciales en variables de entorno para los tests
      process.env.TEST_USER_EMAIL = testUser.email
      process.env.TEST_USER_PASSWORD = testUser.password
    } catch (error) {
      console.warn('⚠️ No se pudo crear usuario - usando credenciales por defecto')
      process.env.TEST_USER_EMAIL = TEST_CREDENTIALS.admin.email
      process.env.TEST_USER_PASSWORD = TEST_CREDENTIALS.admin.password
    }

    // 3. Verificar frontend
    console.log('🌐 Verificando frontend...')
    try {
      const response = await apiContext.get(baseURL as string)
      if (response.ok()) {
        console.log('✅ Frontend está disponible')
      } else {
        console.warn(`⚠️ Frontend respondió con status: ${response.status()}`)
      }
    } catch (error) {
      console.warn('⚠️ Frontend no disponible - asegurarse de ejecutar `npm run dev`')
    }

    // 4. Configurar variables de entorno para tests
    process.env.E2E_TEST_MODE = 'true'
    process.env.E2E_SETUP_COMPLETE = 'true'

    console.log('✅ Global Setup completado exitosamente')
    console.log('')
    console.log('📋 Resumen:')
    console.log(`   - Backend: ${isHealthy ? '✅ Disponible' : '⚠️ No disponible (usando mocks)'}`)
    console.log(`   - Frontend: ${baseURL}`)
    console.log(`   - Test User: ${process.env.TEST_USER_EMAIL}`)
    console.log('')

    return 0
  } catch (error) {
    console.error('❌ Error en Global Setup:', error)
    // No fallar el setup - permitir que los tests usen mocks
    process.env.E2E_SETUP_COMPLETE = 'true'
    process.env.E2E_TEST_MODE = 'true'
    return 0
  } finally {
    await apiContext.dispose()
  }
}

/**
 * Teardown global ejecutado después de todos los tests
 *
 * @param config - Configuración completa de Playwright
 */
export async function globalTeardown(config: FullConfig) {
  console.log('🧹 Iniciando Global Teardown...')

  const { request } = await import('@playwright/test')
  const apiContext = await request.newContext()
  const apiHelper = new ApiHelper(apiContext)

  try {
    // Limpiar datos de prueba
    await apiHelper.cleanupTestData()
    console.log('✅ Datos de prueba limpiados')
  } catch (error) {
    console.warn('⚠️ Error limpiando datos de prueba:', error)
  } finally {
    await apiContext.dispose()
  }

  // Limpiar variables de entorno
  delete process.env.E2E_TEST_MODE
  delete process.env.E2E_SETUP_COMPLETE

  console.log('✅ Global Teardown completado')
}
