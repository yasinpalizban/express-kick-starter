import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { default as i18n } from 'i18next';
import ApiController from '../controllers/api.controller';
import GraphService from '@/services/graph.service';
import { IGraph } from '@/interfaces/graph.interface';
import { GraphEntity } from '@/entities/graph.entity';

export default class GraphController extends ApiController {
  async index(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      // data goes here
      const graphService = new GraphService();
      const data: IGraph[] = await graphService.index();
      res.status(StatusCodes.OK).json({
        statusMessage: i18n.t('api.commons.receive'),
        data: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      // data goes here
      const graphService = new GraphService();
      const graphEntity = new GraphEntity(req.body);
      const data: IGraph[] | void = await graphService.create(graphEntity);
      res.status(StatusCodes.OK).json({
        statusMessage: i18n.t('api.commons.receive'),
        data: data,
      });
    } catch (error) {
      next(error);
    }
  }
}
