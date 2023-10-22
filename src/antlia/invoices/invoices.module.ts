import { Module } from '@nestjs/common';
import { InvoicesService } from './service/invoices.service';
import { InvoicesController } from './controller/invoices.controller';
import { InvoiceRepositoryProvider } from './repository';

@Module({
  controllers: [InvoicesController],
  providers: [InvoicesService, InvoiceRepositoryProvider],
})
export class InvoicesModule {}
