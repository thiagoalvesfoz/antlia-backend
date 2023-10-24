import { Module } from '@nestjs/common';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from './service/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { CustomerService } from 'src/billing/invoices/service/customer.service';
import { CustomerRepositoryProvider } from 'src/billing/invoices/repository';
import { SendEmailListener } from './listeners/email.listener';

@Module({
  imports: [
    MailerModule.forRoot({
      // transport: 'smtps://user@example.com:topsecret@smtp.example.com',
      transport: {
        host: 'smtp.mailgun.org',
        secure: false,
        port: 587,
        ignoreTLS: true,
        auth: {
          user: 'postmaster@sandbox2ee21ac595ff4e3f80b952187e584da2.mailgun.org',
          pass: '861b9617e7fae554125d4505ce8aff71-324e0bb2-0a66062b',
        },
      },
      defaults: {
        from: '"Antlia App" <noreply@example.com>',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    })
  ],
  providers: [MailService, SendEmailListener, CustomerService, CustomerRepositoryProvider],
  exports: [MailService]
})
export class MailModule {}
