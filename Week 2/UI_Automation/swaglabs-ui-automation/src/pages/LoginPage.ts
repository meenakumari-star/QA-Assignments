import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  openCart() {
    throw new Error('Method not implemented.');
  }
  addItemToCart(backpack: string) {
    throw new Error('Method not implemented.');
  }
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly logo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
    this.errorMessage = page.locator('[data-test="error"]');
    this.logo = page.locator('.login_logo');
  }

  async goto(): Promise<void> {
    // Use full URL and increase timeout for reliability
    await this.page.goto('https://www.saucedemo.com/', { timeout: 60000, waitUntil: 'load' });
    await expect(this.logo).toBeVisible({ timeout: 10000 });
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible' });
    return (await this.errorMessage.innerText()).trim();
  }

  async isErrorDisplayed(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }
}
