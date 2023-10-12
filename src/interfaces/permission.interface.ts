import {IBasic} from "@/interfaces/basic.interface";

export interface IPermission extends  IBasic {
  name: string;
  description: string;
  active: boolean;
}

