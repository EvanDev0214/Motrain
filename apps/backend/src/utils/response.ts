import type { Response } from 'express';

type ErrorOptions<T = never> = Omit<ErrorHttpResponse<T>, 'status'>;
type SuccessOptions<T = never> = Omit<SuccessHttpResponse<T>, 'status'>;

export const sendError = <T = never>(
  res: Response,
  statusCode: number,
  { code, message, errors }: ErrorOptions<T>
) => {
  return res.status(statusCode).json({
    status: 'error',
    code,
    message,
    errors
  } satisfies ErrorHttpResponse<T>);
};

/** Always returns a generic message — never leak internal error details to the client. */
export const sendInternalServerError = (res: Response) => sendError(res, 500, {
  code: 'INTERNAL_SERVER_ERROR',
  message: 'An unexpected error occurred'
});

export const sendSuccess = <T = never>(
  res: Response,
  statusCode: 200 | 201,
  { message, data }: SuccessOptions<T> = {}
) => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data
  } satisfies SuccessHttpResponse<T>);
};

/** 204 must not have a body per HTTP spec — do not add data/message params here. */
export const sendNoContent = (res: Response) => res.status(204).send();
