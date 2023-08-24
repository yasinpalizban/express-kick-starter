import { Seeder } from '../libraries/seeder';
import DB from '../databases/database';
import { PermissionUserEntity } from '../entities/permission.user.entity';

/*
 *  in order to seeder work perfectly out he box
 * you need import exact path  avoid using aliases path  for import file
 *
 *  cmd : npm run seeder --seed=../../auth/seeders/permission.user.seeder.ts
 *  */

export default class PermissionUserSeeder extends Seeder {
  public model = DB.permissionUser;

  async run(): Promise<void> {
    const dataSeeder = [
      new PermissionUserEntity({
        id: 1,
        permissionId: 2,
        userId: 1,
        actions: 'get-post-put-delete',
      }),
      new PermissionUserEntity({
        id: 2,
        permissionId: 3,
        userId: 1,
        actions: 'get-post-put-delete',
      }),
      new PermissionUserEntity({
        id: 3,
        permissionId: 4,
        userId: 1,
        actions: 'get-post-put-delete',
      }),
      new PermissionUserEntity({
        id: 4,
        permissionId: 5,
        userId: 1,
        actions: 'get-post-put-delete',
      }),
      new PermissionUserEntity({
        id: 5,
        permissionId: 6,
        userId: 1,
        actions: 'get-post-put-delete',
      }),
    ];
    await this.model.bulkCreate(dataSeeder);
  }
}
