import { test, expect } from '../src/fixtures/pageFixtures';
import { Products } from '../src/utils/TestData';

test.describe('Inventory page @regression', () => {
  test('TC_INV_001: inventory shows exactly 6 products @smoke', async ({ loggedInPage }) => {
    expect(await loggedInPage.getItemCount()).toBe(6);
  });

  test('TC_INV_002: sort items A → Z', async ({ loggedInPage }) => {
    await loggedInPage.sortBy('az');
    const names = await loggedInPage.getItemNames();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  test('TC_INV_003: sort items Z → A', async ({ loggedInPage }) => {
    await loggedInPage.sortBy('za');
    const names = await loggedInPage.getItemNames();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });

  test('TC_INV_004: sort items by price low → high', async ({ loggedInPage }) => {
    await loggedInPage.sortBy('lohi');
    const prices = await loggedInPage.getItemPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('TC_INV_005: sort items by price high → low', async ({ loggedInPage }) => {
    await loggedInPage.sortBy('hilo');
    const prices = await loggedInPage.getItemPrices();
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });

  test('TC_INV_006: add single item to cart updates badge', async ({ loggedInPage }) => {
    await loggedInPage.addItemToCart(Products.backpack);
    expect(await loggedInPage.getCartCount()).toBe(1);
  });

  test('TC_INV_007: add multiple items to cart', async ({ loggedInPage }) => {
    await loggedInPage.addItemToCart(Products.backpack);
    await loggedInPage.addItemToCart(Products.bikeLight);
    await loggedInPage.addItemToCart(Products.boltTshirt);
    expect(await loggedInPage.getCartCount()).toBe(3);
  });

  test('TC_INV_008: remove item from inventory list updates badge', async ({ loggedInPage }) => {
    await loggedInPage.addItemToCart(Products.backpack);
    expect(await loggedInPage.getCartCount()).toBe(1);
    await loggedInPage.removeItemFromCart(Products.backpack);
    expect(await loggedInPage.getCartCount()).toBe(0);
  });

  test('TC_INV_009: reset app state clears cart', async ({ loggedInPage }) => {
    await loggedInPage.addItemToCart(Products.backpack);
    await loggedInPage.addItemToCart(Products.bikeLight);
    expect(await loggedInPage.getCartCount()).toBe(2);

    await loggedInPage.resetAppState();
    expect(await loggedInPage.getCartCount()).toBe(0);
  });
});
