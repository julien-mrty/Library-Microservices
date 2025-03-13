const jwt = require('jsonwebtoken');
const { SECRET_KEY, REFRESH_SECRET_KEY } = require('../config/envConfig');

class TokenUtils {
  generateTokens(userId, username) {
    const accessToken = jwt.sign({ userId, username }, SECRET_KEY, {
      expiresIn: '60m',
    });

    const refreshToken = jwt.sign({ userId, username }, REFRESH_SECRET_KEY, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  verifyToken(token) {
    return jwt.verify(token, SECRET_KEY);
  }

  verifyRefreshToken(token) {
    return jwt.verify(token, REFRESH_SECRET_KEY);
  }
}

module.exports = new TokenUtils();
