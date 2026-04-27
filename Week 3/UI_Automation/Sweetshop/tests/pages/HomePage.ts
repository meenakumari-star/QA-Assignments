import { expect, Locator } from '@playwright/test';
import { SweetShopBasePage } from './SweetShopBasePage';

/**
 * Page Object Model for Sweet Shop Home Page
 * Extends base functionality with home page specific methods
 */
export class HomePage extends SweetShopBasePage {
  readonly footer: Locator;
  // Locators
  readonly logo: Locator;
  readonly homeLink: Locator;
  readonly sweetsLink: Locator;
  readonly aboutLink: Locator;
  readonly loginLink: Locator;
  readonly basketLink: Locator;

  constructor(page: any) {
    super(page);
    
    // Initialize locators
    this.logo = this.page.locator('.navbar-brand img');
    this.homeLink = this.page.locator('a.navbar-brand[href="/"]');
    this.sweetsLink = this.page.locator('a.nav-link[href="/sweets"]');
    this.aboutLink = this.page.locator('a.nav-link[href="/about"]');
    this.loginLink = this.page.locator('a.nav-link[href="/login"]');
    this.basketLink = this.page.locator('a.nav-link[href="/basket"]');
    this.footer = this.page.locator('footer, .footer, [data-testid="footer"]');
  }

  /**
   * Navigate to home page via menu
   */
  async navigateToHomePage(): Promise<void> {
    await this.page.goto('/');
    await this.waitForPageLoad();
  }

  /**
   * Navigate to home page (alias for consistency)
   */
  async navigateToHome(): Promise<void> {
    await this.navigateToHomePage();
  }

  /**
   * Verify home page elements are visible
   */
  async verifyHomePageElements(): Promise<void> {
    await expect(this.logo).toBeVisible();
    await expect(this.homeLink).toBeVisible();
    await expect(this.sweetsLink).toBeVisible();
    await expect(this.aboutLink).toBeVisible();
    await expect(this.loginLink).toBeVisible();
    await expect(this.basketLink).toBeVisible();
  }

  /**
   * Verify page title
   */
  async verifyTitle(): Promise<void> {
    await expect(this.page).toHaveTitle(/Sweet Shop/i);
  }

  /**
   * Check if logo is visible
   */
  async isLogoVisible(): Promise<boolean> {
    return await this.logo.isVisible({ timeout: 3000 });
  }

  /**
   * Click on logo to navigate home
   */
  async clickLogo(): Promise<void> {
    await this.logo.click();
    await this.waitForPageLoad();
  }

  /**
   * Navigate to sweets page via navigation
   */
  async navigateToSweets(): Promise<void> {
    await this.page.goto('/sweets');
    await this.waitForPageLoad();
  }

  /**
   * Navigate to about page via navigation
   */
  async navigateToAbout(): Promise<void> {
    await this.aboutLink.click();
    await this.waitForPageLoad();
  }

  /**
   * Navigate to login page via navigation
   */
  async navigateToLogin(): Promise<void> {
    await this.loginLink.click();
    await this.waitForPageLoad();
  }

  /**
   * Navigate to basket page via navigation
   */
  async navigateToBasket(): Promise<void> {
    await this.basketLink.click();
    await this.waitForPageLoad();
  }
}