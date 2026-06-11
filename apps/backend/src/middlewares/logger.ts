import pinoHttp from 'pino-http';
import { isDev } from '@/utils/env';

const httpLogger = pinoHttp({
  transport: isDev ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
      ignore: 'pid,hostname'
    }
  } : undefined
});

export default httpLogger;
