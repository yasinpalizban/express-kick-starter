import {IBasic} from "@/interfaces/Basic";

export interface IPermissionUser extends  IBasic {
  actions: string;
  userId: number;
  userName?: string;
  firstName?: string;
  lastName?: string;
  permission?: string;
  permissionId: number;
}

