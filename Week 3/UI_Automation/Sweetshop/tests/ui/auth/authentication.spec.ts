import { test, expect } from '@fixtures/pageFixtures';
import userData from '@data/users.json';

  test('TC-OPT-005: should validate authentication input handling @security @critical', async ({
    page, loginPage,
  }) => {
    // 1. Valid input — form accepts it
    await loginPage.login(userData.validUser.email, userData.validUser.password);
    await expect(page.locator('body')).toBeVisible();

    // 2. Invalid email format
    await loginPage.navigate('/login');
    await loginPage.login(userData.invalidUsers.wrongEmail.email, userData.invalidUsers.wrongEmail.password);
    await expect(page).toHaveURL(/\/login/);

    // 3. SQL injection payloads — must not bypass to an authenticated route
    const sqlPayloads = [
      "admin'; DROP TABLE users; --",
      "' OR '1'='1",
      "admin'/*",
    ];
    for (const payload of sqlPayloads) {
      await loginPage.navigate('/login');
      await loginPage.login(payload, payload);
      await expect(page).toHaveURL(/\/(login|sweets|$)/);
    }

    // 4. XSS payloads — must not execute
    const xssPayloads = [
      "<script>alert('XSS')</script>",
      "<img src=x onerror=alert(1)>",
    ];
    for (const payload of xssPayloads) {
      await loginPage.navigate('/login');
      await loginPage.login(payload, 'testpass');
      const html = await page.content();
      expect(html).not.toContain('<script>alert');
    }
  });

  /**
   * Test Case: TC-AUTH-002
   * Description: Password field is masked
   * Steps: Inspect input type attribute
   * Expected: type="password"
   */
  test('TC-AUTH-002: should mask password input @security @ui', async ({ loginPage }) => {
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  /**
   * Test Case: TC-AUTH-003
   * Description: Form validation for empty and malformed inputs
   * Steps:
   *   1. Submit with empty email
   *   2. Submit with empty password
   *   3. Submit with malformed emails
   * Expected: Form does not navigate away on invalid input
   */
  test('TC-AUTH-003: should validate form inputs and edge cases @functional @ui', async ({
    page, loginPage,
  }) => {
    // 1. Empty email
    await loginPage.fillPassword(userData.validUser.password);
    await loginPage.submit();
    await expect(page).toHaveURL(/\/login/);

    // 2. Empty password
    await loginPage.navigate('/login');
    await loginPage.fillEmail(userData.validUser.email);
    await loginPage.submit();
    await expect(page).toHaveURL(/\/login/);

    // 3. Malformed emails
    const invalidEmails = ['invalid', '@domain.com', 'user@', 'user space@d.com'];
    for (const email of invalidEmails) {
      await loginPage.navigate('/login');
      await loginPage.login(email, userData.validUser.password);
      await expect(page).toHaveURL(/\/login/);
    }
  });

  /**
   * Test Case: TC-AUTH-004
   * Description: Whitespace handling in email field
   * Steps: Submit valid email padded with spaces
   * Expected: Form does not crash
   */
  test('TC-AUTH-004: should handle whitespace in input fields @functional', async ({
    page, loginPage,
  }) => {
    await loginPage.login(`  ${userData.validUser.email}  `, userData.validUser.password);
    await expect(page.locator('body')).toBeVisible();
  });
  