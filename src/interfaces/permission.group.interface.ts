import { IPagination } from './pagination';

export interface IPermissionGroup {
  id: number;
  actions: string;
  groupId: number;
  group?: string;
  permission?: string;
  permissionId: number;
}
export interface IPermissionGroupPagination {
  data: IPermissionGroup[];
  pagination?: IPagination;
}
