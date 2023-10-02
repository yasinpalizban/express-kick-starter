import {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {default as i18n} from 'i18next';
import ApiController from '../controllers/api.controller';
import PermissionGroupService from '../services/permission.group.service';
import {IPermissionGroup} from '../interfaces/permission.group.interface';
import {PermissionGroupEntity} from '@/entities/permission.group.entity';
import {PermissionGroupFilter} from "@/filters/permission.group.filter";
import {IPaginateResponse} from "@/interfaces/response.object";

export default class PermissionGroupController extends ApiController {
  async index(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const id: number = req.params.id ? +req.params.id : 0;
      const groupPermissionService = new PermissionGroupService();
      const permissionGroupFilter = new PermissionGroupFilter();
      permissionGroupFilter.transform(req).navigation(req);

      const result: IPaginateResponse<IPermissionGroup> = await groupPermissionService.setNestId(id).index(permissionGroupFilter);

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

      const groupPermissionService = new PermissionGroupService();
      const findOneData: IPermissionGroup = await groupPermissionService.show(id);

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
      const groupPermissionEntity = new PermissionGroupEntity(req.body);
      const groupPermissionService = new PermissionGroupService();
      await groupPermissionService.create(groupPermissionEntity);

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
      const groupPermissionEntity = new PermissionGroupEntity(req.body);
      const groupPermissionService = new PermissionGroupService();
      await groupPermissionService.update(id, groupPermissionEntity);

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
      const groupPermissionService = new PermissionGroupService();
      await groupPermissionService.delete(id);

      res.status(StatusCodes.OK).json({
        statusMessage: i18n.t('api.commons.remove'),
      });
    } catch (error) {
      next(error);
    }
  }
}
