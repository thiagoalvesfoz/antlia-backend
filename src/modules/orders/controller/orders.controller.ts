import { Controller, Get, Post, Body, Param, Request } from '@nestjs/common';
import { OrdersService } from '../service/orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { ApiTags } from '@nestjs/swagger';
import { Role, Roles } from 'src/common/decorators/role.decorator';
import { UserDto } from '@common/dto/user.dto';

interface RequestProps {
  user: UserDto;
}

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Request() req: RequestProps) {
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
