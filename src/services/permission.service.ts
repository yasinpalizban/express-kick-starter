import { HttpException } from '../exceptions/HttpException';
import { isEmpty } from '../utils/is.empty';
import { StatusCodes } from 'http-status-codes';
import { default as i18n } from 'i18next';
import { IPermission, IPermissionPagination } from '../interfaces/permission.interface';
import { ServiceInterface } from '../interfaces/service.interface';
import { UrlAggression } from '../libraries/urlAggression';
import { AggregatePipeLine } from '../interfaces/urlAggressionInterface';
import DB from '@/databases/database';
import { PermissionEntity } from '@/entities/permission.entity';

export default class PermissionService implements ServiceInterface {
  public permissionModel = DB.permission;

  public async index(urlQueryParam: UrlAggression): Promise<IPermissionPagination> {
    const pipeLine: AggregatePipeLine = urlQueryParam.decodeQueryParam().getPipeLine();
    const { data, pagination }: IPermissionPagination = await this.permissionModel.prototype.aggregatePagination(this.permissionModel.name, pipeLine);
    return { data, pagination };
  }

  public async show(id: number): Promise<IPermission[]> {
    if (isEmpty(id)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.validation'));

    const dataById: IPermission[] = await this.permissionModel.findAll({ where: { id: id } });
    if (!dataById) throw new HttpException(StatusCodes.CONFLICT, i18n.t('api.commons.exist'));
    return dataById;
  }

  public async create(permissionEntity: PermissionEntity): Promise<void> {
    if (isEmpty(permissionEntity)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.validation'));

    const createData: IPermission = await this.permissionModel.create(permissionEntity);

    if (!createData) throw new HttpException(StatusCodes.CONFLICT, i18n.t('api.commons.reject'));
  }

  public async update(id: number, permissionEntity: PermissionEntity): Promise<void> {
    if (isEmpty(permissionEntity)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.validation'));

    await this.permissionModel.update(permissionEntity, { where: { id: id } });
  }

  public async delete(id: number): Promise<void> {
    if (isEmpty(id)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.reject'));

    await this.permissionModel.destroy({ where: { id: id } });
  }
}
