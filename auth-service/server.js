const app = require('./src/app');
const { PORT } = require('./src/config/envConfig');

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});

process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  server.close(() => process.exit(0));
});
