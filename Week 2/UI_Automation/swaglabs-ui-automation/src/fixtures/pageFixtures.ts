import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { Users } from '../utils/TestData';

type Pages = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  loggedInPage: InventoryPage; // session pre-authenticated as standard_user
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  loggedInPage: async ({ page }, use) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    await login.goto();
    await login.login(Users.standard.username, Users.standard.password);
    await inventory.assertLoaded();
    await use(inventory);
  },
});

export { expect, CartPage, CheckoutPage } from '@playwright/test';
