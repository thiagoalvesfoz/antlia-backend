import {
  Controller,
  Get,
  Post,
  Request,
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

  @Post('/close')
  @HttpCode(HttpStatus.OK)
  async findOne(@Request() req) {
    const user: UserDto = req.user;

    const invoice = await this.invoicesService.findOpenedInvoiceByCustomerId(
      user.profile_id,
    );

    return this.invoicesService.closeInvoice(invoice);
  }

  // buscar a partir de um usuário autenticado
  @Get('/current')
  async getOpenedInvoice(@Request() req) {
    const user: UserDto = req.user;
    return this.invoicesService.findOpenedInvoiceByCustomerId(user.profile_id);
  }
}
