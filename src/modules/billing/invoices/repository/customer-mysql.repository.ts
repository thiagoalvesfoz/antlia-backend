import { PrismaService } from 'src/common/prisma/prisma.service';
import { Customer } from '../entities/customer.entity';
import { CustomerRepository } from './customer.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomerMysqlRepository implements CustomerRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(customer_id: string): Promise<Customer> {
    if (!customer_id) return;
    const customer = await this.prismaService.profile.findFirst({
      where: {
        id: customer_id,
      },
    });

    return customer;
  }
}
