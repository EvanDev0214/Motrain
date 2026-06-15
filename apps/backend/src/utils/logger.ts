import httpLogger from '@/middlewares/logger';
import { isDev } from '@/utils/env';

type LogInfo = {
  code: string;
  url: string;
  method: string;
  message: string;
};

type ErrorLogInfo = LogInfo & {
  statusCode: number;
  stack?: string;
};

export const logger = httpLogger.logger;

export const errorLogger = (info: ErrorLogInfo) => {
  logger.error({
    code: info.code,
    url: info.url,
    method: info.method,
    stack: isDev ? info.stack : undefined
  }, `[${info.statusCode}] ${info.message}`);
};

export const warnLogger = (info: LogInfo) => {
  logger.warn({
    code: info.code,
    url: info.url,
    method: info.method
  }, info.message);
};
