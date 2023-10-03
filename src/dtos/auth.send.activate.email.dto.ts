import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthSendActivateEmailDto {
  @IsString()
  @IsEmail()
  @MinLength(3)
  @MaxLength(255)
  @IsNotEmpty()
  public email: string;
}
