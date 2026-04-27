// tests/products.test.js
const request = require('supertest');
const app = require('../server');

describe('Product Endpoints', () => {
  it('should list all products', async () => {
    const res = await request(app).get('/products');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should get a product by id', async () => {
    const res = await request(app).get('/products/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
  });
});
