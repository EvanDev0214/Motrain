import type { Request, Response, NextFunction } from 'express';
import { DatabaseError } from 'pg';
import { PostgresError } from 'pg-error-enum';
import { AppError, Validation422Error } from '@/utils/error';
import { errorLogger, logger, warnLogger } from '@/utils/logger';
import { PG_UNIQUE_FIELD_LABELS } from '@/constants/dbField';

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

  if (err instanceof Error && err.cause instanceof DatabaseError) {
    return pgErrorHandler(err as Error & { cause: DatabaseError }, req, res);
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
      url: req.originalUrl,
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

const pgErrorHandler = (
  err: Error & { cause: DatabaseError },
  req: Request,
  res: Response
) => {
  const { code, detail } = err.cause;

  if (code === PostgresError.UNIQUE_VIOLATION) {
    const field = detail?.match(/Key \((\w+)\)/)?.[1];
    const label = field ? PG_UNIQUE_FIELD_LABELS[field] : undefined;

    return res.status(409).json({
      status: 'error',
      code: label ? `${label.toUpperCase()}_EXISTS` : 'DUPLICATE_ENTRY',
      message: label ? `${label} already exists.` : 'Resource already exists.'
    });
  }

  logger.error({
    err,
    url: req.originalUrl,
    method: req.method
  }, 'Database error occurred');

  res.status(500).json({
    status: 'error',
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred'
  });
};
