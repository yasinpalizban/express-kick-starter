import { HttpException } from '../exceptions/HttpException';
import { isEmpty } from '../utils/is.empty';
import { StatusCodes } from 'http-status-codes';
import { default as i18n } from 'i18next';
import { ServiceInterface } from '../interfaces/service.interface';
import { UrlAggression } from '../libraries/urlAggression';

import { IGroup, IGroupPagination } from '../interfaces/group.interface';
import { AggregatePipeLine } from '../interfaces/urlAggressionInterface';
import DB from '@/databases/database';
import { GroupEntity } from '@/entities/group.entity';

export default class GroupService implements ServiceInterface {
  public groupModel = DB.group;

  public async index(urlQueryParam: UrlAggression): Promise<IGroupPagination> {
    const pipeLine: AggregatePipeLine = urlQueryParam.decodeQueryParam().getPipeLine();
    const { data, pagination }: IGroupPagination = await this.groupModel.prototype.aggregatePagination(this.groupModel.name, pipeLine);
    return { data, pagination };
  }

  public async show(id: number): Promise<IGroup[]> {
    if (isEmpty(id)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.validation'));
    const dataById: IGroup[] = await this.groupModel.findAll({ where: { id: id } });
    if (!dataById) throw new HttpException(StatusCodes.CONFLICT, i18n.t('api.commons.exist'));
    return dataById;
  }

  public async create(groupEntity: GroupEntity): Promise<void> {
    if (isEmpty(groupEntity)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.validation'));

    const createData: IGroup = await this.groupModel.create(groupEntity);

    if (!createData) throw new HttpException(StatusCodes.CONFLICT, i18n.t('api.commons.reject'));
  }

  public async update(id: number, groupEntity: GroupEntity): Promise<void> {
    if (isEmpty(groupEntity)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.validation'));

    await this.groupModel.update(groupEntity, { where: { id: id } });
  }

  public async delete(id: number): Promise<void> {
    if (isEmpty(id)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.reject'));

    await this.groupModel.destroy({ where: { id: id } });
  }
}
