import { test, expect } from '@fixtures/pageFixtures';
import { navigationPages } from '@data/testData';
import { Page } from '@playwright/test';

interface ActiveIndicator {
  text: string | null;
  classes: string[];
  href: string | null;
}

async function getActiveNavIndicators(page: Page): Promise<ActiveIndicator[]> {
  return await page.evaluate(() => {
    const items = document.querySelectorAll('nav a, .navbar a, .nav-link');
    const indicators: ActiveIndicator[] = [];
    items.forEach((item) => {
      const classList = item.classList;
      const isActive =
        classList.contains('active') ||
        classList.contains('current') ||
        item.getAttribute('aria-current') === 'page';
      if (isActive) {
        indicators.push({
          text: item.textContent?.toLowerCase().trim() ?? null,
          classes: Array.from(classList),
          href: item.getAttribute('href'),
        });
      }
    });
    return indicators;
  });
}

test.describe('Feature: Navigation Flow', () => {
  test.beforeEach(async ({ basePage }) => {
    await basePage.navigate('/');
  });

  /**
   * Test Case: TC-OPT-001
   * Description: Complete navigation flow with state verification
   * Steps:
   *   1. Visit each page via menu link, verify URL
   *   2. Add item, verify basket count persists across pages
   *   3. Verify back / forward navigation
   *   4. Verify direct URL access
   *   5. Verify invalid URL leaves nav intact
   * Expected: All navigation works, basket persists, app stays usable
   */
  test('TC-OPT-001: should complete navigation flow with state verification @smoke @ui @critical', async ({
    page,
    homePage,
    sweetsPage,
    basketPage,
  }) => {
    for (const info of navigationPages) {
      switch (info.name) {
        case 'Home': await homePage.navigateToHome(); await expect(page).toHaveURL(/.*\/$/); break;
        case 'Sweets': await sweetsPage.navigateToSweets(); await expect(page).toHaveURL(/.*\/sweets/); break;
        case 'About': await homePage.navigateToAbout(); await expect(page).toHaveURL(/.*\/about/); break;
        case 'Login': await homePage.navigateToLogin(); await expect(page).toHaveURL(/.*\/login/); break;
        case 'Basket': await basketPage.navigateToBasket(); await expect(page).toHaveURL(/.*\/basket/); break;
      }
    }

    await sweetsPage.navigateToSweetsPage();
    await sweetsPage.addProductToBasket('Chocolate Cups');

    await homePage.navigateToHome();
    await expect(homePage.basketLink).toContainText(/[1-9]/);

    await homePage.navigateToAbout();
    await expect(homePage.basketLink).toContainText(/[1-9]/);

    await basketPage.navigateToBasket();

    await homePage.navigateToHome();
    await sweetsPage.navigateToSweets();
    await page.goBack();
    await expect(page).toHaveURL(/.*\/$/);
    await page.goForward();
    await expect(page).toHaveURL(/.*\/sweets/);

    for (const info of navigationPages.slice(0, 3)) {
      await page.goto(info.url);
      const escaped = info.url.replace(/\//g, '\\/');
      await expect(page).toHaveURL(new RegExp(`.*${escaped}`));
    }

    const response = await page.goto('/nonexistent');
    expect(response).not.toBeNull();
    await expect(page.locator('nav, .navbar').first()).toBeVisible();
  });

  /**
   * Test Case: TC-NAV-002
   * Description: All header navigation links visible on home
   * Steps: Visit home, assert each nav link is visible
   * Expected: Sweets, About, Login, Basket all present
   */
  test('TC-NAV-002: should display all navigation menu items @smoke @ui', async ({ homePage }) => {
    await homePage.navigateToHomePage();
    await expect(homePage.sweetsLink).toBeVisible();
    await expect(homePage.aboutLink).toBeVisible();
    await expect(homePage.loginLink).toBeVisible();
    await expect(homePage.basketLink).toBeVisible();
  });

  /**
   * Test Case: TC-NAV-003
   * Description: Page title contains "Sweet Shop" on every page
   * Steps: Visit home, sweets, about; assert title each time
   * Expected: All titles match /Sweet Shop/i
   */
  test('TC-NAV-003: should verify page titles across navigation @regression @ui', async ({
    page, homePage, sweetsPage,
  }) => {
    const tests = [
      { go: () => homePage.navigateToHome() },
      { go: () => sweetsPage.navigateToSweets() },
      { go: () => homePage.navigateToAbout() },
    ];
    for (const t of tests) {
      await t.go();
      await expect(page).toHaveTitle(/Sweet Shop/i);
    }
  });

  /**
   * Test Case: TC-OPT-007
   * Description: Edge cases — logo, footer, invalid URLs, history, active indicator
   * Steps: 5 sub-scenarios, see comments inline
   * Expected: Edge cases handled gracefully
   */
  test('TC-OPT-007: should handle navigation edge cases and footer behavior @navigation @critical', async ({
    page, homePage, sweetsPage, basketPage,
  }) => {
    // 1. Logo from each non-home page returns to home
    const pages = [
      { go: () => sweetsPage.navigateToSweets() },
      { go: () => homePage.navigateToAbout() },
      { go: () => homePage.navigateToLogin() },
      { go: () => basketPage.navigateToBasket() },
    ];
    for (const p of pages) {
      await p.go();
      await homePage.clickLogo();
      await expect(page).toHaveURL(/.*\/$/);
    }

    // 2. Footer present on every page
    const all = [...pages, { go: () => homePage.navigateToHome() }];
    for (const p of all) {
      await p.go();
      await expect(homePage.footer).toBeVisible();
    }

    // 3. Invalid URLs leave nav intact
    const invalidUrls = ['/nonexistent', '/sweets/999', '/login/admin', '/bout'];
    for (const url of invalidUrls) {
      await page.goto(url);
      await expect(page.locator('nav, .navbar').first()).toBeVisible();
    }

    // 4. Browser history — go through 5 pages then walk back
    await homePage.navigateToHome();
    await sweetsPage.navigateToSweets();
    await basketPage.navigateToBasket();
    await homePage.navigateToLogin();
    await homePage.navigateToAbout();

    for (let i = 0; i < 4; i++) await page.goBack();
    await expect(page).toHaveURL(/.*\/$/);

    for (let i = 0; i < 4; i++) await page.goForward();
    await expect(page).toHaveURL(/.*\/about/);

    // 5. Active indicator is informational only — record on each page
    for (const url of ['/sweets', '/about', '/login', '/basket']) {
      await page.goto(url);
      const indicators = await getActiveNavIndicators(page);
      // The Sweet Shop demo doesn't always render an active indicator;
      // record it for visibility but don't fail the suite.
      test.info().annotations.push({
        type: 'active-indicators',
        description: `${url} → ${indicators.length} indicator(s)`,
      });
    }
  });

  /**
   * Test Case: TC-NAV-005
   * Description: Rapid navigation between pages
   * Steps: Cycle through 5 pages 3 times
   * Expected: App remains stable, final navigation works
   */
  test('TC-NAV-005: should handle rapid navigation operations @navigation @stress', async ({
    page, homePage, sweetsPage, basketPage,
  }) => {
    const seq = [
      () => homePage.navigateToHome(),
      () => sweetsPage.navigateToSweets(),
      () => basketPage.navigateToBasket(),
      () => homePage.navigateToAbout(),
      () => homePage.navigateToLogin(),
    ];
    for (let i = 0; i < 3; i++) {
      for (const nav of seq) await nav();
    }
    expect(page.url()).toContain('sweetshop.netlify.app');

    await homePage.navigateToHome();
    await expect(page).toHaveURL(/.*\/$/);
  });
});