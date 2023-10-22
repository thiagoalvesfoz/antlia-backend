import { Profile } from './profile.entity';
import { Role } from './role.entity';
import * as bcrypt from 'bcrypt';

export type UserProps = {
  id?: string;
  username: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
  roles?: Role[];
  profile: Profile;
};

export class User {
  id?: string;
  username: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
  roles?: Role[];
  profile: Profile;

  constructor(props: UserProps) {
    this.id = props.id;
    this.username = props.username;
    this.password = props.password;
    this.roles = props.roles;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
    this.profile = props.profile;
  }

  encrypt_password() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}
