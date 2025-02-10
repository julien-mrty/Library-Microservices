require('dotenv').config(); // Load environment variables

module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./tests/setup.js'],
};
