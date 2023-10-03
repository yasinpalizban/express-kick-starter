import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import authMiddleware from '../middlewares/auth.middleware';
import validationMiddleware from '../middlewares/validation.middleware';
import GroupController from '../controllers/group.controller';
import { GroupDto } from '../dtos/group.dto';

export default class GroupRoute implements Routes {
  public pathNested = '/api/group';
  public router = Router();
  public controller = new GroupController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.pathNested}`, authMiddleware, this.controller.index);
    this.router.get(`${this.pathNested}/:id`, authMiddleware, this.controller.show);
    this.router.post(`${this.pathNested}`, authMiddleware, validationMiddleware(GroupDto, 'body'), this.controller.create);
    this.router.put(`${this.pathNested}/:id`, authMiddleware, validationMiddleware(GroupDto, 'body', true), this.controller.update);
    this.router.delete(`${this.pathNested}/:id`, authMiddleware, this.controller.delete);
  }
}
