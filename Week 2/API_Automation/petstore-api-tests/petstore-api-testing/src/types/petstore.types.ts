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
  id?: number;
  category?: Category;
  name: string;
  photoUrls: string[];
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
  shipDate?: string;
  status?: OrderStatus;
  complete?: boolean;
}

export interface Inventory {
  [status: string]: number;
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
  userStatus?: number;
}

// ─────────────────────────────────────────────
// API Responses
// ─────────────────────────────────────────────
export interface ApiResponse {
  code: number;
  type: string;
  message: string;
}

export interface ApiResult<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
  durationMs: number;
}
