import { Module } from '@nestjs/common';
import { InvoiceModule } from './invoices/invoice.module';
import { RouterModule } from '@nestjs/core';
import { OrderCreatedListener } from './listeners/order-created.listener';

const PATH_API = 'billing'

@Module({
  imports: [
    InvoiceModule,
    RouterModule.register([
      {
        path: PATH_API,
        children: [InvoiceModule],
      },
    ]),
  ],
  controllers: [],
  providers: [OrderCreatedListener],
  exports: [InvoiceModule],
})
export class BillingModule {}
