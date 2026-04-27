import { expect, Locator } from '@playwright/test';
import { SweetShopBasePage } from './SweetShopBasePage';

interface BillingData {
  firstName: string;
  lastName: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postcode: string;
  country: string;
}

interface PaymentData {
  nameOnCard?: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

/**
 * Page Object Model for Sweet Shop Checkout Page
 * Handles checkout form operations and validation
 */
export class CheckoutPage extends SweetShopBasePage {
  verifyCvvValidation(cvv: string) {
      throw new Error('Method not implemented.');
  }
  verifyCountryDropdownOptions() {
      throw new Error('Method not implemented.');
  }
  // Billing form locators
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly addressLine1Input: Locator;
  readonly addressLine2Input: Locator;
  readonly citySelect: Locator;
  readonly postcodeInput: Locator;
  readonly countrySelect: Locator;

  // Payment form locators
  readonly cardNumberInput: Locator;
  readonly expiryMonthInput: Locator;
  readonly expiryYearInput: Locator;
  readonly cvvInput: Locator;
  readonly nameOnCardInput: Locator;

  // Form controls
  readonly submitButton: Locator;
  readonly continueButton: Locator;

  constructor(page: any) {
    super(page);
    
    // Initialize billing form locators
    this.firstNameInput = this.page.locator('input[name="firstName"], #firstName, [data-testid="firstName"]');
    this.lastNameInput = this.page.locator('input[name="lastName"], #lastName, [data-testid="lastName"]');
    this.emailInput = this.page.locator('input[name="email"], #email, [data-testid="email"]');
    this.addressLine1Input = this.page.locator('input[name="address"], #address, [data-testid="address"]');
    this.addressLine2Input = this.page.locator('input[name="address2"], #address2, [data-testid="address2"]');
    this.citySelect = this.page.locator('select[name="city"], #city, [data-testid="city"]');
    this.postcodeInput = this.page.locator('input[name="postcode"], #postcode, [data-testid="postcode"]');
    this.countrySelect = this.page.locator('select[name="country"], #country, [data-testid="country"]');

    // Initialize payment form locators
    this.cardNumberInput = this.page.locator('input[name="cardNumber"], #cardNumber, [data-testid="cardNumber"]');
    this.expiryMonthInput = this.page.locator('select[name="expiryMonth"], #expiryMonth, [data-testid="expiryMonth"]');
    this.expiryYearInput = this.page.locator('select[name="expiryYear"], #expiryYear, [data-testid="expiryYear"]');
    this.cvvInput = this.page.locator('input[name="cvv"], #cvv, [data-testid="cvv"]');
    this.nameOnCardInput = this.page.locator('input[name="nameOnCard"], #nameOnCard, [data-testid="nameOnCard"]');

    // Form controls
    this.submitButton = this.page.locator('button[type="submit"], .submit-button, [data-testid="submit"]');
    this.continueButton = this.page.locator('button:has-text("Continue"), .continue-button');
  }

  /**
   * Fill billing information form
   * @param billingData - Billing information object
   */
  async fillBillingInformation(billingData: BillingData): Promise<void> {
    // Fill required fields if they exist
    const fieldsToFill = [
      { locator: this.firstNameInput, value: billingData.firstName },
      { locator: this.lastNameInput, value: billingData.lastName },
      { locator: this.emailInput, value: billingData.email },
      { locator: this.addressLine1Input, value: billingData.addressLine1 },
      { locator: this.postcodeInput, value: billingData.postcode }
    ];

    for (const field of fieldsToFill) {
      const isVisible = await field.locator.isVisible({ timeout: 3000 });
      if (isVisible) {
        await field.locator.fill(field.value);
      }
    }

    // Handle optional address line 2
    if (billingData.addressLine2) {
      const isVisible = await this.addressLine2Input.isVisible({ timeout: 2000 });
      if (isVisible) {
        await this.addressLine2Input.fill(billingData.addressLine2);
      }
    }

    // Handle dropdowns
    await this.selectCountry(billingData.country);
    await this.selectCity(billingData.city);
  }

  /**
   * Fill payment information form
   * @param paymentData - Payment information object
   */
  async fillPaymentInformation(paymentData: PaymentData): Promise<void> {
    const fieldsToFill = [
      { locator: this.cardNumberInput, value: paymentData.cardNumber },
      { locator: this.cvvInput, value: paymentData.cvv }
    ];

    for (const field of fieldsToFill) {
      const isVisible = await field.locator.isVisible({ timeout: 3000 });
      if (isVisible) {
        await field.locator.fill(field.value);
      }
    }

    // Handle name on card if provided
    if (paymentData.nameOnCard) {
      const isVisible = await this.nameOnCardInput.isVisible({ timeout: 2000 });
      if (isVisible) {
        await this.nameOnCardInput.fill(paymentData.nameOnCard);
      }
    }

    // Handle expiry dropdowns
    await this.selectExpiryMonth(paymentData.expiryMonth);
    await this.selectExpiryYear(paymentData.expiryYear);
  }

