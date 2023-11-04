import { Inject, Injectable } from '@nestjs/common';
import { Customer } from '../entities/customer.entity';
import { CustomerRepository, CUSTOMER_NAME_PROVIDER } from '../repository';
import { ResourceNotFoundException } from 'src/common/exceptions/resource-not-found.exception';

@Injectable()
export class CustomerService {
  constructor(
    @Inject(CUSTOMER_NAME_PROVIDER)
    private readonly customerRepository: CustomerRepository,
  ) {}

  async getCustomer(customer_id: string): Promise<Customer> {
    const customer = await this.customerRepository.findById(customer_id);

    if (!customer) {
      throw new ResourceNotFoundException('customer not found');
    }

    return customer;
  }
}
