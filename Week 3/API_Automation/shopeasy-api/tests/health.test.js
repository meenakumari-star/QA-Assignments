// tests/health.test.js
const request = require('supertest');
const app = require('../server');

describe('Health Endpoint', () => {
  it('should return health status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });
});
