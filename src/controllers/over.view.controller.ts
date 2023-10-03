import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { default as i18n } from 'i18next';
import ApiController from '../controllers/api.controller';

import UserService from '../services/user.service';
import {UserFilter} from "@/filters/user.filter";
import {IPaginateResponse} from "@/interfaces/paginate.response";
import {IUser} from "@/interfaces/user.interface";


export default class OverViewController extends ApiController {
  async index(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const userFilter = new UserFilter();
      userFilter.navigation(req);
      const userService = new UserService();
      const users: IPaginateResponse<IUser> = await userService.index(userFilter);
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
