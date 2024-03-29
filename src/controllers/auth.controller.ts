import {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {default as i18n} from 'i18next';
import {RequestWithUser} from '../interfaces/reqeust.with.user.interface';
import {IUser} from '../interfaces/user';
import AuthService from '../services/auth.service';

import {AuthControllerInterface} from '../interfaces/auth.controller.interface';
import {ILogIn} from '../interfaces/log.in.interface';
import requestIp from 'request-ip';
import {authConfig} from '../configs/auth.config';
import fetch from 'isomorphic-fetch';
import {AuthEntity} from '@/entities/auth.entity';
import Pusher from 'pusher';
import {sharedConfig} from '@/configs/shared.config';
import {IPusherNotification} from '@/interfaces/pusher.message';
import {NotificationType} from '@/enums/notification.type.enum';
import {getDateNow} from '@/utils/get.date.now';
import {IRefreshToken} from "@/interfaces/jwt.token.interface";

export default class AuthController implements AuthControllerInterface {
  public signUp = async function (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const authEntity = new AuthEntity(req.body);
      await authEntity.signUpMode().createNow().generateActivateToken().activateExpiration().generatePasswordHash();


      if (!authEntity.email || !authEntity.phone) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({
          statusMessage: i18n.t('auth.youPhoneOrEmail'),
        });
      }

      authEntity.action;

      const captchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${authConfig.captcha.secretKey}&response=${
        authEntity.token
      }&remoteip=${requestIp.getClientIp(req)}`;

      const captchaResponse = await fetch(captchaUrl);
      const data = await captchaResponse.json();

      if (data.success == false) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          statusMessage: i18n.t('auth.youAreRobot'),
        });
      }

      delete authEntity.token;
      delete authEntity.action;

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      authEntity.userAgent = req.useragent.os;
      authEntity.ip = requestIp.getClientIp(req);

      const authService = new AuthService();
      const signUpUserData: IUser = await authService.signUp(authEntity);

      const pusher = new Pusher({
        appId: sharedConfig.pusher.appId.toString(),
        key: sharedConfig.pusher.authKey,
        secret: sharedConfig.pusher.secret,
        useTLS: sharedConfig.pusher.useTLS,
        cluster: sharedConfig.pusher.cluster,
      });

      const pusherData: IPusherNotification = {
        type: NotificationType.NewUser,
        message: ' you got new  New User',
        counter: 1,
        date: getDateNow(),
      };
      pusher.trigger('notification-channel', 'my-event', pusherData);
      res.status(StatusCodes.CREATED).json({
        statusMessage: i18n.t('auth.singUp'),
        data: signUpUserData,
      });
    } catch (error) {
      next(error);
    }
  };
  public signIn = async function (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const authEntity = new AuthEntity(req.body);
      authEntity.logInMode();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      authEntity.userAgent = req.useragent.os;
      authEntity.ip = requestIp.getClientIp(req);

      const authService = new AuthService();
      const isLogIn: ILogIn = await authService.signIn(authEntity);

      res.setHeader('Set-Cookie', [isLogIn.cookie]);
      res.status(StatusCodes.OK).json({
        statusMessage: i18n.t('auth.singIn'),
        data: {
          role: isLogIn.role,
          permissions: isLogIn.permissions,
          permissionUser: isLogIn.permissionUser,
          permissionGroup: isLogIn.permissionGroup,
          userInformation: isLogIn.userInformation,
          csrf: isLogIn.csrf,
          jwt: isLogIn.jwt,
        },
      });
    } catch (error) {
      next(error);
    }
  };
  public signOut = async function (req: RequestWithUser, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const userData: IUser = req.user;
      const authService = new AuthService();
      await authService.signOut(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.setHeader('Authorization', '');
      res.status(StatusCodes.OK).json({
        statusMessage: i18n.t('auth.singOut'),
      });
    } catch (error) {
      next(error);
    }
  };


  public refresh = async function (req: RequestWithUser, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const authService = new AuthService();
      const authEntity = new AuthEntity(req.user);
      const refreshToken: IRefreshToken = await authService.refresh(authEntity);

      res.setHeader('Set-Cookie', [refreshToken.cookie]);
      res.status(StatusCodes.OK).json({
        statusMessage: i18n.t('auth.singIn'),
        data: refreshToken.jwt,
      });
    } catch (error) {
      next(error);
    }
  };
  public activationViaEmail = async function (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const authEntity = new AuthEntity(req.body);
      authEntity.activate();
      const authService = new AuthService();
      await authService.activationViaEmail(authEntity);

      res.status(StatusCodes.OK).json({
        statusMessage: i18n.t('auth.accountActivate'),
      });
    } catch (error) {
      next(error);
    }
  };
  public sendActivateCodeViaEmail = async function (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const authEntity = new AuthEntity(req.body);
      authEntity.generateActivateToken().activateExpiration().deActivate();
      const authService = new AuthService();
      await authService.sendActivateCodeViaEmail(authEntity);

      res.status(StatusCodes.CREATED).json({
        statusMessage: i18n.t('auth.emailActivationSend'),
      });
    } catch (error) {
      next(error);
    }
  };

  public activationViaSms = async function (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const authEntity = new AuthEntity(req.body);
      authEntity.activate();
      const authService = new AuthService();
      await authService.activationViaSms(authEntity);
      res.status(StatusCodes.OK).json({
        statusMessage: i18n.t('auth.accountActivate'),
      });
    } catch (error) {
      next(error);
    }
  };
  public sendActivateCodeViaSms = async function (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const authEntity = new AuthEntity(req.body);
      authEntity.activateExpiration().generateActivateToken();
      const authService = new AuthService();
      await authService.sendActivateCodeViaSms(authEntity);

      res.status(StatusCodes.CREATED).json({
        statusMessage: i18n.t('auth.smsActivationSend'),
      });
    } catch (error) {
      next(error);
    }
  };
  public forgot = async function (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const authEntity = new AuthEntity(req.body);
      authEntity.logInMode().resetNow().resetExpiration().generateRestToken();
      const authService = new AuthService();

      authEntity.action;

      const captchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${authConfig.captcha.secretKey}&response=${
        authEntity.token
      }&remoteip=${requestIp.getClientIp(req)}`;

      const captchaResponse = await fetch(captchaUrl);
      const data = await captchaResponse.json();

      if (data.success == false) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          statusMessage: i18n.t('auth.youAreRobot'),
        });
      }
      delete authEntity.token;
      delete authEntity.action;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      authEntity.userAgent = req.useragent.os;
      authEntity.ip = requestIp.getClientIp(req);
      await authService.forgot(authEntity);

      res.status(StatusCodes.OK).json({
        statusMessage: i18n.t('auth.forgotDone'),
      });
    } catch (error) {
      next(error);
    }
  };

  public resetPasswordViaEmail = async function (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const authEntity = new AuthEntity(req.body);
      await authEntity.resetNow().generatePasswordHash();
      const authService = new AuthService();
      await authService.resetPasswordViaEmail(authEntity);
      res.status(StatusCodes.OK).json({
        statusMessage: i18n.t('auth.resetPasswordDone'),
      });
    } catch (error) {
      next(error);
    }
  };

  public resetPasswordViaSms = async function (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const authEntity = new AuthEntity(req.body);
      await authEntity.resetNow().generatePasswordHash();
      const authService = new AuthService();
      await authService.resetPasswordViaSms(authEntity);
      res.status(StatusCodes.OK).json({
        statusMessage: i18n.t('auth.resetPasswordDone'),
      });
    } catch (error) {
      next(error);
    }
  };
}
