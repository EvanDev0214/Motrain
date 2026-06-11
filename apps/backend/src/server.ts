import 'dotenv/config';
import app from '@/app';
import { logger } from '@/utils/logger';

const PORT = Number(process.env.PORT) || 8080;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  const baseUrl = HOST === '0.0.0.0' ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;

  logger.info(`Server is running at ${baseUrl}`);
});
