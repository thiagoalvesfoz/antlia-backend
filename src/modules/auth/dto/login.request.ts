import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'usuário de login' })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'senha de login' })
  password: string;
}
