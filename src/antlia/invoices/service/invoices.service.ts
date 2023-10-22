import { Inject, Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';
import { Order } from 'src/antlia/orders/entities/order.entity';
import { BillStatus, Invoice, PayStatus } from '../entities/invoice.entity';
import { InvoiceRepository } from '../repository/invoice.repository';
import { BusinessRuleException } from 'src/@shared/business-rule.exception';
import { ResourceNotFoundException } from 'src/@shared/resource-not-found.exception';

@Injectable()
export class InvoicesService {
  constructor(
    @Inject('InvoiceRepository')
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  // must not have create a new invoice if already invoice exists with opended status
  async openInvoice(createInvoiceDto: CreateInvoiceDto) {
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

  async addTransaction(order: Order) {
    const invoice = await this.findOpenedInvoiceByCustomerId(order.customer_id);

    invoice.addItem({
      order_id: order.id,
      price: order.getTotal(),
      created_at: new Date(),
    });

    await this.invoiceRepository.update(invoice);
  }

  //Is used to find in database a invoice with opened status from client
  async findOpenedInvoiceByCustomerId(customer_id: string) {
    let invoice = await this.invoiceRepository.findOpenedInvoiceByCustomerId(
      customer_id,
    );

    if (!invoice) {
      invoice = await this.openInvoice({
        customer_id: customer_id,
        customer_name: '',
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
