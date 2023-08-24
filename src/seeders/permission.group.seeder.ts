import { Seeder } from '../libraries/seeder';
import DB from '../databases/database';
import { PermissionGroupEntity } from '../entities/permission.group.entity';

/*
 *  in order to seeder work perfectly out he box
 * you need import exact path  avoid using aliases path  for import file
 *
 *  cmd : npm run seeder --seed=../../auth/seeders/permission.group.seeder.ts
 *  */

export default class PermissionGroupSeeder extends Seeder {
  public model = DB.permissionGroup;
  async run(): Promise<void> {
    const dataSeeder = [
      new PermissionGroupEntity({
        id: 1,
        actions: 'get-',
        groupId: 1,
        permissionId: 1,
      }),
      new PermissionGroupEntity({
        id: 2,
        actions: 'get-post-put-delete',
        groupId: 1,
        permissionId: 2,
      }),
      new PermissionGroupEntity({
        id: 3,
        actions: 'get-',
        groupId: 1,
        permissionId: 3,
      }),
      new PermissionGroupEntity({
        id: 4,
        actions: 'get-',
        groupId: 1,
        permissionId: 4,
      }),
      new PermissionGroupEntity({
        id: 5,
        actions: 'get-',
        groupId: 1,
        permissionId: 5,
      }),
      new PermissionGroupEntity({
        id: 6,
        actions: 'get-',
        groupId: 1,
        permissionId: 6,
      }),
    ];
    await this.model.bulkCreate(dataSeeder);
  }
}
