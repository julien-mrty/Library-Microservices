const authService = require('../src/services/authService');
const authRepository = require('../src/repositories/authRepository');
const bcrypt = require('bcryptjs');
const tokenUtils = require('../src/utils/tokenUtils');

jest.mock('../src/repositories/authRepository');
jest.mock('../src/utils/tokenUtils');

describe('Auth Service', () => {
  beforeEach(() => {
    authRepository.findUserByUsername.mockReset();
    authRepository.createUser.mockReset();
    tokenUtils.generateTokens.mockReset();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      authRepository.findUserByUsername.mockResolvedValue(null);

      await authService.register('newuser', 'Testpass123!');

      expect(bcrypt.hash).toHaveBeenCalledWith('Testpass123!', 10);
      expect(authRepository.createUser).toHaveBeenCalledWith(
        'newuser',
        'hashed-password'
      );
    });
  });

  describe('login', () => {
    it('should return tokens for valid credentials', async () => {
      authRepository.findUserByUsername.mockResolvedValue({
        id: 1,
        username: 'testuser',
        password: 'hashed-password',
      });
      tokenUtils.generateTokens.mockReturnValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      const result = await authService.login('testuser', 'Testpass123!');

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'Testpass123!',
        'hashed-password'
      );
    });
  });
});
