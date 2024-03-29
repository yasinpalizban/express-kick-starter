import bcrypt from 'bcrypt';
import { Sequelize } from 'sequelize';
import request from 'supertest';
import App from '@/app';
import AuthRoute from '../routes/auth.route';
import { AuthTestValidation } from '@/validations/auth.test.validation';
import DB from '@/databases/database';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Auth', () => {
  describe('[POST] /signup', () => {
    it('response should have the Create userData', async () => {
      const userData: AuthTestValidation = {
        email: 'test@email.com',
        password: 'q1w2e3r4!',
        phone: '09186151344',
        userName: 'yasin',
      };

      const authRoute = new AuthRoute();
      //const users = authRoute.authController.authService.users;
      const users = DB.users;
      users.findOne = jest.fn().mockReturnValue(null);
      users.create = jest.fn().mockReturnValue({
        id: 1,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
      });

      (Sequelize as any).authenticate = jest.fn();
      const app = new App([authRoute]);
      return request(app.getServer()).post(`${authRoute.pathNested}signup`).send(userData).expect(201);
    });
  });

  describe('[POST] /login', () => {
    it('response should have the Set-Cookie header with the Authorization token', async () => {
      const userData: AuthTestValidation = {
        email: 'test@email.com',
        password: 'q1w2e3r4!',
        phone: '09186151344',
        userName: 'yasin',
      };

      const authRoute = new AuthRoute();
      //  const users = authRoute.authController.authService.users;
      const users = DB.users;
      users.findOne = jest.fn().mockReturnValue({
        id: 1,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
      });

      (Sequelize as any).authenticate = jest.fn();
      const app = new App([authRoute]);
      return request(app.getServer())
        .post(`${authRoute.pathNested}login`)
        .send(userData)
        .expect('Set-Cookie', /^Authorization=.+/);
    });
  });

  // describe('[POST] /logout', () => {
  //   it('logout Set-Cookie Authorization=; Max-age=0', async () => {
  //     const authRoute = new AuthRoute();

  //     const app = new App([authRoute]);
  //     return request(app.getServer())
  //       .post(`${authRoute.path}logout`)
  //       .expect('Set-Cookie', /^Authorization=\;/);
  //   });
  // });
});
