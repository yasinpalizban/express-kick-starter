import { Router } from 'express';
import { Routes } from '@/interfaces/routes.interface';
import HomeController from '@/controllers/home.Controller';
import validationMiddleware from '@/middlewares/validation.middleware';


class HomeRoute implements Routes {
  public path = '/api/home';
  public router = Router();
  public homeController = new HomeController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.homeController.index);
    this.router.get(`${this.path}/setting-list`, this.homeController.settings);
  }
}

export default HomeRoute;
