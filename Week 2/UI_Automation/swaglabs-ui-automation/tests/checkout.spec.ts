import { test, expect } from '../src/fixtures/pageFixtures';
import { Products, CheckoutInfo, ErrorMessages } from '../src/utils/TestData';

test.describe('Checkout flow @regression', () => {
  test.beforeEach(
    async ({
      loggedInPage,
      cartPage,
    }) => {
      await loggedInPage.addItemToCart(Products.backpack);
      await loggedInPage.openCart();
      await cartPage.assertLoaded();
      await cartPage.checkout();
    }
  );

  test('TC_CHK_001: complete checkout end to end @smoke', async ({ checkoutPage }) => {
    const { firstName, lastName, postalCode } = CheckoutInfo.valid;
    await checkoutPage.fillCheckoutInfo(firstName, lastName, postalCode);
    await checkoutPage.continueToOverview();

    const subtotal = await checkoutPage.getSubtotal();
    const tax = await checkoutPage.getTax();
    const total = await checkoutPage.getTotal();

    expect(subtotal).toBeGreaterThan(0);
    // Allow small floating-point drift
    expect(Math.abs(subtotal + tax - total)).toBeLessThan(0.01);

    await checkoutPage.finishCheckout();
    await checkoutPage.assertCompleted();
  });

  test('TC_CHK_002: missing first name shows required error', async ({ checkoutPage }) => {
    const { firstName, lastName, postalCode } = CheckoutInfo.emptyFirstName;
    await checkoutPage.fillCheckoutInfo(firstName, lastName, postalCode);
    await checkoutPage.continueToOverview();
    expect(await checkoutPage.getErrorMessage()).toBe(ErrorMessages.emptyFirstName);
  });

  test('TC_CHK_003: missing last name shows required error', async ({ checkoutPage }) => {
    const { firstName, lastName, postalCode } = CheckoutInfo.emptyLastName;
    await checkoutPage.fillCheckoutInfo(firstName, lastName, postalCode);
    await checkoutPage.continueToOverview();
    expect(await checkoutPage.getErrorMessage()).toBe(ErrorMessages.emptyLastName);
  });

  test('TC_CHK_004: missing postal code shows required error', async ({ checkoutPage }) => {
    const { firstName, lastName, postalCode } = CheckoutInfo.emptyPostal;
    await checkoutPage.fillCheckoutInfo(firstName, lastName, postalCode);
    await checkoutPage.continueToOverview();
    expect(await checkoutPage.getErrorMessage()).toBe(ErrorMessages.emptyPostal);
  });

  test('TC_CHK_005: back to products from order complete page', async ({ checkoutPage, page }) => {
    const { firstName, lastName, postalCode } = CheckoutInfo.valid;
    await checkoutPage.fillCheckoutInfo(firstName, lastName, postalCode);
    await checkoutPage.continueToOverview();
    await checkoutPage.finishCheckout();
    await checkoutPage.assertCompleted();

    await checkoutPage.backToProducts();
    await expect(page).toHaveURL(/\/inventory\.html/);
  });
});
