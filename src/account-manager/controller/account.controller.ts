import { Controller, Get, Request } from '@nestjs/common';
import { UsersService } from '../service/users.service';

import { UserDto } from '../dto/user-response.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  me(@Request() req) {
    const user: UserDto = req.user;
    return user;
  }
}
