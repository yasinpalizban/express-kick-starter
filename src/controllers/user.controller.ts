import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { default as i18n } from 'i18next';
import ApiController from './api.controller';
import { IUser } from '../interfaces/user.interface';
import UserService from '../services/user.service';
import { UserEntity } from '../entities/user.entity';
import {UserFilter} from "@/filters/user.filter";
import {IPaginateResponse} from "@/interfaces/paginate.response";

export default class UserController extends ApiController {
  async index(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const userService = new UserService();
      const userFilter = new UserFilter();
      userFilter.transform(req).navigation(req);
      const result: IPaginateResponse<IUser> = await userService.index(userFilter);

      res.status(StatusCodes.OK).json({
        statusMessage: i18n.t('api.commons.receive'),
        data: result.data,
        pager: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async show(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const id: number = +req.params.id;
      const userService = new UserService();
      const findOneData: IUser = await userService.show(id);

      res.status(StatusCodes.OK).json({
        statusMessage: i18n.t('api.commons.receive'),
        data: findOneData,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const userEntity = new UserEntity(req.body);
      await userEntity.activate().createNow().generatePasswordHash();
      const userService = new UserService();
      await userService.create(userEntity);

      res.status(StatusCodes.CREATED).json({
        statusMessage: i18n.t('api.commons.save'),
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const id: number = +req.params.id;
      const userEntity = new UserEntity(req.body);
      await userEntity.updateNow();
      const userService = new UserService();
      await userService.update(id, userEntity);

      res.status(StatusCodes.CREATED).json({
        statusMessage: i18n.t('api.commons.update'),
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const id: number = +req.params.id;
      const userService = new UserService();
      await userService.delete(id);

      res.status(StatusCodes.OK).json({
        statusMessage: i18n.t('api.commons.remove'),
      });
    } catch (error) {
      next(error);
    }
  }
}
