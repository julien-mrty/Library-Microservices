const prisma = require('../prismaClient');

class AuthRepository {
  async findUserByUsername(username) {
    return prisma.user.findUnique({
      where: { username },
    });
  }

  async createUser(username, hashedPassword) {
    return prisma.user.create({
      data: { username, password: hashedPassword },
    });
  }
}

module.exports = new AuthRepository();
