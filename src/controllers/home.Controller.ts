import { NextFunction, Request, Response } from 'express';
import { HomeControllerInterface } from '@/interfaces/home.controller.interface';
import { StatusCodes } from 'http-status-codes';
import { default as i18n } from 'i18next';
import { HomeService } from '@/services/home.service';

class HomeController implements HomeControllerInterface {
  async index(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    res.status(StatusCodes.OK).json({
      statusMessage: i18n.t('api.commons.receive'),
    });
  }


  async settings(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    const homeService = new HomeService();
    const data = await homeService.settings();
    res.status(StatusCodes.OK).json({
      statusMessage: i18n.t('api.commons.receive'),
      settingPost: data,
    });
  }

}
export default HomeController;
