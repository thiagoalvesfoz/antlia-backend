import { Module } from '@nestjs/common';
import { OrdersService } from './service/orders.service';
import { OrdersController } from './controller/orders.controller';
import { InventoryModule } from 'src/antlia/inventory/inventory.module';
import { OrderRepositoryProvider } from './repository';
import { InvoicesService } from '../../billing/invoices/service/invoices.service';
import {
  CustomerRepositoryProvider,
  InvoiceRepositoryProvider,
} from '../../billing/invoices/repository';
import { CustomerService } from 'src/billing/invoices/service/customer.service';
import { BillingModule } from 'src/billing/billing.module';

@Module({
  imports: [InventoryModule, BillingModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrderRepositoryProvider],
  exports: [OrdersService],
})
export class OrdersModule {}
