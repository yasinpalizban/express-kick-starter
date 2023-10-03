import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import authMiddleware from '../middlewares/auth.middleware';
import validationMiddleware from '../middlewares/validation.middleware';
import { PermissionGroupDto } from '../dtos/permission.group.dto';
import PermissionGroupController from '../controllers/permission.group.controller';

export default class PermissionGroupRoute implements Routes {
  public pathNested = '/api/permission/:id/permissionGroup';
  public path = '/api/permissionGroup';

  public router = Router({ mergeParams: true });
  public controller = new PermissionGroupController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /** nest route */
    this.router.get(`${this.pathNested}`, authMiddleware, this.controller.index);
    /* no nest route*/
    this.router.get(`${this.path}`, authMiddleware, this.controller.index);
    this.router.get(`${this.path}/:id`, authMiddleware, this.controller.show);
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(PermissionGroupDto, 'body'), this.controller.create);
    this.router.put(`${this.path}/:id`, authMiddleware, validationMiddleware(PermissionGroupDto, 'body', true), this.controller.update);
    this.router.delete(`${this.path}/:id`, authMiddleware, this.controller.delete);

  }
}
