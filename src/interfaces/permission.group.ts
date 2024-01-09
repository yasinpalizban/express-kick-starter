import {IBasic} from "@/interfaces/Basic";

export interface IPermissionGroup extends  IBasic {
  actions: string;
  groupId: number;
  group?: string;
  permission?: string;
  permissionId: number;
}
