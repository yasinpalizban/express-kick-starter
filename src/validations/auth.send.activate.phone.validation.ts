import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AuthSendActivatePhoneValidation {
  @IsString()
  @MaxLength(11)
  @IsNotEmpty()
  public phone: string;

}
