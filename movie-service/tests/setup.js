const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.movie.deleteMany();
});

afterAll(async () => {
  await prisma.movie.deleteMany();
  await prisma.$disconnect();
});

module.exports = prisma;
