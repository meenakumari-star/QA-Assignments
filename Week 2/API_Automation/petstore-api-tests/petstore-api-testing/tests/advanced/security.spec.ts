import { test, expect, request } from '@playwright/test';
import { PetApi } from '../../src/api/pet.api';
import { UserApi } from '../../src/api/user.api';
import { createUserPayload } from '../../src/utils/test-data';

test.describe('Security Tests', () => {
  let petApi: PetApi;
  let userApi: UserApi;

  test.beforeAll(async () => {
    const ctx = await request.newContext({
      baseURL: 'https://petstore.swagger.io/v2',
      extraHTTPHeaders: { 'Content-Type': 'application/json' },
    });
    petApi = new PetApi(ctx);
    userApi = new UserApi(ctx);
  });

  test('SQL injection in pet name should not cause server error', async () => {
    const maliciousPayload = { name: "'; DROP TABLE pets; --", photoUrls: [] };
    const result = await petApi.addPet(maliciousPayload);
    expect(result.status).not.toBe(500);
    expect([200, 400, 422]).toContain(result.status);
  });

  test('XSS payload in pet name is stored without execution risk', async () => {
    const xssPayload = { name: '<script>alert("xss")</script>', photoUrls: [] };
    const result = await petApi.addPet(xssPayload);
    expect(result.status).not.toBe(500);
    if (result.status === 200 && result.data.name) {
      expect(result.data.name).toBe('<script>alert("xss")</script>');
    }
  });

  test('Password not returned in GET /user/{username} response', async () => {
    const user = createUserPayload();
    await userApi.createUser(user);
    const result = await userApi.getUserByName(user.username);
    if (result.status === 200) {
      const responseStr = JSON.stringify(result.data);
      expect(responseStr).not.toContain(user.password!);
    }
    await userApi.deleteUser(user.username).catch(() => {});
  });

  test('Extremely long pet name handled gracefully (no 500)', async () => {
    const longName = 'A'.repeat(10_000);
    const result = await petApi.addPet({ name: longName, photoUrls: [] });
    expect(result.status).not.toBe(500);
  });

  test('Request with wrong Content-Type returns graceful response', async () => {
    const ctx = await request.newContext({
      baseURL: 'https://petstore.swagger.io/v2',
      extraHTTPHeaders: { 'Content-Type': 'text/plain' },
    });
    const rawResponse = await ctx.post('/pet', { data: 'not json' });
    expect([400, 415, 200]).toContain(rawResponse.status());
    await ctx.dispose();
  });
});
