import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class UpdateCategoryDto {
  @IsNotEmpty()
  @Length(3, 20)
  @ApiProperty({ description: 'nome da categoria' })
  name: string;

  @ApiProperty({
    description: 'Imagem Blob da categoria',
    type: 'string',
    format: 'binary',
  })
  image?: Express.Multer.File;
}
