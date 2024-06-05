import { Role, User } from './entity';

export const USER_NAME_PROVIDER = 'UserRepository';

export interface UserRepository {
  updateEnable(user_id: string, enable: boolean): Promise<void>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  findAll(): Promise<User[]>;
  findById(user_id: string): Promise<User>;
  isEmailExists(email: string): Promise<boolean>;
  findUserAccount(username: string, email: string): Promise<User>;
  findByUsername(username): Promise<User | undefined>;
  findRoleByName(roleName: string): Promise<Role | undefined>;
  updatePassword(user: User): Promise<void>;
}
