import { PrismaClient, UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { IPrismaService } from './prisma.service.interface';

@injectable()
export class PrismaService implements IPrismaService {
  client: PrismaClient;

  constructor(@inject(TYPES.ILogger) private logger: ILogger) {
    this.client = new PrismaClient();
  }

  async connect(): Promise<void> {
    try {
      await this.client.$connect();
      this.logger.log('[PrismaService] connect to database');
    } catch (e) {
      if (e instanceof Error) {
        this.logger.error('[PrismaService] failed to connect', e.message);
      } else {
        this.logger.error('[PrismaService] failed to connect');
      }
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.client.$disconnect();
      this.logger.log('[PrismaService] disconnect from database');
    } catch (e) {
      if (e instanceof Error) {
        this.logger.error('[PrismaService] failed to disconnect', e.message);
      } else {
        this.logger.error('[PrismaService] failed to disconnect');
      }
    }
  }
}
