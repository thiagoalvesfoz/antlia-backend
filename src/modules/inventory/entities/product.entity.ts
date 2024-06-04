import { InvalidAttributeException } from 'src/common/exceptions/invalid-attribute-exception';
import { Image } from './image.entity';

export enum ProductStatus {
  PUBLISHED = 'PUBLISHED',
  UNPUBLISHED = 'UNPUBLISHED',
}

type ProductProps = {
  id?: string;
  category_id: string;
  image_id?: string;
  category_name: string;
  name: string;
  price: number;
  status: ProductStatus;
  created_at?: Date;
  updated_at?: Date;
};

export class Product {
  id?: string;
  category_id: string;
  category_name: string;
  name: string;
  price: number;
  status: ProductStatus;
  image_id: string;
  image?: Image;
  created_at?: Date;
  updated_at?: Date;

  constructor(props: ProductProps) {
    this.id = props.id;
    this.updateName(props.name);
    this.updatePrice(props.price);
    this.addCategory({ ...props });
    this.updateStatus(props.status);
    this.image_id = props.image_id;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }

  updateName(name: string) {
    if (!name || !name.trim()) {
      throw new InvalidAttributeException('name should not be empty');
    }

    this.name = name;
  }

  addCategory(props: { category_id: string; category_name: string }) {
    if (!props.category_id || !props.category_id.trim()) {
      throw new InvalidAttributeException('categoryId is required');
    }

    if (!props.category_name || !props.category_name.trim()) {
      throw new InvalidAttributeException('categoryName should not be empty');
    }

    this.category_id = props.category_id;
    this.category_name = props.category_name;
  }

  updatePrice(price: number) {
    const min = 0.01;
    const max = 9999999.99;

    if (!price) {
      throw new InvalidAttributeException('price is required');
    }

    if (price < min || price > max) {
      throw new InvalidAttributeException(
        `price must be greater than ${min} and less than ${max}`,
      );
    }

    this.price = parseFloat(price.toFixed(2));
  }

  updateStatus(status: ProductStatus) {
    if (!status) return;
    this.status = status;
  }

  addImage(bytes: Buffer, mimetype: string) {
    this.image = new Image({ bytes, mimetype });
  }
}
