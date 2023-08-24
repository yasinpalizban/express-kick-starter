import { IsEmail, IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { IsEqualTo } from '@/utils/is.equal.to';

export class ProfileValidation {
  @IsOptional()
  public id:number;
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  @IsOptional()
  public userName: string;
  @IsEmail()
  @IsOptional()
  @MinLength(3)
  @MaxLength(255)
  public email: string;

  @IsString()
  @IsOptional()
  @MaxLength(11)
  public phone: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(255)
  public firstName: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(255)
  public lastName: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(255)
  public address: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(255)
  public country: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(255)
  public city: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(255)
  public image: string;

  @IsString()
  @IsOptional()
  public gender: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(255)
  public password: string;
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(255)
  @IsEqualTo('password')
  public passConfirm: string;
}
