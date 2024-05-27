import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Patch,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Role, Roles } from 'src/common/decorators/role.decorator';
import { UsersService } from '../domain/users.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../domain/dto/create-user.dto';
import { UserDto } from '../domain/dto/user-response.dto';
import { UpdatePasswordDto } from '../domain/dto/update-password.dto';
import { UpdateUserDto } from '../domain/dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuário criado',
    type: UserDto,
  })
  create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiResponse({ status: HttpStatus.OK, type: [UserDto] })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':user_id')
  @Roles(Role.ADMIN)
  @ApiResponse({ status: HttpStatus.OK, type: UserDto })
  findOne(@Param('user_id') user_id: string) {
    return this.usersService.findOne(user_id);
  }

  @Put(':user_id')
  @Roles(Role.ADMIN)
  @ApiResponse({ status: HttpStatus.OK, type: UserDto })
  update(
    @Param('user_id') user_id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(user_id, updateUserDto);
  }

  @Patch(':user_id/update-password')
  @Roles(Role.ADMIN)
  @HttpCode(204)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'A operação foi um sucesso',
  })
  updatePassword(
    @Param('user_id') user_id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.usersService.updatePassword(user_id, updatePasswordDto);
  }
}
