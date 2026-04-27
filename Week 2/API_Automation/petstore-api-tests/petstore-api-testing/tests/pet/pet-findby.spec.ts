import { test, expect, request } from '@playwright/test';
import { PetApi } from '../../src/api/pet.api';

test.describe('Pet FindBy Operations', () => {
  let petApi: PetApi;

  test.beforeAll(async () => {
    const apiContext = await request.newContext({
      baseURL: 'https://petstore.swagger.io/v2',
      extraHTTPHeaders: { 'Content-Type': 'application/json' },
    });
    petApi = new PetApi(apiContext);
  });

  const statuses = ['available', 'pending', 'sold'] as const;

  for (const status of statuses) {
    test(`GET /pet/findByStatus — status="${status}" returns array`, async () => {
      const result = await petApi.findByStatus(status);

      expect(result.status).toBe(200);
      expect(Array.isArray(result.data)).toBe(true);

      for (const pet of result.data) {
        expect(pet.status).toBe(status);
        expect(pet).toHaveProperty('id');
        expect(pet).toHaveProperty('name');
        expect(pet).toHaveProperty('photoUrls');
      }
    });
  }

  test('GET /pet/findByTags — returns pets matching tag', async () => {
    const result = await petApi.findByTags(['friendly']);
    expect(result.status).toBe(200);
    expect(Array.isArray(result.data)).toBe(true);
  });
});
