import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should login successfully and redirect to dashboard', async ({ page }) => {
    await page.goto('/login');

    // Fill login form
    await page.fill('input[name="email"]', 'admin@idpcontable.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Verification
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    // Check if JWT is stored
    const token = await page.evaluate(() => localStorage.getItem('access_token'));
    expect(token).toBeTruthy();
  });

  test('should prevent access to protected routes when unauthenticated', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*login/);
  });
});
