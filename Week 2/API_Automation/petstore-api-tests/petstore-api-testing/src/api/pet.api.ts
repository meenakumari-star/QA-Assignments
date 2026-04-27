import { APIRequestContext } from '@playwright/test';
import { Pet, PetStatus, ApiResult } from '../types/petstore.types';

async function measure<T>(
  fn: () => Promise<any>
): Promise<ApiResult<T>> {
  const start = Date.now();
  const response = await fn();
  const durationMs = Date.now() - start;
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
    durationMs,
  };
}

export class PetApi {
  constructor(private request: APIRequestContext) {}

  async addPet(pet: Partial<Pet>): Promise<ApiResult<Pet>> {
    return measure(() => this.request.post('/pet', { data: pet }));
  }

  async updatePet(pet: Pet): Promise<ApiResult<Pet>> {
    return measure(() => this.request.put('/pet', { data: pet }));
  }

  async getPetById(petId: number): Promise<ApiResult<Pet>> {
    return measure(() => this.request.get(`/pet/${petId}`));
  }

  async deletePet(petId: number): Promise<ApiResult<unknown>> {
    return measure(() => this.request.delete(`/pet/${petId}`));
  }

  async findByStatus(status: PetStatus): Promise<ApiResult<Pet[]>> {
    return measure(() =>
      this.request.get('/pet/findByStatus', { params: { status } })
    );
  }

  async findByTags(tags: string[]): Promise<ApiResult<Pet[]>> {
    return measure(() =>
      this.request.get('/pet/findByTags', { params: { tags: tags.join(',') } })
    );
  }

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
