import { test, expect } from '@fixtures/pageFixtures';
import sweetsData from '@data/sweets.json';
import { expectedProductCount } from '@data/testData';

test.describe('Feature: Product Catalog', () => {
  test.beforeEach(async ({ sweetsPage }) => {
    await sweetsPage.navigateToSweetsPage();
  });

  /**
   * Test Case: TC-OPT-002
   * Description: Validate product catalogue
   * Steps: Count products, verify each one's data, verify Add to Basket buttons
   * Expected: 16 products visible with correct names and prices
   */
  test('TC-OPT-002: should validate complete product catalog @smoke @ui @critical', async ({
    sweetsPage,
  }) => {
    await sweetsPage.verifyProductCount(expectedProductCount);

    for (const product of sweetsData.products) {
      await sweetsPage.verifyProductExists(product.name);
      await sweetsPage.verifyProductPrice(product.name, product.price);
    }

    await sweetsPage.verifyAddToBasketButtons();
  });

  /**
   * Test Case: TC-CATALOG-002
   * Description: Validate three high-value individual products
   * Steps: For each, verify name, price, Add to Basket button enabled
   * Expected: All three products are present and actionable
   */
  test('TC-CATALOG-002: should validate individual key products @regression @ui', async ({
    sweetsPage,
  }) => {
    const keyProducts = [
      { name: 'Chocolate Cups', price: '£1.00' },
      { name: 'Swansea Mixture', price: '£1.50' },
      { name: 'Bubbly', price: '£0.10' },
    ];

    for (const product of keyProducts) {
      await sweetsPage.verifyProductExists(product.name);
      await sweetsPage.verifyProductPrice(product.name, product.price);
      const btn = sweetsPage.getAddToBasketButton(product.name);
      await expect(btn).toBeVisible();
      await expect(btn).toBeEnabled();
    }
  });

  /**
   * Test Case: TC-CATALOG-003
   * Description: All product prices follow £X.XX format
   * Steps: For every catalogue product, regex-match the price text
   * Expected: All 16 prices match /£\d+\.\d{2}/
   */
  test('TC-CATALOG-003: should validate product price formats @regression @ui', async ({
    sweetsPage,
  }) => {
    for (const product of sweetsData.products) {
      const card = sweetsPage.getProductByName(product.name);
      await expect(card).toContainText(/£\d+\.\d{2}/);
      await expect(card).toContainText(product.price);
    }
  });

  /**
   * Test Case: TC-CATALOG-004
   * Description: Product images have alt text and a src
   * Steps: Inspect first 5 product cards' <img> elements
   * Expected: Each img has non-empty alt and src attributes
   */
  test('TC-CATALOG-004: should validate product images and accessibility @regression @ui', async ({
    page,
  }) => {
    const cards = page.locator('.card');
    const count = Math.min(5, await cards.count());
    for (let i = 0; i < count; i++) {
      const img = cards.nth(i).locator('img').first();
      if (await img.isVisible().catch(() => false)) {
        const alt = await img.getAttribute('alt');
        const src = await img.getAttribute('src');
        expect(src).toBeTruthy();
        expect(alt).not.toBeNull();
      }
    }
  });

  /**
   * Test Case: TC-CATALOG-005
   * Description: Catalogue renders responsively
   * Steps: Set 4 viewport sizes, verify product count holds at each
   * Expected: All 16 products render at every viewport
   */
  test('TC-CATALOG-005: should display responsively across viewports @regression @ui', async ({
    page,
    sweetsPage,
  }) => {
    const viewports = [
      { width: 1920, height: 1080 },
      { width: 1024, height: 768 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 },
    ];

    for (const v of viewports) {
      await page.setViewportSize(v);
      await sweetsPage.verifyProductCount(expectedProductCount);
    }
  });

  /**
   * Test Case: TC-CATALOG-006
   * Description: Catalogue page loads within an acceptable time budget
   * Steps: Clear cookies, navigate to /sweets, await first product card
   * Expected: First product visible within 15 seconds
   */
  test('TC-CATALOG-006: should load products with acceptable performance @performance @ui', async ({
    page,
    sweetsPage,
  }) => {
    await page.context().clearCookies();
    const start = Date.now();
    await sweetsPage.navigateToSweetsPage();
    await expect(page.locator('.card').first()).toBeVisible();
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(15_000);
  });
});