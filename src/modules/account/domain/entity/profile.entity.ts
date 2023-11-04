export type UserProps = {
  id?: string;
  user_id?: string;
  name: string;
  email: string;
  cell_phone: string;
  created_at?: Date;
  updated_at?: Date;
};

export class Profile {
  id?: string;
  user_id?: string;
  name: string;
  email: string;
  cell_phone: string;
  created_at?: Date;
  updated_at?: Date;

  constructor(props: UserProps) {
    this.id = props.id;
    this.user_id = props.user_id;
    this.name = props.name;
    this.email = props.email;
    this.cell_phone = props.cell_phone;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }
}
