// tests/payments.test.js
const request = require('supertest');
const app = require('../server');

let token;
let orderId;
let paymentId;

beforeAll(async () => {
  await request(app)
    .post('/auth/register')
    .send({ email: 'payuser@example.com', password: 'paypass', name: 'Pay User' });
  const res = await request(app)
    .post('/auth/login')
    .send({ email: 'payuser@example.com', password: 'paypass' });
  token = res.body.token;
});

describe('Payment Endpoints', () => {
  it('should place a new order for payment', async () => {
    await request(app)
      .post('/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: 3, quantity: 1 });
    const orderRes = await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`);
    orderId = orderRes.body.orderId;
  });

  it('should pay for the order', async () => {
    const res = await request(app)
      .post('/payments')
      .set('Authorization', `Bearer ${token}`)
      .send({ orderId, method: 'card' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('paymentId');
    paymentId = res.body.paymentId;
  });

  it('should get payment details', async () => {
    const res = await request(app)
      .get(`/payments/${paymentId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('paymentId', paymentId);
  });
});
