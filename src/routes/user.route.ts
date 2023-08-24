import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import validationMiddleware from '../middlewares/validation.middleware';
import authMiddleware from '../middlewares/auth.middleware';
import UserController from '../controllers/user.controller';
import { UsersPostValidation } from '../validations/users.post.validation';
import { UsersPutValidation } from '../validations/users.put.validation';

export default class UserRoute implements Routes {
  public path = '/api/user';
  public router = Router();
  public controller = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.controller.index);
    this.router.get(`${this.path}/:id`, authMiddleware, this.controller.show);
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(UsersPostValidation, 'body'), this.controller.create);
    this.router.put(`${this.path}/:id`, authMiddleware, validationMiddleware(UsersPutValidation, 'body', true), this.controller.update);
    this.router.delete(`${this.path}/:id`, authMiddleware, this.controller.delete);
  }
}
