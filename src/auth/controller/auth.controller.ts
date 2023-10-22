import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';

import { LoginGuard } from '../guard/login.guard';
import { Public } from '../decorator/public.decorator';

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
}
