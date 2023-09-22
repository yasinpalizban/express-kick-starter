import {HttpException} from '../exceptions/HttpException';
import {isEmpty} from '../utils/is.empty';
import {StatusCodes} from 'http-status-codes';
import {default as i18n} from 'i18next';
import {UserEntity} from '../entities/user.entity';
import {IUser, IUserPagination} from '../interfaces/user.interface';
import {ServiceInterface} from '../interfaces/service.interface';
import DB from '@/databases/database';
import {IUserGroup} from '@/interfaces/group.user.interface';
import Sequelize from 'sequelize';
import {UserFilter} from "@/filters/user.filter";
import {IPagination} from "@/interfaces/pagination";
import {paginationFields} from "@/utils/pagntaion.fields";

export default class UserService implements ServiceInterface {
  public userModel = DB.users;
  public userGroupModel = DB.userGroup;

  public async index(userFilter: UserFilter): Promise<IUserPagination> {

    const select = isEmpty(userFilter.filed) ? [
      [Sequelize.literal('`UserModel`.`id`'), 'id'],
      [Sequelize.literal('`UserModel`.`username`'), 'username'],
      [Sequelize.literal('`UserModel`.`email`'), 'email'],
      [Sequelize.literal('`UserModel`.`phone`'), 'phone'],
      [Sequelize.literal('`UserModel`.`last_name`'), 'lastName'],
      [Sequelize.literal('`UserModel`.`first_name`'), 'firstName'],
      [Sequelize.literal('`UserModel`.`image`'), 'image'],
      [Sequelize.literal('`UserModel`.`gender`'), 'gender'],
      [Sequelize.literal('`UserModel`.`birthday`'), 'birthday'],
      [Sequelize.literal('`UserModel`.`country`'), 'country'],
      [Sequelize.literal('`UserModel`.`address`'), 'address'],
      [Sequelize.literal('`UserModel`.`phone`'), 'phone'],
      [Sequelize.literal('`UserModel`.`status`'), 'status'],
      [Sequelize.literal('`UserModel`.`status_message`'), 'statusMessage'],
      [Sequelize.literal('`UserModel`.`active`'), 'active'],
      [Sequelize.literal('`UserModel`.`created_at`'), 'createdAt'],
      [Sequelize.literal('`UserModel`.`updated_at`'), 'updatedAt'],
      [Sequelize.literal('`UserModel`.`deleted_at`'), 'deletedAt'],
      [Sequelize.literal('`GroupModel`.`name`'), 'group'],
    ] : userFilter.filed;
    let roleUser;
    if (userFilter.foreignKey) {
      roleUser = {id: userFilter.foreignKey};
    }



    const {count, rows} = await this.userGroupModel.findAndCountAll({
      limit: userFilter.limit,
      offset: userFilter.page,
      order: [[userFilter.sort, userFilter.order]],
      attributes: select,
      include: [
        {
          model: DB.users,
          attributes: [],
          where: userFilter.whereStatement,
        },
        {
          model: DB.group,
          attributes: [],
          where:roleUser
        },
      ]
    });
    const paginate: IPagination = paginationFields(userFilter.limit, userFilter.page, count);
    return {data: rows, pagination: paginate};
  }

  public async show(id: number): Promise<IUser> {
    if (isEmpty(id)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.reject'));


    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const dataById: IUser = await this.userGroupModel.findOne({
      where: {userId: id},
      attributes: [
        [Sequelize.literal('`UserModel`.`id`'), 'id'],
        [Sequelize.literal('`UserModel`.`username`'), 'username'],
        [Sequelize.literal('`UserModel`.`email`'), 'email'],
        [Sequelize.literal('`UserModel`.`phone`'), 'phone'],
        [Sequelize.literal('`UserModel`.`last_name`'), 'lastName'],
        [Sequelize.literal('`UserModel`.`first_name`'), 'firstName'],
        [Sequelize.literal('`UserModel`.`image`'), 'image'],
        [Sequelize.literal('`UserModel`.`gender`'), 'gender'],
        [Sequelize.literal('`UserModel`.`birthday`'), 'birthday'],
        [Sequelize.literal('`UserModel`.`country`'), 'country'],
        [Sequelize.literal('`UserModel`.`address`'), 'address'],
        [Sequelize.literal('`UserModel`.`phone`'), 'phone'],
        [Sequelize.literal('`UserModel`.`status`'), 'status'],
        [Sequelize.literal('`UserModel`.`status_message`'), 'statusMessage'],
        [Sequelize.literal('`UserModel`.`active`'), 'active'],
        [Sequelize.literal('`UserModel`.`created_at`'), 'createdAt'],
        [Sequelize.literal('`UserModel`.`updated_at`'), 'updatedAt'],
        [Sequelize.literal('`UserModel`.`deleted_at`'), 'deletedAt'],
        [Sequelize.literal('`GroupModel`.`name`'), 'group'],
        [Sequelize.literal('`GroupModel`.`id`'), 'groupId'],
      ],
      include: [
        {
          model: DB.users,
          attributes: [],
        },
        {
          model: DB.group,
          attributes: [],
        },
      ],
    });

    if (!dataById) throw new HttpException(StatusCodes.CONFLICT, i18n.t('api.commons.exist'));
    return dataById;
  }

  public async create(userEntity: UserEntity): Promise<void> {
    if (isEmpty(userEntity)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.reject'));

    if (userEntity.email) {
      const isEmailUserValid: IUser = await this.userModel.findOne({where: {email: userEntity.email}});
      if (isEmailUserValid) throw new HttpException(StatusCodes.CONFLICT, i18n.t('auth.youAreEmail'));
    }
    if (userEntity.phone) {
      const isPhoneUserValid: IUser = await this.userModel.findOne({where: {phone: userEntity.phone}});
      if (isPhoneUserValid) throw new HttpException(StatusCodes.CONFLICT, i18n.t('auth.yourArePhone'));
    }
    const userRole: number = userEntity.groupId;
    delete userEntity.groupId;
    const createData: IUser = await this.userModel.create(userEntity);

    if (!createData) throw new HttpException(StatusCodes.CONFLICT, i18n.t('api.commons.reject'));
    await this.userGroupModel.create({userId: createData.id, groupId: userRole});
  }

  public async update(id: number, userEntity: UserEntity): Promise<void> {
    if (isEmpty(userEntity)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.reject'));
    const userRole: number = userEntity.groupId;
    delete userEntity.groupId;

    const updateById = await this.userModel.update(userEntity, {where: {id: id}});
    if (!updateById) throw new HttpException(StatusCodes.CONFLICT, i18n.t('api.commons.reject'));
    const oldRole: IUserGroup = await this.userGroupModel.findOne({where: {userId: id}});
    if (userRole != oldRole.groupId) {
      await this.userGroupModel.update({groupId: userRole}, {where: {id: oldRole.id}});
    }

    await this.userModel.update(userEntity, {where: {id: id}});
  }

  public async delete(id: number): Promise<void> {
    if (isEmpty(id)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.reject'));

    await this.userModel.destroy({where: {id: id}});
  }

  public async getCountItems(): Promise<number> {
    return await this.userModel.count({col: 'id'});
  }
}
