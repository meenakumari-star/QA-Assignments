import { test, expect, request } from '@playwright/test';
import { PetApi } from '../../src/api/pet.api';
import { StoreApi } from '../../src/api/store.api';
import { UserApi } from '../../src/api/user.api';
import { createPetPayload, createOrderPayload, createUserPayload } from '../../src/utils/test-data';

test.describe('End-to-End Workflows', () => {
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

  test('Full pet adoption flow: create → list → order → verify', async () => {
    // Step 1: Add a pet
    const pet = createPetPayload({ name: 'Adoption Pet', status: 'available' });
    const addResult = await petApi.addPet(pet);
    expect(addResult.status).toBe(200);
    const petId = addResult.data.id!;

    // Step 2: Confirm findByStatus works
    const listResult = await petApi.findByStatus('available');
    expect(listResult.status).toBe(200);
    expect(Array.isArray(listResult.data)).toBe(true);

    // Step 3: Place an order
    const order = createOrderPayload(petId);
    const orderResult = await storeApi.placeOrder(order);
    expect(orderResult.status).toBe(200);
    const orderId = orderResult.data.id!;

    // Step 4: Verify order
    const getOrderResult = await storeApi.getOrderById(orderId);
    expect(getOrderResult.status).toBe(200);
    expect(getOrderResult.data.petId).toBe(petId);

    // Step 5: Cleanup
    await storeApi.deleteOrder(orderId);
    await petApi.deletePet(petId);
  });

  test('User lifecycle: register → login → update → logout → delete', async () => {
    // Step 1: Create user
    const user = createUserPayload();
    const createResult = await userApi.createUser(user);
    expect(createResult.status).toBe(200);

    // Step 2: Login
    const loginResult = await userApi.login(user.username, user.password!);
    expect(loginResult.status).toBe(200);

    // Step 3: Get user
    const getResult = await userApi.getUserByName(user.username);
    expect(getResult.status).toBe(200);
    expect(getResult.data.username).toBe(user.username);

    // Step 4: Update user
    const updateResult = await userApi.updateUser(user.username, {
      ...user,
      firstName: 'UpdatedName',
    });
    expect(updateResult.status).toBe(200);

    // Step 5: Logout
    const logoutResult = await userApi.logout();
    expect(logoutResult.status).toBe(200);

    // Step 6: Delete user
    await userApi.deleteUser(user.username);
  });

  test('Inventory remains accessible after pet/order operations', async () => {
    const inventoryBefore = await storeApi.getInventory();
    expect(inventoryBefore.status).toBe(200);

    const pet = await petApi.addPet(createPetPayload());
    const order = await storeApi.placeOrder(createOrderPayload(pet.data.id!));

    const inventoryAfter = await storeApi.getInventory();
    expect(inventoryAfter.status).toBe(200);
    expect(typeof inventoryAfter.data).toBe('object');

    // Cleanup
    await storeApi.deleteOrder(order.data.id!);
    await petApi.deletePet(pet.data.id!);
  });
});
