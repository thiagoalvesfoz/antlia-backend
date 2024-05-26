import { InvalidAttributeException } from 'src/common/exceptions/invalid-attribute-exception';
import { Image } from './image.entity';

export type CategoryProps = {
  id?: string;
  name: string;
  enable: boolean;
  image?: Image;
  created_at?: Date;
  updated_at?: Date;
};

export class Category {
  id?: string;
  name: string;
  enable: boolean;
  image?: Image;
  created_at?: Date;
  updated_at?: Date;

  constructor(props: CategoryProps) {
    this.id = props.id;
    this.updateName(props.name);
    this.updateEnable(props.enable);
    this.image = props.image;
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

  addImage(bytes: Buffer, mimetype: string) {
    if (this.image?.id) {
      this.image.update({ bytes, mimetype });
    } else {
      this.image = new Image({ bytes, mimetype });
    }
  }
}
