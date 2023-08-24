import { Sequelize, DataTypes, Model } from 'sequelize';
import { IGroup } from '../interfaces/group.interface';

import { UserGroupModel } from './user.group.model';
import {AggregationModel} from "@/models/aggreation.model";

export class GroupModel extends AggregationModel implements IGroup {
  public id: number;
  public name: string;
  public description: string;

  async getUserForGroup(id: number): Promise<IGroup> {
    return await GroupModel.findOne({
      include: [
        {
          model: UserGroupModel,
          where: { userId: id },
          attributes: [],
        },
      ],
    });
  }
}

export function groupModel(sequelize: Sequelize): typeof GroupModel {
  GroupModel.init(
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
        allowNull: true,
        type: DataTypes.STRING(255),
      },
    },
    {
      tableName: 'auth_groups',
      sequelize,
      timestamps: false,
    },
  );


  return GroupModel;
}
