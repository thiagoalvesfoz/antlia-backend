import { Role } from '../entity/role.entity';
import { User } from '../entity/user.entity';

export const USER_NAME_PROVIDER = 'UserRepository';

export interface UserRepository {
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  findAll(): Promise<User[]>;
  findById(user_id: string): Promise<User>;
  isEmailExists(email: string): Promise<boolean>;
  findByUsername(username): Promise<User | undefined>;
  findRoleByName(roleName: string): Promise<Role | undefined>;
  updatePassword(user: User): Promise<void>;
}
