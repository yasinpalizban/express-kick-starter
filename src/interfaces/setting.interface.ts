import {IBasic} from "@/interfaces/basic.interface";

export interface ISetting extends  IBasic {
  key: string;
  value: string;
  description: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}


