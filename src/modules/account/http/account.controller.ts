import { Controller, Get, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserDto } from '../domain/dto/user-response.dto';

@ApiTags('Account')
@Controller('account')
export class AccountController {
  @Get('/me')
  me(@Request() req) {
    return req.user as UserDto;
  }
}
