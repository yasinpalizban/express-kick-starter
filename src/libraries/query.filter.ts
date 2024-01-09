import {Request} from 'express';
import * as URL from 'url';
import {UrlWithStringQuery} from 'url';
import queryString from 'query-string';
import {QueryFilterInterface, QueryUrl} from "@/interfaces/query.filter.interface";
import {changeKeyObject, convertSignType} from "@/utils/parse.str.helper";

export class QueryFilter implements QueryFilterInterface {

  private _sort: string;
  private _order: string;
  private _page: number;
  private _limit: number;
  private _foreignKey: number;
  private _whereStatement: object;
  protected operatorMap: object;
  protected cloumnMap: object;
  protected safeParms: object;

  constructor() {
    this._sort = 'id';
    this._order = 'DESC';
    this._page = 1;
    this._limit = 10;
    this._foreignKey = 0;
    this.operatorMap = {
      gt: '>',
      gte: '>=',
      lt: '<',
      lte: '<=',
      eq: '=',
      ne: '!=',
      lik: '%',
    };
    this.safeParms = {};
    this.cloumnMap = {};
    this._whereStatement = {};
  }

  navigation(request: Request): this {

    const uri: UrlWithStringQuery = URL.parse(request.url);
    const parseUri: QueryUrl = queryString.parse(uri.query);

    this._sort = parseUri.sort ?? 'id';
    this._order = parseUri.order ?? 'DESC';
    this._filed = parseUri.filed ?? '';
    this._page = parseUri.page ? +parseUri.page : 1;
    this._limit = parseUri.limit ? +parseUri.limit : 10;
    this._foreignKey = parseUri.foreignKey ? +parseUri.foreignKey : 0;
    return this;
  }

  transform(request: Request): this {
    const uri: UrlWithStringQuery = URL.parse(request.url);
    const queryObject = queryString.parse(uri.query);

    for (const parm in this.safeParms) {
      const operators = this.safeParms[parm];
      const column = this.cloumnMap[parm] ?? parm;
      for (const operator in operators) {
        if (queryObject[`${column}[${operators[operator]}]`]) {
          const sign = this.operatorMap[operators[operator]];
          const value = queryObject[`${column}[${operators[operator]}]`];
          let obj: any = {$$$: null};
          obj = changeKeyObject(obj, '"$$$"', '"' + column + '"');
          obj[column] = convertSignType(sign, value);
          this._whereStatement = {...this._whereStatement, ...obj};
        }
      }

    }


    return this;
  }

  get sort(): string {
    return this._sort;
  }

  get order(): string {
    return this._order;
  }


  get page(): number {
    return (this._page - 1) * this._limit;
  }

  get limit(): number {
    return this._limit;
  }

  get foreignKey(): number {
    return this._foreignKey;
  }

  get whereStatement(): object {
    return this._whereStatement;
  }
}
