import { test, expect } from '../src/fixtures/pageFixtures';
import { Users, ErrorMessages } from '../src/utils/TestData';

test.describe('Login flow @smoke @regression', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('TC_LOGIN_001: standard user can log in', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(Users.standard.username, Users.standard.password);
    await inventoryPage.assertLoaded();
  });

  test('TC_LOGIN_002: locked-out user sees lockout error', async ({ loginPage }) => {
    await loginPage.login(Users.lockedOut.username, Users.lockedOut.password);
    expect(await loginPage.getErrorMessage()).toBe(ErrorMessages.lockedOut);
  });

  test('TC_LOGIN_003: invalid credentials are rejected', async ({ loginPage }) => {
    await loginPage.login(Users.invalid.username, Users.invalid.password);
    expect(await loginPage.getErrorMessage()).toBe(ErrorMessages.badCredentials);
  });

  test('TC_LOGIN_004: empty username shows required error', async ({ loginPage }) => {
    await loginPage.login('', Users.standard.password);
    expect(await loginPage.getErrorMessage()).toBe(ErrorMessages.emptyUsername);
  });

  test('TC_LOGIN_005: empty password shows required error', async ({ loginPage }) => {
    await loginPage.login(Users.standard.username, '');
    expect(await loginPage.getErrorMessage()).toBe(ErrorMessages.emptyPassword);
  });

  test('TC_LOGIN_006: problem user can log in', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(Users.problem.username, Users.problem.password);
    await inventoryPage.assertLoaded();
  });

  test('TC_LOGIN_007: performance glitch user can log in', async ({ loginPage, inventoryPage }) => {
    test.setTimeout(90 * 1000);
    await loginPage.login(Users.performance.username, Users.performance.password);
    await inventoryPage.assertLoaded();
  });

  test('TC_LOGIN_008: logout returns user to login screen', async ({ loginPage, inventoryPage, page }) => {
    await loginPage.login(Users.standard.username, Users.standard.password);
    await inventoryPage.assertLoaded();
    await inventoryPage.logout();
    await expect(page).toHaveURL(/\/$|\/index\.html/);
    await expect(loginPage.loginButton).toBeVisible();
  });
});
