import { OrderRepository, ORDER_NAME_PROVIDER } from './order.repository';
import { OrderMysqlRepository } from './order-mysql.repository';

const OrderRepositoryProvider = {
  provide: ORDER_NAME_PROVIDER,
  useClass: OrderMysqlRepository,
};

export { OrderRepository, OrderRepositoryProvider, ORDER_NAME_PROVIDER };
