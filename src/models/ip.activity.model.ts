import {DataTypes, Model, Op, Sequelize} from 'sequelize';
import {IIpActivity} from '../interfaces/ip.activity.interface';

export class IpActivityModel extends Model<IIpActivity> implements IIpActivity {
  id?: number;
  userId: number;
  success: boolean;
  login: string;
  ipAddress: string;
  userAgent: string;
  type: string;
  date: Date;

  async keepLimitOfAttempts(trashHold: number): Promise<void> {

    const countAll = await IpActivityModel.count({col: 'id'});
    if (countAll > trashHold) {
      const lastId = await IpActivityModel.findOne({limit: 1, order: [['id', 'desc']]});
      const targetId = lastId.id - trashHold;
      await IpActivityModel.destroy({
        where: {
          id: {[ Op.lte]: targetId},
        },
      });
    }
  }

}

export function ipActivityModel(sequelize: Sequelize): typeof IpActivityModel {
  IpActivityModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      ipAddress: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      userAgent: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      type: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      login: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      date: {
        type: DataTypes.DATE,
      },
      success: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
    },
    {
      tableName: 'auth_logins',
      sequelize,
      timestamps: false,
    },
  );

  return IpActivityModel;
}
