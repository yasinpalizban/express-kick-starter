import request from 'supertest';
import App from '@/app';
import HomeRoute from '../routes/homeRoute';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Index', () => {
  describe('[GET] /', () => {
    it('response statusCode 200', () => {
      const indexRoute = new HomeRoute();

      const app = new App([indexRoute]);
      return request(app.getServer()).get(`${indexRoute.path}`).expect(200);
    });
  });
});
