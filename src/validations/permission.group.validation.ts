import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class PermissionGroupValidation {
  @IsOptional()
  public id: number;

  @IsNotEmpty()
  public groupId: number;

  @IsNotEmpty()
  public permissionId: number;
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  public actions: string;
}
