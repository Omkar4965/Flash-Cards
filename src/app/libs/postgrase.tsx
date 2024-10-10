import { Pool } from 'pg';

// For local dev or production, use env variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Update this with your PostgreSQL connection URL
});

export default pool;
