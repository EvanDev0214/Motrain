declare global {
  /** Standard success response envelope. `T` is the shape of `data`; omit it when there's no payload. */
  type SuccessHttpResponse<T = never> = {
    status: 'success'
    message?: string,
    data?: T,
  };

  /** Standard error response envelope. `T` is the shape of each item in `errors`; omit it when there's no detail list. */
  type ErrorHttpResponse<T = never> = {
    status: 'error'
    code: string,
    message?: string,
    errors?: T[]
  };
}

export {};
