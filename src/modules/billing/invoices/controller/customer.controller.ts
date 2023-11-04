import { Controller, Get, Param } from '@nestjs/common';
import { InvoicesService } from '../service/invoices.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Invoices')
@Controller('customers')
export class CustomerController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get(':customer_id/current-invoice')
  async getOpenInvoice(@Param('customer_id') customer_id: string) {
    return this.invoicesService.getOpenInvoice(customer_id);
  }
}
