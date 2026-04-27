// tests/auth.test.js
const request = require('supertest');
const app = require('../server');

describe('Auth Endpoints', () => {
  const user = {
    email: 'testuser@example.com',
    password: 'testpass123',
    name: 'Test User'
  };

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send(user);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('userId');
  });

  it('should login and return a token', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: user.email, password: user.password });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
