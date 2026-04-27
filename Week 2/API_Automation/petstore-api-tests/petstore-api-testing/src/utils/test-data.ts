import { Pet, Order, User } from '../types/petstore.types';

export function createPetPayload(overrides: Partial<Pet> = {}): Pet {
  const id = Date.now() % 1_000_000;
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
