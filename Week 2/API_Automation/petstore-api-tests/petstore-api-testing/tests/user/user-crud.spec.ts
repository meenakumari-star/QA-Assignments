import { test, expect, request } from '@playwright/test';
import { UserApi } from '../../src/api/user.api';
import { createUserPayload } from '../../src/utils/test-data';

test.describe('User CRUD Operations', () => {
  let userApi: UserApi;
  let testUsername: string;

  test.beforeAll(async () => {
    const ctx = await request.newContext({
      baseURL: 'https://petstore.swagger.io/v2',
      extraHTTPHeaders: { 'Content-Type': 'application/json' },
    });
    userApi = new UserApi(ctx);
  });

  test('POST /user — should create a user', async () => {
    const user = createUserPayload();
    testUsername = user.username;
    const result = await userApi.createUser(user);
    expect(result.status).toBe(200);
  });

  test('GET /user/{username} — should fetch created user', async () => {
    test.skip(!testUsername, 'No username from previous test');
    const result = await userApi.getUserByName(testUsername);

    expect(result.status).toBe(200);
    expect(result.data.username).toBe(testUsername);
    // Password should never appear in response
    expect((result.data as any).password).toBeUndefined();
  });

  test('PUT /user/{username} — should update user', async () => {
    test.skip(!testUsername, 'No username from previous test');
    const updatedUser = createUserPayload({
      username: testUsername,
      firstName: 'Updated',
      email: 'updated@example.com',
    });
    const result = await userApi.updateUser(testUsername, updatedUser);
    expect(result.status).toBe(200);
  });

  test('DELETE /user/{username} — should delete user', async () => {
    test.skip(!testUsername, 'No username from previous test');
    const result = await userApi.deleteUser(testUsername);
    expect(result.status).toBe(200);

    const getResult = await userApi.getUserByName(testUsername);
    expect(getResult.status).toBe(404);
  });

  test('POST /user/createWithList — create multiple users', async () => {
    const users = [
      createUserPayload({ username: `bulk_user_1_${Date.now()}` }),
      createUserPayload({ username: `bulk_user_2_${Date.now()}` }),
    ];
    const result = await userApi.createUsersWithList(users);
    expect(result.status).toBe(200);
  });
});
