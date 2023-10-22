import { InvoiceRepository, INVOICE_NAME_PROVIDER } from './invoice.repository';
import { InvoiceMemoryRepository } from './invoice-memory.repository';

const InvoiceRepositoryProvider = {
  provide: INVOICE_NAME_PROVIDER,
  useClass: InvoiceMemoryRepository,
};

export { InvoiceRepository, InvoiceRepositoryProvider };
