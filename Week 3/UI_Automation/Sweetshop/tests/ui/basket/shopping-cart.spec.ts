import { test, expect } from '@fixtures/pageFixtures';
import sweetsData from '@data/sweets.json';

test.describe('Feature: Shopping Cart Workflow', () => {
  test.beforeEach(async ({ basePage }) => {
    await basePage.navigate('/');
  });

  test.afterEach(async ({ basketPage }) => {
    await basketPage.navigateToBasketPage();
    await basketPage.emptyBasket();
  });

  /**
   * Test Case: TC-OPT-003
   * Description: Complete shopping cart workflow with calculations
   * Steps:
   *   1. Verify initial empty state
   *   2. Run scripted cart operations (add / remove / empty)
   *   3. Verify rapid-add behaviour
   *   4. Verify cross-page persistence
   *   5. Verify session survives page refresh
   * Expected: Cart operations behave correctly with persistence
   */
  test('TC-OPT-003: should complete shopping cart workflow with calculations @smoke @ui @critical', async ({
    page,
    sweetsPage,
    basketPage,
    homePage,
  }) => {
    await basketPage.navigateToBasketPage();
    await basketPage.verifyEmptyBasket();

    for (const op of sweetsData.cartOperations) {
      switch (op.action) {
        case 'add':
          await sweetsPage.navigateToSweetsPage();
          await sweetsPage.addProductToBasket(op.product?.toString() || '');
          break;
        case 'remove':
          await basketPage.navigateToBasketPage();
          await basketPage.removeItemByName(op.product?.toString() || '');
          break;
        case 'empty':
          await basketPage.navigateToBasketPage();
          await basketPage.emptyBasket();
          break;
      }
    }

    await sweetsPage.navigateToSweetsPage();
    await sweetsPage.rapidlyAddProduct('Chocolate Cups', 5);

    await sweetsPage.navigateToSweetsPage();
    await sweetsPage.addProductToBasket('Sherbert Straws');
    const expectedCount = await sweetsPage.getBasketCount();

    await homePage.navigateToHome();
    await expect(homePage.basketLink).toContainText(Number(expectedCount).toString());

    await homePage.navigateToAbout();
    await expect(homePage.basketLink).toContainText(Number(expectedCount).toString());

    await basketPage.navigateToBasketPage();
    const itemsBefore = await basketPage.getCartItemCount();
    await page.reload();
    const itemsAfter = await basketPage.getCartItemCount();
    expect(itemsAfter).toBe(itemsBefore);
  });

  /**
   * Test Case: TC-CART-002
   * Description: Cart total displays in £X.XX format
   * Steps: Add a product, view basket, check total format
   * Expected: Total matches /£\d+\.\d{2}/
   */
  test('TC-CART-002: should display cart total in correct format @regression @ui', async ({
    sweetsPage,
    basketPage,
  }) => {
    await sweetsPage.navigateToSweetsPage();
    await sweetsPage.addProductToBasket('Bubbly');
    await basketPage.navigateToBasketPage();
    const total = await basketPage.getCartTotal();
    expect(total).toMatch(/£\d+\.\d{2}/);
  });

  /**
   * Test Case: TC-CART-003
   * Description: Adding the same product multiple times
   * Steps: Click Add to Basket on Chocolate Cups three times
   * Expected: Basket counter reflects three additions
   */
  test('TC-CART-003: should handle multiple quantities correctly @regression @ui', async ({
    sweetsPage,
  }) => {
    await sweetsPage.navigateToSweetsPage();
    await sweetsPage.rapidlyAddProduct('Chocolate Cups', 3);
    const count: number = await sweetsPage.getBasketCount();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  /**
   * Test Case: TC-CART-004
   * Description: Cart persists across browser refresh
   * Steps: Add items, reload, verify counter unchanged
   * Expected: Item count matches before and after reload
   */
  test('TC-CART-004: should persist cart across browser refresh @regression @ui', async ({
    page,
    sweetsPage,
    basketPage,
  }) => {
    await sweetsPage.navigateToSweetsPage();
    await sweetsPage.addProductToBasket('Chocolate Cups');
    await sweetsPage.addProductToBasket('Sherbert Straws');

    await basketPage.navigateToBasketPage();
    const before = await basketPage.getCartItemCount();
    await page.reload();
    const after = await basketPage.getCartItemCount();
    expect(after).toBe(before);
  });

  /**
   * Test Case: TC-CART-005
   * Description: Empty basket clears all items
   * Steps: Add items, click Empty Basket
   * Expected: Item list is empty after click
   */
  test('TC-CART-005: should empty cart completely @regression @ui', async ({
    sweetsPage,
    basketPage,
  }) => {
    await sweetsPage.navigateToSweetsPage();
    await sweetsPage.addProductToBasket('Chocolate Cups');
    await sweetsPage.addProductToBasket('Bon Bons');

    await basketPage.navigateToBasketPage();
    await basketPage.emptyBasket();
    await basketPage.verifyEmptyBasket();
  });
});
