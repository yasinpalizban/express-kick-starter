import { UrlAggression } from '../libraries/urlAggression';

export declare interface ServiceInterface {

  index?(urlQueryParam?: UrlAggression| any): Promise<any[] | any>;

  show?(id: number): Promise<any>;

  create?(data: any): Promise<void | any>;

  update?(id: number, data: any): Promise<void | any>;

  delete?(id: number, foreignKey?: number): Promise<void>;
}

