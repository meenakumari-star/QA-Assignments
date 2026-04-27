import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;
  readonly finishButton: Locator;
  readonly summarySubtotal: Locator;
  readonly summaryTax: Locator;
  readonly summaryTotal: Locator;
  readonly completeHeader: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('#first-name');
    this.lastNameInput = page.locator('#last-name');
    this.postalCodeInput = page.locator('#postal-code');
    this.continueButton = page.locator('#continue');
    this.cancelButton = page.locator('#cancel');
    this.errorMessage = page.locator('[data-test="error"]');
    this.finishButton = page.locator('#finish');
    this.summarySubtotal = page.locator('.summary_subtotal_label');
    this.summaryTax = page.locator('.summary_tax_label');
    this.summaryTotal = page.locator('.summary_total_label');
    this.completeHeader = page.locator('.complete-header');
    this.backHomeButton = page.locator('#back-to-products');
  }

  async fillCheckoutInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueToOverview(): Promise<void> {
    await this.continueButton.click();
  }

  async finishCheckout(): Promise<void> {
    await this.finishButton.click();
  }

  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible' });
    return (await this.errorMessage.innerText()).trim();
  }

  async assertCompleted(): Promise<void> {
    await expect(this.completeHeader).toHaveText(/Thank you for your order!/i);
    await expect(this.page).toHaveURL(/\/checkout-complete\.html/);
  }

  async getSubtotal(): Promise<number> {
    const text = await this.summarySubtotal.innerText();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getTax(): Promise<number> {
    const text = await this.summaryTax.innerText();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getTotal(): Promise<number> {
    const text = await this.summaryTotal.innerText();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async backToProducts(): Promise<void> {
    await this.backHomeButton.click();
  }
}
