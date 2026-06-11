import express from 'express';
import helmetMiddleware from '@/middlewares/helmet';
import corsMiddleware from '@/middlewares/cors';
import httpLogger from '@/middlewares/logger';

const app = express();

app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(httpLogger);

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

export default app;
