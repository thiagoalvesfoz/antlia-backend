import { Invoice } from '../entities/invoice.entity';
import { Transaction } from '../entities/transaction.entity';

export const INVOICE_NAME_PROVIDER = 'InvoiceRepository';

export interface InvoiceRepository {
  findAllByCustomerId(customer_id: string): Promise<Invoice[]>;
  findById(id: string): Promise<Invoice>;
  create(invoice: Invoice): Promise<Invoice>;
  update(invoice: Invoice, transaction?: Transaction): Promise<Invoice>;
  findOpenInvoiceByCustomerId(customer_id: string): Promise<Invoice>;
  countInvoiceOpenedByEndAt(date: Date): Promise<number>
  getInvoicesOpenedByEndAt(date: Date): Promise<Invoice[]>
  updateAll(invoices: Invoice[]): Promise<void>
}
