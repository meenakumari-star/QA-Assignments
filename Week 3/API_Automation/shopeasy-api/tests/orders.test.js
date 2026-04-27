// tests/orders.test.js
const request = require('supertest');
const app = require('../server');

let token;
let orderId;

beforeAll(async () => {
  await request(app)
    .post('/auth/register')
    .send({ email: 'orderuser@example.com', password: 'orderpass', name: 'Order User' });
  const res = await request(app)
    .post('/auth/login')
    .send({ email: 'orderuser@example.com', password: 'orderpass' });
  token = res.body.token;
});

describe('Order Endpoints', () => {
  it('should add item and place an order', async () => {
    await request(app)
      .post('/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: 2, quantity: 1 });
    const res = await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('orderId');
    orderId = res.body.orderId;
  });

  it('should get order details', async () => {
    const res = await request(app)
      .get(`/orders/${orderId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('orderId', orderId);
  });

  it('should cancel the order', async () => {
    const res = await request(app)
      .delete(`/orders/${orderId}/cancel`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'cancelled');
  });
});
