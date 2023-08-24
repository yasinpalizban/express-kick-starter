import { TokenData } from './jwt.token.interface';
import { IUser } from './user.interface';
import { AuthEntity } from '@/entities/auth.entity';

export declare interface AuthServiceInterface {
  signUp(entity: AuthEntity): Promise<IUser>;

  signIn(entity: AuthEntity): Promise<any>;

  signOut(entity: IUser): Promise<void>;

  forgot(entity: AuthEntity): Promise<void>;

  activationViaEmail(entity: AuthEntity): Promise<true>;

  sendActivateCodeViaEmail(entity: AuthEntity): Promise<void>;

  activationViaSms(entity: AuthEntity): Promise<true>;

  sendActivateCodeViaSms(entity: AuthEntity): Promise<void>;

  resetPasswordViaEmail(entity: AuthEntity): Promise<void>;

  resetPasswordViaSms(entity: AuthEntity): Promise<void>;

  createToken(user: IUser, isRemember: boolean): TokenData;

  createCookie(tokenData: TokenData): string;

  sendForgotEmail(email: string, hash: string): Promise<void>;

  sendActivationEmail(email: string, hash: string): Promise<void>;
}
