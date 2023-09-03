import { NextFunction, Request, Response } from 'express';
import { HomeControllerInterface } from '@/interfaces/home.controller.interface';
import { StatusCodes } from 'http-status-codes';
import { default as i18n } from 'i18next';
import { HomeService } from '@/services/home.service';
import requestIp from 'request-ip';
import Pusher from 'pusher';
import { sharedConfig } from '@/configs/shared.config';
import { IPusherNotification } from '@/interfaces/pusher.message';
import { NotificationType } from '@/enums/notification.type.enum';
import { getDateNow } from '@/utils/get.date.now';

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
