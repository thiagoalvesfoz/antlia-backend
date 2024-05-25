import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/orderItem.entity';
import { OrderRepository } from './order.repository';

import { Order as OrderModel } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/common/prisma/prisma.service';

type OrderModelProps = OrderModel & {
  order_items: {
    id: string;
    product_id: string;
    product: {
      name: string;
      category: {
        name: string;
      };
    };
    quantity: number;
    subtotal: Decimal;
    created_at: Date;
    updated_at: Date;
  }[];
  customer: {
    id: string;
    name: string;
  };
};

const include = {
  order_items: {
    select: {
      id: true,
      product_id: true,
      product: {
        select: {
          name: true,
          category: {
            select: {
              name: true,
            },
          },
        },
      },
      quantity: true,
      subtotal: true,
      created_at: true,
      updated_at: true,
    },
  },
  customer: {
    select: {
      id: true,
      name: true,
    },
  },
};

@Injectable()
export class OrderMysqlRepository implements OrderRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(order: Order): Promise<Order> {
    const orderModel = await this.prismaService.order.create({
      data: {
        total: order.total,
        order_items: {
          create: order.order_items.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            subtotal: item.subtotal,
          })),
        },
        customer: {
          connect: {
            id: order.customer_id,
          },
        },
      },
      include,
    });

    return this.#map(orderModel);
  }
  async findAll(): Promise<Order[]> {
    const orders = await this.prismaService.order.findMany({
      include,
    });

    return orders.map(this.#map);
  }

  async findById(order_id: string): Promise<Order> {
    if (!order_id) return;

    const order = await this.prismaService.order.findFirst({
      where: {
        id: order_id,
      },
      include,
    });

    return this.#map(order);
  }

  #map(orderModel: OrderModelProps) {
    return orderModel
      ? new Order({
          id: orderModel.id,
          customer_id: orderModel.customer.id,
          customer_name: orderModel.customer.name,
          total: +orderModel.total,
          created_at: orderModel.created_at,
          order_items: orderModel.order_items.map(
            (orderItems) =>
              new OrderItem({
                id: orderItems.id,
                product_id: orderItems.product_id,
                product_name: orderItems.product.name,
                quantity: orderItems.quantity,
                subtotal: +orderItems.subtotal,
              }),
          ),
        })
      : undefined;
  }
}
