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
import { ValidateMiddleware } from '../middleware/validate.middleware';
import { sign } from 'jsonwebtoken';
import { IConfigService } from '../config/config.service.interface';

@injectable()
export class UsersController extends BaseController implements IUserController {
  constructor(
    @inject(TYPES.ILogger) private loggerService: ILogger,
    @inject(TYPES.UserService) private userService: IUserService,
    @inject(TYPES.ConfigService) private configService: IConfigService,
  ) {
    super(loggerService);

    this.bindRoutes([
      {
        path: '/login',
        method: 'post',
        handler: this.login,
        middlewares: [new ValidateMiddleware(UserLoginDTO)],
      },
      {
        path: '/register',
        method: 'post',
        handler: this.register,
        middlewares: [new ValidateMiddleware(UserRegitserDTO)],
      },
      {
        path: '/info',
        method: 'get',
        handler: this.info,
      },
    ]);
  }

  async login({ body }: Request<{}, {}, UserLoginDTO>, res: Response, next: NextFunction) {
    const isValidUser = await this.userService.validateUser(body);

    if (!isValidUser) {
      return next(new HTTPError(401, 'Ошибка авторизации', 'login'));
    }

    const secret = this.configService.get<string>('SECRET');

    if (!secret) {
      throw new Error('can`t read secret env');
    }

    const jwt = await this.signJWT(body.email, secret);

    this.ok(res, {
      success: true,
      message: 'User Authorized',
      token: jwt,
    });
  }

  async register({ body }: Request<{}, {}, UserRegitserDTO>, res: Response, next: NextFunction) {
    const result = await this.userService.createUser(body);

    if (!result) {
      return next(new HTTPError(422, 'This user is exist'));
    }

    this.ok(res, {
      success: true,
      data: {
        id: result.id,
        email: result.email,
        name: result.name,
      },
    });
  }

  async info({ user }: Request<{}, {}, UserRegitserDTO>, res: Response, next: NextFunction) {
    if (!user) return next(new HTTPError(401, 'UnAuthorized'));

    const existedUser = await this.userService.getUser(user);

    if (!existedUser) return next(new HTTPError(422, 'User doen`t exist'));

    this.ok(res, {
      success: true,
      data: {
        id: existedUser.id,
        email: existedUser.email,
        name: existedUser.name,
      },
    });
  }

  private signJWT(email: string, secret: string): Promise<string> {
    return new Promise<string>((res, rej) => {
      sign(
        {
          email,
          iat: Math.floor(Date.now() / 1000),
        },
        secret,
        {
          algorithm: 'HS256',
        },
        (err, token) => {
          if (err) {
            rej(err);
          }

          res(token as string);
        },
      );
    });
  }
}
