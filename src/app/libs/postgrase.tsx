import { Pool } from 'pg';

// For local dev or production, use env variables
const pool: Pool = new Pool({
  connectionString: process.env.DATABASE_URL as string, // Type assertion to ensure it's a string
});

export default pool;
