import { Sequelize, DataTypes, Model } from 'sequelize';
import { IPermissionGroup } from '../interfaces/permission.group.interface';


export class GroupPermissionsModel extends Model<IPermissionGroup> implements IPermissionGroup {
  public id: number;
  actions: string;
  groupId: number;
  permissionId: number;
}

export function permissionGroupModel(sequelize: Sequelize): typeof GroupPermissionsModel {
  GroupPermissionsModel.init(
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
      groupId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: 'auth_groups_permissions',
      sequelize,
      timestamps: false,
    },
  );

  return GroupPermissionsModel;
}
