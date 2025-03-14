const request = require('supertest');
const app = require('../src/app');
const authService = require('../src/services/authService');

jest.mock('../src/services/authService');

describe('Auth Controller', () => {
  afterEach(() => jest.clearAllMocks());

  describe('POST /api/auth/register', () => {
    it('should register a user successfully', async () => {
      authService.register.mockResolvedValue();

      const response = await request(app)
        .post('/api/auth/register')
        .send({ username: 'testuser', password: 'Testpass123!' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: 'User registered successfully',
      });
    });

    it('should handle registration errors', async () => {
      authService.register.mockRejectedValue(new Error('User already exists'));

      const response = await request(app)
        .post('/api/auth/register')
        .send({ username: 'existinguser', password: 'Testpass123!' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'User already exists' });
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully and return tokens', async () => {
      authService.login.mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'Testpass123!' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ accessToken: 'access-token' });
      expect(response.headers['set-cookie'][0]).toContain(
        'refreshToken=refresh-token'
      );
    });
  });
});
