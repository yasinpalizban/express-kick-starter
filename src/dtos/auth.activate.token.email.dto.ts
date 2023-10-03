import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthActivateTokenEmailDto {
  @IsString()
  public activeToken: string;
  @IsEmail()
  @MinLength(3)
  @MaxLength(255)
  @IsNotEmpty()
  public email: string;
}
