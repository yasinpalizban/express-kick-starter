import { HttpException } from '../exceptions/HttpException';
import { isEmpty } from '../utils/is.empty';
import { StatusCodes } from 'http-status-codes';
import { default as i18n } from 'i18next';
import DB from '@/databases/database';
import { ServiceInterface } from '../interfaces/service.interface';
import { IPermissionGroup } from '../interfaces/permission.group.interface';

import { PermissionGroupEntity } from '@/entities/permission.group.entity';
import Sequelize, { Op } from 'sequelize';
import {PermissionGroupFilter} from "@/filters/permission.group.filter";
import {IPagination} from "@/interfaces/pagination";
import {paginationFields} from "@/utils/pagntaion.fields";
import {IPaginateResponse} from "@/interfaces/response.object";

export default class PermissionGroupService implements ServiceInterface {
  public permissionGroupModel = DB.permissionGroup;
  private nestId: number;

  constructor() {
    this.nestId = 0;
  }

  public setNestId(id: number) {
    this.nestId = id;
    return this;
  }

  public async index(permissionGroupFilter: PermissionGroupFilter): Promise<IPaginateResponse<IPermissionGroup>> {

    const whereCluase = (this.nestId != 0) ? {permissionId: this.nestId} : permissionGroupFilter.whereStatement;

    const select = isEmpty(permissionGroupFilter.filed) ? [
      'id',
      'actions',
      'groupId',
      'permissionId',
      [Sequelize.literal('`PermissionsModel`.`name`'), 'permission'],
      [Sequelize.literal('`GroupModel`.`name`'), 'group'],
    ] : permissionGroupFilter.filed;

    const {count, rows} = await this.permissionGroupModel.findAndCountAll({
      limit: permissionGroupFilter.limit,
      offset: permissionGroupFilter.page,
      order: [[permissionGroupFilter.sort, permissionGroupFilter.order]],
      attributes: select,
      where: whereCluase,
      include: [
        {
          model: DB.permission,
          attributes: [],
        },
        {
          model: DB.group,
          attributes: [],
        },
      ]

    });
    const paginate: IPagination = paginationFields(permissionGroupFilter.limit, permissionGroupFilter.page, count);
    return {data: rows, pagination: paginate};
  }

  public async show(id: number): Promise<IPermissionGroup> {
    if (isEmpty(id)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.validation'));

    const data: IPermissionGroup = await this.permissionGroupModel.findOne({
      where: { id: id },
      attributes: [
        'id',
        'actions',
        'groupId',
        'permissionId',
        [Sequelize.literal('`PermissionsModel`.`name`'), 'permission'],
        [Sequelize.literal('`GroupModel`.`name`'), 'group'],
      ],
      include: [
        {
          model: DB.permission,
          attributes: [],
        },
        {
          model: DB.group,
          attributes: [],
        },
      ],
    });

    if (!data) throw new HttpException(StatusCodes.CONFLICT, i18n.t('api.commons.exist'));
    return data;
  }

  public async create(groupPermissionEntity: PermissionGroupEntity): Promise<void> {
    if (isEmpty(groupPermissionEntity)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.validation'));
    const createData: IPermissionGroup = await this.permissionGroupModel.create(groupPermissionEntity);
    if (!createData) throw new HttpException(StatusCodes.CONFLICT, i18n.t('api.commons.reject'));
  }

  public async update(id: number, data: PermissionGroupEntity): Promise<void> {
    if (isEmpty(data) && isEmpty(id)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.validation'));
    await this.permissionGroupModel.update(data, { where: { id: id } });
  }

  public async delete(id: number): Promise<void> {
    if (isEmpty(id)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.reject'));
    await this.permissionGroupModel.destroy({ where: { id: id } });
  }
}
