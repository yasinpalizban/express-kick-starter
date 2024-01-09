
export declare interface ServiceInterface<T> {

  index?(urlQueryParam?:  any): Promise<T[] | any>;

  show?(id: number): Promise<T>;

  create?(data: any): Promise<void | any>;

  update?(id: number, data: any): Promise<void | any>;

  delete?(id: number, foreignKey?: number): Promise<void>;
}


