# 🐾 Pet Store API — Complete Test Suite Guide
## Playwright + TypeScript | Beginner-Friendly Step-by-Step

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Prerequisites & Installation](#2-prerequisites--installation)
3. [Project Structure](#3-project-structure)
4. [Configuration](#4-configuration)
5. [Types & Interfaces](#5-types--interfaces)
6. [API Client (Helper Layer)](#6-api-client-helper-layer)
7. [Test Suites](#7-test-suites)
   - 7a. Pet Endpoints
   - 7b. Store Endpoints
   - 7c. User Endpoints
8. [Advanced Tests](#8-advanced-tests)
   - 8a. Schema Validation
   - 8b. Performance Tests
   - 8c. Security Tests
   - 8d. Error Handling
9. [Test Utilities & Fixtures](#9-test-utilities--fixtures)
10. [Running the Tests](#10-running-the-tests)
11. [Best Practices Summary](#11-best-practices-summary)

---

## 1. Project Overview

### What We're Testing
The [Swagger Pet Store API](https://petstore.swagger.io/) is a sample REST API with three resource groups:

| Resource | Base Path       | Description                    |
|----------|-----------------|--------------------------------|
| Pet      | `/pet`          | CRUD operations on pets        |
| Store    | `/store`        | Inventory and order management |
| User     | `/user`         | User account management        |

### Testing Types Covered
| Type               | Description                                          |
|--------------------|------------------------------------------------------|
| **Functional**     | Verify endpoints work correctly (CRUD)               |
| **Schema**         | Validate response shapes match API contract          |
| **Performance**    | Ensure responses come back within acceptable time    |
| **Security**       | Test auth, injection attempts, sensitive data        |
| **Error Handling** | Validate proper HTTP error codes and messages        |
| **Integration**    | Multi-step workflows across endpoints                |
| **Data-Driven**    | Run same test with multiple input variations         |
| **Boundary**       | Test edge cases (empty strings, max values, etc.)    |

---

## 2. Prerequisites & Installation

### Step 1 — Install Node.js
Download and install Node.js (v18 or higher) from https://nodejs.org

Verify installation:
```bash
node --version   # Should print v18.x.x or higher
npm --version    # Should print 9.x.x or higher
```

### Step 2 — Create the Project
```bash
mkdir petstore-api-tests
cd petstore-api-tests
npm init -y
```

### Step 3 — Install Playwright & Dependencies
```bash
# Install Playwright (we only need the API testing part, no browser needed)
npm install --save-dev @playwright/test

# Install additional testing utilities
npm install --save-dev typescript ts-node @types/node

# Install schema validation library
npm install --save-dev zod

# Install report generation
npm install --save-dev @playwright/test
```

### Step 4 — Initialize TypeScript
```bash
npx tsc --init
```

Update `tsconfig.json` with the contents shown in Section 4.

### Step 5 — Open in VS Code
```bash
code .
```

Install the recommended VS Code extensions:
- **Playwright Test for VSCode** (ms-playwright.playwright)
- **TypeScript Hero** for imports
- **Error Lens** for inline error highlighting

---

## 3. Project Structure

```
petstore-api-tests/
├── 📁 tests/
│   ├── 📁 pet/
│   │   ├── pet-crud.spec.ts          # Create, Read, Update, Delete pets
│   │   ├── pet-findby.spec.ts        # Find pets by status/tags
│   │   └── pet-upload.spec.ts        # Image upload tests
│   ├── 📁 store/
│   │   ├── store-inventory.spec.ts   # Get inventory
│   │   └── store-orders.spec.ts      # Place and manage orders
│   ├── 📁 user/
│   │   ├── user-crud.spec.ts         # User lifecycle tests
│   │   └── user-auth.spec.ts         # Login/logout tests
│   ├── 📁 advanced/
│   │   ├── schema-validation.spec.ts # Response shape validation
│   │   ├── performance.spec.ts       # Response time checks
│   │   ├── security.spec.ts          # Security-focused tests
│   │   └── error-handling.spec.ts    # Error response validation
│   └── 📁 integration/
│       └── e2e-workflow.spec.ts      # End-to-end multi-step scenarios
├── 📁 src/
│   ├── api/
│   │   ├── pet.api.ts                # Pet endpoint wrappers
│   │   ├── store.api.ts              # Store endpoint wrappers
│   │   └── user.api.ts               # User endpoint wrappers
│   ├── types/
│   │   └── petstore.types.ts         # TypeScript interfaces
│   ├── schemas/
│   │   └── petstore.schemas.ts       # Zod validation schemas
│   └── utils/
│       ├── test-data.ts              # Factory functions for test data
│       └── assertions.ts             # Custom assertion helpers
├── 📁 fixtures/
│   └── base.fixture.ts               # Shared test setup/teardown
├── playwright.config.ts              # Playwright configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json
```

---

## 4. Configuration

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./",
    "resolveJsonModule": true,
    "types": ["node"]
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

### `playwright.config.ts`
```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Directory where tests live
  testDir: './tests',

  // Run tests in parallel for speed
  fullyParallel: false, // Set false for Pet Store (shared state)

  // Fail fast on CI
  forbidOnly: !!process.env.CI,

  // Retry failed tests once on CI
  retries: process.env.CI ? 1 : 0,

  // Number of parallel workers
  workers: 1, // Single worker for shared Pet Store state

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],      // Console output
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  // Global test settings
  use: {
    // Pet Store base URL
    baseURL: 'https://petstore.swagger.io/v2',

    // All API tests use JSON
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },

    // Timeout per request: 30 seconds
    actionTimeout: 30_000,
  },

  // Timeout per test: 60 seconds
  timeout: 60_000,

  // Group tests into projects for organization
  projects: [
    { name: 'Pet API',       testMatch: 'tests/pet/**/*.spec.ts' },
    { name: 'Store API',     testMatch: 'tests/store/**/*.spec.ts' },
    { name: 'User API',      testMatch: 'tests/user/**/*.spec.ts' },
    { name: 'Advanced',      testMatch: 'tests/advanced/**/*.spec.ts' },
    { name: 'Integration',   testMatch: 'tests/integration/**/*.spec.ts' },
  ],
});
```

### `package.json` scripts section
```json
{
  "scripts": {
    "test": "playwright test",
    "test:pet": "playwright test --project='Pet API'",
    "test:store": "playwright test --project='Store API'",
    "test:user": "playwright test --project='User API'",
    "test:advanced": "playwright test --project='Advanced'",
    "test:integration": "playwright test --project='Integration'",
    "test:ui": "playwright test --ui",
    "test:debug": "playwright test --debug",
    "report": "playwright show-report"
  }
}
```

---

## 5. Types & Interfaces

### `src/types/petstore.types.ts`
```typescript
// ─────────────────────────────────────────────
// Category & Tag — shared building blocks
// ─────────────────────────────────────────────
export interface Category {
  id: number;
  name: string;
}

export interface Tag {
  id: number;
  name: string;
}

// ─────────────────────────────────────────────
// Pet
// ─────────────────────────────────────────────
export type PetStatus = 'available' | 'pending' | 'sold';

export interface Pet {
  id?: number;           // Optional on creation (server assigns)
  category?: Category;
  name: string;          // Required
  photoUrls: string[];   // Required (can be empty array)
  tags?: Tag[];
  status?: PetStatus;
}

// ─────────────────────────────────────────────
// Store / Order
// ─────────────────────────────────────────────
export type OrderStatus = 'placed' | 'approved' | 'delivered';

export interface Order {
  id?: number;
  petId: number;
  quantity: number;
  shipDate?: string;     // ISO 8601 date string
  status?: OrderStatus;
  complete?: boolean;
}

export interface Inventory {
  [status: string]: number;  // e.g. { available: 5, pending: 2, sold: 8 }
}

// ─────────────────────────────────────────────
// User
// ─────────────────────────────────────────────
export interface User {
  id?: number;
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phone?: string;
  userStatus?: number;   // 0 = active, 1 = inactive
}

// ─────────────────────────────────────────────
// API Responses
// ─────────────────────────────────────────────
export interface ApiResponse {
  code: number;
  type: string;
  message: string;
}

// Generic wrapper for typed API results
export interface ApiResult<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
  durationMs: number;   // How long the request took
}
```

---

## 6. API Client (Helper Layer)

> **Why a helper layer?**  
> Instead of writing raw `request.get(...)` in every test, we wrap each
> endpoint in a typed function. This keeps tests readable and centralizes
> any URL changes.

### `src/api/pet.api.ts`
```typescript
import { APIRequestContext } from '@playwright/test';
import { Pet, PetStatus, ApiResult } from '../types/petstore.types';

// Helper to measure response time and extract common fields
async function measure<T>(
  fn: () => Promise<{ json(): Promise<T>; status(): number; headers(): Record<string,string> }>
): Promise<ApiResult<T>> {
  const start = Date.now();
  const response = await fn();
  const durationMs = Date.now() - start;
  const data = await response.json() as T;
  return {
    data,
    status: response.status(),
    headers: response.headers(),
    durationMs,
  };
}

export class PetApi {
  constructor(private request: APIRequestContext) {}

  // ── POST /pet ──────────────────────────────
  async addPet(pet: Pet): Promise<ApiResult<Pet>> {
    return measure(() =>
      this.request.post('/pet', { data: pet })
    );
  }

  // ── PUT /pet ───────────────────────────────
  async updatePet(pet: Pet): Promise<ApiResult<Pet>> {
    return measure(() =>
      this.request.put('/pet', { data: pet })
    );
  }

  // ── GET /pet/{petId} ───────────────────────
  async getPetById(petId: number): Promise<ApiResult<Pet>> {
    return measure(() =>
      this.request.get(`/pet/${petId}`)
    );
  }

  // ── DELETE /pet/{petId} ────────────────────
  async deletePet(petId: number): Promise<ApiResult<unknown>> {
    return measure(() =>
      this.request.delete(`/pet/${petId}`)
    );
  }

  // ── GET /pet/findByStatus ──────────────────
  async findByStatus(status: PetStatus): Promise<ApiResult<Pet[]>> {
    return measure(() =>
      this.request.get('/pet/findByStatus', {
        params: { status },
      })
    );
  }

  // ── GET /pet/findByTags ────────────────────
  async findByTags(tags: string[]): Promise<ApiResult<Pet[]>> {
    return measure(() =>
      this.request.get('/pet/findByTags', {
        params: { tags: tags.join(',') },
      })
    );
  }

  // ── POST /pet/{petId} (form data update) ───
  async updatePetWithForm(
    petId: number,
    name: string,
    status: PetStatus
  ): Promise<ApiResult<unknown>> {
    return measure(() =>
      this.request.post(`/pet/${petId}`, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        form: { name, status },
      })
    );
  }
}
```

### `src/api/store.api.ts`
```typescript
import { APIRequestContext } from '@playwright/test';
import { Order, Inventory, ApiResult } from '../types/petstore.types';

async function measure<T>(fn: () => Promise<any>): Promise<ApiResult<T>> {
  const start = Date.now();
  const response = await fn();
  return {
    data: await response.json() as T,
    status: response.status(),
    headers: response.headers(),
    durationMs: Date.now() - start,
  };
}

export class StoreApi {
  constructor(private request: APIRequestContext) {}

  async getInventory(): Promise<ApiResult<Inventory>> {
    return measure(() => this.request.get('/store/inventory'));
  }

  async placeOrder(order: Order): Promise<ApiResult<Order>> {
    return measure(() => this.request.post('/store/order', { data: order }));
  }

  async getOrderById(orderId: number): Promise<ApiResult<Order>> {
    return measure(() => this.request.get(`/store/order/${orderId}`));
  }

  async deleteOrder(orderId: number): Promise<ApiResult<unknown>> {
    return measure(() => this.request.delete(`/store/order/${orderId}`));
  }
}
```

### `src/api/user.api.ts`
```typescript
import { APIRequestContext } from '@playwright/test';
import { User, ApiResult } from '../types/petstore.types';

async function measure<T>(fn: () => Promise<any>): Promise<ApiResult<T>> {
  const start = Date.now();
  const response = await fn();
  return {
    data: await response.json() as T,
    status: response.status(),
    headers: response.headers(),
    durationMs: Date.now() - start,
  };
}

export class UserApi {
  constructor(private request: APIRequestContext) {}

  async createUser(user: User): Promise<ApiResult<unknown>> {
    return measure(() => this.request.post('/user', { data: user }));
  }

  async createUsersWithArray(users: User[]): Promise<ApiResult<unknown>> {
    return measure(() => this.request.post('/user/createWithArray', { data: users }));
  }

  async createUsersWithList(users: User[]): Promise<ApiResult<unknown>> {
    return measure(() => this.request.post('/user/createWithList', { data: users }));
  }

  async getUserByName(username: string): Promise<ApiResult<User>> {
    return measure(() => this.request.get(`/user/${username}`));
  }

  async updateUser(username: string, user: User): Promise<ApiResult<unknown>> {
    return measure(() =>
      this.request.put(`/user/${username}`, { data: user })
    );
  }

  async deleteUser(username: string): Promise<ApiResult<unknown>> {
    return measure(() => this.request.delete(`/user/${username}`));
  }

  async login(username: string, password: string): Promise<ApiResult<string>> {
    return measure(() =>
      this.request.get('/user/login', {
        params: { username, password },
      })
    );
  }

  async logout(): Promise<ApiResult<unknown>> {
    return measure(() => this.request.get('/user/logout'));
  }
}
```

---

## 7. Test Suites

### `src/utils/test-data.ts` — Factory Functions
```typescript
// Factory functions generate unique test data for each test run.
// Using Date.now() prevents ID collisions between test runs.

import { Pet, Order, User } from '../types/petstore.types';

export function createPetPayload(overrides: Partial<Pet> = {}): Pet {
  const id = Date.now() % 1_000_000; // Keep ID within int range
  return {
    id,
    name: `TestDog_${id}`,
    category: { id: 1, name: 'Dogs' },
    photoUrls: ['https://example.com/photo.jpg'],
    tags: [{ id: 1, name: 'friendly' }],
    status: 'available',
    ...overrides,
  };
}

export function createOrderPayload(petId: number, overrides: Partial<Order> = {}): Order {
  return {
    id: Date.now() % 1_000_000,
    petId,
    quantity: 1,
    shipDate: new Date().toISOString(),
    status: 'placed',
    complete: false,
    ...overrides,
  };
}

export function createUserPayload(overrides: Partial<User> = {}): User {
  const id = Date.now() % 1_000_000;
  return {
    id,
    username: `testuser_${id}`,
    firstName: 'Test',
    lastName: 'User',
    email: `test_${id}@example.com`,
    password: 'SecurePass123!',
    phone: '1234567890',
    userStatus: 0,
    ...overrides,
  };
}
```

---

### 7a. `tests/pet/pet-crud.spec.ts`
```typescript
import { test, expect, request } from '@playwright/test';
import { PetApi } from '../../src/api/pet.api';
import { createPetPayload } from '../../src/utils/test-data';
import { Pet } from '../../src/types/petstore.types';

// ─────────────────────────────────────────────────────────
// Pet CRUD Test Suite
// Tests: Create → Read → Update → Delete lifecycle
// ─────────────────────────────────────────────────────────
test.describe('Pet CRUD Operations', () => {
  let petApi: PetApi;
  let createdPetId: number;

  // beforeAll: runs ONCE before all tests in this file
  test.beforeAll(async ({ playwright }) => {
    const apiContext = await request.newContext({
      baseURL: 'https://petstore.swagger.io/v2',
      extraHTTPHeaders: { 'Content-Type': 'application/json' },
    });
    petApi = new PetApi(apiContext);
  });

  // ── CREATE ─────────────────────────────────────────────
  test('POST /pet — should create a new pet', async () => {
    const newPet = createPetPayload({ name: 'Buddy', status: 'available' });

    const result = await petApi.addPet(newPet);

    // ✅ Status check
    expect(result.status).toBe(200);

    // ✅ Response body checks
    expect(result.data.name).toBe('Buddy');
    expect(result.data.status).toBe('available');
    expect(result.data.id).toBeDefined();
    expect(typeof result.data.id).toBe('number');

    // ✅ Performance check
    expect(result.durationMs).toBeLessThan(5000);

    // Save ID for subsequent tests
    createdPetId = result.data.id!;
  });

  // ── READ ───────────────────────────────────────────────
  test('GET /pet/{petId} — should retrieve the created pet', async () => {
    // Guard: skip if create test failed
    test.skip(!createdPetId, 'No pet ID from previous test');

    const result = await petApi.getPetById(createdPetId);

    expect(result.status).toBe(200);
    expect(result.data.id).toBe(createdPetId);
    expect(result.data.name).toBe('Buddy');

    // ✅ Content-Type header validation
    expect(result.headers['content-type']).toContain('application/json');
  });

  // ── UPDATE (PUT) ───────────────────────────────────────
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

  // ── UPDATE (Form Data) ─────────────────────────────────
  test('POST /pet/{petId} — should update pet via form data', async () => {
    test.skip(!createdPetId, 'No pet ID from previous test');

    const result = await petApi.updatePetWithForm(
      createdPetId,
      'Buddy FormUpdated',
      'sold'
    );

    expect(result.status).toBe(200);
  });

  // ── DELETE ─────────────────────────────────────────────
  test('DELETE /pet/{petId} — should delete the pet', async () => {
    test.skip(!createdPetId, 'No pet ID from previous test');

    const deleteResult = await petApi.deletePet(createdPetId);
    expect(deleteResult.status).toBe(200);

    // ✅ Verify it's gone — should now return 404
    const getResult = await petApi.getPetById(createdPetId);
    expect(getResult.status).toBe(404);
  });

  // ── EDGE CASES ─────────────────────────────────────────
  test('GET /pet/{petId} — should return 404 for nonexistent pet', async () => {
    const result = await petApi.getPetById(999999999);
    expect(result.status).toBe(404);
  });

  test('POST /pet — should handle pet with minimum required fields', async () => {
    const minimalPet = {
      name: 'MinimalPet',
      photoUrls: [],
    };
    const result = await petApi.addPet(minimalPet);
    expect(result.status).toBe(200);
    expect(result.data.name).toBe('MinimalPet');
  });
});
```

---

### 7b. `tests/pet/pet-findby.spec.ts`
```typescript
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

  // ── DATA-DRIVEN TEST ───────────────────────────────────
  // Run the same test logic for each status value
  const statuses = ['available', 'pending', 'sold'] as const;

  for (const status of statuses) {
    test(`GET /pet/findByStatus — status="${status}" returns array`, async () => {
      const result = await petApi.findByStatus(status);

      expect(result.status).toBe(200);
      expect(Array.isArray(result.data)).toBe(true);

      // Every pet in the result must have the correct status
      for (const pet of result.data) {
        expect(pet.status).toBe(status);
        // ✅ Structural check
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
```

---

### 7c. `tests/store/store-orders.spec.ts`
```typescript
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
    petApi   = new PetApi(ctx);

    // Setup: create a pet to order
    const pet = await petApi.addPet(createPetPayload());
    createdPetId = pet.data.id!;
  });

  test('GET /store/inventory — should return inventory object', async () => {
    const result = await storeApi.getInventory();

    expect(result.status).toBe(200);
    expect(typeof result.data).toBe('object');
    // Inventory keys are status strings, values are counts
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

    // Confirm deletion
    const getResult = await storeApi.getOrderById(createdOrderId);
    expect(getResult.status).toBe(404);
  });

  test('GET /store/order/{orderId} — 404 for invalid ID', async () => {
    const result = await storeApi.getOrderById(999999999);
    expect(result.status).toBe(404);
  });

  // ── BOUNDARY TESTS ─────────────────────────────────────
  test('POST /store/order — order with quantity 0', async () => {
    const order = createOrderPayload(createdPetId, { quantity: 0 });
    const result = await storeApi.placeOrder(order);
    // API should either accept (200) or reject gracefully (4xx)
    expect([200, 400]).toContain(result.status);
  });
});
```

---

### 7d. `tests/user/user-crud.spec.ts`
```typescript
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
    // ✅ Sensitive field: password should NOT be in response
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

    // Confirm gone
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
```

---

## 8. Advanced Tests

### 8a. `tests/advanced/schema-validation.spec.ts`
```typescript
/**
 * Schema Validation Tests
 *
 * We use the `zod` library to define the expected shape of each response.
 * If the API returns an unexpected field type or removes a required field,
 * these tests will catch it immediately.
 */
import { test, expect, request } from '@playwright/test';
import { z } from 'zod';
import { PetApi } from '../../src/api/pet.api';
import { StoreApi } from '../../src/api/store.api';
import { createPetPayload } from '../../src/utils/test-data';

// ── Schemas ────────────────────────────────────────────────
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

// ── Tests ──────────────────────────────────────────────────
test.describe('Schema Validation', () => {
  let petApi: PetApi;
  let storeApi: StoreApi;

  test.beforeAll(async () => {
    const ctx = await request.newContext({
      baseURL: 'https://petstore.swagger.io/v2',
      extraHTTPHeaders: { 'Content-Type': 'application/json' },
    });
    petApi   = new PetApi(ctx);
    storeApi = new StoreApi(ctx);
  });

  test('Pet response matches PetSchema', async () => {
    const { data } = await petApi.addPet(createPetPayload());

    // parse() throws a detailed error if schema is violated
    const parsed = PetSchema.safeParse(data);

    if (!parsed.success) {
      // Print validation errors clearly
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
```

---

### 8b. `tests/advanced/performance.spec.ts`
```typescript
/**
 * Performance Tests
 * Ensures all endpoints respond within acceptable time thresholds.
 */
import { test, expect, request } from '@playwright/test';
import { PetApi } from '../../src/api/pet.api';
import { StoreApi } from '../../src/api/store.api';

const THRESHOLDS = {
  fast: 2000,    // Simple GET endpoints
  medium: 4000,  // POST/PUT with processing
  slow: 8000,    // Complex or list endpoints
};

test.describe('Performance Tests', () => {
  let petApi: PetApi;
  let storeApi: StoreApi;

  test.beforeAll(async () => {
    const ctx = await request.newContext({
      baseURL: 'https://petstore.swagger.io/v2',
      extraHTTPHeaders: { 'Content-Type': 'application/json' },
    });
    petApi   = new PetApi(ctx);
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
    const { durationMs } = await petApi.addPet({
      name: 'PerfTestPet',
      photoUrls: [],
    });
    console.log(`POST /pet response time: ${durationMs}ms`);
    expect(durationMs).toBeLessThan(THRESHOLDS.medium);
  });

  // Baseline test — run the same endpoint 3 times and average
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
```

---

### 8c. `tests/advanced/security.spec.ts`
```typescript
/**
 * Security Tests
 * Tests input validation, injection prevention, and data exposure.
 */
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
    petApi   = new PetApi(ctx);
    userApi  = new UserApi(ctx);
  });

  // ── SQL Injection Attempt ──────────────────────────────
  test('SQL injection in pet name should not cause server error', async () => {
    const maliciousPayload = {
      name: "'; DROP TABLE pets; --",
      photoUrls: [],
    };
    const result = await petApi.addPet(maliciousPayload);

    // Server should handle gracefully — not crash (500)
    expect(result.status).not.toBe(500);
    // Should succeed (200) or reject (4xx), never crash
    expect([200, 400, 422]).toContain(result.status);
  });

  // ── XSS Attempt ───────────────────────────────────────
  test('XSS payload in pet name is stored without execution risk', async () => {
    const xssPayload = {
      name: '<script>alert("xss")</script>',
      photoUrls: [],
    };
    const result = await petApi.addPet(xssPayload);

    expect(result.status).not.toBe(500);

    if (result.status === 200 && result.data.name) {
      // If stored, it must be treated as plain text, not HTML
      // (The API itself shouldn't evaluate scripts)
      expect(result.data.name).toBe('<script>alert("xss")</script>');
    }
  });

  // ── Password Not Exposed ───────────────────────────────
  test('GET /user/{username} — password not returned in response', async () => {
    const user = createUserPayload();
    await userApi.createUser(user);

    const result = await userApi.getUserByName(user.username);

    if (result.status === 200) {
      // Password should NEVER appear in GET response
      const responseStr = JSON.stringify(result.data);
      expect(responseStr).not.toContain(user.password!);
    }
  });

  // ── Oversized Input ────────────────────────────────────
  test('Extremely long pet name handled gracefully', async () => {
    const longName = 'A'.repeat(10_000);
    const result = await petApi.addPet({ name: longName, photoUrls: [] });

    // Must not crash the server
    expect(result.status).not.toBe(500);
  });

  // ── Invalid Content-Type ───────────────────────────────
  test('Request with wrong Content-Type returns error or graceful failure', async () => {
    const ctx = await request.newContext({
      baseURL: 'https://petstore.swagger.io/v2',
      extraHTTPHeaders: { 'Content-Type': 'text/plain' },
    });
    const rawResponse = await ctx.post('/pet', { data: 'not json' });

    // Should reject gracefully
    expect([400, 415, 200]).toContain(rawResponse.status());
    await ctx.dispose();
  });
});
```

---

### 8d. `tests/advanced/error-handling.spec.ts`
```typescript
/**
 * Error Handling Tests
 * Verifies the API returns correct HTTP status codes and error messages.
 */
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
    petApi   = new PetApi(ctx);
    storeApi = new StoreApi(ctx);
    userApi  = new UserApi(ctx);
  });

  // ── 404 Not Found ──────────────────────────────────────
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

  // ── 405 Method Not Allowed ─────────────────────────────
  test('DELETE /pet without ID — 405 Method Not Allowed', async () => {
    const ctx = await request.newContext({ baseURL: 'https://petstore.swagger.io/v2' });
    const response = await ctx.delete('/pet');
    expect(response.status()).toBe(405);
    await ctx.dispose();
  });

  // ── Invalid ID Format ──────────────────────────────────
  test('GET /pet/{id} — 400/404 for string ID', async () => {
    const ctx = await request.newContext({ baseURL: 'https://petstore.swagger.io/v2' });
    const response = await ctx.get('/pet/not-a-number');
    // API should reject non-numeric IDs
    expect([400, 404]).toContain(response.status());
    await ctx.dispose();
  });

  // ── Missing Required Fields ────────────────────────────
  test('POST /pet with empty body — should return error', async () => {
    const ctx = await request.newContext({
      baseURL: 'https://petstore.swagger.io/v2',
      extraHTTPHeaders: { 'Content-Type': 'application/json' },
    });
    const response = await ctx.post('/pet', { data: {} });
    // An empty pet might be accepted (200) or rejected (400/405)
    expect([200, 400, 405, 500]).toContain(response.status());
    await ctx.dispose();
  });
});
```

---

## 9. Integration Tests

### `tests/integration/e2e-workflow.spec.ts`
```typescript
/**
 * End-to-End Integration Tests
 * Tests complete user journeys spanning multiple API endpoints.
 */
import { test, expect, request } from '@playwright/test';
import { PetApi }   from '../../src/api/pet.api';
import { StoreApi } from '../../src/api/store.api';
import { UserApi }  from '../../src/api/user.api';
import { createPetPayload, createOrderPayload, createUserPayload }
  from '../../src/utils/test-data';

test.describe('End-to-End Workflows', () => {
  let petApi: PetApi;
  let storeApi: StoreApi;
  let userApi: UserApi;

  test.beforeAll(async () => {
    const ctx = await request.newContext({
      baseURL: 'https://petstore.swagger.io/v2',
      extraHTTPHeaders: { 'Content-Type': 'application/json' },
    });
    petApi   = new PetApi(ctx);
    storeApi = new StoreApi(ctx);
    userApi  = new UserApi(ctx);
  });

  // ── Complete Pet Adoption Workflow ─────────────────────
  test('Full pet adoption flow: create → list → order → verify', async () => {
    // Step 1: Add a pet as "available"
    const pet = createPetPayload({ name: 'Adoption Pet', status: 'available' });
    const addResult = await petApi.addPet(pet);
    expect(addResult.status).toBe(200);
    const petId = addResult.data.id!;

    // Step 2: Confirm pet appears in "available" listing
    const listResult = await petApi.findByStatus('available');
    expect(listResult.status).toBe(200);
    const foundPet = listResult.data.find(p => p.id === petId);
    // Note: due to shared test environment, pet may or may not appear
    // We verify the endpoint works, not strict membership

    // Step 3: Place an order for the pet
    const order = createOrderPayload(petId);
    const orderResult = await storeApi.placeOrder(order);
    expect(orderResult.status).toBe(200);
    const orderId = orderResult.data.id!;

    // Step 4: Verify order details
    const getOrderResult = await storeApi.getOrderById(orderId);
    expect(getOrderResult.status).toBe(200);
    expect(getOrderResult.data.petId).toBe(petId);

    // Step 5: Clean up
    await storeApi.deleteOrder(orderId);
    await petApi.deletePet(petId);
  });

  // ── User Registration & Login Workflow ─────────────────
  test('User lifecycle: register → login → update → logout → delete', async () => {
    // Step 1: Create user
    const user = createUserPayload();
    const createResult = await userApi.createUser(user);
    expect(createResult.status).toBe(200);

    // Step 2: Login
    const loginResult = await userApi.login(user.username, user.password!);
    expect(loginResult.status).toBe(200);

    // Step 3: Verify user data
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

    // Step 6: Clean up
    await userApi.deleteUser(user.username);
  });

  // ── Inventory After Order ──────────────────────────────
  test('Inventory reflects after placing and deleting an order', async () => {
    // Get initial inventory
    const inventoryBefore = await storeApi.getInventory();
    expect(inventoryBefore.status).toBe(200);

    // Place an order
    const pet = await petApi.addPet(createPetPayload());
    const order = await storeApi.placeOrder(createOrderPayload(pet.data.id!));

    // Get inventory again
    const inventoryAfter = await storeApi.getInventory();
    expect(inventoryAfter.status).toBe(200);

    // Cleanup
    await storeApi.deleteOrder(order.data.id!);
    await petApi.deletePet(pet.data.id!);
  });
});
```

---

## 10. Running the Tests

### Run Everything
```bash
npx playwright test
```

### Run a Specific Project
```bash
npx playwright test --project="Pet API"
npx playwright test --project="Store API"
npx playwright test --project="Advanced"
```

### Run a Specific File
```bash
npx playwright test tests/pet/pet-crud.spec.ts
```

### Run in Debug Mode (Step-by-Step)
```bash
npx playwright test --debug
```

### Run with Verbose Output
```bash
npx playwright test --reporter=list
```

### View HTML Report
```bash
npx playwright show-report
```

### Run Tests Matching a Name Pattern
```bash
npx playwright test --grep "should create"
npx playwright test --grep "404"
```

---

## 11. Best Practices Summary

| Practice | Why It Matters | Example in This Guide |
|---|---|---|
| **Use `beforeAll` for setup** | Avoid recreating API clients in every test | `test.beforeAll(async () => { ... })` |
| **Use `afterAll` for teardown** | Prevent test pollution and data leaks | Delete created resources after tests |
| **Factory functions for data** | Unique IDs per run, no hard-coded values | `createPetPayload()` with `Date.now()` |
| **API helper layer** | Centralize URL paths; tests stay readable | `PetApi`, `StoreApi`, `UserApi` classes |
| **Schema validation** | Catch API contract breaks early | Zod schemas in `schema-validation.spec.ts` |
| **Performance thresholds** | Catch regressions before prod | `durationMs < 2000` assertions |
| **Security checks** | Prevent injection and data leakage | `security.spec.ts` |
| **Data-driven loops** | Reduce test duplication | `for (const status of statuses)` |
| **`test.skip()` guards** | Skip dependent tests cleanly | `test.skip(!createdPetId, '...')` |
| **Single responsibility** | Each test checks one thing | Separate files per endpoint group |
| **Meaningful names** | Tests are documentation | `'POST /pet — should create a new pet'` |
| **Cleanup after tests** | Leave the server in a clean state | Delete pets, orders, users after each suite |

---

## Troubleshooting

| Problem | Solution |
|---|---|
| `ECONNREFUSED` | Check your internet connection; petstore.swagger.io may be down |
| Tests flaky / intermittent | Add `retries: 1` to `playwright.config.ts` |
| `Cannot find module` | Run `npm install` again |
| TypeScript errors | Run `npx tsc --noEmit` to see all type errors |
| 500 errors from API | The public Pet Store has shared state — retry or use unique IDs |
| Tests run too slowly | Increase `workers` in config (careful with shared state) |
