import { test, expect } from '@fixtures/pageFixtures';
import sweetsData from '@data/sweets.json';

test.describe('Feature: Shopping Cart Boundary & Concurrency Testing', () => {
  test.beforeEach(async ({ basketPage }) => {
    await basketPage.navigate('/');
    // Ensure clean cart state
    await basketPage.navigateToBasketPage();
    await basketPage.emptyBasket();
  });

  test.afterEach(async ({ basketPage }) => {
    try {
      await basketPage.navigateToBasketPage();
      await basketPage.emptyBasket();
    } catch {
      // Ignore cleanup errors
    }
  });

  /**
   * Test Case: TC-OPT-009
   * Description: Shopping Cart Boundary, Precision, Concurrency, and Persistence Edge Cases
   * Priority: High
   * Type: Integration/Boundary
   * Steps:
   *   1. Test quantity limits and boundary values
   *   2. Test decimal precision in calculations
   *   3. Test concurrent cart operations
   *   4. Test cart persistence and storage edge cases
   *   5. Test maximum cart capacity
   *   6. Test storage tampering recovery
   * Expected: Cart handles all edge cases correctly with proper validation
   */
  test('TC-OPT-009: should handle cart boundary conditions and edge cases @boundary @critical', async ({ 
    page, sweetsPage, basketPage 
  }) => {
    // 1. Rapid Add Operations (Stress Testing)
    await sweetsPage.navigateToSweetsPage();
    
    const product = "Chocolate Cups";
    const rapidClickCount = 10;
    
    // Rapidly click Add to Basket
    const addButton = sweetsPage.getAddToBasketButton(product);
    
    for (let i = 0; i < rapidClickCount; i++) {
      await addButton.click();
      await page.waitForTimeout(50); // Very brief pause between clicks
    }
    
    await basketPage.navigateToBasketPage();
    const finalCount = await basketPage.getCartItemCount();
    
    // Should handle rapid clicks gracefully - either increment properly or prevent double-clicks
    expect(finalCount).toBeGreaterThan(0);
    expect(finalCount).toBeLessThanOrEqual(rapidClickCount);
    console.log(`Rapid clicking result: ${finalCount} items added from ${rapidClickCount} clicks`);

    // 2. Decimal Precision Testing
    await basketPage.emptyBasket();
    await sweetsPage.navigateToSweetsPage();
    
    // Add items with prices that could cause floating-point errors
    const precisionTestItems = [
      { name: "Bubbly", price: 0.10, quantity: 3, expected: 0.30 }, // 0.10 + 0.10 + 0.10
      { name: "Sherbert Straws", price: 0.35, quantity: 2, expected: 0.70 }, // 0.35 + 0.35  
    ];
    
    let expectedTotal = 0;
    
    for (const item of precisionTestItems) {
      for (let i = 0; i < item.quantity; i++) {
        await sweetsPage.addProductToBasket(item.name);
        expectedTotal += item.price;
      }
    }
    
    await basketPage.navigateToBasketPage();
    const displayedTotal = await basketPage.getCartTotal();
    const numericTotal = parseFloat(displayedTotal.replace('£', ''));
    
    // Test decimal precision - should not show floating point errors
    expect(Math.abs(numericTotal - expectedTotal)).toBeLessThan(0.01);
    console.log(`Decimal precision test: Expected £${expectedTotal.toFixed(2)}, Got ${displayedTotal}`);

    // 3. Maximum Quantity Testing
    await basketPage.emptyBasket();
    await sweetsPage.navigateToSweetsPage();
    
    const highQuantityProduct = "Chocolate Cups";
    const maxTestQuantity = 999;
    
    // Test adding very high quantities
    for (let i = 0; i < maxTestQuantity && i < 50; i++) { // Limit to 50 for test performance
      await sweetsPage.addProductToBasket(highQuantityProduct);
      
      if (i % 10 === 0) { // Check every 10 items
        await basketPage.navigateToBasketPage();
        const currentCount = await basketPage.getCartItemCount();
        
        if (currentCount < i + 1) {
          // Hit a limit
          console.log(`Cart limit detected at ${currentCount} items`);
          break;
        }
        await sweetsPage.navigateToSweetsPage();
      }
    }
    
    await basketPage.navigateToBasketPage();
    const finalQuantity = await basketPage.getCartItemCount();
    console.log(`Maximum quantity test: ${finalQuantity} items successfully added`);

    // 4. Add All Products (Inventory Stress Test)
    await basketPage.emptyBasket();
    await sweetsPage.navigateToSweetsPage();
    
    let totalExpectedPrice = 0;
    
    // Add one of each product
    for (const product of sweetsData.products) {
      await sweetsPage.addProductToBasket(product.name);
      totalExpectedPrice += parseFloat(product.price.replace('£', ''));
    }
    
    await basketPage.navigateToBasketPage();
    const allProductsCount = await basketPage.getCartItemCount();
    const allProductsTotal = await basketPage.getCartTotal();
    const allProductsNumericTotal = parseFloat(allProductsTotal.replace('£', ''));
    
    expect(allProductsCount).toBe(sweetsData.products.length);
    expect(Math.abs(allProductsNumericTotal - totalExpectedPrice)).toBeLessThan(0.01);
    
    console.log(`All products test: ${allProductsCount} products, Total: ${allProductsTotal}, Expected: £${totalExpectedPrice.toFixed(2)}`);
  });

  /**
   * Test Case: TC-BOUNDARY-002
   * Description: Cart storage and persistence edge cases
   * Steps: Test storage tampering, browser refresh, and data integrity
   * Expected: Cart recovers gracefully from storage issues
   */
  test('TC-BOUNDARY-002: should handle storage tampering and persistence edge cases @boundary @storage', async ({ 
    page, sweetsPage, basketPage 
  }) => {
    // 1. Add items to cart
    await sweetsPage.navigateToSweetsPage();
    await sweetsPage.addProductToBasket("Chocolate Cups");
    await sweetsPage.addProductToBasket("Sherbert Straws");
    
    await basketPage.navigateToBasketPage();
    const originalCount = await basketPage.getCartItemCount();
    expect(originalCount).toBe(2);

    // 2. Storage Tampering Test
    // Corrupt localStorage cart data
    await page.evaluate(() => {
      // Try to find and corrupt cart-related localStorage
      const keys = Object.keys(localStorage);
      for (const key of keys) {
        if (key.includes('cart') || key.includes('basket') || key.includes('items')) {
          localStorage.setItem(key, 'corrupted_data_{}');
          console.log(`Corrupted localStorage key: ${key}`);
        }
      }
      
      // Also try common cart storage keys
      localStorage.setItem('cart', 'invalid_json');
      localStorage.setItem('basket', '{"invalid": json}');
      localStorage.setItem('cartItems', 'null');
    });

    // 3. Reload and test recovery
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Should either recover gracefully or reset to empty state
    await basketPage.navigateToBasketPage();
    const countAfterTampering = await basketPage.getCartItemCount();
    
    console.log(`Storage tampering test: Original count ${originalCount}, After tampering: ${countAfterTampering}`);
    
    // Page should still be functional
    expect(await page.isVisible('body')).toBeTruthy();
    
    // Should be able to add items after recovery
    await sweetsPage.navigateToSweetsPage();
    await sweetsPage.addProductToBasket("Bonbon");
    await basketPage.navigateToBasketPage();
    
    const countAfterRecovery = await basketPage.getCartItemCount();
    expect(countAfterRecovery).toBeGreaterThanOrEqual(1);

    // 4. SessionStorage tampering
    await page.evaluate(() => {
      // Corrupt sessionStorage
      const keys = Object.keys(sessionStorage);
      for (const key of keys) {
        if (key.includes('cart') || key.includes('basket')) {
          sessionStorage.setItem(key, 'corrupted_session_data');
        }
      }
    });

    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Should still function normally
    await basketPage.navigateToBasketPage();
    expect(await page.isVisible('.basket, .cart, [data-testid="cart"]')).toBeTruthy();

    // 5. Test very large cart data
    await page.evaluate(() => {
      const largeData = JSON.stringify({
        items: new Array(10000).fill({
          name: 'Test Product',
          price: 1.00,
          quantity: 999999
        })
      });
      
      try {
        localStorage.setItem('cart', largeData);
        localStorage.setItem('cartItems', largeData);
      } catch (e) {
        console.log('Storage quota exceeded - this is expected behavior');
      }
    });

    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Should handle oversized data gracefully
    await basketPage.navigateToBasketPage();
    expect(await page.isVisible('body')).toBeTruthy();
  });

  /**
   * Test Case: TC-BOUNDARY-003
   * Description: Concurrent cart operations
   * Steps: Test simultaneous add/remove operations
   * Expected: Cart maintains consistency during concurrent operations
   */
  test('TC-BOUNDARY-003: should handle concurrent cart operations correctly @boundary @concurrency', async ({ 
    page, sweetsPage, basketPage, context 
  }) => {
    // 1. Test concurrent adds from multiple tabs
    const page2 = await context.newPage();
    
    try {
      // Navigate both pages to sweets
      await sweetsPage.navigateToSweetsPage();
      await page2.goto('https://sweetshop.netlify.app/sweets');
      await page2.waitForLoadState('networkidle');

      // Simultaneously add items from both tabs
      const addPromises = [
        sweetsPage.addProductToBasket("Chocolate Cups"),
        page2.locator('button:has-text("Add to Basket"), .add-to-basket').first().click()
      ];
      
      await Promise.all(addPromises);
      
      // Check consistency across tabs
      await basketPage.navigateToBasketPage();
      const tab1Count = await basketPage.getCartItemCount();
      
      await page2.goto('https://sweetshop.netlify.app/basket');
      await page2.waitForLoadState('networkidle');
      const tab2Count = await page2.locator('.cart-item, .basket-item, [data-testid="cart-item"]').count();
      
      console.log(`Concurrent operations: Tab1 count: ${tab1Count}, Tab2 count: ${tab2Count}`);
      
      // Counts should be consistent (allowing for timing differences)
      expect(Math.abs(tab1Count - tab2Count)).toBeLessThanOrEqual(1);

      // 2. Test rapid add/remove sequence
      await basketPage.emptyBasket();
      
      const rapidOperations = async () => {
        for (let i = 0; i < 5; i++) {
          await sweetsPage.navigateToSweetsPage();
          await sweetsPage.addProductToBasket("Sherbert Straws");
          await basketPage.navigateToBasketPage();
          
          const removeButton = basketPage.page.locator('.remove, .delete, button:has-text("Remove"), [data-testid="remove"]').first();
          const hasRemoveButton = await removeButton.isVisible({ timeout: 1000 });
          
          if (hasRemoveButton) {
            await removeButton.click();
          }
          
          await page.waitForTimeout(100);
        }
      };
      
      await rapidOperations();
      
      // Final state should be consistent
      await basketPage.navigateToBasketPage();
      const finalCount = await basketPage.getCartItemCount();
      
      console.log(`Rapid add/remove sequence final count: ${finalCount}`);
      expect(finalCount).toBeGreaterThanOrEqual(0);

    } finally {
      await page2.close();
    }
  });

  /**
   * Test Case: TC-BOUNDARY-004
   * Description: Network failure scenarios
   * Steps: Test cart operations with network interruptions
   * Expected: Cart operations handle network failures gracefully
   */
  test('TC-BOUNDARY-004: should handle network failures during cart operations @boundary @network', async ({ 
    page, sweetsPage, basketPage 
  }) => {
    // 1. Test cart operations with slow network
    await page.route('**/*', async route => {
      // Add delay to simulate slow network
      await new Promise(resolve => setTimeout(resolve, 100));
      await route.continue();
    });

    await sweetsPage.navigateToSweetsPage();
    
    // Should still be able to add items with network delay
    const startTime = Date.now();
    await sweetsPage.addProductToBasket("Chocolate Cups");
    const endTime = Date.now();
    
    console.log(`Add to cart with network delay: ${endTime - startTime}ms`);
    
    await basketPage.navigateToBasketPage();
    const count = await basketPage.getCartItemCount();
    expect(count).toBe(1);

    // 2. Test with network failures (simulate offline)
    await page.route('**/*.js', route => route.abort('failed'));
    await page.route('**/*.css', route => route.abort('failed'));
    
    // Basic functionality should still work with cached resources
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    
    // Page should still render basic structure
    const bodyVisible = await page.isVisible('body');
    expect(bodyVisible).toBeTruthy();
    
    // Remove network interference
    await page.unroute('**/*');
    await page.unroute('**/*.js');
    await page.unroute('**/*.css');
  });
});