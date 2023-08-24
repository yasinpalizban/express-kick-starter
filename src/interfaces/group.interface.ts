import { IPagination } from './pagination';

export interface IGroup {
  id: number;
  name: string;
  description: string;
}

export interface IGroupPagination {
  data: IGroup[];
  pagination: IPagination;
}
