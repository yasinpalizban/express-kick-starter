import {HttpException} from '../exceptions/HttpException';
import {isEmpty} from '../utils/is.empty';
import {StatusCodes} from 'http-status-codes';
import {default as i18n} from 'i18next';
import {ServiceInterface} from '../interfaces/service.interface';
import {IGroup, IGroupPagination} from '../interfaces/group.interface';
import DB from '@/databases/database';
import {GroupEntity} from '@/entities/group.entity';
import {GroupFilter} from "@/filters/group.filter";
import {IPagination} from "@/interfaces/pagination";
import {paginationFields} from "@/utils/pagntaion.fields";

export default class GroupService implements ServiceInterface {
  public groupModel = DB.group;

  public async index(groupFilter: GroupFilter): Promise<IGroupPagination> {

    const select = isEmpty(groupFilter.filed) ? null : groupFilter.filed;

    const {count, rows} = await this.groupModel.findAndCountAll({
      limit: groupFilter.limit,
      offset: groupFilter.page,
      order: [[groupFilter.sort, groupFilter.order]],
      attributes: select,
      where: groupFilter.whereStatement

    });
    const paginate: IPagination = paginationFields(groupFilter.limit, groupFilter.page, count);
    return {data: rows, pagination: paginate};
  }

  public async show(id: number): Promise<IGroup> {
    if (isEmpty(id)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.validation'));
    const dataById: IGroup = await this.groupModel.findOne({where: {id: id}});
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

    await this.groupModel.update(groupEntity, {where: {id: id}});
  }

  public async delete(id: number): Promise<void> {
    if (isEmpty(id)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.reject'));

    await this.groupModel.destroy({where: {id: id}});
  }
}
