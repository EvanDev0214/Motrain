import express from 'express';
import corsMiddleware from '@/middlewares/cors';

const app = express();

app.use(corsMiddleware);

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

export default app;
