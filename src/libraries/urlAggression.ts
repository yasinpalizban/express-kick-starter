import {AggregatePipeLine, ISearch, QueryUrl, UrlAggressionInterface} from '../interfaces/urlAggressionInterface';
import {Request} from 'express';
import * as URL from 'url';
import {UrlWithStringQuery} from 'url';
import queryString from 'query-string';
import {SearchFunctionType} from '../enums/search.function';
import {changeKeyObject, convertFunctionType, convertSignType, parseString} from '../utils/parse.str.helper';
import {isEmpty} from '@/utils/is.empty';
import {Op} from 'sequelize';

export class UrlAggression implements UrlAggressionInterface {
  private _queryUrl: QueryUrl;

  private pipeLine: AggregatePipeLine;

  constructor(request: Request) {
    const uri: UrlWithStringQuery = URL.parse(request.url);
    const parseUri: QueryUrl = queryString.parse(uri.query);

    parseUri.sort = parseUri.sort ?? 'id';
    parseUri.order = parseUri.order ?? 'DESC';
    parseUri.filed = parseUri.filed ?? '';
    parseUri.page = parseUri.page ? +parseUri.page : 1;
    parseUri.limit = parseUri.limit ? +parseUri.limit : 10;
    parseUri.foreignKey = parseUri.foreignKey ? +parseUri.foreignKey : 0;

    if (parseUri.q) {
      parseUri.q = parseString(parseUri.q.toString());
      parseUri.q = queryString.parse(parseUri.q);
    }

    this._queryUrl = parseUri;
    this.pipeLine = { where: {}, include: [] };
  }

  public getPipeLine(defaultPipeline?: AggregatePipeLine): AggregatePipeLine {

    this.pipeLine.page = this._queryUrl.page;
    this.pipeLine.offset = (this._queryUrl.page - 1) * this._queryUrl.limit;
    this.pipeLine.limit = this._queryUrl.limit;

    if (this._queryUrl.sort) {
      this.pipeLine.order = [[this._queryUrl.sort, this._queryUrl.order]];
    }

    if (this.pipeLine.include?.length && !isEmpty(defaultPipeline)) {
      this.pipeLine.attributes = defaultPipeline.attributes;
      let counter = 0;
      for (const item of defaultPipeline.include) {
        for (const item2 of this.pipeLine.include) {
          if (item.model.name == item2.model) {
            defaultPipeline.include[counter].where = item2.where;
          }
        }
        counter++;
      }
      this.pipeLine.include = defaultPipeline.include;
    } else if (!isEmpty(defaultPipeline)) {
      this.pipeLine.attributes = defaultPipeline.attributes;
      this.pipeLine.include = defaultPipeline.include;
    }
    if (this._queryUrl.filed) {
      const combine: string[] = [];
      this._queryUrl.filed.split(',').forEach(item => {
        if (item != undefined) combine.push(item);
      });

      this.pipeLine.attributes = combine;
    }

    if (defaultPipeline?.where != undefined && this.pipeLine?.where != undefined) {
      this.pipeLine.where = {...defaultPipeline?.where, ...this.pipeLine?.where};
    } else if (defaultPipeline?.where != undefined && this.pipeLine?.where == undefined) {
      this.pipeLine.where = defaultPipeline?.where;
    }

    return this.pipeLine;
  }

  encodeQueryParam(key: string, value: string, $function: string, sign: string): string {
    let obj: any = {
      $$$: {
        val: value,
        fun: $function,
        sgn: sign,
      },
    };

    obj = changeKeyObject(obj, '"$$$"', '"' + key + '"');

    return 'q=' + encodeURIComponent(JSON.stringify(obj));
  }

