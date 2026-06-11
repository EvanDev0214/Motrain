import type { Request, Response, NextFunction } from 'express';
import z from 'zod';

const validateMiddleware = (schema: z.ZodType) => (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });
    next();
  } catch (err) {
    next(err);
  }
};

export default validateMiddleware;
