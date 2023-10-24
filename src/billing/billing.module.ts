import { Module } from '@nestjs/common';
import { InvoiceModule } from './invoices/invoice.module';
import { RouterModule } from '@nestjs/core';
import { OrderCreatedListener } from './listeners/order-created.listener';

@Module({
  imports: [
    InvoiceModule,
    RouterModule.register([
      {
        path: 'billing',
        children: [InvoiceModule],
      },
    ]),
  ],
  controllers: [],
  providers: [OrderCreatedListener],
  exports: [InvoiceModule],
})
export class BillingModule {}
