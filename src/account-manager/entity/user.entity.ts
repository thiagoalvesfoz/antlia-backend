import { BusinessRuleException } from 'src/@shared/business-rule.exception';
import { Role } from './role.entity';

export type UserProps = {
  id?: string;
  username: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
  roles: Role[];
};

export class User {
  id?: string;
  username: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
  roles: Role[];

  constructor(props: UserProps) {
    this.id = props.id;
    this.username = props.username;
    this.password = props.password;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
    this.addRoles(props.roles);
  }

  addRoles(roles: Role[]) {
    if (roles?.length === 0) {
      throw new BusinessRuleException('roles is required');
    }

    this.roles = roles;
  }
}
