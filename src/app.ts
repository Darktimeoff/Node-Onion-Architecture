import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import 'reflect-metadata';
import { IUserController } from './users/users.controller.interface';
import { json } from 'body-parser';
import { IConfigService } from './config/config.service.interface';
import { IPrismaService } from './database/prisma.service.interface';
import { AuthMiddleware } from './middleware/auth.middleware';

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
    @inject(TYPES.ConfigService) private configService: IConfigService,
    @inject(TYPES.PrismaService) private prismaService: IPrismaService,
  ) {
    this.app = express();
  }

  public async init(): Promise<void> {
    this.useMiddleware();

    this.useRoutes();

    this.useExceptionFilter();

    await this.prismaService.connect();

    this.server = this.app.listen(this.port, this.host, () => {
      this.logger.log(`Server listen:http://${this.host}:${this.port}`);
    });
  }

  useRoutes(): void {
    this.app.use('/users', this.usersController.router);
  }

  useMiddleware(): void {
    this.app.use(json());

    const secret = this.configService.get<string>('SECRET');

    if (!secret) {
      throw new Error('Secret env is undefined');
    }

    const authMiddleware = new AuthMiddleware(secret);

    this.app.use(authMiddleware.execute.bind(authMiddleware));
  }

  useExceptionFilter(): void {
    this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }
}
