import { IUser } from './user.interface';
import { TokenData } from './jwt.token.interface';
import { IPermission } from './permission.interface';
import { IPermissionGroup } from './permission.group.interface';
import { IPermissionUser } from './permission.user.interface';
import { IGroup } from './group.interface';

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
