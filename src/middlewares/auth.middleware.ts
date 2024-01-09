import {SECRET_KEY} from '../configs/config';
import {NextFunction, Response} from 'express';
import jwt from 'jsonwebtoken';
import {default as i18n} from 'i18next';
import {StatusCodes} from 'http-status-codes';
import {DataStoredInToken} from '../interfaces/jwt.token.interface';
import {RequestWithUser} from '../interfaces/reqeust.with.user.interface';
import {IPermission} from '../interfaces/permission';
import {IPermissionUser} from '../interfaces/permission.user';
import {IPermissionGroup} from '../interfaces/permission.group';
import {isEmpty} from '../utils/is.empty';
import DB from '@/databases/database';
import {ErrorType} from '../enums/error.type.enum';
import {IUserLogIn} from '../interfaces/log.in.interface';
import {routeController} from '@/utils/route.controller';
import {IUser} from '@/interfaces/user';
import {IGroup} from '@/interfaces/group';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.header('Authorization').split('Bearer ')[1] || req.cookies['Authorization'] || null;
    if (isEmpty(Authorization)) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        error: i18n.t('middleWear.authToken'),
        type: ErrorType.Login,
      });
    }

    const verificationResponse = (await jwt.verify(Authorization, SECRET_KEY)) as DataStoredInToken;
    const userId = verificationResponse.id;

    const findUser: IUser = await DB.users.findByPk(userId);
    if (isEmpty(findUser)) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        error: i18n.t('middleWear.wrongAuth'),
        type: ErrorType.Login,
      });
    }

    const group: IGroup = await DB.group.prototype.getUserForGroup(findUser.id);
    const userLoggedIn: IUserLogIn = findUser;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    //userLoggedIn.dataValues.role = group.dataValues;
    userLoggedIn.role = group;
    req.user = userLoggedIn;
    const controllerName = routeController(req.route.path);
    const permission: IPermission = await DB.permission.findOne({where: {name: controllerName}});
    const groupPermission: IPermissionGroup = await DB.permissionGroup.findOne({
      where: {
        permissionId: permission.id,
        groupId: group.id
      }
    });

    if (permission.active == false) {
      if (!isEmpty(groupPermission)) {
        return next();
      }
    } else {
      const typeMethod = req.method;
      const userPermission: IPermissionUser = await DB.permissionUser.findOne({
        where: {
          permissionId: permission.id,
          userId: findUser.id
        }
      });


      if (!isEmpty(userPermission) && userPermission.userId == findUser.id && userPermission.actions.search(typeMethod.toLowerCase()) !== -1) {
        return next();
      }

      if (!isEmpty(groupPermission) && groupPermission.groupId == group.id && groupPermission.actions.search(typeMethod.toLowerCase()) !== -1) {
        return next();
      }

    }
    res.status(StatusCodes.UNAUTHORIZED).json({
      error: i18n.t('middleWear.notEnoughPrivilege'),
      type: ErrorType.Permission,
    });
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      error: i18n.t('middleWear.wrongAuth'),
      type: ErrorType.Login,
    });
  }
};

export default authMiddleware;
