import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';
import { HttpException } from '../exceptions/HttpException';

const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || 'Something went wrong';

    if (process.env.NODE_ENV == 'development') {
      console.log(error.stack);
    }
    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);

    res.status(status).json({ error: message });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
