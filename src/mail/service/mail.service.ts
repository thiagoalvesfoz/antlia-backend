import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Order } from 'src/antlia/orders/entities/order.entity';
import { Customer } from 'src/billing/invoices/entities/customer.entity';

interface Mail {
    to: string;
    
}

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    async sendOrderPlaced(customer: Customer, order: Order) {    
        await this.mailerService.sendMail({
          to: customer.email,
          subject: 'Recebemos o seu pedido',
          template: './order',
          context: {
            name: customer.name,
            order,
          },
        });
      }
}
