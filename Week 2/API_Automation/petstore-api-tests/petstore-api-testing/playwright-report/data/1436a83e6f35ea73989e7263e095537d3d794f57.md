# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: advanced\security.spec.ts >> Security Tests >> Request with wrong Content-Type returns graceful response
- Location: tests\advanced\security.spec.ts:52:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected value: 404
Received array: [400, 415, 200]
```

# Test source

```ts
  1  | import { test, expect, request } from '@playwright/test';
  2  | import { PetApi } from '../../src/api/pet.api';
  3  | import { UserApi } from '../../src/api/user.api';
  4  | import { createUserPayload } from '../../src/utils/test-data';
  5  | 
  6  | test.describe('Security Tests', () => {
  7  |   let petApi: PetApi;
  8  |   let userApi: UserApi;
  9  | 
  10 |   test.beforeAll(async () => {
  11 |     const ctx = await request.newContext({
  12 |       baseURL: 'https://petstore.swagger.io/v2',
  13 |       extraHTTPHeaders: { 'Content-Type': 'application/json' },
  14 |     });
  15 |     petApi = new PetApi(ctx);
  16 |     userApi = new UserApi(ctx);
  17 |   });
  18 | 
  19 |   test('SQL injection in pet name should not cause server error', async () => {
  20 |     const maliciousPayload = { name: "'; DROP TABLE pets; --", photoUrls: [] };
  21 |     const result = await petApi.addPet(maliciousPayload);
  22 |     expect(result.status).not.toBe(500);
  23 |     expect([200, 400, 422]).toContain(result.status);
  24 |   });
  25 | 
  26 |   test('XSS payload in pet name is stored without execution risk', async () => {
  27 |     const xssPayload = { name: '<script>alert("xss")</script>', photoUrls: [] };
  28 |     const result = await petApi.addPet(xssPayload);
  29 |     expect(result.status).not.toBe(500);
  30 |     if (result.status === 200 && result.data.name) {
  31 |       expect(result.data.name).toBe('<script>alert("xss")</script>');
  32 |     }
  33 |   });
  34 | 
  35 |   test('Password not returned in GET /user/{username} response', async () => {
  36 |     const user = createUserPayload();
  37 |     await userApi.createUser(user);
  38 |     const result = await userApi.getUserByName(user.username);
  39 |     if (result.status === 200) {
  40 |       const responseStr = JSON.stringify(result.data);
  41 |       expect(responseStr).not.toContain(user.password!);
  42 |     }
  43 |     await userApi.deleteUser(user.username).catch(() => {});
  44 |   });
  45 | 
  46 |   test('Extremely long pet name handled gracefully (no 500)', async () => {
  47 |     const longName = 'A'.repeat(10_000);
  48 |     const result = await petApi.addPet({ name: longName, photoUrls: [] });
  49 |     expect(result.status).not.toBe(500);
  50 |   });
  51 | 
  52 |   test('Request with wrong Content-Type returns graceful response', async () => {
  53 |     const ctx = await request.newContext({
  54 |       baseURL: 'https://petstore.swagger.io/v2',
  55 |       extraHTTPHeaders: { 'Content-Type': 'text/plain' },
  56 |     });
  57 |     const rawResponse = await ctx.post('/pet', { data: 'not json' });
> 58 |     expect([400, 415, 200]).toContain(rawResponse.status());
     |                             ^ Error: expect(received).toContain(expected) // indexOf
  59 |     await ctx.dispose();
  60 |   });
  61 | });
  62 | 
```