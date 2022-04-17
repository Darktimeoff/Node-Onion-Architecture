import express, {Express, Request, Response} from 'express';
import { Server } from 'http';
import { ExceptionFilter } from './errors/exception.filter';
import { ILogger } from './logger/logger.interface';
import { UsersController } from './users/users.controller';

export class App {
    private port: number = 8000;
    private host: string = '127.0.0.1';
    private app: Express;
    private server: Server;

    constructor(
        private logger: ILogger,
        private usersController: UsersController,
        private exceptionFilter: ExceptionFilter
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