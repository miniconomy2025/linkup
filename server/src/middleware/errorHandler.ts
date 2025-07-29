import { Request, Response, NextFunction } from 'express';

export class UserNotFoundError extends Error {
  status: number;
  constructor(message = 'User not found') {
    super(message);
    this.status = 404;
    this.name = 'UserNotFoundError';
  }
}

export class BadRequestError extends Error {
  status: number;
  constructor(message = 'Bad request') {
    super(message);
    this.status = 400;
    this.name = 'BadRequestError';
  }
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // Log the error for debugging
  console.error(err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
} 