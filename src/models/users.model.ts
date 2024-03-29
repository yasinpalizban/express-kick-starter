import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { IUser } from '../interfaces/user';

export class UserModel extends Model<IUser> implements IUser {
  public id: number;
  public email: string;
  public username: string;
  public password: string;
  public phone: string;
  public firstName: string;
  public lastName: string;
  public image: string;
  public country: string;
  public city: string;
  public address: string;
  public gender: boolean;
  public active: boolean;
  public activeToken: string;
  public readonly activeExpires: Date;
  public status: boolean;
  public statusMessage: string;
  public resetToken: string;
  public bio: string;
  public title: string;
  public readonly resetExpires: Date;
  public readonly resetAt: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

export function userModel(sequelize: Sequelize): typeof UserModel {
  UserModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
      },
      username: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },
      phone: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      country: {
        allowNull: true,
        type: DataTypes.STRING(255),
      },
      city: {
        allowNull: true,
        type: DataTypes.STRING(255),
      },
      gender: {
        allowNull: true,
        type: DataTypes.TINYINT,
      },
      firstName: {
        allowNull: true,
        type: DataTypes.STRING(255),
      },
      lastName: {
        allowNull: true,
        type: DataTypes.STRING(255),
      },
      image: {
        allowNull: true,
        type: DataTypes.STRING(255),
      },
      active: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
      activeToken: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      activeExpires: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      status: {
        allowNull: true,
        type: DataTypes.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      resetAt: {
        allowNull: true,
        type: DataTypes.DATE,
      },

      resetExpires: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      resetToken: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      statusMessage: {
        allowNull: true,
        type: DataTypes.STRING(255),
      },
      address: {
        allowNull: true,
        type: DataTypes.STRING(255),
      },
      title: {
        allowNull: true,
        type: DataTypes.STRING(255),
      },
      bio: {
        allowNull: true,
        type: DataTypes.STRING(500),
      },
    },
    {
      tableName: 'users',
      sequelize,
    },
  );

  return UserModel;
}
