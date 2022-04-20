import { Router, Response } from 'express';
import { IControllerRoute } from './route.interface';
import { ILogger } from '../logger/logger.interface';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { IBaseController } from './base.controller.interface';
@injectable()
export abstract class BaseController implements IBaseController {
  private readonly _router: Router;

  constructor(private logger: ILogger) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  public send<T>(res: Response, code: number, message: T) {
    res.type('application/json');
    return res.status(code).json(message);
  }

  public ok<T>(res: Response, message: T) {
    this.send<T>(res, 200, message);
  }

  public created(res: Response) {
    return res.sendStatus(201);
  }

  protected bindRoutes(routes: IControllerRoute[]) {
    routes.forEach((r) => {
      this.logger.log(`[${r.method}]:${r.path}`);

      const handler = r.handler.bind(this);
      const middlewares = r.middlewares?.map((m) => m.execute.bind(m));
      const pipeline = middlewares ? [...middlewares, handler] : handler;

      this.router[r.method](r.path, pipeline);
    });
  }
}
