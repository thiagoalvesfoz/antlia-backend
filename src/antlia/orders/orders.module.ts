import { Module } from '@nestjs/common';
import { OrdersService } from './service/orders.service';
import { OrdersController } from './controller/orders.controller';
import { InventoryModule } from 'src/antlia/inventory/inventory.module';
import { OrderRepositoryProvider } from './repository';
import { EventEmitter2 } from '@nestjs/event-emitter';

const EventProvider = { provide: 'EventEmitter', useExisting: EventEmitter2 }

@Module({
  imports: [InventoryModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrderRepositoryProvider, EventProvider],
  exports: [OrdersService],
})
export class OrdersModule {}
