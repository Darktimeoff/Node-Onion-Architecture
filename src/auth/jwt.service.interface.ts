export interface IJWTService {
  signJWT: (email: string, secret: string) => Promise<string>;
  verify: <T>(token: string, secret: string) => Promise<T>;
}
