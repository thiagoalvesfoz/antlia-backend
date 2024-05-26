import { InvalidAttributeException } from 'src/common/exceptions/invalid-attribute-exception';
import { Image } from './image.entity';

type ProductProps = {
  id?: string;
  category_id: string;
  category_name: string;
  name: string;
  price: number;
  availability: boolean;
  created_at?: Date;
  updated_at?: Date;
};

export class Product {
  id?: string;
  category_id: string;
  category_name: string;
  name: string;
  price: number;
  availability: boolean;
  image?: Image;
  created_at?: Date;
  updated_at?: Date;

  constructor(props: ProductProps) {
    this.id = props.id;
    this.updateName(props.name);
    this.updatePrice(props.price);
    this.updateAvailability(props.availability);
    this.addCategory({ ...props });
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
    const max = 999999999.99;

    if (!price) {
      throw new InvalidAttributeException('price is required');
    }

    if (price < min || price > max) {
      throw new InvalidAttributeException(
        `price must be greater than ${min} and less than ${max}`,
      );
    }

    this.price = price;
  }

  updateAvailability(availability = true) {
    this.availability = availability;
  }

  addImage(bytes: Buffer, mimetype: string) {
    this.image = new Image({ bytes, mimetype });
  }
}
