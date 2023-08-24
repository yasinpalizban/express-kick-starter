import { HttpException } from '../exceptions/HttpException';
import { isEmpty } from '../utils/is.empty';
import { StatusCodes } from 'http-status-codes';
import { default as i18n } from 'i18next';
import { ServiceInterface } from '../interfaces/service.interface';
import { UrlAggression } from '../libraries/urlAggression';
import { AggregatePipeLine } from '../interfaces/urlAggressionInterface';
import { PermissionUserEntity } from '@/entities/permission.user.entity';
import { IPermissionUser, IPermissionUserPagination } from '@/interfaces/permission.user.interface';
import DB from '@/databases/database';
import { Op, Sequelize } from 'sequelize';

export default class PermissionUserService implements ServiceInterface {
  public permissionUserModel = DB.permissionUser;
  private nestId: number;

  constructor() {
    this.nestId = 0;
  }

  public setNestId(id: number) {
    this.nestId = id;
    return this;
  }

  public async index(urlQueryParam: UrlAggression): Promise<IPermissionUserPagination> {
    const defaultPipeline: AggregatePipeLine = {
      attributes: [
        'id',
        'actions',
        'userId',
        'permissionId',
        [Sequelize.literal('`PermissionsModel`.`name`'), 'permission'],
        [Sequelize.literal('`UserModel`.`last_name`'), 'lastName'],
        [Sequelize.literal('`UserModel`.`first_name`'), 'firstName'],
        [Sequelize.literal('`UserModel`.`username`'), 'username'],
      ],
      include: [
        {
          model: DB.permission,
          attributes: [],
        },
        {
          model: DB.users,
          attributes: [],
        },
      ],
    };
    if (this.nestId != 0) {
      defaultPipeline.where = { permissionId: this.nestId };
    }
    const pipeLine: AggregatePipeLine = urlQueryParam.decodeQueryParam().getPipeLine(defaultPipeline);
    const { data, pagination }: IPermissionUserPagination = await this.permissionUserModel.prototype.aggregatePagination(this.permissionUserModel.name, pipeLine);
    return { data, pagination };
  }

  public async show(id: number): Promise<IPermissionUser[]> {
    if (isEmpty(id)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.validation'));

    const data: IPermissionUser[] = await this.permissionUserModel.findAll({
      where: { id: id },
      attributes: [
        'id',
        'actions',
        'userId',
        'permissionId',
        [Sequelize.literal('`PermissionsModel`.`name`'), 'permission'],
        [Sequelize.literal('`UserModel`.`last_name`'), 'lastName'],
        [Sequelize.literal('`UserModel`.`first_name`'), 'firstName'],
        [Sequelize.literal('`UserModel`.`username`'), 'username'],
      ],

      raw: true,
      include: [
        {
          model: DB.permission,
          attributes: [],
        },
        {
          model: DB.users,
          attributes: [],
        },
      ],
    });

    if (!data) throw new HttpException(StatusCodes.CONFLICT, i18n.t('api.commons.exist'));

    return data;
  }

  public async create(userPermissionEntity: PermissionUserEntity): Promise<void> {
    if (isEmpty(userPermissionEntity)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.validation'));

    const createData: IPermissionUser = await this.permissionUserModel.create(userPermissionEntity);
    if (!createData) throw new HttpException(StatusCodes.CONFLICT, i18n.t('api.commons.reject'));
  }

  public async update(id: number, userPermissionEntity: PermissionUserEntity): Promise<void> {
    if (isEmpty(userPermissionEntity) && isEmpty(id)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.validation'));
    await this.permissionUserModel.update(userPermissionEntity, { where: { id: id } });
  }

  public async delete(id: number): Promise<void> {
    if (isEmpty(id)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.reject'));

    await this.permissionUserModel.destroy({ where: { id: id } });
  }
}
