import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthActivateTokenPhoneValidation {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  public activeToken: string;
  @IsString()
  @MaxLength(11)
  @IsNotEmpty()
  public phone: string;
}
