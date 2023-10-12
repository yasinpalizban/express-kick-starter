import {IBasic} from "@/interfaces/basic.interface";

export interface IPermissionGroup extends  IBasic {
  actions: string;
  groupId: number;
  group?: string;
  permission?: string;
  permissionId: number;
}
