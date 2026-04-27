import { test, expect, request } from '@playwright/test';
import { PetApi } from '../../src/api/pet.api';
import { StoreApi } from '../../src/api/store.api';
import { UserApi } from '../../src/api/user.api';

test.describe('Error Handling', () => {
  let petApi: PetApi;
  let storeApi: StoreApi;
  let userApi: UserApi;

  test.beforeAll(async () => {
    const ctx = await request.newContext({
      baseURL: 'https://petstore.swagger.io/v2',
      extraHTTPHeaders: { 'Content-Type': 'application/json' },
    });
    petApi = new PetApi(ctx);
    storeApi = new StoreApi(ctx);
    userApi = new UserApi(ctx);
  });

  test('GET /pet/{id} — 404 when pet does not exist', async () => {
    const result = await petApi.getPetById(999_999_999);
    expect(result.status).toBe(404);
  });

  test('GET /store/order/{id} — 404 when order does not exist', async () => {
    const result = await storeApi.getOrderById(999_999_999);
    expect(result.status).toBe(404);
  });

  test('GET /user/{username} — 404 when user does not exist', async () => {
    const result = await userApi.getUserByName('definitelynotauser12345xyz');
    expect(result.status).toBe(404);
  });

  test('DELETE /pet without ID — 405 Method Not Allowed', async () => {
    const ctx = await request.newContext({ baseURL: 'https://petstore.swagger.io/v2' });
    const response = await ctx.delete('/pet');
    expect(response.status()).toBe(405);
    await ctx.dispose();
  });

  test('GET /pet/{id} — 400/404 for non-numeric string ID', async () => {
    const ctx = await request.newContext({ baseURL: 'https://petstore.swagger.io/v2' });
    const response = await ctx.get('/pet/not-a-number');
    expect([400, 404]).toContain(response.status());
    await ctx.dispose();
  });

  test('Negative pet ID — graceful error response', async () => {
    const result = await petApi.getPetById(-1);
    expect([400, 404]).toContain(result.status);
  });

  test('Zero pet ID — graceful error response', async () => {
    const result = await petApi.getPetById(0);
    expect([400, 404]).toContain(result.status);
  });
});
