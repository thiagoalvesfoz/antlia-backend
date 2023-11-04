import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { Role, Roles } from 'src/common/decorators/role.decorator';
import { UsersService } from '../domain/users.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../domain/dto/create-user.dto';
import { UserDto } from '../domain/dto/user-response.dto';

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
