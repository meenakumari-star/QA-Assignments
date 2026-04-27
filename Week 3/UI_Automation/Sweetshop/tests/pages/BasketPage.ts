import { expect, Locator } from '@playwright/test';
import { SweetShopBasePage } from './SweetShopBasePage';

/**
 * Page Object Model for Sweet Shop Basket/Cart Page
 * Handles shopping cart operations and checkout initiation
 */
export class BasketPage extends SweetShopBasePage {
  removeItemByName(product: string | undefined) {
      throw new Error('Method not implemented.');
  }
  verifyCartTotal(expectedTotal: number) {
      throw new Error('Method not implemented.');
  }
  verifyPromoCodeResult(arg0: boolean) {
      throw new Error('Method not implemented.');
  }
  verifyDeliveryOptionSelected(arg0: string) {
      throw new Error('Method not implemented.');
  }
  emptyBasket() {
      throw new Error('Method not implemented.');
  }
  // Locators
  readonly cartItems: Locator;
  readonly cartTotal: Locator;
  readonly emptyBasketLink: Locator;
  readonly deliveryOptions: Locator;
  readonly promoCodeInput: Locator;
  readonly promoCodeButton: Locator;

  constructor(page: any) {
    super(page);
    
    // Initialize locators
    this.cartItems = this.page.locator('.cart-item, .basket-item, [data-testid="cart-item"]');
    this.cartTotal = this.page.locator('.total, .cart-total, [data-testid="total"]');
    this.emptyBasketLink = this.page.locator('a:has-text("Empty Basket"), .empty-cart, [data-testid="empty-cart"]');
    this.deliveryOptions = this.page.locator('input[name="delivery"], .delivery-option');
    this.promoCodeInput = this.page.locator('input[name="promo"], #promo-code, [data-testid="promo-input"]');
    this.promoCodeButton = this.page.locator('button:has-text("Apply"), .promo-apply, [data-testid="apply-promo"]');
  }

  /**
   * Navigate to basket page
   */
  async navigateToBasketPage(): Promise<void> {
    await this.page.goto('/basket');
    await this.waitForPageLoad();
  }

  /**
   * Navigate to basket page (alias)
   */
  async navigateToBasket(): Promise<void> {
    await this.navigateToBasketPage();
  }

  /**
   * Verify basket is empty
   */
  async verifyEmptyBasket(): Promise<void> {
    // Check for empty message or no cart items
    const emptyMessage = this.page.locator(':has-text("Your basket is empty"), :has-text("No items"), .empty-cart-message');
    const hasEmptyMessage = await emptyMessage.isVisible({ timeout: 3000 });
    
    if (!hasEmptyMessage) {
      // If no empty message, verify no cart items exist
      const itemCount = await this.cartItems.count();
      expect(itemCount).toBe(0);
    }
  }

  /**
   * Verify item is in cart by name
   * @param itemName - Name of the item to verify
   */
  async verifyItemInCart(itemName: string): Promise<void> {
    const item = this.cartItems.filter({ hasText: itemName });
    await expect(item).toBeVisible({ timeout: 10000 });
  }

  /**
   * Get number of items in cart
   */
  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  /**
   * Get cart total as string
   */
  async getCartTotal(): Promise<string> {
    const totalElement = this.cartTotal;
    const isVisible = await totalElement.isVisible({ timeout: 5000 });
    
    if (!isVisible) {
      return '£0.00';
    }
    
    const totalText = await totalElement.textContent();
    return totalText?.trim() || '£0.00';
  }

  /**
   * Select delivery option
   * @param option - Delivery option ('collect' or 'shipping')
   */
  async selectDeliveryOption(option: 'collect' | 'shipping'): Promise<void> {
    const deliveryOption = this.page.locator(`input[value="${option}"], input[name="delivery"][value="${option}"]`);
    
    const optionExists = await deliveryOption.isVisible({ timeout: 3000 });
    if (optionExists) {
      await deliveryOption.check();
      await this.page.waitForTimeout(1000); // Wait for price update
    }
  }

  /**
   * Enter promo code
   * @param code - Promo code to enter
   */
  async enterPromoCode(code: string): Promise<void> {
    const promoInput = this.promoCodeInput;
    const inputExists = await promoInput.isVisible({ timeout: 3000 });
    
    if (inputExists) {
      await promoInput.fill(code);
      
      const applyButton = this.promoCodeButton;
      const buttonExists = await applyButton.isVisible({ timeout: 2000 });
      
      if (buttonExists) {
        await applyButton.click();
        await this.page.waitForTimeout(2000); // Wait for processing
      }
    }
  }

  /**
   * Calculate expected total based on items and delivery
   * @param itemPrices - Array of item prices
   * @param deliveryCharge - Delivery charge
   * @param discount - Discount amount
   */
  calculateExpectedTotal(itemPrices: number[], deliveryCharge: number = 0, discount: number = 0): string {
    const subtotal = itemPrices.reduce((sum, price) => sum + price, 0);
    const total = subtotal + deliveryCharge - discount;
    return `£${total.toFixed(2)}`;
  }
}