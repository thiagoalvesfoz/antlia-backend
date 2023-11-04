import { OrderItem } from './orderItem.entity';

type OrderProps = {
  id?: string;
  customer_id: string;
  customer_name: string;
  total?: number;
  order_items?: OrderItem[];
  created_at?: Date;
};

export class Order {
  id?: string;
  customer_id: string;
  customer_name: string;
  total: number;
  order_items: OrderItem[];
  created_at?: Date;

  constructor(props: OrderProps) {
    this.id = props.id;
    this.customer_id = props.customer_id;
    this.customer_name = props.customer_name;
    this.total = props.total;
    this.order_items = props.order_items || [];
    this.created_at = props.created_at;
  }

  addItem(order_item: OrderItem) {
    this.order_items.push(order_item);
  }

  removeItem(order_item: OrderItem) {
    this.order_items = this.order_items.filter(
      (item) => item.id === order_item.id,
    );
  }

  getTotal() {
    return this.order_items.reduce((total, item) => total + item.subtotal, 0);
  }
}
