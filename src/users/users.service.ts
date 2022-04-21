import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { UserRegitserDTO, UserLoginDTO } from './dto';
import { User } from './user.entity';
import { IUserService } from './user.service.interface';

@injectable()
export class UserService implements IUserService {
  constructor(@inject(TYPES.ConfigService) private configService: IConfigService) {}

  async createUser({ email, name, password }: UserRegitserDTO): Promise<User | null> {
    const newUser = new User(email, name);
    const salt = this.configService.get('SALT');

    if (!salt) {
      throw new Error('Не удалось считать SALT');
    }

    await newUser.setPassword(password, Number(salt));
    // проверка что он есть
    // если есть возращаем нулл
    // если нет - создаем
    return newUser;
  }

  validateUser(dto: UserLoginDTO): boolean {
    return true;
  }
}
