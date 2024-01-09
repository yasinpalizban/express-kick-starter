import { HomeServiceInterface } from '@/interfaces/home.service.interface';
import DB from '@/databases/database';

export class HomeService implements HomeServiceInterface {
  set language(value: string) {
    this._language = value;
  }
  private settingModel = DB.setting;
  private _language: string;

  constructor() {
    this._language = '';
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

}
