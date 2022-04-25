import { verify } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { IMiddleware } from './middleware.interface';
import { JWTService } from '../auth/jwt.service';
import { IJWTService } from '../auth/jwt.service.interface';

export class AuthMiddleware implements IMiddleware {
  private jwtService: IJWTService;

  constructor(private secret: string) {
    this.jwtService = new JWTService();
  }

  async execute(req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      try {
        const payload = await this.jwtService.verify<{ email: string }>(token, this.secret);

        req.user = payload.email;

        next();
      } catch {
        next();
      }
    } else {
      next();
    }
  }
}
