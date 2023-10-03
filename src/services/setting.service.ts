import {HttpException} from '../exceptions/HttpException';
import {isEmpty} from '../utils/is.empty';
import {StatusCodes} from 'http-status-codes';
import {default as i18n} from 'i18next';
import {ISetting} from '../interfaces/setting.interface';
import {ServiceInterface} from '../interfaces/service.interface';
import DB from '@/databases/database';
import {SettingEntity} from '../entities/setting.entity';
import {SettingFilter} from "@/filters/setting.filter";
import {IPagination} from "@/interfaces/pagination";
import {paginationFields} from "@/utils/pagntaion.fields";
import {IPaginateResponse} from "@/interfaces/paginate.response";

export default class SettingService implements ServiceInterface {
  public settingModel = DB.setting;

  public async index(settingFilter: SettingFilter): Promise<IPaginateResponse<ISetting>> {
    const select = isEmpty(settingFilter.filed) ? null : settingFilter.filed;

    const { count, rows } = await this.settingModel.findAndCountAll({
      limit: settingFilter.limit,
      offset: settingFilter.page,
      order: [[settingFilter.sort, settingFilter.order]],
      attributes: select,
      where: settingFilter.whereStatement,

    });
    const paginate: IPagination = paginationFields(settingFilter.limit, settingFilter.page, count);
    return { data: rows, pagination: paginate };
  }

  public async show(id: number): Promise<ISetting> {
    if (isEmpty(id)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.validation'));
    const dataById: ISetting = await this.settingModel.findOne({where: {id: id}});
    if (!dataById) throw new HttpException(StatusCodes.CONFLICT, i18n.t('api.commons.exist'));
    return dataById;
  }

  public async create(settingEntity: SettingEntity): Promise<void> {
    if (isEmpty(settingEntity)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.validation'));


    const createData: ISetting = await this.settingModel.create(settingEntity);
    if (!createData) throw new HttpException(StatusCodes.CONFLICT, i18n.t('api.commons.reject'));
  }

  public async update(id: number, settingEntity: SettingEntity): Promise<void> {
    if (isEmpty(settingEntity)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.reject'));

    await this.settingModel.update(settingEntity, {where: {id: id}});
  }

  public async delete(id: number): Promise<void> {
    if (isEmpty(id)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.reject'));

    await this.settingModel.destroy({where: {id: id}});
  }
}
