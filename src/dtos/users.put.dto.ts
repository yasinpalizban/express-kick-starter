import { IsString, IsOptional, IsBoolean, MinLength, MaxLength, IsNotEmpty } from "class-validator";

export class UsersPutDto {
  @IsOptional()
  public id:number;
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(255)
  public password: string;
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
  @IsOptional()
  @IsBoolean()
  public status: boolean;
}
