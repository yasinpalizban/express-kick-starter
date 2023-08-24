import { Router } from 'express';

import { Routes } from '../interfaces/routes.interface';
import GraphController from '../controllers/graph.controller';
import authMiddleware from '../middlewares/auth.middleware';
import { GraphValidation } from '@/validations/graph.validation';
import validationMiddleware from '@/middlewares/validation.middleware';

export default class GraphRoute implements Routes {
  public pathNested = '/api/graph';
  public router = Router();
  public controller = new GraphController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.pathNested}`, authMiddleware, this.controller.index);
    this.router.post(`${this.pathNested}`, authMiddleware, validationMiddleware(GraphValidation, 'body'), this.controller.create);
  }
}
