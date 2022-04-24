import { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { UserRegitserDTO, UserLoginDTO } from './dto';
import { User } from './user.entity';
import { IUserRepository } from './user.repository.interface';
import { IUserService } from './user.service.interface';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.ConfigService) private configService: IConfigService,
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
  ) {}

  async createUser({ email, name, password }: UserRegitserDTO): Promise<UserModel | null> {
    const newUser = new User(email, name);
    const salt = this.configService.get('SALT');

    if (!salt) {
      throw new Error('Не удалось считать SALT');
    }

    await newUser.setPassword(password, Number(salt));

    const isExistUser = await this.userRepository.find(email);

    if (isExistUser) return null;

    const user = await this.userRepository.create(newUser);

    return user;
  }

  validateUser(dto: UserLoginDTO): boolean {
    return true;
  }
}
