import { InvoiceMysqlRepository } from './invoice-mysql.repository';
import { CustomerMysqlRepository } from './customer-mysql.repository';
import { InvoiceRepository, INVOICE_NAME_PROVIDER } from './invoice.repository';

import {
  CustomerRepository,
  CUSTOMER_NAME_PROVIDER,
} from './customer.repository';

const InvoiceRepositoryProvider = {
  provide: INVOICE_NAME_PROVIDER,
  useClass: InvoiceMysqlRepository,
};

const CustomerRepositoryProvider = {
  provide: CUSTOMER_NAME_PROVIDER,
  useClass: CustomerMysqlRepository,
};

export {
  InvoiceRepository,
  InvoiceRepositoryProvider,
  CustomerRepository,
  CustomerRepositoryProvider,
  INVOICE_NAME_PROVIDER,
  CUSTOMER_NAME_PROVIDER,
};
