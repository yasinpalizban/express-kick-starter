import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { default as i18n } from 'i18next';
import ApiController from '../controllers/api.controller';
import { IUserPagination } from '../interfaces/user.interface';

import UserService from '../services/user.service';
import {UserFilter} from "@/filters/user.filter";


export default class OverViewController extends ApiController {
  async index(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const userFilter = new UserFilter();
      userFilter.navigation(req);
      const userService = new UserService();
      const users: IUserPagination = await userService.index(userFilter);
      res.status(StatusCodes.OK).json({
        statusMessage: i18n.t('api.commons.receive'),
        userPost: users.data,
        countPost: {
          users: await userService.getCountItems(),

        },
      });
    } catch (error) {
      next(error);
    }
  }
}
