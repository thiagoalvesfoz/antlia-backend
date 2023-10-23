import { Controller, Get, Post, Request, Param } from '@nestjs/common';
import { InvoicesService } from '../service/invoices.service';
import { ApiTags } from '@nestjs/swagger';
import { UserDto } from 'src/account-manager/dto/user-response.dto';

@ApiTags('Invoices')
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  async createInvoiceOpened(@Request() req) {
    const user: UserDto = req.user;
    return this.invoicesService.findOpenedInvoiceByCustomerId(user.profile_id);
  }

  @Get('/')
  async findInvoicesByCustomerID(@Request() req) {
    const user: UserDto = req.user;
    return this.invoicesService.findAllByCustomerId(user.profile_id);
  }

  @Get(':invoice_id')
  async getMyInvoices(@Param('invoice_id') invoice_id: string) {
    return this.invoicesService.findOne(invoice_id);
  }
}
