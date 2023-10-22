import { Order } from '../entities/order.entity';

export const ORDER_NAME_PROVIDER = 'OrderRepository';

export interface OrderRepository {
  create(order: Order): Promise<Order>;
  findAll(): Promise<Order[]>;
  findById(order_id: string): Promise<Order>;
}
