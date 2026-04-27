import { test, expect } from '@playwright/test';

test.describe('Basic Sweet Shop Tests', () => {

  test('TC-BASIC-001: should load homepage', async ({ page }) => {
    await page.goto('https://sweetshop.netlify.app/');
    await expect(page).toHaveTitle(/Sweet Shop/i);
  });

  test('TC-BASIC-002: should navigate to sweets page', async ({ page }) => {
    await page.goto('https://sweetshop.netlify.app/');
    
    // Look for sweets link and click it
    const sweetsLink = page.locator('a[href="/sweets"], a:has-text("Sweets"), nav a:has-text("sweets")').first();
    await expect(sweetsLink).toBeVisible({ timeout: 10000 });
    await sweetsLink.click();
    
    await expect(page).toHaveURL(/.*\/sweets/);
  });

});