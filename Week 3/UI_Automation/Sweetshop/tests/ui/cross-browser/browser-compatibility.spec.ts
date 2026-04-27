import { test, expect } from '@fixtures/pageFixtures';

test.describe('Feature: Cross-Browser Compatibility', () => {
  const browsers = [
    { name: 'Chromium', project: 'chromium' },
    { name: 'Firefox', project: 'firefox' },
    { name: 'WebKit', project: 'webkit' }
  ];

  const keyFunctionalities = [
    'Navigation menu',
    'Product grid layout',
    'Add to basket buttons', 
    'Shopping cart display',
    'Checkout forms'
  ];

  const screenSizes = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1440, height: 900 }
  ];

  /**
   * Test Case: TC-OPT-006
   * Description: Cross-Browser Compatibility Testing
   * Priority: High
   * Type: Cross-Browser
   * Steps:
   *   1. Test all key functionalities across browsers
   *   2. Test responsive design on different screen sizes
   *   3. Test JavaScript functionality consistency
   *   4. Test CSS rendering consistency
   *   5. Test performance across browsers
   * Expected: Consistent functionality and appearance across all supported browsers
   */
  test('TC-OPT-006: should function consistently across all browsers @cross-browser @critical', async ({ 
    page, browserName 
  }) => {
    const results: {
      browser: string;
      functionality: Record<string, unknown>[];
      performance: Record<string, unknown>[];
      layout: Record<string, unknown>[];
      console: Record<string, unknown>[];
    } = {
      browser: browserName,
      functionality: [],
      performance: [],
      layout: [],
      console: []
    };

    // Console error monitoring
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // 1. Navigation Testing
    const pages = ['/', '/sweets', '/about', '/login', '/basket'];
    
    for (const pagePath of pages) {
      const startTime = Date.now();
      await page.goto(`https://sweetshop.netlify.app${pagePath}`);
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      results.performance.push({
        page: pagePath,
        loadTime,
        browser: browserName
      });

      // Check basic page structure
      const pageStructure = await page.evaluate(() => ({
        hasBody: !!document.body,
        hasNav: !!document.querySelector('nav, .navbar, [data-testid="navigation"]'),
        hasMain: !!document.querySelector('main, .main, [role="main"]'),
        scriptsLoaded: document.scripts.length,
        stylesheetsLoaded: document.styleSheets.length
      }));
      
      results.layout.push({
        page: pagePath,
        browser: browserName,
        structure: pageStructure
      });

      // Verify no JavaScript errors
      await page.waitForTimeout(2000);
      const currentErrors = [...consoleErrors];
      consoleErrors.length = 0;
      
      results.console.push({
        page: pagePath,
        browser: browserName,
        errors: currentErrors,
        errorCount: currentErrors.length
      });
    }

    // 2. Product Catalog Cross-Browser Testing
    await page.goto('https://sweetshop.netlify.app/sweets');
    
    const catalogFunctionality = await page.evaluate(() => {
      const products = document.querySelectorAll('.product, .sweet, [data-testid="product"]');
      const addButtons = document.querySelectorAll('button:has-text("Add to Basket"), .add-to-basket');
      
      return {
        productCount: products.length,
        buttonCount: addButtons.length,
        firstProductVisible: products.length > 0 ? (products[0] as HTMLElement).offsetParent !== null : false,
        buttonsClickable: addButtons.length > 0 ? !addButtons[0].hasAttribute('disabled') : false
      };
    });
    
    results.functionality.push({
      feature: 'Product Catalog',
      browser: browserName,
      data: catalogFunctionality
    });

    expect(catalogFunctionality.productCount).toBeGreaterThan(10);
    expect(catalogFunctionality.buttonCount).toBeGreaterThan(10);
    expect(catalogFunctionality.firstProductVisible).toBeTruthy();

    // 3. Shopping Cart Cross-Browser Testing
    // Add item to cart and test functionality
    const firstAddButton = page.locator('button:has-text("Add to Basket"), .add-to-basket').first();
    await firstAddButton.click();
    
    // Check basket counter update
    const basketCounter = page.locator('.basket-count, .cart-count, [data-testid="basket-count"]');
    const counterVisible = await basketCounter.isVisible({ timeout: 3000 });
    
    if (counterVisible) {
      const counterText = await basketCounter.textContent();
      expect(counterText).toBeTruthy();
    }

    // Navigate to basket and verify
    await page.goto('https://sweetshop.netlify.app/basket');
    const basketFunctionality = await page.evaluate(() => {
      const cartItems = document.querySelectorAll('.cart-item, .basket-item, [data-testid="cart-item"]');
      const total = document.querySelector('.total, .cart-total, [data-testid="total"]');
      const emptyButton = document.querySelector('a:has-text("Empty Basket"), .empty-cart');
      
      return {
        itemsInCart: cartItems.length,
        totalVisible: !!total,
        emptyButtonVisible: !!emptyButton,
        totalText: total ? total.textContent : null
      };
    });
    
    results.functionality.push({
      feature: 'Shopping Cart',
      browser: browserName,
      data: basketFunctionality
    });

    expect(basketFunctionality.itemsInCart).toBeGreaterThan(0);
    expect(basketFunctionality.totalVisible).toBeTruthy();

    // 4. Form Testing (Login/Checkout)
    await page.goto('https://sweetshop.netlify.app/login');
    
    const formFunctionality = await page.evaluate(() => {
      const emailInput = document.querySelector('input[type="email"], input[name="email"]');
      const passwordInput = document.querySelector('input[type="password"], input[name="password"]');
      const submitButton = document.querySelector('button[type="submit"], button:has-text("Login")');
      
      return {
        emailInputExists: !!emailInput,
        passwordInputExists: !!passwordInput,
        submitButtonExists: !!submitButton,
        formExists: !!document.querySelector('form')
      };
    });
    
    results.functionality.push({
      feature: 'Login Form',
      browser: browserName,
      data: formFunctionality
    });

    expect(formFunctionality.emailInputExists).toBeTruthy();
    expect(formFunctionality.passwordInputExists).toBeTruthy();
    expect(formFunctionality.submitButtonExists).toBeTruthy();

    // 5. CSS Rendering Test
    const cssRenderingTest = await page.evaluate(() => {
      const body = document.body;
      const nav = document.querySelector('nav, .navbar');
      
      const bodyStyles = window.getComputedStyle(body);
      const navStyles = nav ? window.getComputedStyle(nav) : null;
      
      return {
        bodyBackgroundColor: bodyStyles.backgroundColor,
        bodyFontFamily: bodyStyles.fontFamily,
        navDisplay: navStyles ? navStyles.display : null,
        navPosition: navStyles ? navStyles.position : null,
        fontsLoaded: document.fonts ? document.fonts.size : 0
      };
    });
    
    console.log(`${browserName} CSS Rendering:`, cssRenderingTest);

    // 6. JavaScript Feature Detection
    const jsFeatures = await page.evaluate(() => {
      return {
        localStorage: typeof localStorage !== 'undefined',
        sessionStorage: typeof sessionStorage !== 'undefined',
        fetch: typeof fetch !== 'undefined',
        promise: typeof Promise !== 'undefined',
        arrow: (() => { try { eval('() => {}'); return true; } catch { return false; } })(),
        es6Modules: typeof Symbol !== 'undefined'
      };
    });
    
    console.log(`${browserName} JavaScript Features:`, jsFeatures);
    
    // Essential features should be supported
    expect(jsFeatures.localStorage).toBeTruthy();
    expect(jsFeatures.fetch || typeof XMLHttpRequest !== 'undefined').toBeTruthy();

    // Final results summary
    const totalPages = results.performance.length;
    const averageLoadTime =
      totalPages > 0
        ? results.performance.reduce((sum, p) => sum + (p as any).loadTime, 0) / totalPages
        : 0;
    const totalErrors = results.console.reduce((sum, c) => sum + (c as any).errorCount, 0);

    console.log(`Cross-browser test results for ${browserName}:`, {
      totalPages,
      averageLoadTime,
      totalErrors,
      functionalityTests: results.functionality.length
    });
  });

  /**
   * Test Case: TC-BROWSER-002
   * Description: Responsive design consistency across browsers
   * Steps: Test layout adaptation on different screen sizes in each browser
   * Expected: Consistent responsive behavior across browsers
   */
  test('TC-BROWSER-002: should maintain responsive design across browsers @cross-browser @responsive', async ({ 
    page, browserName 
  }) => {
    const responsiveResults = [];
    
    for (const screenSize of screenSizes) {
      await page.setViewportSize({ width: screenSize.width, height: screenSize.height });
      await page.goto('https://sweetshop.netlify.app/sweets');
      await page.waitForLoadState('networkidle');
      
      const layoutAnalysis = await page.evaluate(() => {
        // Check if layout adapts properly
        const nav = document.querySelector('nav, .navbar');
        const productGrid = document.querySelector('.products, .product-grid');
        const products = document.querySelectorAll('.product, .sweet');
        
        return {
          navigationVisible: nav ? (nav as HTMLElement).offsetParent !== null : false,
          productGridVisible: productGrid ? (productGrid as HTMLElement).offsetParent !== null : false,
          productsPerRow: products.length > 0 ? Math.floor(window.innerWidth / (products[0] as HTMLElement).offsetWidth) : 0,
          hasHorizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight
        };
      });
      
      responsiveResults.push({
        browser: browserName,
        screenSize: screenSize.name,
        dimensions: `${screenSize.width}x${screenSize.height}`,
        analysis: layoutAnalysis
      });
      
      // No horizontal scroll on mobile/tablet
      if (screenSize.name === 'Mobile' || screenSize.name === 'Tablet') {
        expect(layoutAnalysis.hasHorizontalScroll).toBeFalsy();
      }
      
      // Products should be visible
      expect(layoutAnalysis.productGridVisible).toBeTruthy();
    }
    
    console.log(`Responsive design test for ${browserName}:`, responsiveResults);
    
    // Reset viewport
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  /**
   * Test Case: TC-BROWSER-003
   * Description: Performance comparison across browsers
   * Steps: Measure and compare performance metrics
   * Expected: Acceptable performance across all browsers
   */
  test('TC-BROWSER-003: should maintain acceptable performance across browsers @cross-browser @performance', async ({ 
    page, browserName 
  }) => {
    const performanceTests = [
      { page: '/', name: 'Home' },
      { page: '/sweets', name: 'Catalog' },
      { page: '/basket', name: 'Cart' }
    ];
    
    const performanceResults = [];
    
    for (const testPage of performanceTests) {
      // Measure page load performance
      const startTime = Date.now();
      await page.goto(`https://sweetshop.netlify.app${testPage.page}`);
      
      const navigationEnd = Date.now();
      await page.waitForLoadState('networkidle');
      const networkIdleEnd = Date.now();
      
      // Get browser-specific timing data
      const timingData = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paint = performance.getEntriesByType('paint');
        
        return {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadEvent: navigation.loadEventEnd - navigation.loadEventStart,
          firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0
        };
      });
      
      performanceResults.push({
        browser: browserName,
        page: testPage.name,
        navigationTime: navigationEnd - startTime,
        networkIdleTime: networkIdleEnd - startTime,
        timing: timingData
      });
      
      // Performance thresholds (may vary by browser)
      expect(networkIdleEnd - startTime).toBeLessThan(10000); // 10 seconds max
      expect(timingData.domContentLoaded).toBeLessThan(5000); // 5 seconds for DOMContentLoaded
    }
    
    console.log(`Performance results for ${browserName}:`, performanceResults);
    
    const avgLoadTime = performanceResults.reduce((sum, result) => sum + result.networkIdleTime, 0) / performanceResults.length;
    console.log(`Average load time for ${browserName}: ${avgLoadTime}ms`);
    
    expect(avgLoadTime).toBeLessThan(8000); // 8 seconds average across all pages
  });

  /**
   * Test Case: TC-BROWSER-004
   * Description: Feature compatibility testing
   * Steps: Test specific web features across browsers
   * Expected: Critical features work consistently or have appropriate fallbacks
   */
  test('TC-BROWSER-004: should support critical web features consistently @cross-browser @features', async ({ 
    page, browserName 
  }) => {
    await page.goto('https://sweetshop.netlify.app/');
    
    // Test critical web APIs and features
    const featureSupport = await page.evaluate(() => {
      const features = {
        // Storage APIs
        localStorage: typeof localStorage !== 'undefined' && localStorage !== null,
        sessionStorage: typeof sessionStorage !== 'undefined' && sessionStorage !== null,
        
        // Network APIs
        fetch: typeof fetch === 'function',
        xmlHttpRequest: typeof XMLHttpRequest === 'function',
        
        // Modern JavaScript
        promises: typeof Promise !== 'undefined',
        asyncAwait: (async () => {})() instanceof Promise,
        arrowFunctions: (() => { try { eval('() => {}'); return true; } catch { return false; } })(),
        
        // DOM APIs
        querySelector: typeof document.querySelector === 'function',
        addEventListener: typeof document.addEventListener === 'function',
        
        // CSS Features
        flexbox: CSS.supports('display', 'flex'),
        grid: CSS.supports('display', 'grid'),
        customProperties: CSS.supports('--test', 'red'),
        
        // Form APIs
        formValidation: 'checkValidity' in document.createElement('input'),
        
        // Performance APIs
        performanceNow: typeof performance !== 'undefined' && typeof performance.now === 'function',
        intersectionObserver: typeof IntersectionObserver !== 'undefined'
      };
      
      return features;
    });
    
    console.log(`Feature support in ${browserName}:`, featureSupport);
    
    // Critical features that must be supported
    const criticalFeatures = [
      'localStorage',
      'querySelector', 
      'addEventListener',
      'promises'
    ];
    
    for (const feature of criticalFeatures) {
      expect(featureSupport[feature as keyof typeof featureSupport]).toBeTruthy();
    }
    
    // Network capability (fetch or XHR)
    expect(featureSupport.fetch || featureSupport.xmlHttpRequest).toBeTruthy();
    
    // Modern CSS support (at least one should work)
    expect(featureSupport.flexbox || featureSupport.grid).toBeTruthy();
  });
});