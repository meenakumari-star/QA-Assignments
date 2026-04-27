import { test, expect, request } from '@playwright/test';
import { z } from 'zod';
import { PetApi } from '../../src/api/pet.api';
import { StoreApi } from '../../src/api/store.api';
import { createPetPayload } from '../../src/utils/test-data';

const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
});

const TagSchema = z.object({
  id: z.number(),
  name: z.string(),
});

const PetSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: CategorySchema.optional(),
  photoUrls: z.array(z.string()),
  tags: z.array(TagSchema).optional(),
  status: z.enum(['available', 'pending', 'sold']).optional(),
});

const OrderSchema = z.object({
  id: z.number(),
  petId: z.number(),
  quantity: z.number(),
  shipDate: z.string().optional(),
  status: z.enum(['placed', 'approved', 'delivered']).optional(),
  complete: z.boolean().optional(),
});

test.describe('Schema Validation', () => {
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

  test('Pet response matches PetSchema', async () => {
    const { data } = await petApi.addPet(createPetPayload());
    const parsed = PetSchema.safeParse(data);
    if (!parsed.success) {
      console.error('Schema violations:', parsed.error.format());
    }
    expect(parsed.success).toBe(true);
  });

  test('findByStatus response is array of valid Pets', async () => {
    const { data } = await petApi.findByStatus('available');
    const PetArraySchema = z.array(PetSchema);
    const parsed = PetArraySchema.safeParse(data);
    if (!parsed.success) {
      console.error('Array schema violations:', parsed.error.format());
    }
    expect(parsed.success).toBe(true);
  });

  test('Inventory response has correct shape', async () => {
    const InventorySchema = z.record(z.string(), z.number());
    const { data } = await storeApi.getInventory();
    const parsed = InventorySchema.safeParse(data);
    expect(parsed.success).toBe(true);
  });
});
