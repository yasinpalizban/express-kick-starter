import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UsersPostDto {
  @IsEmail()
  @MinLength(3)
  @MaxLength(255)
  public email: string;
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  public password: string;
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  public phone: string;
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  public username: string;
  @IsNotEmpty()
  public groupId: number;
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  public firstName: string;
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  public lastName: string;
}
