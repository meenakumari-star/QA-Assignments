import { test, expect, request } from '@playwright/test';
import { PetApi } from '../../src/api/pet.api';
import { createPetPayload } from '../../src/utils/test-data';
import { Pet } from '../../src/types/petstore.types';

test.describe('Pet CRUD Operations', () => {
  let petApi: PetApi;
  let createdPetId: number;

  test.beforeAll(async () => {
    const apiContext = await request.newContext({
      baseURL: 'https://petstore.swagger.io/v2',
      extraHTTPHeaders: { 'Content-Type': 'application/json' },
    });
    petApi = new PetApi(apiContext);
  });

  test('POST /pet — should create a new pet', async () => {
    const newPet = createPetPayload({ name: 'Buddy', status: 'available' });
    const result = await petApi.addPet(newPet);

    expect(result.status).toBe(200);
    expect(result.data.name).toBe('Buddy');
    expect(result.data.status).toBe('available');
    expect(result.data.id).toBeDefined();
    expect(typeof result.data.id).toBe('number');
    expect(result.durationMs).toBeLessThan(5000);

    createdPetId = result.data.id!;
  });

  test('GET /pet/{petId} — should retrieve the created pet', async () => {
    test.skip(!createdPetId, 'No pet ID from previous test');
    const result = await petApi.getPetById(createdPetId);

    expect(result.status).toBe(200);
    expect(result.data.id).toBe(createdPetId);
    expect(result.data.name).toBe('Buddy');
    expect(result.headers['content-type']).toContain('application/json');
  });

  test('PUT /pet — should update pet details', async () => {
    test.skip(!createdPetId, 'No pet ID from previous test');
    const updatedPet: Pet = {
      id: createdPetId,
      name: 'Buddy Updated',
      photoUrls: ['https://example.com/new-photo.jpg'],
      status: 'pending',
      category: { id: 2, name: 'Cats' },
    };
    const result = await petApi.updatePet(updatedPet);

    expect(result.status).toBe(200);
    expect(result.data.name).toBe('Buddy Updated');
    expect(result.data.status).toBe('pending');
  });

  test('POST /pet/{petId} — should update pet via form data', async () => {
    test.skip(!createdPetId, 'No pet ID from previous test');
    const result = await petApi.updatePetWithForm(createdPetId, 'Buddy FormUpdated', 'sold');
    expect(result.status).toBe(200);
  });

  test('DELETE /pet/{petId} — should delete the pet', async () => {
    test.skip(!createdPetId, 'No pet ID from previous test');
    const deleteResult = await petApi.deletePet(createdPetId);
    expect(deleteResult.status).toBe(200);

    const getResult = await petApi.getPetById(createdPetId);
    expect(getResult.status).toBe(404);
  });

  test('GET /pet/{petId} — should return 404 for nonexistent pet', async () => {
    const result = await petApi.getPetById(999999999);
    expect(result.status).toBe(404);
  });

  test('POST /pet — should handle pet with minimum required fields', async () => {
    const result = await petApi.addPet({ name: 'MinimalPet', photoUrls: [] });
    expect(result.status).toBe(200);
    expect(result.data.name).toBe('MinimalPet');
  });
});
