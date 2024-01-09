import { Sequelize, DataTypes, Model } from 'sequelize';
import { IPermission } from '../interfaces/permission';


export class PermissionsModel extends Model<IPermission> implements IPermission {
  public id: number;
  public name: string;
  public description: string;
  public active: boolean;
}

export function permissionModel(sequelize: Sequelize): typeof PermissionsModel {
  PermissionsModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      description: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      active: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
    },
    {
      tableName: 'auth_permissions',
      sequelize,
      timestamps: false,
    },
  );

  return PermissionsModel;
}
