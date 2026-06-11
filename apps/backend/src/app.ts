import express from 'express';
import helmetMiddleware from '@/middlewares/helmet';
import corsMiddleware from '@/middlewares/cors';

const app = express();

app.use(helmetMiddleware);
app.use(corsMiddleware);

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

export default app;
