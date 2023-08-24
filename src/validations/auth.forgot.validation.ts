import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthForgotValidation {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  @IsNotEmpty()
  public login: string;
  @IsString()
  public token: string;
  @IsString()
  public action: string;

}
