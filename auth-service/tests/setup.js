const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

beforeAll(async () => {
  // Clear users before running tests
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
