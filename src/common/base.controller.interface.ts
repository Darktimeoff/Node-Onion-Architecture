import { Router } from 'express';
import { Response } from 'express';

export interface IBaseController {
  router: Router;

  send: <T>(es: Response, code: number, message: T) => Response<any, Record<string, any>>;
  ok: <T>(res: Response, message: T) => void;
  created: (res: Response) => Response<any, Record<string, any>>;
}
