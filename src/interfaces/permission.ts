import {IBasic} from "@/interfaces/Basic";

export interface IPermission extends  IBasic {
  name: string;
  description: string;
  active: boolean;
}

