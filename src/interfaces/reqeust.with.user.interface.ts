import { Request } from 'express';
import { IUserLogIn } from './log.in.interface';

export interface RequestWithUser extends Request {
  user: IUserLogIn;
  file: any;

}
