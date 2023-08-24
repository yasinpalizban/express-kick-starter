import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class PermissionValidation {
  @IsOptional()
  public id:number;
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  public name: string;
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  public description: string;
  @IsBoolean()
  public active: boolean;


}
