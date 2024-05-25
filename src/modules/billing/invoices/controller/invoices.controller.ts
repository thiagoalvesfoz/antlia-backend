import {
  Controller,
  Get,
  Post,
  Request,
  Param,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { InvoicesService } from '../service/invoices.service';
import { UserDto } from 'src/common/dto/user.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateInvoiceDto } from '../dto/update-invoice.dto';

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

  @Get(':invoice_id')
  async updateInvoice(
    @Param('invoice_id') invoice_id: string,
    @Body() invoiceDto: UpdateInvoiceDto,
  ) {
    return this.invoicesService.updateInvoice(invoice_id, invoiceDto);
  }
}
