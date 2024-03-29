import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { default as i18n } from 'i18next';
import { ErrorType } from '../enums/error.type.enum';

const urlMiddleware = (req: Request, res: Response, next: NextFunction) => {

  if (req.url.search(/public/gi) == 1) {
    next();
  } else if (req.url.search(/api/gi) == -1) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      error: i18n.t('middleWear.url'),
      success: false,
      type: ErrorType.Url,
    });
  } else {
    next();
  }
};

export default urlMiddleware;
