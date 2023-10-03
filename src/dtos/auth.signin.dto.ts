import { IsString, IsOptional, MaxLength, MinLength, IsNotEmpty } from 'class-validator';

export class AuthSigninDto {
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
  @IsOptional()
  public remember: boolean;
}
