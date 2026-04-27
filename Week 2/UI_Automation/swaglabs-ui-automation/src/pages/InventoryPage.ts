import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage extends BasePage {
  readonly title: Locator;
  readonly inventoryItems: Locator;
  readonly sortDropdown: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('.title');
    this.inventoryItems = page.locator('.inventory_item');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.itemNames = page.locator('.inventory_item_name');
    this.itemPrices = page.locator('.inventory_item_price');
  }

  async assertLoaded(): Promise<void> {
    await expect(this.title).toHaveText('Products');
    await expect(this.page).toHaveURL(/\/inventory\.html/);
  }

  async getItemCount(): Promise<number> {
    return await this.inventoryItems.count();
  }

  async addItemToCart(itemName: string): Promise<void> {
    const item = this.inventoryItems.filter({ hasText: itemName });
    await item.locator('button', { hasText: 'Add to cart' }).click();
  }

  async removeItemFromCart(itemName: string): Promise<void> {
    const item = this.inventoryItems.filter({ hasText: itemName });
    await item.locator('button', { hasText: 'Remove' }).click();
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async getItemNames(): Promise<string[]> {
    return await this.itemNames.allInnerTexts();
  }

  async getItemPrices(): Promise<number[]> {
    const raw = await this.itemPrices.allInnerTexts();
    return raw.map((p) => parseFloat(p.replace('$', '')));
  }

  async clickItem(itemName: string): Promise<void> {
    await this.itemNames.filter({ hasText: itemName }).first().click();
  }
}
