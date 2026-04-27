import { test, expect, request } from '@playwright/test';
import { StoreApi } from '../../src/api/store.api';
import { PetApi } from '../../src/api/pet.api';
import { createPetPayload, createOrderPayload } from '../../src/utils/test-data';

test.describe('Store Order Operations', () => {
  let storeApi: StoreApi;
  let petApi: PetApi;
  let createdPetId: number;
  let createdOrderId: number;

  test.beforeAll(async () => {
    const ctx = await request.newContext({
      baseURL: 'https://petstore.swagger.io/v2',
      extraHTTPHeaders: { 'Content-Type': 'application/json' },
    });
    storeApi = new StoreApi(ctx);
    petApi = new PetApi(ctx);

    const pet = await petApi.addPet(createPetPayload());
    createdPetId = pet.data.id!;
  });

  test('GET /store/inventory — should return inventory object', async () => {
    const result = await storeApi.getInventory();
    expect(result.status).toBe(200);
    expect(typeof result.data).toBe('object');
    for (const [key, value] of Object.entries(result.data)) {
      expect(typeof key).toBe('string');
      expect(typeof value).toBe('number');
    }
  });

  test('POST /store/order — should place an order', async () => {
    const order = createOrderPayload(createdPetId);
    const result = await storeApi.placeOrder(order);

    expect(result.status).toBe(200);
    expect(result.data.petId).toBe(createdPetId);
    expect(result.data.status).toBe('placed');
    expect(result.data.id).toBeDefined();

    createdOrderId = result.data.id!;
  });

  test('GET /store/order/{orderId} — should retrieve order', async () => {
    test.skip(!createdOrderId, 'No order ID from previous test');
    const result = await storeApi.getOrderById(createdOrderId);

    expect(result.status).toBe(200);
    expect(result.data.id).toBe(createdOrderId);
    expect(result.data.petId).toBe(createdPetId);
  });

  test('DELETE /store/order/{orderId} — should cancel order', async () => {
    test.skip(!createdOrderId, 'No order ID from previous test');
    const result = await storeApi.deleteOrder(createdOrderId);
    expect(result.status).toBe(200);

    const getResult = await storeApi.getOrderById(createdOrderId);
    expect(getResult.status).toBe(404);
  });

  test('GET /store/order/{orderId} — 404 for invalid ID', async () => {
    const result = await storeApi.getOrderById(999999999);
    expect(result.status).toBe(404);
  });

  test('POST /store/order — boundary: order with quantity 0', async () => {
    const order = createOrderPayload(createdPetId, { quantity: 0 });
    const result = await storeApi.placeOrder(order);
    expect([200, 400]).toContain(result.status);
  });
});
