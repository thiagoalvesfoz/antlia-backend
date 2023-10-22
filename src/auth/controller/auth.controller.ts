import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';

import { LoginGuard } from '../guard/login.guard';
import { Public } from '../decorator/public.decorator';
import { Roles } from '../decorator/role.decorator';
import { Role } from 'src/account-manager/entity/role.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LoginGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('/user')
  @Roles(Role.ADMIN, Role.USER)
  user(@Request() req) {
    return req.user;
  }

  @Get('/admin')
  @Roles(Role.ADMIN)
  admin(@Request() req) {
    return req.user;
  }
}
