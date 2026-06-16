import type { Request, Response, NextFunction } from 'express';
import z from 'zod';
import { Validation422Error } from '@/utils/error';

type RequestSchema = {
  body?: Request['body'];
  query?: Request['query'];
  params?: Request['params']
};

const validateMiddleware = (schema: z.ZodType<RequestSchema>) => (
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
      const errors = err.issues.map(issue => ({
        source: issue.path[0] as 'body' | 'query' | 'params',
        field: issue.path.slice(1).join('.'),
        code: issue.code,
        message: issue.message
      }));

      return next(new Validation422Error('Validation Error', errors));
    }
    next(err);
  }
};

export default validateMiddleware;
