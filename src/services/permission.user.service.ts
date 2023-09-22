import {HttpException} from '../exceptions/HttpException';
import {isEmpty} from '../utils/is.empty';
import {StatusCodes} from 'http-status-codes';
import {default as i18n} from 'i18next';
import {ServiceInterface} from '../interfaces/service.interface';
import {PermissionUserEntity} from '@/entities/permission.user.entity';
import {IPermissionUser, IPermissionUserPagination} from '@/interfaces/permission.user.interface';
import DB from '@/databases/database';
import {Sequelize} from 'sequelize';
import {PermissionUserFilter} from "@/filters/permission.user.filter";
import {IPagination} from "@/interfaces/pagination";
import {paginationFields} from "@/utils/pagntaion.fields";

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

  public async index(permissionUserFilter: PermissionUserFilter): Promise<IPermissionUserPagination> {

    const whereCluase = (this.nestId != 0) ? {permissionId: this.nestId} : permissionUserFilter.whereStatement;

    const select = isEmpty(permissionUserFilter.filed) ? [
      'id',
      'actions',
      'userId',
      'permissionId',
      [Sequelize.literal('`PermissionsModel`.`name`'), 'permission'],
      [Sequelize.literal('`UserModel`.`last_name`'), 'lastName'],
      [Sequelize.literal('`UserModel`.`first_name`'), 'firstName'],
      [Sequelize.literal('`UserModel`.`username`'), 'username'],
    ] : permissionUserFilter.filed;

    const {count, rows} = await this.permissionUserModel.findAndCountAll({
      limit: permissionUserFilter.limit,
      offset: permissionUserFilter.page,
      order: [[permissionUserFilter.sort, permissionUserFilter.order]],
      attributes: select,
      where: whereCluase,
      include: [
        {
          model: DB.permission,
          attributes: [],
        },
        {
          model: DB.users,
          attributes: [],
        },
      ]

    });
    const paginate: IPagination = paginationFields(permissionUserFilter.limit, permissionUserFilter.page, count);
    return {data: rows, pagination: paginate};

  }

  public async show(id: number): Promise<IPermissionUser> {
    if (isEmpty(id)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.validation'));

    const data: IPermissionUser = await this.permissionUserModel.findOne({
      where: {id: id},
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
    await this.permissionUserModel.update(userPermissionEntity, {where: {id: id}});
  }

  public async delete(id: number): Promise<void> {
    if (isEmpty(id)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.reject'));

    await this.permissionUserModel.destroy({where: {id: id}});
  }
}
