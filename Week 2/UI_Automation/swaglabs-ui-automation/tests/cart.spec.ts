import { test, expect } from '../src/fixtures/pageFixtures';
import { Products } from '../src/utils/TestData';

import type { CartPage, CheckoutPage } from '../src/fixtures/pageFixtures';
// LoggedInPage was not exported from pageFixtures; using 'any' as fallback
type LoggedInPage = any;

test.describe('Cart functionality @regression', () => {
  test('TC_CART_001: cart shows items added from inventory @smoke', async ({
    loggedInPage,
    cartPage,
  }: 
  
  { loggedInPage: LoggedInPage; cartPage: CartPage }) => {
    await loggedInPage.addItemToCart(Products.backpack);
    await loggedInPage.addItemToCart(Products.bikeLight);

    await loggedInPage.openCart();
    await cartPage.assertLoaded();

    const names = await cartPage.getCartItemNames();
    expect(names).toContain(Products.backpack);
    expect(names).toContain(Products.bikeLight);
    expect(await cartPage.getCartItemCount()).toBe(2);
  });

  test('TC_CART_002: remove item from cart updates count', async ({
    loggedInPage,
    cartPage,
  }: { loggedInPage: LoggedInPage; cartPage: CartPage }) => {
    await loggedInPage.addItemToCart(Products.backpack);
    await loggedInPage.addItemToCart(Products.bikeLight);

    await loggedInPage.openCart();
    await cartPage.removeItem(Products.backpack);

    expect(await cartPage.getCartItemCount()).toBe(1);
    const names = await cartPage.getCartItemNames();
    expect(names).not.toContain(Products.backpack);
  });

  test('TC_CART_003: continue shopping returns to inventory', async ({
    loggedInPage,
    cartPage,
    page,
  }: { loggedInPage: LoggedInPage; cartPage: CartPage; page: any }) => {
    await loggedInPage.addItemToCart(Products.backpack);
    await loggedInPage.openCart();
    await cartPage.continueShopping();
    await expect(page).toHaveURL(/\/inventory\.html/);
  });

  test('TC_CART_004: empty cart still allows checkout button click but blocks at form', async ({
    loggedInPage,
    cartPage,
    checkoutPage,
    page,
  }: { loggedInPage: LoggedInPage; cartPage: CartPage; checkoutPage: CheckoutPage; page: any }) => {
    await loggedInPage.openCart();
    expect(await cartPage.getCartItemCount()).toBe(0);
    await cartPage.checkout();
    // SauceDemo allows navigation to checkout-step-one even with empty cart
    await expect(page).toHaveURL(/\/checkout-step-one\.html/);
    await expect(checkoutPage.firstNameInput).toBeVisible();
  });

  test('TC_CART_005: cart persists across page navigation', async ({
    loggedInPage,
    cartPage,
    page,
  }: { loggedInPage: LoggedInPage; cartPage: CartPage; page: any }) => {
    await loggedInPage.addItemToCart(Products.backpack);
    await loggedInPage.openCart();
    await cartPage.continueShopping();

    expect(await loggedInPage.getCartCount()).toBe(1);
    await page.reload({ timeout: 60000, waitUntil: 'load' });
    // Wait for inventory page to be loaded after reload
    await loggedInPage.assertLoaded();
    expect(await loggedInPage.getCartCount()).toBe(1);
  });
});