  /**
   * Select country from dropdown
   * @param country - Country name
   */
  async selectCountry(country: string): Promise<void> {
    const isVisible = await this.countrySelect.isVisible({ timeout: 3000 });
    if (isVisible) {
      await this.countrySelect.selectOption({ label: country });
      await this.page.waitForTimeout(500); // Wait for city options to update
    }
  }

  /**
   * Select city from dropdown
   * @param city - City name
   */
  async selectCity(city: string): Promise<void> {
    const isVisible = await this.citySelect.isVisible({ timeout: 3000 });
    if (isVisible) {
      await this.citySelect.selectOption({ label: city });
    }
  }

  /**
   * Select expiry month
   * @param month - Month (e.g., "12")
   */
  async selectExpiryMonth(month: string): Promise<void> {
    const isVisible = await this.expiryMonthInput.isVisible({ timeout: 3000 });
    if (isVisible) {
      await this.expiryMonthInput.selectOption({ value: month });
    }
  }

  /**
   * Select expiry year
   * @param year - Year (e.g., "25")
   */
  async selectExpiryYear(year: string): Promise<void> {
    const isVisible = await this.expiryYearInput.isVisible({ timeout: 3000 });
    if (isVisible) {
      await this.expiryYearInput.selectOption({ value: year });
    }
  }

  /**
   * Submit the checkout form
   */
  async submitCheckoutForm(): Promise<void> {
    // Try submit button first, then continue button
    const submitVisible = await this.submitButton.isVisible({ timeout: 3000 });
    if (submitVisible) {
      await this.submitButton.click();
    } else {
      const continueVisible = await this.continueButton.isVisible({ timeout: 3000 });
      if (continueVisible) {
        await this.continueButton.click();
      }
    }
    
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verify form validation error appears
   * @param fieldName - Name of the field
   */
  async verifyFormValidationError(fieldName: string): Promise<void> {
    const errorMessage = this.page.locator(`[data-testid="${fieldName}-error"], .error, .field-error`);
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  }

  /**
   * Verify required field validation
   * @param fieldName - Name of the required field
   */
  async verifyRequiredFieldValidation(fieldName: string): Promise<void> {
    // Clear the field and try to submit
    const field = this.page.locator(`[name="${fieldName}"], #${fieldName}`);
    const fieldExists = await field.isVisible({ timeout: 2000 });
    
    if (fieldExists) {
      await field.fill('');
      await this.submitCheckoutForm();
      await this.verifyFormValidationError(fieldName);
    }
  }

  /**
   * Verify email validation
   * @param email - Email to test
   * @param shouldBeValid - Whether email should be valid
   */
  async verifyEmailValidation(email: string, shouldBeValid: boolean = false): Promise<void> {
    const emailFieldExists = await this.emailInput.isVisible({ timeout: 2000 });
    
    if (emailFieldExists) {
      await this.emailInput.fill(email);
      await this.submitCheckoutForm();
      
      if (!shouldBeValid) {
        const errorMessage = this.page.locator('.error, .field-error, .invalid-feedback');
        const hasError = await errorMessage.isVisible({ timeout: 3000 });
        const staysOnPage = this.page.url().includes('/basket') || this.page.url().includes('/checkout');
        
        // Either shows error or doesn't proceed
        expect(hasError || staysOnPage).toBeTruthy();
      }
    }
  }

  /**
   * Verify credit card validation
   * @param cardNumber - Card number to test
   */
  async verifyCreditCardValidation(cardNumber: string): Promise<void> {
    const cardFieldExists = await this.cardNumberInput.isVisible({ timeout: 2000 });
    
    if (cardFieldExists) {
      await this.cardNumberInput.fill(cardNumber);
      await this.submitCheckoutForm();
      
      // Should show validation error or not proceed
      const errorMessage = this.page.locator('.error, .field-error, .invalid-feedback');
      const hasError = await errorMessage.isVisible({ timeout: 3000 });
      const staysOnPage = this.page.url().includes('/basket') || this.page.url().includes('/checkout');
      
      expect(hasError || staysOnPage).toBeTruthy();
    }
  }
}