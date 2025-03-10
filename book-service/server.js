const app = require('./app');
const dotenv = require('dotenv');

// Determine the environment
const envFile = process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev';

// Load the environment file
dotenv.config({ path: envFile });

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Book Service running on http://localhost:${port}`);
  console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
});
