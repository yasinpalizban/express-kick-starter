import { IsEmail, IsString } from 'class-validator';

export class AuthTestDto {
  @IsEmail()
  public email: string;
  @IsString()
  public password: string;
  @IsString()
  public phone: string;
  @IsString()
  public userName: string;
}
