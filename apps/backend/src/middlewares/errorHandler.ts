import type { Request, Response, NextFunction } from 'express';
import { AppError, BadRequest400Error, NotFound404Error, Validation422Error } from '@/utils/error';

export const errorHandler = (
  err: unknown,
  _req: Request,
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
    return res.status(err.statusCode).json({
      status: 'error',
      code: err.code,
      message: err.message
    });
  }

  // Default to 500 Internal Server Error
  res.status(500).json({
    status: 'error',
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred'
  });
};

export const routerErrorHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const err = new NotFound404Error(`Cannot find ${req.originalUrl} route`);
  next(err);
};

export const jsonParseErrorHandler = (
  err: unknown,
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (err instanceof SyntaxError && 'body' in err) {
    const parseError = new BadRequest400Error('Invalid JSON format', 'INVALID_JSON');
    return next(parseError);
  }
  next(err);
};
