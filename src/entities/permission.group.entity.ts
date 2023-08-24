import { Entity } from '../libraries/entity';

export class PermissionGroupEntity extends Entity {
  id: number;
  actions: string;
  groupId: number;
  permissionId: number;



  constructor(init?: Partial<PermissionGroupEntity>) {
    super();
    Object.assign(this, init);

  }


}
