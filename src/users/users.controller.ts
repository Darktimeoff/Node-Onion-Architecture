import { BaseController } from "../common/base.controller";
import { NextFunction, Request, Response } from "express";
import { LoggerService } from "../logger/logger.service";
import { HTTPError } from "../errors/http-error.class";
export class UsersController extends BaseController {
    constructor(
        logger: LoggerService
    ) {
        super(logger);

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