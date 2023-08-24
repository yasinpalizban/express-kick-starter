import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthSendActivateEmailValidation {
  @IsString()
  @IsEmail()
  @MinLength(3)
  @MaxLength(255)
  @IsNotEmpty()
  public email: string;
}
