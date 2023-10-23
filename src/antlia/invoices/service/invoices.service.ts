import { Inject, Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';
import { Order } from 'src/antlia/orders/entities/order.entity';
import { BillStatus, Invoice, PayStatus } from '../entities/invoice.entity';
import { InvoiceRepository } from '../repository/invoice.repository';
import { BusinessRuleException } from 'src/@shared/business-rule.exception';
import { ResourceNotFoundException } from 'src/@shared/resource-not-found.exception';
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @Inject('InvoiceRepository')
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  // must not have create a new invoice if already invoice exists with opended status
  async openInvoice(createInvoiceDto: CreateInvoiceDto) {
    if (!createInvoiceDto?.customer_id) {
      throw new BusinessRuleException('customer_id is required');
    }

    const existsInvoice =
      await this.invoiceRepository.findOpenedInvoiceByCustomerId(
        createInvoiceDto.customer_id,
      );

    if (existsInvoice) {
      return existsInvoice;
    }

    const invoice = new Invoice({
      customer_id: createInvoiceDto.customer_id,
      bill_status: BillStatus.OPENDED,
      pay_status: PayStatus.PENDING,
      start_at: new Date(),
    });

    return await this.invoiceRepository.create(invoice);
  }

  async closeInvoice(invoice: Invoice): Promise<Invoice> {
    if (!invoice) {
      throw new BusinessRuleException('Invoice is required');
    }

    invoice.close();

    return await this.invoiceRepository.update(invoice);
  }

  // transaction
  async addTransaction(order: Order) {
    const { customer_id, id, total } = order;

    const invoice = await this.openInvoice({ customer_id });

    const transaction = new Transaction({
      order_id: id,
      price: total,
    });

    invoice.addTransaction(transaction);

    await this.invoiceRepository.update(invoice, transaction);
  }

  //Is used to find in database a invoice with opened status from client
  async findOpenedInvoiceByCustomerId(customer_id: string) {
    if (!customer_id) {
      throw new BusinessRuleException('customer_id is required');
    }

    let invoice = await this.invoiceRepository.findOpenedInvoiceByCustomerId(
      customer_id,
    );

    if (!invoice) {
      invoice = await this.openInvoice({
        customer_id: customer_id,
      });
    }

    return invoice;
  }

  findAllByCustomerId(customer_id: string) {
    return this.invoiceRepository.findAllByCustomerId(customer_id);
  }

  findOne(invoice_id: string) {
    const invoice = this.invoiceRepository.findById(invoice_id);
    if (!invoice) throw new ResourceNotFoundException('Invoice');
    return invoice;
  }
}
