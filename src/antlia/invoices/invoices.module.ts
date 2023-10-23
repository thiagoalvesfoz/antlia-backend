import { Module } from '@nestjs/common';
import { InvoicesService } from './service/invoices.service';
import { InvoicesController } from './controller/invoices.controller';
import { InvoiceRepositoryProvider } from './repository';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [OrdersModule],
  controllers: [InvoicesController],
  providers: [InvoicesService, InvoiceRepositoryProvider],
  exports: [InvoicesService],
})
export class InvoicesModule {}
