import { UserModel } from '@prisma/client';
import { UserLoginDTO, UserRegitserDTO } from './dto';
import { User } from './user.entity';

export interface IUserService {
  createUser: (dto: UserRegitserDTO) => Promise<UserModel | null>;
  validateUser: (dto: UserLoginDTO) => boolean;
}
