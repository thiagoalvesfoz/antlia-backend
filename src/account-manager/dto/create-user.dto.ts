import {
  IsNotEmpty,
  Length,
  IsString,
  IsEmail,
  MaxLength,
} from 'class-validator';
import { Role } from '../entity/role.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MaxLength(20)
  cell_phone: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  password_confirmation: string;

  @IsNotEmpty()
  roles: Role[];
}
