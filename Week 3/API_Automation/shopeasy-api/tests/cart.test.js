// tests/cart.test.js
const request = require('supertest');
const app = require('../api/server');

let token;

beforeAll(async () => {
  // Register and login to get token
  await request(app)
    .post('/auth/register')
    .send({ email: 'cartuser@example.com', password: 'cartpass', name: 'Cart User' });
  const res = await request(app)
    .post('/auth/login')
    .send({ email: 'cartuser@example.com', password: 'cartpass' });
  token = res.body.token;
});

describe('Cart Endpoints', () => {
  it('should add item to cart', async () => {
    const res = await request(app)
      .post('/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: 1, quantity: 2 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('cartTotal');
  });

  it('should get cart contents', async () => {
    const res = await request(app)
      .get('/cart')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('items');
    expect(Array.isArray(res.body.items)).toBe(true);
  });

  it('should remove item from cart', async () => {
    const res = await request(app)
      .delete('/cart/items/1')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});
