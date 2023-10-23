import { Invoice } from '../entities/invoice.entity';
import { Transaction } from '../entities/transaction.entity';

export const INVOICE_NAME_PROVIDER = 'InvoiceRepository';

export interface InvoiceRepository {
  findAllByCustomerId(customer_id: string): Promise<Invoice[]>;
  findById(id: string): Promise<Invoice>;
  create(invoice: Invoice): Promise<Invoice>;
  update(invoice: Invoice, transaction?: Transaction): Promise<Invoice>;
  findOpenedInvoiceByCustomerId(customer_id: string): Promise<Invoice>;
}
