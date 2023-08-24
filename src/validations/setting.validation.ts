import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class SettingValidation {
  @IsOptional()
  public id:number;
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  @IsNotEmpty()
  public key: string;
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  @IsNotEmpty()
  public value: string;
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  @IsNotEmpty()
  public description: string;
  @IsBoolean()
  @IsNotEmpty()
  public status: boolean;
}
