import { IPagination } from './pagination';

export interface IUserGroup {
  id?: number;
  userId: number;
  groupId: number;
}

export interface IUserGroupPagination {
  data: IUserGroup[];
  pagination: IPagination;
}
