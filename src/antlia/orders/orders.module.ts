import { Module } from '@nestjs/common';
import { OrdersService } from './service/orders.service';
import { OrdersController } from './controller/orders.controller';
import { InventoryModule } from 'src/antlia/inventory/inventory.module';
import { OrderRepositoryProvider } from './repository';
import { InvoicesService } from '../invoices/service/invoices.service';
import { InvoiceRepositoryProvider } from '../invoices/repository';

@Module({
  imports: [InventoryModule],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    OrderRepositoryProvider,
    InvoicesService,
    InvoiceRepositoryProvider,
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
