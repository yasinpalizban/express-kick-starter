import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { IsEqualTo } from '@/utils/is.equal.to';

export class AuthResetPasswordEmailDto {
  @IsString()
  @IsEmail()
  @MinLength(3)
  @MaxLength(255)
  @IsNotEmpty()
  public email: string;
  @IsString()
  public resetToken: string;
  @IsString()
  @MinLength(4)
  @MaxLength(12)
  public password: string;
  @IsString()
  @IsEqualTo('password')
  public passConfirm: string;
}
