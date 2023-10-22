export type RoleProps = {
  id: string;
  name: string;
};

export class Role {
  id: string;
  name: string;

  constructor(props: RoleProps) {
    this.id = props.id;
    this.name = props.name;
  }
}
