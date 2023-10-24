import { Order } from "../orders/entities/order.entity";

export class OrderCreatedEvent {
    constructor(readonly order: Order){}
  }