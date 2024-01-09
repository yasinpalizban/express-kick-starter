import { faker } from '@faker-js/faker';
import { Seeder } from '../libraries/seeder';
import { RoleType } from '../enums/role.type.enum';
import { IUser } from '../interfaces/user';
import DB from '../databases/database';
import { UserEntity } from '../entities/user.entity';
import { IGroup } from '../interfaces/group';
/*
 *  in order to seeder work perfectly out he box
 * you need import exact path  avoid using aliases path  for import file
 *
 *  cmd : npm run seeder --seed=../../common/seeders/user.seeder.ts
 *  */

export default class UserSeeder extends Seeder {
  public model = DB.users;
  public userGroupModel = DB.userGroup;
  public groupModel = DB.group;

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  //default password is 1234
  async run(): Promise<void> {
    const randomRole: string = Object.values(RoleType)[this.getRandomInt(Object.values(RoleType).length)];

    const dataSeeder = new UserEntity({
      username: faker.internet.userName(),
      phone: faker.phone.phoneNumber(),
      email: faker.internet.email(),
      password: '$2b$10$urCbSxfTDjo8GTTfD1aDMeqd0wv3oQQz.XE0MJ3oQ7G4MYq..FaIy',
      lastName: faker.name.findName(),
      firstName: faker.name.lastName(),
      gender: faker.random.numeric()=='1',
      image: 'public/upload/profile/default-avatar.jpg',
      city: faker.address.city(),
      country: faker.address.country(),
      address: faker.address.streetAddress(),
      active: faker.datatype.boolean(),
      status: faker.datatype.boolean(),
      createdAt: faker.datatype.datetime(),
      title: faker.address.city(),
      bio: faker.lorem.paragraph(),
    });

    const newUser: IUser = await this.model.create(dataSeeder);
    const group: IGroup = await this.groupModel.findOne({ where: { name: RoleType.Member } });
    await this.userGroupModel.create({ userId: newUser.id, groupId: group.id });
  }
}
