import env from '@/configs/env';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { logger } from '@/utils/logger';
import * as schema from './schemas';
import * as relations from './relations';

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 2000
});

pool.on('error', (err) => {
  logger.error(err, 'Unexpected error on idle client');
});

export const db = drizzle(pool, {
  schema: {
    ...schema,
    ...relations
  }
});

export type DbClient = typeof db;
export type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