  decodeQueryParam(): this {
    const arrayParams: any[] = isEmpty(this._queryUrl.q) ? [] : Object.entries(this._queryUrl.q);

    for (let i = 0; i < arrayParams.length; i++) {
      const key: string = arrayParams[i][0];

      const valueSearch: ISearch = JSON.parse(arrayParams[i][1]);

      if (valueSearch.jin) {
        //   where: { id: { [Op.gt]: 6 } }
        if (valueSearch?.sgn != undefined && valueSearch?.sgn != 'None') {
          let obj: any = {$$$: null};
          obj = changeKeyObject(obj, '"$$$"', '"' + key + '"');
          obj[key] = convertSignType(valueSearch.sgn, valueSearch.val);
          this.pipeLine.include = [{model: valueSearch.jin, where: obj}];
        } else {
          let obj: any = {$$$: null};
          obj = changeKeyObject(obj, '"$$$"', '"' + key + '"');
          obj[key] = valueSearch.val;
          this.pipeLine.include = [{model: valueSearch.jin, where: obj}];
        }
      } else if (convertFunctionType(valueSearch.fun) == SearchFunctionType.where) {
        //   where: { id: { [Op.gt]: 6 } }

        if (valueSearch?.sgn != undefined && valueSearch?.sgn != '=' && valueSearch?.sgn != 'None') {
          let obj: any = {$$$: null};
          obj = changeKeyObject(obj, '"$$$"', '"' + key + '"');
          obj[key] = convertSignType(valueSearch.sgn, valueSearch.val);
          ;
          this.pipeLine.where = obj;
        } else {
          let obj: any = {$$$: null};
          obj = changeKeyObject(obj, '"$$$"', '"' + key + '"');
          obj[key] = valueSearch.val;
          this.pipeLine.where = obj;
        }
      } else if (convertFunctionType(valueSearch.fun) == SearchFunctionType.orWhere) {
        //   orWhere: { id: { [Op.gt]: 6 } }
        if (valueSearch?.sgn != undefined && valueSearch?.sgn != 'None') {
          let obj: any = {$$$: null};
          obj = changeKeyObject(obj, '"$$$"', '"' + key + '"');
          obj[key] = {[Op.or]: convertSignType(valueSearch.sgn, valueSearch.val)};
          this.pipeLine.where = obj;
        } else {
          let obj: any = {$$$: null};
          obj = changeKeyObject(obj, '"$$$"', '"' + key + '"');
          obj[key] = {[Op.or]: valueSearch.val};
          this.pipeLine.where = obj;
        }
      } else if (convertFunctionType(valueSearch.fun) == SearchFunctionType.whereIn) {
        //  where: { name: { [Op.in]: `%elliot%` } }
        console.log(valueSearch);
        let obj: any = {$$$: null};
        obj = changeKeyObject(obj, '"$$$"', '"' + key + '"');
        obj[key] = {[Op.in]: valueSearch.val};
        this.pipeLine.where = obj;
      } else if (convertFunctionType(valueSearch.fun) == SearchFunctionType.whereNoTIn) {
        //  where: { name: { [Op.in]:  } }

        let obj: any = {$$$: null};
        obj = changeKeyObject(obj, '"$$$"', '"' + key + '"');
        obj[key] = {[Op.notIn]: valueSearch.val};
        this.pipeLine.where = obj;
      } else if (convertFunctionType(valueSearch.fun) == SearchFunctionType.like) {
        //  where: { name: { [Op.like]: `%elliot%` } }
        let obj: any = {$$$: null};
        obj = changeKeyObject(obj, '"$$$"', '"' + key + '"');
        obj[key] = {[Op.like]: '%' + valueSearch.val + '%'};
        this.pipeLine.where = obj;
      }
    }

    return this;
  }

  public resetPipeLine(): this {
    this.pipeLine = {};
    return this;
  }

  public getForeignKey(): number {
    return this._queryUrl.foreignKey;
  }

  get queryUrl(): QueryUrl {
    return this._queryUrl;
  }

  set queryUrl(value: QueryUrl) {
    this._queryUrl = value;
  }
}
