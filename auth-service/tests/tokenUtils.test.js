const tokenUtils = require('../src/utils/tokenUtils');
const jwt = require('jsonwebtoken');

describe('Token Utilities', () => {
  describe('generateTokens', () => {
    it('should generate valid tokens', () => {
      const tokens = tokenUtils.generateTokens(1, 'testuser');

      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: 1, username: 'testuser' },
        process.env.SECRET_KEY,
        { expiresIn: '60m' }
      );
      expect(typeof tokens.accessToken).toBe('string');

      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: 1, username: 'testuser' },
        process.env.REFRESH_SECRET_KEY,
        { expiresIn: '7d' }
      );
    });
  });

  describe('verifyToken', () => {
    it('should verify valid tokens', () => {
      const payload = tokenUtils.verifyToken('valid-token');
      expect(payload).toEqual({ userId: 1, username: 'testuser' });
      expect(jwt.verify).toHaveBeenCalledWith('valid-token', process.env.SECRET_KEY);
    });
  });
});
