import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { IsEqualTo } from '@/utils/is.equal.to';

export class AuthSignupValidation {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  @IsNotEmpty()
  public login: string;
  @IsString()
  @MinLength(4)
  @MaxLength(12)
  @IsNotEmpty()
  public password: string;
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  @IsNotEmpty()
  public username: string;
  @IsString()
  @IsEqualTo('password')
  @MinLength(3)
  @MaxLength(255)
  public passConfirm: string;
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  public token: string;
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  public action: string;
}
