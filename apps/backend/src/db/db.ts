import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { logger } from '@/utils/logger';

const databaseURL = process.env.DATABASE_URL;

if (!databaseURL) {
  throw new Error('DATABASE_URL is not set in the .env file');
}

const pool = new Pool({
  connectionString: databaseURL,
  max: 10,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 2000
});

pool.on('error', (err) => {
  logger.error(err, 'Unexpected error on idle client');
});

export const db = drizzle(pool);
