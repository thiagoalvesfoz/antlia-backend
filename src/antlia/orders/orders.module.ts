import { Module } from '@nestjs/common';
import { OrdersService } from './service/orders.service';
import { OrdersController } from './controller/orders.controller';
import { InventoryModule } from 'src/antlia/inventory/inventory.module';
import { OrderRepositoryProvider } from './repository';

@Module({
  imports: [InventoryModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrderRepositoryProvider],
})
export class OrdersModule {}
