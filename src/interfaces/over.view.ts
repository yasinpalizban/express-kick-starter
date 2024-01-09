
import { IUser } from '@/interfaces/user';

export interface IOverView {
  userPost?: IUser[];
  countPost?: {
    users: number;
  };
}
