# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: advanced\performance.spec.ts >> Performance Tests >> GET /store/inventory responds within 2s
- Location: tests\advanced\performance.spec.ts:24:7

# Error details

```
SyntaxError: Unexpected token '<', "<html>
<h"... is not valid JSON
```

# Test source

```ts
  1  | import { APIRequestContext } from '@playwright/test';
  2  | import { Order, Inventory, ApiResult } from '../types/petstore.types';
  3  | 
  4  | async function measure<T>(fn: () => Promise<any>): Promise<ApiResult<T>> {
  5  |   const start = Date.now();
  6  |   const response = await fn();
  7  |   let data: T | undefined = undefined;
  8  |   try {
> 9  |     data = (await response.json()) as T;
     |             ^ SyntaxError: Unexpected token '<', "<html>
  10 |   } catch (err) {
  11 |     const text = await response.text();
  12 |     console.error('Failed to parse JSON. Status:', response.status(), 'Body:', text);
  13 |     throw err;
  14 |   }
  15 |   return {
  16 |     data,
  17 |     status: response.status(),
  18 |     headers: response.headers(),
  19 |     durationMs: Date.now() - start,
  20 |   };
  21 | }
  22 | 
  23 | export class StoreApi {
  24 |   constructor(private request: APIRequestContext) {}
  25 | 
  26 |   async getInventory(): Promise<ApiResult<Inventory>> {
  27 |     return measure(() => this.request.get('/store/inventory'));
  28 |   }
  29 | 
  30 |   async placeOrder(order: Order): Promise<ApiResult<Order>> {
  31 |     return measure(() => this.request.post('/store/order', { data: order }));
  32 |   }
  33 | 
  34 |   async getOrderById(orderId: number): Promise<ApiResult<Order>> {
  35 |     return measure(() => this.request.get(`/store/order/${orderId}`));
  36 |   }
  37 | 
  38 |   async deleteOrder(orderId: number): Promise<ApiResult<unknown>> {
  39 |     return measure(() => this.request.delete(`/store/order/${orderId}`));
  40 |   }
  41 | }
  42 | 
```