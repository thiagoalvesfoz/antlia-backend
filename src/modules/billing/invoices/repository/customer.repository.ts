import { Customer } from '../entities/customer.entity';

export const CUSTOMER_NAME_PROVIDER = 'CustomerRepository';

export interface CustomerRepository {
  findById(customer_id: string): Promise<Customer>;
}
