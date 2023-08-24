import { Sequelize, DataTypes, Model } from 'sequelize';
import { IPermissionUser } from '../interfaces/permission.user.interface';
import {AggregationModel} from "@/models/aggreation.model";

export class UserPermissionsModel extends AggregationModel implements IPermissionUser {
  id: number;
  actions: string;
  userId: number;
  permissionId: number;
}

export function permissionUserModel(sequelize: Sequelize): typeof UserPermissionsModel {
  UserPermissionsModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      actions: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      permissionId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: 'auth_users_permissions',
      sequelize,
      timestamps: false,
    },
  );

  return UserPermissionsModel;
}
