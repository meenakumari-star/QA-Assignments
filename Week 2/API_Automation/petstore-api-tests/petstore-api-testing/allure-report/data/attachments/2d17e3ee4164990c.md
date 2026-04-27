# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: advanced\security.spec.ts >> Security Tests >> Password not returned in GET /user/{username} response
- Location: tests\advanced\security.spec.ts:35:7

# Error details

```
SyntaxError: Unexpected token '<', "<html>
<h"... is not valid JSON
```

# Test source

```ts
  1  | import { APIRequestContext } from '@playwright/test';
  2  | import { User, ApiResult } from '../types/petstore.types';
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
  23 | export class UserApi {
  24 |   constructor(private request: APIRequestContext) {}
  25 | 
  26 |   async createUser(user: User): Promise<ApiResult<unknown>> {
  27 |     return measure(() => this.request.post('/user', { data: user }));
  28 |   }
  29 | 
  30 |   async createUsersWithArray(users: User[]): Promise<ApiResult<unknown>> {
  31 |     return measure(() => this.request.post('/user/createWithArray', { data: users }));
  32 |   }
  33 | 
  34 |   async createUsersWithList(users: User[]): Promise<ApiResult<unknown>> {
  35 |     return measure(() => this.request.post('/user/createWithList', { data: users }));
  36 |   }
  37 | 
  38 |   async getUserByName(username: string): Promise<ApiResult<User>> {
  39 |     return measure(() => this.request.get(`/user/${username}`));
  40 |   }
  41 | 
  42 |   async updateUser(username: string, user: User): Promise<ApiResult<unknown>> {
  43 |     return measure(() => this.request.put(`/user/${username}`, { data: user }));
  44 |   }
  45 | 
  46 |   async deleteUser(username: string): Promise<ApiResult<unknown>> {
  47 |     return measure(() => this.request.delete(`/user/${username}`));
  48 |   }
  49 | 
  50 |   async login(username: string, password: string): Promise<ApiResult<string>> {
  51 |     return measure(() =>
  52 |       this.request.get('/user/login', { params: { username, password } })
  53 |     );
  54 |   }
  55 | 
  56 |   async logout(): Promise<ApiResult<unknown>> {
  57 |     return measure(() => this.request.get('/user/logout'));
  58 |   }
  59 | }
  60 | 
```