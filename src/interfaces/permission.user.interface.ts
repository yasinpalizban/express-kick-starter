import { IPagination } from './pagination';

export interface IPermissionUser {
  id: number;
  actions: string;
  userId: number;
  userName?: string;
  firstName?: string;
  lastName?: string;
  permission?: string;
  permissionId: number;
}

export interface IPermissionUserPagination {
  data: IPermissionUser[];
  pagination?: IPagination;
}
