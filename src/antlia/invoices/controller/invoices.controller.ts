import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { InvoicesService } from '../service/invoices.service';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Invoices')
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post('open-invoice')
  openInvoice(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoicesService.openInvoice(createInvoiceDto);
  }

  @Post(':id/close')
  async findOne(@Param('id') id: string) {
    const invoice = await this.invoicesService.findOne(id);
    return this.invoicesService.closeInvoice(invoice);
  }

  // buscar a partir de um usuário autenticado
  @Get('/current')
  async getOpenedInvoice(@Query() params: any) {
    const { customer_id } = params;

    if (!customer_id) {
      throw new BadRequestException('?customer_id= is required');
    }

    return this.invoicesService.findOpenedInvoiceByCustomerId(customer_id);
  }

  @Get()
  findAll(@Query() params: any) {
    const { customer_id } = params;

    if (!customer_id) {
      throw new BadRequestException('?customer_id= is required');
    }

    return this.invoicesService.findAllByCustomerId(customer_id);
  }
}
