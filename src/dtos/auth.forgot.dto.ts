import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthForgotDto {
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
