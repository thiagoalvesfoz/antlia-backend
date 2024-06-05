import { IsNotEmpty, Length, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  @ApiProperty({ description: 'Senha para login' })
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  @ApiProperty({ description: 'confirmação de senha' })
  password_confirmation: string;
}
