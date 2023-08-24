import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class PermissionUserValidation {
  @IsOptional()
  public id:number;

  @IsNotEmpty()
  public userId: number;

  @IsNotEmpty()
  public permissionId: number;
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  public actions: string;


}
