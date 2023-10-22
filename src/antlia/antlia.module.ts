import { Module } from '@nestjs/common';
import { InventoryModule } from './inventory/inventory.module';
import { InvoicesModule } from './invoices/invoices.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [InventoryModule, InvoicesModule, OrdersModule],
  controllers: [],
  providers: [],
})
export class AntliaModule {}
