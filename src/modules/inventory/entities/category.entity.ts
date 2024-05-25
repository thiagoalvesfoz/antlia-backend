import { InvalidAttributeException } from 'src/common/exceptions/invalid-attribute-exception';

export type CategoryProps = {
  id?: string;
  name: string;
  enable: boolean;
  show_menu: boolean;
  created_at?: Date;
  updated_at?: Date;
};

export class Category {
  id?: string;
  name: string;
  enable: boolean;
  show_menu: boolean;
  created_at?: Date;
  updated_at?: Date;

  constructor(props: CategoryProps) {
    this.id = props.id;
    this.updateName(props.name);
    this.updateEnable(props.enable);
    this.updateShowMenu(props.show_menu);
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }

  updateName(name: string) {
    if (!name || !name.trim()) {
      throw new InvalidAttributeException('name should not be empty');
    }

    this.name = name;
  }

  updateEnable(enable = true) {
    this.enable = enable;
  }

  updateShowMenu(showMenu = false) {
    this.show_menu = showMenu;
  }
}
