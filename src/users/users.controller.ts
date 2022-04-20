import { BaseController } from '../common/base.controller';
import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../errors/http-error.class';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import 'reflect-metadata';
import { IUserController } from './users.controller.interface';
import { UserLoginDTO, UserRegitserDTO } from './dto';
import { IUserService } from './user.service.interface';
import { ValidateMiddleware } from '../common/validate.middleware';

@injectable()
export class UsersController extends BaseController implements IUserController {
  constructor(
    @inject(TYPES.ILogger) private loggerService: ILogger,
    @inject(TYPES.UserService) private userService: IUserService,
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
        handler: this.register,
        middlewares: [new ValidateMiddleware(UserRegitserDTO)],
      },
    ]);
  }

  login(req: Request<{}, {}, UserLoginDTO>, res: Response) {
    console.log(req.body);
    this.ok(res, 'Loggin');
  }

  async register({ body }: Request<{}, {}, UserRegitserDTO>, res: Response, next: NextFunction) {
    const result = await this.userService.createUser(body);

    if (!result) {
      return next(new HTTPError(422, 'This user is exist'));
    }

    this.ok(res, {
      success: true,
      data: {
        email: result.email,
        name: result.name,
      },
    });
  }
}
