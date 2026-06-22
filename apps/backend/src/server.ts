import 'dotenv/config';
import env from '@/configs/env';
import app from '@/app';
import { logger } from '@/utils/logger';

const { PORT, HOST } = env;

app.listen(PORT, HOST, () => {
  const baseUrl = HOST === '0.0.0.0' ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;

  logger.info(`Server is running at ${baseUrl}`);
});
