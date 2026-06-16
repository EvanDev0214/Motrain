import express from 'express';
import { sql } from 'drizzle-orm';
import { db } from '@/db/db';
import helmetMiddleware from '@/middlewares/helmet';
import corsMiddleware from '@/middlewares/cors';
import httpLogger from '@/middlewares/logger';
import {
  jsonParseErrorHandler,
  routerErrorHandler,
  errorHandler
} from '@/middlewares/errorHandler';
import { logger } from '@/utils/logger';

const app = express();

app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(httpLogger);
app.use(express.json());
app.use(jsonParseErrorHandler);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/ready', async (_req, res) => {
  try {
    await db.execute(sql`SELECT 1`);
    res.status(200).json({ status: 'ok' });
  } catch (err: unknown) {
    logger.error(err, 'Database health check failed');
    res.status(503).json({ status: 'unavailable' });
  }
});

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.use(routerErrorHandler);
app.use(errorHandler);

export default app;
