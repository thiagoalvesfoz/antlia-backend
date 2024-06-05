import { UserMysqlRepository } from './users-mysql.repository';
import {
  UserRepository,
  USER_NAME_PROVIDER,
} from '@account/domain/users.repository';

export const UserRepositoryProvider = {
  provide: USER_NAME_PROVIDER,
  useClass: UserMysqlRepository,
};

export { UserRepository };
