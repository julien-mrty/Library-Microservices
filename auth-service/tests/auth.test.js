const request = require('supertest');
const app = require('../app');
const prisma = require('../prismaClient');
require('dotenv').config();

describe('Authentication Tests', () => {
  let testUser = { username: 'testuser', password: 'testpassword' };
  let accessToken;
  let refreshToken;

  beforeAll(async () => {
    // Cleanup test user if it exists
    await prisma.user.deleteMany({ where: { username: testUser.username } });
  });

  afterAll(async () => {
    // Cleanup database after tests
    await prisma.user.deleteMany({ where: { username: testUser.username } });
    await prisma.$disconnect();
  });

  test('✅ Register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('User registered successfully');
  });

  test('❌ Prevent duplicate user registration', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('User already exists');
  });

  test('✅ User can log in and receive tokens', async () => {
    const res = await request(app).post('/api/auth/login').send(testUser);

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();

    accessToken = res.body.accessToken;
    refreshToken = loginRes.headers['set-cookie']?.[0]; // Get first cookie
  });

  test('❌ User cannot log in with incorrect password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: testUser.username, password: 'wrongpassword' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid username or password');
  });

  test('✅ User can log out and refresh token is invalidated', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', refreshToken);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Logged out successfully');
  });
});
