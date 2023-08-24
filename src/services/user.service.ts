import { HttpException } from '../exceptions/HttpException';
import { isEmpty } from '../utils/is.empty';
import { StatusCodes } from 'http-status-codes';
import { default as i18n } from 'i18next';
import { UserEntity } from '../entities/user.entity';
import { IUser, IUserPagination } from '../interfaces/user.interface';
import { ServiceInterface } from '../interfaces/service.interface';
import { UrlAggression } from '../libraries/urlAggression';
import { AggregatePipeLine } from '../interfaces/urlAggressionInterface';
import DB from '@/databases/database';
import { IUserGroup } from '@/interfaces/group.user.interface';
import Sequelize from 'sequelize';

export default class UserService implements ServiceInterface {
  public userModel = DB.users;
  public userGroupModel = DB.userGroup;

  public async index(urlQueryParam: UrlAggression): Promise<IUserPagination> {
    const defaultPipeline: AggregatePipeLine = {
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
    };

    const pipeLine: AggregatePipeLine = urlQueryParam.decodeQueryParam().getPipeLine(defaultPipeline);
    const { data, pagination }: IUserPagination = await this.userGroupModel.prototype.aggregatePagination(this.userGroupModel.name, pipeLine);
    return { data, pagination };
  }

  public async show(id: number): Promise<IUser[]> {
    if (isEmpty(id)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.reject'));
    const defaultPipeline: AggregatePipeLine = {
      where: { userId: id },
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
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const dataById: IUser = await this.userGroupModel.findOne(defaultPipeline);

    if (!dataById) throw new HttpException(StatusCodes.CONFLICT, i18n.t('api.commons.exist'));
    return [dataById];
  }

  public async create(userEntity: UserEntity): Promise<void> {
    if (isEmpty(userEntity)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.reject'));

    if (userEntity.email) {
      const isEmailUserValid: IUser = await this.userModel.findOne({ where: { email: userEntity.email } });
      if (isEmailUserValid) throw new HttpException(StatusCodes.CONFLICT, i18n.t('auth.youAreEmail'));
    }
    if (userEntity.phone) {
      const isPhoneUserValid: IUser = await this.userModel.findOne({ where: { phone: userEntity.phone } });
      if (isPhoneUserValid) throw new HttpException(StatusCodes.CONFLICT, i18n.t('auth.yourArePhone'));
    }
    const userRole: number = userEntity.groupId;
    delete userEntity.groupId;
    const createData: IUser = await this.userModel.create(userEntity);

    if (!createData) throw new HttpException(StatusCodes.CONFLICT, i18n.t('api.commons.reject'));
    await this.userGroupModel.create({ userId: createData.id, groupId: userRole });
  }

  public async update(id: number, userEntity: UserEntity): Promise<void> {
    if (isEmpty(userEntity)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.reject'));
    const userRole: number = userEntity.groupId;
    delete userEntity.groupId;

    const updateById = await this.userModel.update(userEntity, { where: { id: id } });
    if (!updateById) throw new HttpException(StatusCodes.CONFLICT, i18n.t('api.commons.reject'));
    const oldRole: IUserGroup = await this.userGroupModel.findOne({ where: { userId: id } });
    if (userRole != oldRole.groupId) {
      await this.userGroupModel.update({ groupId: userRole }, { where: { id: oldRole.id } });
    }

    await this.userModel.update(userEntity, { where: { id: id } });
  }

  public async delete(id: number): Promise<void> {
    if (isEmpty(id)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.reject'));

    await this.userModel.destroy({ where: { id: id } });
  }

  public async getCountItems(): Promise<number> {
    return await this.userModel.count({ col: 'id' });
  }
}
