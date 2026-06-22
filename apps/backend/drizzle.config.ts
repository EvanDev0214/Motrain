import env from '@/configs/env';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schemas',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL
  },
  migrations: {
    prefix: 'timestamp'
  }
});
