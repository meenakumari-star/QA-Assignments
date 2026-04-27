import { expect, Locator } from '@playwright/test';
import { SweetShopBasePage } from './SweetShopBasePage';

/**
 * Page Object Model for Sweet Shop Sweets/Catalog Page
 * Handles product browsing and adding items to basket
 */
export class SweetsPage extends SweetShopBasePage {
  // Locators
  readonly productsGrid: Locator;
  readonly products: Locator;
  readonly addToBasketButtons: Locator;

  constructor(page: any) {
    super(page);
    
    // Initialize locators based on actual website Bootstrap structure
    this.productsGrid = this.page.locator('.container').nth(1); // Second container holds products
    this.products = this.page.locator('.card');
    this.addToBasketButtons = this.page.locator('a.btn.addItem, .card-footer a');
  }

  /**
   * Navigate to sweets page
   */
  async navigateToSweetsPage(): Promise<void> {
    await this.page.goto('/sweets');
    await this.waitForPageLoad();
  }

  /**
   * Navigate to sweets page (alias)
   */
  async navigateToSweets(): Promise<void> {
    await this.navigateToSweetsPage();
  }

  /**
   * Get product element by name
   * @param productName - Name of the product
   */
  getProductByName(productName: string): Locator {
    return this.page.locator('.card').filter({ has: this.page.locator(`.card-title:has-text("${productName}")`) });
  }

  /**
   * Add product to basket by name
   * @param productName - Name of the product to add
   */
  async addProductToBasket(productName: string): Promise<void> {
    const product = this.getProductByName(productName);
    const addButton = product.locator('a.btn.addItem, .card-footer a');
    
    await expect(addButton).toBeVisible({ timeout: 5000 });
    await addButton.click();
    
    // Wait for basket update
    await this.page.waitForTimeout(1000);
  }

  /**
   * Get add to basket button for a specific product
   * @param productName - Name of the product
   */
  getAddToBasketButton(productName: string): Locator {
    const product = this.getProductByName(productName);
    return product.locator('a.btn.addItem, .card-footer a');
  }

  /**
   * Verify product exists in the catalog
   * @param productName - Name of the product
   */
  async verifyProductExists(productName: string): Promise<void> {
    const product = this.getProductByName(productName);
    await expect(product).toBeVisible({ timeout: 10000 });
  }

  /**
   * Verify product price
   * @param productName - Name of the product
   * @param expectedPrice - Expected price string (e.g., "£1.00")
   */
  async verifyProductPrice(productName: string, expectedPrice: string): Promise<void> {
    const product = this.getProductByName(productName);
    await expect(product).toContainText(expectedPrice);
  }

  /**
   * Get total number of products displayed
   */
  async getProductCount(): Promise<number> {
    return await this.products.count();
  }

  /**
   * Verify expected number of products are displayed
   * @param expectedCount - Expected number of products
   */
  async verifyProductCount(expectedCount: number): Promise<void> {
    await expect(this.products).toHaveCount(expectedCount);
  }

  /**
   * Verify all add to basket buttons are visible
   */
  async verifyAddToBasketButtons(): Promise<void> {
    const buttonCount = await this.addToBasketButtons.count();
    expect(buttonCount).toBeGreaterThan(0);
    
    // Check first few buttons are visible and enabled
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = this.addToBasketButtons.nth(i);
      await expect(button).toBeVisible();
      await expect(button).toBeEnabled();
    }
  }

  /**
   * Rapidly add product multiple times
   * @param productName - Name of the product
   * @param count - Number of times to add
   */
  async rapidlyAddProduct(productName: string, count: number): Promise<void> {
    const addButton = this.getAddToBasketButton(productName);
    
    for (let i = 0; i < count; i++) {
      await addButton.click();
      await this.page.waitForTimeout(100); // Brief pause
    }
  }

  /**
   * Verify product description
   * @param productName - Name of the product
   * @param expectedDescription - Expected description text
   */
  async verifyProductDescription(productName: string, expectedDescription: string): Promise<void> {
    const product = this.getProductByName(productName);
    await expect(product).toContainText(expectedDescription);
  }

  /**
   * Verify all expected products from data
   * @param expectedProducts - Array of expected product objects
   */
  async verifyAllExpectedProducts(expectedProducts: any[]): Promise<void> {
    for (const product of expectedProducts) {
      await this.verifyProductExists(product.name);
      await this.verifyProductPrice(product.name, product.price);
    }
  }
}