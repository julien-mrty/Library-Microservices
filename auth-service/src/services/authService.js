const bcrypt = require('bcryptjs');
const authRepository = require('../repositories/authRepository');
const tokenUtils = require('../utils/tokenUtils');

class AuthService {
  async register(username, password) {
    const existingUser = await authRepository.findUserByUsername(username);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await authRepository.createUser(username, hashedPassword);
  }

  async login(username, password) {
    const user = await authRepository.findUserByUsername(username);
    if (!user) {
      throw new Error('Invalid username or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid username or password');
    }

    return tokenUtils.generateTokens(user.id, user.username);
  }
}

module.exports = new AuthService();
