import {IBasic} from "@/interfaces/basic.interface";

export interface IPermissionUser extends  IBasic {
  actions: string;
  userId: number;
  userName?: string;
  firstName?: string;
  lastName?: string;
  permission?: string;
  permissionId: number;
}

