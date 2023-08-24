import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import validationMiddleware from '../middlewares/validation.middleware';
import authMiddleware from '../middlewares/auth.middleware';
import SettingController from '../controllers/setting.controller';
import { SettingValidation } from '../validations/setting.validation';

export default class SettingRoute implements Routes {
  public path = '/api/setting';
  public router = Router();
  public controller = new SettingController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.controller.index);
    this.router.get(`${this.path}/:id`, authMiddleware, this.controller.show);
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(SettingValidation, 'body'), this.controller.create);
    this.router.put(`${this.path}/:id`, authMiddleware, validationMiddleware(SettingValidation, 'body', true), this.controller.update);
    this.router.delete(`${this.path}/:id`, authMiddleware, this.controller.delete);
  }
}
