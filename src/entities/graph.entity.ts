import { Entity } from '../libraries/entity';

export class GraphEntity extends Entity {
  type: string;
  fromDate: string;
  toDate: string;

  constructor(init?: Partial<GraphEntity>) {
    super();
    Object.assign(this, init);

  }
}
