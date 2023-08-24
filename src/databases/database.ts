
import Sequelize from 'sequelize';
import { logger } from '../utils/logger';
import { userModel } from '../models/users.model';
import { dbConfig } from '../interfaces/db.interface';
import { settingModel } from '../models/setting.model';
import { groupModel } from '../models/group.model';
import { userGroupModel } from '../models/user.group.model';
import { permissionModel } from '../models/permission.model';
import { permissionGroupModel } from '../models/group.permission.model';
import { permissionUserModel } from '../models/user.permission.model';
import { ipActivityModel } from '../models/ip.activity.model';

import { NODE_ENV, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE, DB_Pool_Max, DB_Pool_Min} from '../configs/config';
import { aggregationModel } from '../models/aggreation.model';

const sequelize = new Sequelize.Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
 // host: 'mysql' for docker compouse,
  host: DB_HOST,
  dialect: 'mysql',
  timezone: '+09:00',
  port: +DB_PORT,
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    underscored: true,
    freezeTableName: true,
  },
  pool: {
    min: +DB_Pool_Min,
    max: +DB_Pool_Max,
  },
  logQueryParameters: NODE_ENV === 'development',
  logging: (query, time) => {
    logger.info(time + 'ms' + ' ' + query);
  },
  benchmark: true,
});

sequelize.authenticate();

const DB = {
  aggregation: aggregationModel(sequelize),
  users: userModel(sequelize),
  setting: settingModel(sequelize),
  group: groupModel(sequelize),
  userGroup: userGroupModel(sequelize),
  permission: permissionModel(sequelize),
  permissionGroup: permissionGroupModel(sequelize),
  permissionUser: permissionUserModel(sequelize),
  ipActivity: ipActivityModel(sequelize),
  sequelize,  //connection instance (RAW queries)
  Sequelize, //library
};

DB.users.hasOne(DB.userGroup, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
DB.group.hasOne(DB.userGroup, { foreignKey: 'groupId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
DB.userGroup.belongsTo(DB.users, { foreignKey: 'userId' });
DB.userGroup.belongsTo(DB.group, { foreignKey: 'groupId' });

DB.permission.hasMany(DB.permissionUser, { foreignKey: 'permissionId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
DB.permission.hasMany(DB.permissionGroup, { foreignKey: 'permissionId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
DB.users.hasMany(DB.permissionUser, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
DB.group.hasMany(DB.permissionGroup, { foreignKey: 'groupId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
DB.permissionUser.belongsTo(DB.permission, { foreignKey: 'permissionId' });
DB.permissionUser.belongsTo(DB.users, { foreignKey: 'userId' });
DB.permissionGroup.belongsTo(DB.permission, { foreignKey: 'permissionId' });
DB.permissionGroup.belongsTo(DB.group, { foreignKey: 'groupId' });

export default DB;
