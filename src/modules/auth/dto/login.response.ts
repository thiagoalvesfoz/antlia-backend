import { UserDto } from '@common/dto/user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ description: 'token jwt' })
  access_token: string;

  @ApiProperty({ description: 'senha de login' })
  user: UserDto;
}
