import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from '../entity/role.entity';
import { ApiTags } from '@nestjs/swagger';
import { UserDto } from '../dto/user-response.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':user_id')
  @Roles(Role.ADMIN)
  findOne(@Param('user_id') user_id: string) {
    return this.usersService.findOne(user_id);
  }
}
