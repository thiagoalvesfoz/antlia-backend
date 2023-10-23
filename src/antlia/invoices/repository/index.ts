import { InvoiceMysqlRepository } from './invoice-mysql.repository';
import { InvoiceRepository, INVOICE_NAME_PROVIDER } from './invoice.repository';

const InvoiceRepositoryProvider = {
  provide: INVOICE_NAME_PROVIDER,
  useClass: InvoiceMysqlRepository,
};

export { InvoiceRepository, InvoiceRepositoryProvider };
