/**
 * Reconciliation E2E Tests
 * Tests end-to-end para el flujo de conciliación bancaria
 */

import { test, expect } from '@playwright/test';

test.describe('Conciliación Bancaria - E2E', () => {
  // Test 1: Navegar a la página de conciliación
  test('debe navegar a la página de conciliación correctamente', async ({ page }) => {
    await page.goto('/');
    
    // Iniciar sesión si es necesario
    await page.waitForURL(/\/dashboard/);
    
    // Hacer clic en Finanzas > Bancos / Conciliación
    await page.click('button:has-text("Finanzas")');
    await page.click('text=Bancos / Conciliación');
    
    // Verificar que estamos en la página de conciliación
    await expect(page).toHaveURL(/\/reconciliation/);
    await expect(page.getByText('Conciliación Bancaria')).toBeVisible();
  });

  // Test 2: Subir estado de cuenta
  test('debe permitir subir un estado de cuenta CSV', async ({ page }) => {
    await page.goto('/reconciliation');
    
    // Hacer clic en "Subir Estado de Cuenta"
    await page.click('button:has-text("Subir Estado de Cuenta")');
    
    // Verificar que el dialog está abierto
    await expect(page.getByText('Subir Estado de Cuenta Bancario')).toBeVisible();
    
    // Crear un archivo CSV de prueba
    const csvContent = `Fecha,Concepto,Cargo,Abono,Saldo,Referencia
01/03/2026,PAGO SERVICIO AZUL SA DE CV,1500.00,,5000.00,REF123456
02/03/2026,TRANSFERENCIA RECIBIDA,,3000.00,8000.00,REF789012`;
    
    const testFile = new Buffer(csvContent);
    
    // Subir archivo
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'estado_cuenta.csv',
      mimeType: 'text/csv',
      buffer: testFile,
    });
    
    // Verificar que el archivo se seleccionó
    await expect(page.getByText('estado_cuenta.csv')).toBeVisible();
    
    // Hacer clic en "Subir Estado de Cuenta"
    await page.click('button:has-text("Subir Estado de Cuenta")');
    
    // Esperar a que se complete la carga
    await expect(page.getByText('Procesando')).toBeVisible({ timeout: 5000 });
  });

  // Test 3: Ver tabla de matches
  test('debe mostrar la tabla de matches después de procesar', async ({ page }) => {
    await page.goto('/reconciliation');
    
    // Esperar a que la tabla esté visible
    const table = page.locator('table');
    await expect(table).toBeVisible();
    
    // Verificar columnas de la tabla
    await expect(page.getByText('Tipo')).toBeVisible();
    await expect(page.getByText('Confianza')).toBeVisible();
    await expect(page.getByText('Fecha Banco')).toBeVisible();
    await expect(page.getByText('Concepto Banco')).toBeVisible();
    await expect(page.getByText('Monto Banco')).toBeVisible();
  });

  // Test 4: Aplicar filtros
  test('debe permitir filtrar por tipo de match', async ({ page }) => {
    await page.goto('/reconciliation');
    
    // Abrir filtros
    await page.click('button:has-text("Filtros")');
    
    // Filtrar por tipo "Exacto"
    await page.click('select#match-type');
    await page.click('text=Exacto');
    
    // Verificar que se aplicó el filtro
    await expect(page.getByText('Tipo: exact')).toBeVisible();
  });

  // Test 5: Confirmar match
  test('debe permitir confirmar un match', async ({ page }) => {
    await page.goto('/reconciliation');
    
    // Buscar el botón de acciones del primer match
    const actionButton = page.locator('button[aria-label="More horizontal"]').first();
    await actionButton.click();
    
    // Hacer clic en "Confirmar"
    await page.click('text=Confirmar');
    
    // Verificar que el match se confirmó
    await expect(page.getByText('Confirmado')).toBeVisible();
  });

  // Test 6: Rechazar match
  test('debe permitir rechazar un match con razón', async ({ page }) => {
    await page.goto('/reconciliation');
    
    // Buscar el botón de acciones del segundo match
    const actionButton = page.locator('button[aria-label="More horizontal"]').nth(1);
    await actionButton.click();
    
    // Hacer clic en "Rechazar"
    await page.click('text=Rechazar');
    
    // Ingresar razón del rechazo
    const promptDialog = page.locator('input[prompt]');
    if (await promptDialog.isVisible()) {
      await promptDialog.fill('No corresponde a esta operación');
      await page.keyboard.press('Enter');
    }
  });

  // Test 7: Ver pestaña de no conciliados
  test('debe mostrar la pestaña de no conciliados', async ({ page }) => {
    await page.goto('/reconciliation');
    
    // Hacer clic en la pestaña "No Conciliados"
    await page.click('text=No Conciliados');
    
    // Verificar que se muestra la sección
    await expect(page.getByText('No Conciliados')).toBeVisible();
  });

  // Test 8: Ver estadísticas
  test('debe mostrar estadísticas de conciliación', async ({ page }) => {
    await page.goto('/reconciliation');
    
    // Verificar que se muestran las tarjetas de estadísticas
    await expect(page.getByText('Total Matches')).toBeVisible();
    await expect(page.getByText('Matches Exactos')).toBeVisible();
    await expect(page.getByText('Matches Fuzzy')).toBeVisible();
    await expect(page.getByText('Validación LLM')).toBeVisible();
  });

  // Test 9: Validar responsive design
  test('debe ser responsive en móvil', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/reconciliation');
    
    // Verificar que el botón de upload es visible
    await expect(page.getByText('Subir Estado de Cuenta')).toBeVisible();
    
    // Verificar que las pestañas son accesibles
    await expect(page.getByText('Matches')).toBeVisible();
    await expect(page.getByText('No Conciliados')).toBeVisible();
  });

  // Test 10: Validar accesibilidad
  test('debe cumplir con estándares de accesibilidad', async ({ page }) => {
    await page.goto('/reconciliation');
    
    // Verificar que todos los botones tienen aria-label
    const buttons = page.locator('button');
    const count = await buttons.count();
    
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const text = await button.textContent();
      
      // Cada botón debe tener aria-label o texto visible
      expect(ariaLabel || text?.trim()).toBeTruthy();
    }
    
    // Verificar que las tablas tienen headers apropiados
    const table = page.locator('table');
    await expect(table).toHaveAttribute('role', 'table');
  });
});
