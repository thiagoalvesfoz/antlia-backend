import { InvalidAttributeException } from "src/common/exceptions/invalid-attribute-exception";

type OrderItemProps = {
  id?: string;
  product_id: string;
  product_name: string;
  subtotal: number;
  quantity: number;
  created_at?: Date;
  updated_at?: Date;
};

export class OrderItem {
  id?: string;
  product_id: string;
  product_name: string;
  quantity: number;
  subtotal: number;
  created_at?: Date;
  updated_at?: Date;

  constructor(props: OrderItemProps) {
    this.id = props.id;
    this.addProduct({ ...props });
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }

  addProduct(props: OrderItemProps) {
    const { product_id, product_name, quantity, subtotal } = props;

    if (!product_id || !product_id.trim()) {
      throw new InvalidAttributeException('product_id is required');
    }

    if (!product_name || !product_name.trim()) {
      throw new InvalidAttributeException('product_name should not be empty');
    }

    if (!quantity || quantity <= 0) {
      throw new InvalidAttributeException('quantity should not be empty');
    }

    if (!subtotal || subtotal <= 0) {
      throw new InvalidAttributeException('quantity should not be empty');
    }

    this.product_id = product_id;
    this.product_name = product_name;
    this.quantity = quantity;
    this.subtotal = subtotal;
  }
}
