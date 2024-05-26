import { IsNotEmpty, Length } from 'class-validator';

export class UpdateCategoryDto {
  @IsNotEmpty()
  @Length(3, 20)
  name: string;
  image?: Express.Multer.File;
}
