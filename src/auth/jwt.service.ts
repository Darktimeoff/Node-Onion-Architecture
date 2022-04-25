import { injectable } from 'inversify';
import { sign, verify } from 'jsonwebtoken';
import { IJWTService } from './jwt.service.interface';

@injectable()
export class JWTService implements IJWTService {
  signJWT(email: string, secret: string): Promise<string> {
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

  verify<T>(token: string, secret: string): Promise<T> {
    return new Promise<T>((res, rej) => {
      verify(token, secret, (err, payload) => {
        if (err) {
          rej(err);
        } else if (payload) {
          res(payload as T);
        }
      });
    });
  }
}
