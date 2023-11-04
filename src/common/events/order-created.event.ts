import { Order } from "src/modules/orders/entities/order.entity";

class OrderCreatedEvent {
  constructor(readonly order: Order){}
}

export {
  OrderCreatedEvent, Order
}