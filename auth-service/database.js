const { Pool, Client } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

// Create a temporary client to ensure the database exists (optional)
const createDatabaseIfNotExists = async () => {
  const tempClient = new Client({
    connectionString: connectionString.replace(/\/[^/]+$/, '/postgres'), // Connect to default "postgres" DB
  });

  try {
    await tempClient.connect();
    const dbName = connectionString.split('/').pop();

    const dbExists = await tempClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (dbExists.rowCount === 0) {
      console.log(`Database "${dbName}" does not exist. Creating...`);
      await tempClient.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database "${dbName}" created.`);
    } else {
      console.log(`Database "${dbName}" already exists.`);
    }
  } catch (error) {
    console.error('Error checking/creating database:', error);
  } finally {
    await tempClient.end();
  }
};

// Create the users table if it does not exist
const createUsersTable = async (pool) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Users table is ready.');
  } catch (error) {
    console.error('Error creating users table:', error);
  }
};

// Main database pool
const pool = new Pool({ connectionString });

(async () => {
  await createDatabaseIfNotExists(); // Ensure the database exists
  await createUsersTable(pool); // Ensure the users table exists
})();

module.exports = pool;
