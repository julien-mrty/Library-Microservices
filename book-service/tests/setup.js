const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.book.deleteMany();
});

afterAll(async () => {
  await prisma.book.deleteMany();
  await prisma.$disconnect();
});

module.exports = prisma;
