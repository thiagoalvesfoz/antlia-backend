import { Module } from '@nestjs/common';
import { MailService } from './service/mail.service';
import { SendEmailListener } from '../orders/listeners/order-created.listener';
import { BillingModule } from '../billing/billing.module';

@Module({
  imports: [BillingModule],
  providers: [MailService, SendEmailListener],
  exports: [MailService],
})
export class MailModule {}
