import { HttpException } from '../exceptions/HttpException';
import { isEmpty } from '../utils/is.empty';
import { StatusCodes } from 'http-status-codes';
import { default as i18n } from 'i18next';
import { ISetting, ISettingPagination } from '../interfaces/setting.interface';
import { ServiceInterface } from '../interfaces/service.interface';
import { UrlAggression } from '../libraries/urlAggression';
import { AggregatePipeLine } from '../interfaces/urlAggressionInterface';
import DB from '@/databases/database';
import { SettingEntity } from '../entities/setting.entity';

export default class SettingService implements ServiceInterface {
  public settingModel = DB.setting;

  public async index(urlQueryParam: UrlAggression): Promise<ISettingPagination> {
    const pipeLine: AggregatePipeLine = urlQueryParam.decodeQueryParam().getPipeLine();
    const { data, pagination }: ISettingPagination = await this.settingModel.prototype.aggregatePagination(this.settingModel.name, pipeLine);
    return { data, pagination };
  }

  public async show(id: number): Promise<ISetting[]> {
    if (isEmpty(id)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.validation'));
    const dataById: ISetting[] = await this.settingModel.findAll({ where: { id: id } });
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

    await this.settingModel.update(settingEntity, { where: { id: id } });
  }

  public async delete(id: number): Promise<void> {
    if (isEmpty(id)) throw new HttpException(StatusCodes.BAD_REQUEST, i18n.t('api.commons.reject'));

    await this.settingModel.destroy({ where: { id: id } });
  }
}
