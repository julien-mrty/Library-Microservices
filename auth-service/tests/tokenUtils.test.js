const tokenUtils = require('../src/utils/tokenUtils');
const jwt = require('jsonwebtoken');

describe('Token Utilities', () => {
  describe('generateTokens', () => {
    it('should generate valid tokens', () => {
      const tokens = tokenUtils.generateTokens(1, 'testuser');

      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: 1, username: 'testuser' },
        'your_secret_key',
        { expiresIn: '60m' }
      );
      expect(typeof tokens.accessToken).toBe('string');
    });
  });

  describe('verifyToken', () => {
    it('should verify valid tokens', () => {
      const payload = tokenUtils.verifyToken('valid-token');

      expect(payload).toEqual({ userId: 1, username: 'testuser' });
      expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'your_secret_key');
    });
  });
});
