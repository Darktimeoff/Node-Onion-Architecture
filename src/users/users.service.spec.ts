import 'reflect-metadata';
import { UserModel } from '@prisma/client';
import { Container } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { User } from './user.entity';
import { IUserRepository } from './user.repository.interface';
import { IUserService } from './user.service.interface';
import { UserService } from './users.service';

const ConfigServiceMock: IConfigService = {
  get: jest.fn(),
};

const UserRepositoryMock: IUserRepository = {
  create: jest.fn(),
  find: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUserRepository;
let usersService: IUserService;

beforeAll(() => {
  container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
  container.bind<IUserRepository>(TYPES.UserRepository).toConstantValue(UserRepositoryMock);
  container.bind<IUserService>(TYPES.UserService).to(UserService);

  configService = container.get<IConfigService>(TYPES.ConfigService);
  usersRepository = container.get<IUserRepository>(TYPES.UserRepository);
  usersService = container.get<IUserService>(TYPES.UserService);
});

let createdUser: UserModel | null;

describe('User Service', () => {
  it('createUser', async () => {
    configService.get = jest.fn().mockReturnValueOnce('1');

    usersRepository.create = jest.fn().mockImplementationOnce(
      (user: User): UserModel => ({
        name: user.name,
        email: user.email,
        password: user.password,
        id: 1,
      }),
    );

    createdUser = await usersService.createUser({
      email: 'test@gmail.com',
      password: 'Test123',
      name: 'Anton',
    });

    expect(createdUser?.id).toBe(1);
    expect(createdUser?.password).not.toEqual('Test123');
  });
});
