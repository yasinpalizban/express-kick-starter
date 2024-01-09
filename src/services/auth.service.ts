import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {HttpException} from '../exceptions/HttpException';
import {isEmpty} from '../utils/is.empty';
import {StatusCodes} from 'http-status-codes';
import {default as i18n} from 'i18next';
import {IUser} from '../interfaces/user';
import {
  EMAIL_FROMEMAIL,
  EMAIL_HOST,
  EMAIL_PASSWORD,
  EMAIL_PORT,
  EMAIL_SECURE,
  EMAIL_USER,
  SECRET_KEY,
  SITE_ADDRESS,
} from '../configs/config';
import {DataStoredInToken, IRefreshToken, TokenData} from '../interfaces/jwt.token.interface';
import {sharedConfig} from '../configs/shared.config';
import ejs from 'ejs';
import nodemailer from 'nodemailer';
import {compareDate} from '../utils/compare.date';
import {Sms} from '../libraries/sms';
import {AuthServiceInterface} from '../interfaces/auth.service.interface';
import {ILogIn} from '../interfaces/log.in.interface';
import {RoleType} from '../enums/role.type.enum';
import {IPermission} from '../interfaces/permission';
import {IPermissionUser} from '../interfaces/permission.user';
import {IPermissionGroup} from '../interfaces/permission.group';
import {IGroup} from '../interfaces/group';
import {authConfig} from '@/configs/auth.config';
import DB from '@/databases/database';
import {AuthEntity} from '../entities/auth.entity';
import {IUserGroup} from '@/interfaces/group.user';
import {getDateNow} from '@/utils/get.date.now';
import Sequelize from 'sequelize';

export default class AuthService implements AuthServiceInterface {
  public userModel = DB.users;
  public groupModel = DB.group;
  public permissionModel = DB.permission;
  public userPermissionModel = DB.permissionUser;
  public groupPermissionModel = DB.permissionGroup;
  public ipActivityModel = DB.ipActivity;
  public userGroupModel = DB.userGroup;
  public sms = new Sms(sharedConfig.sms.userName, sharedConfig.sms.password, 0);

  public async signUp(entity: AuthEntity): Promise<IUser> {
    if (isEmpty(entity) || (entity.phone == undefined && entity.email == undefined))
      throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.reject'));

    let findUser: IUser;

    if (entity.email !== undefined) {
      findUser = await this.userModel.findOne({where: {email: entity.email, username: entity.username}});
      if (findUser) {
        await this.storeLogAttempts(false, 'sign-up', entity.login, entity.ip, entity.userAgent);
        throw new HttpException(StatusCodes.CONFLICT, i18n.t('auth.youAreEmail'));
      }

      await this.sendActivationEmail(entity.email, entity.activeToken);
    }
    if (entity.phone !== undefined) {
      findUser = await this.userModel.findOne({where: {phone: entity.phone, username: entity.username}});
      if (findUser) {
        await this.storeLogAttempts(false, 'sign-up', entity.login, entity.ip, entity.userAgent);
        throw new HttpException(StatusCodes.CONFLICT, i18n.t('auth.yourArePhone'));
      }
      await this.sms.sendActivationCode(entity.phone, SITE_ADDRESS);
    }

    const createUser: IUser = await this.userModel.create(entity);

    if (!createUser) throw new HttpException(StatusCodes.CONFLICT, i18n.t('api.commons.reject'));
    await this.storeLogAttempts(true, 'sign-up', entity.login, entity.ip, entity.userAgent, findUser.id,);
    const group: IGroup = await this.groupModel.findOne({where: {name: RoleType.Member}});
    await this.userGroupModel.create({groupId: group.id, userId: createUser.id});
    return createUser;
  }

