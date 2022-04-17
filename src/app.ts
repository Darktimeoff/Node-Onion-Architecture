import express, {Express, Request, Response} from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { UsersController } from './users/users.controller';
import 'reflect-metadata';
@injectable()
export class App {
    private port: number = 8000;
    private host: string = '127.0.0.1';
    private app: Express;
    private server: Server;

    constructor(
        @inject(TYPES.ILogger) private logger: ILogger,
        @inject(TYPES.UserController) private usersController: UsersController,
        @inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter
    ) {
        this.app = express()
    }

    public async init() {
        this.useMiddleware();

        this.useRoutes();

        this.useExceptionFilter();

        this.server = this.app.listen(this.port, this.host, () => {
            this.logger.log(`Server listen:http://${this.host}:${this.port}`)
        })
    }

    useRoutes() {
        this.app.use('/users', this.usersController.router)
    }

    useMiddleware() {

    }

    useExceptionFilter() {
        this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter))
    }
}