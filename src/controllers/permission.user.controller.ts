import {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {default as i18n} from 'i18next';
import ApiController from '../controllers/api.controller';
import {IPermissionUser, IPermissionUserPagination} from '../interfaces/permission.user.interface';
import PermissionUserService from '../services/permission.user.service';
import {PermissionUserEntity} from '@/entities/permission.user.entity';
import {PermissionUserFilter} from "@/filters/permission.user.filter";

export default class PermissionUserController extends ApiController {
  async index(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const id: number = req.params.id ? +req.params.id : 0;
      const userPermissionService = new PermissionUserService();
      const permissionUserFilter = new PermissionUserFilter();
      permissionUserFilter.transform(req).navigation(req);
      const result: IPermissionUserPagination = await userPermissionService.setNestId(id).index(permissionUserFilter);

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
      const userPermissionService = new PermissionUserService();

      const findOneData: IPermissionUser = await userPermissionService.show(id);

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
      const userPermissionEntity = new PermissionUserEntity(req.body);
      const userPermissionService = new PermissionUserService();
      await userPermissionService.create(userPermissionEntity);

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
      const userPermissionEntity = new PermissionUserEntity(req.body);
      const userPermissionService = new PermissionUserService();
      await userPermissionService.update(id, userPermissionEntity);

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
      const userPermissionService = new PermissionUserService();
      await userPermissionService.delete(id);

      res.status(StatusCodes.OK).json({
        statusMessage: i18n.t('api.commons.remove'),
      });
    } catch (error) {
      next(error);
    }
  }
}
