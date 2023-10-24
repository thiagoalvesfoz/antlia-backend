import {
  Controller,
  Get,
  Post,
  Request,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { InvoicesService } from '../service/invoices.service';
import { ApiTags } from '@nestjs/swagger';
import { UserDto } from 'src/account-manager/dto/user-response.dto';

@ApiTags('Invoices')
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async openInvoice(@Request() req) {
    const user: UserDto = req.user;
    return this.invoicesService.getOpenInvoice(user.profile_id);
  }

  @Get('/')
  async findInvoicesByCustomerID(@Request() req) {
    const user: UserDto = req.user;
    return this.invoicesService.findAllInvoicesByCustomerId(user.profile_id);
  }

  @Get(':invoice_id')
  async getMyInvoices(@Param('invoice_id') invoice_id: string) {
    return this.invoicesService.findInvoiceById(invoice_id);
  }
}
