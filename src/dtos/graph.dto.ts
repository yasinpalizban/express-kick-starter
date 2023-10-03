import { IsNotEmpty, IsString } from "class-validator";

export class GraphDto {
  @IsString()
  @IsNotEmpty()
  public type: Date;
  @IsString()
  @IsNotEmpty()
  public toDate: Date;
  @IsString()
  @IsNotEmpty()
  public fromDate: Date;
}
