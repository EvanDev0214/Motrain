import express from 'express';
import helmetMiddleware from '@/middlewares/helmet';
import corsMiddleware from '@/middlewares/cors';
import httpLogger from '@/middlewares/logger';
import {
  jsonParseErrorHandler,
  routerErrorHandler,
  errorHandler
} from '@/middlewares/errorHandler';

const app = express();

app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(httpLogger);
app.use(express.json());
app.use(jsonParseErrorHandler);

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.use(routerErrorHandler);
app.use(errorHandler);

export default app;
