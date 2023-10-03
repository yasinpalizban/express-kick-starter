import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { IsEqualTo } from '@/utils/is.equal.to';

export class AuthResetPasswordPhoneDto {
  @IsString()
  @MaxLength(11)
  @IsNotEmpty()
  public phone: string;
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
