import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from 'src/antlia/events/order-created.event';
import { MailService } from '../service/mail.service';
import { CustomerService } from 'src/billing/invoices/service/customer.service';


@Injectable()
export class SendEmailListener {

  private readonly logger = new Logger(SendEmailListener.name);

  constructor(
    private readonly mailService: MailService,
    private readonly customerService: CustomerService
  ){}

  /*
   * Se necessário, utilizar filas para gerenciar melhor
   * com políticas de retentativas em caso de falhas.
   */

  @OnEvent('order.created', { async: true })
  async handleNotificationOrderCreatedEvent(event: OrderCreatedEvent) { 
    this.logger.log('order.created, send notification email');
    try {
      const customer = await this.customerService.getCustomer(event.order.customer_id);
      await this.mailService.sendOrderPlaced(customer, event.order);
      this.logger.log('order.created, email sent');
    } catch (error) {
      this.logger.log('error, email don\'t sent');
      this.logger.error(error);
    }
    
  }

}