import { Module } from '@nestjs/common';
import { InvoiceClosingTaskService } from './billing/invoice-closing.task';
import { InvoiceRepositoryProvider } from 'src/billing/invoices/repository';

@Module({
  imports: [],    
  controllers: [],
  providers: [InvoiceClosingTaskService, InvoiceRepositoryProvider],
  exports: [],
})
export class TasksModule {}
