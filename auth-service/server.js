const app = require('./app'); // Import the app from app.js
const prisma = require('./prismaClient'); // Import Prisma client
const dotenv = require('dotenv');

// Determine the environment
const envFile =
  process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev';

// Load the environment file
dotenv.config({ path: envFile });

const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
});

// Handle unexpected errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

// Graceful Shutdown
const gracefulShutdown = async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
};

// Listen for termination signals
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
