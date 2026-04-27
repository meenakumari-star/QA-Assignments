import { expect } from '@playwright/test';
import { test as base } from '@fixtures/pageFixtures';

import type { Page, BrowserContext } from '@playwright/test';
import userData from '@data/users.json';
import type { LoginPage } from '../../pages/LoginPage';

const test = base;

interface SessionSnapshot {
  cookies: Array<{
    name: string;
    value: string;
    secure: boolean;
    httpOnly: boolean;
    sameSite?: string;
  }>;
  localStorage: Record<string, string>;
  sessionStorage: Record<string, string>;
}

async function captureSession(page: Page, context: BrowserContext): Promise<SessionSnapshot> {
  const url = page.url();

  const cookies = (await context.cookies(url)).map(c => ({
    name: c.name,
    value: c.value,
    secure: c.secure,
    httpOnly: c.httpOnly,
    sameSite: c.sameSite as unknown as string,
  }));

  const localStorage = await page.evaluate(() => {
    const out: Record<string, string> = {};
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k) out[k] = window.localStorage.getItem(k) ?? '';
    }
    return out;
  });

  const sessionStorage = await page.evaluate(() => {
    const out: Record<string, string> = {};
    for (let i = 0; i < window.sessionStorage.length; i++) {
      const k = window.sessionStorage.key(i);
      if (k) out[k] = window.sessionStorage.getItem(k) ?? '';
    }
    return out;
  });

  return { cookies, localStorage, sessionStorage };
}

function findAuthArtefacts(s: SessionSnapshot) {
  const isAuthName = (n: string) => /token|session|auth|jwt|user|login/i.test(n);
  return {
    cookies: s.cookies.filter(c => isAuthName(c.name)),
    localStorageKeys: Object.keys(s.localStorage).filter(isAuthName),
    sessionStorageKeys: Object.keys(s.sessionStorage).filter(isAuthName),
  };
}

async function isLoggedIn(page: Page): Promise<boolean> {
  return !page.url().includes('/login');
}

test.describe('Feature: Authentication Session Management', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate('/login');
  });

  test('TC-OPT-011: should not expose insecure auth artefacts @security @session @critical', async ({
    page,
    context,
    loginPage,
  }) => {
    await loginPage.login(userData.validUser.email, userData.validUser.password);

    const snapshot = await captureSession(page, context);
    const auth = findAuthArtefacts(snapshot);

    for (const c of auth.cookies) {
      if (page.url().startsWith('https://')) {
        expect(c.secure).toBeTruthy();
      }
      expect(c.httpOnly).toBeTruthy();
    }

    const allValues = [
      ...auth.localStorageKeys.map(k => snapshot.localStorage[k]),
      ...auth.sessionStorageKeys.map(k => snapshot.sessionStorage[k]),
    ];

    for (const value of allValues) {
      expect(value).not.toContain(userData.validUser.password);
    }
  });

  test('TC-SESSION-002: should handle concurrent sessions consistently @session @security', async ({
    browser,
  }) => {
    const ctxA = await browser.newContext();
    const ctxB = await browser.newContext();

    try {
      const pageA = await ctxA.newPage();
      const pageB = await ctxB.newPage();

      await pageA.goto('/login');
      await pageA.fill('input[type="email"]', userData.validUser.email);
      await pageA.fill('input[type="password"]', userData.validUser.password);
      await Promise.all([
        pageA.waitForNavigation(),
        pageA.getByRole('button', { name: /login/i }).click(),
      ]);

      await pageB.goto('/login');
      await pageB.fill('input[type="email"]', userData.validUser.email);
      await pageB.fill('input[type="password"]', userData.validUser.password);
      await Promise.all([
        pageB.waitForNavigation(),
        pageB.getByRole('button', { name: /login/i }).click(),
      ]);

      await pageA.reload();

      const aLoggedIn = await isLoggedIn(pageA);
      const bLoggedIn = await isLoggedIn(pageB);

      const validOutcome =
        (aLoggedIn && bLoggedIn) ||
        (!aLoggedIn && bLoggedIn) ||
        (!aLoggedIn && !bLoggedIn);

      expect(validOutcome).toBeTruthy();
    } finally {
      await ctxA.close();
      await ctxB.close();
    }
  });

  test('TC-SESSION-003: should set reasonable session lifetimes @session @timeout', async ({
    page,
    context,
    loginPage,
  }) => {
    await loginPage.login(userData.validUser.email, userData.validUser.password);

    const cookies = await context.cookies(page.url());
    const authCookies = cookies.filter(c => /token|session|auth|jwt/i.test(c.name));

    const THIRTY_DAYS_SEC = 30 * 24 * 60 * 60;
    const nowSec = Math.floor(Date.now() / 1000);

    for (const c of authCookies) {
      if (c.expires === -1) continue;

      const lifetime = c.expires - nowSec;

      expect(lifetime).toBeGreaterThan(0);
      expect(lifetime).toBeLessThanOrEqual(THIRTY_DAYS_SEC);
    }
  });

  test('TC-SESSION-004: should synchronize session state across tabs @session @multi-tab', async ({
    page,
    context,
    loginPage,
  }) => {
    await loginPage.login(userData.validUser.email, userData.validUser.password);

    const tab1 = page;
    const tab2 = await context.newPage();

    await tab2.goto('/');

    const snap1 = await captureSession(tab1, context);
    const snap2 = await captureSession(tab2, context);

    expect(snap2.cookies.map(c => c.name).sort()).toEqual(
      snap1.cookies.map(c => c.name).sort()
    );

    const auth1 = findAuthArtefacts(snap1);
    const auth2 = findAuthArtefacts(snap2);

    expect(auth2.localStorageKeys.sort()).toEqual(auth1.localStorageKeys.sort());

    await tab2.close();
  });
});
