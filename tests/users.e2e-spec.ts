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

  it('Login - success', async () => {
    const res = await request(application.app).post('/users/login/').send({
      email: 'yevhenii+3@devforth.io',
      password: 'Darktime',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBeTruthy();
    expect(res.body.token).toBeDefined();
    expect(res.body.message).toBeDefined();
  });

  it('Login - error', async () => {
    const res = await request(application.app).post('/users/login/').send({
      email: 'yevhenii+3@devforth.io',
      password: 'Darktime123',
    });

    expect(res.statusCode).toBe(401);
  });

  it('Login - without email - error', async () => {
    const res = await request(application.app).post('/users/login/').send({
      password: 'Darktime123',
    });

    expect(res.statusCode).toBe(422);
  });

  it('Login - empty data - error', async () => {
    const res = await request(application.app).post('/users/login/').send({});

    expect(res.statusCode).toBe(422);
  });

  it('Info - success', async () => {
    const res = await request(application.app).post('/users/login/').send({
      email: 'yevhenii+3@devforth.io',
      password: 'Darktime',
    });

    const resInfo = await request(application.app)
      .get('/users/info/')
      .set('authorization', `Bearer ${res.body.token}`);

    expect(resInfo.statusCode).toBe(200);
    expect(resInfo.body.success).toBeTruthy();
    expect(resInfo.body.data).toEqual({
      id: 4,
      email: 'yevhenii+3@devforth.io',
      name: 'Yevhenii',
    });
  });

  it('Info - error', async () => {
    const resInfo = await request(application.app)
      .get('/users/info/')
      .set('authorization', `Bearer 1`);

    expect(resInfo.statusCode).toBe(401);
  });
});

afterAll(() => {
  application.close();
});
