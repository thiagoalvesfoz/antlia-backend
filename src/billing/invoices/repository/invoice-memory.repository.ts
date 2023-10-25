import { Injectable } from '@nestjs/common';
import { Invoice } from '../entities/invoice.entity';
import { InvoiceRepository } from './invoice.repository';

@Injectable()
export class InvoiceMemoryRepository implements InvoiceRepository {
  countInvoiceOpenedByEndAt(date: Date): Promise<number> {
    throw new Error('Method not implemented.');
  }
  getInvoicesOpenedByEndAt(date: Date): Promise<Invoice[]> {
    throw new Error('Method not implemented.');
  }
  updateAll(invoices: Invoice[]): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findAllByCustomerId(customer_id: string): Promise<Invoice[]> {
    throw new Error('Method not implemented.');
  }
  findById(id: string): Promise<Invoice> {
    throw new Error('Method not implemented.');
  }
  create(invoice: Invoice): Promise<Invoice> {
    throw new Error('Method not implemented.');
  }
  update(invoice: Invoice): Promise<Invoice> {
    throw new Error('Method not implemented.');
  }
  findOpenInvoiceByCustomerId(customer_id: string): Promise<Invoice> {
    throw new Error('Method not implemented.');
  }
}
