import { Role } from '../entity/role.entity';
import { User } from '../entity/user.entity';

export class UserDto {
  id?: string;
  username: string;
  name: string;
  email: string;
  cell_phone: string;
  profile_id: string;
  created_at?: Date;
  updated_at?: Date;
  roles: Role[];

  constructor(user: User) {
    this.id = user.id;
    this.profile_id = user.profile?.id || null;
    this.name = user.profile?.name || null;
    this.username = user.username;
    this.email = user.profile?.email || null;
    this.cell_phone = user.profile?.cell_phone || null;
    this.created_at = user.created_at;
    this.updated_at = user.updated_at;
    this.roles = user.roles;
  }

  static build(user: User) {
    return new UserDto(user);
  }
}
