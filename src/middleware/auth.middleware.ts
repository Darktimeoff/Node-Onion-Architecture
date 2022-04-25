import { verify } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { IMiddleware } from './middleware.interface';

export class AuthMiddleware implements IMiddleware {
  constructor(private secret: string) {}

  async execute(req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      try {
        console.log('start excute');
        const payload = await new Promise<{ email: string }>((res, rej) => {
          verify(token, this.secret, (err, payload) => {
            if (err) {
              rej(err);
            } else if (payload) {
              res(payload as { email: string });
            }
          });
        });

        req.user = payload.email;

        console.log('end execute', req.user);

        next();
      } catch {
        next();
      }
    } else {
      next();
    }
  }
}
