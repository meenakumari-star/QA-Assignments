import { test as base, expect } from '@playwright/test';
import { HomePage } from '../tests/pages/HomePage';
import { SweetsPage } from '../tests/pages/SweetsPage';
import { BasketPage } from '../tests/pages/BasketPage';
import { CheckoutPage } from '../tests/pages/CheckoutPage';
import { LoginPage } from '../tests/pages/LoginPage';
import { SweetShopBasePage } from '../tests/pages/SweetShopBasePage';

// Extend basic test by providing page object models
export const test = base.extend<{
  homePage: HomePage;
  sweetsPage: SweetsPage;
  basketPage: BasketPage;
  checkoutPage: CheckoutPage;
  basePage: SweetShopBasePage;
  loginPage: LoginPage;
}>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
  
  sweetsPage: async ({ page }, use) => {
    const sweetsPage = new SweetsPage(page);
    await use(sweetsPage);
  },
  
  basketPage: async ({ page }, use) => {
    const basketPage = new BasketPage(page);
    await use(basketPage);
  },
  
  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },
  
  basePage: async ({ page }, use) => {
    const basePage = new SweetShopBasePage(page);
    await use(basePage);
  },
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
});

export { expect };