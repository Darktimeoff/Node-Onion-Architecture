import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import 'reflect-metadata';
import { IUserController } from './users/users.controller.interface';
@injectable()
export class App {
  private port = 8000;
  private host = '127.0.0.1';
  private app: Express;
  private server: Server;

  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.UserController) private usersController: IUserController,
    @inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
  ) {
    this.app = express();
  }

  public async init(): Promise<void> {
    // this.useMiddleware();

    this.useRoutes();

    this.useExceptionFilter();

    this.server = this.app.listen(this.port, this.host, () => {
      this.logger.log(`Server listen:http://${this.host}:${this.port}`);
    });
  }

  useRoutes(): void {
    this.app.use('/users', this.usersController.router);
  }

  // useMiddleware(): void  {

  // }

  useExceptionFilter(): void {
    this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }
}
