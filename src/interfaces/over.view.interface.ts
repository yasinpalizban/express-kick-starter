
import { IUser } from '@/interfaces/user.interface';

export interface IOverView {
  userPost?: IUser[];
  countPost?: {
    users: number;
  };
}
