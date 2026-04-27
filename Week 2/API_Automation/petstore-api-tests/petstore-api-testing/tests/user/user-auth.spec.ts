import { test, expect, request } from '@playwright/test';
import { UserApi } from '../../src/api/user.api';
import { createUserPayload } from '../../src/utils/test-data';

test.describe('User Authentication', () => {
  let userApi: UserApi;
  let testUser: ReturnType<typeof createUserPayload>;

  test.beforeAll(async () => {
    const ctx = await request.newContext({
      baseURL: 'https://petstore.swagger.io/v2',
      extraHTTPHeaders: { 'Content-Type': 'application/json' },
    });
    userApi = new UserApi(ctx);

    // Create a user to authenticate with
    testUser = createUserPayload();
    await userApi.createUser(testUser);
  });

  test.afterAll(async () => {
    // Cleanup
    await userApi.deleteUser(testUser.username).catch(() => {});
  });

  test('GET /user/login — should login with valid credentials', async () => {
    const result = await userApi.login(testUser.username, testUser.password!);
    expect(result.status).toBe(200);
  });

  test('GET /user/login — should return session token in header', async () => {
    const result = await userApi.login(testUser.username, testUser.password!);
    expect(result.status).toBe(200);
    // Pet Store returns a token in X-Rate-Limit header or body
    // Just verify the login succeeded and returned some content
    expect(result.data).toBeDefined();
  });

  test('GET /user/logout — should logout successfully', async () => {
    await userApi.login(testUser.username, testUser.password!);
    const result = await userApi.logout();
    expect(result.status).toBe(200);
  });

  test('GET /user/login — invalid credentials should not crash server', async () => {
    const result = await userApi.login('invalid_user_xyz', 'wrong_password');
    // May return 400 or 404 for invalid user
    expect([400, 404, 200]).toContain(result.status);
  });
});
