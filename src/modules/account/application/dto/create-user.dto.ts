import {
  IsNotEmpty,
  Length,
  IsString,
  IsEmail,
  MaxLength,
} from 'class-validator';
import { Role } from '@account/domain/entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  @ApiProperty({ description: 'Nome do Usuário' })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'E-mail do Usuário' })
  email: string;

  @IsNotEmpty()
  @MaxLength(20)
  @ApiProperty({ description: 'Número de contato' })
  cell_phone: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  @ApiProperty({ description: 'ID de login único' })
  username: string;

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

  @IsNotEmpty()
  @ApiProperty({ description: 'Funções do usuário na aplicação', enum: Role })
  roles: Role[];
}
