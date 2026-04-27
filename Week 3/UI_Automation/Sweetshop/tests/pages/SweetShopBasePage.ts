import { Page } from '@playwright/test';

/**
 * Base page class for Sweet Shop application
 * Contains common functionality and navigation methods
 */
export class SweetShopBasePage {
  constructor(public page: Page) {}

  /**
   * Navigate to a specific path
   * @param path - The path to navigate to
   */
  async navigate(path: string): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get current basket count from the header
   * @returns The number displayed in basket counter
   */
  async getBasketCount(): Promise<number> {
    const counter = this.page.locator('.basket-count, .cart-count, [data-testid="basket-count"]');
    const isVisible = await counter.isVisible({ timeout: 3000 });
    
    if (!isVisible) {
      return 0;
    }
    
    const text = await counter.textContent();
    return parseInt(text || '0', 10) || 0;
  }

  /**
   * Verify basket count matches expected value
   * @param expectedCount - Expected basket count
   */
  async verifyBasketCount(expectedCount: number): Promise<void> {
    const actualCount = await this.getBasketCount();
    if (actualCount !== expectedCount) {
      throw new Error(`Expected basket count ${expectedCount}, but got ${actualCount}`);
    }
  }

  /**
   * Take screenshot for debugging
   * @param name - Screenshot name
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }

  /**
   * Navigate to home page
   */
  async navigateToHome(): Promise<void> {
    await this.page.goto('/');
    await this.waitForPageLoad();
  }

  /**
   * Navigate to about page
   */
  async navigateToAbout(): Promise<void> {
    await this.page.goto('/about');
    await this.waitForPageLoad();
  }

  /**
   * Navigate to login page
   */
  async navigateToLogin(): Promise<void> {
    await this.page.goto('/login');
    await this.waitForPageLoad();
  }
}