import { UserLoginDTO, UserRegitserDTO } from './dto';
import { User } from './user.entity';

export interface IUserService {
  createUser: (dto: UserRegitserDTO) => Promise<User | null>;
  validateUser: (dto: UserLoginDTO) => boolean;
}
