import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testIgnore: [
    '**/../petstore-api-automation/**',
    '**/../*automation*/**',
    '**/../*api-automation*/**',
    '**/../myproject-api-tests/**',
    '**/../myproject-api-tests/**/*',
  ],
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    ['list'],
    ['allure-playwright', { outputFolder: 'allure-results' }]
  ],
  use: {
    baseURL: 'https://petstore.swagger.io/v2',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    actionTimeout: 30_000,
  },
  timeout: 60_000,
  projects: [
    { name: 'Pet API',     testMatch: 'tests/pet/**/*.spec.ts' },
    { name: 'Store API',   testMatch: 'tests/store/**/*.spec.ts' },
    { name: 'User API',    testMatch: 'tests/user/**/*.spec.ts' },
    { name: 'Advanced',    testMatch: 'tests/advanced/**/*.spec.ts' },
    { name: 'Integration', testMatch: 'tests/integration/**/*.spec.ts' },
  ],
});
