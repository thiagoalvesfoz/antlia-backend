import { Module } from '@nestjs/common';
import { InvoiceModule } from './invoices/invoice.module';
import { RouterModule } from '@nestjs/core';

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
  providers: [],
  exports: [InvoiceModule],
})
export class BillingModule {}
