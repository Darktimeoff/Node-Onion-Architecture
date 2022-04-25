import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from './middleware.interface';

export class ValidateMiddleware implements IMiddleware {
  constructor(private classToValidate: ClassConstructor<object>) {}

  execute({ body }: Request, res: Response, next: NextFunction): void {
    const instance = plainToInstance(this.classToValidate, body);

    validate(instance).then((errors) => {
      if (errors.length > 0) {
        const tmpErors = errors.map((e) => ({
          value: e.value,
          property: e.property,
          error: e.constraints ? Object.entries(e.constraints)[0][1] : null,
        }));

        res.status(422).send(tmpErors);
      } else {
        next();
      }
    });
  }
}
