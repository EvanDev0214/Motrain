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

const SENSITIVE_KEYS = new Set(['token', 'password', 'secret', 'code', 'key']);

const sanitizeUrl = (url: string): string => {
  const [path, query] = url.split('?');

  const params = new URLSearchParams(query);
  for (const key of params.keys()) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      params.set(key, '[REDACTED]');
    }
  }

  return `${path}?${decodeURIComponent(params.toString())}`;
};

export const logger = httpLogger.logger;

export const errorLogger = (info: ErrorLogInfo) => {
  logger.error({
    code: info.code,
    url: sanitizeUrl(info.url),
    method: info.method,
    stack: isDev ? info.stack : undefined
  }, `[${info.statusCode}] ${info.message}`);
};

export const warnLogger = (info: LogInfo) => {
  logger.warn({
    code: info.code,
    url: sanitizeUrl(info.url),
    method: info.method
  }, info.message);
};
