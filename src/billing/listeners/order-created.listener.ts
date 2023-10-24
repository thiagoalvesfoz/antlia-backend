import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from 'src/antlia/events/order-created.event';
import { InvoicesService } from '../invoices/service/invoices.service';
import { Transaction } from '../invoices/entities/transaction.entity';
import { InvoiceRepository } from '../invoices/repository';

@Injectable()
export class OrderCreatedListener {

  private readonly logger = new Logger(OrderCreatedListener.name);

  constructor(
    @Inject('InvoiceRepository')
    private readonly invoiceRepository: InvoiceRepository,
    private readonly invoiceService: InvoicesService, 
  ){}

  /*
   * Se necessário, utilizar filas para gerenciar melhor
   * com políticas de retentativas em caso de falhas.
   */

  @OnEvent('order.created', { async: true })
  async handleOrderCreatedEvent(event: OrderCreatedEvent) { 
    this.logger.log("order.created: adding to the customer's invoice");

    const invoice = await this.invoiceService.getOrCreateOpenInvoice(event.order.customer_id);

    const transaction = new Transaction({
      order_id: event.order.id,
      price: event.order.total,
    });

    invoice.addTransaction(transaction);

    await this.invoiceRepository.update(invoice, transaction);

    this.logger.debug(`a new transaction has been added to invoice: [invoice_id: ${invoice.id}, order_id: ${transaction.order_id}]`);
  }

}