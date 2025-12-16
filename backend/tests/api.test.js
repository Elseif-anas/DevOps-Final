const request = require('supertest');
const app = require('../server');

// Close server after all tests
afterAll(async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  if (app.server) {
    await app.server.close();
  }
});

describe('API Health Check', () => {
  test('GET /health should return status UP', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('UP');
  });

  test('GET / should return welcome message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.message).toContain('Student Management');
  });
});
