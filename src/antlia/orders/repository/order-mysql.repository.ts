import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/orderItem.entity';
import { OrderRepository } from './order.repository';

import { PrismaService } from 'src/prisma/prisma.service';
import { Order as OrderModel } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';

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
  }[];
  customer: {
    id: string;
    name: string;
  };
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
      include: {
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
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return this.#map(orderModel);
  }
  async findAll(): Promise<Order[]> {
    const orders = await this.prismaService.order.findMany({
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
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
          },
        },
      },
    });

    return orders.map(this.#map);
  }

  async findById(order_id: string): Promise<Order> {
    if (!order_id) return;

    const order = await this.prismaService.order.findFirst({
      where: {
        id: order_id,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
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
          },
        },
      },
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