  public async signIn(entity: AuthEntity): Promise<ILogIn> {
    if (isEmpty(entity)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.reject'));

    let findUser: IUser;

    if (entity.username !== undefined) {
      findUser = await this.userModel.findOne({where: {username: entity.username}});
    }
    if (entity.email !== undefined) {
      findUser = await this.userModel.findOne({where: {email: entity.email}});
    }
    if (entity.phone !== undefined) {
      findUser = await this.userModel.findOne({where: {phone: entity.phone}});
    }
    if (!findUser) {
      await this.storeLogAttempts(false, 'sign-in', entity.login, entity.ip, entity.userAgent);
      throw new HttpException(StatusCodes.CONFLICT, i18n.t('auth.accountNotExist'));
    }

    const isPasswordMatching: boolean = await bcrypt.compare(entity.password, findUser.password);
    if (!isPasswordMatching) {
      await this.storeLogAttempts(false, 'sign-in', entity.login, entity.ip, entity.userAgent, findUser.id);
      throw new HttpException(StatusCodes.CONFLICT, i18n.t('auth.accountNotExist'));
    }
    if (findUser.status == true) {
      await this.storeLogAttempts(false, 'sign-in', entity.login, entity.ip, entity.userAgent, findUser.id);
      throw new HttpException(StatusCodes.CONFLICT, i18n.t('auth.accountBan'));
    }
    if (findUser.active == false) {
      await this.storeLogAttempts(false, 'sign-in', entity.login, entity.ip, entity.userAgent, findUser.id);
      throw new HttpException(StatusCodes.CONFLICT, i18n.t('auth.accountNotConfirm'));
    }
    await this.storeLogAttempts(true, 'sign-in', entity.login, entity.ip, entity.userAgent, findUser.id);
    const userGroup: IUserGroup = await this.userGroupModel.findOne({where: {userId: findUser.id}});
    const group: IGroup = await this.groupModel.findOne({where: {id: userGroup.groupId}});

    const tokenData: TokenData = this.createToken(findUser, entity.remember ?? false);
    const cookie = this.createCookie(tokenData);
    const permissions: IPermission[] = await this.permissionModel.findAll();
    const permissionUser: IPermissionUser[] = await this.userPermissionModel.findAll({
      where: { userId: findUser.id},
      attributes: ['id', 'actions', 'userId', 'permissionId', [Sequelize.literal('`PermissionsModel`.`name`'), 'permission']],
      include: [
        {
          model: DB.permission,
          attributes: [],
        },
      ],
    });


    const permissionGroup: IPermissionGroup[] = await this.groupPermissionModel.findAll({
      where: {groupId: userGroup.groupId},
      attributes: ['id', 'actions', 'groupId', 'permissionId', [Sequelize.literal('`PermissionsModel`.`name`'), 'permission']],
      include: [
        {
          model: DB.permission,
          attributes: [],
        },
      ],
    });

    return {
      cookie: cookie,
      role: group,
      userInformation: {
        id: findUser.id,
        userName: findUser.username,
        image: findUser.image,
        firstName: findUser.firstName,
        lastName: findUser.lastName,
        email: findUser.email,
        phone: findUser.phone,
      },
      permissions: permissions,
      permissionUser: permissionUser,
      permissionGroup: permissionGroup,
      csrf: 'no-init',
      jwt: tokenData,
    };
  }

  public async signOut(entity: IUser): Promise<void> {
    if (isEmpty(entity)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.reject'));

    const findUser: IUser = await this.userModel.findOne({where: {id: entity.id}});
    if (!findUser) throw new HttpException(StatusCodes.CONFLICT, i18n.t('auth.youAreNot'));
    //  return findUser;
  }

  public async refresh(entity: AuthEntity): Promise<IRefreshToken> {
    if (isEmpty(entity)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.reject'));
    const tokenData: TokenData = this.createToken(entity, false);
    const cookie = this.createCookie(tokenData);
    return {
      cookie: cookie,
      jwt: tokenData,
    };
  }


  public async forgot(entity: AuthEntity): Promise<void> {
    if (isEmpty(entity)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.reject'));

    let findUser: IUser;

    if (entity.username !== undefined) {
      findUser = await this.userModel.findOne({where: {username: entity.username}});
      if (!findUser) {
        await this.storeLogAttempts(false, 'forgot', entity.login, entity.ip, entity.userAgent);
        throw new HttpException(StatusCodes.CONFLICT, i18n.t('auth.youAreNotUserName'));
      }

      if (findUser.email !== undefined) {
        await this.sendForgotEmail(findUser.email, entity.resetToken);
      } else {
        await this.sms.sendActivationCode(entity.phone, SITE_ADDRESS);
      }
    }
    if (entity.email !== undefined) {
      findUser = await this.userModel.findOne({where: {email: entity.email}});
      if (!findUser) {
        await this.storeLogAttempts(false, 'forgot', entity.login, entity.ip, entity.userAgent);
        throw new HttpException(StatusCodes.CONFLICT, i18n.t('auth.youAreNotEmail'));
      }
      await this.sendForgotEmail(findUser.email, entity.resetToken);
    }
    if (entity.phone !== undefined) {
      findUser = await this.userModel.findOne({where: {phone: entity.phone}});
      if (!findUser) {
        await this.storeLogAttempts(false, 'forgot', entity.login, entity.ip, entity.userAgent);
        throw new HttpException(StatusCodes.CONFLICT, i18n.t('auth.yourAreNotPhone'));
      }
      await this.sms.sendActivationCode(entity.phone, SITE_ADDRESS);
    }
    await this.storeLogAttempts(true, 'forgot', entity.login, entity.ip, entity.userAgent, findUser.id);
    await this.userModel.update(entity, {where: {id: findUser.id}});
  }

  public async activationViaEmail(entity: AuthEntity): Promise<true> {
    if (isEmpty(entity)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.reject'));

    const findUser: IUser = await this.userModel.findOne({
      where: {
        activeToken: entity.activeToken,
        active: false,
        email: entity.email,
      },
    });
    if (!findUser) {
      await this.storeLogAttempts(false, 'active-via-email', entity.login, entity.ip, entity.userAgent);
      throw new HttpException(StatusCodes.CONFLICT, i18n.t('auth.youAreNotUsername'));
    }
    if (compareDate(findUser.activeExpires, new Date())) {
      await this.storeLogAttempts(false, 'active-via-email', entity.login, entity.ip, entity.userAgent);
      throw new HttpException(StatusCodes.CONFLICT, i18n.t('auth.tokenExpire'));
    }
    await this.storeLogAttempts(true, 'active-via-email', entity.login, entity.ip, entity.userAgent, findUser.id);

    await this.userModel.update(
      {
        active: true,
        activeToken: null,
        activeExpires: null,
      },
      {where: {id: findUser.id}},
    );
    return true;
  }

  public async sendActivateCodeViaEmail(entity: AuthEntity): Promise<void> {
    if (isEmpty(entity)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.reject'));

    const findUser: IUser = await this.userModel.findOne({where: {email: entity.email}});
    if (!findUser) {
      await this.storeLogAttempts(false, 'send-active-code-email', entity.login, entity.ip, entity.userAgent);
      throw new HttpException(StatusCodes.CONFLICT, i18n.t('auth.youAreNotEmail'));
    }
    await this.storeLogAttempts(true, 'send-active-code-email', entity.login, entity.ip, entity.userAgent, findUser.id);
    await this.sendActivationEmail(findUser.email, entity.activeToken);
    await this.userModel.update(entity, {where: {id: findUser.id}});
  }

  public async activationViaSms(entity: AuthEntity): Promise<true> {
    if (isEmpty(entity)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.reject'));

    const isValid = await this.sms.isActivationCodeValid(entity.phone, entity.activeToken);

    if (!isValid) {
      await this.storeLogAttempts(false, 'active-vis-sms', entity.login, entity.ip, entity.userAgent);
      throw new HttpException(StatusCodes.CONFLICT, i18n.t('auth.tokenExpire'));
    }

    const findUser: IUser = await this.userModel.findOne({where: {phone: entity.phone, active: false}});
    if (!findUser){
      await this.storeLogAttempts(false, 'active-vis-sms', entity.login, entity.ip, entity.userAgent);
       throw new HttpException(StatusCodes.CONFLICT, i18n.t('auth.youAreNotAccount'));
    }
    await this.storeLogAttempts(true, 'active-vis-sms', entity.login, entity.ip, entity.userAgent, findUser.id);

    await this.userModel.update(
      {
        active: true,
        activeToken: null,
        activeExpires: null,
      },
      {where: {id: findUser.id}},
    );
    return true;
  }

  public async sendActivateCodeViaSms(entity: AuthEntity): Promise<void> {
    if (isEmpty(entity)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.reject'));

    const findUser: IUser = await this.userModel.findOne({where: {phone: entity.phone}});
    if (!findUser) {
      await this.storeLogAttempts(false, 'send-active-via-sms', entity.login, entity.ip, entity.userAgent);
      throw new HttpException(StatusCodes.CONFLICT, i18n.t('auth.youAreNotAccount'));
    }
    await this.storeLogAttempts(true, 'send-active-via-sms', entity.login, entity.ip, entity.userAgent, findUser.id);
    await this.sms.sendActivationCode(entity.phone, SITE_ADDRESS);
    await this.userModel.update(entity, {where: {id: findUser.id}});
  }

  public async resetPasswordViaEmail(entity: AuthEntity): Promise<void> {
    if (isEmpty(entity)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.reject'));

    const findUser: IUser = await this.userModel.findOne({where: {email: entity.email, resetToken: entity.resetToken}});
    if (!findUser) {
      await this.storeLogAttempts(false, 'reset-password-via-email', entity.login, entity.ip, entity.userAgent);
      throw new HttpException(StatusCodes.CONFLICT, i18n.t('auth.youAreNotAccount'));
    }
    if (compareDate(findUser.resetExpires, new Date())) {
      await this.storeLogAttempts(false, 'reset-password-via-email', entity.login, entity.ip, entity.userAgent);
      throw new HttpException(StatusCodes.CONFLICT, i18n.t('auth.tokenExpire'));
    }

    await this.storeLogAttempts(true, 'reset-password-via-email', entity.login, entity.ip, entity.userAgent, findUser.id);
    await this.userModel.update(
      {
        resetAt: entity.resetAt,
        password: entity.password,
        resetToken: null,
        resetExpires: null,
      },
      {where: {id: findUser.id}},
    );
  }

  public async resetPasswordViaSms(entity: AuthEntity): Promise<void> {
    if (isEmpty(entity)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.reject'));

    const isValid = await this.sms.isActivationCodeValid(entity.phone, entity.resetToken);

    if (!isValid) {
      await this.storeLogAttempts(false, 'reset-password-via-sms', entity.login, entity.ip, entity.userAgent);
      throw new HttpException(StatusCodes.CONFLICT, i18n.t('auth.tokenExpire'));
    }

    const findUser: IUser = await this.userModel.findOne({where: {phone: entity.phone}});

    if (!findUser) {
      await this.storeLogAttempts(false, 'reset-password-via-sms', entity.login, entity.ip, entity.userAgent);
      throw new HttpException(StatusCodes.CONFLICT, i18n.t('auth.yourAreNotPhone'));
    }

    await this.storeLogAttempts(true, 'reset-password-via-sms', entity.login, entity.ip, entity.userAgent, findUser.id);
    await this.userModel.update(
      {
        resetAt: entity.resetAt,
        password: entity.password,
        resetToken: null,
        resetExpires: null,
      },
      {where: {id: findUser.id}},
    );
  }

  public createToken(user: IUser, isRemember: boolean): TokenData {
    const dataStoredInToken: DataStoredInToken = {id: user.id};
    const secretKey: string = SECRET_KEY;
    const maxAge: number = isRemember == true ? 2 * authConfig.time.day : 2 * authConfig.time.hour;
    const date = new Date();
    date.setSeconds(maxAge);
    const expire: number = Math.floor(date.getTime() / 1000);
    return {expire: expire, maxAge: maxAge, token: jwt.sign(dataStoredInToken, secretKey, {expiresIn: maxAge})};
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.maxAge};`;
  }

  public async sendForgotEmail(email: string, hash: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: EMAIL_SECURE,
      auth: {user: EMAIL_USER, pass: EMAIL_PASSWORD},
    });
    const mailContext = {
      siteAddress: SITE_ADDRESS,
      emailForgotTitle: i18n.t('auth.emailForgotTitle'),
      emailForgotGuide: i18n.t('auth.emailForgotGuide'),
      emailActivateHash: i18n.t('auth.emailActivateHash'),
      hash: hash,
      emailForgotVisit: i18n.t('auth.emailForgotVisit'),
      emailActivateIgnore: i18n.t('auth.emailActivateIgnore'),
      emailForgotResetFrom: i18n.t('auth.emailForgotResetFrom'),
    };
    const template = await ejs.renderFile('./dist/modules/auth/views/forgot.html', mailContext);

    const mailOptions = {
      from: EMAIL_FROMEMAIL,
      to: email,
      subject: SITE_ADDRESS + ' (' + i18n.t('api.events.emailForgot') + ')',
      html: template,
    };
    const isSend = await transporter.sendMail(mailOptions);
    if (!isSend.messageId) {
      throw new HttpException(StatusCodes.CONFLICT, i18n.t('auth.emailSendErrorForgot'));
    }
  }

  public async sendActivationEmail(email: string, hash: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: +EMAIL_PORT,
      secure: EMAIL_SECURE,
      auth: {user: EMAIL_USER, pass: EMAIL_PASSWORD},
    });
    const mailContext = {
      siteAddress: SITE_ADDRESS,
      emailActivateTitle: i18n.t('auth.emailActivateTitle'),
      emailActivateGuide: i18n.t('auth.emailActivateGuide'),
      emailActivateHash: i18n.t('auth.emailActivateHash'),
      hash: hash,
      emailActivationPage: i18n.t('auth.emailActivationPage'),
      emailActivateIgnore: i18n.t('auth.emailActivateIgnore'),
      emailActivateAccount: i18n.t('auth.emailActivateAccount'),
    };

    const template = await ejs.renderFile('./dist/modules/auth/views/activation.html', mailContext);
    const mailOptions = {
      from: EMAIL_FROMEMAIL,
      to: email,
      subject: SITE_ADDRESS + ' (' + i18n.t('api.events.emailActivation') + ')',
      html: template,
    };
    const isSend = await transporter.sendMail(mailOptions);
    if (!isSend.messageId) {
      throw new HttpException(StatusCodes.CONFLICT, i18n.t('auth.emailSendErrorActivation'));
    }
  }

  private async storeLogAttempts(success: boolean, type: string, login: string, ip: string, userAgent: string, userId = 0) {
    await this.ipActivityModel.prototype.keepLimitOfAttempts(authConfig.logAttempt);
    await this.ipActivityModel.create({
      success: success,
      type: type,
      login: login,
      ipAddress: ip,
      userAgent: userAgent,
      userId: userId,
      date: new Date(getDateNow()),
    });
  }
}
