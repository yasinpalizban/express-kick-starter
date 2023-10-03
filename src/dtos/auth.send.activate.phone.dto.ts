import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AuthSendActivatePhoneDto {
  @IsString()
  @MaxLength(11)
  @IsNotEmpty()
  public phone: string;

}
