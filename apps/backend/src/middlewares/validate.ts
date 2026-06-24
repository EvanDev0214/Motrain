import type { Request, Response, NextFunction } from 'express';
import z from 'zod';
import jwt from 'jsonwebtoken';
import env from '@/configs/env';
import { Unauthorized401Error, Validation422Error } from '@/utils/error';

type RequestSchema = {
  body?: Request['body'];
  query?: Request['query'];
  params?: Request['params']
};

export const validateMiddleware = (schema: z.ZodType<RequestSchema>) => (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });

    if (parsed.body) req.body = parsed.body;
    if (parsed.query) req.query = parsed.query;
    if (parsed.params) req.params = parsed.params;

    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errors = err.issues.map(issue => {
        const [head, ...rest] = issue.path;

        const source: 'body' | 'query' | 'params' | 'root' =
          head === 'body' || head === 'query' || head === 'params' ? head : 'root';

        const field = rest.join('.');

        return {
          source,
          ...(field && { field }),
          code: issue.code,
          message: issue.message
        };
      });

      return next(new Validation422Error('Validation Error', errors));
    }
    next(err);
  }
};

export const authMiddleware = (type: 'ACCESS' | 'REFRESH') => (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    throw new Unauthorized401Error('Missing authorization header', 'MISSING_AUTH_HEADER');
  }

  try {
    const payload = jwt.verify(token, env[`JWT_${type}_SECRET_KEY`]) as UserJwtPayload;
    req.user = payload;
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
      throw new Unauthorized401Error('Invalid request, please login again', 'INVALID_TOKEN');
    }
    throw err;
  }

  next();
};
