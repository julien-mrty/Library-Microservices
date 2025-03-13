const dotenv = require('dotenv');

// Determine the environment
const envFile =
  process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev';

dotenv.config({ path: envFile });

module.exports = {
  SECRET_KEY: process.env.SECRET_KEY,
  REFRESH_SECRET_KEY: process.env.REFRESH_SECRET_KEY,
  PORT: process.env.PORT,
};
