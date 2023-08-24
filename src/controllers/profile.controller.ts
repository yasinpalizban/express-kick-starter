import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { default as i18n } from 'i18next';
import ApiController from './api.controller';
import { RequestWithUser } from '../interfaces/reqeust.with.user.interface';
import ProfileService from '../services/profile.service';
import { UserEntity } from '../entities/user.entity';
import { IUser } from '../interfaces/user.interface';
import { isEmpty } from '../utils/is.empty';
import { IMulterFile } from '../interfaces/multer.file.interface';
import { optimizeImage } from '../utils/optimize.image';
import { sharedConfig } from '../configs/shared.config';
import { IUserLogIn } from '@/interfaces/Log.in.interface';

export default class ProfileController extends ApiController {
  async index(req: RequestWithUser, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const user: IUserLogIn = req.user;
      const profileService = new ProfileService();
      const findOneData: IUser = await profileService.show(user.id);
      res.status(StatusCodes.OK).json({
        statusMessage: i18n.t('api.commons.receive'),
        data: findOneData,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: RequestWithUser, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const user: IUserLogIn = req.user;
      const userEntity = new UserEntity(req.body);
      await userEntity.updateNow().generatePasswordHash();
      const profileService = new ProfileService();
      if (!isEmpty(req.file)) {
        const file: IMulterFile = req.file;
        userEntity.image = sharedConfig.profileDirectory + file.filename;
        await optimizeImage(file.destination + file.filename, 200, 200, 90);
      }

      await profileService.update(user.id, userEntity);
      res.status(StatusCodes.CREATED).json({
        statusMessage: i18n.t('api.commons.save'),
      });
    } catch (error) {
      next(error);
    }
  }
}
