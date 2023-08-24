import { Entity } from '../libraries/entity';

export class GroupEntity extends Entity {
  id: number;
  name: string;
  description: string;


  constructor(init?: Partial<GroupEntity>) {
    super();
    Object.assign(this, init);

  }


}
