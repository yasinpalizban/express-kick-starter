import { IUser } from './user';
import { TokenData } from './jwt.token.interface';
import { IPermission } from './permission';
import { IPermissionGroup } from './permission.group';
import { IPermissionUser } from './permission.user';
import { IGroup } from './group';

export interface ILogIn {
  cookie: string;
  role: IGroup;
  userInformation: {
    id: number;
    userName: string;
    image: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  permissions: IPermission[];
  permissionUser: IPermissionUser[];
  permissionGroup: IPermissionGroup[];
  jwt: TokenData;
  csrf: string;
}

export interface IUserLogIn extends IUser {
  role?: {
    id: number;
    name: string;
  };
}
