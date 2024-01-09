import { HttpException } from '../exceptions/HttpException';
import { isEmpty } from '../utils/is.empty';
import { StatusCodes } from 'http-status-codes';
import { default as i18n } from 'i18next';
import { UserEntity } from '../entities/user.entity';
import { IUser } from '../interfaces/user';
import { ServiceInterface } from '../interfaces/service.interface';
import { deleteFile } from '../utils/delete.file';
import { authConfig } from '../configs/auth.config';
import { sharedConfig } from '../configs/shared.config';
import DB from '@/databases/database';

export default class ProfileService implements ServiceInterface<IUser> {
  public userModel = DB.users;

  public async show(id: number): Promise<IUser> {
    const findUser: IUser = await this.userModel.findByPk(id);
    if (!findUser) throw new HttpException(StatusCodes.CONFLICT, i18n.t('api.commons.exist'));

    return findUser;
  }

  public async update(id: number, userEntity: UserEntity): Promise<void> {
    if (isEmpty(userEntity)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.reject'));

    const findUser: IUser = await this.userModel.findByPk(id);
    if (!findUser) throw new HttpException(StatusCodes.CONFLICT, i18n.t('api.commons.exist'));

    const updateUserById = await this.userModel.update(userEntity, { where: { id: id } });

    if (!updateUserById) throw new HttpException(StatusCodes.CONFLICT, i18n.t('api.commons.reject'));
    if (findUser.image != authConfig.defaultUserProfile && userEntity.image !== undefined) await deleteFile(sharedConfig.appRoot + findUser.image);
  }
}
