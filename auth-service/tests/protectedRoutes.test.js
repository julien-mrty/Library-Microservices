const prisma = require('../prismaClient');
const request = require('supertest');
const app = require('../app');

describe('Protected Routes Tests', () => {
  let accessToken;

  beforeAll(async () => {
    // Register and login a test user
    await request(app).post('/api/auth/register').send({
      username: 'protectedUser',
      password: 'securePass',
    });

    const loginRes = await request(app).post('/api/auth/login').send({
      username: 'protectedUser',
      password: 'securePass',
    });

    accessToken = loginRes.body.accessToken;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { username: 'protectedUser' } });
    await prisma.$disconnect();
  });

  test('✅ Access protected route with valid token', async () => {
    const res = await request(app)
      .get('/api/auth/protected')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/Hello protectedUser/);
  });

  test('❌ Block access to protected route without token', async () => {
    const res = await request(app).get('/api/auth/protected');

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Access token required');
  });

  test('❌ Block access with invalid token', async () => {
    const res = await request(app)
      .get('/api/auth/protected')
      .set('Authorization', 'Bearer invalidToken');

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Invalid or expired token');
  });
});
