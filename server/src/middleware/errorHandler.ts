import type { ErrorRequestHandler } from 'express';

import { config } from '../config';

type ErrorWithStatusCode = Error & {
  statusCode?: number;
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const typedError = error as ErrorWithStatusCode;
  const statusCode = typedError.statusCode ?? 500;

  res.status(statusCode).json({
    error: {
      message: statusCode < 500 ? typedError.message : 'Internal server error',
      ...(config.nodeEnv === 'development' ? { details: typedError.message } : {})
    }
  });
};
