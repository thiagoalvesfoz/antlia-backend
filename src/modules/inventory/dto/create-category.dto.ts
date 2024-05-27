import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';
export class CreateCategoryDto {
  @IsNotEmpty()
  @Length(3, 20)
  @ApiProperty({ description: 'nome da categoria' })
  name: string;

  @ApiProperty({ description: 'define se a categoria está habilitada ou não' })
  enable?: boolean;

  @ApiProperty({
    description: 'Imagem Blob da categoria',
    type: 'string',
    format: 'binary',
  })
  image?: Express.Multer.File;
}
