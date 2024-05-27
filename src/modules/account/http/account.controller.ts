import { Controller, Get, HttpStatus, Request } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from '../domain/dto/user-response.dto';

@ApiTags('Account')
@Controller('account')
export class AccountController {
  @ApiOperation({
    summary: 'Minha conta',
    description: 'Retorna os dados do usuário autenticado',
  })
  @ApiResponse({ status: HttpStatus.OK, type: UserDto })
  @Get('/me')
  me(@Request() req) {
    return req.user as UserDto;
  }
}
