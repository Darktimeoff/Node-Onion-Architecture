import { BaseController } from "../common/base.controller";
import { NextFunction, Request, Response } from "express";
import { HTTPError } from "../errors/http-error.class";
import { inject, injectable } from "inversify";
import { ILogger } from "../logger/logger.interface";
import { TYPES } from "../types";
import 'reflect-metadata';
import { IUserController } from "./users.controller.interface";

@injectable()
export class UsersController extends BaseController implements IUserController {
    constructor(
        @inject(TYPES.ILogger) private loggerService: ILogger
    ) {
        super(loggerService);

        this.bindRoutes([
            {
                path: '/login',
                method: 'post',
                handler: this.login,
            },
            {
                path: '/register',
                method: 'post',
                handler: this.register
            }
        ])
    }

    login(req: Request, res: Response) {
        this.ok(res, 'Loggin')
    }

    register(req: Request, res: Response, next: NextFunction) {
        next(new HTTPError(401, 'User unauthorized', 'register'))
        // this.ok(res, 'Register')
    }
}