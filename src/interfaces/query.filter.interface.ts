import {Request} from "express";


export interface QueryFilterInterface {

  transform(request: Request): this;

  navigation(request: Request): this;
}

export interface QueryUrl {
  limit?: number;
  page?: number;
  filed?: string;
  order?: string;
  sort?: string;
  foreignKey?: number;
}


