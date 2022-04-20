import { ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { ExceptionFilter } from './errors/exception.filter';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { ILogger } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';
import { TYPES } from './types';
import { IUserService } from './users/user.service.interface';
import { UsersController } from './users/users.controller';
import { IUserController } from './users/users.controller.interface';
import { UserService } from './users/users.service';

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<ILogger>(TYPES.ILogger).to(LoggerService);
  bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
  bind<IUserController>(TYPES.UserController).to(UsersController);
  bind<IUserService>(TYPES.UserService).to(UserService);
  bind<App>(TYPES.Application).to(App);
});
