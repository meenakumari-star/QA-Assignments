# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: pet\pet-findby.spec.ts >> Pet FindBy Operations >> GET /pet/findByStatus — status="sold" returns array
- Location: tests\pet\pet-findby.spec.ts:18:9

# Error details

```
SyntaxError: Unexpected token '<', "<html>
<h"... is not valid JSON
```

# Test source

```ts
  1  | import { APIRequestContext } from '@playwright/test';
  2  | import { Pet, PetStatus, ApiResult } from '../types/petstore.types';
  3  | 
  4  | async function measure<T>(
  5  |   fn: () => Promise<any>
  6  | ): Promise<ApiResult<T>> {
  7  |   const start = Date.now();
  8  |   const response = await fn();
  9  |   const durationMs = Date.now() - start;
  10 |   let data: T | undefined = undefined;
  11 |   try {
> 12 |     data = (await response.json()) as T;
     |             ^ SyntaxError: Unexpected token '<', "<html>
  13 |   } catch (err) {
  14 |     const text = await response.text();
  15 |     console.error('Failed to parse JSON. Status:', response.status(), 'Body:', text);
  16 |     throw err;
  17 |   }
  18 |   return {
  19 |     data,
  20 |     status: response.status(),
  21 |     headers: response.headers(),
  22 |     durationMs,
  23 |   };
  24 | }
  25 | 
  26 | export class PetApi {
  27 |   constructor(private request: APIRequestContext) {}
  28 | 
  29 |   async addPet(pet: Partial<Pet>): Promise<ApiResult<Pet>> {
  30 |     return measure(() => this.request.post('/pet', { data: pet }));
  31 |   }
  32 | 
  33 |   async updatePet(pet: Pet): Promise<ApiResult<Pet>> {
  34 |     return measure(() => this.request.put('/pet', { data: pet }));
  35 |   }
  36 | 
  37 |   async getPetById(petId: number): Promise<ApiResult<Pet>> {
  38 |     return measure(() => this.request.get(`/pet/${petId}`));
  39 |   }
  40 | 
  41 |   async deletePet(petId: number): Promise<ApiResult<unknown>> {
  42 |     return measure(() => this.request.delete(`/pet/${petId}`));
  43 |   }
  44 | 
  45 |   async findByStatus(status: PetStatus): Promise<ApiResult<Pet[]>> {
  46 |     return measure(() =>
  47 |       this.request.get('/pet/findByStatus', { params: { status } })
  48 |     );
  49 |   }
  50 | 
  51 |   async findByTags(tags: string[]): Promise<ApiResult<Pet[]>> {
  52 |     return measure(() =>
  53 |       this.request.get('/pet/findByTags', { params: { tags: tags.join(',') } })
  54 |     );
  55 |   }
  56 | 
  57 |   async updatePetWithForm(
  58 |     petId: number,
  59 |     name: string,
  60 |     status: PetStatus
  61 |   ): Promise<ApiResult<unknown>> {
  62 |     return measure(() =>
  63 |       this.request.post(`/pet/${petId}`, {
  64 |         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  65 |         form: { name, status },
  66 |       })
  67 |     );
  68 |   }
  69 | }
  70 | 
```