import { HttpException } from '../exceptions/HttpException';
import { isEmpty } from '../utils/is.empty';
import { StatusCodes } from 'http-status-codes';
import { default as i18n } from 'i18next';
import { ServiceInterface } from '../interfaces/service.interface';
import DB from '@/databases/database';
import { IGraph } from '@/interfaces/graph.interface';
import { GraphEntity } from '@/entities/graph.entity';
import { Op } from 'sequelize';
import { getDateNow } from '@/utils/get.date.now';

import { getCountryList } from '@/utils/getCountry';

export default class GraphService implements ServiceInterface {


  public async index(): Promise<IGraph[]> {

    let data =[{
      name: 'x',
      value: 1
    }];;

    return data;
  }

  public async create(graphEntity: GraphEntity): Promise<void | IGraph[]> {
    if (isEmpty(graphEntity)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.validation'));

  let data =[{
    name: 'x',
    value: 1,
  }];;

    return data;
  }
}
