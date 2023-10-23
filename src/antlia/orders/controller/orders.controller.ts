import { Controller, Get, Post, Body, Param, Request } from '@nestjs/common';
import { OrdersService } from '../service/orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/account-manager/entity/role.entity';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return this.ordersService.create(createOrderDto, req.user);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }
}
