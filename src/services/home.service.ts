import { HomeServiceInterface } from '@/interfaces/home.service.interface';
import DB from '@/databases/database';
import { AggregatePipeLine } from '@/interfaces/urlAggressionInterface';
import Sequelize from 'sequelize';

export class HomeService implements HomeServiceInterface {
  set language(value: string) {
    this._language = value;
  }

  private viewMediaModel = DB.viewMedia;
  private advertisementModel = DB.advertisement;
  private settingModel = DB.setting;
  private _language: string;

  constructor() {
    this._language = '';
  }

  async advertisements(): Promise<any> {
    let adsOne: any = await this.advertisementModel.findAll({ where: { name: 'advertisementOne' } });
    adsOne = await this.advertisementModel.prototype.appendChildrenRows(adsOne);
    let adsTwo: any = await this.advertisementModel.findAll({ where: { name: 'advertisementTwo' } });
    adsTwo = await this.advertisementModel.prototype.appendChildrenRows(adsTwo);
    let adsThree: any = await this.advertisementModel.findAll({ where: { name: 'advertisementThree' } });
    adsThree = await this.advertisementModel.prototype.appendChildrenRows(adsThree);
    return {
      sideOne: adsOne[0],
      sideTwo: adsTwo[0],
      sideThree: adsThree[0],
    };
  }

  async settings(): Promise<any> {
    return {
      facebook: await this.settingModel.findOne({ where: { key: 'facebook' } }),
      instagram: await this.settingModel.findOne({ where: { key: 'instagram' } }),
      twitter: await this.settingModel.findOne({ where: { key: 'twitter' } }),
      googlePlus: await this.settingModel.findOne({ where: { key: 'googlePlus' } }),
      phone: await this.settingModel.findOne({ where: { key: 'phone' } }),
      address: await this.settingModel.findOne({ where: { key: 'address' } }),
      email: await this.settingModel.findOne({ where: { key: 'email' } }),
      linkLocation: await this.settingModel.findOne({ where: { key: 'linkLocation' } }),
    };
  }

  async views(): Promise<any> {
    return {
      banner: await this.viewMediaModel.findAll({
        where: { language: this._language },
        attributes: [
          [Sequelize.literal('`ViewMediaModel`.`id`'), 'id'],
          [Sequelize.literal('`ViewMediaModel`.`title`'), 'title'],
          [Sequelize.literal('`ViewMediaModel`.`language`'), 'language'],
          [Sequelize.literal('`ViewMediaModel`.`description`'), 'description'],
          [Sequelize.literal('`ViewMediaModel`.`view_option_id`'), 'viewOptionId'],
          [Sequelize.literal('`ViewMediaModel`.`path`'), 'path'],
        ],
        include: [
          {
            model: DB.viewOption,
            attributes: [],
            where: {
              name: 'banner',
            },
          },
        ],
      }),
      restaurant: await this.viewMediaModel.findAll({
        where: { language: this._language },
        attributes: [
          [Sequelize.literal('`ViewMediaModel`.`id`'), 'id'],
          [Sequelize.literal('`ViewMediaModel`.`title`'), 'title'],
          [Sequelize.literal('`ViewMediaModel`.`language`'), 'language'],
          [Sequelize.literal('`ViewMediaModel`.`description`'), 'description'],
          [Sequelize.literal('`ViewMediaModel`.`view_option_id`'), 'viewOptionId'],
          [Sequelize.literal('`ViewMediaModel`.`path`'), 'path'],
        ],
        include: [
          {
            model: DB.viewOption,
            attributes: [],
            where: {
              name: 'restaurant',
            },
          },
        ],
      }),
      photo: await this.viewMediaModel.findAll({
        where: { language: this._language },
        attributes: [
          [Sequelize.literal('`ViewMediaModel`.`id`'), 'id'],
          [Sequelize.literal('`ViewMediaModel`.`title`'), 'title'],
          [Sequelize.literal('`ViewMediaModel`.`language`'), 'language'],
          [Sequelize.literal('`ViewMediaModel`.`description`'), 'description'],
          [Sequelize.literal('`ViewMediaModel`.`view_option_id`'), 'viewOptionId'],
          [Sequelize.literal('`ViewMediaModel`.`path`'), 'path'],
        ],
        include: [
          {
            model: DB.viewOption,
            attributes: [],
            where: {
              name: 'photo',
            },
          },
        ],
      }),
      about: await this.viewMediaModel.findAll({
        where: { language: this._language },
        attributes: [
          [Sequelize.literal('`ViewMediaModel`.`id`'), 'id'],
          [Sequelize.literal('`ViewMediaModel`.`title`'), 'title'],
          [Sequelize.literal('`ViewMediaModel`.`language`'), 'language'],
          [Sequelize.literal('`ViewMediaModel`.`description`'), 'description'],
          [Sequelize.literal('`ViewMediaModel`.`view_option_id`'), 'viewOptionId'],
          [Sequelize.literal('`ViewMediaModel`.`path`'), 'path'],
        ],
        include: [
          {
            model: DB.viewOption,
            attributes: [],
            where: {
              name: 'about',
            },
          },
        ],
      }),
    };
  }
}
