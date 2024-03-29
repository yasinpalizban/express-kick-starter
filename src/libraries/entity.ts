import { EntityInterface } from '../interfaces/entity.interface';

export class Entity implements EntityInterface {
  protected dataMap: Object;
  public id?: number;

  constructor() {
    this.dataMap = {};
  }
  get Entity(): object {
    return Object.entries(this);
  }

  getDataMap(): Object {
    return this.dataMap;
  }

}
