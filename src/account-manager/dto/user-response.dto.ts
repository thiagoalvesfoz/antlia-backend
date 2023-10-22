import { IsNotEmpty, Length, IsString } from 'class-validator';
import { Role } from '../entity/role.entity';
import { User } from '../entity/user.entity';

export class UserDto {
  id?: string;
  username: string;
  roles: Role[];
  created_at?: Date;
  updated_at?: Date;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.roles = user.roles;
    this.created_at = user.created_at;
    this.updated_at = user.updated_at;
  }

  static build(user: User) {
    return new UserDto(user);
  }
}
