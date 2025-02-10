const prisma = require('../prismaClient');
const request = require('supertest');
const app = require('../app');

describe('Token Refresh Tests', () => {
  let accessToken;
  let refreshToken;

  beforeAll(async () => {
    // Register and login a test user
    await request(app).post('/api/auth/register').send({
      username: 'refreshUser',
      password: 'refreshPass',
    });

    const loginRes = await request(app).post('/api/auth/login').send({
      username: 'refreshUser',
      password: 'refreshPass',
    });

    accessToken = loginRes.body.accessToken;
    refreshToken = loginRes.headers['set-cookie']?.[0]; // Get first cookie
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { username: 'refreshUser' } });
    await prisma.$disconnect();
  });

  test('✅ Successfully refresh access token', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', refreshToken);

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  test('❌ Prevent refresh with invalid token', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', 'refreshToken=invalidToken');

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Invalid refresh token');
  });
});
