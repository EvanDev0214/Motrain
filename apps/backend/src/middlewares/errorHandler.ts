import type { Request, Response, NextFunction } from 'express';
import { AppError, Validation422Error } from '@/utils/error';
import { errorLogger, warnLogger } from '@/utils/logger';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof Validation422Error) {
    return res.status(422).json({
      status: 'error',
      code: err.code,
      message: err.message,
      errors: err.errors
    });
  }

  if (err instanceof AppError) {
    errorLogger({
      code: err.code,
      statusCode: err.statusCode,
      url: req.originalUrl,
      method: req.method,
      message: err.message,
      stack: err.stack
    });

    return res.status(err.statusCode).json({
      status: 'error',
      code: err.code,
      message: err.message
    });
  }

  // Default to 500 Internal Server Error
  const unknownErr = err instanceof Error ? err : new Error(String(err));
  errorLogger({
    code: 'INTERNAL_SERVER_ERROR',
    statusCode: 500,
    url: req.originalUrl,
    method: req.method,
    message: unknownErr.message,
    stack: unknownErr.stack
  });

  res.status(500).json({
    status: 'error',
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred'
  });
};

export const routerErrorHandler = (
  req: Request,
  res: Response
) => {
  warnLogger({
    code: 'ROUTE_NOT_FOUND',
    url: req.originalUrl,
    method: req.method,
    message: `Cannot find ${req.originalUrl} route`
  });

  res.status(404).json({
    status: 'error',
    code: 'ROUTE_NOT_FOUND',
    message: `Cannot find ${req.originalUrl} route`
  });
};

export const jsonParseErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof SyntaxError && 'body' in err) {
    warnLogger({
      code: 'JSON_PARSE_ERROR',
      url: req.url,
      method: req.method,
      message: 'Invalid JSON format'
    });

    return res.status(400).json({
      status: 'error',
      code: 'INVALID_JSON',
      message: 'Invalid JSON format'
    });
  }
  next(err);
};
