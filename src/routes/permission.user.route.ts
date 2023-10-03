import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import authMiddleware from '../middlewares/auth.middleware';
import validationMiddleware from '../middlewares/validation.middleware';
import PermissionUserController from '../controllers/permission.user.controller';
import { PermissionUserDto } from '../dtos/permission.user.dto';

export default class PermissionUserRoute implements Routes {
  public pathNested = '/api/permission/:id/permissionUser';
  public path = '/api/permissionUser';

  public router = Router({ mergeParams: true });
  public controller = new PermissionUserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.pathNested}`, authMiddleware, this.controller.index);
    this.router.get(`${this.path}`, authMiddleware, this.controller.index);
    this.router.get(`${this.path}/:id`, authMiddleware, this.controller.show);
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(PermissionUserDto, 'body'), this.controller.create);
    this.router.put(`${this.path}/:id`, authMiddleware, validationMiddleware(PermissionUserDto, 'body', true), this.controller.update);
    this.router.delete(`${this.path}/:id`, authMiddleware, this.controller.delete);


  }
}
