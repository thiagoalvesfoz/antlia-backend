import { Module } from '@nestjs/common';
import { InvoicesService } from './service/invoices.service';
import { CustomerService } from './service/customer.service';
import { InvoicesController } from './controller/invoices.controller';
import { CustomerController } from './controller/customer.controller';
import {
  CustomerRepositoryProvider,
  InvoiceRepositoryProvider,
} from './repository';

@Module({
  imports: [],
  controllers: [InvoicesController, CustomerController],
  providers: [
    InvoicesService,
    CustomerService,
    InvoiceRepositoryProvider,
    CustomerRepositoryProvider,
  ],
  exports: [
    InvoicesService, 
    CustomerService, 
    InvoiceRepositoryProvider, 
    CustomerRepositoryProvider
  ],
})
export class InvoiceModule {}
