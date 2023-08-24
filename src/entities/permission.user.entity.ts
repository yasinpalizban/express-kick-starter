import { Entity } from '../libraries/entity';

export class PermissionUserEntity extends Entity {
  id: number;
  actions: string;
  userId: number;
  permissionId: number;


  constructor(init?: Partial<PermissionUserEntity>) {
    super();
    Object.assign(this, init);

  }


}
