import { injectable } from 'inversify';
import { UserRegitserDTO, UserLoginDTO } from './dto';
import { User } from './user.entity';
import { IUserService } from './user.service.interface';

@injectable()
export class UserService implements IUserService {
  async createUser({ email, name, password }: UserRegitserDTO): Promise<User | null> {
    const newUser = new User(email, name);
    await newUser.setPassword(password);
    // проверка что он есть
    // если есть возращаем нулл
    // если нет - создаем
    return Math.random() > 0.5 ? null : newUser;
  }

  validateUser(dto: UserLoginDTO): boolean {
    return true;
  }
}
