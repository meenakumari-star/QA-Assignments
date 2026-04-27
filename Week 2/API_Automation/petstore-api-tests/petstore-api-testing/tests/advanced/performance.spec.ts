import { test, expect, request } from '@playwright/test';
import { PetApi } from '../../src/api/pet.api';
import { StoreApi } from '../../src/api/store.api';

const THRESHOLDS = {
  fast: 2000,
  medium: 4000,
  slow: 8000,
};

test.describe('Performance Tests', () => {
  let petApi: PetApi;
  let storeApi: StoreApi;

  test.beforeAll(async () => {
    const ctx = await request.newContext({
      baseURL: 'https://petstore.swagger.io/v2',
      extraHTTPHeaders: { 'Content-Type': 'application/json' },
    });
    petApi = new PetApi(ctx);
    storeApi = new StoreApi(ctx);
  });

  test('GET /store/inventory responds within 2s', async () => {
    const { durationMs } = await storeApi.getInventory();
    console.log(`Inventory response time: ${durationMs}ms`);
    expect(durationMs).toBeLessThan(THRESHOLDS.fast);
  });

  test('GET /pet/findByStatus responds within 4s', async () => {
    const { durationMs } = await petApi.findByStatus('available');
    console.log(`findByStatus response time: ${durationMs}ms`);
    expect(durationMs).toBeLessThan(THRESHOLDS.medium);
  });

  test('POST /pet responds within 4s', async () => {
    const { durationMs } = await petApi.addPet({ name: 'PerfTestPet', photoUrls: [] });
    console.log(`POST /pet response time: ${durationMs}ms`);
    expect(durationMs).toBeLessThan(THRESHOLDS.medium);
  });

  test('GET /store/inventory — average of 3 calls < 3s', async () => {
    const times: number[] = [];
    for (let i = 0; i < 3; i++) {
      const { durationMs } = await storeApi.getInventory();
      times.push(durationMs);
    }
    const average = times.reduce((a, b) => a + b, 0) / times.length;
    console.log(`Average inventory response: ${average.toFixed(0)}ms`);
    expect(average).toBeLessThan(3000);
  });
});
