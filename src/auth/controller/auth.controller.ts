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
import { Public } from '../guard/public.guard';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { LoginGuard } from '../guard/login.guard';

@UseGuards(JwtAuthGuard)
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
  user(@Request() req) {
    return req.user;
  }
}
