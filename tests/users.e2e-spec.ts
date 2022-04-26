import { App } from '../src/app';
import { boot } from '../src/main';
import request from 'supertest';

let application: App;

beforeAll(async () => {
  const { app } = await boot;
  application = app;
});

describe('Users e2e', () => {
  it('Register - error', async () => {
    const res = await request(application.app).post('/users/register').send({
      email: 'yevhenii+3@devforth.io',
      name: 'Yevhenii',
      password: 'Darktime123',
    });
    expect(res.statusCode).toBe(422);
  });

  it('Register - success', async () => {
    const res = await request(application.app).post('/users/register').send({
      email: 'yevhenii+4@devforth.io',
      name: 'Yevhenii',
      password: 'Darktime',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toEqual({
      id: 9,
      email: 'yevhenii+4@devforth.io',
      name: 'Yevhenii',
    });
  });
});

afterAll(() => {
  application.close();
});
