import { ApiProperty } from '@nestjs/swagger';
import { Role, User } from '@account/domain/entity';

export class UserDto {
  @ApiProperty()
  id?: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  cell_phone: string;

  @ApiProperty()
  profile_id: string;

  @ApiProperty()
  created_at?: Date;

  @ApiProperty()
  updated_at?: Date;

  @ApiProperty({ enum: Role })
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
