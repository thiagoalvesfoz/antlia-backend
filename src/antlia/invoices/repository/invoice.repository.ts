import { Invoice } from '../entities/invoice.entity';

export const INVOICE_NAME_PROVIDER = 'InvoiceRepository';

export interface InvoiceRepository {
  findAllByCustomerId(customer_id: string): Promise<Invoice[]>;
  findById(id: string): Promise<Invoice>;
  create(invoice: Invoice): Promise<Invoice>;
  update(invoice: Invoice): Promise<Invoice>;
  findOpenedInvoiceByCustomerId(customer_id: string): Promise<Invoice>;
}
