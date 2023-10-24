import { Injectable, Inject } from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-order.dto';
import { ProductsService } from '../../inventory/service/products.service';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/orderItem.entity';
import { OrderRepository } from '../repository/order.repository';
import { ResourceNotFoundException } from 'src/@shared/resource-not-found.exception';
import { UserDto } from 'src/account-manager/dto/user-response.dto';
import { BusinessRuleException } from 'src/@shared/business-rule.exception';
import { InvoicesService } from 'src/billing/invoices/service/invoices.service';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
    private readonly productService: ProductsService,
    private readonly invoicesService: InvoicesService,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: UserDto) {
    const { order_items } = createOrderDto;

    if (!user) {
      throw new BusinessRuleException(
        'The order could not be placed because the customer was not informed',
      );
    }

    const order = new Order({
      customer_id: user.profile_id,
      customer_name: user.name,
    });

    for (const index in order_items) {
      const product = await this.productService.findOne(
        order_items[index].product_id,
      );

      const productItem = new OrderItem({
        product_id: product.id,
        product_name: product.name,
        quantity: order_items[index].quantity,
        subtotal: product.price * order_items[index].quantity,
      });

      order.addItem(productItem);
    }

    order.total = order.getTotal();

    const orderCreated = await this.orderRepository.create(order);

    this.invoicesService.addTransaction(orderCreated);

    return orderCreated;
  }

  async findAll() {
    return await this.orderRepository.findAll();
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findById(id);
    if (!order) throw new ResourceNotFoundException('Order not found');
    return order;
  }
}
