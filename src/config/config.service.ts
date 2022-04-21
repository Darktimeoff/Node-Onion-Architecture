import { IConfigService } from './config.service.interface';
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { inject, injectable } from 'inversify';

@injectable()
export class ConfigService implements IConfigService {
  private config: DotenvParseOutput;

  constructor(@inject(TYPES.ILogger) private logger: ILogger) {
    const result: DotenvConfigOutput = config();
    if (result.error) {
      this.logger.error('Не удалось прочитать файл .env или он отсуствует');
    } else {
      this.logger.log('{ConfigService] Конфигурация .env загруженна');
      this.config = result.parsed as DotenvParseOutput;
    }
  }

  get<T extends string>(key: string): T | undefined {
    if (!(key in this.config)) {
      this.logger.warn(`Не удалось получить env[${key}]`);
      return undefined;
    }

    return this.config[key] as T;
  }
}
