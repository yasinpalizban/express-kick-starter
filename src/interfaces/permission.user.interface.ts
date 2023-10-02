
export interface IPermissionUser {
  id: number;
  actions: string;
  userId: number;
  userName?: string;
  firstName?: string;
  lastName?: string;
  permission?: string;
  permissionId: number;
}

