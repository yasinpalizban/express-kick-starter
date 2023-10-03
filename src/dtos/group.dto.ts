import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class GroupDto {
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
}
