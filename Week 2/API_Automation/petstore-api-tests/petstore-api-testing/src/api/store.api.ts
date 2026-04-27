import { APIRequestContext } from '@playwright/test';
import { Order, Inventory, ApiResult } from '../types/petstore.types';

async function measure<T>(fn: () => Promise<any>): Promise<ApiResult<T>> {
  const start = Date.now();
  const response = await fn();
  let data: T | undefined = undefined;
  try {
    data = (await response.json()) as T;
  } catch (err) {
    const text = await response.text();
    console.error('Failed to parse JSON. Status:', response.status(), 'Body:', text);
    throw err;
  }
  return {
    data,
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
