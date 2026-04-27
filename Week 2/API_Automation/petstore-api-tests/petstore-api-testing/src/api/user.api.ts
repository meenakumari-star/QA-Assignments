import { APIRequestContext } from '@playwright/test';
import { User, ApiResult } from '../types/petstore.types';

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
    return measure(() => this.request.put(`/user/${username}`, { data: user }));
  }

  async deleteUser(username: string): Promise<ApiResult<unknown>> {
    return measure(() => this.request.delete(`/user/${username}`));
  }

  async login(username: string, password: string): Promise<ApiResult<string>> {
    return measure(() =>
      this.request.get('/user/login', { params: { username, password } })
    );
  }

  async logout(): Promise<ApiResult<unknown>> {
    return measure(() => this.request.get('/user/logout'));
  }
}
